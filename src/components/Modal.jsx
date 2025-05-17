import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Modal = ({ isOpen, onClose, children, title }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative transform overflow-hidden rounded-lg shadow-xl transition-all w-full max-w-2xl min-h-[600px]"
          style={{ 
            backgroundColor: theme.backgroundAlt,
            border: `1px solid ${theme.border}`
          }}
        >
          {/* Header */}
          <div 
            className="px-6 py-4 border-b"
            style={{ borderColor: theme.border }}
          >
            <h3 
              className="text-lg font-medium"
              style={{ color: theme.text }}
            >
              {title}
            </h3>
          </div>

          {/* Content */}
          <div className="px-6 py-4 h-[calc(100%-73px)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal; 