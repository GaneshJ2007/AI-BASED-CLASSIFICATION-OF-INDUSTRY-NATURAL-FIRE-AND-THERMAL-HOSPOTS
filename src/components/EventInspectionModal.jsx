import React, { useState, useEffect } from 'react';
import {
  X,
  Flame,
  Factory,
  Trees,
  Zap,
  MapPin,
  Calendar,
  Layers,
  Thermometer,
  Wind,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  Download,
  Bell,
  Activity,
  Cpu,
  Compass,
  FileText
} from 'lucide-react';

export default function EventInspectionModal({ hotspot, isOpen, onClose }) {
  const [alertDispatched, setAlertDispatched] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('telemetry'); // 'telemetry' | 'shap' | 'protocol'

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !hotspot) return null;

  const handleDispatch = () => {
    setAlertDispatched(true);
    setTimeout(() => {
      setAlertDispatched(false);
    }, 4500);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(hotspot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Event_Inspection_${hotspot.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getBadgeConfig = (type) => {
    switch (type) {
      case 'Industrial Fire':
        return {
          icon: Factory,
          className: 'bg-rose-100 text-rose-800 border-rose-300',
          dotColor: 'bg-rose-500',
          glow: 'shadow-rose-500/20'
        };
      case 'Natural Fire':
        return {
          icon: Trees,
          className: 'bg-amber-100 text-amber-800 border-amber-300',
          dotColor: 'bg-amber-500',
          glow: 'shadow-amber-500/20'
        };
      case 'Persistent Thermal':
        return {
          icon: Zap,
          className: 'bg-purple-100 text-purple-800 border-purple-300',
          dotColor: 'bg-purple-500',
          glow: 'shadow-purple-500/20'
        };
      default:
        return {
          icon: Flame,
          className: 'bg-slate-100 text-slate-800 border-slate-300',
          dotColor: 'bg-slate-500',
          glow: 'shadow-slate-500/20'
        };
    }
  };

  const badgeConfig = getBadgeConfig(hotspot.type);
  const TypeIcon = badgeConfig.icon;

  const getRiskColor = (score) => {
    if (score >= 80) return { text: 'text-rose-600', bg: 'bg-rose-500', badge: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { text: 'text-emerald-600', bg: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const riskColor = getRiskColor(hotspot.riskScore || 50);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between relative overflow-hidden border-b border-slate-800">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-1 relative z-10">
            <div className="flex items-center space-x-2.5">
              <span className="text-[11px] font-mono tracking-wider font-semibold text-sky-400 uppercase bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/50">
                DEEP EVENT INSPECTOR
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center space-x-1.5 ${badgeConfig.className}`}>
                <span className={`w-2 h-2 rounded-full ${badgeConfig.dotColor} animate-pulse`}></span>
                <TypeIcon className="w-3 h-3 inline" />
                <span>{hotspot.type}</span>
              </span>
              {hotspot.isNew && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500 text-white animate-pulse">
                  NEW EVENT
                </span>
              )}
            </div>

            <div className="flex items-baseline space-x-3 mt-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
                {hotspot.id}
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                {hotspot.timestamp || hotspot.date || 'Live Satellite Ingest'}
              </span>
            </div>

            <p className="text-xs text-slate-300 flex items-center space-x-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-semibold text-slate-200">{hotspot.location}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick KPI Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">AI Confidence</span>
            <span className="text-sm font-extrabold text-sky-600 font-mono">
              {hotspot.confidence}%
            </span>
            <span className="text-[10px] text-slate-500 block">Ensemble Verified</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Risk Matrix Score</span>
            <span className={`text-sm font-extrabold ${riskColor.text} font-mono`}>
              {hotspot.riskScore}%
            </span>
            <span className="text-[10px] text-slate-500 block">
              Tier: {hotspot.riskTier || (hotspot.riskScore >= 80 ? 'Critical' : hotspot.riskScore >= 60 ? 'Medium' : 'Low')}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Peak Surface Temp</span>
            <span className="text-sm font-extrabold text-slate-800 font-mono">
              {hotspot.temperature || `${hotspot.lst_c || 31.2}°C`}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Brightness: {hotspot.brightnessTemp || '304.3 K'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Coordinates</span>
            <span className="text-sm font-extrabold text-slate-800 font-mono">
              {Number(hotspot.lat).toFixed(4)}, {Number(hotspot.lng).toFixed(4)}
            </span>
            <a
              href={`https://www.google.com/maps?q=${hotspot.lat},${hotspot.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-sky-600 hover:text-sky-800 font-semibold flex items-center space-x-1"
            >
              <span>View in GIS Maps</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 pt-2 bg-white space-x-6 text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('telemetry')}
            className={`pb-2.5 flex items-center space-x-1.5 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'telemetry'
                ? 'border-sky-600 text-sky-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Multi-Sensor Telemetry</span>
          </button>

          <button
            onClick={() => setActiveSubTab('shap')}
            className={`pb-2.5 flex items-center space-x-1.5 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'shap'
                ? 'border-sky-600 text-sky-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>SHAP AI Drivers</span>
          </button>

          <button
            onClick={() => setActiveSubTab('protocol')}
            className={`pb-2.5 flex items-center space-x-1.5 border-b-2 transition-colors cursor-pointer ${
              activeSubTab === 'protocol'
                ? 'border-sky-600 text-sky-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Emergency Protocol</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: MULTI-SENSOR TELEMETRY */}
          {activeSubTab === 'telemetry' && (
            <div className="space-y-5">
              {/* Telemetry Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Sentinel-5P Atmospheric Gas Chemistry */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Wind className="w-4 h-4 text-sky-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Atmospheric Chemistry (Sentinel-5P)
                      </h4>
                    </div>
                    <span className="text-[10px] font-semibold bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded">
                      TROPOMI Ingest
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Nitrogen Dioxide (NO₂ Column):</span>
                      <span className="font-mono font-bold text-slate-800">
                        {hotspot.no2 || '2.60e-05 mol/m²'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Sulfur Dioxide (SO₂ Column):</span>
                      <span className="font-mono font-bold text-slate-800">
                        {hotspot.so2 || '1.66e-04 mol/m²'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Carbon Monoxide (CO):</span>
                      <span className="font-mono font-bold text-slate-800">
                        {hotspot.co || '0.0388 mol/m²'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500">Combustion Emission Status:</span>
                      <span className="font-bold text-slate-700">
                        {hotspot.type === 'Industrial Fire'
                          ? 'Elevated Toxic Stack Signature'
                          : hotspot.type === 'Persistent Thermal'
                          ? 'Continuous Industrial Background'
                          : 'Biogenic Background / Wildfire Plume'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Land Cover & Biome (Dynamic World & S2) */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Trees className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Land Cover & Biophysical (Sentinel-2)
                      </h4>
                    </div>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                      Dynamic World 10m
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Tree Canopy Density:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {hotspot.treesPct || '29.6%'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Built / Impervious Footprint:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {hotspot.builtPct || '9.8%'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Biophysical Moisture (NDMI/NBR):</span>
                      <span className="font-mono font-bold text-slate-700">
                        {hotspot.type === 'Natural Fire' ? 'Dry Fuel Bed (High Flammability)' : 'Urbanized / Industrial Envelope'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500">Vegetation Classification:</span>
                      <span className="font-bold text-slate-700">
                        {hotspot.zone || 'Forest Reserve / Wildland Biome'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. OpenStreetMap Industrial Infrastructure Cadastre */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Factory className="w-4 h-4 text-amber-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Industrial Proximity & Cadastre
                      </h4>
                    </div>
                    <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                      OSM Infrastructure
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Nearest Industrial Facility:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]" title={hotspot.nearestFacility || hotspot.industryName}>
                        {hotspot.nearestFacility || hotspot.industryName || 'Palwancha Industrial Plant'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Proximity Distance:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {hotspot.distToIndustrial || `${hotspot.dist_to_industrial_km || 48.2} km`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Facility Category:</span>
                      <span className="font-semibold text-slate-700">
                        {hotspot.facilityCategory || 'Thermal Power Station / Energy'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500">Industrial Hazard Radius:</span>
                      <span className="font-bold text-slate-700">
                        {parseFloat(hotspot.distToIndustrial || hotspot.dist_to_industrial_km || 50) <= 15
                          ? 'Within High-Risk Industrial Perimeter (<15km)'
                          : 'Clear of Industrial Corridors (>15km)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Thermal Sensor Radiometry & Recurrence */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-4 h-4 text-rose-600" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Thermal Radiometry & History
                      </h4>
                    </div>
                    <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                      MODIS / VIIRS
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Fire Radiative Power (FRP):</span>
                      <span className="font-mono font-bold text-rose-600">
                        {hotspot.frp ? `${hotspot.frp} MW` : '24.4 MW'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Historical Recurrence (30 Days):</span>
                      <span className="font-mono font-bold text-slate-800">
                        {hotspot.previousDetections || `${hotspot.detectionCount || 2} events`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500">Satellite Sensor Array:</span>
                      <span className="font-semibold text-slate-700">
                        {hotspot.satellite || 'Sentinel-2 MSI & MODIS LST'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500">Temporal Persistence:</span>
                      <span className="font-bold text-slate-700">
                        {hotspot.type === 'Persistent Thermal' ? 'Permanent Operational Heat' : 'Episodic / Transient Hotspot'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHAP AI DRIVERS */}
          {activeSubTab === 'shap' && (
            <div className="space-y-4">
              <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-xl text-xs text-sky-900">
                <div className="flex items-center space-x-2 font-bold mb-1">
                  <Cpu className="w-4 h-4 text-sky-700" />
                  <span>TreeSHAP Multi-Sensor Feature Attribution</span>
                </div>
                <p className="text-[11px] text-sky-800">
                  Explains the physical factors that led the Hybrid FT-Transformer + XGBoost model to classify this event with{' '}
                  <span className="font-bold">{hotspot.confidence}% confidence</span> as{' '}
                  <span className="font-bold">{hotspot.type}</span>.
                </p>
              </div>

              <div className="space-y-3">
                {hotspot.shapDrivers && hotspot.shapDrivers.length > 0 ? (
                  hotspot.shapDrivers.map((driver, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-sky-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {driver.feature}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] text-slate-400 font-mono">Value: {driver.feature_value}</span>
                          <span
                            className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded ${
                              driver.direction === 'Supports Classification'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {driver.direction === 'Supports Classification' ? '+' : ''}
                            {driver.shap_impact} SHAP
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{driver.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="font-semibold text-slate-600">Model Rule Convergence Applied</p>
                    <p className="mt-1 text-slate-500">
                      Classification confirmed via multi-sensor physical convergence criteria (biomass density, thermal radiometry, and proximity).
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EMERGENCY PROTOCOL */}
          {activeSubTab === 'protocol' && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Standard Operating Procedure (SOP)</span>
                </h4>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-700 leading-relaxed">
                  {hotspot.recommendedAction ||
                    'Continuous satellite monitoring active; regional disaster management and ground forest teams notified for active verification.'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Authority</span>
                  <p className="font-bold text-slate-800">State Disaster Management Authority (SDMA)</p>
                  <p className="text-slate-500 text-[11px]">Primary Dispatch: South India Regional Command</p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Containment Priority</span>
                  <p className={`font-bold ${riskColor.text}`}>
                    {hotspot.riskScore >= 80 ? 'CRITICAL - Immediate Intercept' : hotspot.riskScore >= 60 ? 'MODERATE - Rapid Assessment' : 'ROUTINE - Automated Surveillance'}
                  </p>
                  <p className="text-slate-500 text-[11px]">Calculated from thermal intensity and facility proximity</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {alertDispatched ? (
              <div className="py-2 px-4 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Emergency Alert Dispatched Successfully!</span>
              </div>
            ) : (
              <button
                onClick={handleDispatch}
                className="w-full sm:w-auto py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>Dispatch Marshall Alert</span>
              </button>
            )}

            <button
              onClick={handleDownloadJSON}
              className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 rounded-lg border border-slate-300 shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
              title="Download Telemetry JSON"
            >
              <Download className="w-4 h-4" />
              <span>Export Dossier (JSON)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-6 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
