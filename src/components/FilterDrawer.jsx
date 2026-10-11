import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import Button from './Button';

export const FilterDrawer = ({ isOpen, onClose }) => {
  const { filters, setFilters, resetFilters } = useParking();

  // Temporary local state for editing
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync when drawer opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const facilitiesList = [
    'CCTV',
    'Security',
    'Covered Parking',
    'EV Charging',
    'Accessible Parking',
    '24/7'
  ];

  const handleApply = () => {
    setFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    resetFilters();
    onClose();
  };

  const toggleFacility = (facility) => {
    setLocalFilters((prev) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility]
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer / Sheet Content */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col z-10 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Filters</h3>
            <p className="text-xs text-slate-500">Refine parking spots to your needs</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters Body */}
        <div className="px-6 py-4 overflow-y-auto space-y-6 flex-1 text-left">
          {/* Distance */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
              Distance
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Within 1 km', val: 1 },
                { label: 'Within 3 km', val: 3 },
                { label: 'Within 5 km', val: 5 }
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      distanceMaxKm: prev.distanceMaxKm === d.val ? 10 : d.val
                    }))
                  }
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    localFilters.distanceMaxKm === d.val
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
              Hourly Price
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Under ₹20', max: 20 },
                { label: '₹20 – ₹50', max: 50 },
                { label: '₹50+', max: 100 }
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      priceMax: prev.priceMax === p.max ? 100 : p.max
                    }))
                  }
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    localFilters.priceMax === p.max
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
              Vehicle Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Car', val: 'Car' },
                { label: 'Bike', val: 'Bike' },
                { label: 'Both', val: 'All' }
              ].map((v) => (
                <button
                  key={v.val}
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      vehicleType: v.val
                    }))
                  }
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    localFilters.vehicleType === v.val
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
              Availability
            </label>
            <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={localFilters.availableOnly}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    availableOnly: e.target.checked
                  }))
                }
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm font-medium text-slate-800">
                Show available spaces only
              </span>
            </label>
          </div>

          {/* Facilities */}
          <div>
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
              Facilities & Amenities
            </label>
            <div className="grid grid-cols-2 gap-2">
              {facilitiesList.map((fac) => {
                const isSelected = localFilters.facilities.includes(fac);
                return (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => toggleFacility(fac)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-semibold shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{fac}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70 rounded-b-3xl">
          <Button
            variant="outline"
            size="md"
            onClick={handleClear}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleApply}
            className="flex-1"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
export default FilterDrawer;
