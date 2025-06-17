import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/EditorIcons';
import { CheckCircleIcon } from './icons/StatusIcons';
import './ResumeInputForm.css';

export function ResumeInputForm({
  onFileUpload,
  jobDescription,
  setJobDescription,
  onSubmit,
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
      onFileUpload(file);
    } else {
      setFileName(null);
    }
  }, [onFileUpload]);

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
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const isProcessingFile = appState === 'PROCESSING_FILE';
  const isFileUploaded = !!fileName && !isProcessingFile && appState !== 'ERROR';

  return (
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
                  <p className="upload-subtitle">Click to change</p>
                </div>
              ) : (
                <div className="upload-content">
                  <UploadIcon className="upload-icon" />
                  <div className="upload-text-container">
                    <label className="upload-label">
                      <span className="upload-link">
                        Choose a file
                      </span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".docx" 
                        onChange={handleFileChange} 
                        ref={fileInputRef}
                        id="resume-upload"
                      />
                    </label>
                    <p className="upload-subtitle">or drag and drop</p>
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
            onClick={onSubmit}
            disabled={isLoading || !fileName || !jobDescription.trim()}
            className={`tailor-button ${isLoading ? 'disabled' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Tailor Resume'}
          </button>
        </div>
      </div>
    </div>
  );
}
