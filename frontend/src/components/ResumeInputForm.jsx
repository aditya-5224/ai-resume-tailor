import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon } from './icons/EditorIcons';
import { CheckCircleIcon } from './icons/StatusIcons';

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
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
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
    <div className="card space-y-6">
      <div>
        <label htmlFor="resume-upload" className="text-sm font-medium">
          Upload Your Resume (.docx)
        </label>
        <label
          htmlFor="resume-file"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`upload-zone ${
            isProcessingFile ? 'processing' : (isFileUploaded ? 'success' : '')
          }`}
        >
          <div className="upload-content">
            {isProcessingFile ? (
              <div className="processing-state">
                <UploadIcon className="icon" />
                <p className="text-sm font-medium">Processing file...</p>
              </div>
            ) : isFileUploaded ? (
               <div className="success-state">
                <CheckCircleIcon className="icon" />
                <p className="text-sm font-medium">File ready: {fileName}</p>
                <p className="text-sm">Click to change</p>
              </div>
            ) : (
              <>
                <UploadIcon className="icon" />
                <div className="upload-text">
                  <span className="upload-button">
                    Upload a file
                  </span>
                  <input 
                    id="resume-file" 
                    name="resume-file" 
                    type="file" 
                    className="hidden" 
                    accept=".docx" 
                    onChange={handleFileChange} 
                    ref={fileInputRef} 
                  />
                  <p>or drag and drop</p>
                </div>
                <p className="text-sm">DOCX up to 10MB</p>
              </>
            )}
          </div>
        </label>
      </div>

      <div>
        <label htmlFor="job-description" className="text-sm font-medium">
          Job Description
        </label>
        <textarea
          id="job-description"
          name="job-description"
          rows={8}
          className="form-input"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {error && (
        <div className="error-message">
          {error.message}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onSubmit}
          disabled={isLoading || !fileName || !jobDescription.trim()}
          className={`btn-primary ${isLoading ? 'loading' : ''}`}
        >
          {isLoading ? 'Processing...' : 'Tailor Resume'}
        </button>
      </div>
    </div>
  );
}
