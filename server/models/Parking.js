import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  level: { type: String, default: 'Level 1' },
  status: { type: String, enum: ['available', 'occupied', 'reserved', 'maintenance'], default: 'available' },
  type: { type: String, enum: ['Car', 'Bike'], default: 'Car' },
  hasEV: { type: Boolean, default: false }
});

const parkingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  area: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  totalSlots: { type: Number, default: 50 },
  availableSlots: { type: Number, default: 25 },
  occupiedSlots: { type: Number, default: 20 },
  reservedSlots: { type: Number, default: 5 },
  pricePerHour: { type: Number, default: 30 },
  distance: { type: String, default: '0.8 km away' },
  distanceKm: { type: Number, default: 0.8 },
  rating: { type: Number, default: 4.7 },
  reviewCount: { type: Number, default: 120 },
  image: { type: String, required: true },
  amenities: [{ type: String }],
  vehicleTypes: [{ type: String }],
  rules: [{ type: String }],
  description: { type: String },
  slots: [slotSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Parking = mongoose.models.Parking || mongoose.model('Parking', parkingSchema);
export default Parking;
