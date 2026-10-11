import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Heart,
  Navigation,
  Share2,
  Clock,
  Shield,
  CalendarCheck,
  CheckCircle2,
  Info,
  Bike,
  Car,
  Zap,
  Calculator,
  MessageSquarePlus,
  Send,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import Rating, { RatingBreakdown } from '../components/Rating';
import AmenityCard from '../components/AmenityCard';
import ReviewCard from '../components/ReviewCard';
import ParkingGrid from '../components/ParkingGrid';
import Button from '../components/Button';
import Input from '../components/Input';
import NavigationSimulatorModal from '../components/NavigationSimulatorModal';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';
import { initialReviews } from '../data/reviewData';

export const ParkingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { parkingList } = useParking();
  const { user, isLoggedIn, toggleSaveParking } = useAuth();
  const { bookings } = useBookings();
  const { showToast } = useNotification();

  const parking = parkingList.find((p) => p.id === id) || parkingList[0];

  // Verified check: Driver must have completed parking at this facility to review
  const hasCompletedParkingHere = bookings?.some(
    (b) => (b.parkingId === parking?.id || b.parkingName === parking?.name) && b.status === 'completed'
  );

  // Navigation simulation modal state
  const [showNavModal, setShowNavModal] = useState(false);

  // Review submission state
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [facilityReviews, setFacilityReviews] = useState(() => {
    return initialReviews.filter((r) => r.parkingId === parking?.id || parking?.id === 'park-01');
  });

  // Cost estimator states
  const [estimatorHours, setEstimatorHours] = useState(3);
  const [estimatorType, setEstimatorType] = useState('Car');

  const isSaved = user?.savedParkingIds?.includes(parking?.id);
  const isBikeOnly = parking?.vehicleTypes?.length === 1 && parking?.vehicleTypes[0] === 'Bike';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: parking.name,
        text: `Check out smart parking at ${parking.name} on SmartPark`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  const handleReserveClick = () => {
    if (!isLoggedIn) {
      showToast('Please sign in to reserve your parking spot.', 'info');
      navigate(`/login?redirect=${encodeURIComponent(`/booking/${parking.id}`)}`);
      return;
    }
    navigate(`/booking/${parking.id}`);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      parkingId: parking.id,
      userName: user?.name || 'Verified Driver',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      rating: userRating,
      date: 'Just now',
      comment: reviewComment,
      helpfulCount: 1
    };

    setFacilityReviews([newRev, ...facilityReviews]);
    setReviewComment('');
    showToast('Your review has been verified and published!');
  };

  if (!parking) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold">Parking facility not found.</h2>
        <Link to="/search" className="text-emerald-600 font-bold mt-2 inline-block">
          Return to search
        </Link>
      </div>
    );
  }

  const occupiedPercent = Math.round((parking.occupiedSlots / parking.totalSlots) * 100);

  // Estimator calculation
  const multiplier = estimatorType === 'Bike' ? 0.6 : 1;
  const estimatedCost = Math.round(parking.pricePerHour * estimatorHours * multiplier);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 text-left">
      {/* Back button & quick actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Share Parking"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleSaveParking(parking.id)}
            className={`p-2.5 rounded-xl border transition-all ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
            }`}
            title={isSaved ? "Saved to favorites" : "Save to favorites"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 stroke-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Hero Photo & Title Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg h-72 sm:h-96 w-full bg-slate-950">
        <img
          src={parking.image}
          alt={parking.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />

        {/* Floating details on Hero Photo */}
        <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600/90 backdrop-blur-md text-white border border-emerald-400/40">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                Verified Smart Facility
              </span>

              {isBikeOnly ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/90 backdrop-blur-md text-white border border-amber-300/40">
                  <Bike className="w-3.5 h-3.5" />
                  Dedicated Sportbike & Two-Wheeler Bay
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-800/80 backdrop-blur-md text-white border border-slate-700">
                  <Car className="w-3.5 h-3.5" />
                  Multi-Level Automated Car Decks
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {parking.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{parking.address}</span>
              </div>
              <span>·</span>
              <Rating score={parking.rating} reviewCount={parking.reviewCount} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details on Left, Booking Card & Estimator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 11: Prominent Availability Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Parking Availability
                </h3>
                <p className="text-xs text-slate-500">
                  Live IoT ultrasonic sensor telemetry
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400">
                Total {parking.totalSlots} spaces
              </span>
            </div>

            {/* Availability stats chips */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800">
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available
                </div>
                <div className="text-2xl font-extrabold mt-1 text-emerald-700">
                  {parking.availableSlots}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-800">
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Occupied
                </div>
                <div className="text-2xl font-extrabold mt-1 text-rose-700">
                  {parking.occupiedSlots}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800">
                <div className="text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Reserved
                </div>
                <div className="text-2xl font-extrabold mt-1 text-amber-700">
                  {parking.reservedSlots || 6}
                </div>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Occupancy Rate</span>
                <span>{occupiedPercent}% filled</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${occupiedPercent}%` }}
                />
                <div
                  className="bg-amber-400 h-full transition-all duration-500"
                  style={{ width: `${Math.round(((parking.reservedSlots || 6) / parking.totalSlots) * 100)}%` }}
                />
                <div className="bg-emerald-500 h-full flex-1" />
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Security & Facility Amenities
              </h3>
              <p className="text-xs text-slate-500">
                All features provided and inspected at this location
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {parking.amenities.map((amenity) => (
                <AmenityCard key={amenity} name={amenity} detailed={true} />
              ))}
            </div>
          </div>

          {/* Visual Interactive Slot Preview Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Real-time Slot Map
                </h3>
                <p className="text-xs text-slate-500">
                  Current bay layout across Ground and Deck levels
                </p>
              </div>
            </div>
            <ParkingGrid
              slots={parking.slots}
              interactive={false}
            />
          </div>

          {/* Description & Rules */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                About this Parking Space
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {parking.description}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Operating Hours</span>
              </h4>
              <div className="bg-slate-50 rounded-2xl p-4 divide-y divide-slate-200/60 text-xs sm:text-sm">
                {parking.openingHours?.map((schedule) => (
                  <div key={schedule.day} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                    <span className="font-semibold text-slate-700">{schedule.day}</span>
                    <span className="font-mono text-emerald-700 font-bold">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Facility Rules & Guidelines</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                {parking.rules?.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reviews & Submit Review Form */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Driver Reviews & Ratings
              </h3>
              <p className="text-xs text-slate-500">
                Verified feedback from drivers who parked here
              </p>
            </div>

            <RatingBreakdown
              average={parking.rating}
              total={parking.reviewCount}
            />

            {/* Write a Review Section: Only enabled after completing parking */}
            {hasCompletedParkingHere ? (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquarePlus className="w-4 h-4 text-emerald-600" />
                    <span>Leave a Verified Driver Review</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setUserRating(s)}
                        className={`text-base ${s <= userRating ? 'text-amber-400' : 'text-slate-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your parking experience (e.g. security, bay cleanliness, entrance speed)..."
                    rows={2}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-500 resize-none"
                    required
                  />
                  <div className="flex justify-end">
                    <Button type="submit" variant="primary" size="sm" icon={Send}>
                      Submit Review
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/90 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Verified Reviews Only</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    Unlocked after completion
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To ensure authentic feedback, reviews can only be submitted after completing a parking session at <strong>{parking.name}</strong>.
                </p>
                <button
                  type="button"
                  onClick={handleReserveClick}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors mt-0.5"
                >
                  <span>Book this parking to unlock review</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="space-y-4 pt-2">
              {facilityReviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Sticky Pricing, Reservation & Cost Estimator Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xl space-y-6 text-left">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Standard Parking Rate
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  ₹{parking.pricePerHour}
                </span>
                <span className="text-sm text-slate-500 font-medium">/ hour</span>
              </div>
            </div>

            {/* Quick Cost Estimator */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Parking Cost Estimator</span>
                </span>
                <span className="text-emerald-700 font-extrabold text-sm">₹{estimatedCost}</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Duration: {estimatorHours} hrs</span>
                  <div className="flex gap-1">
                    {[1, 2, 4, 8].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setEstimatorHours(h)}
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          estimatorHours === h ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600 border'
                        }`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Vehicle:</span>
                  <div className="flex gap-1">
                    {['Car', 'Bike'].map((vt) => (
                      <button
                        key={vt}
                        type="button"
                        onClick={() => setEstimatorType(vt)}
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          estimatorType === vt ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border'
                        }`}
                      >
                        {vt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              <Button
                variant="primary"
                size="lg"
                onClick={handleReserveClick}
                className="w-full text-base font-bold shadow-md shadow-emerald-600/20"
                icon={CalendarCheck}
              >
                {!isLoggedIn ? 'Sign In to Reserve' : 'Reserve Parking'}
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => setShowNavModal(true)}
                className="w-full"
                icon={Navigation}
              >
                Live Turn Guidance
              </Button>
            </div>

            <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant QR Pass issued upon booking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Simulation Modal */}
      <NavigationSimulatorModal
        isOpen={showNavModal}
        onClose={() => setShowNavModal(false)}
        parking={parking}
      />
    </div>
  );
};

export default ParkingDetails;
