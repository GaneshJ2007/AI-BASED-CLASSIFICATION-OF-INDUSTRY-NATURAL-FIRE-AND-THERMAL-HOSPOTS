import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SummaryCards from './components/SummaryCards';
import InteractiveMap from './components/InteractiveMap';
import EventDetailsPanel from './components/EventDetailsPanel';
import HotspotTable from './components/HotspotTable';
import DataSourcesBanner from './components/DataSourcesBanner';
import AnalyticsSection from './components/AnalyticsSection';
import RunAnalysisModal from './components/RunAnalysisModal';
import RiskAnalysisView from './components/RiskAnalysisView';
import HistoryView from './components/HistoryView';
import AIModelBenchmarkingView from './components/AIModelBenchmarkingView';
import {
  INITIAL_DATASET,
  SIMULATED_NEW_HOTSPOTS,
  INDUSTRIAL_CLUSTERS
} from './data/mockHotspots';
import { REAL_HOTSPOTS } from './data/realHotspotsData';
import { Flame, ShieldAlert, Layers, Activity, CheckCircle2, ArrowRight, RefreshCw, Cpu } from 'lucide-react';

export default function App() {
  // Hotspot dataset state - initialized with real South India satellite labeled events
  const [hotspots, setHotspots] = useState(REAL_HOTSPOTS);
  
  // Selected hotspot
  const [selectedHotspot, setSelectedHotspot] = useState(
    REAL_HOTSPOTS[0] || null
  );

  // Active navigation tab ('dashboard' | 'hotspots' | 'risk' | 'industrial' | 'history')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Active filter ('All' | 'Industrial Fire' | 'Natural Fire' | 'Persistent Thermal' | 'High Risk')
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Analysis modal & state
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDemoRun, setIsDemoRun] = useState(false);
  const [analysisToast, setAnalysisToast] = useState(null);

  // Compute live counts
  const counts = useMemo(() => {
    const total = hotspots.length;
    const industrial = hotspots.filter((h) => h.type === 'Industrial Fire').length;
    const natural = hotspots.filter((h) => h.type === 'Natural Fire').length;
    const persistent = hotspots.filter((h) => h.type === 'Persistent Thermal').length;
    const highRisk = hotspots.filter((h) => h.riskScore >= 80).length;

    return { total, industrial, natural, persistent, highRisk };
  }, [hotspots]);

  // Filtered hotspots for map view
  const displayHotspots = useMemo(() => {
    if (selectedFilter === 'All') return hotspots;
    if (selectedFilter === 'High Risk') return hotspots.filter((h) => h.riskScore >= 80);
    return hotspots.filter((h) => h.type === selectedFilter);
  }, [hotspots, selectedFilter]);

  // Trigger Run Thermal Analysis
  const handleRunAnalysis = () => {
    setIsAnalysisModalOpen(true);
  };

  // Apply new simulation hotspots after modal completes
  const handleApplyNewHotspots = () => {
    setIsDemoRun(true);
    // Combine dataset ensuring no duplicate IDs
    const existingIds = new Set(hotspots.map((h) => h.id));
    const newItems = SIMULATED_NEW_HOTSPOTS.filter((h) => !existingIds.has(h.id));
    const updated = [...newItems, ...hotspots];
    setHotspots(updated);

    // Auto-select the flagship live high-risk item
    const flagshipNew = updated.find((h) => h.id === 'TH-1024-LIVE') || updated[0];
    setSelectedHotspot(flagshipNew);

    // Show toast banner
    setAnalysisToast({
      title: 'ANALYSIS COMPLETE',
      desc: '12 New Hotspots Detected • 3 Industrial-Risk Events • 2 Persistent Sources'
    });

    setTimeout(() => {
      setAnalysisToast(null);
    }, 8000);
  };

  // Reset demo to initial state
  const handleResetDemo = () => {
    setHotspots(INITIAL_DATASET);
    setSelectedHotspot(INITIAL_DATASET.find((h) => h.id === 'TH-1024') || INITIAL_DATASET[0]);
    setIsDemoRun(false);
    setSelectedFilter('All');
    setAnalysisToast(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-sky-100 selection:text-sky-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunAnalysis={handleRunAnalysis}
        isAnalyzing={isAnalyzing}
        isDemoRun={isDemoRun}
        onResetDemo={handleResetDemo}
      />

      {/* Live Toast Banner if Analysis Finished */}
      {analysisToast && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between text-xs animate-fadeIn">
          <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span className="font-bold">{analysisToast.title}:</span>
              <span className="text-emerald-100">{analysisToast.desc}</span>
            </div>
            <button
              onClick={() => setAnalysisToast(null)}
              className="text-emerald-200 hover:text-white font-bold text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={counts}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* 1. Summary Cards */}
              <section>
                <SummaryCards
                  counts={counts}
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </section>

              {/* 2. Interactive GIS Map & Event Details Panel Grid */}
              <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <InteractiveMap
                    hotspots={displayHotspots}
                    selectedHotspot={selectedHotspot}
                    onSelectHotspot={setSelectedHotspot}
                    counts={counts}
                  />
                </div>
                <div className="xl:col-span-1">
                  <EventDetailsPanel
                    hotspot={selectedHotspot}
                    onClose={() => setSelectedHotspot(null)}
                  />
                </div>
              </section>

              {/* 3. Multi-Source Data Fusion Banner */}
              <section>
                <DataSourcesBanner />
              </section>

              {/* 4. Hotspot Registry Table */}
              <section>
                <HotspotTable
                  hotspots={hotspots}
                  selectedHotspot={selectedHotspot}
                  onSelectHotspot={setSelectedHotspot}
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </section>

              {/* 5. Simple Analytics Section */}
              <section>
                <AnalyticsSection hotspots={hotspots} counts={counts} />
              </section>
            </>
          )}

          {/* TAB 2: HOTSPOTS REGISTRY VIEW */}
          {activeTab === 'hotspots' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <InteractiveMap
                    hotspots={displayHotspots}
                    selectedHotspot={selectedHotspot}
                    onSelectHotspot={setSelectedHotspot}
                    counts={counts}
                  />
                </div>
                <div className="xl:col-span-1">
                  <EventDetailsPanel
                    hotspot={selectedHotspot}
                    onClose={() => setSelectedHotspot(null)}
                  />
                </div>
              </div>

              <HotspotTable
                hotspots={hotspots}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={setSelectedHotspot}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />
            </div>
          )}

          {/* TAB 3: RISK ANALYSIS VIEW */}
          {activeTab === 'risk' && (
            <RiskAnalysisView
              hotspots={hotspots}
              onSelectHotspot={(item) => {
                setSelectedHotspot(item);
                setActiveTab('dashboard');
              }}
            />
          )}

          {/* TAB: AI MODELS & SHAP BENCHMARKS */}
          {activeTab === 'ai-models' && (
            <AIModelBenchmarkingView />
          )}

          {/* TAB 4: INDUSTRIAL ZONES VIEW */}
          {activeTab === 'industrial' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg font-extrabold text-slate-900 font-display mb-1">
                  South India Industrial Cadastre & Buffer Registry
                </h2>
                <p className="text-xs text-slate-500">
                  OpenStreetMap verified spatial polygons for hazardous chemical facilities, refineries, power plants, and SEZs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {INDUSTRIAL_CLUSTERS.map((cluster) => {
                  const matchingHotspots = hotspots.filter((h) =>
                    h.location.toLowerCase().includes(cluster.city.split(',')[0].toLowerCase()) ||
                    h.location.toLowerCase().includes(cluster.name.split(' ')[0].toLowerCase())
                  );

                  return (
                    <div
                      key={cluster.id}
                      className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-sky-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display font-extrabold text-slate-900 text-sm">
                          {cluster.name}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded border"
                          style={{
                            color: cluster.color,
                            borderColor: `${cluster.color}40`,
                            backgroundColor: `${cluster.color}15`,
                          }}
                        >
                          {cluster.hazardLevel}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">{cluster.city}</p>

                      <div className="p-2.5 rounded-lg bg-slate-50 text-xs text-slate-600 space-y-1">
                        <div className="flex justify-between">
                          <span>Active Thermal Incidents:</span>
                          <span className="font-bold text-slate-900">
                            {matchingHotspots.length} Detected
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Safety Buffer:</span>
                          <span className="font-bold text-sky-700">1.5 km Radius</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const match = matchingHotspots[0] || hotspots[0];
                          setSelectedHotspot(match);
                          setActiveTab('dashboard');
                        }}
                        className="w-full py-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors text-center"
                      >
                        Inspect Zone on Map →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: HISTORICAL EVENTS VIEW */}
          {activeTab === 'history' && (
            <HistoryView
              hotspots={hotspots}
              onSelectHotspot={(item) => {
                setSelectedHotspot(item);
                setActiveTab('dashboard');
              }}
            />
          )}
        </main>
      </div>

      {/* Analysis Modal */}
      <RunAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        onApplyNewHotspots={handleApplyNewHotspots}
      />

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="font-bold text-slate-700">THERMAL TRACERS</span>
            <span>|</span>
            <span>SIH 2026 Prototype</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>NASA FIRMS • Sentinel-1/2 • OpenStreetMap Fusion</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live Spatial Stream Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
