import { GoogleGenAI  } from "@google/genai";

const API_KEY = 'AIzaSyB5Iknv1WiY2nd-haUfwU6jYzhBCkkpZMs';


if (!API_KEY) {
  console.error("Gemini API Key is not set. Please check your .env file.");
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

export const processResumeWithGemini = async (resumeText, jobDescription) => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Please contact support or check your application setup.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      I need you to analyze this resume and job description and tailor the resume for the job.
      
      Resume:
      ${resumeText}
      
      Job Description:
      ${jobDescription}
      
      Please provide:
      1. A tailored version of the resume
      2. An explanation of the changes made
      3. A score of how well the original resume matches the job description
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return { 
      tailoredContent: response.text(),
      originalResume: resumeText
    };
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    throw new Error('Failed to process resume with Gemini API');
  }
};
