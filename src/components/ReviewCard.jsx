import React, { useState } from 'react';
import { ThumbsUp, CheckCircle } from 'lucide-react';
import Rating from './Rating';

export const ReviewCard = ({ review }) => {
  const [likes, setLikes] = useState(review.helpfulCount || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:border-slate-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-slate-800">
                {review.userName}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                Verified Driver
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{review.date}</div>
          </div>
        </div>

        <Rating score={review.rating} size="sm" showText={false} />
      </div>

      <p className="text-sm text-slate-600 leading-relaxed">
        {review.comment}
      </p>

      <div className="pt-2 flex items-center justify-between border-t border-slate-50">
        <button
          onClick={handleLike}
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors ${
            hasLiked
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-emerald-600' : ''}`} />
          <span>Helpful ({likes})</span>
        </button>
      </div>
    </div>
  );
};
export default ReviewCard;
