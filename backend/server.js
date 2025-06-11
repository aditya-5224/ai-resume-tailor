const express = require('express');
const cors = require('cors');
const { GoogleGenAI  } = require('@google/genai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

app.post('/api/tailor-resume', async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `Given this resume:\n${resumeText}\n\nAnd this job description:\n${jobDescription}\n\nProvide a tailored version of the resume.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        res.json({ tailoredResume: response.text() });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process the resume' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
