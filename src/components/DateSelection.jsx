import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, isBefore, addYears, subYears } from 'date-fns';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import Modal from './Modal';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/datepicker.css';

const DateSelection = ({ isOpen, onClose, onComplete }) => {
  const { theme } = useTheme();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Get current year and create array of years (current year ± 5 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 11 },
    (_, i) => currentYear - 5 + i
  );

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
      onClose();
    }
  };

  const isComplete = startDate && endDate;

  // Custom header component for the date picker
  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    changeYear
  }) => (
    <div className="flex justify-between items-center px-4 py-2">
      <button
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-1 rounded hover:bg-opacity-10 transition-colors"
        style={{ 
          backgroundColor: `${theme.primary}20`,
          color: theme.primary
        }}
      >
        ←
      </button>
      <select
        value={date.getFullYear()}
        onChange={({ target: { value } }) => changeYear(value)}
        className="p-1 rounded border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
        style={{ 
          borderColor: theme.border,
          backgroundColor: theme.background,
          color: theme.text
        }}
      >
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-1 rounded hover:bg-opacity-10 transition-colors"
        style={{ 
          backgroundColor: `${theme.primary}20`,
          color: theme.primary
        }}
      >
        →
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Your Dates">
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
              maxDate={addYears(new Date(), 5)}
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
              renderCustomHeader={CustomHeader}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={11}
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
              maxDate={addYears(new Date(), 5)}
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
              renderCustomHeader={CustomHeader}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={11}
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

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
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
            Cancel
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
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DateSelection; 