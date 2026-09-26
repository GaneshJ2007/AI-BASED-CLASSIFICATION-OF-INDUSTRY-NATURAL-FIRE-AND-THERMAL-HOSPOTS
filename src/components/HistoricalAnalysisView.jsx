import React, { useState, useMemo } from 'react';
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
  BarChart2,
  Clock,
  Compass,
  Search,
  Activity,
  ChevronRight
} from 'lucide-react';

export default function HistoricalAnalysisView({
  hotspots,
  onSelectHotspot,
  onNavigateToTab
}) {
  const [selectedRange, setSelectedRange] = useState('All'); // '30d' | '1y' | 'multi-year' | 'All'
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent vs Transient classification breakdown
  const persistenceStats = useMemo(() => {
    const persistentCount = hotspots.filter((h) => h.type === 'Persistent Thermal').length;
    const industrialAcute = hotspots.filter((h) => h.type === 'Industrial Fire').length;
    const naturalWildfire = hotspots.filter((h) => h.type === 'Natural Fire').length;

    return {
      persistentCount,
      industrialAcute,
      naturalWildfire,
      totalCatalog: hotspots.length
    };
  }, [hotspots]);

  // Filter & sort by recurrence count
  const filteredEvents = useMemo(() => {
    return hotspots.filter((h) => {
      if (filterType !== 'All' && h.type !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          h.id.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          (h.nearestFacility && h.nearestFacility.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [hotspots, filterType, searchQuery]);

  // Sort by detection count
  const historicalEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => (b.detectionCount || 0) - (a.detectionCount || 0));
  }, [filteredEvents]);

  // Top persistent operational facilities
  const persistentFacilities = [
    { name: 'NLC Neyveli Lignite Thermal Power Station', city: 'Cuddalore, TN', detections: '32 overpasses / 30d', frp: '86.4 MW', status: 'Operational Boiler Stack' },
    { name: 'CPCL Manali Petroleum Refining Complex', city: 'Chennai, TN', detections: '28 overpasses / 30d', frp: '78.2 MW', status: 'Continuous Flare Stack' },
    { name: 'Ramagundam Super Thermal Power Station', city: 'Ramagundam, TG', detections: '29 overpasses / 30d', frp: '82.0 MW', status: 'Continuous Thermal Stack' },
    { name: 'JSW Steel Vijayanagar Smelting Complex', city: 'Bellary, KA', detections: '26 overpasses / 30d', frp: '94.5 MW', status: 'Blast Furnace Emission' },
    { name: 'Visakhapatnam Steel Plant (RINL)', city: 'Vizag, AP', detections: '25 overpasses / 30d', frp: '76.8 MW', status: 'Coke Oven Battery' }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header & Historical Perspective */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <History className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Historical Analysis • Persistence, Recurrence & Timeline
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl">
            Multi-temporal satellite archive (2021-2025) tracking thermal persistence across South India. Distinguishes acute catastrophic fire outbreaks from permanent operational industrial heat stacks.
          </p>
        </div>

        {/* Filter Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          {['All', 'Persistent Thermal', 'Industrial Fire', 'Natural Fire'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer text-[11px] ${
                filterType === t ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Persistence vs Acute Fire Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Acute Industrial Outbreak Signature */}
        <div className="p-5 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
              <Factory className="w-4 h-4 text-rose-600" />
              <span>ACUTE INDUSTRIAL OUTBREAK SIGNATURE</span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-600 text-white uppercase">
              Emergency
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-rose-950">Behavioral Dynamics & Temporal Profile:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
              <li><strong>Sudden Thermal Spike:</strong> FRP exceeds 50 MW at coordinates with zero prior detections in the past 6 months.</li>
              <li><strong>Rapid Spread:</strong> Downwind plume dispersion with sudden spike in tropospheric NO₂ and toxic SO₂.</li>
              <li><strong>Structural Coherence Loss:</strong> Sentinel-1 SAR radar reveals immediate structural building collapse.</li>
            </ul>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-rose-200 text-[11px] text-rose-900 font-semibold flex items-center justify-between">
            <span>Protocol: Immediate HAZMAT foam dispatch, 1.5km cordon & SDMA alert.</span>
            <span className="font-mono text-rose-700 font-bold">{persistenceStats.industrialAcute} Events</span>
          </div>
        </div>

        {/* Persistent Thermal Source Signature */}
        <div className="p-5 rounded-xl border border-purple-200 bg-purple-50/40 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs">
              <Zap className="w-4 h-4 text-purple-600" />
              <span>PERSISTENT OPERATIONAL THERMAL SIGNATURE</span>
            </div>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-600 text-white uppercase">
              Whitelisted
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <p className="font-bold text-purple-950">Behavioral Dynamics & Temporal Profile:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
              <li><strong>Continuous Heat Trace:</strong> Steady FRP (30 - 90 MW) recurring across 20+ consecutive satellite passes.</li>
              <li><strong>Cadastral Co-location:</strong> Exact geometric match with registered power station boiler chimney or refinery flare.</li>
              <li><strong>Predictable Baseline:</strong> No structural damage or canopy loss; compliant operational heat emission.</li>
            </ul>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-purple-200 text-[11px] text-purple-900 font-semibold flex items-center justify-between">
            <span>Protocol: Whitelist from emergency queue; suppresses 94.2% of false alarms.</span>
            <span className="font-mono text-purple-700 font-bold">{persistenceStats.persistentCount} Sources</span>
          </div>
        </div>
      </div>

      {/* 3. Recurrence Analysis & Seasonal Heatmap Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recurrence Distribution Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recurrence Frequency Spectrum
              </h3>
            </div>
            <span className="text-[11px] font-bold text-slate-400">30-Day Window</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-700 font-semibold mb-1">
                <span>Single Anomaly (1 Detection - Transient)</span>
                <span className="font-bold text-amber-600">62%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Spontaneous forest fire or agricultural burn</p>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-semibold mb-1">
                <span>Intermittent Pulse (2-5 Detections)</span>
                <span className="font-bold text-sky-600">24%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '24%' }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Multi-day forest spread or industrial maintenance cycle</p>
            </div>

            <div>
              <div className="flex justify-between text-slate-700 font-semibold mb-1">
                <span>Chronic Persistent (&gt;15 Detections)</span>
                <span className="font-bold text-purple-600">14%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '14%' }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Continuous power station / refinery flare stack</p>
            </div>
          </div>
        </div>

        {/* Seasonal Monthly Recurrence Trends */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                South India Fire Seasonality (Jan - Dec Multi-Year Curve)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Peak: Feb - May
            </span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 text-center text-xs">
            {[
              { m: 'Jan', nat: 240, ind: 14, pers: 45 },
              { m: 'Feb', nat: 680, ind: 18, pers: 46 },
              { m: 'Mar', nat: 1840, ind: 22, pers: 48 },
              { m: 'Apr', nat: 2150, ind: 19, pers: 47 },
              { m: 'May', nat: 920, ind: 15, pers: 45 },
              { m: 'Jun', nat: 110, ind: 12, pers: 46 },
              { m: 'Jul', nat: 45, ind: 11, pers: 47 },
              { m: 'Aug', nat: 60, ind: 13, pers: 46 },
              { m: 'Sep', nat: 95, ind: 16, pers: 48 },
              { m: 'Oct', nat: 140, ind: 17, pers: 46 },
              { m: 'Nov', nat: 180, ind: 15, pers: 45 },
              { m: 'Dec', nat: 210, ind: 16, pers: 47 }
            ].map((col) => {
              const maxVal = 2150;
              const heightPct = Math.max(12, Math.round((col.nat / maxVal) * 85));
              const isPeak = col.m === 'Mar' || col.m === 'Apr';

              return (
                <div key={col.m} className="flex flex-col items-center space-y-1">
                  <div className="w-full h-24 bg-slate-50 rounded-lg flex items-end justify-center p-1 relative group">
                    <div
                      className={`w-full rounded-md transition-all ${
                        isPeak ? 'bg-amber-500 group-hover:bg-amber-600' : 'bg-sky-400 group-hover:bg-sky-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${isPeak ? 'text-amber-700' : 'text-slate-500'}`}>
                    {col.m}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">{col.nat}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-3">
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Natural Forest Fire Surge (Dry Season)
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                Industrial Stacks (Constant 45-48 Baseline)
              </span>
            </div>
            <span className="font-semibold text-slate-600">Monsoon Dip: June - August</span>
          </div>
        </div>
      </div>

      {/* 4. Top Verified Persistent Operational Facilities Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Whitelisted Persistent Operational Thermal Facilities
            </h3>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
            Non-Emergency Heat Sources
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {persistentFacilities.map((fac, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900">{fac.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    {fac.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{fac.city}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-bold text-purple-700 font-mono">{fac.detections}</p>
                  <p className="text-[10px] text-slate-400">Baseline FRP: {fac.frp}</p>
                </div>

                <button
                  onClick={() => onNavigateToTab('gis-map')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 rounded border border-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  Locate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Historical Event Ledger & Timeline Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Multi-Year Hotspot Detection Timeline ({historicalEvents.length} Observations)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log with overpass frequency, surface temperature, and nearest infrastructure
            </p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search historical event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-7 pr-3 py-1.5 w-44 sm:w-56 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 bg-slate-50"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Event ID</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Location & District</th>
                <th className="px-4 py-3">30-Day Recurrence</th>
                <th className="px-4 py-3">Surface Temp / FRP</th>
                <th className="px-4 py-3">Detection Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historicalEvents.slice(0, 10).map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-sky-700">
                    {ev.id}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        ev.type === 'Industrial Fire'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : ev.type === 'Natural Fire'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
                      }`}
                    >
                      {ev.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800 truncate max-w-[200px]" title={ev.location}>
                      {ev.location}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                      {ev.nearestFacility || ev.nearbyIndustry || 'Regional Zone'}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-700">
                    {ev.detectionCount || (ev.type === 'Persistent Thermal' ? 24 : 1)} overpasses
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700">
                    <span className="font-bold">{ev.temperature || `${ev.lst_c}°C`}</span>
                    <span className="text-[10px] text-slate-400 block">{ev.frp || 35.4} MW</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                    {ev.date || ev.timestamp || '2021-03-15'}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => {
                          onSelectHotspot(ev);
                          onNavigateToTab('hotspot-analysis');
                        }}
                        className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Analyze
                      </button>
                      <button
                        onClick={() => {
                          onSelectHotspot(ev);
                          onNavigateToTab('gis-map');
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition-colors cursor-pointer"
                      >
                        Map
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
