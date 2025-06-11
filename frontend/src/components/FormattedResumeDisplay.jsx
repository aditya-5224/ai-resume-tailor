import React from 'react';
import { PrinterIcon } from './icons/EditorIcons';

const SectionTitle = ({ title }) => (
  <h2 className="text-xl sm:text-2xl font-semibold text-primary-700 dark:text-primary-300 mt-6 mb-3 border-b-2 border-primary-500 dark:border-primary-400 pb-1 print:text-lg print:mt-4 print:mb-2 print:border-black">
    {title}
  </h2>
);

const ContactDetail = ({ label, value, href, className }) => {
  if (!value) return null;
  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary-600 dark:text-primary-400 print:text-blue-600">
      {value}
    </a>
  ) : value;
  return (
    <span className={`text-sm sm:text-base print:text-xs ${className || ''}`}>
      {label && <span className="font-semibold">{label}: </span>}
      {content}
    </span>
  );
};

export function FormattedResumeDisplay({ formattedResume, originalResume }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-colors duration-300">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tailored Resume</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              We've optimized your resume for the job description. Review the changes below.
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="ml-4 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors flex items-center"
          >
            <PrinterIcon className="w-5 h-5 mr-2" /> Print
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Tailored Content
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formattedResume.tailoredContent }} />
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Original Resume
            </h3>
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
              {originalResume}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
