import React from 'react';
import { Star } from 'lucide-react';

export const Rating = ({
  score = 4.5,
  reviewCount,
  size = 'md',
  showText = true,
  className = ''
}) => {
  const stars = [1, 2, 3, 4, 5];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5 text-amber-400">
        {stars.map((star) => (
          <Star
            key={star}
            className={`${iconSizes[size]} ${
              score >= star
                ? 'fill-amber-400 text-amber-400'
                : score >= star - 0.5
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-slate-200 fill-slate-100'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700">
          {score.toFixed(1)}
          {typeof reviewCount === 'number' && (
            <span className="text-slate-400 font-normal ml-1">
              · {reviewCount} reviews
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export const RatingBreakdown = ({
  average = 4.7,
  total = 128,
  breakdown = [
    { stars: 5, percentage: 76, count: 98 },
    { stars: 4, percentage: 16, count: 20 },
    { stars: 3, percentage: 5, count: 6 },
    { stars: 2, percentage: 2, count: 3 },
    { stars: 1, percentage: 1, count: 1 }
  ]
}) => {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
      <div className="text-center sm:text-left shrink-0">
        <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {average.toFixed(1)}
        </div>
        <Rating score={average} size="md" showText={false} className="mt-1" />
        <div className="text-xs text-slate-500 font-medium mt-1">
          Based on {total} reviews
        </div>
      </div>

      <div className="flex-1 w-full space-y-2 border-t sm:border-t-0 sm:border-l border-slate-200/60 pt-4 sm:pt-0 sm:pl-6">
        {breakdown.map((item) => (
          <div key={item.stars} className="flex items-center gap-2 text-xs">
            <span className="w-6 font-medium text-slate-600 shrink-0">
              {item.stars} ⭐
            </span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="w-8 text-right text-slate-400 font-mono text-[11px]">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rating;
