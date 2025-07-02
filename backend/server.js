const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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

app.post('/api/tailor-resume', async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        // Validate input
        if (!resumeText || !jobDescription) {
            return res.status(400).json({ 
                error: 'Missing required fields: resumeText and jobDescription are required' 
            });
        }

        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash'
        });

        const prompt = `
You are an expert resume writer. Your task is to tailor the provided resume to match the job description while preserving the EXACT structure and format.

CRITICAL REQUIREMENTS:
1. PRESERVE ALL SECTION HEADINGS EXACTLY as they appear in the original (PERSONAL INFORMATION, CONTACT, SUMMARY, EXPERIENCE, EDUCATION, SKILLS, etc.)
2. COPY PERSONAL INFORMATION SECTION EXACTLY - name, phone, email, address, LinkedIn - NO CHANGES
3. Keep the EXACT same formatting structure, spacing, and layout
4. Use bullet points (•) for all job descriptions and achievements
5. Maintain all employment dates, company names, and education details exactly as shown
6. Only modify the content of job descriptions and skills to match the job requirements
7. Add relevant keywords from the job description naturally into job descriptions
8. Quantify achievements where possible with numbers and metrics

WHAT TO TAILOR:
- Job description bullet points to highlight relevant skills
- Skills section to emphasize job-relevant capabilities
- Summary/Objective to align with the target role
- Achievement descriptions to show relevant impact

WHAT NEVER TO CHANGE:
- Personal contact information
- Section headings and structure
- Company names and employment dates
- Education details and graduation dates
- Overall format and layout

Original Resume:
${resumeText}

Job Description:
${jobDescription}

Return the complete tailored resume with ALL sections preserved, using the exact same headings and structure as the original. Start with the person's name and contact information exactly as provided.
        `;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        res.json({ tailoredResume: response.text() });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to process the resume'
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
