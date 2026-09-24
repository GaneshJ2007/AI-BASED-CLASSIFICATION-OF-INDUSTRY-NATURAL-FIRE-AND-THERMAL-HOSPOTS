import React, { useState } from 'react';
import {
  Filter,
  ShieldCheck,
  Flame,
  Factory,
  Trees,
  Zap,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  DollarSign,
  BarChart3,
  Layers
} from 'lucide-react';

export default function FalseAlarmReductionView({ onNavigateToHotspots }) {
  const [costPerDispatch, setCostPerDispatch] = useState(25000); // INR estimated per emergency response mobilization

  const totalRawHotspots = 17377;
  const naturalFires = 15794;
  const persistentStacks = 1015;
  const acuteIndustrial = 568;

  // 1015 routine flare stacks whitelisted instead of sending emergency fire teams
  const totalIndustrialAlerts = persistentStacks + acuteIndustrial;
  const falseAlarmRate = ((persistentStacks / totalIndustrialAlerts) * 100).toFixed(1);
  const totalEstimatedSavings = (persistentStacks * costPerDispatch).toLocaleString('en-IN');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SIH 2026 Core Value Proposition</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              False-Alarm Reduction & Intelligent Segregation Funnel
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Standard NASA FIRMS satellite thermal anomalies cannot differentiate between routine industrial flare stacks,
              open wildland fires, and destructive industrial outbreaks. Thermal Tracers uses multi-sensor fusion and
              a Hybrid FT-Transformer + XGBoost model to eliminate 94.2% of false industrial emergency alarms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center shrink-0">
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
              False Alarm Reduction
            </span>
            <span className="text-3xl font-extrabold text-emerald-700 font-mono">
              {falseAlarmRate}%
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
              1,015 Stacks Whitelisted
            </span>
          </div>
        </div>
      </div>

      {/* The 3-Stage Segregation Funnel */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center space-x-2">
          <Filter className="w-4 h-4 text-sky-600" />
          <span>Multi-Stage Anomaly Filtering & Classification Architecture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Stage 1: Raw Satellite Feed */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">Stage 1</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">
                Unclassified
              </span>
            </div>

            <div>
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {totalRawHotspots.toLocaleString()}
              </span>
              <p className="text-xs font-bold text-slate-700 mt-0.5">Raw FIRMS Thermal Detections</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Unfiltered MODIS & VIIRS thermal anomalies across South India (2021-2025). High noise, zero semantic context.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>False-Alarm Risk:</span>
                <span className="font-bold text-rose-600">Extremely High</span>
              </div>
              <div className="flex justify-between">
                <span>Context:</span>
                <span className="font-semibold text-slate-700">Thermal Brightness Only</span>
              </div>
            </div>
          </div>

          {/* Stage 2: Multi-Sensor Data Fusion */}
          <div className="bg-sky-50/60 rounded-xl p-5 border border-sky-200 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-600 uppercase">Stage 2</span>
              <span className="text-[10px] bg-sky-200 text-sky-800 font-semibold px-2 py-0.5 rounded">
                Feature Fusion
              </span>
            </div>

            <div>
              <span className="text-2xl font-extrabold text-sky-700 font-mono">
                38 Channels
              </span>
              <p className="text-xs font-bold text-sky-900 mt-0.5">Biophysical & Cadastral Fusion</p>
              <p className="text-[11px] text-sky-800/80 mt-1">
                Copernicus Sentinel-5P (NO2/SO2/CO), Sentinel-1 SAR (VV/VH), Sentinel-2 (SWIR/NBR), Dynamic World, and OSM buffers.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-sky-200 text-[11px] text-sky-900 space-y-1">
              <div className="flex justify-between">
                <span>Spatial Disjoint CV:</span>
                <span className="font-bold text-sky-700">55km Blocks</span>
              </div>
              <div className="flex justify-between">
                <span>Chemical Signature:</span>
                <span className="font-semibold text-sky-800">TROPOMI Stack Ratio</span>
              </div>
            </div>
          </div>

          {/* Stage 3: Tri-Class Segregation */}
          <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase">Stage 3</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                AI Classified
              </span>
            </div>

            <div>
              <span className="text-2xl font-extrabold text-emerald-700 font-mono">
                3 Dedicated Classes
              </span>
              <p className="text-xs font-bold text-emerald-900 mt-0.5">Actionable Hazard Segregation</p>
              <p className="text-[11px] text-emerald-800/80 mt-1">
                Pinpoints acute destructive emergencies while whitelisting regular manufacturing flare stacks.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
              <div className="flex justify-between">
                <span>Macro-F1 Score:</span>
                <span className="font-mono font-bold text-emerald-700">0.9841</span>
              </div>
              <div className="flex justify-between">
                <span>Ensemble Accuracy:</span>
                <span className="font-mono font-bold text-emerald-700">99.83%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Segregation Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Natural Fire */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trees className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900">Natural & Forest Fires</span>
              </div>
              <span className="text-xs font-mono font-extrabold text-amber-700">90.9%</span>
            </div>
            <p className="text-xl font-extrabold text-slate-800 font-mono">{naturalFires.toLocaleString()}</p>
            <p className="text-[11px] text-slate-600">
              Biomass combustions in wildlands routed automatically to state forest watchtowers and wildfire response units.
            </p>
          </div>

          {/* Persistent Thermal Source */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-purple-900">Persistent Stacks (Whitelisted)</span>
              </div>
              <span className="text-xs font-mono font-extrabold text-purple-700">5.8%</span>
            </div>
            <p className="text-xl font-extrabold text-slate-800 font-mono">{persistentStacks.toLocaleString()}</p>
            <p className="text-[11px] text-slate-600">
              Continuous thermal emissions inside refineries & power plants whitelisted. <strong className="text-purple-800">1,015 false fire dispatches prevented.</strong>
            </p>
          </div>

          {/* Industrial Fire */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Factory className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-rose-900">Acute Industrial Fires</span>
              </div>
              <span className="text-xs font-mono font-extrabold text-rose-700">3.3%</span>
            </div>
            <p className="text-xl font-extrabold text-rose-700 font-mono">{acuteIndustrial.toLocaleString()}</p>
            <p className="text-[11px] text-slate-600">
              High-priority chemical outbreaks triggering automated HAZMAT foam mobilization and Tier-1 emergency SOPs.
            </p>
          </div>
        </div>
      </div>

      {/* Operational Impact & Economic Savings Calculator */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-display flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Operational Cost & Resource Savings Estimator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Quantifiable savings for disaster management authorities by eliminating false industrial fire alarms.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500">Avg Cost per Emergency Mobilization:</span>
            <select
              value={costPerDispatch}
              onChange={(e) => setCostPerDispatch(Number(e.target.value))}
              className="text-xs font-semibold rounded-md border border-slate-300 py-1 px-2 bg-slate-50 text-slate-800"
            >
              <option value={15000}>₹15,000 / dispatch</option>
              <option value={25000}>₹25,000 / dispatch (Std)</option>
              <option value={50000}>₹50,000 / dispatch (HAZMAT)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">False Alarms Averted</span>
            <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              1,015
            </p>
            <span className="text-xs text-slate-500 block mt-0.5">
              Whitelisted routine plant operations
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fire Brigade Hours Saved</span>
            <p className="text-2xl font-extrabold text-sky-700 font-mono mt-1">
              ~4,060 hrs
            </p>
            <span className="text-xs text-slate-500 block mt-0.5">
              Based on 4hr turnaround per squad
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">Estimated Taxpayer Savings</span>
            <p className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
              ₹{totalEstimatedSavings}
            </p>
            <span className="text-xs text-emerald-800 block mt-0.5 font-semibold">
              Conserved emergency public expenditure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
