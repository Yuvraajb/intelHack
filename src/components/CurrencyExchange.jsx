import React, { useState, useEffect } from 'react';
import { FaExchangeAlt, FaInfoCircle } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const CurrencyExchange = ({ budget, destinationCountry }) => {
  const { theme } = useTheme();
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  // Extended list of currencies with their symbols and countries
  const currencies = {
    USD: { symbol: '$', name: 'US Dollar', countries: ['United States', 'USA'] },
    EUR: { symbol: '€', name: 'Euro', countries: ['European Union', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Portugal', 'Greece', 'Ireland'] },
    GBP: { symbol: '£', name: 'British Pound', countries: ['United Kingdom', 'UK', 'Great Britain'] },
    JPY: { symbol: '¥', name: 'Japanese Yen', countries: ['Japan'] },
    AUD: { symbol: 'A$', name: 'Australian Dollar', countries: ['Australia'] },
    CAD: { symbol: 'C$', name: 'Canadian Dollar', countries: ['Canada'] },
    CHF: { symbol: 'Fr', name: 'Swiss Franc', countries: ['Switzerland'] },
    CNY: { symbol: '¥', name: 'Chinese Yuan', countries: ['China'] },
    INR: { symbol: '₹', name: 'Indian Rupee', countries: ['India'] },
    SGD: { symbol: 'S$', name: 'Singapore Dollar', countries: ['Singapore'] },
    NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', countries: ['New Zealand'] },
    KRW: { symbol: '₩', name: 'South Korean Won', countries: ['South Korea', 'Korea'] },
    THB: { symbol: '฿', name: 'Thai Baht', countries: ['Thailand'] },
    MYR: { symbol: 'RM', name: 'Malaysian Ringgit', countries: ['Malaysia'] },
    IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', countries: ['Indonesia'] },
    PHP: { symbol: '₱', name: 'Philippine Peso', countries: ['Philippines'] },
    VND: { symbol: '₫', name: 'Vietnamese Dong', countries: ['Vietnam'] },
    HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', countries: ['Hong Kong'] },
    TWD: { symbol: 'NT$', name: 'New Taiwan Dollar', countries: ['Taiwan'] },
    MXN: { symbol: 'Mex$', name: 'Mexican Peso', countries: ['Mexico'] },
    BRL: { symbol: 'R$', name: 'Brazilian Real', countries: ['Brazil'] },
    ZAR: { symbol: 'R', name: 'South African Rand', countries: ['South Africa'] },
    AED: { symbol: 'د.إ', name: 'UAE Dirham', countries: ['United Arab Emirates', 'UAE'] },
    SAR: { symbol: '﷼', name: 'Saudi Riyal', countries: ['Saudi Arabia'] },
    SEK: { symbol: 'kr', name: 'Swedish Krona', countries: ['Sweden'] },
    NOK: { symbol: 'kr', name: 'Norwegian Krone', countries: ['Norway'] },
    DKK: { symbol: 'kr', name: 'Danish Krone', countries: ['Denmark'] },
    PLN: { symbol: 'zł', name: 'Polish Złoty', countries: ['Poland'] },
    TRY: { symbol: '₺', name: 'Turkish Lira', countries: ['Turkey'] },
    ILS: { symbol: '₪', name: 'Israeli New Shekel', countries: ['Israel'] },
    EGP: { symbol: 'E£', name: 'Egyptian Pound', countries: ['Egypt'] },
    MOP: { symbol: 'MOP$', name: 'Macau Pataca', countries: ['Macau', 'Macao'] },
  };

  const tooltipContent = [
    "Currency conversion helps you understand your budget in local currency",
    "• Real-time exchange rates",
    "• Automatic updates",
    "• Supports 30+ major currencies",
    "• Smart local currency detection",
    "• Includes currency symbols"
  ];

  useEffect(() => {
    if (budget && selectedCurrency) {
      fetchExchangeRate();
    }
  }, [budget, selectedCurrency]);

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${selectedCurrency}`);
      if (!response.ok) throw new Error('Failed to fetch exchange rate');
      const data = await response.json();
      setExchangeRate(data.rates);
    } catch (err) {
      setError('Unable to fetch exchange rates');
      console.error('Exchange rate error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (err) {
      // Fallback formatting if Intl.NumberFormat fails
      const symbol = currencies[currency]?.symbol || currency;
      return `${symbol}${Math.round(amount).toLocaleString()}`;
    }
  };

  const getLocalCurrency = () => {
    if (!destinationCountry) return 'USD';

    // Try to find the currency based on the country name
    const locationString = destinationCountry.toLowerCase();
    
    // Special cases for regions and administrative areas
    const specialCases = {
      'hong kong': 'HKD',
      'macau': 'MOP',
      'macao': 'MOP',
      'taiwan': 'TWD',
      'taipei': 'TWD',
      'singapore': 'SGD',
      'dubai': 'AED',
      'abu dhabi': 'AED',
      'sharjah': 'AED',
      'oslo': 'NOK',
      'stockholm': 'SEK',
      'copenhagen': 'DKK',
      'warsaw': 'PLN',
      'istanbul': 'TRY',
      'tel aviv': 'ILS',
      'jerusalem': 'ILS',
      'cairo': 'EGP',
      'alexandria': 'EGP'
    };

    // Check for special cases first
    for (const [location, currency] of Object.entries(specialCases)) {
      if (locationString.includes(location)) {
        return currency;
      }
    }

    // Split the location string into parts and try to match each part
    const locationParts = locationString.split(',').map(part => part.trim());
    
    // Try to match each part of the location string
    for (const part of locationParts) {
      // Check for exact matches first
      for (const [currency, data] of Object.entries(currencies)) {
        if (data.countries.some(country => 
          country.toLowerCase() === part
        )) {
          return currency;
        }
      }

      // Then check for partial matches
      for (const [currency, data] of Object.entries(currencies)) {
        if (data.countries.some(country => 
          country.toLowerCase().includes(part) || 
          part.includes(country.toLowerCase())
        )) {
          return currency;
        }
      }
    }

    // If no match found, try to match against the last part (usually the country)
    const lastPart = locationParts[locationParts.length - 1];
    if (lastPart) {
      for (const [currency, data] of Object.entries(currencies)) {
        if (data.countries.some(country => 
          country.toLowerCase().includes(lastPart) || 
          lastPart.includes(country.toLowerCase())
        )) {
          return currency;
        }
      }
    }

    // Default to USD if no match found
    return 'USD';
  };

  const calculateLocalAmount = () => {
    if (!exchangeRate || !budget) return null;
    const localCurrency = getLocalCurrency();
    return budget * exchangeRate[localCurrency];
  };

  const getLocalCurrencyName = () => {
    const localCurrency = getLocalCurrency();
    return currencies[localCurrency]?.name || localCurrency;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="text-lg font-medium" style={{ color: theme.text }}>
          Currency Exchange
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

      <div className="space-y-4">
        {/* Currency Selector */}
        <div className="flex items-center space-x-4">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors"
            style={{ 
              borderColor: theme.border,
              backgroundColor: theme.background,
              color: theme.text
            }}
          >
            {Object.entries(currencies).map(([code, { name }]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </div>

        {/* Exchange Rate Display */}
        {loading ? (
          <div className="text-sm" style={{ color: theme.textLight }}>
            Loading exchange rates...
          </div>
        ) : error ? (
          <div className="text-sm" style={{ color: theme.primary }}>
            {error}
          </div>
        ) : exchangeRate && budget ? (
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme.background }}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm" style={{ color: theme.textLight }}>
                  Your Budget
                </div>
                <div className="text-lg font-medium" style={{ color: theme.text }}>
                  {formatCurrency(budget, selectedCurrency)}
                </div>
              </div>
              <FaExchangeAlt style={{ color: theme.primary }} className="text-xl" />
              <div className="space-y-1 text-right">
                <div className="text-sm" style={{ color: theme.textLight }}>
                  {getLocalCurrencyName()}
                </div>
                <div className="text-lg font-medium" style={{ color: theme.text }}>
                  {formatCurrency(calculateLocalAmount(), getLocalCurrency())}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CurrencyExchange; 