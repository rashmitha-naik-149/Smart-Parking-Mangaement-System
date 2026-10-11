import React from 'react';
import {
  ShieldCheck,
  Video,
  Zap,
  Car,
  Accessibility,
  Clock,
  Sparkles,
  Check
} from 'lucide-react';

const amenityMeta = {
  'Security': {
    icon: ShieldCheck,
    label: 'Security',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    description: 'On-site security personnel & barrier controls'
  },
  'CCTV': {
    icon: Video,
    label: 'CCTV',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    description: '24/7 high-definition surveillance'
  },
  'EV Charging': {
    icon: Zap,
    label: 'EV Charging',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    description: 'Fast AC & DC vehicle charging bays'
  },
  'Covered Parking': {
    icon: Car,
    label: 'Covered Parking',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    description: 'Sheltered weather-proof parking deck'
  },
  'Accessible Parking': {
    icon: Accessibility,
    label: 'Accessible',
    color: 'text-sky-600 bg-sky-50 border-sky-100',
    description: 'Dedicated ramp and disabled parking spaces'
  },
  '24/7': {
    icon: Clock,
    label: '24/7 Access',
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    description: 'Round-the-clock entry and automated exits'
  }
};

export const AmenityCard = ({ name, detailed = false, className = '' }) => {
  const meta = amenityMeta[name] || {
    icon: Sparkles,
    label: name,
    color: 'text-slate-700 bg-slate-100 border-slate-200',
    description: name
  };

  const Icon = meta.icon;

  if (detailed) {
    return (
      <div className={`p-4 rounded-2xl border bg-white shadow-sm flex items-start gap-3.5 transition-all hover:border-emerald-200 hover:shadow-md ${className}`}>
        <div className={`p-2.5 rounded-xl border ${meta.color} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            {meta.label}
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
          </div>
          <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            {meta.description}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${meta.color} ${className}`}
      title={meta.description}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{meta.label}</span>
    </div>
  );
};
export default AmenityCard;
