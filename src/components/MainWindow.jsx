import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaSearch, FaCalendarAlt, FaMoneyBillWave, FaMapMarkedAlt, FaPlane } from 'react-icons/fa';
import DateSelection from './DateSelection';
import { useTheme } from '../context/ThemeContext';
import ThemeSelector from './ThemeSelector';

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
  const [currentPage, setCurrentPage] = useState('location'); // 'location' or 'dates'
  const [tripData, setTripData] = useState({
    location: null,
    dates: null
  });
  const mapRef = useRef(null);

  useEffect(() => {
    setMapLoaded(true);
  }, []);

  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      
      const data = await response.json();
      setSearchResults(data);
      
      if (data.length > 0) {
        const firstResult = data[0];
        const newLocation = [parseFloat(firstResult.lat), parseFloat(firstResult.lon)];
        setSelectedLocation(newLocation);
      } else {
        setError('No locations found');
      }
    } catch (err) {
      setError('Error searching for location');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchLocation(searchQuery);
  };

  const handleResultClick = (result) => {
    const newLocation = [parseFloat(result.lat), parseFloat(result.lon)];
    setSelectedLocation(newLocation);
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  const handleDateSelectionComplete = (dates) => {
    setTripData(prev => ({
      ...prev,
      dates
    }));
    // TODO: Navigate to budget page
  };

  const handleBackToLocation = () => {
    setCurrentPage('location');
  };

  if (currentPage === 'dates') {
    return <DateSelection onComplete={handleDateSelectionComplete} onBack={handleBackToLocation} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <header style={{ backgroundColor: theme.backgroundAlt, borderBottom: `1px solid ${theme.border}` }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: theme.text }}>AI Trip Planner</h1>
          <ThemeSelector />
        </div>
      </header>

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
                center={selectedLocation || [51.505, -0.09]}
                zoom={selectedLocation ? 13 : 2}
                style={{ width: '100%', height: '100%' }}
                className="z-0"
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {selectedLocation && (
                  <>
                    <Marker position={selectedLocation}>
                      <Popup>
                        {searchQuery}
                      </Popup>
                    </Marker>
                    <ChangeMapView center={selectedLocation} zoom={13} />
                  </>
                )}
              </MapContainer>
            </div>
          </div>

          {/* Right Column - Input Form */}
          <div style={{ backgroundColor: theme.backgroundAlt, border: `1px solid ${theme.border}` }} className="rounded-lg shadow-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <FaPlane style={{ color: theme.primary }} className="text-xl" />
              <h2 className="text-xl font-semibold" style={{ color: theme.text }}>Trip Details</h2>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              {/* Location Input */}
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: theme.text }}>
                  Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter destination..."
                    className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors"
                    style={{ 
                      borderColor: theme.border,
                      backgroundColor: theme.background,
                      color: theme.text,
                      '::placeholder': {
                        color: theme.textLight
                      }
                    }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FaSearch className="absolute left-3 top-3" style={{ color: theme.primary }} />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded transition-colors"
                    style={{ 
                      backgroundColor: theme.primary,
                      color: theme.background
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Search Results */}
              {isSearching && (
                <div style={{ color: theme.textLight }}>
                  Searching...
                </div>
              )}
              
              {error && (
                <div style={{ color: theme.primary }}>
                  {error}
                </div>
              )}
              
              {searchResults.length > 0 && (
                <div className="mt-2 space-y-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.place_id}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left p-2 rounded transition-colors"
                      style={{ 
                        backgroundColor: theme.background,
                        color: theme.text,
                        border: `1px solid ${theme.border}`,
                        ':hover': {
                          backgroundColor: theme.backgroundAlt
                        }
                      }}
                    >
                      <div className="font-medium">{result.display_name.split(',')[0]}</div>
                      <div className="text-sm" style={{ color: theme.textLight }}>
                        {result.display_name.split(',').slice(1).join(',').trim()}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="space-y-4">
                <button 
                  onClick={() => setCurrentPage('dates')}
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
                <button 
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
                  style={{ 
                    backgroundColor: theme.secondary,
                    color: theme.background
                  }}
                >
                  <FaMoneyBillWave />
                  <span>Set Budget</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainWindow; 