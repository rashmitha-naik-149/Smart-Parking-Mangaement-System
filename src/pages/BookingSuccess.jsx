import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Car,
  QrCode,
  Download,
  Navigation,
  ArrowRight,
  Printer,
  Sparkles
} from 'lucide-react';
import { useBookings } from '../context/BookingContext';
import Button from '../components/Button';
import Modal from '../components/Modal';

export const BookingSuccess = () => {
  const navigate = useNavigate();
  const { latestBooking } = useBookings();
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const booking = latestBooking || {
    id: "SP20260924001",
    parkingName: "City Center Parking",
    area: "MG Road, Bengaluru",
    slotNumber: "A-24",
    slotLevel: "Level 1",
    date: "24 September 2026",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    totalAmount: 60,
    vehicleNumber: "KA-01-AB-1234",
    vehicleModel: "Hyundai i20"
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8 text-center">
      {/* Success Animation & Header */}
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10 animate-bounce">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Booking Confirmed!
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto">
          Your parking space has been successfully reserved. Scan your QR pass at the entrance gate.
        </p>
      </div>

      {/* Main Confirmation Pass Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden text-left">
        {/* Pass Top Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
              Digital Parking Pass
            </span>
            <div className="text-2xl font-mono font-extrabold tracking-wide mt-0.5">
              {booking.id}
            </div>
          </div>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/30">
            Confirmed & Paid
          </span>
        </div>

        {/* Pass Middle Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* QR Code Visual Component */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
            <div className="w-40 h-40 bg-white p-3 rounded-xl border-2 border-emerald-500 shadow-sm flex flex-col justify-between">
              <div className="grid grid-cols-6 gap-1 w-full h-full">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-[2px] ${
                      [0, 1, 2, 5, 6, 7, 8, 12, 13, 17, 18, 22, 23, 29, 30, 31, 35].includes(i)
                        ? 'bg-slate-900'
                        : i % 3 === 0
                        ? 'bg-emerald-600'
                        : 'bg-white'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider">
              Scan at Entrance
            </div>
          </div>

          {/* Booking Summary Details */}
          <div className="sm:col-span-7 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {booking.parkingName}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{booking.area}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Assigned Bay</span>
                <span className="text-lg font-extrabold text-emerald-700">
                  Slot {booking.slotNumber}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  {booking.slotLevel || 'Level 1'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block font-medium">Vehicle</span>
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {booking.vehicleModel}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {booking.vehicleNumber}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.date}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{booking.startTime} – {booking.endTime}</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 font-bold text-slate-900 text-sm">
                <span>Amount Paid</span>
                <span className="text-emerald-700 font-extrabold">₹{booking.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pass Actions Footer */}
        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => setShowReceiptModal(true)}
            icon={Download}
          >
            Download Receipt
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.parkingName + ' Bengaluru')}`;
                window.open(url, '_blank');
              }}
              icon={Navigation}
            >
              Get Directions
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/bookings')}
              icon={ArrowRight}
            >
              View Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      <Modal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title="Parking Tax Invoice & Receipt"
        maxWidth="max-w-lg"
      >
        <div className="space-y-5 text-left text-xs">
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <div className="font-extrabold text-base text-slate-900">
                🅿 SmartPark Technologies
              </div>
              <div className="text-slate-500">GSTIN: 29AABCS1429B1Z5</div>
              <div className="text-slate-500">Bengaluru, Karnataka - 560001</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-800">INVOICE</div>
              <div className="font-mono text-slate-500">INV-{booking.id}</div>
              <div className="text-slate-400">{booking.date}</div>
            </div>
          </div>

          <div>
            <div className="text-slate-500 font-semibold mb-1">Billed To:</div>
            <div className="font-bold text-slate-800">Registered Driver</div>
            <div className="text-slate-600">Vehicle: {booking.vehicleNumber} ({booking.vehicleModel})</div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2">Item Description</th>
                <th className="py-2 text-center">Bay</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5">
                  <div className="font-bold text-slate-800">{booking.parkingName}</div>
                  <div className="text-slate-500 text-[11px]">{booking.startTime} to {booking.endTime}</div>
                </td>
                <td className="py-2.5 text-center font-bold">{booking.slotNumber}</td>
                <td className="py-2.5 text-right font-bold text-slate-800">₹{booking.totalAmount}.00</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-500">Convenience Platform Fee</td>
                <td className="py-2 text-center">-</td>
                <td className="py-2 text-right font-medium text-emerald-600">FREE</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-900 text-sm font-extrabold text-slate-900">
                <td className="py-3">Grand Total Paid</td>
                <td className="py-3 text-center"></td>
                <td className="py-3 text-right text-emerald-700">₹{booking.totalAmount}.00</td>
              </tr>
            </tfoot>
          </table>

          <div className="bg-slate-50 p-3 rounded-xl text-[11px] text-slate-500">
            Paid electronically via UPI. This is a computer generated document.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowReceiptModal(false)}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} icon={Printer}>
              Print Receipt
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingSuccess;
