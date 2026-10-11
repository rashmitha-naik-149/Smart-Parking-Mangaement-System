import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  ArrowUpRight,
  Ban,
  PlusCircle,
  Star,
  Check
} from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { useBookings } from '../context/BookingContext';

export const BookingCard = ({ booking, onCancel }) => {
  const { extendBooking, completeBooking, submitReviewForBooking } = useBookings();
  const [showQRModal, setShowQRModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Requirement 7: Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Safe & Clean', 'Easy Access']);

  const statusConfigs = {
    confirmed: {
      label: 'Confirmed',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500 animate-pulse'
    },
    completed: {
      label: 'Completed',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400'
    },
    cancelled: {
      label: 'Cancelled',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500'
    }
  };

  const status = statusConfigs[booking.status] || statusConfigs.confirmed;

  const handleConfirmExtend = (hours) => {
    extendBooking(booking.id, hours);
    setShowExtendModal(false);
  };

  const reviewTagOptions = [
    'Safe & Clean',
    'Easy Access',
    'Fast Boom Barrier',
    'Friendly Staff',
    'EV Charger Worked',
    'Spacious Bays'
  ];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    submitReviewForBooking(booking.id, {
      rating,
      comment: reviewComment || 'Great smart parking experience. Smooth entry and clean bays.',
      tags: selectedTags,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
    setShowReviewModal(false);
  };

  return (
    <>
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-card-hover hover:border-slate-300 transition-all duration-300 flex flex-col justify-between text-left">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-[11px] font-mono font-bold text-slate-400">
                #{booking.id}
              </span>
              <h4 className="text-base font-bold text-slate-900 line-clamp-1 mt-0.5">
                {booking.parkingName}
              </h4>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="line-clamp-1">{booking.area}</span>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <span>{status.label}</span>
            </span>
          </div>

          {/* Key Information Grid */}
          <div className="bg-slate-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs mb-4 border border-slate-100">
            <div>
              <div className="text-slate-400 font-medium">Date & Time</div>
              <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{booking.date}</span>
              </div>
              <div className="text-slate-500 text-[11px] ml-4">
                {booking.startTime} – {booking.endTime} ({booking.durationHours} hrs)
              </div>
            </div>

            <div>
              <div className="text-slate-400 font-medium">Allocated Slot</div>
              <div className="font-extrabold text-emerald-700 text-sm mt-0.5">
                Slot {booking.slotNumber}
              </div>
              <div className="text-slate-500 text-[11px]">
                {booking.vehicleModel} ({booking.vehicleNumber})
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer: Price & Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div>
            <span className="text-xs text-slate-400 font-medium">Total Paid</span>
            <div className="text-base font-extrabold text-slate-900">
              ₹{booking.totalAmount}
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* When parking is ongoing/confirmed: Show Complete Parking, Extend, Pass, Cancel */}
            {booking.status === 'confirmed' && (
              <>
                <button
                  type="button"
                  onClick={() => setShowCompleteModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
                  title="Mark your parking as completed and release the bay"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Complete Parking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowExtendModal(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                  title="Add more time to parking"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Extend</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setShowQRModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Pass</span>
            </button>

            {/* ONLY when parking is COMPLETED: Allow driver to provide a review */}
            {booking.status === 'completed' && (
              booking.hasReviewed ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>Rated {booking.userReview?.rating || 5}★</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowReviewModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-400 hover:bg-amber-300 border border-amber-500/30 transition-all shadow-xs"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-900 text-amber-900" />
                  <span>Rate & Review</span>
                </button>
              )
            )}

            {booking.status === 'confirmed' && (
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
              >
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Requirement 7: Leave Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Rate Your Parking Experience"
        description={`Share feedback for your parking session at ${booking.parkingName}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4 text-left">
          {/* Star Rating Selector */}
          <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Overall Rating
            </div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      s <= rating
                        ? 'fill-amber-400 text-amber-500 drop-shadow-xs'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-xs font-bold text-emerald-700 mt-1">
              {rating === 5 ? 'Excellent (5 Stars)' : rating === 4 ? 'Very Good (4 Stars)' : rating === 3 ? 'Good (3 Stars)' : 'Needs Improvement'}
            </div>
          </div>

          {/* Quick Experience Tags */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Highlight Key Amenities:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {reviewTagOptions.map((t) => {
                const isSelected = selectedTags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTag(t)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Text */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Your Review / Feedback:
            </label>
            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Tell other drivers about ease of access, security, bay space, etc..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowReviewModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </Modal>

      {/* Extend Duration Modal */}
      <Modal
        isOpen={showExtendModal}
        onClose={() => setShowExtendModal(false)}
        title="Extend Parking Duration"
        description="Running late? Add more time to prevent overstay penalties"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-600">
            Select additional duration to add to your current reservation at <strong>{booking.parkingName}</strong>:
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleConfirmExtend(1)}
              className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-left transition-all"
            >
              <div className="text-sm font-bold text-emerald-950">+1 Hour</div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">₹{booking.ratePerHour || 30} extra</div>
            </button>

            <button
              onClick={() => handleConfirmExtend(2)}
              className="p-3.5 rounded-2xl border-2 border-emerald-500 bg-emerald-50 hover:bg-emerald-100 text-left transition-all"
            >
              <div className="text-sm font-bold text-emerald-950">+2 Hours</div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">₹{(booking.ratePerHour || 30) * 2} extra</div>
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowExtendModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* QR Code Pass Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        title="Smart Parking Pass"
        maxWidth="max-w-sm"
      >
        <div className="text-center space-y-4">
          <div className="bg-slate-900 p-6 rounded-2xl inline-block shadow-inner">
            <div className="w-44 h-44 bg-white p-3 rounded-xl mx-auto flex flex-col items-center justify-between border-2 border-emerald-500">
              <div className="grid grid-cols-5 gap-1.5 w-full h-full">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm ${
                      [0, 1, 3, 4, 5, 9, 12, 14, 15, 19, 20, 21, 23, 24].includes(i)
                        ? 'bg-slate-900'
                        : 'bg-emerald-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="text-base font-bold text-slate-900">{booking.parkingName}</div>
            <div className="text-sm font-extrabold text-emerald-600">
              Reserved Slot: {booking.slotNumber}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-mono">
              Pass ID: {booking.id}
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Scan this QR code at the entrance automated boom barrier for contact-free entry.
          </p>
        </div>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Parking Reservation"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-left">
          <p className="text-sm text-slate-600">
            Are you sure you want to cancel your booking at <strong>{booking.parkingName}</strong> for <strong>Slot {booking.slotNumber}</strong>?
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
            A full refund of <strong>₹{booking.totalAmount}</strong> will be processed back to your original payment method.
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowCancelModal(false)}
            >
              Keep Reservation
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                onCancel(booking.id);
                setShowCancelModal(false);
              }}
            >
              Yes, Cancel Booking
            </Button>
          </div>
        </div>
      </Modal>

      {/* Complete Parking Confirmation Modal */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Complete Parking Session"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-left">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Finish Parking for Slot {booking.slotNumber}?
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Marking this session completed will check out your vehicle (<strong>{booking.vehicleNumber}</strong>) from <strong>{booking.parkingName}</strong> and release the slot for other drivers.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Reserved Bay:</span>
              <span className="font-extrabold text-emerald-700">Slot {booking.slotNumber} ({booking.slotLevel})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vehicle:</span>
              <span className="font-bold text-slate-800">{booking.vehicleModel} • {booking.vehicleNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Paid:</span>
              <span className="font-bold text-slate-900">₹{booking.totalAmount}</span>
            </div>
          </div>

          <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 font-medium">
            ★ After completing, you can immediately rate your experience and provide a verified review.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowCompleteModal(false)}
            >
              Keep Parking Active
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                completeBooking(booking.id);
                setShowCompleteModal(false);
                setShowReviewModal(true); // Automatically invite user to review right after completion!
              }}
            >
              Yes, Complete Parking
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BookingCard;
