import React, { useState } from 'react';
import { downloadResumePDF } from '../services/geminiService';
import resumeTemplate from '../utils/resumeTemplate';
import './ResumeResults.css';

const ResumeResults = ({ originalResume, tailoredResume, resumeFields, onBackToHome }) => {
  // Reference to store original formatting for applying to tailored resume
  let originalFormattingRef = [];
  
  // Check if we have the required data
  if (!originalResume && !tailoredResume) {
    return (
      <div className="resume-results-container">
        <div className="results-header">
          <button 
            onClick={onBackToHome}
            className="back-button"
          >
            ← Back to Home
          </button>
        </div>
        <div className="resume-display-area">
          <div className="no-data-message">
            <h2>No Resume Data Found</h2>
            <p>Please go back to the home page and upload a resume first, then generate a tailored version.</p>
            <button onClick={onBackToHome} className="action-button primary">
              Go to Home Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Set default view based on available data
  const getDefaultView = () => {
    if (tailoredResume) return 'tailored';
    if (originalResume) return 'original';
    return 'tailored';
  };
  
  const [activeView, setActiveView] = useState(getDefaultView());

  // Function to clean and format resume content
  const cleanResumeContent = (content) => {
    if (!content) return '';
    
    // Remove asterisks and clean up the content
    let cleaned = content
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove asterisks
      .replace(/^\s*[\*\-\+]\s*/gm, '• ') // Convert markdown lists to bullet points
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
      .trim();
    
    return cleaned;
  };

  // Enhanced function to analyze and preserve original formatting
  const analyzeOriginalFormatting = (content) => {
    if (!content) return [];
    
    const lines = content.split('\n');
    const formattedLines = [];
    
    lines.forEach((line, index) => {
      const originalLine = line;
      const trimmedLine = line.trim();
      
      // Calculate positioning metrics
      const leadingSpaces = (line.match(/^\s*/) || [''])[0];
      const trailingSpaces = (line.match(/\s*$/) || [''])[0];
      const leadingSpaceCount = leadingSpaces.length;
      
      // Analyze line characteristics
      const isEmpty = line.length === 0 || trimmedLine.length === 0;
      const isAllCaps = trimmedLine === trimmedLine.toUpperCase() && /[A-Z]/.test(trimmedLine);
      const isLikelyName = index < 3 && !trimmedLine.includes('@') && !trimmedLine.includes('|') && 
                          trimmedLine.split(' ').length <= 4 && !/^(SUMMARY|OBJECTIVE|EXPERIENCE)/i.test(trimmedLine);
      const isLikelySection = isAllCaps && trimmedLine.length > 2 && trimmedLine.length < 50 &&
                             (/^(SUMMARY|OBJECTIVE|EXPERIENCE|EDUCATION|SKILLS|CONTACT|PROJECTS|CERTIFICATIONS|PROFESSIONAL|WORK|TECHNICAL)/i.test(trimmedLine) ||
                              (trimmedLine.length > 5 && !trimmedLine.includes(' ') === false));
      const isContactInfo = /@/.test(trimmedLine) || /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(trimmedLine) ||
                           /linkedin|github|portfolio/i.test(trimmedLine);
      const isBulletPoint = /^\s*[•\-\*\+]\s/.test(originalLine);
      const hasUnderline = false; // Will be detected from context
      
      // Determine alignment
      let alignment = 'left';
      if (leadingSpaceCount > 10 && trailingSpaces.length > 5) {
        alignment = 'center';
      } else if (leadingSpaceCount > 20 && trailingSpaces.length < 3) {
        alignment = 'right';
      }
      
      // Determine font characteristics
      let fontSize = '11pt';
      let fontWeight = 'normal';
      let textDecoration = 'none';
      let fontFamily = 'Calibri, Arial, sans-serif';
      
      if (isLikelyName) {
        fontSize = '16pt';
        fontWeight = 'bold';
        alignment = 'center';
      } else if (isLikelySection) {
        fontSize = '12pt';
        fontWeight = 'bold';
        textDecoration = 'underline'; // Most section headers are underlined
      } else if (isContactInfo) {
        alignment = 'center';
      }
      
      formattedLines.push({
        originalLine,
        trimmedLine,
        isEmpty,
        leadingSpaceCount,
        alignment,
        fontSize,
        fontWeight,
        textDecoration,
        fontFamily,
        isSection: isLikelySection,
        isName: isLikelyName,
        isContact: isContactInfo,
        isBullet: isBulletPoint,
        lineIndex: index
      });
    });
    
    return formattedLines;
  };


  // (Removed misplaced code block here)

  // Function to convert formatted lines to Word-compatible HTML with exact formatting
  const convertFormattedLinesToWordHTML = (formattedLines) => {
    if (!formattedLines.length) return '';

    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Resume</title>
    <style>
        @page {
            margin: 1in;
            size: 8.5in 11in;
        }
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.15;
            margin: 0;
            padding: 0;
            color: #000000;
            background: white;
        }
        .resume-line {
            margin: 0;
            padding: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .empty-line {
            min-height: 1em;
        }
        .section-header {
            font-weight: bold;
            text-decoration: underline;
            margin-top: 12pt;
            margin-bottom: 6pt;
        }
        .name-header {
            font-weight: bold;
            font-size: 16pt;
            text-align: center;
            margin-bottom: 3pt;
        }
        .contact-info {
            text-align: center;
            font-size: 11pt;
        }
        .bullet-point {
            margin-left: 18pt;
            text-indent: -18pt;
        }
    </style>
</head>
<body>
`;

    formattedLines.forEach((lineData, index) => {
      if (lineData.isEmpty) {
        htmlContent += '<div class="resume-line empty-line">&nbsp;</div>\n';
        return;
      }
      
      let className = 'resume-line';
      if (lineData.isSection) className += ' section-header';
      if (lineData.isName) className += ' name-header';
      if (lineData.isContact) className += ' contact-info';
      if (lineData.isBullet) className += ' bullet-point';
      
      const styles = [
        `text-align: ${lineData.alignment}`,
        `font-size: ${lineData.fontSize}`,
        `font-weight: ${lineData.fontWeight}`,
        `text-decoration: ${lineData.textDecoration}`,
        `font-family: ${lineData.fontFamily}`,
        `margin-left: ${lineData.leadingSpaceCount * 6}pt`,
        `line-height: ${lineData.isSection || lineData.isName ? '1.2' : '1.15'}`,
        `margin-top: ${lineData.isSection ? '12pt' : lineData.isName ? '0' : '0'}`,
        `margin-bottom: ${lineData.isSection ? '6pt' : lineData.isName ? '3pt' : '0'}`
      ].join('; ');
      
      const escapedContent = lineData.trimmedLine
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
      
      htmlContent += `<div class="${className}" style="${styles}">${escapedContent}</div>\n`;
    });

    htmlContent += `
</body>
</html>
`;

    return htmlContent;
  };

  // Function to convert plain text to Word-compatible HTML with precise formatting preservation
  const convertToWordHTML = (content) => {
    if (!content) return '';

    const lines = content.split('\n');
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Resume</title>
    <style>
        @page {
            margin: 1in;
            size: 8.5in 11in;
        }
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.08;
            margin: 0;
            padding: 0;
            color: #000000;
            background: white;
        }
        .resume-line {
            margin: 0;
            padding: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 11pt;
            line-height: 1.08;
        }
        .exact-spacing {
            font-family: 'Courier New', monospace;
            white-space: pre;
            margin: 0;
            padding: 0;
        }
        /* Preserve exact character positioning */
        .char-preserve {
            display: inline-block;
            width: 1ch;
        }
        /* Line spacing variations */
        .single-space { line-height: 1.0; margin: 0; }
        .normal-space { line-height: 1.08; margin: 0; }
        .double-space { line-height: 2.0; margin: 0; }
        
        /* Text alignment classes */
        .align-left { text-align: left; }
        .align-center { text-align: center; }
        .align-right { text-align: right; }
        .align-justify { text-align: justify; }
        
        /* Font weight and style preservation */
        .bold { font-weight: bold; }
        .italic { font-style: italic; }
        .underline { text-decoration: underline; }
        .normal-weight { font-weight: normal; }
        
        /* Indentation levels - precise positioning */
        .indent-0 { margin-left: 0pt; }
        .indent-1 { margin-left: 36pt; }  /* 0.5 inch */
        .indent-2 { margin-left: 72pt; }  /* 1 inch */
        .indent-3 { margin-left: 108pt; } /* 1.5 inch */
        .indent-4 { margin-left: 144pt; } /* 2 inch */
        
        /* Bullet point formatting with exact positioning */
        .bullet-exact {
            margin-left: 0.5in;
            text-indent: -0.25in;
            padding-left: 0;
        }
        
        /* Header formatting */
        .name-exact {
            font-size: 16pt;
            font-weight: bold;
            margin: 0;
            padding: 0;
        }
        
        .section-exact {
            font-size: 12pt;
            font-weight: bold;
            margin: 12pt 0 6pt 0;
            padding: 0;
        }
        
        .contact-exact {
            font-size: 11pt;
            margin: 3pt 0;
            padding: 0;
        }
        
        /* Preserve tabs and multiple spaces */
        .tab-space { display: inline-block; width: 4ch; }
        .space-2 { display: inline-block; width: 2ch; }
        .space-4 { display: inline-block; width: 4ch; }
        .space-8 { display: inline-block; width: 8ch; }
    </style>
</head>
<body>
`;

    lines.forEach((line, index) => {
      const originalLine = line;
      const trimmedLine = line.trim();
      
      // Calculate exact positioning metrics
      const leadingSpaces = (line.match(/^\s*/) || [''])[0];
      const trailingSpaces = (line.match(/\s*$/) || [''])[0];
      const leadingSpaceCount = leadingSpaces.length;
      const totalLineLength = line.length;
      const contentLength = trimmedLine.length;
      
      // Handle completely empty lines
      if (line.length === 0) {
        htmlContent += '<div class="resume-line">&nbsp;</div>\n';
        return;
      }
      
      // Handle lines with only whitespace
      if (trimmedLine.length === 0) {
        htmlContent += '<div class="resume-line">&nbsp;</div>\n';
        return;
      }
      
      // Determine alignment based on spacing analysis
      let alignment = 'align-left';
      let indentClass = 'indent-0';
      let fontWeight = 'normal-weight';
      let fontSize = '11pt';
      let lineClass = 'normal-space';
      
      // Analyze positioning for alignment detection
      if (leadingSpaceCount > 0) {
        const spaceRatio = leadingSpaceCount / (totalLineLength - trailingSpaces.length);
        
        // Center alignment detection (roughly equal spaces on both sides)
        if (leadingSpaceCount > 10 && trailingSpaces.length > 5) {
          alignment = 'align-center';
        }
        // Right alignment detection (many leading spaces, few trailing)
        else if (leadingSpaceCount > 20 && trailingSpaces.length < 3) {
          alignment = 'align-right';
        }
        // Indentation levels
        else if (leadingSpaceCount >= 1 && leadingSpaceCount <= 4) {
          indentClass = 'indent-1';
        } else if (leadingSpaceCount >= 5 && leadingSpaceCount <= 8) {
          indentClass = 'indent-2';
        } else if (leadingSpaceCount >= 9 && leadingSpaceCount <= 12) {
          indentClass = 'indent-3';
        } else if (leadingSpaceCount > 12) {
          indentClass = 'indent-4';
        }
      }
      
      // Content analysis for formatting
      const isAllCaps = trimmedLine === trimmedLine.toUpperCase() && /[A-Z]/.test(trimmedLine);
      const isLikelyName = index < 3 && !trimmedLine.includes('@') && !trimmedLine.includes('|') && 
                          trimmedLine.split(' ').length <= 4 && !/^(SUMMARY|OBJECTIVE|EXPERIENCE)/i.test(trimmedLine);
      const isLikelySection = isAllCaps && trimmedLine.length > 2 && trimmedLine.length < 50 &&
                             /^(SUMMARY|OBJECTIVE|EXPERIENCE|EDUCATION|SKILLS|CONTACT|PROJECTS|CERTIFICATIONS)/i.test(trimmedLine);
      const isContactInfo = /@/.test(trimmedLine) || /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(trimmedLine) ||
                           /linkedin|github|portfolio/i.test(trimmedLine);
      const isBulletPoint = /^\s*[•\-\*\+]\s/.test(originalLine);
      const isJobTitle = !isBulletPoint && index < lines.length - 1 && 
                        (lines[index + 1].includes('|') || /company|corp|inc/i.test(lines[index + 1] || ''));
      
      // Apply specific formatting based on content type
      if (isLikelyName) {
        fontSize = '16pt';
        fontWeight = 'bold';
        alignment = 'align-center';
        lineClass = 'single-space';
      } else if (isLikelySection) {
        fontSize = '12pt';
        fontWeight = 'bold';
        lineClass = 'normal-space';
      } else if (isContactInfo) {
        alignment = 'align-center';
        lineClass = 'single-space';
      } else if (isJobTitle) {
        fontWeight = 'bold';
        fontSize = '12pt';
      }
      
      // Process the line content while preserving exact spacing
      let processedContent = trimmedLine;
      
      // Handle bullet points with exact positioning
      if (isBulletPoint) {
        const bulletMatch = originalLine.match(/^(\s*)([•\-\*\+])\s*(.*)/);
        if (bulletMatch) {
          const [, indent, bullet, content] = bulletMatch;
          const indentPx = indent.length * 8; // 8pt per space
          processedContent = `• ${content}`;
          htmlContent += `<div class="resume-line bullet-exact ${lineClass}" style="margin-left: ${indentPx}pt; text-indent: -18pt;">${processedContent}</div>\n`;
          return;
        }
      }
      
      // Handle tabs and multiple spaces within content
      if (originalLine.includes('\t')) {
        processedContent = originalLine.replace(/\t/g, '<span class="tab-space"></span>');
      }
      
      // Preserve multiple consecutive spaces
      processedContent = processedContent.replace(/  /g, '<span class="space-2"></span>');
      processedContent = processedContent.replace(/    /g, '<span class="space-4"></span>');
      processedContent = processedContent.replace(/        /g, '<span class="space-8"></span>');
      
      // Calculate exact left margin based on leading spaces
      const exactMargin = leadingSpaceCount * 6; // 6pt per space character
      
      // Build the final HTML with exact positioning
      const styleAttr = `style="margin-left: ${exactMargin}pt; font-size: ${fontSize}; line-height: 1.08; margin-top: 0; margin-bottom: 0;"`;
      
      htmlContent += `<div class="resume-line ${alignment} ${fontWeight} ${lineClass}" ${styleAttr}>${processedContent}</div>\n`;
    });

    htmlContent += `
</body>
</html>
`;

    return htmlContent;
  };

  // Function to print resume
  const printResume = () => {
    window.print();
  };

  // Component to render a single formatted line
  const FormattedLine = ({ lineData }) => {
    if (lineData.isEmpty) {
      return <div className="resume-line empty-line">&nbsp;</div>;
    }
    
    const styles = {
      textAlign: lineData.alignment,
      fontSize: lineData.fontSize,
      fontWeight: lineData.fontWeight,
      textDecoration: lineData.textDecoration,
      fontFamily: lineData.fontFamily,
      marginLeft: `${lineData.leadingSpaceCount * 6}pt`,
      lineHeight: lineData.isSection || lineData.isName ? '1.2' : '1.15',
      marginTop: lineData.isSection ? '12pt' : lineData.isName ? '0' : '0',
      marginBottom: lineData.isSection ? '6pt' : lineData.isName ? '3pt' : '0'
    };
    
    let className = 'resume-line';
    if (lineData.isSection) className += ' section-header';
    if (lineData.isName) className += ' name-header';
    if (lineData.isContact) className += ' contact-info';
    if (lineData.isBullet) className += ' bullet-point';
    
    return (
      <div className={className} style={styles}>
        {lineData.trimmedLine}
      </div>
    );
  };

  // Component to render the entire formatted resume
  const FormattedResume = ({ formattedLines, className }) => (
    <div className={`resume-document-formatted ${className}`}>
      {formattedLines.map((lineData, index) => (
        <FormattedLine key={index} lineData={lineData} />
      ))}
    </div>
  );

  return (
    <div className="resume-results-container">
      <div className="results-header">
        <button 
          onClick={onBackToHome}
          className="back-button"
        >
          ← Back to Home
        </button>
        
        <div className="view-switcher">
          {tailoredResume && (
            <button
              className={`switch-button ${activeView === 'tailored' ? 'active' : ''}`}
              onClick={() => setActiveView('tailored')}
            >
              Tailored Resume
            </button>
          )}
          {originalResume && (
            <button
              className={`switch-button ${activeView === 'original' ? 'active' : ''}`}
              onClick={() => setActiveView('original')}
            >
              Original Resume
            </button>
          )}
        </div>
      </div>

      <div className="resume-display-area">
        {activeView === 'tailored' ? (
          <iframe
            title="Tailored Resume Preview"
            srcDoc={tailoredResume}
            style={{ width: '100%', minHeight: '900px', border: 'none', background: 'white', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
          />
        ) : (
          originalResume ? (
            <pre style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '12px', fontSize: '1rem', color: '#222', whiteSpace: 'pre-wrap', boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
              {originalResume}
            </pre>
          ) : (
            <div className="no-content-message">
              <p>No original resume available. Please go back and upload one first.</p>
            </div>
          )
        )}
        <div className="resume-actions">
          <button 
            className="action-button primary"
            onClick={async () => {
              // Download tailored resume as PDF
              if (activeView === 'tailored' && resumeFields) {
                try {
                  await downloadResumePDF(resumeFields);
                } catch (error) {
                  console.error('Failed to download PDF:', error);
                  alert('Failed to download PDF. Please try again.');
                }
              } else if (activeView === 'original' && originalResume) {
                // For original resume, still download as text file
                const blob = new Blob([originalResume], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'original_resume.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              } else {
                alert('Resume data not available for download. Please try generating a new resume.');
              }
            }}
          >
            Download {activeView === 'tailored' ? 'PDF Resume' : 'Original Resume'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeResults;
