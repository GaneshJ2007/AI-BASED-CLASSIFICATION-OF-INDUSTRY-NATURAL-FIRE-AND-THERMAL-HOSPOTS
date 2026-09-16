import React, { useState, useEffect } from 'react';
import {
  Activity,
  Satellite,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Factory,
  Zap,
  Trees,
  X,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function RunAnalysisModal({ isOpen, onClose, onApplyNewHotspots }) {
  const [step, setStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    { title: 'Connecting to NASA FIRMS real-time stream (VIIRS 375m & MODIS)...', icon: Satellite },
    { title: 'Fusing Sentinel-2 SWIR 20m & OpenStreetMap Industrial Cadastre...', icon: Layers },
    { title: 'Executing AI Thermal Classification & Spatial Proximity scoring...', icon: Cpu },
    { title: 'Finalizing risk matrix and spatial cluster index...', icon: Activity }
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setIsCompleted(false);
      return;
    }

    // Step-by-step progress animation
    const timer1 = setTimeout(() => setStep(1), 600);
    const timer2 = setTimeout(() => setStep(2), 1400);
    const timer3 = setTimeout(() => setStep(3), 2200);
    const timer4 = setTimeout(() => {
      setIsCompleted(true);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    onApplyNewHotspots();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-display tracking-tight text-white">
                THERMAL TRACERS AI PIPELINE
              </h3>
              <p className="text-xs text-slate-300">
                Multi-Source Satellite & Cadastre Live Ingest
              </p>
            </div>
          </div>
          {isCompleted && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {!isCompleted ? (
            /* Loading Steps Animation */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-sky-600">Running AI Model Inference...</span>
                <span>{Math.min(Math.round(((step + 1) / steps.length) * 100), 95)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 transition-all duration-500 rounded-full"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>

              <div className="mt-4 space-y-3">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = step === idx;
                  const isDone = step > idx;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center space-x-3 p-2.5 rounded-lg border text-xs transition-all ${
                        isActive
                          ? 'bg-sky-50 border-sky-200 text-sky-900 font-semibold'
                          : isDone
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : 'bg-white border-transparent text-slate-400 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-600'
                            : isActive
                            ? 'bg-sky-500 text-white animate-spin'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <span className="leading-snug">{s.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Analysis Complete Results Display */
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-extrabold font-display text-emerald-900">
                    ANALYSIS COMPLETE
                  </h4>
                  <p className="text-xs text-emerald-700 font-medium">
                    12 New Thermal Anomalies Discovered Across South India
                  </p>
                </div>
              </div>

              {/* Breakdown Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
                  <div className="w-7 h-7 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-1.5">
                    <Factory className="w-4 h-4" />
                  </div>
                  <span className="text-xl font-extrabold font-display text-rose-700 block">
                    3
                  </span>
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-tight">
                    Industrial-Risk
                  </span>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
                  <div className="w-7 h-7 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-1.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-xl font-extrabold font-display text-purple-700 block">
                    2
                  </span>
                  <span className="text-[10px] font-bold text-purple-800 uppercase tracking-tight">
                    Persistent
                  </span>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <div className="w-7 h-7 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-1.5">
                    <Trees className="w-4 h-4" />
                  </div>
                  <span className="text-xl font-extrabold font-display text-amber-700 block">
                    7
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-tight">
                    Natural Fire
                  </span>
                </div>
              </div>

              {/* Critical Alert Highlight */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-rose-700 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Flagged High-Risk Alert: TH-1024-LIVE</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Ennore Port Hazardous Depot: 0.4 km proximity to LPG fuel tanks. Risk score: 94%, Confidence: 96%.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={handleFinish}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <span>View New Hotspots on Map</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
