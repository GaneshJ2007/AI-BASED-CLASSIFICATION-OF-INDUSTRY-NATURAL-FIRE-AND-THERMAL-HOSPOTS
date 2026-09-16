import React from 'react';
import { PieChart, BarChart2, TrendingUp, Calendar } from 'lucide-react';

export default function AnalyticsSection({ hotspots, counts }) {
  // Compute analytics
  const total = hotspots.length || 1;
  const industrialPct = Math.round((counts.industrial / total) * 100);
  const naturalPct = Math.round((counts.natural / total) * 100);
  const persistentPct = Math.round((counts.persistent / total) * 100);

  // Risk distribution
  const highRiskCount = hotspots.filter((h) => h.riskScore >= 80).length;
  const medRiskCount = hotspots.filter((h) => h.riskScore >= 60 && h.riskScore < 80).length;
  const lowRiskCount = hotspots.filter((h) => h.riskScore < 60).length;

  const highRiskPct = Math.round((highRiskCount / total) * 100);
  const medRiskPct = Math.round((medRiskCount / total) * 100);
  const lowRiskPct = Math.round((lowRiskCount / total) * 100);

  // Recurrence buckets
  const recurringHotspots = hotspots.filter((h) => (h.detectionCount || 0) >= 5).length;
  const singleEventHotspots = hotspots.filter((h) => (h.detectionCount || 0) < 5).length;
  const recurringPct = Math.round((recurringHotspots / total) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Hotspots by Type */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-sky-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Hotspots by Type
            </h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">Total: {total}</span>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex mb-3">
          <div
            style={{ width: `${industrialPct}%` }}
            className="bg-rose-500 h-full transition-all duration-500"
            title={`Industrial Fire: ${counts.industrial}`}
          />
          <div
            style={{ width: `${naturalPct}%` }}
            className="bg-amber-500 h-full transition-all duration-500"
            title={`Natural Fire: ${counts.natural}`}
          />
          <div
            style={{ width: `${persistentPct}%` }}
            className="bg-purple-500 h-full transition-all duration-500"
            title={`Persistent Thermal: ${counts.persistent}`}
          />
        </div>

        {/* Legend with counts */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-600 font-medium">Industrial Fire</span>
            </div>
            <span className="font-bold text-slate-800">
              {counts.industrial} <span className="text-slate-400 font-normal">({industrialPct}%)</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-600 font-medium">Natural Fire</span>
            </div>
            <span className="font-bold text-slate-800">
              {counts.natural} <span className="text-slate-400 font-normal">({naturalPct}%)</span>
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-slate-600 font-medium">Persistent Thermal</span>
            </div>
            <span className="font-bold text-slate-800">
              {counts.persistent} <span className="text-slate-400 font-normal">({persistentPct}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Risk Distribution */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BarChart2 className="w-4 h-4 text-rose-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Risk Distribution
            </h4>
          </div>
          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
            {highRiskCount} High Risk
          </span>
        </div>

        {/* Small Bars */}
        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">High Risk (Score ≥ 80%)</span>
              <span className="font-bold text-rose-600">{highRiskCount} ({highRiskPct}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${highRiskPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Medium Risk (60% – 79%)</span>
              <span className="font-bold text-amber-600">{medRiskCount} ({medRiskPct}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${medRiskPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-600 font-medium">Low Risk (&lt; 60%)</span>
              <span className="font-bold text-emerald-600">{lowRiskCount} ({lowRiskPct}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${lowRiskPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recurring Hotspots */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recurring Hotspots
            </h4>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">30-Day Window</span>
        </div>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 mb-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold font-display text-slate-900">
              {recurringHotspots}
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              {recurringPct}% of Total
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Hotspots detected ≥ 5 times in the last 30 days (High persistence indicator).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2 bg-slate-50 rounded border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Single-Occurrence</span>
            <span className="font-bold text-slate-800 text-sm">{singleEventHotspots}</span>
          </div>
          <div className="p-2 bg-slate-50 rounded border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Persistent (&gt;20x)</span>
            <span className="font-bold text-purple-700 text-sm">{counts.persistent}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
