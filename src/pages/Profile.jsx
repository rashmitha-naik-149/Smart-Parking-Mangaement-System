import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  CalendarCheck,
  Heart,
  Bell,
  Shield,
  Save,
  Award,
  Sparkles,
  Camera,
  Upload,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';
import { useBookings } from '../context/BookingContext';
import { useParking } from '../context/ParkingContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import ParkingCard from '../components/ParkingCard';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, updateProfile } = useAuth();
  const { showToast } = useNotification();
  const { vehicles } = useVehicles();
  const { bookings } = useBookings();
  const { parkingList } = useParking();
  const fileInputRef = useRef(null);

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      showToast('Please sign in to view your profile settings.', 'info');
      navigate('/login?redirect=/profile');
    }
  }, [isLoggedIn, navigate, showToast]);

  const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'saved', 'notifications', 'security'

  // Form states for personal info
  const [name, setName] = useState(user?.name || 'Driver');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [city, setCity] = useState(user?.city || 'Bengaluru');

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=80'
  ];

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WebP).', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size exceeds 5MB limit.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      updateProfile({ avatar: base64 });
      showToast('Profile photo updated successfully!');
      setShowAvatarModal(false);
    };
    reader.readAsDataURL(file);
  };

  if (!isLoggedIn) return null;

  // Notifications state
  const [emailNotify, setEmailNotify] = useState(true);
  const [smsNotify, setSmsNotify] = useState(true);
  const [reminders, setReminders] = useState(true);

  const savedParkings = parkingList.filter((p) =>
    user?.savedParkingIds?.includes(p.id)
  );

  const handleSavePersonal = (e) => {
    e.preventDefault();
    updateProfile({ name, email, phone, city });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 text-left">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80"}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md transition-opacity group-hover:opacity-90"
            />
            {/* Requirement 6: Option to insert or edit profile image */}
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-white shadow-md transition-transform hover:scale-110 active:scale-95"
              title="Edit Profile Picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {user?.name}
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Verified Driver
              </span>
            </div>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <p className="text-xs text-slate-400">
              Member since {user?.memberSince || 'March 2025'} · Bengaluru
            </p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center w-full sm:w-auto justify-around">
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              {bookings.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Bookings</div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="text-lg font-extrabold text-slate-900">
              {vehicles.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Vehicles</div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <div className="text-lg font-extrabold text-emerald-600">
              480
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Points</div>
          </div>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        {[
          { key: 'personal', label: 'Personal Information', icon: User },
          { key: 'saved', label: `Saved Parking (${savedParkings.length})`, icon: Heart },
          { key: 'notifications', label: 'Notifications', icon: Bell },
          { key: 'security', label: 'Security', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Information */}
      {activeTab === 'personal' && (
        <form
          onSubmit={handleSavePersonal}
          className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl"
        >
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Personal Information
            </h3>
            <p className="text-xs text-slate-500">
              Update your primary contact and driver details.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <Input
              label="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={Phone}
              required
            />
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              icon={MapPin}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" size="md" icon={Save}>
              Save Profile
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Saved Parking */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Favorite Parking Locations
            </h3>
            <p className="text-xs text-slate-500">
              Quickly re-book your most frequented smart parking spots.
            </p>
          </div>

          {savedParkings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center space-y-3">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No saved parking spots yet.</p>
              <Link to="/search" className="text-xs text-emerald-600 font-bold hover:underline">
                Explore parking locations
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedParkings.map((p) => (
                <ParkingCard key={p.id} parking={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Notification Preferences
            </h3>
            <p className="text-xs text-slate-500">
              Choose how SmartPark updates you on parking reservations.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Email Booking Confirmations
                </div>
                <div className="text-xs text-slate-500">
                  Receive instant tax invoice and PDF pass via email.
                </div>
              </div>
              <input
                type="checkbox"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  SMS / WhatsApp Gate Pass
                </div>
                <div className="text-xs text-slate-500">
                  Get fast boom-barrier pass link on your mobile.
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsNotify}
                onChange={(e) => setSmsNotify(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  Expiry & Extension Reminders
                </div>
                <div className="text-xs text-slate-500">
                  Alert 15 minutes before your reserved parking duration expires.
                </div>
              </div>
              <input
                type="checkbox"
                checked={reminders}
                onChange={(e) => setReminders(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 max-w-2xl">
          <div>
            <h3 className="text-base font-bold text-slate-900">Security & Access</h3>
            <p className="text-xs text-slate-500">Manage account credentials and sessions</p>
          </div>

          <div className="space-y-4">
            <Input label="Current Password" type="password" placeholder="••••••••" />
            <Input label="New Password" type="password" placeholder="••••••••" />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="secondary" size="md">
              Update Password
            </Button>
          </div>
        </div>
      )}

      {/* Requirement 6: Profile Photo Edit & Upload Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Update Profile Picture"
        description="Choose a preset avatar or upload your own image from your computer"
        maxWidth="max-w-md"
      >
        <div className="space-y-5 text-left">
          {/* Custom Upload Button */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 text-center space-y-2">
            <Upload className="w-8 h-8 text-emerald-600 mx-auto" />
            <div className="text-xs font-bold text-slate-800">
              Upload custom image from your device
            </div>
            <p className="text-[11px] text-slate-500">Supports PNG, JPG, or WebP up to 5MB</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-1 shadow-sm"
            >
              Browse Files
            </Button>
          </div>

          {/* Preset Avatars */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
              Or Choose from Presets
            </label>
            <div className="grid grid-cols-3 gap-3">
              {presetAvatars.map((av, index) => {
                const isSelected = user?.avatar === av;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      updateProfile({ avatar: av });
                      setShowAvatarModal(false);
                    }}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all p-1 hover:scale-105 ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <img
                      src={av}
                      alt={`Avatar preset ${index + 1}`}
                      className="w-full h-20 object-cover rounded-xl"
                    />
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-sm">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAvatarModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
