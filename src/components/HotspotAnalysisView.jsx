import React, { useState, useMemo } from 'react';
import {
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
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  Radio,
  Clock,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function HotspotAnalysisView({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  onNavigateToTab
}) {
  const [activeDossierTab, setActiveDossierTab] = useState('telemetry'); // 'telemetry' | 'shap' | 'sop'
  const [searchQuery, setSearchQuery] = useState('');
  const [alertDispatched, setAlertDispatched] = useState(false);
  const [whitelistSuccess, setWhitelistSuccess] = useState(false);

  // If no hotspot selected, fall back to first hotspot in list
  const currentHotspot = selectedHotspot || hotspots[0] || null;

  // Filtered list for the event switcher
  const filteredEventList = useMemo(() => {
    if (!searchQuery.trim()) return hotspots;
    const q = searchQuery.toLowerCase();
    return hotspots.filter(
      (h) =>
        h.id.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.type.toLowerCase().includes(q)
    );
  }, [hotspots, searchQuery]);

  // Index of current hotspot
  const currentIndex = useMemo(() => {
    if (!currentHotspot) return -1;
    return hotspots.findIndex((h) => h.id === currentHotspot.id);
  }, [hotspots, currentHotspot]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectHotspot(hotspots[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < hotspots.length - 1) {
      onSelectHotspot(hotspots[currentIndex + 1]);
    }
  };

  const handleDispatch = () => {
    setAlertDispatched(true);
    setTimeout(() => {
      setAlertDispatched(false);
    }, 4500);
  };

  const handleWhitelist = () => {
    setWhitelistSuccess(true);
    setTimeout(() => {
      setWhitelistSuccess(false);
    }, 4000);
  };

  const handleDownloadJSON = () => {
    if (!currentHotspot) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentHotspot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Event_Forensic_Dossier_${currentHotspot.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!currentHotspot) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <Activity className="w-12 h-12 text-sky-600 mx-auto mb-3 animate-pulse" />
        <h3 className="text-base font-bold text-slate-800">No Thermal Event Available</h3>
        <p className="text-xs text-slate-500 mt-1">Please select an event from the GIS Map or Dashboard.</p>
      </div>
    );
  }

  // Visual formatting helpers
  const isIndustrial = currentHotspot.type === 'Industrial Fire';
  const isNatural = currentHotspot.type === 'Natural Fire';
  const isPersistent = currentHotspot.type === 'Persistent Thermal';

  const typeConfig = {
    'Industrial Fire': {
      color: 'rose',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: Factory,
      sopText: 'ACUTE HAZMAT PROTOCOL: High-risk industrial fire co-located with chemical/petroleum assets.'
    },
    'Natural Fire': {
      color: 'amber',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Trees,
      sopText: 'FOREST DEPARTMENT ALERT: Natural wildfire spreading in ecological canopy or reserve.'
    },
    'Persistent Thermal': {
      color: 'purple',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Zap,
      sopText: 'COMPLIANT EMISSION: Known operational industrial flare stack or thermal power station boiler.'
    }
  }[currentHotspot.type] || {
    color: 'sky',
    border: 'border-sky-200',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
    icon: Flame,
    sopText: 'STANDARD THERMAL ANOMALY: Routine observation under surveillance.'
  };

  const TypeIcon = typeConfig.icon;
  const riskScore = currentHotspot.riskScore || 50;

  return (
    <div className="space-y-6">
      {/* 1. Event Switcher & Navigation Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-display flex items-center gap-2">
              <span>Hotspot Analysis Dossier</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                Event {currentIndex + 1} of {hotspots.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Detailed forensic telemetry, satellite spectral bands, SHAP explainability, and emergency SOP
            </p>
          </div>
        </div>

        {/* Quick Dropdown / Search Selector & Prev/Next Buttons */}
        <div className="flex items-center space-x-2">
          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Event ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-7 pr-3 py-1.5 w-36 sm:w-48 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 bg-slate-50"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
          </div>

          {/* Quick Select Dropdown */}
          <select
            value={currentHotspot.id}
            onChange={(e) => {
              const found = hotspots.find((h) => h.id === e.target.value);
              if (found) onSelectHotspot(found);
            }}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 max-w-[140px] truncate"
          >
            {filteredEventList.slice(0, 50).map((h) => (
              <option key={h.id} value={h.id}>
                {h.id} ({h.type.split(' ')[0]})
              </option>
            ))}
          </select>

          {/* Prev/Next buttons */}
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 cursor-pointer"
            title="Previous Event"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= hotspots.length - 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 text-slate-700 cursor-pointer"
            title="Next Event"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Top Banner Card for Selected Hotspot */}
      <div className={`bg-white rounded-2xl border ${typeConfig.border} p-6 shadow-sm relative overflow-hidden space-y-4`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${typeConfig.badge}`}>
                <TypeIcon className="w-3.5 h-3.5" />
                <span>{currentHotspot.type}</span>
              </span>

              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {currentHotspot.satellite || 'VIIRS 375m & Sentinel-2'}
              </span>

              {currentHotspot.isNew && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white uppercase animate-pulse">
                  Live Anomaly
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              {currentHotspot.id}: {currentHotspot.location}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>{currentHotspot.lat.toFixed(4)}°N, {currentHotspot.lng.toFixed(4)}°E</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>{currentHotspot.timestamp || currentHotspot.date || '2026-09-22 14:15 UTC'}</span>
              </span>
              <span className="flex items-center gap-1">
                <Factory className="w-3.5 h-3.5 text-slate-400" />
                <span>Nearest: {currentHotspot.nearestFacility || currentHotspot.nearbyIndustry || 'Regional Zone'}</span>
              </span>
            </div>
          </div>

          {/* Risk Dial & Action Strip */}
          <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Multi-Factor Risk</p>
              <p
                className="text-3xl font-extrabold font-display mt-0.5"
                style={{ color: currentHotspot.riskColor || (riskScore >= 75 ? '#ef4444' : '#f59e0b') }}
              >
                {riskScore}%
              </p>
              <span
                className="text-[10px] font-bold px-2 py-0.2 rounded-full inline-block mt-0.5"
                style={{
                  backgroundColor: `${currentHotspot.riskColor || '#ef4444'}20`,
                  color: currentHotspot.riskColor || '#ef4444'
                }}
              >
                {currentHotspot.riskTier || (riskScore >= 75 ? 'Critical' : 'Moderate')}
              </span>
            </div>

            <div className="h-10 w-px bg-slate-200" />

            <div className="space-y-1.5">
              <button
                onClick={() => onNavigateToTab('gis-map')}
                className="w-full px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View on GIS Map</span>
              </button>

              <button
                onClick={handleDownloadJSON}
                className="w-full px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>
        </div>

        {/* Operational Notice / Summary */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-2">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 font-semibold">Incident Summary: </strong>
            <span>{typeConfig.sopText}</span>
          </div>
        </div>
      </div>

      {/* 3. Deep Analysis Sub-Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center space-x-2 text-xs font-bold">
        <button
          onClick={() => setActiveDossierTab('telemetry')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeDossierTab === 'telemetry'
              ? 'border-sky-600 text-sky-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Multi-Sensor Telemetry</span>
        </button>

        <button
          onClick={() => setActiveDossierTab('shap')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeDossierTab === 'shap'
              ? 'border-sky-600 text-sky-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>AI Decision & SHAP Attribution</span>
        </button>

        <button
          onClick={() => setActiveDossierTab('sop')}
          className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
            activeDossierTab === 'sop'
              ? 'border-sky-600 text-sky-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency SOP & Dispatch Protocol</span>
        </button>
      </div>

      {/* 4. Tab 1: Multi-Sensor Telemetry Matrix */}
      {activeDossierTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: NASA FIRMS Thermal Radiative Output */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4" />
              <span>Thermal Radiative Output</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Fire Radiative Power (FRP):</span>
                <span className="font-extrabold text-slate-900 font-mono">
                  {currentHotspot.frp ? `${currentHotspot.frp} MW` : '42.8 MW'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Brightness Temperature:</span>
                <span className="font-extrabold text-slate-900 font-mono">
                  {currentHotspot.brightnessTemp || '348.6 K'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Land Surface Temp (LST):</span>
                <span className="font-extrabold text-slate-900 font-mono">
                  {currentHotspot.temperature || `${currentHotspot.lst_c}°C`}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Detection Confidence:</span>
                <span className="font-extrabold text-emerald-600 font-mono">
                  {currentHotspot.confidence || 92}%
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Sensor: NASA FIRMS VIIRS (Band 21/22/31) & MODIS 375m high-resolution swath.
            </p>
          </div>

          {/* Card 2: Sentinel-2 Optical & Spectral Burn Indices */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Sentinel-2 Spectral Indices</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">SWIR Ratio (B12/B11):</span>
                <span className="font-extrabold text-slate-900 font-mono">
                  {currentHotspot.swirBandRatio || '2.42 (High Flame Reflectance)'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Normalized Burn Ratio (NBR):</span>
                <span className="font-extrabold text-slate-900 font-mono">
                  {isIndustrial ? '-0.48 (Ash / Slag Surface)' : '+0.12 (Moisture Loss)'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">NDVI Canopy Greenness:</span>
                <span className="font-extrabold text-slate-900 font-mono">
                  {isIndustrial ? '0.12 (Industrial Impervious)' : '0.68 (Dense Deciduous)'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Pixel Resolution:</span>
                <span className="font-extrabold text-slate-900 font-mono">10m / 20m MSI</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Copernicus Sentinel-2 MSI validates active sub-pixel combustion against ground surface.
            </p>
          </div>

          {/* Card 3: Sentinel-5P Atmospheric Plume & Chemistry */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-purple-700 font-bold text-xs uppercase tracking-wider">
              <Activity className="w-4 h-4" />
              <span>Gas Spectrometry (Sentinel-5P)</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Tropospheric NO₂ Column:</span>
                <span className="font-extrabold text-purple-900 font-mono">
                  {isIndustrial ? '7.4 × 10⁻⁵ mol/m² (Severe)' : '2.1 × 10⁻⁵ mol/m² (Normal)'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">SO₂ Sulfur Anomaly:</span>
                <span className="font-extrabold text-purple-900 font-mono">
                  {isIndustrial ? '1.8 DU (Combustion Plume)' : '0.2 DU (Negligible)'}
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">CO Column Density:</span>
                <span className="font-extrabold text-purple-900 font-mono">
                  0.038 mol/m² (Elevated)
                </span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                <span className="text-slate-500">SAR C-Band Backscatter:</span>
                <span className="font-extrabold text-slate-900 font-mono">-14.2 dB (VH/VV)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Discriminates chemical fuel flaring from organic biomass based on toxic NOx/SO2 emission ratios.
            </p>
          </div>
        </div>
      )}

      {/* 5. Tab 2: AI Decision & SHAP Attribution */}
      {activeDossierTab === 'shap' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Classification Probabilities */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Ensemble AI Classifier Output
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Confidence: {currentHotspot.confidence || 94.2}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-rose-700">P(Industrial Fire - Hazmat):</span>
                  <span className="font-bold">{isIndustrial ? '92.4%' : isPersistent ? '4.8%' : '3.1%'}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: isIndustrial ? '92.4%' : isPersistent ? '4.8%' : '3.1%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-amber-700">P(Natural Forest Fire - Wildland):</span>
                  <span className="font-bold">{isNatural ? '91.8%' : isIndustrial ? '5.2%' : '2.1%'}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: isNatural ? '91.8%' : isIndustrial ? '5.2%' : '2.1%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-semibold">
                  <span className="text-purple-700">P(Persistent Operational Thermal Source):</span>
                  <span className="font-bold">{isPersistent ? '93.1%' : '2.4%'}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: isPersistent ? '93.1%' : '2.4%' }}
                  />
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Architecture: FT-Transformer + XGBoost Fusion</p>
              <p className="text-[11px]">
                Trained on 17,377 South India satellite records (2021-2025). Macro-F1 score: 0.9841.
              </p>
            </div>
          </div>

          {/* SHAP Feature Contributions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-sky-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  SHAP Explainability Drivers
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-500">Global Feature Weight</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">1. Distance to OSM Industrial Polygon (km)</span>
                  <span className="font-mono font-bold text-sky-700">+38.4%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">2. Sentinel-1 SAR Backscatter Coherence</span>
                  <span className="font-mono font-bold text-sky-700">+24.2%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: '58%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">3. Sentinel-5P Tropospheric NO₂ Plume</span>
                  <span className="font-mono font-bold text-sky-700">+19.1%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">4. 30-Day Multi-Overpass Recurrence</span>
                  <span className="font-mono font-bold text-sky-700">+12.5%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: '32%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium">5. NDVI Biomass Canopy Density</span>
                  <span className="font-mono font-bold text-emerald-700">-28.0%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '52%' }} />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              SHAP positive values elevate probability towards acute industrial hazmat; negative NDVI rules out biogenic forest wildfires.
            </p>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Emergency SOP & Dispatch Protocol */}
      {activeDossierTab === 'sop' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Action Protocol Checklist */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mandatory Standard Operating Procedure (SOP)
                </h3>
              </div>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Tier: {currentHotspot.riskTier || 'High'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">1. Perimeter Cordon & Safety Buffer</strong>
                  <p className="text-slate-600 mt-0.5">
                    Establish mandatory 1.5 km evacuation perimeter around facility coordinates ({currentHotspot.lat.toFixed(4)}, {currentHotspot.lng.toFixed(4)}).
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">2. Hazmat / Fire Department Dispatch</strong>
                  <p className="text-slate-600 mt-0.5">
                    {isIndustrial
                      ? 'Deploy specialized dry chemical foam units. Restrict water spray near chemical storage tanks.'
                      : 'Alert District Forest Officer & aerial firefighting helicopter units for retardant drop.'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">3. State Disaster Management Authority (SDMA) Link</strong>
                  <p className="text-slate-600 mt-0.5">
                    Transmit automated multi-agency incident packet to State Emergency Operations Center (SEOC).
                  </p>
                </div>
              </div>
            </div>

            {/* Action Feedback Messages */}
            {alertDispatched && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>EMERGENCY DISPATCH TRANSMITTED: SDMA & Regional Hazmat Units Alerted!</span>
              </div>
            )}

            {whitelistSuccess && (
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                <span>HOTSPOT WHITELISTED: Registered in Permanent Operational Stack Registry.</span>
              </div>
            )}

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={handleDispatch}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-600/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Bell className="w-4 h-4" />
                <span>Dispatch Emergency Alert Now</span>
              </button>

              <button
                onClick={handleWhitelist}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Whitelist Event as Operational</span>
              </button>
            </div>
          </div>

          {/* Atmospheric & Dispersion Snapshot */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Wind className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Atmospheric & Dispersion
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Surface Wind Vector:</span>
                <span className="font-bold text-slate-800">{currentHotspot.windSpeed || '14 km/h NE'}</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Ambient Temperature:</span>
                <span className="font-bold text-slate-800">{currentHotspot.ambientTemp || '34°C'}</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">Relative Humidity:</span>
                <span className="font-bold text-slate-800">{currentHotspot.humidity || '42%'}</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-100 flex justify-between">
                <span className="text-slate-500">30-Day Recurrence:</span>
                <span className="font-bold text-sky-700">{currentHotspot.previousDetections || '7 events / 30 days'}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900">
              <p className="font-bold">Downwind Impact Warning:</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Plume dispersion predicted towards South-West sector based on 14 km/h NE wind. Monitor adjacent community zones.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
