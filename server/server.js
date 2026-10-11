import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { Parking } from './models/Parking.js';
import { User } from './models/User.js';
import { Booking } from './models/Booking.js';
import { Vehicle } from './models/Vehicle.js';
import { parkingLocations } from '../src/data/parkingData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory fallback data if MongoDB ever gets disconnected
let memoryUsers = [];
let memoryBookings = [];
let memoryParkings = [...parkingLocations];

let isMongoConnected = false;
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartparking';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    isMongoConnected = true;
    console.log('✅ MongoDB Connected successfully to:', mongoUri);
  } catch (err) {
    isMongoConnected = false;
    console.log('ℹ️ MongoDB daemon fallback active:', err.message);
  }
};
connectDB();

// Setup Nodemailer transporter
let transporter = null;
const initMailer = async () => {
  try {
    const user = (process.env.SMTP_USER || '').trim().replace(/^["']|["']$/g, '');
    const pass = (process.env.SMTP_PASS || '').trim().replace(/^["']|["']$/g, '').replace(/\s+/g, '');

    if (user && pass) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });
      await transporter.verify();
      console.log('📧 Live Gmail SMTP Service Verified & Ready for user:', user);
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('📧 Nodemailer Ethereal Test Account Ready:', testAccount.user);
    }
  } catch (err) {
    console.error('⚠️ Could not initialize Nodemailer:', err.message);
  }
};
initMailer();

// Helper: Send Registration Email
const sendRegistrationEmail = async (email, name, role, verificationCode) => {
  const isOperator = role === 'admin';
  const roleTitle = isOperator ? 'Parking Operator / Admin' : 'Driver / Vehicle Owner';

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <div style="font-size: 36px; line-height: 1; margin-bottom: 8px;">🅿</div>
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Welcome to SmartPark!</h1>
        <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Smart Parking Discovery & Guaranteed Reservations</p>
      </div>

      <div style="padding: 32px 24px; color: #1e293b;">
        <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Hello ${name},</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for joining SmartPark as a <strong>${roleTitle}</strong>. To complete your account registration, please enter the one-time verification code below on the registration screen:
        </p>

        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px 20px; margin: 24px 0; text-align: center;">
          <div style="font-size: 12px; font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Your 6-Digit Email Verification Code</div>
          <div style="font-size: 36px; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: 8px; color: #047857;">${verificationCode}</div>
          <div style="font-size: 12px; color: #047857; margin-top: 8px;">Valid for 15 minutes • Do not share this code</div>
        </div>

        <p style="font-size: 13px; line-height: 1.5; color: #64748b;">
          If you did not attempt to register on SmartPark, please disregard this email.
        </p>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
          © 2026 SmartPark Technologies Pvt. Ltd. Bengaluru, India.
        </div>
      </div>
    </div>
  `;

  if (!transporter) return { success: true, simulated: true, recipient: email };

  try {
    const sender = (process.env.SMTP_USER || process.env.FROM_EMAIL || 'smartparking209@gmail.com').trim().replace(/^["']|["']$/g, '');
    const info = await transporter.sendMail({
      from: `"SmartPark Platform" <${sender}>`,
      to: email,
      subject: `SmartPark Verification Code: ${verificationCode}`,
      html: htmlContent
    });

    console.log(`✉️ Registration verification email delivered to ${email}, messageId: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      recipient: email
    };
  } catch (error) {
    console.error('Registration email error:', error);
    return { success: false, error: error.message };
  }
};

