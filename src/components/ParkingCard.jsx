import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Heart, ArrowUpRight, Zap, Bike, Car, Lock } from 'lucide-react';
import Rating from './Rating';
import AvailabilityBadge from './AvailabilityBadge';
import AmenityCard from './AmenityCard';
import { useAuth } from '../context/AuthContext';
import { useParking } from '../context/ParkingContext';
import { useNotification } from '../context/NotificationContext';

export const ParkingCard = ({ parking, compact = false, className = '' }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, toggleSaveParking } = useAuth();
  const { selectedParkingId, setSelectedParkingId } = useParking();
  const { showToast } = useNotification();

  const isSaved = user?.savedParkingIds?.includes(parking.id);
  const isSelected = selectedParkingId === parking.id;

  const handleCardClick = () => {
    setSelectedParkingId(parking.id);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();

    // Item 2: redirect to login if not logged in
    if (!isLoggedIn) {
      showToast('Please sign in to view facility details and reserve parking spots.', 'info');
      navigate(`/login?redirect=${encodeURIComponent(`/parking/${parking.id}`)}`);
      return;
    }

    navigate(`/parking/${parking.id}`);
  };

  const handleToggleSave = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      showToast('Please sign in to save favorite spots.', 'info');
      navigate(`/login?redirect=${encodeURIComponent(`/parking/${parking.id}`)}`);
      return;
    }
    toggleSaveParking(parking.id);
  };

  const isBikeOnly = parking.vehicleTypes?.length === 1 && parking.vehicleTypes[0] === 'Bike';

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden text-left ${
        isSelected
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
          : 'border-slate-200/90 shadow-sm hover:border-emerald-400 hover:shadow-card-hover'
      } ${compact ? 'p-3.5' : 'p-4'} ${className}`}
    >
      {/* Top Image & Badges */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-900 mb-3.5">
        <img
          src={parking.image}
          alt={parking.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

        {/* Favorite button */}
        <button
          onClick={handleToggleSave}
          aria-label={isSaved ? "Remove from saved" : "Save parking"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isSaved
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-700 shadow-sm hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white stroke-white' : ''}`} />
        </button>

        {/* Vehicle spot type tag */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{parking.distance}</span>
          </div>

          {isBikeOnly && (
            <span className="bg-amber-500/90 text-white backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
              <Bike className="w-3 h-3" />
              <span>Bike Deck</span>
            </span>
          )}
        </div>

        {/* Bottom image overlay: Price / hr */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
          <div className="flex items-baseline gap-1 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-lg">
            <span className="text-base font-extrabold text-white">
              ₹{parking.pricePerHour}
            </span>
            <span className="text-xs text-slate-300 font-medium">/hour</span>
          </div>

          <div className="bg-emerald-600/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-white flex items-center gap-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>{parking.availableSlots} free</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {parking.name}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {parking.area}, {parking.city}
            </p>
          </div>
        </div>

        {/* Rating and review stats */}
        <div className="flex items-center justify-between">
          <Rating score={parking.rating} reviewCount={parking.reviewCount} size="sm" />
        </div>

        {/* Amenities preview */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {parking.amenities.slice(0, 3).map((amenity) => (
            <AmenityCard key={amenity} name={amenity} />
          ))}
          {parking.amenities.length > 3 && (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              +{parking.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="text-xs text-slate-500 font-medium">
            Total {parking.totalSlots} spaces
          </div>
          <button
            onClick={handleViewDetails}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white transition-all border border-emerald-200 hover:border-emerald-600 shadow-sm group/btn"
          >
            <span>{!isLoggedIn ? 'Sign In to View' : 'View Details'}</span>
            {!isLoggedIn ? (
              <Lock className="w-3.5 h-3.5 text-emerald-600 group-hover/btn:text-white" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingCard;
