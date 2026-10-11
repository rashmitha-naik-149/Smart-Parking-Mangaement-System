import React, { useState } from 'react';
import {
  CalendarCheck,
  Search,
  CheckCircle,
  XCircle,
  Filter,
  Eye,
  MapPin
} from 'lucide-react';
import { useBookings } from '../../context/BookingContext';
import Button from '../../components/Button';
import Modal from '../../components/Modal';

export const AdminBookings = () => {
  const { bookings, completeBooking, cancelBooking } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.parkingName.toLowerCase().includes(q) ||
        b.vehicleNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Booking Reservations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time reservations, vehicle entries, and completions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, plate, facility..."
              className="pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-emerald-500 w-44 sm:w-60"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Booking Ref</th>
                <th className="py-3.5 px-4">Facility & Bay</th>
                <th className="py-3.5 px-4">Vehicle Details</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Paid</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    {b.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{b.parkingName}</div>
                    <div className="text-emerald-700 font-extrabold text-[11px]">
                      Slot {b.slotNumber}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-mono font-bold text-slate-900">
                      {b.vehicleNumber}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {b.vehicleModel}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>{b.date}</div>
                    <div className="text-[11px] text-slate-400">
                      {b.startTime} - {b.endTime}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    ₹{b.totalAmount}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : b.status === 'completed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBookingDetails(b)}
                        className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {b.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => completeBooking(b.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => cancelBooking(b.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={Boolean(selectedBookingDetails)}
        onClose={() => setSelectedBookingDetails(null)}
        title={`Reservation Details — #${selectedBookingDetails?.id}`}
        maxWidth="max-w-md"
      >
        {selectedBookingDetails && (
          <div className="space-y-4 text-xs text-left">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Facility:</span>
                <span className="font-bold text-slate-900">{selectedBookingDetails.parkingName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Slot Bay:</span>
                <span className="font-extrabold text-emerald-700">Slot {selectedBookingDetails.slotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-bold">{selectedBookingDetails.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timing:</span>
                <span className="font-bold">{selectedBookingDetails.startTime} to {selectedBookingDetails.endTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-mono font-bold">{selectedBookingDetails.vehicleNumber} ({selectedBookingDetails.vehicleModel})</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-emerald-700">₹{selectedBookingDetails.totalAmount}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBookingDetails(null)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminBookings;
