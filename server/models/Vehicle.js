import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  model: { type: String, required: true },
  plateNumber: { type: String, required: true },
  type: { type: String, enum: ['Car', 'Bike'], default: 'Car' },
  fuel: { type: String, default: 'Petrol' },
  color: { type: String, default: 'Silver' },
  isDefault: { type: Boolean, default: false },
  userEmail: { type: String, default: 'rashmi@example.com' },
  createdAt: { type: Date, default: Date.now }
});

export const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
