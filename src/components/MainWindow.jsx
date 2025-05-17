import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaSearch, FaCalendarAlt, FaMoneyBillWave, FaMapMarkedAlt, FaPlane, FaRocket } from 'react-icons/fa';
import DateSelection from './DateSelection';
import BudgetModal from './BudgetModal';
import { useTheme } from '../context/ThemeContext';
import ThemeSelector from './ThemeSelector';
import { format } from 'date-fns';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map center component
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const MainWindow = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [tripData, setTripData] = useState({
    location: null,
    dates: null,
    budget: null
  });
  const mapRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Default map center and zoom
  const defaultCenter = [51.505, -0.09];
  const defaultZoom = 2;

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  const getZoomLevel = (result) => {
    if (!result) return defaultZoom;

    // Extract the type of location from the result
    const type = result.type?.toLowerCase() || '';
    const displayName = result.display_name.toLowerCase();
    
    // Check if it's a country
    if (type === 'country' || 
        (displayName.split(',').length === 1 && !displayName.includes('state') && !displayName.includes('prefecture'))) {
      return 5; // Zoom level for countries
    }
    
    // Check if it's a state/province/prefecture
    if (type === 'state' || 
        displayName.includes('state') || 
        displayName.includes('province') || 
        displayName.includes('prefecture')) {
      return 7; // Zoom level for states/provinces
    }
    
    // Check if it's a city
    if (type === 'city' || displayName.includes('city')) {
      return 10; // Zoom level for cities
    }
    
    // Default zoom level for other locations
    return 8;
  };

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSelectedLocation(null);
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      setSearchResults(data);
      
      if (data.length > 0) {
        const firstResult = data[0];
        if (firstResult.lat && firstResult.lon) {
          const newLocation = {
            coordinates: [parseFloat(firstResult.lat), parseFloat(firstResult.lon)],
            zoom: getZoomLevel(firstResult),
            name: firstResult.display_name
          };
          setSelectedLocation(newLocation);
        }
      } else {
        setError('No locations found');
        setSelectedLocation(null);
      }
    } catch (err) {
      setError('Error searching for location');
      console.error('Search error:', err);
      setSelectedLocation(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(query);
    }, 300); // 300ms delay for live search
  };

  const handleResultClick = (result) => {
    if (result.lat && result.lon) {
      const newLocation = {
        coordinates: [parseFloat(result.lat), parseFloat(result.lon)],
        zoom: getZoomLevel(result),
        name: result.display_name
      };
      setSelectedLocation(newLocation);
      setSearchQuery(result.display_name);
      setSearchResults([]);
    }
  };

  const handleDateSelectionComplete = (dates) => {
    setTripData(prev => ({
      ...prev,
      dates
    }));
  };

  const handleBudgetComplete = (budgetData) => {
    setTripData(prev => ({
      ...prev,
      budget: budgetData
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <header style={{ backgroundColor: theme.backgroundAlt, borderBottom: `1px solid ${theme.border}` }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold" style={{ color: theme.text }}>TravelSeekr.AI</h1>
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Where would you like to go?"
              className="w-full p-4 pl-12 text-lg border-b-2 focus:outline-none transition-colors"
              style={{ 
                borderColor: theme.border,
                backgroundColor: 'transparent',
                color: theme.text,
                '::placeholder': {
                  color: theme.textLight
                }
              }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FaSearch 
              className="absolute left-0 top-1/2 -translate-y-1/2 text-xl" 
              style={{ color: theme.primary }} 
            />
          </div>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="mt-4" style={{ color: theme.textLight }}>
            Searching...
          </div>
        )}
        
        {error && (
          <div className="mt-4" style={{ color: theme.primary }}>
            {error}
          </div>
        )}
        
        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                onClick={() => handleResultClick(result)}
                className="w-full text-left p-3 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: theme.backgroundAlt,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  ':hover': {
                    backgroundColor: theme.background
                  }
                }}
              >
                <div className="font-medium text-lg">{result.display_name.split(',')[0]}</div>
                <div className="text-sm" style={{ color: theme.textLight }}>
                  {result.display_name.split(',').slice(1).join(',').trim()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Map */}
          <div style={{ backgroundColor: theme.backgroundAlt, border: `1px solid ${theme.border}` }} className="rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <FaMapMarkedAlt style={{ color: theme.primary }} className="text-xl" />
              <h2 className="text-xl font-semibold" style={{ color: theme.text }}>Map View</h2>
            </div>
            <div className="h-[500px] rounded-lg overflow-hidden">
              <MapContainer
                center={selectedLocation?.coordinates || defaultCenter}
                zoom={selectedLocation?.zoom || defaultZoom}
                style={{ width: '100%', height: '100%' }}
                className="z-0"
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {selectedLocation?.coordinates && (
                  <>
                    <Marker position={selectedLocation.coordinates}>
                      <Popup>
                        {selectedLocation.name}
                      </Popup>
                    </Marker>
                    <ChangeMapView 
                      center={selectedLocation.coordinates} 
                      zoom={selectedLocation.zoom} 
                    />
                  </>
                )}
              </MapContainer>
            </div>
          </div>

          {/* Right Column - Trip Details */}
          <div style={{ backgroundColor: theme.backgroundAlt, border: `1px solid ${theme.border}` }} className="rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <FaPlane style={{ color: theme.primary }} className="text-xl" />
              <h2 className="text-xl font-semibold" style={{ color: theme.text }}>Trip Details</h2>
            </div>

            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="space-y-4">
                <button 
                  onClick={() => setIsDateModalOpen(true)}
                  disabled={!selectedLocation}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedLocation 
                      ? 'hover:opacity-90' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{ 
                    backgroundColor: selectedLocation ? theme.primary : theme.accent,
                    color: theme.background
                  }}
                >
                  <FaCalendarAlt />
                  <span>Select Dates</span>
                </button>

                {/* Date Summary */}
                {tripData.dates && (
                  <div 
                    className="p-4 rounded-lg flex items-center space-x-3"
                    style={{ 
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    <FaPlane style={{ color: theme.primary }} className="text-xl" />
                    <div>
                      <div className="text-sm font-medium" style={{ color: theme.text }}>
                        Trip Duration
                      </div>
                      <div className="text-sm" style={{ color: theme.textLight }}>
                        {format(tripData.dates.startDate, 'MMM d, yyyy')} - {format(tripData.dates.endDate, 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setIsBudgetModalOpen(true)}
                  disabled={!tripData.dates}
                  className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    tripData.dates 
                      ? 'hover:opacity-90' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{ 
                    backgroundColor: tripData.dates ? theme.secondary : theme.accent,
                    color: theme.background
                  }}
                >
                  <FaMoneyBillWave />
                  <span>Set Budget</span>
                </button>

                {/* Budget Summary */}
                {tripData.budget && (
                  <div 
                    className="p-4 rounded-lg flex items-center space-x-3"
                    style={{ 
                      backgroundColor: theme.background,
                      border: `1px solid ${theme.border}`
                    }}
                  >
                    <FaMoneyBillWave style={{ color: theme.secondary }} className="text-xl" />
                    <div>
                      <div className="text-sm font-medium" style={{ color: theme.text }}>
                        Budget
                      </div>
                      <div className="text-sm" style={{ color: theme.textLight }}>
                        {formatCurrency(tripData.budget.amount)} 
                        {tripData.budget.leeway > 0 && (
                          <span> (up to {formatCurrency(tripData.budget.amount * (1 + tripData.budget.leeway / 100))})</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Deep Seek Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => searchLocation(searchQuery)}
            className="flex items-center space-x-3 px-12 py-4 rounded-lg transition-colors hover:opacity-90 transform hover:scale-105"
            style={{ 
              backgroundColor: theme.primary,
              color: theme.background,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <FaRocket className="text-2xl" />
            <span className="text-xl font-medium">Deep Seek</span>
          </button>
        </div>
      </main>

      {/* Date Selection Modal */}
      <DateSelection
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        onComplete={handleDateSelectionComplete}
      />

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onComplete={handleBudgetComplete}
        initialBudget={tripData.budget?.amount}
      />
    </div>
  );
};

export default MainWindow; 