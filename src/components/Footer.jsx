import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Zap, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <span className="font-extrabold text-xl font-mono leading-none">🅿</span>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Smart<span className="text-emerald-500">Park</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover nearby parking spaces, compare live prices, check real-time availability, and reserve your spot seamlessly before arriving.
            </p>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified & Secure
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                EV Ready Bays
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search" className="hover:text-emerald-400 transition-colors">
                  Find Parking
                </Link>
              </li>
              <li>
                <Link to="/search?explore=1" className="hover:text-emerald-400 transition-colors">
                  Explore City Map
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-emerald-400 transition-colors">
                  My Reservations
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-emerald-400 transition-colors">
                  Vehicle Garage
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Bengaluru Hubs
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search?q=MG+Road" className="hover:text-emerald-400 transition-colors">
                  MG Road & Brigade
                </Link>
              </li>
              <li>
                <Link to="/search?q=Indiranagar" className="hover:text-emerald-400 transition-colors">
                  Indiranagar 100ft
                </Link>
              </li>
              <li>
                <Link to="/search?q=Koramangala" className="hover:text-emerald-400 transition-colors">
                  Koramangala 7th Block
                </Link>
              </li>
              <li>
                <Link to="/search?q=Whitefield" className="hover:text-emerald-400 transition-colors">
                  ITPL Whitefield
                </Link>
              </li>
              <li>
                <Link to="/search?q=Electronic+City" className="hover:text-emerald-400 transition-colors">
                  Electronic City
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Management
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/admin/dashboard" className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1">
                  <span>Operator Portal</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/admin/parking" className="hover:text-emerald-400 transition-colors">
                  Facility Registry
                </Link>
              </li>
              <li>
                <Link to="/admin/slots" className="hover:text-emerald-400 transition-colors">
                  Live Slot Sensor Grid
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-emerald-400 transition-colors">
                  Account Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 SmartPark Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6 text-slate-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
