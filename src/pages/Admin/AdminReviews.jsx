import React, { useState } from 'react';
import { Star, MessageSquare, Trash2, Check, Filter } from 'lucide-react';
import { initialReviews } from '../../data/reviewData';
import { useNotification } from '../../context/NotificationContext';
import Rating from '../../components/Rating';

export const AdminReviews = () => {
  const { showToast } = useNotification();
  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [starFilter, setStarFilter] = useState('all');

  const handleDelete = (id) => {
    setReviewsList((prev) => prev.filter((r) => r.id !== id));
    showToast('Review removed from public listing.', 'info');
  };

  const filtered = reviewsList.filter((r) => {
    if (starFilter !== 'all' && r.rating !== Number(starFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Reviews Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor feedback across all monitored parking locations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Filter:</label>
          <select
            value={starFilter}
            onChange={(e) => setStarFilter(e.target.value)}
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars & lower</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={r.userAvatar}
                    alt={r.userName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{r.userName}</div>
                    <div className="text-[11px] text-slate-400">{r.date}</div>
                  </div>
                </div>

                <Rating score={r.rating} size="sm" showText={false} />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                "{r.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{r.helpfulCount || 0} drivers marked helpful</span>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-rose-600 hover:text-rose-800 font-semibold p-1 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
