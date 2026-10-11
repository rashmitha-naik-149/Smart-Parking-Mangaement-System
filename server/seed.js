import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Parking } from './models/Parking.js';
import { User } from './models/User.js';
import { Booking } from './models/Booking.js';
import { Vehicle } from './models/Vehicle.js';
import { parkingLocations } from '../src/data/parkingData.js';
import { initialBookings } from '../src/data/bookingData.js';
import { initialVehicles } from '../src/data/vehicleData.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartparking';

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB!');

    // 1. Seed Parking Facilities
    console.log('📦 Seeding Parking Facilities (57+ locations)...');
    await Parking.deleteMany({});
    const insertedParkings = await Parking.insertMany(parkingLocations);
    console.log(`✅ Seeded ${insertedParkings.length} parking facilities successfully!`);

    // 2. Seed Users
    console.log('👤 Seeding Demo Users...');
    await User.deleteMany({});
    const demoUsers = [
      {
        name: 'Rashmitha',
        email: 'rashmi@example.com',
        phone: '+91 98765 43210',
        password: 'password123',
        role: 'user',
        city: 'Bengaluru',
        isVerified: true,
        savedParkingIds: ['park-01', 'park-03']
      },
      {
        name: 'Admin Operator',
        email: 'admin@smartpark.io',
        phone: '+91 98000 11223',
        password: 'admin123',
        role: 'admin',
        city: 'Bengaluru',
        isVerified: true,
        savedParkingIds: []
      }
    ];
    await User.insertMany(demoUsers);
    console.log('✅ Seeded demo driver and operator admin users!');

    // 3. Seed Vehicles
    console.log('🚗 Seeding Vehicles...');
    await Vehicle.deleteMany({});
    await Vehicle.insertMany(initialVehicles);
    console.log('✅ Seeded demo vehicles!');

    // 4. Seed Bookings
    console.log('🎟️ Seeding Bookings...');
    await Booking.deleteMany({});
    await Booking.insertMany(
      initialBookings.map((b) => ({
        ...b,
        userEmail: 'rashmi@example.com'
      }))
    );
    console.log('✅ Seeded initial bookings!');

    console.log('\n🎉 SMARTPARKING DATABASE SEEDED SUCCESSFULLY IN MONGODB!');
    console.log('Database Name: smartparking');
    console.log('Collections:');
    console.log('  - parkings  (57 records)');
    console.log('  - users     (2 records)');
    console.log('  - vehicles  (3 records)');
    console.log('  - bookings  (3 records)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDatabase();
