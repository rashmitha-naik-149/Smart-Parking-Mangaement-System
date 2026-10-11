import React from 'react';
import { Zap, Bike, Car } from 'lucide-react';

export const ParkingGrid = ({
  slots = [],
  selectedSlotId = null,
  onSelectSlot,
  interactive = true,
  className = ""
}) => {
  const statusStyles = {
    available: {
      bg: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300',
      dot: 'bg-emerald-500',
      cursor: 'cursor-pointer hover:border-emerald-500 hover:scale-105'
    },
    occupied: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      cursor: 'cursor-not-allowed opacity-75'
    },
    reserved: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      cursor: 'cursor-not-allowed opacity-80'
    },
    maintenance: {
      bg: 'bg-slate-100 text-slate-500 border-slate-300',
      dot: 'bg-slate-700',
      cursor: 'cursor-not-allowed opacity-70'
    }
  };

  // Group slots by row letter (e.g. A, B, C)
  const rows = slots.reduce((acc, slot) => {
    const rowChar = slot.id ? slot.id.charAt(0) : 'A';
    if (!acc[rowChar]) acc[rowChar] = [];
    acc[rowChar].push(slot);
    return acc;
  }, {});

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Reserved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <span>Maintenance</span>
        </div>
        <div className="ml-auto text-[11px] text-slate-400 font-normal">
          Click any green slot to reserve
        </div>
      </div>

      {/* Grid Rows */}
      <div className="space-y-4">
        {Object.entries(rows).map(([rowKey, rowSlots]) => (
          <div key={rowKey} className="space-y-1.5">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
              Bay Row {rowKey}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {rowSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                const isAvailable = slot.status === 'available';
                const style = statusStyles[slot.status] || statusStyles.available;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!interactive || !isAvailable}
                    onClick={() => onSelectSlot && isAvailable && onSelectSlot(slot)}
                    className={`relative p-2.5 rounded-xl border transition-all text-center flex flex-col items-center justify-between min-h-[64px] ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-emerald-500 shadow-md scale-105 z-10'
                        : `${style.bg} ${interactive && isAvailable ? style.cursor : ''}`
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-emerald-400 animate-pulse' : style.dot}`} />
                      {slot.hasEV && (
                        <Zap className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-amber-500'}`} />
                      )}
                      {slot.type === 'Bike' && (
                        <Bike className="w-3 h-3 text-slate-400" />
                      )}
                    </div>

                    <div className="font-extrabold text-sm tracking-tight mt-1">
                      {slot.id}
                    </div>

                    <div className="text-[10px] font-medium opacity-80 mt-0.5">
                      {isSelected ? 'Chosen' : slot.status}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingGrid;
