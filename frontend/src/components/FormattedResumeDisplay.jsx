import React from 'react';
import './FormattedResumeDisplay.css';

const SectionTitle = ({ title }) => (
  <h2 className="text-xl sm:text-2xl font-semibold text-primary-700 dark:text-primary-300 mt-6 mb-3 border-b-2 border-primary-500 dark:border-primary-400 pb-1 print:text-lg print:mt-4 print:mb-2 print:border-black">
    {title}
  </h2>
);

const ContactDetail = ({ label, value, href, className }) => {
  if (!value) return null;
  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary-600 dark:text-primary-400 print:text-blue-600">
      {value}
    </a>
  ) : value;
  return (
    <span className={`text-sm sm:text-base print:text-xs ${className || ''}`}>
      {label && <span className="font-semibold">{label}: </span>}
      {content}
    </span>
  );
};

export function FormattedResumeDisplay({ tailoredResume }) {
  // Log the tailoredResume value for debugging
  console.log('tailoredResume in FormattedResumeDisplay:', tailoredResume);
  
  // Function to format resume content for download with enhanced formatting
  const formatResumeContent = (content) => {
    if (!content) return '';
    
    // Preserve empty lines and indentation from the original resume
    const lines = content.split('\n');
    
    // Try to identify sections and format them appropriately
    // This logic enhances formatting based on common resume patterns
    let formattedContent = '';
    let inList = false;
    let inExperienceSection = false;
    let inEducationSection = false;
    let inSkillsSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
      
      // Identify major resume sections
      const isExperienceSection = /^(EXPERIENCE|WORK EXPERIENCE|PROFESSIONAL EXPERIENCE|EMPLOYMENT HISTORY|WORK HISTORY)/i.test(trimmedLine);
      const isEducationSection = /^(EDUCATION|ACADEMIC BACKGROUND|EDUCATIONAL BACKGROUND)/i.test(trimmedLine);
      const isSkillsSection = /^(SKILLS|TECHNICAL SKILLS|KEY SKILLS|EXPERTISE|COMPETENCIES|QUALIFICATIONS)/i.test(trimmedLine);
      
      // Update section tracking
      if (isExperienceSection) inExperienceSection = true;
      if (isEducationSection) {
        inExperienceSection = false;
        inEducationSection = true;
      }
      if (isSkillsSection) {
        inExperienceSection = false;
        inEducationSection = false;
        inSkillsSection = true;
      }
      
      // Check if this line could be a section heading (all caps or ending with a colon)
      if ((trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3) || 
          isExperienceSection || isEducationSection || isSkillsSection) {
        // End any open list
        if (inList) {
          formattedContent += '</ul>\n';
          inList = false;
        }
        
        // Format as a section heading
        formattedContent += `<h2 style="font-size:14pt;font-weight:bold;margin:12pt 0 6pt;border-bottom:1pt solid #555;padding-bottom:2pt;">${trimmedLine}</h2>\n`;
      } 
      // Handle job title and company name in experience sections (often bold text followed by dates)
      else if (inExperienceSection && trimmedLine && !trimmedLine.startsWith('•') && !trimmedLine.startsWith('-') && 
               !trimmedLine.startsWith('*') && nextLine && /\d{4}/.test(nextLine)) {
        formattedContent += `<div class="job-title text-bold">${trimmedLine}</div>\n`;
      } 
      // Handle company and date line in experience sections
      else if (inExperienceSection && trimmedLine && /\d{4}/.test(trimmedLine)) {
        formattedContent += `<div class="company-details"><span class="company-name">${trimmedLine.split(',')[0]}</span>`;
        
        // Extract dates if present (common format: Company Name, Location | Date - Date)
        if (trimmedLine.includes('|')) {
          const datePart = trimmedLine.split('|')[1].trim();
          formattedContent += `<span class="job-date">${datePart}</span>`;
        }
        formattedContent += '</div>\n';
      }
      // Check if this is a likely bullet point
      else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        // Start a list if we're not in one
        if (!inList) {
          formattedContent += '<ul style="margin:4pt 0 8pt;padding-left:24pt;">\n';
          inList = true;
        }
        // Add the bullet point - preserve any formatting like bold or italics that might be in HTML
        formattedContent += `<li style="margin-bottom:2pt;">${trimmedLine.substring(1).trim()}</li>\n`;
      } 
      // Check if this is the end of a list
      else if (inList && (trimmedLine === '' || (i < lines.length - 1 && lines[i+1].trim() !== '' && 
                !lines[i+1].trim().startsWith('•') && !lines[i+1].trim().startsWith('-') && !lines[i+1].trim().startsWith('*')))) {
        formattedContent += '</ul>\n';
        inList = false;
        
        if (trimmedLine !== '') {
          formattedContent += `<p>${line}</p>\n`;
        } else {
          formattedContent += '<br/>\n';
        }
      }
      // Skills section often has special formatting
      else if (inSkillsSection && trimmedLine) {
        // Skills are often separated by commas or in multiple lines
        if (trimmedLine.includes(',')) {
          const skills = trimmedLine.split(',').map(s => s.trim()).filter(s => s);
          if (skills.length > 0) {
            formattedContent += '<div class="skills-list">\n';
            skills.forEach(skill => {
              formattedContent += `<div class="skill-item">${skill}</div>\n`;
            });
            formattedContent += '</div>\n';
          }
        } else {
          formattedContent += `<div class="skill-item">${trimmedLine}</div>\n`;
        }
      }
      // Education entries often have a specific format
      else if (inEducationSection && trimmedLine) {
        if (/degree|bachelor|master|phd|diploma|certificate/i.test(trimmedLine)) {
          formattedContent += `<div class="education-entry">\n`;
          formattedContent += `<div class="degree">${trimmedLine}</div>\n`;
        } else if (/university|college|school|institute/i.test(trimmedLine)) {
          formattedContent += `<div class="school-name">${trimmedLine}</div>\n</div>\n`;
        } else {
          formattedContent += `<div>${trimmedLine}</div>\n`;
        }
      }
      // Regular content line - wrap in paragraph for proper formatting
      else if (trimmedLine) {
        formattedContent += `<p>${line}</p>\n`;
      } else {
        // Empty line, add spacing
        formattedContent += '<br/>\n';
      }
    }
    
    // Close any open list
    if (inList) {
      formattedContent += '</ul>\n';
    }
    
    return formattedContent;
  };const handleDownload = () => {
    try {
      console.log('Download function triggered with tailoredResume:', tailoredResume);
      
      // Create HTML content with proper styling for document format - enhanced to match original resume formatting better
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Tailored Resume</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">          <style>
            /* Enhanced styling to match original document formatting */
            @page {
              size: 8.5in 11in;
              margin: 0.5in 0.75in;
            }
            
            body {
              font-family: 'Calibri', 'Arial', sans-serif;
              font-size: 11pt;
              line-height: 1.15;
              margin: 0;
              padding: 0;
              color: #000;
              width: 8.5in;
              box-sizing: border-box;
            }
            
            .resume-content {
              font-family: 'Calibri', 'Arial', sans-serif;
              font-size: 11pt;
              line-height: 1.15;
              margin: 0;
              padding: 0;
              word-wrap: break-word;
              background-color: transparent;
            }
            
            /* Preserve whitespace formatting as in original resume */
            .resume-body {
              white-space: pre-wrap;
              word-wrap: break-word;
              margin-top: 10pt;
            }
            
            /* Section headings similar to typical resume formats */
            h1 {
              font-size: 18pt;
              font-weight: bold;
              text-align: center;
              margin: 0 0 8pt;
              color: #000;
            }
            
            h2 {
              font-size: 14pt;
              font-weight: bold;
              margin: 12pt 0 6pt;
              border-bottom: 1pt solid #555;
              padding-bottom: 2pt;
              color: #000;
            }
            
            h3 {
              font-size: 12pt;
              font-weight: bold;
              margin: 10pt 0 4pt;
              color: #000;
            }
            
            /* Paragraphs with proper spacing */
            p {
              margin: 0 0 4pt;
              padding: 0;
            }
            
            /* Section styling */
            .section {
              margin-bottom: 12pt;
            }
            
            /* Contact information typically at the top of resumes */
            .contact-info {
              text-align: center;
              margin: 4pt 0 10pt;
              font-size: 10pt;
              line-height: 1.2;
            }
            
            /* Resume experience entries */
            .experience-entry {
              margin-bottom: 8pt;
            }
            
            /* Job title and company styling */
            .job-title {
              font-weight: bold;
            }
            
            .company-details {
              display: flex;
              justify-content: space-between;
              margin: 2pt 0;
            }
            
            .company-name {
              font-weight: bold;
            }
            
            .job-date {
              font-style: italic;
            }
            
            /* Lists for job descriptions and skills */
            ul, ol {
              margin: 4pt 0 8pt;
              padding-left: 24pt;
            }
            
            li {
              margin-bottom: 2pt;
              padding-left: 4pt;
            }
            
            /* Table formatting for skills sections */
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 8pt 0;
            }
            
            td, th {
              padding: 4pt;
              text-align: left;
              vertical-align: top;
              border: none;
            }
            
            /* Skills formatting - often in columns */
            .skills-list {
              column-count: 2;
              column-gap: 24pt;
            }
            
            /* Common text alignment and formatting classes */
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-bold { font-weight: bold; }
            .text-italic { font-style: italic; }
            
            /* Additional resume-specific formatting */
            .education-entry { margin-bottom: 6pt; }
            .school-name { font-weight: bold; }
            .degree { font-style: italic; }
            .date-range { float: right; font-style: italic; }
            
            /* Ensure spacing consistency */
            .spacing-1 { margin-top: 4pt; }
            .spacing-2 { margin-top: 8pt; }
            .spacing-3 { margin-top: 12pt; }
          </style>
        </head>
        <body>
          <div class="resume-content">${formatResumeContent(tailoredResume.tailoredContent)}</div>
        </body>
        </html>
      `;
        // Extract the original resume structure to help with formatting
      // We'll try to identify name, contact details, etc. from the original resume
      const enhanceFormatting = () => {
        try {
          const originalLines = tailoredResume.originalResume?.split('\n') || [];
          // First non-empty line is often the name
          const name = originalLines.find(line => line.trim() !== '');
          // Add name as a heading if found
          if (name) {
            return `<h1 style="font-size:18pt;font-weight:bold;text-align:center;margin:0 0 10pt;">${name}</h1>\n` + 
                   '<div class="resume-body">';
          }
          return '<div class="resume-body">';
        } catch (e) {
          console.log('Error enhancing format:', e);
          return '<div class="resume-body">';
        }
      };
      
      // Prepare enhanced HTML with better formatting based on original document patterns
      const enhancedHtml = htmlContent.replace('<div class="resume-content">', 
        `<div class="resume-content">${enhanceFormatting()}`).replace('</div></body>', '</div></div></body>');
        
      // Create a Blob from the HTML content
      const blob = new Blob([enhancedHtml], { type: "application/msword" });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a download link and click it
      const a = document.createElement("a");
      a.href = url;
      a.download = "tailored-resume.doc"; // Using .doc instead of .docx for better compatibility
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      console.log('Resume download initiated');
    } catch (error) {
      console.error("Error generating document file:", error);
      alert("There was an error creating your document file. Please try again or use the print option instead.");
    }
  };
    
  if (!tailoredResume || !tailoredResume.tailoredContent) {
    return (
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-colors duration-300 p-6">
        <p className="text-gray-600 dark:text-gray-300">No tailored resume content available yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-colors duration-300">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tailored Resume</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We've optimized your resume for the job description. Review the changes below.
            </p>
          </div>
          <div className="flex">
            <button
              onClick={handleDownload}
              className="download-button"
            >
              <svg className="download-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tailored Resume
            </h3>            <div className="prose dark:prose-invert max-w-none resume-preview">              {tailoredResume.tailoredContent ? (                <div 
                  className="formatted-resume dark:text-white" 
                  style={{
                    fontFamily: 'Calibri, Arial, sans-serif',
                    fontSize: '11pt',
                    lineHeight: '1.15',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {tailoredResume.tailoredContent}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No content available.</p>
              )}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Original Resume
            </h3>            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-white">
              {tailoredResume.originalResume}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
