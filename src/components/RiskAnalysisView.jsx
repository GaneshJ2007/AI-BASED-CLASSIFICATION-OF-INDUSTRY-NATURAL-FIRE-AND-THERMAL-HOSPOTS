import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Factory, HelpCircle, Activity, Gauge, MapPin } from 'lucide-react';
import { INDUSTRIAL_CLUSTERS } from '../data/mockHotspots';

export default function RiskAnalysisView({ hotspots, onSelectHotspot }) {
  const highRiskHotspots = hotspots.filter((h) => h.riskScore >= 80);
  const industrialFires = hotspots.filter((h) => h.type === 'Industrial Fire');

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              AI Risk & Proximity Assessment Model
            </h2>
            <p className="text-xs text-slate-500">
              Multi-factor scoring combining FIRMS thermal intensity, Sentinel SWIR spectral indices, and OpenStreetMap industrial zoning.
            </p>
          </div>
        </div>

        {/* Algorithm Formula Explanation Card */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800">
          <div className="text-[11px] font-bold text-sky-700 uppercase mb-1 font-sans">
            Classification & Scoring Formula
          </div>
          <p className="text-slate-600 leading-relaxed font-sans text-xs mb-2">
            <strong>Risk Score =</strong> w₁ × FRP_norm + w₂ × (1 / Distance_to_Hazmat) + w₃ × Recurrence_Index + w₄ × SWIR_B12_Ratio
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] font-sans text-slate-600">
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block">w₁ = 0.30</span>
              <span>Thermal Energy (FRP)</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block">w₂ = 0.35</span>
              <span>OSM Industrial Buffer</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block">w₃ = 0.20</span>
              <span>30-Day Recurrence</span>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200">
              <span className="font-bold text-slate-900 block">w₄ = 0.15</span>
              <span>Sentinel-2 SWIR B12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 High-Risk Critical Incidents */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Critical Priority Industrial Hotspots
            </h3>
            <p className="text-xs text-slate-500">
              Thermal anomalies within 1.5 km of registered hazardous manufacturing units
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded bg-rose-100 text-rose-800 border border-rose-200">
            {highRiskHotspots.length} Priority Alerts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highRiskHotspots.slice(0, 6).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHotspot(item)}
              className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold font-display text-slate-900 text-sm">{item.id}</span>
                <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded border border-rose-200">
                  Risk: {item.riskScore}%
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-slate-900 line-clamp-1">{item.location}</p>
                <div className="flex items-center text-slate-500 space-x-1">
                  <Factory className="w-3.5 h-3.5 text-slate-400" />
                  <span className="line-clamp-1">{item.nearbyIndustry}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">Confidence: <strong className="text-sky-700">{item.confidence}%</strong></span>
                <span className="text-[11px] font-bold text-sky-600 hover:underline">Inspect →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monitored Industrial Zones Vulnerability Ranking */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 font-display">
            Monitored Industrial Corridors & Safety Ratings
          </h3>
          <p className="text-xs text-slate-500">
            Real-time hazard classification across key manufacturing hubs in South India
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {INDUSTRIAL_CLUSTERS.map((cluster) => (
            <div
              key={cluster.id}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-sky-300 transition-all"
            >
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs mb-1">
                <Factory className="w-4 h-4 text-sky-600" />
                <span>{cluster.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">{cluster.city}</p>
              <span
                className="inline-block text-[10px] font-bold px-2 py-0.5 rounded border"
                style={{
                  color: cluster.color,
                  borderColor: `${cluster.color}40`,
                  backgroundColor: `${cluster.color}10`
                }}
              >
                {cluster.hazardLevel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
