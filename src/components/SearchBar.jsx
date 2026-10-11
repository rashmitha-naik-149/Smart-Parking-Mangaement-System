import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const SearchBar = ({
  placeholder = "Search city, area or landmark...",
  size = "lg",
  showPopularChips = false,
  className = "",
  autoFocus = false
}) => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery, parkingList } = useParking();
  const { isLoggedIn } = useAuth();
  const { showToast } = useNotification();

  const [inputValue, setInputValue] = useState(searchQuery || '');
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  const popularLocations = [
    "Bengaluru",
    "MG Road",
    "Indiranagar",
    "Koramangala",
    "Whitefield",
    "Mumbai",
    "Delhi",
    "Hyderabad",
    "Chennai"
  ];

  // Suggestions based on input
  const suggestions = inputValue.trim().length > 0
    ? parkingList
        .filter(p =>
          p.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          p.area.toLowerCase().includes(inputValue.toLowerCase()) ||
          p.address.toLowerCase().includes(inputValue.toLowerCase()) ||
          p.city.toLowerCase().includes(inputValue.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSearch = (queryText) => {
    const finalQuery = (typeof queryText === 'string' ? queryText : inputValue).trim();
    setSearchQuery(finalQuery);
    setIsFocused(false);

    // Item 2: If user is not logged in, redirect to login page
    if (!isLoggedIn) {
      showToast('Please sign in to find and reserve parking spaces.', 'info');
      navigate(`/login?redirect=${encodeURIComponent(`/search?q=${finalQuery}`)}`);
      return;
    }

    navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {/* Search Bar Input Container */}
      <div
        className={`relative flex items-center bg-white rounded-2xl border transition-all duration-300 ${
          isFocused
            ? 'border-emerald-500 ring-4 ring-emerald-500/10 shadow-lg'
            : 'border-slate-200/90 shadow-sm hover:border-slate-300'
        } ${size === 'lg' ? 'p-2 sm:p-2.5' : 'p-1.5'}`}
      >
        <div className="text-slate-400 pl-3 pr-2 flex items-center justify-center shrink-0">
          <Search className={size === 'lg' ? 'w-5 h-5 text-emerald-600' : 'w-4 h-4 text-emerald-600'} />
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 text-sm sm:text-base font-medium focus:outline-none px-2"
        />

        {inputValue && (
          <button
            onClick={() => {
              setInputValue('');
              setSearchQuery('');
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mr-1 shrink-0"
            aria-label="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => handleSearch(inputValue)}
          className={`shrink-0 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-sm active:scale-95 ${
            size === 'lg'
              ? 'px-5 py-3 text-sm sm:text-base'
              : 'px-3.5 py-2 text-xs sm:text-sm'
          }`}
        >
          <span>Find Parking</span>
          {!isLoggedIn ? (
            <Lock className="w-4 h-4 text-emerald-200" />
          ) : (
            <ArrowRight className="w-4 h-4 hidden sm:inline" />
          )}
        </button>

        {/* Autocomplete Suggestion Dropdown */}
        {isFocused && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 text-left">
            <div className="p-2">
              <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                Matching smart locations
              </div>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setInputValue(item.area);
                    handleSearch(item.area);
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {item.area}, {item.city} · {item.distance}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      ₹{item.pricePerHour}/hr
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popular location chips */}
      {showPopularChips && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase mr-1">
            Popular locations:
          </span>
          {popularLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setInputValue(loc);
                handleSearch(loc);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 hover:bg-white text-slate-700 hover:text-emerald-700 border border-slate-200/80 hover:border-emerald-300 shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>{loc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
