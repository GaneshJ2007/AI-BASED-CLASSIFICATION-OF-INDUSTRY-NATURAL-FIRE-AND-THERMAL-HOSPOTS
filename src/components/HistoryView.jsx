import React, { useState } from 'react';
import {
  History,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  Factory,
  Zap,
  Trees,
  Eye,
  CheckCircle2,
  AlertTriangle,
  BarChart2
} from 'lucide-react';

export default function HistoryView({ hotspots, onSelectHotspot, onInspectHotspot }) {
  const [selectedRange, setSelectedRange] = useState('30d');
  const [filterType, setFilterType] = useState('All');

  // Filter & sort by detection count / recurrence
  const filteredEvents = hotspots.filter((h) => {
    if (filterType === 'All') return true;
    return h.type === filterType;
  });

  const historicalEvents = [...filteredEvents].sort(
    (a, b) => (b.detectionCount || 0) - (a.detectionCount || 0)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <History className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Temporal Recurrence & Persistence Ledger
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Multi-overpass temporal tracking distinguishes between transient destructive fire outbreaks and permanent operational
            flare stacks (refineries, thermal power plants, cement kilns) across South India.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['All', 'Persistent Thermal', 'Industrial Fire', 'Natural Fire'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer text-[11px] ${
                  filterType === t ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conceptual Contrast: Acute Fire vs Persistent Flare Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Acute Industrial Fire */}
        <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
              <Factory className="w-4 h-4 text-rose-600" />
              <span>ACUTE INDUSTRIAL OUTBREAK</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white uppercase">
              Emergency
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <p className="font-semibold text-rose-950">Behavioral Signature:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
              <li>Sudden thermal surge (FRP &gt; 50 MW) at a coordinate with zero recent detections.</li>
              <li>High SWIR B12 / B11 reflectance spikes with sudden canopy or building loss.</li>
              <li>Plume expansion with elevated CO and localized toxic SO2/NO2 column ratios.</li>
            </ul>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-rose-200 text-[11px] text-rose-900 font-semibold">
            Protocol: Immediate HAZMAT foam dispatch, 1.5km cordon, and SDMA alert.
          </div>
        </div>

        {/* Card 2: Persistent Thermal Stack */}
        <div className="p-5 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>PERSISTENT OPERATIONAL SOURCE</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-600 text-white uppercase">
              Whitelisted
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <p className="font-semibold text-purple-950">Behavioral Signature:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
              <li>High multi-month recurrence (&gt; 10 detections within 1km radius).</li>
              <li>Stationary spatial centroid confined strictly inside OSM facility boundaries.</li>
              <li>Continuous baseline industrial emissions without sudden smoke or burn scars.</li>
            </ul>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-purple-200 text-[11px] text-purple-900 font-semibold">
            Protocol: Logged to environmental compliance ledger. Zero false emergency dispatches.
          </div>
        </div>
      </div>

      {/* Recurrence Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 font-display">
            Monitored Thermal Hotspots Ranked by Multi-Overpass Persistence
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Showing top {Math.min(15, historicalEvents.length)} signatures
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Event ID</th>
                <th className="py-3 px-4">Location / Facility</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 text-center">30-Day Detections</th>
                <th className="py-3 px-4 text-center">Persistence Score</th>
                <th className="py-3 px-4">AI Interpretation</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {historicalEvents.slice(0, 15).map((event) => {
                const count = event.detectionCount || 1;
                const persistencePct = Math.min(Math.round((count / 30) * 100), 100);
                const isPersistent = event.type === 'Persistent Thermal' || count >= 10;

                return (
                  <tr
                    key={event.id}
                    onClick={() => onSelectHotspot(event)}
                    className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{event.id}</td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <span className="font-semibold text-slate-800">{event.location}</span>
                      <span className="block text-[10px] text-slate-400 font-mono">{event.nearbyIndustry || event.nearestFacility}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          event.type === 'Industrial Fire'
                            ? 'bg-rose-100 text-rose-800'
                            : event.type === 'Natural Fire'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {event.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900 font-mono">
                      {count} / 30 days
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="w-24 mx-auto bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            isPersistent ? 'bg-purple-600' : count >= 5 ? 'bg-rose-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${persistencePct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">{persistencePct}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium text-slate-600">
                        {isPersistent
                          ? 'Continuous Operational Heat Stack (Whitelisted)'
                          : count >= 4
                          ? 'High Recurrence Anomaly - Requires Investigation'
                          : 'Isolated / Single-Pass Outbreak'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHotspot(event);
                          if (onInspectHotspot) onInspectHotspot(event);
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer"
                        title="Inspect Full Dossier"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
