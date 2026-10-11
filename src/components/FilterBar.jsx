import React from 'react';
import { SlidersHorizontal, ArrowUpDown, Check } from 'lucide-react';
import { useParking } from '../context/ParkingContext';

export const FilterBar = ({ onOpenDrawer, totalResults = 0 }) => {
  const { filters, setFilters, sortBy, setSortBy } = useParking();

  const handleAvailableToggle = () => {
    setFilters((prev) => ({
      ...prev,
      availableOnly: !prev.availableOnly
    }));
  };

  const handleVehicleTypeSelect = (type) => {
    setFilters((prev) => ({
      ...prev,
      vehicleType: prev.vehicleType === type ? 'All' : type
    }));
  };

  const activeFilterCount =
    (filters.availableOnly ? 1 : 0) +
    (filters.vehicleType !== 'All' ? 1 : 0) +
    (filters.distanceMaxKm < 10 ? 1 : 0) +
    (filters.priceMax < 100 ? 1 : 0) +
    filters.facilities.length;

  return (
    <div className="space-y-3 pb-2">
      {/* Top row: Results count & Sort */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold text-slate-500">
          <span className="text-slate-900 font-bold">{totalResults}</span> parking {totalResults === 1 ? 'location' : 'locations'}
        </div>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-sm"
          >
            <option value="recommended">Recommended</option>
            <option value="distance">Distance (Nearest)</option>
            <option value="price-low">Price (Lowest)</option>
            <option value="price-high">Price (Highest)</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Filter chips bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* Open Full Filter Modal Button */}
        <button
          onClick={onOpenDrawer}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            activeFilterCount > 0
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-emerald-700 text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Quick chip: Available Now */}
        <button
          onClick={handleAvailableToggle}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            filters.availableOnly
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filters.availableOnly ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          <span>Available Now</span>
        </button>

        {/* Quick chip: Car */}
        <button
          onClick={() => handleVehicleTypeSelect('Car')}
          className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            filters.vehicleType === 'Car'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
          }`}
        >
          <span>🚗 Car</span>
        </button>

        {/* Quick chip: Bike */}
        <button
          onClick={() => handleVehicleTypeSelect('Bike')}
          className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            filters.vehicleType === 'Bike'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
          }`}
        >
          <span>🛵 Bike</span>
        </button>

        {/* Quick chip: Under ₹30 */}
        <button
          type="button"
          onClick={() => {
            const nextPrice = filters.priceMax === 30 ? 100 : 30;
            setFilters((prev) => ({
              ...prev,
              priceMax: nextPrice
            }));
          }}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            filters.priceMax === 30
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
          }`}
        >
          {filters.priceMax === 30 && <span className="text-[10px]">✓</span>}
          <span>Under ₹30</span>
        </button>
      </div>
    </div>
  );
};
export default FilterBar;
