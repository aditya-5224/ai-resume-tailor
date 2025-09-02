
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const resumeTemplate = require('./resumeTemplate');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Validate environment variables
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Gemini API with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health check endpoint for Docker
app.get('/api/test', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'ai-resume-tailor-backend'
    });
});

// PDF download endpoint
app.post('/api/download-resume-pdf', async (req, res) => {
    try {
        const { fields } = req.body; // fields should be the filled template fields
        if (!fields) {
            return res.status(400).json({ error: 'Missing resume fields' });
        }
        
        // Helper to sanitize and ensure valid HTML for each section
        function sanitizeSection(html, fallbackContent) {
            if (!html) return fallbackContent || '<div>No information available.</div>';
            return html.trim();
        }
        
        // Helper function to add numbering to sections
        function addNumberingToSection(html, sectionName) {
            if (!html) return '';
            
            // Split by entry divs and add numbering
            const entries = html.split('<div class="entry">');
            if (entries.length <= 1) return html; // No entries to number
            
            let numberedHtml = entries[0]; // Keep any initial content
            
            for (let i = 1; i < entries.length; i++) {
                // Find the first bold element and add the number inline
                let entryContent = entries[i];
                if (entryContent.includes('<div class="bold">')) {
                    entryContent = entryContent.replace(
                        '<div class="bold">',
                        `<div class="bold">${i}. `
                    );
                } else {
                    // If no bold element, add number at the beginning
                    entryContent = `${i}. ` + entryContent;
                }
                numberedHtml += `<div class="entry">` + entryContent;
            }
            
            return numberedHtml;
        }
        
        // Fill the template with numbered sections
        let html = resumeTemplate
            .replace(/{{NAME}}/g, fields.NAME || '')
            .replace(/{{DESIGNATION}}/g, fields.DESIGNATION || '')
            .replace(/{{PHONE}}/g, fields.PHONE || '')
            .replace(/{{LOCATION}}/g, fields.LOCATION || '')
            .replace(/{{EMAIL}}/g, fields.EMAIL || '')
            .replace(/{{LINKEDIN}}/g, fields.LINKEDIN || '')
            .replace(/{{WEBSITE}}/g, fields.WEBSITE || '')
            .replace(/{{OBJECTIVE}}/g, fields.OBJECTIVE || '')
            .replace(/{{EDUCATION}}/g, addNumberingToSection(sanitizeSection(fields.EDUCATION, '<div class="entry"><div>No education information available.</div></div>'), 'education'))
            .replace(/{{SKILLS}}/g, sanitizeSection(fields.SKILLS, '<div>No skills information available.</div>'))
            .replace(/{{EXPERIENCE}}/g, addNumberingToSection(sanitizeSection(fields.EXPERIENCE, '<div class="entry"><div>No experience information available.</div></div>'), 'experience'))
            .replace(/{{PROJECTS}}/g, sanitizeSection(fields.PROJECTS, '<div class="project-item"><div>No projects information available.</div></div>'))
            .replace(/{{LICENCE_CERTIFICATIONS}}/g, addNumberingToSection(sanitizeSection(fields.LICENCE_CERTIFICATIONS || fields.CERTIFICATIONS, '<div class="entry"><div>No certifications available.</div></div>'), 'certifications'))
            .replace(/{{EXTRACURRICULAR}}/g, sanitizeSection(fields.EXTRACURRICULAR, '<div class="entry"><div>No extracurricular activities available.</div></div>'))
            .replace(/{{LEADERSHIP}}/g, sanitizeSection(fields.LEADERSHIP, '<div class="entry"><div>No leadership experience available.</div></div>'));

        // Generate PDF from HTML
        const options = {
            format: 'A4',
            border: {
                top: '1.5cm',
                right: '1cm',
                bottom: '1.5cm',
                left: '1cm'
            },
            printBackground: true,
            type: 'pdf',
            quality: '75'
        };
        
        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                console.error('PDF generation error:', err);
                return res.status(500).json({ error: 'PDF generation failed', details: err.message });
            }
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="tailored_resume.pdf"',
                'Content-Length': buffer.length
            });
            res.send(buffer);
        });
    } catch (error) {
        console.error('PDF endpoint error:', error);
        res.status(500).json({ error: 'Failed to generate PDF', details: error.message });
    }
});

