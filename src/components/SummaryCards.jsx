import React from 'react';
import { Flame, Factory, Trees, Zap, AlertTriangle } from 'lucide-react';

export default function SummaryCards({ counts, selectedFilter, onFilterChange }) {
  const cards = [
    {
      id: 'All',
      title: 'Total Hotspots',
      count: counts.total,
      subtitle: 'Active Satellite Detections',
      icon: Flame,
      color: 'sky',
      borderClass: selectedFilter === 'All' ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-sky-300',
      iconBg: 'bg-sky-50 text-sky-600',
      tag: 'Live Ingest',
      tagBg: 'bg-sky-100 text-sky-800'
    },
    {
      id: 'Industrial Fire',
      title: 'Industrial Fire',
      count: counts.industrial,
      subtitle: 'Near Industrial / Hazmat Zones',
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
      subtitle: 'Wildland / Forest Canopy',
      icon: Trees,
      color: 'amber',
      borderClass: selectedFilter === 'Natural Fire' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
      tag: 'Eco-Alert',
      tagBg: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'Persistent Thermal',
      title: 'Persistent Thermal',
      count: counts.persistent,
      subtitle: 'Power Stacks / Kilns / Smelters',
      icon: Zap,
      color: 'purple',
      borderClass: selectedFilter === 'Persistent Thermal' ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-200 hover:border-purple-300',
      iconBg: 'bg-purple-50 text-purple-600',
      tag: 'Whitelisted',
      tagBg: 'bg-purple-100 text-purple-800'
    },
  ];

  return (
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
  );
}
