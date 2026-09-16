import React from 'react';
import { Satellite, Layers, Map, CloudSun, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DataSourcesBanner() {
  const sources = [
    {
      name: 'NASA FIRMS',
      tech: 'VIIRS 375m & MODIS 1km',
      desc: 'Near real-time active fire & thermal anomaly detection feeds.',
      badge: 'Active Feed',
      icon: Satellite,
      color: 'border-sky-200 bg-sky-50/60 text-sky-700',
      badgeClass: 'bg-sky-100 text-sky-800'
    },
    {
      name: 'Sentinel-1/2',
      tech: 'SWIR 20m & SAR Coherence',
      desc: 'High-res shortwave infrared & structural change detection.',
      badge: 'Synchronized',
      icon: Layers,
      color: 'border-indigo-200 bg-indigo-50/60 text-indigo-700',
      badgeClass: 'bg-indigo-100 text-indigo-800'
    },
    {
      name: 'OpenStreetMap',
      tech: 'Industrial Cadastre & Buffers',
      desc: 'Factory boundaries, hazmat yards, pipelines & distance matrices.',
      badge: 'Fused 1.5km Buffer',
      icon: Map,
      color: 'border-emerald-200 bg-emerald-50/60 text-emerald-700',
      badgeClass: 'bg-emerald-100 text-emerald-800'
    },
    {
      name: 'Environmental Data',
      tech: 'Wind, Humidity & Temp',
      desc: 'Dynamic ambient meteorology for fire propagation risk assessment.',
      badge: 'Real-Time Telemetry',
      icon: CloudSun,
      color: 'border-amber-200 bg-amber-50/60 text-amber-700',
      badgeClass: 'bg-amber-100 text-amber-800'
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-3 border-b border-slate-100 gap-2">
        <div>
          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
            Satellite & Spatial Integration
          </span>
          <h3 className="text-base font-bold text-slate-900 font-display">
            MULTI-SOURCE DATA FUSION
          </h3>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold">Automated AI Pipeline Verification</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {sources.map((src, i) => {
          const Icon = src.icon;
          return (
            <div
              key={i}
              className={`p-3.5 rounded-lg border transition-shadow hover:shadow-sm ${src.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center shadow-xs">
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${src.badgeClass}`}>
                  {src.badge}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">{src.name}</h4>
              <p className="text-[11px] font-semibold text-slate-700 mt-0.5">{src.tech}</p>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{src.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
