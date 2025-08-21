import React, { useEffect, memo } from 'react';
import { createPortal } from 'react-dom';

/**
 * Modal component for confirming preset deletion
 * Uses portal to render outside MainLayout restrictions for proper centering
 */
export default memo(function DeletePresetModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  presetName 
}) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header with icon */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30 px-6 py-4 border-b border-red-200 dark:border-red-800/50">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
            Delete Preset
          </h3>
        </div>
        
        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {presetName}
            </span>
            ?
            <br />
            <span className="text-sm text-gray-500 dark:text-gray-500 mt-2 block">
              This action cannot be undone.
            </span>
          </p>
          
          {/* Action buttons */}
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 font-medium bg-transparent border-none"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 bg-transparent border-none"
            >
              Delete Preset
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});
