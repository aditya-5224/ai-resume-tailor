import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ResumeInputForm } from './components/ResumeInputForm';
import { FormattedResumeDisplay } from './components/FormattedResumeDisplay';
import ResumeResults from './components/ResumeResults';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import { processResumeWithGemini } from './services/geminiService';
import Navbar from './components/navbar/navbar';
import Footer from './components/layout/Footer';
import './styles/global.css';
import './styles/layout.css';

const AppState = {
  Idle: 'IDLE',
  ProcessingFile: 'PROCESSING_FILE',
  Generating: 'GENERATING',
  Success: 'SUCCESS',
  Error: 'ERROR'
};

const MainContent = ({
  darkMode,
  resumeText,
  setResumeText,
  jobDescription,
  setJobDescription,
  tailoredResume,
  isLoading,
  error,
  appState,
  handleSubmit,
  handleFileUpload,
  navigate
}) => {
  return (
    <div className="app-content">
      <div className="content-wrapper">
        <ResumeInputForm
          resumeText={resumeText}
          setResumeText={setResumeText}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          isLoading={isLoading}
          error={error}
          appState={appState}
          handleSubmit={handleSubmit}
          handleFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

const ResultsPage = ({ 
  resumeText, 
  tailoredResume, 
  navigate 
}) => {
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <ResumeResults
      originalResume={resumeText}
      tailoredResume={tailoredResume?.tailoredResume || tailoredResume} // Handle both old and new format
      resumeFields={tailoredResume?.fields} // Pass the fields for PDF generation
      onBackToHome={handleBackToHome}
    />
  );
};

const AppContent = () => {
  const [resumeText, setResumeText] = useState(() => {
    const saved = localStorage.getItem('ai-resume-tailor-resume');
    return saved || '';
  });
  const [jobDescription, setJobDescription] = useState('');
  const [tailoredResume, setTailoredResume] = useState(() => {
    const saved = localStorage.getItem('ai-resume-tailor-tailored');
    return saved || null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appState, setAppState] = useState(AppState.Idle);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const navigate = useNavigate();

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ai-resume-tailor-resume', resumeText);
  }, [resumeText]);

  useEffect(() => {
    if (tailoredResume) {
      localStorage.setItem('ai-resume-tailor-tailored', tailoredResume);
    }
  }, [tailoredResume]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const handleFileUpload = async (file) => {
    if (!file) {
      setError({ message: 'No file selected.' });
      setAppState(AppState.Error);
      return;
    }
    if (!file.name.endsWith('.docx')) {
      setError({ message: 'Invalid file type. Please upload a .docx file.' });
      setAppState(AppState.Error);
      setResumeText('');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAppState(AppState.ProcessingFile);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer });
      setResumeText(result.value);
      setTailoredResume(null);
      setAppState(AppState.Idle);
    } catch (err) {
      console.error('Error processing DOCX file:', err);
      setError({ message: 'Failed to extract text from DOCX. The file might be corrupted or in an unsupported format.' });
      setAppState(AppState.Error);
      setResumeText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!resumeText.trim()) {
      setError({ message: 'Please upload a resume file first.' });
      setAppState(AppState.Error);
      return;
    }
    if (!jobDescription.trim()) {
      setError({ message: 'Job description is missing. Please provide one.' });
      setAppState(AppState.Error);
      return;
    }

    setIsLoading(true);
    setError(null);
    setTailoredResume(null);
    setAppState(AppState.Generating);

    try {
      const result = await processResumeWithGemini(resumeText, jobDescription);
      setTailoredResume(result);
      setAppState(AppState.Success);
      
      // Navigate to results page after successful generation
      navigate('/results');
    } catch (err) {
      console.error('Error tailoring resume:', err);
      setError({ message: `Failed to tailor resume: ${err.message}. Ensure the API key is correct and the AI model is responding as expected.` });
      setAppState(AppState.Error);
    } finally {
      setIsLoading(false);
    }
  }, [resumeText, jobDescription, navigate]);

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}
         style={{ 
           minHeight: '100vh',
           display: 'flex',
           flexDirection: 'column'
         }}>
      {/* Background Pattern */}
      <div className="pattern-background" />

      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="page-content" style={{ flex: 1, marginTop: '70px', paddingBottom: '60px' }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <MainContent
                darkMode={darkMode}
                resumeText={resumeText}
                setResumeText={setResumeText}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                tailoredResume={tailoredResume}
                isLoading={isLoading}
                error={error}
                appState={appState}
                handleSubmit={handleSubmit}
                handleFileUpload={handleFileUpload}
                navigate={navigate}
              />
            } 
          />
          <Route 
            path="/results" 
            element={
              <ResultsPage
                resumeText={resumeText}
                tailoredResume={tailoredResume}
                navigate={navigate}
              />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

