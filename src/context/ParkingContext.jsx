import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { parkingLocations } from '../data/parkingData';
import { useNotification } from './NotificationContext';

const ParkingContext = createContext(null);

export const ParkingProvider = ({ children }) => {
  const { showToast } = useNotification();
  const [parkingList, setParkingList] = useState(() => {
    try {
      const saved = localStorage.getItem('smartpark_locations');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 50) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored parking locations:', e);
    }
    return parkingLocations;
  });

  // Fetch live parking facilities from MongoDB backend on mount
  useEffect(() => {
    const fetchFromDB = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/parking');
        if (res.ok) {
          const result = await res.json();
          if (result && Array.isArray(result.data) && result.data.length > 0) {
            setParkingList(result.data);
            localStorage.setItem('smartpark_locations', JSON.stringify(result.data));
          }
        }
      } catch (err) {
        console.warn('Backend parking fetch error (using fallback):', err.message);
      }
    };
    fetchFromDB();
  }, []);

  useEffect(() => {
    localStorage.setItem('smartpark_locations', JSON.stringify(parkingList));
  }, [parkingList]);

  const [selectedParkingId, setSelectedParkingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended', 'distance', 'price-low', 'rating'

  // Filter states
  const [filters, setFilters] = useState({
    distanceMaxKm: 50, // Default to 50 km so it doesn't accidentally block locations in other areas
    priceMax: 100,
    availableOnly: false,
    vehicleType: 'All', // 'All', 'Car', 'Bike'
    facilities: [] // e.g. ['CCTV', 'EV Charging', 'Covered Parking']
  });

  const resetFilters = () => {
    setFilters({
      distanceMaxKm: 50,
      priceMax: 100,
      availableOnly: false,
      vehicleType: 'All',
      facilities: []
    });
    setSearchQuery('');
    setSortBy('recommended');
    showToast('Filters reset to default', 'info');
  };

  // Filtered and sorted locations
  const filteredParking = useMemo(() => {
    return parkingList
      .filter((park) => {
        // Search query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = park.name?.toLowerCase().includes(q);
          const matchArea = park.area?.toLowerCase().includes(q);
          const matchAddress = park.address?.toLowerCase().includes(q);
          const matchCity = park.city ? park.city.toLowerCase().includes(q) : false;
          if (!matchName && !matchArea && !matchAddress && !matchCity) return false;
        }

        // Distance filter
        if (park.distanceKm && park.distanceKm > filters.distanceMaxKm) return false;

        // Price filter: compare number safely
        const price = Number(park.pricePerHour ?? park.price ?? 0);
        if (filters.priceMax && price > filters.priceMax) return false;

        // Availability filter
        if (filters.availableOnly && park.availableSlots <= 0) return false;

        // Vehicle type filter
        if (filters.vehicleType !== 'All') {
          if (!park.vehicleTypes?.includes(filters.vehicleType)) return false;
        }

        // Facilities / Amenities
        if (filters.facilities.length > 0) {
          const hasAllFacilities = filters.facilities.every((f) =>
            park.amenities?.includes(f)
          );
          if (!hasAllFacilities) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
        if (sortBy === 'price-low') return a.pricePerHour - b.pricePerHour;
        if (sortBy === 'price-high') return b.pricePerHour - a.pricePerHour;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default recommended: high rating and good availability
        return b.rating * (b.availableSlots > 0 ? 1.2 : 0.8) - a.rating * (a.availableSlots > 0 ? 1.2 : 0.8);
      });
  }, [parkingList, searchQuery, sortBy, filters]);

  // Admin / Booking slot status update
  const updateSlotStatus = (parkingId, slotId, newStatus) => {
    setParkingList((prev) =>
      prev.map((park) => {
        if (park.id !== parkingId) return park;

        const updatedSlots = (park.slots || []).map((s) =>
          s.id === slotId ? { ...s, status: newStatus } : s
        );

        const availableSlots = updatedSlots.filter((s) => s.status === 'available').length;
        const occupiedSlots = updatedSlots.filter((s) => s.status === 'occupied').length;
        const reservedSlots = updatedSlots.filter((s) => s.status === 'reserved').length;

        return {
          ...park,
          slots: updatedSlots,
          availableSlots,
          occupiedSlots,
          reservedSlots
        };
      })
    );

    // Sync to backend MongoDB
    fetch(`http://127.0.0.1:5000/api/parking/${parkingId}/slots/${slotId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(err => console.warn('Slot status DB sync notice:', err.message));
  };

  // Admin add parking
  const addParkingLocation = (newParkingData) => {
    const newId = `park-${String(parkingList.length + 1).padStart(2, '0')}`;
    const newLocation = {
      ...newParkingData,
      id: newId,
      distanceKm: newParkingData.distanceKm || 1.5,
      distance: `${newParkingData.distanceKm || 1.5} km away`,
      rating: 4.8,
      reviewCount: 1,
      image: newParkingData.image || "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80",
      slots: Array.from({ length: newParkingData.totalSlots || 20 }, (_, i) => {
        const row = i < 10 ? 'A' : 'B';
        const num = (i % 10) + 1;
        return {
          id: `${row}${num}`,
          name: `Slot ${row}${num}`,
          level: 'Level 1',
          status: 'available',
          type: 'Car',
          hasEV: i % 4 === 0
        };
      })
    };

    setParkingList((prev) => [newLocation, ...prev]);
    showToast(`Added "${newLocation.name}" to parking facilities!`);

    // Sync to MongoDB backend
    fetch('http://127.0.0.1:5000/api/parking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLocation)
    }).catch(err => console.warn('Add parking DB sync notice:', err.message));
  };

  // Admin update parking
  const updateParkingLocation = (id, updatedData) => {
    setParkingList((prev) =>
      prev.map((park) => (park.id === id ? { ...park, ...updatedData } : park))
    );
    showToast('Parking facility details updated!');

    // Sync to MongoDB backend
    fetch(`http://127.0.0.1:5000/api/parking/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    }).catch(err => console.warn('Update parking DB sync notice:', err.message));
  };

  // Admin delete parking
  const deleteParkingLocation = (id) => {
    setParkingList((prev) => prev.filter((park) => park.id !== id));
    showToast('Parking facility removed.', 'info');

    // Sync to MongoDB backend
    fetch(`http://127.0.0.1:5000/api/parking/${id}`, {
      method: 'DELETE'
    }).catch(err => console.warn('Delete parking DB sync notice:', err.message));
  };

  return (
    <ParkingContext.Provider
      value={{
        parkingList,
        filteredParking,
        selectedParkingId,
        setSelectedParkingId,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filters,
        setFilters,
        resetFilters,
        updateSlotStatus,
        addParkingLocation,
        updateParkingLocation,
        deleteParkingLocation
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
