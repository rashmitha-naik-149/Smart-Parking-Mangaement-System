import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';

export const AdminParking = () => {
  const {
    parkingList,
    addParkingLocation,
    updateParkingLocation,
    deleteParkingLocation
  } = useParking();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingParking, setEditingParking] = useState(null);
  const [deletingParkingId, setDeletingParkingId] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [totalSlots, setTotalSlots] = useState(50);
  const [pricePerHour, setPricePerHour] = useState(30);

  const filteredLocations = parkingList.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setName('');
    setArea('');
    setAddress('');
    setTotalSlots(40);
    setPricePerHour(30);
    setShowAddModal(true);
  };

  const handleOpenEdit = (parking) => {
    setEditingParking(parking);
    setName(parking.name);
    setArea(parking.area);
    setAddress(parking.address);
    setTotalSlots(parking.totalSlots);
    setPricePerHour(parking.pricePerHour);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) return;

    addParkingLocation({
      name,
      area,
      address: address || `${area}, Bengaluru`,
      city: 'Bengaluru',
      totalSlots: Number(totalSlots),
      availableSlots: Number(totalSlots),
      occupiedSlots: 0,
      reservedSlots: 0,
      pricePerHour: Number(pricePerHour),
      coordinates: { lat: 12.9716, lng: 77.5946 },
      amenities: ['CCTV', 'Security', 'Covered Parking', '24/7'],
      vehicleTypes: ['Car', 'Bike'],
      rules: ['Valid parking reservation required for entry']
    });

    setShowAddModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingParking) return;

    updateParkingLocation(editingParking.id, {
      name,
      area,
      address,
      totalSlots: Number(totalSlots),
      pricePerHour: Number(pricePerHour)
    });

    setEditingParking(null);
  };

  const confirmDelete = () => {
    if (deletingParkingId) {
      deleteParkingLocation(deletingParkingId);
      setDeletingParkingId(null);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Search / Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Parking Locations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage smart parking facilities, tariffs, and monitored slots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search locations..."
              className="pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 w-44 sm:w-60"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            icon={Plus}
          >
            Add Parking
          </Button>
        </div>
      </div>

      {/* Locations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-4">Area</th>
                <th className="py-3.5 px-4">Hourly Tariff</th>
                <th className="py-3.5 px-4">Capacity / Availability</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLocations.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-slate-600 font-semibold">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{p.area}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900">₹{p.pricePerHour}</span>
                    <span className="text-slate-400 text-[11px]"> / hr</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-700">{p.availableSlots} free</span>
                      <span className="text-slate-400">/ {p.totalSlots} total</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Edit Facility"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingParkingId(p.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Facility"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Parking Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Parking Facility"
        description="Register a new smart facility into the discovery network"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
          <Input
            label="Facility Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Phoenix Marketcity Deck"
            required
          />

          <Input
            label="Area / Locality"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. Whitefield"
            required
          />

          <Input
            label="Full Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g. Main Road, Whitefield, Bengaluru"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Capacity (Slots)"
              type="number"
              value={totalSlots}
              onChange={(e) => setTotalSlots(e.target.value)}
              min="1"
              required
            />

            <Input
              label="Tariff (₹/hour)"
              type="number"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              min="5"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Create Location
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Parking Modal */}
      <Modal
        isOpen={Boolean(editingParking)}
        onClose={() => setEditingParking(null)}
        title="Edit Parking Facility"
        description="Update tariff or capacity details"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4 text-left">
          <Input
            label="Facility Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            required
          />

          <Input
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Slots"
              type="number"
              value={totalSlots}
              onChange={(e) => setTotalSlots(e.target.value)}
              required
            />

            <Input
              label="Price (₹/hr)"
              type="number"
              value={pricePerHour}
              onChange={(e) => setPricePerHour(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setEditingParking(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deletingParkingId)}
        onClose={() => setDeletingParkingId(null)}
        title="Delete Parking Facility"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-semibold">
              Are you sure you want to permanently delete this parking location?
            </p>
          </div>
          <p className="text-xs text-slate-500">
            Active reservations associated with this facility will be refunded and cancelled.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setDeletingParkingId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={confirmDelete}
            >
              Delete Facility
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminParking;
