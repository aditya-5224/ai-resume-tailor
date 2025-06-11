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
    <div className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-colors duration-300">
      <div>
        <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Upload Your Resume (.docx)
        </label>
        <label
          htmlFor="resume-file"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
            isProcessingFile ? 'border-yellow-400' : (isFileUploaded ? 'border-green-500' : 'border-gray-300 dark:border-gray-600')
          } border-dashed rounded-md cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-colors`}
        >
          <div className="space-y-1 text-center">
            {isProcessingFile ? (
              <div className="animate-pulse text-yellow-500 dark:text-yellow-400">
                <UploadIcon className="mx-auto h-12 w-12" />
                <p className="text-sm font-medium">Processing file...</p>
              </div>
            ) : isFileUploaded ? (
               <div className="text-green-500 dark:text-green-400">
                <CheckCircleIcon className="mx-auto h-12 w-12" />
                <p className="text-sm font-medium">File ready: {fileName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Click to change</p>
              </div>
            ) : (
              <>
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <span className="relative rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    Upload a file
                  </span>
                  <input 
                    id="resume-file" 
                    name="resume-file" 
                    type="file" 
                    className="sr-only" 
                    accept=".docx" 
                    onChange={handleFileChange} 
                    ref={fileInputRef} 
                  />
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">DOCX up to 10MB</p>
              </>
            )}
          </div>
        </label>
      </div>

      <div>
        <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Job Description
        </label>
        <textarea
          id="job-description"
          name="job-description"
          rows={8}
          className="shadow-sm block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      {error && (
        <div className="text-red-500 dark:text-red-400 text-sm mt-2">
          {error.message}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onSubmit}
          disabled={isLoading || !fileName || !jobDescription.trim()}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            isLoading ? 'animate-pulse' : ''
          }`}
        >
          {isLoading ? 'Processing...' : 'Tailor Resume'}
        </button>
      </div>
    </div>
  );
}
