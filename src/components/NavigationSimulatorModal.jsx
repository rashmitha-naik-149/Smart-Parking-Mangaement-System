import React, { useState, useEffect } from 'react';
import { Navigation, Compass, MapPin, CheckCircle2, ArrowRight, CornerUpRight, Volume2, X } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export const NavigationSimulatorModal = ({ isOpen, onClose, parking }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const steps = [
    {
      instruction: "Head northwest toward Destination Approach Road",
      distance: "400 m",
      turn: "straight",
      speed: "35 km/h"
    },
    {
      instruction: `Turn right onto ${parking?.area || 'Main'} Boulevard toward Entrance Bay`,
      distance: "150 m",
      turn: "right",
      speed: "25 km/h"
    },
    {
      instruction: `Approaching ${parking?.name || 'SmartPark Garage'} - Lane 1 Automated Gate`,
      distance: "50 m",
      turn: "straight",
      speed: "15 km/h"
    },
    {
      instruction: "ANPR Camera scanning license plate... Boom barrier opening! Proceed to Bay A.",
      distance: "Arrived",
      turn: "arrived",
      speed: "5 km/h"
    }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 3500);

    return () => clearInterval(interval);
  }, [isOpen, steps.length]);

  if (!isOpen || !parking) return null;

  const current = steps[currentStep];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Live Turn-by-Turn GPS Guidance"
      description={`Guiding you to ${parking.name}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4 text-left">
        {/* Navigation HUD Banner */}
        <div className="bg-slate-950 text-white p-5 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Turn Direction Icon & Primary Instruction */}
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-600 text-white shrink-0 shadow-md">
              {current.turn === 'arrived' ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : current.turn === 'right' ? (
                <CornerUpRight className="w-7 h-7" />
              ) : (
                <Navigation className="w-7 h-7 rotate-45" />
              )}
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                {current.distance}
              </div>
              <h4 className="text-base font-bold leading-snug mt-0.5 text-white">
                {current.instruction}
              </h4>
            </div>
          </div>

          {/* Telemetry Bar */}
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Speed: {current.speed}</span>
            </span>
            <span className="font-mono text-emerald-400">
              ETA: 3 mins
            </span>
          </div>
        </div>

        {/* Step Progression Indicators */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700">Route Waypoints</span>
          <div className="space-y-2">
            {steps.map((st, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  idx === currentStep
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                    : idx < currentStep
                    ? 'border-slate-100 bg-slate-50 text-slate-400 line-through'
                    : 'border-slate-100 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${idx <= currentStep ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {idx + 1}
                  </span>
                  <span className="line-clamp-1">{st.instruction}</span>
                </div>
                <span className="text-[11px] shrink-0 ml-2 font-mono">{st.distance}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${parking.coordinates.lat},${parking.coordinates.lng}`;
              window.open(url, '_blank');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
          >
            Open in Google Maps
          </button>

          <Button variant="primary" size="sm" onClick={onClose}>
            End Navigation
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NavigationSimulatorModal;
