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
            As an expert resume tailoring assistant, analyze the provided resume and job description to create a tailored version. 
            
            Resume:
            ${resumeText}
            
            Job Description:
            ${jobDescription}
            
            Please provide your response in the following format:
            
            TAILORED RESUME:
            [The tailored resume content]
            
            CHANGES EXPLAINED:
            [A brief explanation of the key changes made and why]
            
            MATCH SCORE:
            [A score out of 100 indicating how well the original resume matched the job requirements]
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
