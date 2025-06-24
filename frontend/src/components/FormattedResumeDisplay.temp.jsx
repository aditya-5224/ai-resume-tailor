import React from 'react';
import { PrinterIcon } from './icons/EditorIcons';

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
  const handlePrint = () => {
    window.print();
  };
  
  // Function to generate and download resume
  const handleDownload = () => {
    try {
      // Create HTML content with proper styling for document format
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Tailored Resume</title>
          <style>
            /* Base styling */
            body {
              font-family: 'Calibri', 'Arial', sans-serif;
              font-size: 11pt;
              line-height: 1.15;
              margin: 1in;
              color: #000;
            }
            
            /* Heading styles matching typical resume formatting */
            h1 {
              font-size: 18pt;
              font-weight: bold;
              text-align: center;
              margin: 0 0 10pt;
            }
            
            h2 {
              font-size: 14pt;
              font-weight: bold;
              margin: 12pt 0 6pt;
              border-bottom: 1pt solid #777;
              padding-bottom: 1pt;
            }
            
            h3 {
              font-size: 12pt;
              font-weight: bold;
              margin: 10pt 0 4pt;
            }
            
            /* Section styling */
            .section {
              margin-bottom: 12pt;
            }
            
            /* Common resume components */
            .contact-info {
              text-align: center;
              margin-bottom: 10pt;
            }
            
            .job-title {
              font-weight: bold;
            }
            
            .company-details {
              display: flex;
              justify-content: space-between;
              margin: 4pt 0;
            }
            
            .company-name {
              font-weight: bold;
            }
            
            .job-date {
              font-style: italic;
            }
            
            /* List styling */
            ul, ol {
              margin: 4pt 0 8pt;
              padding-left: 24pt;
            }
            
            li {
              margin-bottom: 2pt;
            }
            
            /* Table formatting */
            table {
              width: 100%;
              border-collapse: collapse;
            }
            
            td, th {
              padding: 4pt;
              text-align: left;
              vertical-align: top;
            }
            
            /* Skills section often formatted as tables or columns */
            .skills-list {
              column-count: 2;
              column-gap: 24pt;
            }
          </style>
        </head>
        <body>
          ${tailoredResume.tailoredContent}
        </body>
        </html>
      `;
      
      // Create a Blob from the HTML content
      const blob = new Blob([htmlContent], { type: "application/msword" });
      
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
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center mr-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center"
            >
              <PrinterIcon className="w-5 h-5 mr-2" /> Print
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tailored Resume
            </h3>
            <div className="prose dark:prose-invert max-w-none resume-preview">
              <div 
                className="formatted-resume" 
                dangerouslySetInnerHTML={{ __html: tailoredResume.tailoredContent }}
                style={{
                  fontFamily: 'Calibri, Arial, sans-serif',
                  fontSize: '11pt',
                  lineHeight: '1.15',
                  color: '#000'
                }}
              />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Original Resume
            </h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
              {tailoredResume.originalResume}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
