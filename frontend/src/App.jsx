import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ResumeInputForm } from './components/ResumeInputForm';
import { FormattedResumeDisplay } from './components/FormattedResumeDisplay';
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
  handleFileUpload
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
        {tailoredResume && (
          <FormattedResumeDisplay tailoredResume={tailoredResume} />
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tailoredResume, setTailoredResume] = useState(null);
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
      setError({ message: 'Resume content is missing. Please upload a resume.' });
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
    setAppState(AppState.Generating);    try {
      const result = await processResumeWithGemini(resumeText, jobDescription);
      console.log('API response result:', result);
      setTailoredResume(result);
      setAppState(AppState.Success);
    } catch (err) {
      console.error('Error tailoring resume:', err);
      setError({ message: `Failed to tailor resume: ${err.message}. Ensure the API key is correct and the AI model is responding as expected.` });
      setAppState(AppState.Error);
    } finally {
      setIsLoading(false);
    }
  }, [resumeText, jobDescription]);
  return (
    <Router>
      <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}
           style={{ 
             minHeight: '100vh',
             display: 'flex',
             flexDirection: 'column'
           }}>
        {/* Background Pattern */}
        <div className="fixed inset-0 z-0 pattern-background" />

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
                />
              } 
            />
          </Routes>
        </div>
        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}