app.post('/api/tailor-resume', async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: 'Missing required fields: resumeText and jobDescription are required' });
        }
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = 
          `{
  "instructions": "You are an expert resume writer and ATS optimization specialist. Given the following resume and job description, update the resume content according to the following rules and return output in JSON format with the exact template structure below.",
  "objectives": [
    "Dont use the company name  from JD any where in resume.
    "Replace the tech stack in the EXPERIENCE section with relevant, updated technologies and tools that match the job description closely, and add points and make it atleast 2 points whereever their are one point in experience",
    "Identify and add all missing or implied SKILLS from the job description into the SKILLS section, including frameworks, libraries, platforms, and tools.",
    "Replace the years of experience in the OBJECTIVE section based on oldest job start date using the following logic: if experience >= 12 months, show '1+ years'; if experience >= 16 months, show '1.5 years'; if experience >= 18 months, show '1.5+ years'; if experience >= 24 months, show '2+ years', and so on.",
    "Incorporate and repeat relevant ATS keywords and phrases from the job description across OBJECTIVE, SKILLS, EXPERIENCE, and PROJECTS. Ensure the terminology matches exactly what is used in the JD (e.g., RESTful APIs vs REST APIs).",
    "Maintain all content length. Do not summarize, shorten, or omit key bullet points. Expand sections as needed to cover all critical responsibilities and skills from the job description.",
    "Ensure all returned fields strictly follow the HTML-based template structure provided below (no header tags allowed).",
    "Insert <br> after each block in EXPERIENCE, EDUCATION, SKILLS, PROJECTS, and LICENCE_CERTIFICATIONS to separate entries visually.",
    "Ensure the final resume is optimized to score at least 98% or higher when evaluated using any standard ATS scoring tool against the provided job description. Do not return the resume if this score is not achieved—optimize further if needed.",
    "Ensure the skill section includes all relevant skills from the job description, even if they are not explicitly mentioned in the original resume, and for any points that are not mentioned in the resume, add them to the skills section.",
    "Ensure the final resume is optimized to score at least 98% or higher when evaluated using any standard ATS scoring tool against the provided job description. Do not return the resume if this score is not achieved—optimize further if needed.",
    
  ],
  "template": {
    "NAME": "Only the person's name as plain text.",
    "PHONE": "Only the phone number as plain text.",
    "LOCATION": "Only the location as plain text (e.g., 'City, State').",
    "EMAIL": "Only the email as plain text.",
    "LINKEDIN": "Only the LinkedIn URL as plain text.",
    "WEBSITE": "Only the website URL as plain text.",
    "OBJECTIVE": "A short summary/objective as plain text (4-5 sentences), tailored to the job description, showcasing experience, skills, job role alignment, and measurable impact. Include specific ATS keywords from the JD.",
    "EDUCATION": "HTML content WITHOUT any header tags. Use this structure and add a <br> after each entry:\n<div class=\"entry\">\n  <div class=\"bold\">Degree Name <span class=\"right\">Year</span></div>\n  <div class=\"italic\">University Name</div>\n</div><br>",
    "SKILLS": "HTML content WITHOUT any header tags. Use this structure and add a <br> after the block:\n<div class=\"tabular\">\n  <div class=\"tabular-row\">\n    <div class=\"tabular-label\">Programming:</div>\n    <div class=\"tabular-content\">Language1, Language2, Language3</div>\n  </div>\n  <div class=\"tabular-row\">\n    <div class=\"tabular-label\">Technologies:</div>\n    <div class=\"tabular-content\">Tool1, Tool2, Tool3</div>\n  </div>\n</div><br>",
    "EXPERIENCE": "HTML content WITHOUT any header tags. Use this structure and add a <br> after each entry:\n<div class=\"entry\">\n  <div class=\"bold\">Job Title <span class=\"right\">Start Date - End Date</span></div>\n  <div class=\"italic\">Company Name</div>\n  <ul>\n    <li>Achievement or responsibility 1</li>\n    <li>Achievement or responsibility 2</li>\n  </ul>\n</div><br>",
    "PROJECTS": "HTML content WITHOUT any header tags. Use this structure and add a <br> after each entry:\n<div class=\"project-item\">\n  <div class=\"bold\">Project Name </div>\n  <div>Brief description of the project and technologies used. Include relevant ATS keywords and responsibilities related to the JD.</div>\n</div><br>",
    "LICENCE_CERTIFICATIONS": "HTML content WITHOUT any header tags. Use this structure and add a <br> after each entry:\n<div class=\"entry\">\n  <div class=\"bold\">Certification Name </div>\n  <div>Description of the certification or achievement, including issuing body and date (if available).</div>\n</div><br>"
  },
};
Resume:
${resumeText}

Job Description:
${jobDescription}
`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let fields;
        const rawText = response.text();
        console.log('Raw Gemini response:', rawText);
        try {
            // Try direct JSON parse first
            fields = JSON.parse(rawText);
            console.log('Parsed fields from Gemini:', Object.keys(fields));
        } catch (e) {
            // Try to extract JSON object from the response if extra text is present
            const match = rawText.match(/\{[\s\S]*\}/);
            if (match) {
                try {
                    fields = JSON.parse(match[0]);
                    console.log('Extracted JSON fields from Gemini:', Object.keys(fields));
                } catch (err) {
                    console.error('Failed to parse extracted JSON:', match[0]);
                    return res.status(500).json({ error: 'Gemini did not return valid JSON.' });
                }
            } else {
                console.error('No JSON object found in Gemini response:', rawText);
                return res.status(500).json({ error: 'Gemini did not return valid JSON.' });
            }
        }
        
        // Helper to sanitize and ensure valid HTML for each section
        function sanitizeSection(html, fallbackContent) {
            if (!html) return fallbackContent || '<div>No information available.</div>';
            // Basic HTML cleanup
            return html.trim();
        }
        
        // Helper function to add numbering to sections
        function addNumberingToSection(html, sectionName) {
            if (!html) return '';
            
            // Split by entry divs and add numbering
            const entries = html.split('<div class="entry">');
            if (entries.length <= 1) return html; // No entries to number
            
            let numberedHtml = entries[0]; // Keep any initial content
            
            for (let i = 1; i < entries.length; i++) {
                // Find the first bold element and add the number inline
                let entryContent = entries[i];
                if (entryContent.includes('<div class="bold">')) {
                    entryContent = entryContent.replace(
                        '<div class="bold">',
                        `<div class="bold">${i}. `
                    );
                } else {
                    // If no bold element, add number at the beginning
                    entryContent = `${i}. ` + entryContent;
                }
                numberedHtml += `<div class="entry">` + entryContent;
            }
            
            return numberedHtml;
        }
        
        // Fill the template with numbering for specified sections
        let filledHtml = resumeTemplate
            .replace(/{{NAME}}/g, fields.NAME || '')
            .replace(/{{DESIGNATION}}/g, fields.DESIGNATION || '')
            .replace(/{{PHONE}}/g, fields.PHONE || '')
            .replace(/{{LOCATION}}/g, fields.LOCATION || '')
            .replace(/{{EMAIL}}/g, fields.EMAIL || '')
            .replace(/{{LINKEDIN}}/g, fields.LINKEDIN || '')
            .replace(/{{WEBSITE}}/g, fields.WEBSITE || '')
            .replace(/{{OBJECTIVE}}/g, fields.OBJECTIVE || '')
            .replace(/{{EDUCATION}}/g, addNumberingToSection(sanitizeSection(fields.EDUCATION, '<div class="entry"><div>No education information available.</div></div>'), 'education'))
            .replace(/{{SKILLS}}/g, sanitizeSection(fields.SKILLS, '<div>No skills information available.</div>'))
            .replace(/{{EXPERIENCE}}/g, addNumberingToSection(sanitizeSection(fields.EXPERIENCE, '<div class="entry"><div>No experience information available.</div></div>'), 'experience'))
            .replace(/{{PROJECTS}}/g, sanitizeSection(fields.PROJECTS, '<div class="project-item"><div>No projects information available.</div></div>'))
            .replace(/{{LICENCE_CERTIFICATIONS}}/g, addNumberingToSection(sanitizeSection(fields.LICENCE_CERTIFICATIONS || fields.CERTIFICATIONS, '<div class="entry"><div>No certifications available.</div></div>'), 'certifications'))
            .replace(/{{EXTRACURRICULAR}}/g, sanitizeSection(fields.EXTRACURRICULAR, '<div class="entry"><div>No extracurricular activities available.</div></div>'))
            .replace(/{{LEADERSHIP}}/g, sanitizeSection(fields.LEADERSHIP, '<div class="entry"><div>No leadership experience available.</div></div>'));
        
        // Return both HTML for display and the structured fields for PDF generation
        res.json({ 
            tailoredResume: filledHtml, 
            fields: fields // Include fields for PDF generation
        });
        console.log('Sent HTML template with length:', filledHtml.length);
    } catch (error) {
        console.error('Resume tailor error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


