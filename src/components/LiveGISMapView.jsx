import React, { useState, useMemo } from 'react';
import InteractiveMap from './InteractiveMap';
import EventDetailsPanel from './EventDetailsPanel';
import HotspotTable from './HotspotTable';
import {
  Compass,
  Layers,
  Filter,
  Factory,
  Trees,
  Zap,
  ShieldAlert,
  Flame,
  ChevronDown,
  ChevronUp,
  Table,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function LiveGISMapView({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  counts,
  onInspectHotspot,
  onNavigateToAnalysis,
  selectedFilter,
  setSelectedFilter
}) {
  const [riskFilter, setRiskFilter] = useState('All');
  const [showTable, setShowTable] = useState(true);

  // Compute filtered hotspots based on category filter and risk filter
  const displayHotspots = useMemo(() => {
    return hotspots.filter((h) => {
      // Classification filter
      if (selectedFilter !== 'All') {
        if (selectedFilter === 'High Risk') {
          if (h.riskTier !== 'Critical' && (!h.riskScore || h.riskScore < 80)) return false;
        } else if (selectedFilter === 'Active Alerts') {
          if ((h.riskTier !== 'Critical' && h.riskTier !== 'High') || h.type === 'Persistent Thermal') return false;
        } else if (h.type !== selectedFilter) {
          return false;
        }
      }

      // Risk Tier filter
      if (riskFilter !== 'All') {
        if (h.riskTier !== riskFilter) return false;
      }

      return true;
    });
  }, [hotspots, selectedFilter, riskFilter]);

  return (
    <div className="space-y-6">
      {/* 1. GIS Map Command Header & Primary Filter Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200">
              MAIN MODULE
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Live GIS Map & Thermal Hazard Explorer
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Locate and discriminate acute industrial fires, natural forest wildfires, and persistent compliant thermal sources across South India with 1.5km buffer layers and forest boundaries.
          </p>
        </div>

        {/* Primary Classification Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedFilter('All')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              selectedFilter === 'All'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>All Hotspots</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700 text-slate-200">
              {counts.total}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('Industrial Fire')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              selectedFilter === 'Industrial Fire'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Industrial Fire</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-700 text-rose-100">
              {counts.industrial}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('Natural Fire')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              selectedFilter === 'Natural Fire'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>Forest / Natural Fire</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-700 text-amber-100">
              {counts.natural}
            </span>
          </button>

          <button
            onClick={() => setSelectedFilter('Persistent Thermal')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
              selectedFilter === 'Persistent Thermal'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Thermal Hotspots</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-700 text-purple-100">
              {counts.persistent}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Interactive GIS Map & Event Inspector Side Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <InteractiveMap
            hotspots={displayHotspots}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={onSelectHotspot}
            counts={counts}
            onInspectHotspot={onInspectHotspot}
            onNavigateToAnalysis={onNavigateToAnalysis}
          />
        </div>

        <div className="xl:col-span-1">
          <EventDetailsPanel
            hotspot={selectedHotspot}
            onClose={() => onSelectHotspot(null)}
            onInspectHotspot={onInspectHotspot}
            onNavigateToAnalysis={onNavigateToAnalysis}
          />
        </div>
      </div>

      {/* 3. Collapsible Hotspot Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => setShowTable((prev) => !prev)}
          className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none hover:bg-slate-100/80 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Hotspots Observation Ledger ({displayHotspots.length} Records)
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
            <span>{showTable ? 'Hide Table' : 'Show Table'}</span>
            {showTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {showTable && (
          <div className="p-4">
            <HotspotTable
              hotspots={displayHotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={onSelectHotspot}
              onInspectHotspot={onInspectHotspot}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              onNavigateToAnalysis={onNavigateToAnalysis}
            />
          </div>
        )}
      </div>
    </div>
  );
}
