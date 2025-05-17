import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const TripNotes = ({ notes, onNotesChange }) => {
  const { theme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipContent = [
    "Share your travel preferences and requirements",
    "• Luxury level and accommodation preferences",
    "• Dietary restrictions or food preferences",
    "• Activities you'd like to experience",
    "• Special occasions or celebrations",
    "• Accessibility requirements",
    "• Any other important details"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-medium" style={{ color: theme.text }}>
          Trip Notes
        </h3>
        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="focus:outline-none"
            style={{ color: theme.textLight }}
          >
            <FaInfoCircle className="text-lg" />
          </button>
          
          {showTooltip && (
            <div 
              className="absolute z-10 w-72 p-4 rounded-lg shadow-lg transform -translate-x-1/2 left-1/2 mt-2"
              style={{ 
                backgroundColor: theme.background,
                border: `1px solid ${theme.border}`,
                color: theme.text
              }}
            >
              <div className="space-y-2">
                {tooltipContent.map((line, index) => (
                  <p key={index} className="text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
              <div 
                className="absolute w-3 h-3 transform rotate-45 -top-2 left-1/2 -translate-x-1/2"
                style={{ backgroundColor: theme.background, borderLeft: `1px solid ${theme.border}`, borderTop: `1px solid ${theme.border}` }}
              />
            </div>
          )}
        </div>
      </div>

      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Add your preferences, requirements, and any special notes..."
        className="w-full p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
        style={{ 
          borderColor: theme.border,
          backgroundColor: theme.background,
          color: theme.text,
          minHeight: '120px',
          '::placeholder': {
            color: theme.textLight
          }
        }}
      />
    </div>
  );
};

export default TripNotes; 