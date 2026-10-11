import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search as SearchLucide,
  Map as MapIcon,
  List,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  X
} from 'lucide-react';
import ParkingCard from '../components/ParkingCard';
import MapView from '../components/MapView';
import FilterBar from '../components/FilterBar';
import FilterDrawer from '../components/FilterDrawer';
import { useParking } from '../context/ParkingContext';

export const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    filteredParking,
    parkingList,
    searchQuery,
    setSearchQuery,
    resetFilters
  } = useParking();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  // Default to 'grid' so the entire width is filled with cards and there is NO blank space
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'split'
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'map'

  // Handle URL query parameters (?q=... or ?explore=1)
  useEffect(() => {
    const isExplore = searchParams.get('explore');
    if (isExplore) {
      setSearchQuery('');
      resetFilters();
    } else {
      const q = searchParams.get('q');
      if (q !== null && q !== undefined) {
        setSearchQuery(q);
      }
    }
  }, [searchParams]);

  const majorCities = [
    { label: 'All Cities', value: '', count: parkingList.length },
    { label: 'Bengaluru', value: 'Bengaluru', count: parkingList.filter(p => p.city === 'Bengaluru').length },
    { label: 'Mumbai', value: 'Mumbai', count: parkingList.filter(p => p.city === 'Mumbai').length },
    { label: 'Delhi', value: 'Delhi', count: parkingList.filter(p => p.city === 'Delhi').length },
    { label: 'Hyderabad', value: 'Hyderabad', count: parkingList.filter(p => p.city === 'Hyderabad').length },
    { label: 'Chennai', value: 'Chennai', count: parkingList.filter(p => p.city === 'Chennai').length },
  ];

  const isAllMode = !searchQuery.trim();

  return (
    <div className={`flex-1 flex flex-col ${viewMode === 'split' ? 'h-[calc(100vh-64px)] overflow-hidden' : 'min-h-[calc(100vh-64px)]'} bg-slate-50`}>
      {/* Top Header & Search Control Section */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Subtitle */}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {isAllMode ? 'Explore All Smart Parking' : `Parking in ${searchQuery}`}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {filteredParking.length} facilities
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAllMode
                  ? `Showing all ${parkingList.length} verified smart parking facilities across India with live bay tracking`
                  : `Real-time smart parking discoveries & guaranteed reservations`}
              </p>
            </div>

            {/* Controls: Search input & Desktop View Mode Switcher */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search area, landmark or facility..."
                  className="w-full pl-9 pr-8 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
                />
                <SearchLucide className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Desktop View Switcher: [ ⊞ Grid View ] [ 🗺️ Split Map ] */}
              <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Full Width Grid View (No blank space)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid View</span>
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'split'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Split Screen with Interactive Map"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map View</span>
                </button>
              </div>

              {/* Mobile View Toggle: [List] [Map] */}
              <div className="flex lg:hidden items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setMobileView('list')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    mobileView === 'list'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>List</span>
                </button>
                <button
                  onClick={() => setMobileView('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    mobileView === 'map'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick City Selector Pills */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              City:
            </span>
            {majorCities.map((city) => {
              const isActive = (city.value === '' && !searchQuery.trim()) || (city.value !== '' && searchQuery.toLowerCase() === city.value.toLowerCase());
              return (
                <button
                  key={city.label}
                  onClick={() => {
                    setSearchQuery(city.value);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {city.label} <span className="opacity-75 text-[10px]">({city.count})</span>
                </button>
              );
            })}
          </div>

          {/* Quick Filters Bar */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-100">
            <FilterBar
              onOpenDrawer={() => setFilterDrawerOpen(true)}
              totalResults={filteredParking.length}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {viewMode === 'grid' ? (
          /* ========================================================================= */
          /* MODE 1: FULL-WIDTH RESPONSIVE GRID (NO BLANK SPACE AT ALL)                */
          /* ========================================================================= */
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
            {filteredParking.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  No parking locations found
                </h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search terms, changing filters, or expanding your radius.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredParking.map((parking) => (
                  <ParkingCard key={parking.id} parking={parking} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* MODE 2: SPLIT SCREEN (CARDS LIST ON LEFT + WORKING MAP ON RIGHT)           */
          /* ========================================================================= */
          <div className="flex-1 flex h-full overflow-hidden">
            {/* Left Column: Scrollable cards list */}
            <div
              className={`w-full lg:w-[480px] xl:w-[520px] shrink-0 h-full flex flex-col bg-white border-r border-slate-200 ${
                mobileView === 'map' ? 'hidden lg:flex' : 'flex'
              }`}
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <span className="text-xs font-bold text-slate-600">
                  Showing {filteredParking.length} facilities
                </span>
                <button
                  onClick={() => setViewMode('grid')}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Expand to Full Grid</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredParking.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-800">
                      No parking locations found
                    </h3>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                ) : (
                  filteredParking.map((parking) => (
                    <ParkingCard key={parking.id} parking={parking} />
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Working Map */}
            <div
              className={`flex-1 h-full relative ${
                mobileView === 'list' ? 'hidden lg:block' : 'block w-full'
              }`}
            >
              <MapView
                locations={filteredParking}
                className="w-full h-full rounded-none border-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Full Filter Drawer / Bottom Sheet */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      />
    </div>
  );
};

export default Search;