// Helper: Send Forgot Password OTP Email
const sendPasswordResetEmail = async (email, name, resetCode) => {
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <div style="font-size: 36px; line-height: 1; margin-bottom: 8px;">🔐</div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 800;">Password Reset Request</h1>
        <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 13px;">SmartPark Account Security</p>
      </div>

      <div style="padding: 32px 24px; color: #1e293b;">
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Hello <strong>${name || 'Driver'}</strong>, we received a request to reset your SmartPark account password.
        </p>

        <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px 20px; margin: 24px 0; text-align: center;">
          <div style="font-size: 12px; font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Your 6-Digit Password Reset OTP</div>
          <div style="font-size: 36px; font-weight: 800; font-family: 'Courier New', monospace; letter-spacing: 8px; color: #047857;">${resetCode}</div>
          <div style="font-size: 12px; color: #047857; margin-top: 8px;">Valid for 15 minutes • Do not share this code</div>
        </div>

        <p style="font-size: 13px; color: #64748b;">
          If you did not request this, please ignore this email. Your password will remain unchanged.
        </p>

        <div style="border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
          © 2026 SmartPark Technologies Pvt. Ltd. Bengaluru, India.
        </div>
      </div>
    </div>
  `;

  if (!transporter) return { success: true, simulated: true };

  try {
    const sender = (process.env.SMTP_USER || process.env.FROM_EMAIL || 'smartparking209@gmail.com').trim().replace(/^["']|["']$/g, '');
    const info = await transporter.sendMail({
      from: `"SmartPark Security" <${sender}>`,
      to: email,
      subject: `SmartPark Password Reset Code: ${resetCode}`,
      html: htmlContent
    });

    console.log(`✉️ Password reset OTP email delivered to ${email}, messageId: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Password reset email error:', error);
    return { success: false, error: error.message };
  }
};

