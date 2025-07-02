import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/EditorIcons';
import { CheckCircleIcon } from './icons/StatusIcons';
import { ClassicLoader } from './ClassicLoader';
import { LoadingOverlay } from './LoadingOverlay';
import './ResumeInputForm.css';

export function ResumeInputForm({
  handleFileUpload,
  jobDescription,
  setJobDescription,
  handleSubmit,
  isLoading,
  error,
  appState
}) {
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      handleFileUpload(file);
    } else {
      setFileName(null);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const isProcessingFile = appState === 'PROCESSING_FILE';
  const isFileUploaded = !!fileName && !isProcessingFile && appState !== 'ERROR';

  return (
    <>
      <LoadingOverlay 
        isVisible={isLoading} 
        text="Tailoring your resume with AI magic..." 
        size="large" 
      />
      
      <div className="resume-form-container">
        <div className="resume-form">
          <div className="form-grid">
            <div className="form-section upload-section">
              <label htmlFor="resume-upload" className="form-label">
                Upload Your Resume (.docx)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`upload-area ${isDragging ? 'shine-effect' : ''}`}
              >
                {isProcessingFile ? (
                  <div className="upload-content">
                    <UploadIcon className="upload-icon spinning" />
                    <p className="upload-text">Processing file...</p>
                  </div>
                ) : isFileUploaded ? (
                  <div className="upload-content">
                    <CheckCircleIcon className="upload-icon success" />
                    <p className="upload-text">File ready: {fileName}</p>
                    <p className="upload-subtitle">Click anywhere to change</p>
                  </div>
                ) : (
                  <div className="upload-content">
                    <UploadIcon className="upload-icon" />
                    <div className="upload-text-container">
                      <p className="upload-text">
                        Drag and drop your resume here, or{' '}
                        <span className="upload-link">click to browse</span>
                      </p>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".docx" 
                        onChange={handleFileChange} 
                        ref={fileInputRef}
                        id="resume-upload"
                      />
                      <p className="upload-subtitle">DOCX up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-section description-section">
              <label htmlFor="job-description" className="form-label">
                Job Description
              </label>
              <div className="job-description-container">
                <textarea
                  id="job-description"
                  className="job-description-input"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="button-container">
            {error && (
              <div className="error-message">
                {error.message}
              </div>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={isLoading || !fileName || !jobDescription.trim()}
              className="tailor-button"
            >
              {isLoading ? (
                <ClassicLoader size="small" text="" variant="ring" />
              ) : (
                'Tailor Resume'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
