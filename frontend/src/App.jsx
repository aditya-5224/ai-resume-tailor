import React, { useState, useEffect, useCallback } from 'react';
import { ResumeInputForm } from './components/ResumeInputForm';
import { FormattedResumeDisplay } from './components/FormattedResumeDisplay';
import { processResumeWithGemini } from './services/geminiService';
import { SunIcon, MoonIcon } from './components/icons/ThemeIcons';

const AppState = {
  Idle: 'IDLE',
  ProcessingFile: 'PROCESSING_FILE',
  Generating: 'GENERATING',
  Success: 'SUCCESS',
  Error: 'ERROR'
};

function App() {
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
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

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
    setAppState(AppState.Generating);

    try {
      const result = await processResumeWithGemini(resumeText, jobDescription);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Resume Tailor</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <ResumeInputForm
          onFileUpload={handleFileUpload}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
          appState={appState}
        />

        {tailoredResume && (
          <FormattedResumeDisplay
            formattedResume={tailoredResume}
            originalResume={resumeText}
          />
        )}
      </div>
    </div>
  );
}

export default App;
