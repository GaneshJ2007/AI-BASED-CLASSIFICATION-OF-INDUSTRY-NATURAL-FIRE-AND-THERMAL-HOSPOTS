import React, { useState } from 'react';
import {
  Flame,
  Factory,
  Trees,
  Zap,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  Thermometer,
  Wind,
  CheckCircle,
  ExternalLink,
  Download,
  Bell,
  X,
  Eye
} from 'lucide-react';

export default function EventDetailsPanel({ hotspot, onClose, onInspectHotspot }) {
  const [alertSent, setAlertSent] = useState(false);

  if (!hotspot) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[420px]">
        <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 mb-3">
          <MapPin className="w-6 h-6 animate-bounce" />
        </div>
        <h4 className="text-sm font-bold text-slate-800 mb-1">No Hotspot Selected</h4>
        <p className="text-xs text-slate-500 max-w-[220px]">
          Click any thermal marker on the GIS map or select a row from the table to view AI classification & risk breakdown.
        </p>
      </div>
    );
  }

  const handleDispatchAlert = () => {
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
    }, 4000);
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'Industrial Fire':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Natural Fire':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Persistent Thermal':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRiskColor = (score) => {
    if (score >= 80) return { bar: 'bg-rose-500', text: 'text-rose-600' };
    if (score >= 60) return { bar: 'bg-amber-500', text: 'text-amber-600' };
    return { bar: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const riskColor = getRiskColor(hotspot.riskScore);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-4">
      <div>
        {/* Header & Close */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                THERMAL EVENT
              </span>
              {hotspot.isNew && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <h3 className="text-xl font-display font-extrabold text-slate-900 mt-0.5">
              {hotspot.id}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Deselect"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Classification Badge & Location */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Classification</span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getBadgeStyle(
                hotspot.type
              )}`}
            >
              {hotspot.type}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
            <span className="text-slate-400 block text-[10px] font-bold uppercase mb-0.5">
              Geographic Location
            </span>
            <span className="font-semibold text-slate-800 leading-tight">
              {hotspot.location}
            </span>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-2">
              <span>Lat: {hotspot.lat}</span>
              <span>•</span>
              <span>Lng: {hotspot.lng}</span>
            </div>
          </div>
        </div>

        {/* Progress Bars for Risk Score & Confidence */}
        <div className="mt-4 space-y-3 pt-3 border-t border-slate-100">
          {/* Risk Score */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-medium text-slate-600">Risk Score</span>
              <span className={`font-bold ${riskColor.text}`}>{hotspot.riskScore}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${riskColor.bar} transition-all duration-500`}
                style={{ width: `${hotspot.riskScore}%` }}
              ></div>
            </div>
          </div>

          {/* Confidence Score */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-medium text-slate-600">Confidence</span>
              <span className="font-bold text-sky-600">{hotspot.confidence}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 transition-all duration-500"
                style={{ width: `${hotspot.confidence}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Spatial Proximity & Historical Recurrence */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
              Nearby Industry
            </span>
            <span className="font-bold text-slate-800 block text-xs">
              {hotspot.nearbyIndustry}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
              Previous Detections
            </span>
            <span className="font-bold text-slate-800 block text-xs">
              {hotspot.previousDetections}
            </span>
          </div>
        </div>

        {/* SHAP Feature Attribution Drivers */}
        {hotspot.shapDrivers && hotspot.shapDrivers.length > 0 ? (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>SHAP AI Explainability (Top Drivers):</span>
              </span>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                TreeSHAP Verified
              </span>
            </div>
            <div className="space-y-1.5">
              {hotspot.shapDrivers.map((driver, index) => (
                <div key={index} className="bg-slate-50 border border-slate-100 p-2 rounded-lg text-[11px]">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-semibold text-slate-800 font-mono text-[10px]">{driver.feature}</span>
                    <span className={`font-bold ${driver.direction === 'Supports Classification' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {driver.direction === 'Supports Classification' ? '+' : ''}{driver.shap_impact}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[10.5px] leading-tight">{driver.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Fallback Key Factors */
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 block mb-2">
              Key Factors:
            </span>
            <ul className="space-y-1.5">
              {hotspot.keyFactors &&
                hotspot.keyFactors.map((factor, index) => (
                  <li
                    key={index}
                    className="flex items-start space-x-2 text-[11px] text-slate-600"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
                    <span>{factor}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Satellite Telemetry Details */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">Sensor / Satellite:</span>
            <span className="font-semibold text-slate-700">{hotspot.satellite}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Fire Radiative Power:</span>
            <span className="font-semibold text-slate-700">{hotspot.frp} MW</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Brightness Temp:</span>
            <span className="font-semibold text-slate-700">{hotspot.brightnessTemp}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Detection Time:</span>
            <span className="font-semibold text-slate-700">{hotspot.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {/* Full Event Inspection Trigger */}
        <button
          onClick={() => onInspectHotspot && onInspectHotspot(hotspot)}
          className="w-full py-2 px-3 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg shadow-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-sky-600" />
          <span>Inspect Full Event Dossier</span>
        </button>

        {alertSent && (
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center space-x-1.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Emergency Alert Dispatched to Regional Industrial Marshall!</span>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDispatchAlert}
            className="flex-1 py-2 px-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition-colors active:scale-95"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Dispatch Alert</span>
          </button>

          <button
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(hotspot, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `thermal_event_${hotspot.id}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="p-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            title="Download Event JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
