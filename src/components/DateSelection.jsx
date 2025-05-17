import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, isBefore } from 'date-fns';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';

const DateSelection = ({ onComplete, onBack }) => {
  const { theme } = useTheme();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    // If end date is before start date, update it
    if (endDate && isBefore(endDate, date)) {
      setEndDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleComplete = () => {
    if (startDate && endDate) {
      onComplete({
        startDate,
        endDate
      });
    }
  };

  const isComplete = startDate && endDate;

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <header style={{ backgroundColor: theme.backgroundAlt, borderBottom: `1px solid ${theme.border}` }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold" style={{ color: theme.text }}>Select Your Dates</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div style={{ backgroundColor: theme.backgroundAlt, border: `1px solid ${theme.border}` }} className="rounded-lg shadow-lg p-6">
          {/* Date Selection */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <FaCalendarAlt style={{ color: theme.primary }} className="text-xl" />
              <h2 className="text-xl font-semibold" style={{ color: theme.text }}>Select Dates</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: theme.text }}>
                  Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  minDate={new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors"
                  style={{ 
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                    color: theme.text,
                    '::placeholder': {
                      color: theme.textLight
                    }
                  }}
                  placeholderText="Select start date"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: theme.text }}>
                  End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || new Date()}
                  dateFormat="MMMM d, yyyy"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors"
                  style={{ 
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                    color: theme.text,
                    '::placeholder': {
                      color: theme.textLight
                    }
                  }}
                  placeholderText="Select end date"
                />
              </div>
            </div>

            {/* Trip Duration Summary */}
            {startDate && endDate && (
              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: theme.background }}>
                <h3 className="text-lg font-medium" style={{ color: theme.text }}>Trip Duration</h3>
                <p style={{ color: theme.textLight }}>
                  {format(startDate, 'MMMM d, yyyy')}
                  <FaArrowRight className="inline mx-2" />
                  {format(endDate, 'MMMM d, yyyy')}
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={onBack}
                className="px-6 py-2 border rounded-lg transition-colors"
                style={{ 
                  borderColor: theme.border,
                  color: theme.text,
                  backgroundColor: theme.background,
                  ':hover': {
                    backgroundColor: theme.backgroundAlt
                  }
                }}
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!isComplete}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isComplete
                    ? 'hover:opacity-90'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ 
                  backgroundColor: isComplete ? theme.primary : theme.accent,
                  color: theme.background
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DateSelection; 