// Helper: Send Booking Email
const sendBookingEmail = async (email, booking) => {
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
        <div style="font-size: 32px; margin-bottom: 8px;">✓</div>
        <h1 style="margin: 0; font-size: 22px; font-weight: 800;">Parking Space Reserved!</h1>
        <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 13px;">Booking Reference: #${booking.id}</p>
      </div>

      <div style="padding: 24px; color: #1e293b;">
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 16px; margin: 0 0 4px 0; color: #0f172a;">${booking.parkingName}</h2>
          <div style="font-size: 12px; color: #64748b;">📍 ${booking.area}</div>

          <div style="display: flex; justify-content: space-between; margin-top: 16px; border-top: 1px dashed #cbd5e1; padding-top: 12px;">
            <div>
              <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Allocated Bay</div>
              <div style="font-size: 18px; font-weight: 800; color: #059669;">Slot ${booking.slotNumber}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #64748b; text-transform: uppercase;">Vehicle</div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${booking.vehicleNumber}</div>
            </div>
          </div>

          <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #334155;">
            📅 <strong>Date:</strong> ${booking.date} | ⏰ <strong>Time:</strong> ${booking.startTime} - ${booking.endTime}
          </div>
        </div>

        <div style="background: #ecfdf5; border-radius: 12px; padding: 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <div style="font-size: 12px; color: #065f46; font-weight: 600;">Total Amount Paid</div>
            <div style="font-size: 20px; font-weight: 800; color: #047857;">₹${booking.totalAmount} (UPI Paid)</div>
          </div>
          <div style="font-size: 12px; color: #059669; font-weight: 700; background: #ffffff; padding: 6px 12px; border-radius: 8px;">
            Instant Gate Pass
          </div>
        </div>
      </div>
    </div>
  `;

  if (!transporter) return { success: true, simulated: true };

  try {
    const sender = (process.env.SMTP_USER || process.env.FROM_EMAIL || 'smartparking209@gmail.com').trim().replace(/^["']|["']$/g, '');
    const info = await transporter.sendMail({
      from: `"SmartPark Reservations" <${sender}>`,
      to: email,
      subject: `Booking Confirmed: Slot ${booking.slotNumber} at ${booking.parkingName}`,
      html: htmlContent
    });
    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error('Booking email error:', error);
    return { success: false, error: error.message };
  }
};

/* --- REST API ENDPOINTS CONNECTED TO MONGODB --- */

// 1. Health & Database Stats
app.get('/api/health', async (req, res) => {
  let parkingCount = 0;
  let userCount = 0;
  let bookingCount = 0;

  if (isMongoConnected) {
    parkingCount = await Parking.countDocuments();
    userCount = await User.countDocuments();
    bookingCount = await Booking.countDocuments();
  } else {
    parkingCount = memoryParkings.length;
    userCount = memoryUsers.length;
    bookingCount = memoryBookings.length;
  }

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: isMongoConnected ? 'MongoDB (Connected: smartparking)' : 'In-Memory Store',
    mongoUri: isMongoConnected ? 'mongodb://127.0.0.1:27017/smartparking' : null,
    emailService: transporter ? 'Ready (Nodemailer)' : 'Initializing',
    collections: {
      parkings: parkingCount,
      users: userCount,
      bookings: bookingCount
    }
  });
});

// 2. Parking Locations (GET, POST, PUT, DELETE)
app.get('/api/parking', async (req, res) => {
  try {
    const { q, city, vehicleType } = req.query;
    let query = {};
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { area: { $regex: q, $options: 'i' } },
        { city: { $regex: q, $options: 'i' } }
      ];
    }
    if (city) query.city = { $regex: city, $options: 'i' };
    if (vehicleType && vehicleType !== 'All') {
      query.vehicleTypes = vehicleType;
    }

    if (isMongoConnected) {
      const parkings = await Parking.find(query);
      return res.json({ count: parkings.length, data: parkings });
    }

    res.json({ count: memoryParkings.length, data: memoryParkings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/parking/:id', async (req, res) => {
  try {
    if (isMongoConnected) {
      const item = await Parking.findOne({ id: req.params.id });
      if (item) return res.json(item);
    }
    const mem = memoryParkings.find(p => p.id === req.params.id);
    if (mem) return res.json(mem);
    res.status(404).json({ error: 'Parking location not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new parking facility
app.post('/api/parking', async (req, res) => {
  try {
    const newParkingData = req.body;
    let saved = null;
    if (isMongoConnected) {
      saved = await Parking.create(newParkingData);
    } else {
      saved = newParkingData;
    }
    memoryParkings.unshift(saved);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update parking facility
app.put('/api/parking/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    let updated = null;
    if (isMongoConnected) {
      updated = await Parking.findOneAndUpdate({ id }, updatedData, { new: true });
    }
    const memIdx = memoryParkings.findIndex(p => p.id === id);
    if (memIdx >= 0) {
      memoryParkings[memIdx] = { ...memoryParkings[memIdx], ...updatedData };
      if (!updated) updated = memoryParkings[memIdx];
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete parking facility
app.delete('/api/parking/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Parking.findOneAndDelete({ id });
    }
    memoryParkings = memoryParkings.filter(p => p.id !== id);
    res.json({ success: true, message: 'Parking facility deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update single slot status
app.patch('/api/parking/:id/slots/:slotId', async (req, res) => {
  try {
    const { id, slotId } = req.params;
    const { status } = req.body;

    if (isMongoConnected) {
      const park = await Parking.findOne({ id });
      if (park && park.slots) {
        const slot = park.slots.find(s => s.id === slotId);
        if (slot) slot.status = status;
        park.availableSlots = park.slots.filter(s => s.status === 'available').length;
        park.occupiedSlots = park.slots.filter(s => s.status === 'occupied').length;
        park.reservedSlots = park.slots.filter(s => s.status === 'reserved').length;
        await park.save();
        return res.json({ success: true, data: park });
      }
    }

    const memPark = memoryParkings.find(p => p.id === id);
    if (memPark && memPark.slots) {
      const slot = memPark.slots.find(s => s.id === slotId);
      if (slot) slot.status = status;
      memPark.availableSlots = memPark.slots.filter(s => s.status === 'available').length;
      memPark.occupiedSlots = memPark.slots.filter(s => s.status === 'occupied').length;
      memPark.reservedSlots = memPark.slots.filter(s => s.status === 'reserved').length;
      return res.json({ success: true, data: memPark });
    }

    res.status(404).json({ error: 'Parking or slot not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. User Registration (Initiates 2-step verification flow: sends OTP to personal Gmail)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPassword = (password || '').trim();
    const normalizedName = (fullName || '').trim();
    const normalizedPhone = (phone || '').trim() || '+91 98765 00000';

    if (!normalizedEmail || !normalizedName) {
      return res.status(400).json({ error: 'Full name and email are required.' });
    }

    if (!normalizedPassword || normalizedPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins validity

    let userToNotify = null;

    if (isMongoConnected) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        if (existing.isVerified) {
          return res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
        }
        // Account exists but is unverified: update credentials and dispatch fresh code
        existing.name = normalizedName;
        existing.phone = normalizedPhone;
        existing.password = normalizedPassword;
        existing.verificationCode = verificationCode;
        existing.verificationExpires = verificationExpires;
        await existing.save();
        userToNotify = existing;
      } else {
        // Create new unverified user (Strictly driver/user role for public signups)
        userToNotify = await User.create({
          name: normalizedName,
          email: normalizedEmail,
          phone: normalizedPhone,
          password: normalizedPassword,
          role: 'user',
          verificationCode,
          verificationExpires,
          isVerified: false
        });
      }
    } else {
      const existingIndex = memoryUsers.findIndex(u => u.email === normalizedEmail);
      if (existingIndex >= 0) {
        if (memoryUsers[existingIndex].isVerified) {
          return res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
        }
        memoryUsers[existingIndex].name = normalizedName;
        memoryUsers[existingIndex].phone = normalizedPhone;
        memoryUsers[existingIndex].password = normalizedPassword;
        memoryUsers[existingIndex].verificationCode = verificationCode;
        memoryUsers[existingIndex].verificationExpires = verificationExpires;
        userToNotify = memoryUsers[existingIndex];
      } else {
        userToNotify = {
          id: `usr-${Date.now()}`,
          name: normalizedName,
          email: normalizedEmail,
          phone: normalizedPhone,
          password: normalizedPassword,
          role: 'user',
          verificationCode,
          verificationExpires,
          isVerified: false
        };
        memoryUsers.push(userToNotify);
      }
    }

    // Send real verification OTP email via Gmail SMTP
    const emailResult = await sendRegistrationEmail(
      userToNotify.email,
      userToNotify.name,
      'user',
      verificationCode
    );

    // SECURITY: Never return the verification code in the response
    res.status(200).json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${userToNotify.email}. Please check your inbox.`,
      email: userToNotify.email,
      emailSent: emailResult.success
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3a. Verify Registration Code (Completes registration only if code matches)
app.post('/api/auth/verify-registration', async (req, res) => {
  try {
    const { email, code } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const inputCode = (code || '').trim();

    if (!normalizedEmail || !inputCode) {
      return res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
    }

    let user = null;
    if (isMongoConnected) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = memoryUsers.find(u => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(404).json({ error: 'No pending registration found for this email address. Please register first.' });
    }

    if (user.isVerified) {
      return res.json({
        success: true,
        message: 'Account is already verified! Please sign in.',
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '+91 98765 00000',
          role: user.role || 'user',
          avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
          city: user.city || 'Bengaluru',
          savedParkingIds: user.savedParkingIds || [],
          status: user.status || 'Active'
        }
      });
    }

    // Verify OTP code matches
    if (!user.verificationCode || user.verificationCode !== inputCode) {
      return res.status(400).json({
        error: 'Incorrect verification code. Please check your Gmail inbox and enter the exact 6-digit code.'
      });
    }

    // Check expiry
    if (user.verificationExpires && new Date() > new Date(user.verificationExpires)) {
      return res.status(400).json({
        error: 'Verification code has expired. Please click "Resend Code" to receive a fresh PIN.'
      });
    }

    // Mark as verified & clear verification code
    if (isMongoConnected) {
      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationExpires = undefined;
      await user.save();
    } else {
      user.isVerified = true;
      user.verificationCode = null;
      user.verificationExpires = null;
    }

    console.log(`✅ User ${user.email} successfully verified registration!`);

    res.json({
      success: true,
      message: 'Account verified successfully! Welcome to SmartPark.',
      token: `token_${user._id || Date.now()}`,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '+91 98765 00000',
        role: user.role || 'user',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
        city: user.city || 'Bengaluru',
        savedParkingIds: user.savedParkingIds || [],
        status: user.status || 'Active'
      }
    });
  } catch (err) {
    console.error('Verify registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3b. Resend Verification Code
app.post('/api/auth/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    let user = null;
    if (isMongoConnected) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = memoryUsers.find(u => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(404).json({ error: 'No registration found for this email address.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Account is already verified. Please sign in.' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

    if (isMongoConnected) {
      user.verificationCode = verificationCode;
      user.verificationExpires = verificationExpires;
      await user.save();
    } else {
      user.verificationCode = verificationCode;
      user.verificationExpires = verificationExpires;
    }

    await sendRegistrationEmail(user.email, user.name, user.role || 'user', verificationCode);

    res.json({
      success: true,
      message: `A new 6-digit verification code has been sent to ${user.email}.`
    });
  } catch (err) {
    console.error('Resend code error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Secure User Login (Queried from MongoDB with strict trimmed password check)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPassword = (password || '').trim();

    if (!normalizedEmail || !normalizedPassword) {
      return res.status(400).json({ error: 'Both email and password are required.' });
    }

    let user = null;
    if (isMongoConnected) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = memoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({ error: 'No account found with this email. Please create an account first.' });
    }

    // Verify password strictly (trimmed)
    const storedPassword = (user.password || '').trim();
    if (storedPassword !== normalizedPassword) {
      return res.status(401).json({ error: 'Incorrect password. Please verify your credentials or use Forgot Password.' });
    }

    // Check if account was verified; if not, dispatch verification code
    if (user.isVerified === false) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationExpires = new Date(Date.now() + 15 * 60 * 1000);
      if (isMongoConnected) {
        user.verificationCode = verificationCode;
        user.verificationExpires = verificationExpires;
        await user.save();
      } else {
        user.verificationCode = verificationCode;
        user.verificationExpires = verificationExpires;
      }
      await sendRegistrationEmail(user.email, user.name, user.role || 'user', verificationCode);
      return res.status(403).json({
        error: 'Your email address is not verified yet. We have sent a 6-digit verification code to your email.',
        unverified: true,
        email: user.email
      });
    }

    res.json({
      message: 'Login successful',
      token: `token_${user._id || Date.now()}`,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '+91 98765 00000',
        role: user.role,
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
        city: user.city || 'Bengaluru',
        savedParkingIds: user.savedParkingIds || [],
        status: user.status || 'Active'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4a. Forgot Password (Dispatches OTP to registered Gmail; does NOT return code in response)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) return res.status(400).json({ error: 'Registered email address is required.' });

    let user = null;
    if (isMongoConnected) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = memoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      return res.status(404).json({ error: 'No account registered with this email address.' });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    if (isMongoConnected) {
      user.resetCode = resetCode;
      user.resetCodeExpires = expiry;
      await user.save();
    } else {
      user.resetCode = resetCode;
      user.resetCodeExpires = expiry;
    }

    await sendPasswordResetEmail(user.email, user.name, resetCode);

    // SECURITY: Never return the resetCode in the response
    res.json({
      success: true,
      message: `A 6-digit password reset code has been sent to ${user.email}. Please check your Gmail inbox.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4b. Reset Password Action (Verifies matching OTP from Gmail)
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedCode = (code || '').trim();
    const normalizedPassword = (newPassword || '').trim();

    if (!normalizedEmail || !normalizedCode || !normalizedPassword) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required.' });
    }

    let user = null;
    if (isMongoConnected) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = memoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!user.resetCode || user.resetCode !== normalizedCode) {
      return res.status(400).json({ error: 'Invalid verification code. Please check your Gmail inbox and enter the code sent to you.' });
    }

    if (user.resetCodeExpires && new Date() > new Date(user.resetCodeExpires)) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    if (normalizedPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (isMongoConnected) {
      user.password = normalizedPassword;
      user.resetCode = undefined;
      user.resetCodeExpires = undefined;
      await user.save();
    } else {
      user.password = normalizedPassword;
      user.resetCode = null;
      user.resetCodeExpires = null;
    }

    res.json({ success: true, message: 'Password has been reset successfully! You can now sign in with your new password.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Bookings (Saved to MongoDB + Confirmation email)
app.post('/api/bookings', async (req, res) => {
  try {
    const bookingData = req.body;
    const bookingId = bookingData.id || `SP${Date.now()}`;
    const newBooking = {
      ...bookingData,
      id: bookingId,
      status: 'confirmed'
    };

    let saved = null;
    if (isMongoConnected) {
      saved = await Booking.create(newBooking);
    } else {
      saved = newBooking;
      memoryBookings.push(saved);
    }

    // Send confirmation email
    const emailResult = await sendBookingEmail(bookingData.userEmail || 'driver@example.com', newBooking);

    res.status(201).json({
      message: 'Booking saved to MongoDB and digital pass emailed!',
      booking: saved,
      emailResult
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    if (isMongoConnected) {
      const list = await Booking.find().sort({ createdAt: -1 });
      return res.json(list);
    }
    res.json(memoryBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. User Profile Update (Persists name, phone, city, avatar to MongoDB)
app.put('/api/users/profile', async (req, res) => {
  try {
    const { email, name, phone, city, avatar } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }

    let updatedUser = null;
    if (isMongoConnected) {
      const updateData = {};
      if (name) updateData.name = name.trim();
      if (phone) updateData.phone = phone.trim();
      if (city) updateData.city = city.trim();
      if (avatar) updateData.avatar = avatar;

      updatedUser = await User.findOneAndUpdate(
        { email: normalizedEmail },
        { $set: updateData },
        { new: true }
      );
    } else {
      const idx = memoryUsers.findIndex(u => u.email.toLowerCase() === normalizedEmail);
      if (idx >= 0) {
        if (name) memoryUsers[idx].name = name.trim();
        if (phone) memoryUsers[idx].phone = phone.trim();
        if (city) memoryUsers[idx].city = city.trim();
        if (avatar) memoryUsers[idx].avatar = avatar;
        updatedUser = memoryUsers[idx];
      }
    }

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(`👤 Updated profile for user ${normalizedEmail} (avatar updated: ${Boolean(avatar)})`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        city: updatedUser.city,
        savedParkingIds: updatedUser.savedParkingIds || [],
        status: updatedUser.status || 'Active'
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7. Saved Parking Toggle (Persists bookmark list in MongoDB)
app.post('/api/users/saved-parking', async (req, res) => {
  try {
    const { email, parkingId } = req.body;
    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!normalizedEmail || !parkingId) {
      return res.status(400).json({ error: 'Email and parkingId are required' });
    }

    let savedList = [];
    if (isMongoConnected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const current = user.savedParkingIds || [];
      const exists = current.includes(parkingId);
      savedList = exists
        ? current.filter(id => id !== parkingId)
        : [...current, parkingId];

      user.savedParkingIds = savedList;
      await user.save();
    } else {
      const user = memoryUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const current = user.savedParkingIds || [];
      const exists = current.includes(parkingId);
      savedList = exists
        ? current.filter(id => id !== parkingId)
        : [...current, parkingId];
      user.savedParkingIds = savedList;
    }

    console.log(`📌 User ${normalizedEmail} updated saved parking locations (${savedList.length} items)`);

    res.json({
      success: true,
      savedParkingIds: savedList,
      isSaved: savedList.includes(parkingId)
    });
  } catch (err) {
    console.error('Save parking error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8. Admin Users API (Queries REAL users directly from MongoDB database)
app.get('/api/admin/users', async (req, res) => {
  try {
    let usersList = [];
    if (isMongoConnected) {
      const rawUsers = await User.find({}).sort({ createdAt: -1 });
      usersList = await Promise.all(
        rawUsers.map(async (u) => {
          const bookingsCount = await Booking.countDocuments({
            userEmail: { $regex: new RegExp(`^${u.email}$`, 'i') }
          });
          const joinedDate = u.createdAt
            ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Recent';

          return {
            id: u._id.toString(),
            name: u.name,
            email: u.email,
            phone: u.phone || '+91 98765 00000',
            role: u.role === 'admin' ? 'Admin' : 'User',
            bookingsCount,
            status: u.status || 'Active',
            joined: joinedDate,
            avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
            city: u.city || 'Bengaluru',
            savedParkingIds: u.savedParkingIds || []
          };
        })
      );
    } else {
      usersList = memoryUsers.map(u => ({
        id: u.id || `usr-${Date.now()}`,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role === 'admin' ? 'Admin' : 'User',
        bookingsCount: memoryBookings.filter(b => b.userEmail === u.email).length,
        status: u.status || 'Active',
        joined: 'Recent',
        avatar: u.avatar,
        city: u.city || 'Bengaluru',
        savedParkingIds: u.savedParkingIds || []
      }));
    }

    res.json({ count: usersList.length, data: usersList });
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 8b. Admin Toggle User Status
app.patch('/api/admin/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updated = null;
    if (isMongoConnected) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        updated = await User.findByIdAndUpdate(id, { status }, { new: true });
      }
      if (!updated) {
        updated = await User.findOneAndUpdate({ email: id }, { status }, { new: true });
      }
    } else {
      const u = memoryUsers.find(item => item.id === id || item.email === id);
      if (u) {
        u.status = status;
        updated = u;
      }
    }

    if (!updated) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Admin Dashboard Stats (Calculated REAL figures from MongoDB)
app.get('/api/admin/stats', async (req, res) => {
  try {
    let totalUsers = 0;
    let totalParkings = 0;
    let totalBookings = 0;
    let totalRevenue = 0;
    let recentBookings = [];
    let bookingsTrend = [];

    if (isMongoConnected) {
      totalUsers = await User.countDocuments({});
      totalParkings = await Parking.countDocuments({});
      totalBookings = await Booking.countDocuments({});

      const allBookings = await Booking.find({}).sort({ createdAt: -1 });
      totalRevenue = allBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
      recentBookings = allBookings.slice(0, 5);

      // Group bookings by last 7 days
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      bookingsTrend = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() - (6 - i));
        const dayStr = dayNames[d.getDay()];
        const dateStr = d.toISOString().split('T')[0];
        const dayBookings = allBookings.filter(b => {
          if (b.date === dateStr) return true;
          if (b.createdAt) {
            const cDate = typeof b.createdAt === 'string' ? b.createdAt.split('T')[0] : b.createdAt.toISOString?.().split('T')[0];
            return cDate === dateStr;
          }
          return false;
        });
        const rev = dayBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
        return {
          day: dayStr,
          date: dateStr,
          bookings: dayBookings.length,
          revenue: rev
        };
      });
    } else {
      totalUsers = memoryUsers.length;
      totalParkings = memoryParkings.length;
      totalBookings = memoryBookings.length;
      totalRevenue = memoryBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
      recentBookings = memoryBookings.slice(0, 5);
      bookingsTrend = [
        { day: 'Mon', bookings: 1, revenue: 60 },
        { day: 'Tue', bookings: 2, revenue: 140 },
        { day: 'Wed', bookings: 1, revenue: 80 },
        { day: 'Thu', bookings: 2, revenue: 120 },
        { day: 'Fri', bookings: 1, revenue: 90 },
        { day: 'Sat', bookings: 2, revenue: 160 },
        { day: 'Sun', bookings: 0, revenue: 0 },
      ];
    }

    res.json({
      totalUsers,
      totalParkings,
      totalBookings,
      totalRevenue,
      recentBookings,
      bookingsTrend
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 SmartPark Full-Stack Backend Server running on http://127.0.0.1:${PORT}`);
});
