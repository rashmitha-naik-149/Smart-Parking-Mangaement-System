import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm animate-pulse space-y-4">
    <div className="w-full h-44 bg-slate-200 rounded-xl" />
    <div className="space-y-2">
      <div className="h-5 bg-slate-200 rounded w-3/4" />
      <div className="h-4 bg-slate-100 rounded w-1/2" />
    </div>
    <div className="flex justify-between items-center pt-2 border-t border-slate-50">
      <div className="h-6 bg-slate-200 rounded w-20" />
      <div className="h-9 bg-slate-200 rounded-xl w-28" />
    </div>
  </div>
);

export const DetailsSkeleton = () => (
  <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-32" />
    <div className="h-80 bg-slate-200 rounded-3xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <div className="h-8 bg-slate-200 rounded w-2/3" />
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-24 bg-slate-100 rounded-2xl" />
      </div>
      <div className="h-64 bg-slate-200 rounded-3xl" />
    </div>
  </div>
);

export default CardSkeleton;
