import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, default: '+91 98765 00000' },
  password: { type: String, default: 'password123' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80' },
  city: { type: String, default: 'Bengaluru' },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  verificationCode: { type: String },
  verificationExpires: { type: Date },
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
  savedParkingIds: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
