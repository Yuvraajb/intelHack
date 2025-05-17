import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Modal from './Modal';
import { FaMoneyBillWave, FaPlus, FaMinus } from 'react-icons/fa';

const BudgetModal = ({ isOpen, onClose, onComplete, initialBudget = null }) => {
  const { theme } = useTheme();
  const [budget, setBudget] = useState(initialBudget || '');
  const [leeway, setLeeway] = useState(10); // Default 10% leeway

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setBudget(value);
    }
  };

  const handleLeewayChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 50) {
      setLeeway(value);
    }
  };

  const handleComplete = () => {
    if (budget) {
      onComplete({
        amount: parseFloat(budget),
        leeway: leeway
      });
      onClose();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const maxBudget = budget ? parseFloat(budget) * (1 + leeway / 100) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Your Budget">
      <div className="space-y-6">
        {/* Budget Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: theme.text }}>
            Total Budget
          </label>
          <div className="relative">
            <input
              type="text"
              value={budget}
              onChange={handleBudgetChange}
              placeholder="Enter amount"
              className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors text-lg"
              style={{ 
                borderColor: theme.border,
                backgroundColor: theme.background,
                color: theme.text,
                '::placeholder': {
                  color: theme.textLight
                }
              }}
            />
            <FaMoneyBillWave 
              className="absolute left-3 top-1/2 -translate-y-1/2" 
              style={{ color: theme.primary }} 
            />
          </div>
        </div>

        {/* Leeway Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium" style={{ color: theme.text }}>
              Budget Flexibility
            </label>
            <span className="text-sm" style={{ color: theme.textLight }}>
              {leeway}%
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLeeway(prev => Math.max(0, prev - 5))}
              className="p-2 rounded-full hover:bg-opacity-10 transition-colors"
              style={{ 
                backgroundColor: `${theme.primary}20`,
                color: theme.primary
              }}
            >
              <FaMinus size={12} />
            </button>
            <input
              type="range"
              min="0"
              max="50"
              value={leeway}
              onChange={handleLeewayChange}
              className="flex-1"
              style={{
                accentColor: theme.primary
              }}
            />
            <button
              onClick={() => setLeeway(prev => Math.min(50, prev + 5))}
              className="p-2 rounded-full hover:bg-opacity-10 transition-colors"
              style={{ 
                backgroundColor: `${theme.primary}20`,
                color: theme.primary
              }}
            >
              <FaPlus size={12} />
            </button>
          </div>
          <p className="text-sm" style={{ color: theme.textLight }}>
            Maximum budget: {formatCurrency(maxBudget)}
          </p>
        </div>

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
            disabled={!budget}
            className={`px-6 py-2 rounded-lg transition-colors ${
              budget
                ? 'hover:opacity-90'
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ 
              backgroundColor: budget ? theme.primary : theme.accent,
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

export default BudgetModal; 