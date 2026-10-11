import React, { useState } from 'react';
import {
  Grid,
  RefreshCw,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  ChevronDown
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

export const AdminSlots = () => {
  const { parkingList, updateSlotStatus } = useParking();

  const [selectedFacilityId, setSelectedFacilityId] = useState(
    parkingList[0]?.id || 'park-01'
  );
  const [activeSlotToEdit, setActiveSlotToEdit] = useState(null);

  const currentFacility =
    parkingList.find((p) => p.id === selectedFacilityId) || parkingList[0];

  const slots = currentFacility?.slots || [];

  const availableCount = slots.filter((s) => s.status === 'available').length;
  const occupiedCount = slots.filter((s) => s.status === 'occupied').length;
  const reservedCount = slots.filter((s) => s.status === 'reserved').length;
  const maintenanceCount = slots.filter((s) => s.status === 'maintenance').length;

  const handleStatusChange = (newStatus) => {
    if (activeSlotToEdit && currentFacility) {
      updateSlotStatus(currentFacility.id, activeSlotToEdit.id, newStatus);
      setActiveSlotToEdit(null);
    }
  };

  const statusConfigs = {
    available: {
      label: 'Available',
      bg: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300',
      dot: 'bg-emerald-500',
      icon: CheckCircle2
    },
    occupied: {
      label: 'Occupied',
      bg: 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300',
      dot: 'bg-rose-500',
      icon: XCircle
    },
    reserved: {
      label: 'Reserved',
      bg: 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300',
      dot: 'bg-amber-500',
      icon: Clock
    },
    maintenance: {
      label: 'Maintenance',
      bg: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300',
      dot: 'bg-slate-700',
      icon: Wrench
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Facility Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Parking Slots Sensor Grid
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any bay to manually override IoT sensor state or place slot in maintenance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Facility:</label>
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 shadow-sm"
          >
            {parkingList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.area})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Real-time Status Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Available</span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-0.5">
              {availableCount}
            </div>
          </div>
          <span className="w-4 h-4 rounded-full bg-emerald-500" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Occupied</span>
            <div className="text-2xl font-extrabold text-rose-700 mt-0.5">
              {occupiedCount}
            </div>
          </div>
          <span className="w-4 h-4 rounded-full bg-rose-500" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Reserved</span>
            <div className="text-2xl font-extrabold text-amber-700 mt-0.5">
              {reservedCount}
            </div>
          </div>
          <span className="w-4 h-4 rounded-full bg-amber-500" />
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Maintenance</span>
            <div className="text-2xl font-extrabold text-slate-700 mt-0.5">
              {maintenanceCount}
            </div>
          </div>
          <span className="w-4 h-4 rounded-full bg-slate-700" />
        </div>
      </div>

      {/* Visual Slot Grid Component */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {currentFacility.name} — Floor Bays
            </h3>
            <p className="text-xs text-slate-500">
              Live automated gate and ultrasonic sensor grid
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Occupied
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Reserved
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> Maintenance
            </span>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2.5">
          {slots.map((slot) => {
            const config = statusConfigs[slot.status] || statusConfigs.available;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setActiveSlotToEdit(slot)}
                className={`p-3 rounded-2xl border transition-all text-center flex flex-col items-center justify-between min-h-[72px] cursor-pointer hover:scale-105 hover:shadow-md ${config.bg}`}
              >
                <div className="w-full flex items-center justify-between">
                  <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                  {slot.hasEV && <Zap className="w-3 h-3 text-amber-500" />}
                </div>

                <div className="font-extrabold text-sm tracking-tight text-slate-900">
                  {slot.id}
                </div>

                <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  {slot.status}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slot Status Modifier Modal */}
      <Modal
        isOpen={Boolean(activeSlotToEdit)}
        onClose={() => setActiveSlotToEdit(null)}
        title={`Update Slot ${activeSlotToEdit?.id}`}
        description="Override telemetry or schedule bay maintenance"
        maxWidth="max-w-sm"
      >
        <div className="space-y-3 pt-2 text-left">
          <p className="text-xs text-slate-500 mb-2">
            Current status: <strong className="uppercase">{activeSlotToEdit?.status}</strong>
          </p>

          <div className="grid grid-cols-1 gap-2">
            {[
              { key: 'available', label: 'Mark as Available (Free)', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
              { key: 'occupied', label: 'Mark as Occupied (Car Parked)', color: 'bg-rose-50 text-rose-800 border-rose-300' },
              { key: 'reserved', label: 'Mark as Reserved (Pre-booked)', color: 'bg-amber-50 text-amber-800 border-amber-300' },
              { key: 'maintenance', label: 'Mark for Maintenance / Out of Service', color: 'bg-slate-100 text-slate-800 border-slate-300' }
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => handleStatusChange(option.key)}
                className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all hover:scale-[1.02] ${option.color}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveSlotToEdit(null)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminSlots;
