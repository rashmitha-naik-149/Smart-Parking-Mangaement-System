import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialVehicles } from '../data/vehicleData';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

const VehicleContext = createContext(null);

export const VehicleProvider = ({ children }) => {
  const { showToast } = useNotification();
  const { user } = useAuth();

  // Initialize vehicles with assigned user emails for demo data
  const [allVehicles, setAllVehicles] = useState(() => {
    try {
      const saved = localStorage.getItem('smartpark_all_vehicles');
      if (saved) return JSON.parse(saved);
      // Tag initial demo vehicles to the demo driver
      return initialVehicles.map((v) => ({
        ...v,
        userEmail: 'rashmi@example.com'
      }));
    } catch {
      return initialVehicles.map((v) => ({
        ...v,
        userEmail: 'rashmi@example.com'
      }));
    }
  });

  useEffect(() => {
    localStorage.setItem('smartpark_all_vehicles', JSON.stringify(allVehicles));
  }, [allVehicles]);

  // Requirement 13: Filter vehicles so each user only sees their own vehicles!
  const userVehicles = useMemo(() => {
    if (!user || !user.email) return [];
    const currentEmail = user.email.toLowerCase();
    return allVehicles.filter(
      (v) => v.userEmail && v.userEmail.toLowerCase() === currentEmail
    );
  }, [allVehicles, user]);

  const addVehicle = (vehicleData) => {
    if (!user) {
      showToast('Please sign in to register a vehicle.', 'error');
      return null;
    }

    const currentEmail = user.email.toLowerCase();
    const newVehicle = {
      id: `veh-${Date.now()}`,
      model: vehicleData.model,
      plateNumber: vehicleData.plateNumber.toUpperCase(),
      type: vehicleData.type || 'Car',
      fuel: vehicleData.fuel || 'Petrol',
      color: vehicleData.color || 'Silver',
      userEmail: currentEmail,
      isDefault: userVehicles.length === 0
    };

    setAllVehicles((prev) => [newVehicle, ...prev]);
    showToast(`Vehicle ${newVehicle.plateNumber} added to your account!`);
    return newVehicle;
  };

  const editVehicle = (id, updatedData) => {
    setAllVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedData } : v))
    );
    showToast('Vehicle details updated successfully!');
  };

  const deleteVehicle = (id) => {
    setAllVehicles((prev) => prev.filter((v) => v.id !== id));
    showToast('Vehicle removed from your garage.', 'info');
  };

  const setDefaultVehicle = (id) => {
    if (!user) return;
    const currentEmail = user.email.toLowerCase();
    setAllVehicles((prev) =>
      prev.map((v) => {
        if (v.userEmail?.toLowerCase() === currentEmail) {
          return { ...v, isDefault: v.id === id };
        }
        return v;
      })
    );
    showToast('Default vehicle updated.');
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles: userVehicles,
        allVehicles,
        addVehicle,
        editVehicle,
        deleteVehicle,
        setDefaultVehicle
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return context;
};

export default VehicleContext;
