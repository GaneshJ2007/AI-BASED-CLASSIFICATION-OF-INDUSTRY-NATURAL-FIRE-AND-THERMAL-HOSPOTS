import React, { useState } from 'react';
import { History, Calendar, Filter, Download, ArrowUpRight, Factory, Zap, Trees } from 'lucide-react';

export default function HistoryView({ hotspots, onSelectHotspot }) {
  const [selectedRange, setSelectedRange] = useState('30d');

  // Sorted by detection count / recurrence
  const historicalEvents = [...hotspots].sort((a, b) => (b.detectionCount || 0) - (a.detectionCount || 0));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <History className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Historical Thermal Recurrence Log
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            30-Day temporal analysis used to distinguish persistent industrial stacks from sudden industrial fire outbreaks.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedRange('7d')}
              className={`px-3 py-1 rounded font-semibold ${
                selectedRange === '7d' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Past 7 Days
            </button>
            <button
              onClick={() => setSelectedRange('30d')}
              className={`px-3 py-1 rounded font-semibold ${
                selectedRange === '30d' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Past 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Recurrence Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Top Thermal Signatures Ranked by Multi-Day Persistence
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Showing top {Math.min(15, historicalEvents.length)} monitored locations
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
                <th className="py-3 px-4 text-center">Thermal Persistence %</th>
                <th className="py-3 px-4">AI Interpretation</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {historicalEvents.slice(0, 12).map((event) => {
                const count = event.detectionCount || 1;
                const persistencePct = Math.min(Math.round((count / 30) * 100), 100);
                const isPersistent = count >= 20;

                return (
                  <tr
                    key={event.id}
                    onClick={() => onSelectHotspot(event)}
                    className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900">{event.id}</td>
                    <td className="py-3 px-4 max-w-xs truncate">
                      <span className="font-semibold text-slate-800">{event.location}</span>
                      <span className="block text-[10px] text-slate-400">{event.nearbyIndustry}</span>
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
                    <td className="py-3 px-4 text-center font-bold text-slate-900">
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
                      <span className="text-[10px] text-slate-500 mt-0.5 block">{persistencePct}%</span>
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
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHotspot(event);
                        }}
                        className="p-1 rounded text-sky-600 hover:bg-sky-50 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
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
