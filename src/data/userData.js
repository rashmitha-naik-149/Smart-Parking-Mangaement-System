export const initialUser = {
  id: "usr-101",
  name: "Rashmitha",
  email: "rashmi@example.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80",
  role: "user", // 'user' or 'admin'
  memberSince: "March 2025",
  city: "Bengaluru",
  savedParkingIds: ["park-01", "park-03", "park-04"],
  stats: {
    totalBookings: 14,
    hoursParked: 38,
    co2SavedKg: 12.4,
    pointsEarned: 480
  },
  preferences: {
    emailNotifications: true,
    smsAlerts: true,
    autoReserveEV: false,
    defaultVehicleId: "veh-01"
  }
};

export const initialAdminUsers = [
  {
    id: "usr-101",
    name: "Rashmitha",
    email: "rashmi@example.com",
    phone: "+91 98765 43210",
    role: "User",
    bookingsCount: 14,
    status: "Active",
    joined: "12 Mar 2025"
  },
  {
    id: "usr-102",
    name: "Vikram Shenoy",
    email: "vikram.s@example.com",
    phone: "+91 98451 22334",
    role: "User",
    bookingsCount: 9,
    status: "Active",
    joined: "18 Apr 2025"
  },
  {
    id: "usr-103",
    name: "Ananya Iyer",
    email: "ananya.i@example.com",
    phone: "+91 97410 88990",
    role: "User",
    bookingsCount: 22,
    status: "Active",
    joined: "05 Jan 2025"
  },
  {
    id: "usr-104",
    name: "Karthik Reddy",
    email: "karthik.r@example.com",
    phone: "+91 99001 55443",
    role: "User",
    bookingsCount: 6,
    status: "Active",
    joined: "22 May 2025"
  },
  {
    id: "usr-999",
    name: "Admin User",
    email: "admin@smartpark.io",
    phone: "+91 98000 11223",
    role: "Admin",
    bookingsCount: 38,
    status: "Active",
    joined: "01 Jan 2025"
  }
];
