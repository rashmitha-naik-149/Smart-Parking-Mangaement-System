import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialBookings } from '../data/bookingData';
import { useNotification } from './NotificationContext';
import { useParking } from './ParkingContext';
import { useAuth } from './AuthContext';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const { showToast } = useNotification();
  const { updateSlotStatus } = useParking();
  const { user } = useAuth();

  const [allBookings, setAllBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('smartpark_all_bookings');
      if (saved) return JSON.parse(saved);
      // Tag initial demo bookings to demo user
      return initialBookings.map((b) => ({
        ...b,
        userEmail: 'rashmi@example.com'
      }));
    } catch {
      return initialBookings.map((b) => ({
        ...b,
        userEmail: 'rashmi@example.com'
      }));
    }
  });

  const [latestBooking, setLatestBooking] = useState(null);

  // Fetch real bookings from MongoDB backend on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/bookings');
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            setAllBookings(list);
            localStorage.setItem('smartpark_all_bookings', JSON.stringify(list));
          }
        }
      } catch (err) {
        console.warn('Booking fetch notice:', err.message);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    localStorage.setItem('smartpark_all_bookings', JSON.stringify(allBookings));
  }, [allBookings]);

  // Requirement 13: Filter bookings by currently logged in user!
  const userBookings = useMemo(() => {
    if (!user || !user.email) return [];
    const currentEmail = user.email.toLowerCase();
    // Admin operators can see all bookings in the system for administrative supervision
    if (user.role === 'admin') {
      return allBookings;
    }
    // Drivers only see their own reservations
    return allBookings.filter(
      (b) => b.userEmail && b.userEmail.toLowerCase() === currentEmail
    );
  }, [allBookings, user]);

  const createBooking = async (bookingData) => {
    const userEmail = (user?.email || bookingData.userEmail || 'driver@example.com').toLowerCase();
    const bookingId = `SP${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(100 + Math.random() * 900)}`;

    const newBooking = {
      id: bookingId,
      parkingId: bookingData.parkingId,
      parkingName: bookingData.parkingName,
      area: bookingData.area,
      slotNumber: bookingData.slotNumber || 'A-12',
      slotLevel: bookingData.slotLevel || 'Level 1',
      date: bookingData.date || new Date().toISOString().split('T')[0],
      startTime: bookingData.startTime || '10:00 AM',
      endTime: bookingData.endTime || '12:00 PM',
      durationHours: Number(bookingData.durationHours) || 2,
      ratePerHour: Number(bookingData.ratePerHour) || 30,
      parkingFee: Number(bookingData.parkingFee) || 60,
      serviceFee: 0,
      totalAmount: Number(bookingData.totalAmount) || 60,
      vehicleId: bookingData.vehicleId,
      vehicleNumber: bookingData.vehicleNumber || 'KA-01-AB-1234',
      vehicleModel: bookingData.vehicleModel || 'Car',
      userEmail,
      userName: user?.name || 'Driver',
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: bookingData.paymentMethod || 'UPI (Google Pay)',
      createdAt: new Date().toISOString(),
      qrCode: `SP-${bookingData.slotNumber || 'A12'}-${bookingId}`,
      hasReviewed: false
    };

    // Attempt backend dispatch of email confirmation
    try {
      fetch('http://127.0.0.1:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBooking)
      }).catch(() => {});
    } catch {}

    setAllBookings((prev) => [newBooking, ...prev]);
    setLatestBooking(newBooking);

    // Reserve slot in parking state
    if (bookingData.parkingId && bookingData.slotId) {
      updateSlotStatus(bookingData.parkingId, bookingData.slotId, 'reserved');
    }

    showToast(`Reservation confirmed! Booking ID: ${bookingId}`);
    return newBooking;
  };

  const cancelBooking = (id) => {
    setAllBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          if (b.parkingId && b.slotId) {
            updateSlotStatus(b.parkingId, b.slotId, 'available');
          }
          return { ...b, status: 'cancelled' };
        }
        return b;
      })
    );
    showToast(`Booking ${id} has been cancelled. Refund initiated.`, 'info');
  };

  const completeBooking = (id) => {
    setAllBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          if (b.parkingId && b.slotId) {
            updateSlotStatus(b.parkingId, b.slotId, 'available');
          }
          return {
            ...b,
            status: 'completed',
            completedAt: new Date().toISOString()
          };
        }
        return b;
      })
    );
    showToast(`Parking session completed! You can now rate and review your experience.`);
  };

  // Option: Extend booking duration
  const extendBooking = (id, extraHours = 1) => {
    setAllBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const newDuration = b.durationHours + extraHours;
          const additionalFee = b.ratePerHour * extraHours;
          const newTotal = b.totalAmount + additionalFee;

          showToast(`Extended parking by ${extraHours} hr (+₹${additionalFee}). New Total: ₹${newTotal}`);
          return {
            ...b,
            durationHours: newDuration,
            totalAmount: newTotal,
            parkingFee: b.parkingFee + additionalFee
          };
        }
        return b;
      })
    );
  };

  // Requirement 7: User Review Submission for Completed/Active Parking
  const submitReviewForBooking = (bookingId, reviewData) => {
    setAllBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            hasReviewed: true,
            userReview: reviewData
          };
        }
        return b;
      })
    );
    showToast('Thank you for rating your parking experience! Review submitted.');
  };

  return (
    <BookingContext.Provider
      value={{
        bookings: userBookings,
        allBookings,
        latestBooking,
        setLatestBooking,
        createBooking,
        cancelBooking,
        completeBooking,
        extendBooking,
        submitReviewForBooking
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
