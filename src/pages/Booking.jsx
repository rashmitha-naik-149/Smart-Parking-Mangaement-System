import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Zap,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { useVehicles } from '../context/VehicleContext';
import { useBookings } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ParkingGrid from '../components/ParkingGrid';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';

export const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { parkingList } = useParking();
  const { vehicles, addVehicle } = useVehicles();
  const { createBooking } = useBookings();
  const { user, isLoggedIn } = useAuth();
  const { showToast } = useNotification();

  // Redirect if not signed in
  useEffect(() => {
    if (!isLoggedIn) {
      showToast('Please sign in to complete your parking reservation.', 'info');
      navigate(`/login?redirect=${encodeURIComponent(`/booking/${id}`)}`);
    }
  }, [isLoggedIn, navigate, id, showToast]);

  const parking = parkingList.find((p) => p.id === id) || parkingList[0];

  // Dynamic today's date formatted as YYYY-MM-DD
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Reservation form state
  const [date, setDate] = useState(todayStr);
  const [dateError, setDateError] = useState('');
  const [arrivalTime, setArrivalTime] = useState('10:00 AM');
  const [durationHours, setDurationHours] = useState(2);
  const [selectedVehicleId, setSelectedVehicleId] = useState(
    vehicles[0]?.id || 'veh-01'
  );
  const [selectedSlot, setSelectedSlot] = useState(
    parking?.slots?.find((s) => s.status === 'available') || { id: 'A1', name: 'Slot A1' }
  );
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newVehicleType, setNewVehicleType] = useState('Car');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Price Calculation
  const hourlyRate = parking?.pricePerHour || 30;
  const parkingFee = hourlyRate * durationHours;
  const serviceFee = 0;
  const totalAmount = parkingFee + serviceFee;

  const currentVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  const handleDateChange = (val) => {
    setDate(val);
    if (!val || !val.trim()) {
      setDateError('Please select a valid parking date.');
      return;
    }
    if (val < todayStr) {
      setDateError('Invalid date: Cannot reserve parking for a past date. Please select today or an upcoming date.');
    } else {
      setDateError('');
    }
  };

  const validateBookingDateTime = () => {
    if (!date || !date.trim()) {
      setDateError('Please select a valid parking date.');
      showToast('Please select a valid parking date.', 'error');
      return false;
    }

    if (date < todayStr) {
      setDateError('Invalid date: Cannot reserve parking for a past date. Please pick today or an upcoming date.');
      showToast('Invalid date: Cannot book for a past date.', 'error');
      return false;
    }

    // Check if arrival time has passed if booking for today
    if (date === todayStr) {
      const currentTime = new Date();
      const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

      const match = arrivalTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let h = parseInt(match[1]);
        const m = parseInt(match[2]);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const selectedMinutes = h * 60 + m;

        // If selected time is more than 30 minutes in the past today
        if (selectedMinutes < currentMinutes - 30) {
          setDateError(`Arrival time (${arrivalTime}) has already passed for today. Please select an upcoming arrival time.`);
          showToast(`Arrival time (${arrivalTime}) has already passed today.`, 'error');
          return false;
        }
      }
    }

    setDateError('');
    return true;
  };

  const handleAddNewVehicle = (e) => {
    e.preventDefault();
    if (!newVehicleModel.trim() || !newVehiclePlate.trim()) return;
    const created = addVehicle({
      model: newVehicleModel,
      plateNumber: newVehiclePlate,
      type: newVehicleType
    });
    setSelectedVehicleId(created.id);
    setShowAddVehicleModal(false);
    setNewVehicleModel('');
    setNewVehiclePlate('');
  };

  const handleConfirmReservation = async (e) => {
    e.preventDefault();

    if (!validateBookingDateTime()) {
      return;
    }

    setIsSubmitting(true);

    const newBooking = await createBooking({
      parkingId: parking.id,
      parkingName: parking.name,
      area: parking.area,
      slotId: selectedSlot?.id,
      slotNumber: selectedSlot?.id || 'A-12',
      slotLevel: selectedSlot?.level || 'Level 1',
      date,
      startTime: arrivalTime,
      endTime: calculateEndTime(arrivalTime, durationHours),
      durationHours,
      ratePerHour: hourlyRate,
      parkingFee,
      totalAmount,
      vehicleId: selectedVehicleId,
      vehicleNumber: currentVehicle?.plateNumber || 'KA-01-AB-1234',
      vehicleModel: currentVehicle?.model || 'Hyundai i20',
      userEmail: user?.email || 'driver@example.com'
    });

    setIsSubmitting(false);
    navigate('/booking-success');
  };

  const calculateEndTime = (startStr, hours) => {
    const match = startStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return '12:00 PM';
    let h = parseInt(match[1]);
    const m = match[2];
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const endH24 = (h + hours) % 24;
    const finalAmpm = endH24 >= 12 ? 'PM' : 'AM';
    const finalH = endH24 % 12 === 0 ? 12 : endH24 % 12;
    return `${finalH}:${m} ${finalAmpm}`;
  };

  if (!isLoggedIn) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* Top back navigation */}
      <Link
        to={`/parking/${parking.id}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to {parking.name}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL: Parking Details Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Parking Facility Details
            </h3>

            <div className="flex gap-4 items-center">
              <img
                src={parking.image}
                alt={parking.name}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-slate-200"
              />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {parking.name}
                </h4>
                <p className="text-xs text-slate-500">{parking.address}</p>
                <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                  ₹{parking.pricePerHour}/hour
                </div>
              </div>
            </div>

            {/* Selected Slot preview */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  Chosen Parking Bay
                </span>
                <span className="text-lg font-extrabold text-slate-900">
                  Slot {selectedSlot?.id || 'A-01'}
                </span>
                <span className="text-xs text-slate-500 block">
                  {selectedSlot?.level || 'Level 1'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                🅿
              </div>
            </div>

            {/* Slot selector map preview */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Click a bay to pick your preferred slot:
              </span>
              <ParkingGrid
                slots={parking.slots.slice(0, 16)}
                selectedSlotId={selectedSlot?.id}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Reserve Parking Form */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleConfirmReservation}
            className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl space-y-6"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Reserve Parking
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Specify your expected arrival time and vehicle details. Confirmation pass will be dispatched to {user?.email}.
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <Input
                  label="Date of Parking"
                  type="date"
                  value={date}
                  min={todayStr}
                  onChange={(e) => handleDateChange(e.target.value)}
                  icon={Calendar}
                  error={dateError}
                  required
                />

              {/* Arrival Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Arrival Time
                </label>
                <div className="relative">
                  <select
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white text-slate-900 text-sm px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {[
                      '08:00 AM',
                      '09:00 AM',
                      '10:00 AM',
                      '11:00 AM',
                      '12:00 PM',
                      '01:00 PM',
                      '02:00 PM',
                      '03:00 PM',
                      '04:00 PM',
                      '05:00 PM',
                      '06:00 PM',
                      '07:00 PM',
                      '08:00 PM'
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {dateError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{dateError}</span>
              </div>
            )}
          </div>

            {/* Duration Slider / Select */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">
                  Parking Duration
                </label>
                <span className="font-bold text-emerald-700">
                  {durationHours} {durationHours === 1 ? 'Hour' : 'Hours'}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 8].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDurationHours(hrs)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                      durationHours === hrs
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {hrs} {hrs === 1 ? 'hr' : 'hrs'}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Select Vehicle
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(true)}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {vehicles.map((v) => {
                  const isSelected = selectedVehicleId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVehicleId(v.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Car className={`w-4 h-4 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {v.model}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {v.plateNumber}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price calculation breakdown */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2.5 text-sm">
              <div className="flex items-center justify-between text-slate-600 text-xs">
                <span>
                  Parking fee (₹{hourlyRate} × {durationHours} hrs)
                </span>
                <span className="font-semibold text-slate-900">₹{parkingFee}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 text-xs">
                <span>Platform & Service fee</span>
                <span className="font-bold text-emerald-600">₹{serviceFee}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-extrabold text-base text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-700">₹{totalAmount}</span>
              </div>
            </div>

            {/* Submit Confirmation button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full text-base font-bold shadow-md shadow-emerald-600/20"
            >
              Confirm Reservation (₹{totalAmount})
            </Button>
          </form>
        </div>
      </div>

      {/* Add Vehicle Quick Modal */}
      <Modal
        isOpen={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        title="Add Vehicle to Garage"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddNewVehicle} className="space-y-4">
          <Input
            label="Vehicle Model"
            value={newVehicleModel}
            onChange={(e) => setNewVehicleModel(e.target.value)}
            placeholder="e.g. Maruti Swift / Honda City / Duke 390"
            required
          />

          <Input
            label="Registration Number"
            value={newVehiclePlate}
            onChange={(e) => setNewVehiclePlate(e.target.value.toUpperCase())}
            placeholder="e.g. KA-02-MN-4321"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['Car', 'Bike'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewVehicleType(t)}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    newVehicleType === t
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setShowAddVehicleModal(false)}
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

export default Booking;
