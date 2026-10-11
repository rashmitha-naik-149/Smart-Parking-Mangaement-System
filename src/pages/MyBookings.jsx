import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarCheck, Search, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import BookingCard from '../components/BookingCard';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/Button';

export const MyBookings = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking } = useBookings();
  const { isLoggedIn } = useAuth();
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    if (!isLoggedIn) {
      showToast('Please sign in to view your parking reservations.', 'info');
      navigate('/login?redirect=/bookings');
    }
  }, [isLoggedIn, navigate, showToast]);

  if (!isLoggedIn) return null;

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'confirmed';
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const tabCounts = {
    upcoming: bookings.filter((b) => b.status === 'confirmed').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your active parking reservations, passes, and booking history.
          </p>
        </div>

        <Link to="/search">
          <Button variant="primary" size="md" icon={Search}>
            Book New Parking
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        {[
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                activeTab === tab.key
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List / Grid */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              No {activeTab} bookings found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {activeTab === 'upcoming'
                ? "You don't have any active reservations right now. Need a parking spot?"
                : `You don't have any ${activeTab} reservations in your account history.`}
            </p>
          </div>
          {activeTab === 'upcoming' && (
            <Link to="/search" className="inline-block pt-2">
              <Button variant="primary" size="md">
                Find Parking Now
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={(id) => cancelBooking(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
