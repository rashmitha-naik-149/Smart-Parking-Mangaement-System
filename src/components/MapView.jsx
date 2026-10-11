import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import {
  Navigation,
  Star,
  ArrowUpRight,
  Lock,
  Layers,
  ExternalLink,
  Maximize2,
  Minimize2,
  Compass,
  MapPin
} from 'lucide-react';
import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

// Helper component to smoothly center/flyTo map when selected parking changes and invalidate size
const MapRecenterAndResize = ({ selectedLocation, userCoords, locations }) => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 400);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  useEffect(() => {
    if (selectedLocation && selectedLocation.coordinates) {
      map.flyTo(
        [selectedLocation.coordinates.lat, selectedLocation.coordinates.lng],
        16,
        { duration: 1.2 }
      );
    } else if (locations && locations.length > 0 && locations[0]?.coordinates) {
      map.flyTo(
        [locations[0].coordinates.lat, locations[0].coordinates.lng],
        locations.length > 30 ? 11 : 13,
        { duration: 1.0 }
      );
    }
  }, [selectedLocation, locations, map]);

  useEffect(() => {
    if (userCoords) {
      map.flyTo([userCoords.lat, userCoords.lng], 15, { duration: 1.2 });
    }
  }, [userCoords, map]);

  return null;
};

