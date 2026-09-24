import React, { useState, useEffect } from 'react';
import {
  Layers,
  Satellite,
  Database,
  Radio,
  Clock,
  CheckCircle2,
  ExternalLink,
  Shield,
  Activity,
  Cpu,
  Globe
} from 'lucide-react';
import { fetchDataSources } from '../services/api';
import { LoadingState } from './CommonStates';

export default function DataSourcesView() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchDataSources();
      setSources(data);
      if (data && data.length > 0) setSelectedSource(data[0]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-300 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>Multi-Sensor Earth Observation Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              Multi-Source Satellite & Geospatial Data Fusion
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Thermal Tracers fuses 6 independent spaceborne and cadastral data streams across infrared, microwave SAR,
              spectrometric atmospheric chemistry, and vector boundaries to achieve 99.83% classification accuracy.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All 6 Feeds Co-registered</span>
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading multi-sensor data feed catalog..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feed List */}
          <div className="lg:col-span-1 space-y-3">
            {sources.map((src) => {
              const isSelected = selectedSource && selectedSource.id === src.id;
              return (
                <div
                  key={src.id}
                  onClick={() => setSelectedSource(src)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                      {src.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {src.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2">{src.role}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Res: {src.spatial_res}</span>
                    <span>Revisit: {src.cadence}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feed Deep Detail Dossier */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            {selectedSource ? (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-sky-600 uppercase">
                    <Satellite className="w-4 h-4" />
                    <span>{selectedSource.id}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1 font-display">
                    {selectedSource.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">{selectedSource.role}</p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Sensor Payload</span>
                    <p className="font-bold text-slate-800">{selectedSource.instruments}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Spatial Resolution</span>
                    <p className="font-bold text-slate-800">{selectedSource.spatial_res}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Temporal Cadence</span>
                    <p className="font-bold text-slate-800">{selectedSource.cadence}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5 sm:col-span-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Verified Coverage</span>
                    <p className="font-bold text-emerald-700">{selectedSource.record_count}</p>
                  </div>
                </div>

                {/* Parameters Extracted */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Extracted Spectral & Physical Parameters (Feature Tensor)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSource.parameters.map((param, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 font-mono"
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pipeline Contribution */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center space-x-2 font-bold text-slate-800">
                    <Cpu className="w-4 h-4 text-sky-600" />
                    <span>Role in Hybrid FT-Transformer + XGBoost Model</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    This data source feeds directly into the 38-feature normalized vector passed to the gradient boosted decision trees
                    and multi-head tabular attention layers. TreeSHAP assigns explicit feature attribution to verify physical convergence
                    before issuing emergency hazard alerts.
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
