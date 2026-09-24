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
  Cpu,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { DATA_SOURCES } from '../data/mockHotspots';

export default function Sidebar({ activeTab, setActiveTab, counts, onOpenDemoScenarios }) {
  const menuItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard, badge: counts.total },
    { id: 'hotspots', label: 'GIS Map & Registry', icon: Flame, badge: counts.total },
    { id: 'alerts', label: 'Alerts Center', icon: ShieldAlert, badge: `${counts.industrial} active`, badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'reduction', label: 'False-Alarm Funnel', icon: Filter, badge: '94.2% cut', badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'history', label: 'Persistence Ledger', icon: History, badge: '30 Days' },
    { id: 'risk', label: 'Risk Matrix', icon: ShieldAlert, badge: `${counts.highRisk} critical` },
    { id: 'ai-models', label: 'AI Benchmarks & SHAP', icon: Cpu, badge: 'F1 0.984' },
    { id: 'data-sources', label: 'Multi-Sensor Feeds', icon: Layers, badge: '6 Sensors' },
    { id: 'industrial', label: 'Industrial Cadastre', icon: Factory, badge: '53 Assets' }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 rounded-xl lg:rounded-none">
      <div className="space-y-5">
        {/* Quick Launch Judge Demo */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>SIH 2026 Evaluation</span>
            </span>
          </div>
          <p className="text-[11px] text-amber-950 font-semibold mb-2">
            3-Scenario Guided Judge Walkthrough
          </p>
          <button
            onClick={onOpenDemoScenarios}
            className="w-full py-1.5 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>Launch Walkthrough →</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
            Platform Views
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-100 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        item.badgeColor ||
                        (isActive ? 'bg-sky-200/70 text-sky-800' : 'bg-slate-100 text-slate-500')
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
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              AI Decision Pipeline
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="space-y-1 text-[11px] font-medium text-slate-700">
            <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200">
              <span className="text-sky-700 font-bold">1. DETECT</span>
              <span className="text-[10px] text-slate-400">NASA FIRMS</span>
            </div>
            <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200">
              <span className="text-indigo-700 font-bold">2. FUSE</span>
              <span className="text-[10px] text-slate-400">S1 + S2 + S5P + OSM</span>
            </div>
            <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200">
              <span className="text-amber-700 font-bold">3. CLASSIFY</span>
              <span className="text-[10px] text-slate-400">FT-T + XGBoost</span>
            </div>
            <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-200">
              <span className="text-rose-700 font-bold">4. SCORE & ALERT</span>
              <span className="text-[10px] text-slate-400">4-Tier SOP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center justify-between font-semibold">
          <span>NTRO PS 26162</span>
          <span className="text-emerald-600 font-bold">Prototype v2.0</span>
        </div>
      </div>
    </aside>
  );
}
