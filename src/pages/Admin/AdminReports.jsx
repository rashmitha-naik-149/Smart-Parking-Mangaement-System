import React from 'react';
import {
  BarChart3,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useParking } from '../../context/ParkingContext';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/Button';

export const AdminReports = () => {
  const { parkingList } = useParking();
  const { showToast } = useNotification();

  const handleExport = (type) => {
    showToast(`Exporting ${type.toUpperCase()} analytics report...`);
    setTimeout(() => {
      showToast(`${type.toUpperCase()} report successfully generated and saved!`);
    }, 1000);
  };

  // Peak hourly utilization mockup
  const hourlyData = [
    { hour: '06 AM', utilization: 18 },
    { hour: '08 AM', utilization: 45 },
    { hour: '10 AM', utilization: 88 },
    { hour: '12 PM', utilization: 92 },
    { hour: '02 PM', utilization: 78 },
    { hour: '04 PM', utilization: 84 },
    { hour: '06 PM', utilization: 96 },
    { hour: '08 PM', utilization: 90 },
    { hour: '10 PM', utilization: 52 },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Revenue & Occupancy Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Financial analytics, peak utilization graphs, and location profitability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('csv')}
            icon={Download}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleExport('pdf')}
            icon={Download}
          >
            Export PDF Report
          </Button>
        </div>
      </div>

      {/* Peak Occupancy Hours Chart */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Peak Hourly Parking Utilization
            </h3>
            <p className="text-xs text-slate-500">
              Average demand across all 57 monitored smart parking facilities
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            Peak Window: 6:00 PM – 8:00 PM (96%)
          </span>
        </div>

        <div className="h-52 flex items-end gap-3 sm:gap-6 justify-between pt-4 pb-2 px-2">
          {hourlyData.map((h) => (
            <div key={h.hour} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                {h.utilization}%
              </div>
              <div className="w-full bg-slate-100 rounded-t-xl h-full flex items-end overflow-hidden">
                <div
                  className={`w-full rounded-t-xl transition-all duration-500 ${
                    h.utilization > 85
                      ? 'bg-gradient-to-t from-emerald-700 to-emerald-500'
                      : 'bg-emerald-300'
                  }`}
                  style={{ height: `${h.utilization}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {h.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue By Location Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Monthly Revenue Breakdown by Facility
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase">
                <th className="py-2.5">Facility Name</th>
                <th className="py-2.5">Locality</th>
                <th className="py-2.5">Monthly Transactions</th>
                <th className="py-2.5">Avg Turnaround</th>
                <th className="py-2.5 text-right">Estimated Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {parkingList.map((p, idx) => {
                const estRevenue = Math.round(p.pricePerHour * p.totalSlots * 22 * 1.8);
                const transactions = Math.round(p.totalSlots * 18);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-slate-900">{p.name}</td>
                    <td className="py-3">{p.area}</td>
                    <td className="py-3 font-mono">{transactions} bookings</td>
                    <td className="py-3">2.4 hours</td>
                    <td className="py-3 text-right font-extrabold text-emerald-700">
                      ₹{estRevenue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
