
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
    return { 
      tailoredContent: data.tailoredResume,
      originalResume: resumeText
    };
  } catch (error) {
    console.error('Error in API call:', error);
    throw new Error('Failed to process resume: ' + error.message);
  }
};
