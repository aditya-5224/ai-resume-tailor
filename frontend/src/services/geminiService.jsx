
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
    
    // Backend now returns both tailoredResume HTML and fields for PDF generation
    return {
      tailoredResume: data.tailoredResume,
      fields: data.fields // Store the structured fields for PDF generation
    };
  } catch (error) {
    console.error('Error in API call:', error);
    throw new Error('Failed to process resume: ' + error.message);
  }
};

// New function to download PDF
export const downloadResumePDF = async (fields) => {
  try {
    const response = await fetch(`${API_URL}/api/download-resume-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate PDF');
    }

    // Get the PDF as a blob
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tailored_resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF: ' + error.message);
  }
};
