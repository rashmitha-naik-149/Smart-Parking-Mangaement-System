import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  parkingId: { type: String, required: true },
  parkingName: { type: String, required: true },
  area: { type: String, required: true },
  slotNumber: { type: String, required: true },
  slotLevel: { type: String, default: 'Level 1' },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  durationHours: { type: Number, default: 2 },
  ratePerHour: { type: Number, default: 30 },
  parkingFee: { type: Number, default: 60 },
  totalAmount: { type: Number, default: 60 },
  vehicleNumber: { type: String, required: true },
  vehicleModel: { type: String, default: 'Car' },
  userEmail: { type: String, required: true },
  status: { type: String, enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed' },
  paymentStatus: { type: String, default: 'paid' },
  qrCode: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
