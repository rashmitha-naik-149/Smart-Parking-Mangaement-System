import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  CircleDot,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  Clock,
  Car,
  CheckCircle2,
  Navigation,
  ChevronRight
} from 'lucide-react';
import SearchBar from '../components/SearchBar';
import ParkingCard from '../components/ParkingCard';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const Home = () => {
  const navigate = useNavigate();
  const { parkingList } = useParking();
  const { isLoggedIn } = useAuth();
  const { showToast } = useNotification();

  const featuredSpots = parkingList.slice(0, 3);

  const features = [
    {
      icon: MapPin,
      title: 'Find Parking',
      description: 'Discover verified parking locations around your destination with live turn-by-turn guidance.',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      icon: CircleDot,
      title: 'Real-time Availability',
      description: 'See live available, occupied, and reserved parking bays powered by IoT smart sensors.',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      icon: CalendarCheck,
      title: 'Easy Reservation',
      description: 'Book a guaranteed parking space before you arrive. Receive an automated instant QR gate pass.',
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      icon: ShieldCheck,
      title: 'Park With Confidence',
      description: 'View 24/7 CCTV security, sheltered decks, EV fast chargers, and real driver reviews.',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Soft background glow decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/40 via-emerald-50/20 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Next-Gen Smart Parking Infrastructure</span>
              </div>

              {/* Headlines */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
                  Find parking.{' '}
                  <span className="text-emerald-600 block">Park smarter.</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                  Discover nearby parking spaces, compare prices, check availability and reserve your spot before you hit the road.
                </p>
              </div>

              {/* Large Search Box */}
              <div className="pt-2 max-w-2xl">
                <SearchBar
                  placeholder="Search city, area or landmark (e.g. MG Road, Indiranagar)..."
                  size="lg"
                  showPopularChips={true}
                />
              </div>

              {/* Key Trust Metrics */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg">
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Guaranteed Spot</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">&lt; 90s</div>
                  <div className="text-xs text-slate-500 font-medium">Fast Booking</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900">4.8★</div>
                  <div className="text-xs text-slate-500 font-medium">Driver Rating</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Stylized Interactive Map/Dashboard Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-slate-200/80 overflow-hidden group">
                {/* Simulated Radar Map View */}
                <div className="relative h-72 w-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-4 overflow-hidden flex flex-col justify-between text-white">
                  {/* Subtle Grid Lines */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Pulsing radar rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-emerald-500/20 animate-ping opacity-25" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-emerald-500/30" />

                  {/* Header bar */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Live Radar: Central Hub</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">
                      24 Active Hubs
                    </span>
                  </div>

                  {/* Map Pin 1 */}
                  <div className="absolute top-16 left-12 z-10 flex items-center gap-1.5 bg-emerald-600 text-white px-2.5 py-1 rounded-full shadow-lg text-xs font-bold animate-bounce">
                    <span>🅿</span>
                    <span>MG One · ₹30</span>
                  </div>

                  {/* Map Pin 2 */}
                  <div className="absolute bottom-20 right-10 z-10 flex items-center gap-1.5 bg-slate-900/90 text-emerald-300 border border-emerald-500/50 px-2.5 py-1 rounded-full shadow-lg text-xs font-bold">
                    <span>⚡</span>
                    <span>Indiranagar · ₹40</span>
                  </div>

                  {/* Center Target Indicator */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center text-white shadow-glow">
                      <Navigation className="w-4 h-4 fill-white rotate-45" />
                    </div>
                    <span className="text-[10px] font-semibold text-white/80 mt-1">
                      You are here
                    </span>
                  </div>

                  {/* Bottom Stats */}
                  <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/60 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Nearest Space</span>
                      <span className="font-bold text-emerald-400">300m · 24 Free</span>
                    </div>
                    <Link
                      to="/search"
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Bottom Card Summary */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      🅿
                    </div>
                    <div className="text-left">
                      <h4 className="text-sm font-bold text-slate-800">
                        MG One Plaza Smart Parking
                      </h4>
                      <p className="text-xs text-slate-500">
                        MG Road Metro · ₹30/hour
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!isLoggedIn) {
                        showToast('Please sign in to view facility details.', 'info');
                        navigate('/login?redirect=/parking/park-01');
                      } else {
                        navigate('/parking/park-01');
                      }
                    }}
                    className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FEATURES SECTION */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
            Why SmartPark
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for stress-free city parking
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Everything you need to find, reserve, and enter parking spaces in high-density urban areas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-card-hover hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group text-left"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${feature.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Seamless 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How SmartPark Works
            </h2>
            <p className="text-sm text-slate-400">
              Go from searching to parked in less than two minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {[
              { step: '01', title: 'Search Location', desc: 'Type your destination to see nearby available spaces on the interactive map.' },
              { step: '02', title: 'Compare & Select', desc: 'Review pricing, distance, EV chargers, and verified user ratings.' },
              { step: '03', title: 'Reserve Spot', desc: 'Select your arrival time and slot. Lock in your spot with zero surge pricing.' },
              { step: '04', title: 'Scan & Park', desc: 'Arrive at the boom barrier, scan your instant QR code, and park effortlessly.' }
            ].map((st) => (
              <div key={st.step} className="relative bg-slate-800/60 p-6 rounded-2xl border border-slate-700 space-y-3">
                <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {st.step}
                </div>
                <h3 className="text-base font-bold text-white">{st.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PARKING SPOTS CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div className="text-left space-y-1">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Popular in Bengaluru
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recommended Parking Spaces
            </h2>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-600 transition-colors"
          >
            <span>View all {parkingList.length}+ locations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredSpots.map((parking) => (
            <ParkingCard key={parking.id} parking={parking} />
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to park smarter today?
          </h2>
          <p className="text-base text-emerald-100 max-w-xl mx-auto">
            Join thousands of smart drivers who skip the parking stress and drive straight into reserved spots.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/search"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-emerald-900 hover:bg-slate-100 font-bold rounded-xl shadow-lg transition-all"
            >
              Explore Parking Near You
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold rounded-xl border border-emerald-400/40 transition-all"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
