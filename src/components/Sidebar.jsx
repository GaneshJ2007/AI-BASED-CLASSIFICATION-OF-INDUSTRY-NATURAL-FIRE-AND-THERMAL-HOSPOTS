import React from 'react';
import {
  LayoutDashboard,
  Flame,
  ShieldAlert,
  Factory,
  History,
  Radio,
  Satellite,
  Compass,
  ArrowRight,
  Database,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { DATA_SOURCES } from '../data/mockHotspots';

export default function Sidebar({ activeTab, setActiveTab, counts, selectedFilter, onFilterChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: counts.total },
    { id: 'hotspots', label: 'Thermal Hotspots', icon: Flame, badge: counts.total },
    { id: 'ai-models', label: 'AI Models & SHAP', icon: Cpu, badge: 'F1 0.984' },
    { id: 'risk', label: 'Risk Analysis', icon: ShieldAlert, badge: `${counts.industrial} high` },
    { id: 'industrial', label: 'Industrial Zones', icon: Factory, badge: '8 Zones' },
    { id: 'history', label: 'Historical Events', icon: History, badge: '30 Days' },
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        {/* Navigation Links */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-sky-200/70 text-sky-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Core Detection Pipeline Diagram */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Core AI Pipeline
            </span>
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          </div>
          <div className="space-y-1.5 text-[11px] font-medium text-slate-700">
            <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200">
              <span className="text-sky-700 font-semibold">1. DETECT</span>
              <span className="text-[10px] text-slate-400">NASA FIRMS</span>
            </div>
            <div className="flex items-center justify-center text-slate-400">
              <ArrowRight className="w-3 h-3 rotate-90" />
            </div>
            <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200">
              <span className="text-indigo-700 font-semibold">2. FUSE & ANALYZE</span>
              <span className="text-[10px] text-slate-400">Sentinel + OSM</span>
            </div>
            <div className="flex items-center justify-center text-slate-400">
              <ArrowRight className="w-3 h-3 rotate-90" />
            </div>
            <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200">
              <span className="text-amber-700 font-semibold">3. CLASSIFY</span>
              <span className="text-[10px] text-slate-400">AI Model</span>
            </div>
            <div className="flex items-center justify-center text-slate-400">
              <ArrowRight className="w-3 h-3 rotate-90" />
            </div>
            <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200">
              <span className="text-rose-700 font-semibold">4. SCORE & ALERT</span>
              <span className="text-[10px] text-slate-400">Risk Matrix</span>
            </div>
          </div>
        </div>

        {/* Multi-Source Data Fusion Quick Health */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Data Feeds
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Live
            </span>
          </div>
          <div className="space-y-1.5">
            {DATA_SOURCES.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Satellite className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-xs font-medium text-slate-800">{source.name}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">{source.latency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Jury Quick Info / Help */}
      <div className="pt-4 mt-6 border-t border-slate-100">
        <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-lg text-slate-700">
          <p className="text-[11px] font-bold text-sky-900 mb-0.5">SIH Jury Demo Flow</p>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            Click any marker on the map to inspect AI classification, risk factors & 30-day thermal history.
          </p>
        </div>
      </div>
    </aside>
  );
}
