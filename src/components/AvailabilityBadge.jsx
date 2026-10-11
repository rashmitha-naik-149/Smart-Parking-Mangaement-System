import React from 'react';

export const AvailabilityBadge = ({
  status = 'available',
  availableCount,
  totalCount,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  // If count is passed, determine status based on availability
  let currentStatus = status;
  if (typeof availableCount === 'number') {
    if (availableCount === 0) currentStatus = 'occupied';
    else if (availableCount < 5) currentStatus = 'reserved';
    else currentStatus = 'available';
  }

  const configs = {
    available: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500 animate-pulse',
      label: typeof availableCount === 'number' ? `${availableCount} available` : 'Available'
    },
    occupied: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
      label: typeof availableCount === 'number' ? 'Full / Occupied' : 'Occupied'
    },
    reserved: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500',
      label: typeof availableCount === 'number' ? `Only ${availableCount} left` : 'Reserved'
    },
    maintenance: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
      label: 'Maintenance'
    }
  };

  const current = configs[currentStatus] || configs.available;

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold rounded-lg',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold rounded-xl'
  };

  return (
    <span
      className={`inline-flex items-center border ${current.bg} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {showDot && <span className={`w-2 h-2 rounded-full shrink-0 ${current.dot}`} />}
      <span>{current.label}</span>
      {typeof totalCount === 'number' && typeof availableCount === 'number' && (
        <span className="text-slate-400 font-normal">/ {totalCount}</span>
      )}
    </span>
  );
};
export default AvailabilityBadge;
