import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Car, Bike, Sparkles, ShieldCheck } from 'lucide-react';
import VehicleCard from '../components/VehicleCard';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import { useVehicles } from '../context/VehicleContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const MyVehicles = () => {
  const navigate = useNavigate();
  const { vehicles, addVehicle, editVehicle, deleteVehicle, setDefaultVehicle } = useVehicles();
  const { isLoggedIn } = useAuth();
  const { showToast } = useNotification();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      showToast('Please sign in to manage your vehicle garage.', 'info');
      navigate('/login?redirect=/vehicles');
    }
  }, [isLoggedIn, navigate, showToast]);

  if (!isLoggedIn) return null;

  // Form states
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [type, setType] = useState('Car');
  const [fuel, setFuel] = useState('Petrol');
  const [color, setColor] = useState('');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!model.trim() || !plateNumber.trim()) return;

    addVehicle({
      model,
      plateNumber,
      type,
      fuel,
      color: color || 'Silver'
    });

    // Reset & close
    setModel('');
    setPlateNumber('');
    setColor('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Vehicles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registered vehicles for automatic barrier entry and quick reservations.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddModal(true)}
          icon={Plus}
        >
          Add Vehicle
        </Button>
      </div>

      {/* ANPR Automatic Check-in Notice banner */}
      <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3.5">
        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-emerald-900">
          <strong className="font-bold block text-sm">Automated ANPR Camera Entry</strong>
          Keep your license plate numbers accurate. Partner facilities with automated plate readers will open barrier gates automatically upon approach!
        </div>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Car className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              No vehicles registered yet
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your car or two-wheeler for effortless one-click parking reservations.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddModal(true)}
            icon={Plus}
          >
            Add Your First Vehicle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={editVehicle}
              onDelete={deleteVehicle}
              onSetDefault={setDefaultVehicle}
            />
          ))}
        </div>
      )}

      {/* Add Vehicle Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Vehicle"
        description="Add a car or bike to your SmartPark profile"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {/* Vehicle Type Choice */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Vehicle Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('Car')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                  type === 'Car'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Car className="w-4 h-4" />
                <span>Four Wheeler / Car</span>
              </button>
              <button
                type="button"
                onClick={() => setType('Bike')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                  type === 'Bike'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Two Wheeler / Bike</span>
              </button>
            </div>
          </div>

          <Input
            label="Vehicle Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Hyundai i20 / Tata Nexon / Royal Enfield"
            required
          />

          <Input
            label="Registration / Number Plate"
            value={plateNumber}
            onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
            placeholder="e.g. KA-01-AB-1234"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Fuel Type</label>
              <select
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 text-sm px-3 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric (EV)</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <Input
              label="Vehicle Color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. White / Black"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Add Vehicle
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyVehicles;
