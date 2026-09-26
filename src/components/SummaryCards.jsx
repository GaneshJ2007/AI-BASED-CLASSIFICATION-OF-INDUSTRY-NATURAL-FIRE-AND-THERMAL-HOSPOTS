import React from 'react';
import { Flame, Factory, Trees, Zap, AlertTriangle, Info, ShieldAlert } from 'lucide-react';

export default function SummaryCards({ counts, selectedFilter, onFilterChange }) {
  const cards = [
    {
      id: 'All',
      title: 'Total Surveillance',
      count: counts.total,
      subtitle: 'Multi-Temporal Satellite Catalog',
      icon: Flame,
      color: 'sky',
      borderClass: selectedFilter === 'All' ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-sky-300',
      iconBg: 'bg-sky-50 text-sky-600',
      tag: '540 Events',
      tagBg: 'bg-sky-100 text-sky-800'
    },
    {
      id: 'Industrial Fire',
      title: 'Industrial Fire',
      count: counts.industrial,
      subtitle: 'Acute Hazmat / Near Industrial Assets',
      icon: Factory,
      color: 'rose',
      borderClass: selectedFilter === 'Industrial Fire' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600',
      tag: 'High Priority',
      tagBg: 'bg-rose-100 text-rose-800'
    },
    {
      id: 'Natural Fire',
      title: 'Natural Fire',
      count: counts.natural,
      subtitle: 'Forest Canopy / Wildland Biomass',
      icon: Trees,
      color: 'amber',
      borderClass: selectedFilter === 'Natural Fire' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
      tag: 'Forest Dept',
      tagBg: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'Persistent Thermal',
      title: 'Persistent Thermal',
      count: counts.persistent,
      subtitle: 'Compliant Power Plants / Flare Stacks',
      icon: Zap,
      color: 'purple',
      borderClass: selectedFilter === 'Persistent Thermal' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-200 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600',
      tag: 'Whitelisted Non-Fire',
      tagBg: 'bg-purple-100 text-purple-800'
    },
  ];

  return (
    <div className="space-y-3">
      {/* 4 Category Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedFilter === card.id;

          return (
            <button
              key={card.id}
              onClick={() => onFilterChange(card.id)}
              className={`text-left bg-white p-4 rounded-xl border transition-all duration-150 shadow-sm hover:shadow ${card.borderClass} cursor-pointer group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.iconBg} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${card.tagBg}`}>
                  {card.tag}
                </span>
              </div>
              
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                    {card.title}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 mt-0.5">
                    {card.count}
                  </h3>
                </div>
                {card.id === 'Industrial Fire' && (
                  <div className="flex items-center text-rose-600 text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                    <span>Action Needed</span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mt-2 truncate">
                {card.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Scope & Clarification Operational Banner */}
      <div className="bg-slate-100/90 rounded-xl p-3 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-600 max-w-2xl">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong className="text-slate-800 font-semibold">Operational Intelligence Notice:</strong> Hotspots represent multi-sensor surveillance observations. Persistent thermal sources are <strong>whitelisted industrial operations</strong> (not fires). Use the buttons to switch views:
          </span>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => onFilterChange('Active Alerts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              selectedFilter === 'Active Alerts'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-current" />
            <span>Active Hazard Alerts ({counts.activeAlerts || counts.highRisk})</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              selectedFilter === 'All'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-current" />
            <span>All Catalog Events ({counts.total})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
