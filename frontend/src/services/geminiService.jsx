
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const processResumeWithGemini = async (resumeText, jobDescription) => {
  try {
    const response = await fetch(`${API_URL}/api/tailor-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process resume');
    }

    const data = await response.json();
    let tailoredContent = data.tailoredResume || data.content || data;
    
    // Clean up the response to remove any unwanted explanations or formatting
    if (typeof tailoredContent === 'string') {
      // Remove any markdown-style headers or explanations
      tailoredContent = tailoredContent
        .replace(/^(TAILORED RESUME:|RESUME:|Here's the tailored resume:)/gmi, '')
        .replace(/^(CHANGES EXPLAINED:|EXPLANATION:|Changes made:)[\s\S]*$/gmi, '')
        .replace(/^(MATCH SCORE:|Score:)[\s\S]*$/gmi, '')
        .replace(/^(Okay, I understand\.|Here's|This is)[\s\S]*?(?=\n[A-Z])/gmi, '')
        .replace(/^\*\*.*?\*\*$/gm, '') // Remove bold headers like **TAILORED RESUME**
        .replace(/^#+\s.*$/gm, '') // Remove markdown headers
        .trim();
      
      // If the content starts with explanatory text, try to find the actual resume
      const resumeStartPatterns = [
        /^[A-Z][a-z]+ [A-Z][a-z]+\s*$/m, // Name pattern
        /^[A-Z][A-Z\s]+$/m, // ALL CAPS sections
        /^(PERSONAL INFORMATION|CONTACT|SUMMARY|OBJECTIVE|EXPERIENCE|EDUCATION|SKILLS)/im
      ];
      
      for (const pattern of resumeStartPatterns) {
        const match = tailoredContent.match(pattern);
        if (match) {
          const startIndex = tailoredContent.indexOf(match[0]);
          if (startIndex > 100) { // If there's a lot of text before the resume starts
            tailoredContent = tailoredContent.substring(startIndex);
            break;
          }
        }
      }
      
      // Ensure we have the personal information section if it's missing
      if (!tailoredContent.includes('PERSONAL INFORMATION') && !tailoredContent.includes('CONTACT')) {
        // Try to extract personal info from original resume and prepend it
        const originalLines = resumeText.split('\n');
        let personalInfoSection = '';
        let foundPersonalInfo = false;
        
        for (let i = 0; i < Math.min(10, originalLines.length); i++) {
          const line = originalLines[i].trim();
          if (line.includes('PERSONAL INFORMATION') || line.includes('CONTACT')) {
            foundPersonalInfo = true;
            personalInfoSection += line + '\n';
          } else if (foundPersonalInfo && line && !line.match(/^[A-Z\s]+$/)) {
            personalInfoSection += line + '\n';
          } else if (foundPersonalInfo && line.match(/^[A-Z\s]+$/)) {
            break; // Next section found
          } else if (!foundPersonalInfo && line && !line.match(/^[A-Z\s]+$/)) {
            // This might be name or contact info
            personalInfoSection += line + '\n';
          }
        }
        
        if (personalInfoSection) {
          tailoredContent = personalInfoSection + '\n' + tailoredContent;
        }
      }
    }
    
    return tailoredContent;
  } catch (error) {
    console.error('Error in API call:', error);
    throw new Error('Failed to process resume: ' + error.message);
  }
};