// Create Google Maps style pin icon for parking spots
const createGoogleStyleMarkerIcon = (parking, isSelected) => {
  const isAvailable = parking.availableSlots > 0;
  const isBike = parking.vehicleTypes?.length === 1 && parking.vehicleTypes[0] === 'Bike';

  const markerColor = isSelected
    ? '#0f172a' // Dark Navy selected
    : isAvailable
    ? isBike
      ? '#d97706' // Amber for Bike
      : '#059669' // Emerald for Car
    : '#dc2626'; // Red for Full

  const iconGlyph = isBike ? '🛵' : '🅿';

  const html = `
    <div class="google-map-marker-wrapper group flex flex-col items-center cursor-pointer transition-transform duration-200 ${
      isSelected ? 'scale-110 z-50' : 'hover:scale-110'
    }">
      <!-- Price pill badge -->
      <div class="flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[11px] shadow-lg border border-white text-white whitespace-nowrap mb-0.5" style="background-color: ${markerColor}">
        <span>${iconGlyph}</span>
        <span>₹${parking.pricePerHour}</span>
      </div>

      <!-- Google Maps Teardrop Pin -->
      <div class="relative w-7 h-9 flex items-center justify-center">
        <svg viewBox="0 0 24 36" class="w-full h-full drop-shadow-md" style="filter: drop-shadow(0 3px 4px rgba(0,0,0,0.3));">
          <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="${markerColor}"/>
          <circle cx="12" cy="12" r="5.5" fill="#ffffff"/>
        </svg>
        <span class="absolute top-1.5 text-[10px] font-extrabold" style="color: ${markerColor}">
          ${parking.availableSlots > 0 ? parking.availableSlots : '✕'}
        </span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-google-marker',
    iconSize: [60, 52],
    iconAnchor: [30, 48],
    popupAnchor: [0, -48]
  });
};

// Create User Current Location Blue Pulse Marker
const createUserLocationIcon = () => {
  const html = `
    <div class="relative flex items-center justify-center w-6 h-6">
      <div class="absolute w-6 h-6 bg-blue-500/30 rounded-full animate-ping"></div>
      <div class="w-3.5 h-3.5 bg-blue-600 border-2 border-white rounded-full shadow-md z-10"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'user-loc-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const MapView = ({
  locations = [],
  center = [12.9756, 77.6066], // Central Bengaluru default
  zoom = 13,
  className = "h-full w-full"
}) => {
  const navigate = useNavigate();
  const { selectedParkingId, setSelectedParkingId } = useParking();
  const { isLoggedIn } = useAuth();
  const { showToast } = useNotification();

  // Map layer state: 'roadmap' (Google Standard), 'satellite' (Google Hybrid), 'terrain' (Google Terrain)
  const [mapLayer, setMapLayer] = useState('roadmap');
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedLocation = locations.find((l) => l.id === selectedParkingId);

  // Google Maps Tile Layer Configs
  const tileLayers = {
    roadmap: {
      url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a>'
    },
    satellite: {
      url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", // Hybrid: Satellite + Streets + Labels
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps Satellite Imagery</a>'
    },
    terrain: {
      url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      maxZoom: 20,
      attribution: '&copy; <a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps Terrain</a>'
    }
  };

  const currentTile = tileLayers[mapLayer] || tileLayers.roadmap;

  // Real Geolocation trigger
  const handleMyLocationClick = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'info');
      if (locations[0]) setSelectedParkingId(locations[0].id);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(userPos);
        showToast('Located your position on the map!');
      },
      (err) => {
        setIsLocating(false);
        // Fallback to central hub if user denies or timeout
        console.warn('Geolocation error:', err.message);
        showToast('Centered on Central Hub.', 'info');
        if (locations[0]) {
          setSelectedParkingId(locations[0].id);
        }
      },
      { timeout: 7000, enableHighAccuracy: true }
    );
  };

  const handleDetailsClick = (parkingId) => {
    if (!isLoggedIn) {
      showToast('Please sign in to view facility details and reserve spots.', 'info');
      navigate(`/login?redirect=${encodeURIComponent(`/parking/${parkingId}`)}`);
      return;
    }
    navigate(`/parking/${parkingId}`);
  };

  return (
    <div
      className={`relative ${className} ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'rounded-2xl min-h-[460px]'
      } overflow-hidden border border-slate-200 shadow-md bg-slate-100 transition-all duration-200`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full absolute inset-0"
        style={{ width: '100%', height: '100%', minHeight: '460px' }}
      >
        <TileLayer
          key={mapLayer}
          url={currentTile.url}
          subdomains={currentTile.subdomains}
          maxZoom={currentTile.maxZoom}
          attribution={currentTile.attribution}
        />

        <MapRecenterAndResize selectedLocation={selectedLocation} userCoords={userLocation} locations={locations} />

        {/* User live position marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
            <Popup closeButton={false}>
              <div className="p-2 text-xs font-bold text-slate-800 text-center">
                📍 You are here
              </div>
            </Popup>
          </Marker>
        )}

        {/* Parking Spot Pins with Google Maps Popup */}
        {locations.map((parking) => {
          const isSelected = selectedParkingId === parking.id;
          const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${parking.coordinates.lat},${parking.coordinates.lng}`;

          return (
            <Marker
              key={parking.id}
              position={[parking.coordinates.lat, parking.coordinates.lng]}
              icon={createGoogleStyleMarkerIcon(parking, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedParkingId(parking.id);
                }
              }}
            >
              <Popup className="custom-popup" closeButton={false}>
                <div className="p-3 w-64 text-slate-800 text-left">
                  {/* Facility Image & Name */}
                  <div className="flex gap-2.5 items-center mb-2">
                    <img
                      src={parking.image}
                      alt={parking.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 leading-snug truncate">
                        {parking.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{parking.area}</p>
                      <div className="flex items-center text-amber-500 font-bold text-[11px] gap-0.5 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{parking.rating}</span>
                        <span className="text-slate-400 font-normal">({parking.reviewsCount || 42})</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Availability */}
                  <div className="flex items-center justify-between py-2 border-y border-slate-100 mb-2.5 text-xs">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{parking.pricePerHour}
                      </span>
                      <span className="text-slate-500 text-[11px]"> / hr</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{parking.availableSlots} bays available</span>
                    </div>
                  </div>

                  {/* Actions: View Details + Google Maps Directions */}
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleDetailsClick(parking.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      <span>{!isLoggedIn ? 'Sign In to Reserve' : 'View Details & Reserve'}</span>
                      {!isLoggedIn ? <Lock className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </button>

                    <a
                      href={googleMapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                      <span>Open in Google Maps</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* TOP-RIGHT: Google Maps Style Layer Switcher ([Map] | [Satellite] | [Terrain]) */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 p-1 flex items-center gap-1">
        <button
          type="button"
          onClick={() => setMapLayer('roadmap')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapLayer === 'roadmap'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Google Road Map"
        >
          Map
        </button>

        <button
          type="button"
          onClick={() => setMapLayer('satellite')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            mapLayer === 'satellite'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Google Satellite with Road Labels"
        >
          Satellite
        </button>

        <button
          type="button"
          onClick={() => setMapLayer('terrain')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all hidden sm:inline-block ${
            mapLayer === 'terrain'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Google Physical Terrain"
        >
          Terrain
        </button>

        {/* Fullscreen toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors ml-1 border-l border-slate-200 pl-2"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* TOP-LEFT: Floating Google Map Watermark & Parking Legend */}
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-200/90 text-xs font-bold text-slate-800 flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-extrabold text-slate-900 border-r border-slate-200 pr-2.5">
          <span className="text-emerald-600 font-mono text-sm">G</span>
          <span>Google Map View</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Car</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>Bike</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* BOTTOM-RIGHT: Floating My Location Button */}
      <button
        onClick={handleMyLocationClick}
        title="Locate my position on Google Map"
        className="absolute bottom-6 right-6 z-[400] bg-white hover:bg-slate-50 text-slate-800 hover:text-emerald-700 p-3 rounded-2xl shadow-xl border border-slate-200/90 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
      >
        <Navigation className={`w-4 h-4 text-emerald-600 ${isLocating ? 'animate-spin' : 'group-hover:rotate-45'} transition-transform`} />
        <span className="text-xs font-bold hidden sm:inline">
          {isLocating ? 'Locating...' : 'My Location'}
        </span>
      </button>
    </div>
  );
};

export default MapView;
