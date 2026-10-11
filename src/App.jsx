import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Providers
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { ParkingProvider } from './context/ParkingContext';
import { VehicleProvider } from './context/VehicleContext';
import { BookingProvider } from './context/BookingContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CardSkeleton from './components/Loading';
import EmailVerificationModal from './components/EmailVerificationModal';

// Client Pages
import Home from './pages/Home';
import Search from './pages/Search';
import ParkingDetails from './pages/ParkingDetails';
import Booking from './pages/Booking';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import MyVehicles from './pages/MyVehicles';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminParking from './pages/Admin/AdminParking';
import AdminSlots from './pages/Admin/AdminSlots';
import AdminBookings from './pages/Admin/AdminBookings';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminReviews from './pages/Admin/AdminReviews';
import AdminReports from './pages/Admin/AdminReports';

// Layout wrapper for standard client pages
const ClientLayout = ({ children, hideFooter = false }) => {
  const location = useLocation();
  const isSearch = location.pathname === '/search';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      {/* Hide footer on search page to preserve split-screen map height */}
      {!isSearch && !hideFooter && <Footer />}
    </div>
  );
};

export const App = () => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <EmailVerificationModal />
        <ParkingProvider>
          <VehicleProvider>
            <BookingProvider>
              <Router>
                <Routes>
                  {/* Public Client Routes */}
                  <Route
                    path="/"
                    element={
                      <ClientLayout>
                        <Home />
                      </ClientLayout>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <ClientLayout>
                        <Search />
                      </ClientLayout>
                    }
                  />
                  <Route
                    path="/parking/:id"
                    element={
                      <ClientLayout>
                        <ParkingDetails />
                      </ClientLayout>
                    }
                  />
                  <Route
                    path="/booking/:id"
                    element={
                      <ClientLayout>
                        <Booking />
                      </ClientLayout>
                    }
                  />
                  <Route
                    path="/booking-success"
                    element={
                      <ClientLayout>
                        <BookingSuccess />
                      </ClientLayout>
                    }
                  />
                  <Route
                    path="/bookings"
                    element={
                      <ClientLayout>
                        <MyBookings />
                      </ClientLayout>
                    }
                  />
                  <Route
                    path="/vehicles"
                    element={
                      <ClientLayout>
                        <MyVehicles />
                      </ClientLayout>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ClientLayout>
                        <Profile />
                      </ClientLayout>
                    }
                  />

                  {/* Auth Routes */}
                  <Route
                    path="/login"
                    element={
                      <ClientLayout hideFooter={true}>
                        <Login />
                      </ClientLayout>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <ClientLayout hideFooter={true}>
                        <Register />
                      </ClientLayout>
                    }
                  />

                  {/* Admin Portal Sub-routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="parking" element={<AdminParking />} />
                    <Route path="slots" element={<AdminSlots />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="reports" element={<AdminReports />} />
                  </Route>

                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </BookingProvider>
          </VehicleProvider>
        </ParkingProvider>
      </AuthProvider>
    </NotificationProvider>
  );
};

export default App;
