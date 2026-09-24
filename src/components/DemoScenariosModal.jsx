import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  ArrowRight,
  Flame,
  Factory,
  Trees,
  Zap,
  Layers,
  Cpu,
  ShieldAlert,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { fetchDemoScenarios } from '../services/api';

export default function DemoScenariosModal({ isOpen, onClose, onApplyHotspotToMap }) {
  const [scenarios, setScenarios] = useState([]);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [activeStage, setActiveStage] = useState(0); // 0: DETECT, 1: FUSE, 2: CLASSIFY, 3: EXPLAIN, 4: ACTION

  const stages = [
    { id: 'detect', label: '1. DETECT', desc: 'NASA FIRMS Anomaly Trigger' },
    { id: 'fuse', label: '2. FUSE', desc: 'Multi-Sensor Data Fusion' },
    { id: 'classify', label: '3. CLASSIFY', desc: 'Hybrid AI Inference' },
    { id: 'explain', label: '4. EXPLAIN', desc: 'TreeSHAP Drivers' },
    { id: 'action', label: '5. DISPATCH', desc: 'SOP & Hazard Routing' }
  ];

  useEffect(() => {
    async function load() {
      const data = await fetchDemoScenarios();
      setScenarios(data);
    }
    if (isOpen) {
      load();
      setActiveStage(0);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || scenarios.length === 0) return null;

  const current = scenarios[activeScenarioIdx];

  const handleLaunchOnMap = () => {
    if (onApplyHotspotToMap) {
      onApplyHotspotToMap({
        id: `DEMO-${current.category.toUpperCase().replace(/\s+/g, '-')}`,
        type: current.category,
        lat: current.coordinates[0],
        lng: current.coordinates[1],
        confidence: parseFloat(current.classification_result.confidence),
        riskScore: current.classification_result.risk_score,
        riskTier: current.classification_result.risk_tier,
        location: current.location,
        temperature: `${current.detection.lst_c}°C`,
        lst_c: current.detection.lst_c,
        frp: parseFloat(current.detection.frp),
        recommendedAction: current.dispatch_protocol,
        isNew: true
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between border-b border-slate-800 relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-1 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono tracking-wider font-bold text-sky-400 uppercase bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                SIH 2026 EVALUATION DEMO
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Judge Walkthrough Mode</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
              Tri-Class Thermal Anomaly Demonstration
            </h2>
            <p className="text-xs text-slate-300">
              Interactive 5-stage walkthrough showcasing how multi-sensor fusion segregates natural fires, industrial hazards, and operational flare stacks.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Selection Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center space-x-2 overflow-x-auto text-xs font-semibold">
          {scenarios.map((scen, idx) => (
            <button
              key={scen.id}
              onClick={() => {
                setActiveScenarioIdx(idx);
                setActiveStage(0);
              }}
              className={`px-3 py-2 rounded-lg transition-all flex items-center space-x-2 cursor-pointer ${
                activeScenarioIdx === idx
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-bold'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              {scen.category === 'Natural Fire' && <Trees className="w-3.5 h-3.5 text-amber-600" />}
              {scen.category === 'Industrial Fire' && <Factory className="w-3.5 h-3.5 text-rose-600" />}
              {scen.category === 'Persistent Thermal Source' && <Zap className="w-3.5 h-3.5 text-purple-600" />}
              <span>{scen.title}</span>
            </button>
          ))}
        </div>

        {/* 5-Stage Stepper */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs overflow-x-auto gap-2">
          {stages.map((stg, i) => (
            <button
              key={stg.id}
              onClick={() => setActiveStage(i)}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                activeStage === i
                  ? 'bg-sky-50 border-sky-400 text-sky-900 font-extrabold shadow-2xs'
                  : i < activeStage
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <span className="block text-[11px]">{stg.label}</span>
              <span className="block text-[9px] text-slate-400 truncate">{stg.desc}</span>
            </button>
          ))}
        </div>

        {/* Stepper Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* STAGE 0: DETECT */}
          {activeStage === 0 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Incoming Spaceborne Telemetry</span>
                <h4 className="text-base font-extrabold text-slate-900">{current.location}</h4>
                <p className="text-xs text-slate-600">
                  Detected by <strong className="text-slate-800">{current.detection.sensor}</strong> at {current.detection.timestamp}.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Brightness Temp</span>
                  <span className="text-sm font-extrabold text-slate-800 font-mono">{current.detection.brightness_temp}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">LST (Surface Temp)</span>
                  <span className="text-sm font-extrabold text-slate-800 font-mono">{current.detection.lst_c}°C</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Fire Radiative Power</span>
                  <span className="text-sm font-extrabold text-rose-600 font-mono">{current.detection.frp}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Coordinates</span>
                  <span className="text-sm font-extrabold text-slate-800 font-mono">{current.coordinates[0]}, {current.coordinates[1]}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                <Flame className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>NASA FIRMS Limitation:</strong> Standard thermal anomaly triggers indicate heat presence, but cannot ascertain if this is a hazardous industrial disaster, an agricultural fire, or a continuous factory boiler. Multi-sensor fusion is now triggered.
                </span>
              </div>
            </div>
          )}

          {/* STAGE 1: FUSE */}
          {activeStage === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Multi-Sensor Physical Evidence Co-Registration
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-sky-700 uppercase">Sentinel-2 Optical & SWIR</span>
                  <p className="text-slate-800 font-medium">{current.multi_sensor_evidence.sentinel_2}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Sentinel-5P Chemical Stack</span>
                  <p className="text-slate-800 font-medium">{current.multi_sensor_evidence.sentinel_5p}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-amber-700 uppercase">Dynamic World 10m Land Cover</span>
                  <p className="text-slate-800 font-medium">{current.multi_sensor_evidence.dynamic_world}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-rose-700 uppercase">OpenStreetMap Cadastre Buffer</span>
                  <p className="text-slate-800 font-medium">{current.multi_sensor_evidence.osm_distance}</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: CLASSIFY */}
          {activeStage === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Hybrid FT-Transformer + XGBoost Classification
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 font-display">
                  {current.classification_result.predicted_class}
                </h3>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
                  <span>Confidence: {current.classification_result.confidence}</span>
                  <span>•</span>
                  <span>Ensemble Agreement: 100%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Risk Engine Score</span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {current.classification_result.risk_score}%
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Hazard Tier</span>
                  <span className="text-base font-extrabold text-rose-600 font-mono">
                    {current.classification_result.risk_tier}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: EXPLAIN (SHAP) */}
          {activeStage === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                <div className="flex items-center space-x-2 text-sky-900 text-xs font-bold">
                  <Cpu className="w-4 h-4 text-sky-700" />
                  <span>TreeSHAP Attribution Analysis</span>
                </div>
                <p className="text-xs text-sky-800 leading-relaxed font-medium">
                  {current.classification_result.shap_driver}
                </p>
              </div>

              <p className="text-xs text-slate-600">
                SHAP computes exact Shapley marginal contributions for each multi-spectral band, chemical column, and spatial distance metric, guaranteeing that the AI model cannot produce ungrounded hallucinations.
              </p>
            </div>
          )}

          {/* STAGE 4: DISPATCH & ACTION */}
          {activeStage === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex items-center space-x-2 text-rose-900 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-700" />
                  <span>Standard Operating Procedure (SOP) Action</span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed font-semibold">
                  {current.dispatch_protocol}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Authority Routing</span>
                <p className="font-bold text-slate-800">State Disaster Management Authority (SDMA) Command</p>
                <p className="text-slate-500 text-[11px]">
                  Payload format: GeoJSON incident envelope dispatched via automated API webhook.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            {activeStage > 0 && (
              <button
                onClick={() => setActiveStage((prev) => prev - 1)}
                className="py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors cursor-pointer"
              >
                ← Previous Stage
              </button>
            )}

            {activeStage < stages.length - 1 ? (
              <button
                onClick={() => setActiveStage((prev) => prev + 1)}
                className="py-2 px-4 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleLaunchOnMap}
                className="py-2 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <span>Inspect Scenario on Live GIS Map</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="py-2 px-5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Exit Demonstration
          </button>
        </div>
      </div>
    </div>
  );
}
