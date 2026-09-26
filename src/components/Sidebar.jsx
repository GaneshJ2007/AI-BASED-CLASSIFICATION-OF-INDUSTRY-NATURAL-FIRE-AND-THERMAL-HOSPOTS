import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Eye,
  History,
  ShieldAlert,
  Flame,
  Radio,
  Satellite,
  ArrowRight,
  CheckCircle2,
  Cpu
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, counts }) {
  const menuItems = [
    {
      id: 'dashboard',
      label: '1. Dashboard',
      subtitle: 'Overview + stats + alerts',
      icon: LayoutDashboard,
      badge: `${counts.total} events`
    },
    {
      id: 'gis-map',
      label: '2. Live GIS Map',
      subtitle: 'MAIN MODULE',
      icon: Compass,
      badge: 'MAIN MODULE',
      badgeColor: 'bg-sky-600 text-white font-extrabold shadow-2xs'
    },
    {
      id: 'hotspot-analysis',
      label: '3. Hotspot Analysis',
      subtitle: 'Single event dossier',
      icon: Eye,
      badge: 'Deep AI'
    },
    {
      id: 'historical-analysis',
      label: '4. Historical Analysis',
      subtitle: 'Persistence + timeline',
      icon: History,
      badge: '2021-25'
    },
    {
      id: 'alerts',
      label: '5. Alerts',
      subtitle: 'High-risk thermal events',
      icon: ShieldAlert,
      badge: `${counts.highRisk} active`,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
    }
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 shrink-0 rounded-xl lg:rounded-none">
      <div className="space-y-5">
        {/* Navigation Links */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
            <span>Core Screens</span>
            <span className="text-[10px] text-sky-600 font-bold">5 Modules</span>
          </div>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <div className="truncate">
                      <p className="truncate leading-tight font-bold">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-normal truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ${
                        item.badgeColor ||
                        (isActive ? 'bg-sky-200/80 text-sky-900 font-bold' : 'bg-slate-100 text-slate-500 font-medium')
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

        {/* Map Legend Quick Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              GIS Classification
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-1.5 text-[11px] font-medium text-slate-700">
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="text-rose-700 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Industry Fire
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">{counts.industrial}</span>
            </div>
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="text-amber-700 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Forest Fire
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">{counts.natural}</span>
            </div>
            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-200">
              <span className="text-purple-700 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Thermal Hotspots
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">{counts.persistent}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center justify-between font-semibold">
          <span>NTRO PS 26162</span>
          <span className="text-emerald-600 font-bold">5-Screen Edition</span>
        </div>
      </div>
    </aside>
  );
}
