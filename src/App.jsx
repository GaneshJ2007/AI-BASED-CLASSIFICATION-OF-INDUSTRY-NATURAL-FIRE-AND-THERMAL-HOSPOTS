import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LiveGISMapView from './components/LiveGISMapView';
import HotspotAnalysisView from './components/HotspotAnalysisView';
import HistoricalAnalysisView from './components/HistoricalAnalysisView';
import AlertsView from './components/AlertsView';
import RunAnalysisModal from './components/RunAnalysisModal';
import EventInspectionModal from './components/EventInspectionModal';
import {
  SIMULATED_NEW_HOTSPOTS
} from './data/mockHotspots';
import { REAL_HOTSPOTS } from './data/realHotspotsData';
import { fetchThermalEvents } from './services/api';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Hotspot dataset state - initialized with real South India satellite labeled events
  const [hotspots, setHotspots] = useState(REAL_HOTSPOTS);

  // Selected hotspot
  const [selectedHotspot, setSelectedHotspot] = useState(REAL_HOTSPOTS[0] || null);

  // Deep event inspection modal state
  const [inspectedHotspot, setInspectedHotspot] = useState(null);

  // Active navigation screen ('dashboard' | 'gis-map' | 'hotspot-analysis' | 'historical-analysis' | 'alerts')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Active filter ('All' | 'Industrial Fire' | 'Natural Fire' | 'Persistent Thermal' | 'High Risk')
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Analysis modal & state
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDemoRun, setIsDemoRun] = useState(false);
  const [analysisToast, setAnalysisToast] = useState(null);

  // On mount, attempt loading from FastAPI backend if available
  useEffect(() => {
    async function loadInitial() {
      try {
        const res = await fetchThermalEvents({ limit: 1000 });
        if (res.isLiveBackend && res.hotspots && res.hotspots.length > 0) {
          setHotspots(res.hotspots);
          setSelectedHotspot(res.hotspots[0]);
        }
      } catch (err) {
        console.warn('Backend load skipped, using local offline dataset:', err);
      }
    }
    loadInitial();
  }, []);

  // Compute live counts
  const counts = useMemo(() => {
    const total = hotspots.length;
    const industrial = hotspots.filter((h) => h.type === 'Industrial Fire').length;
    const natural = hotspots.filter((h) => h.type === 'Natural Fire').length;
    const persistent = hotspots.filter((h) => h.type === 'Persistent Thermal').length;
    const highRisk = hotspots.filter((h) => h.riskTier === 'Critical' || (h.riskScore && h.riskScore >= 80)).length;
    const activeAlerts = hotspots.filter(
      (h) => (h.riskTier === 'Critical' || h.riskTier === 'High' || (h.riskScore && h.riskScore >= 60)) && h.type !== 'Persistent Thermal'
    ).length;

    return { total, industrial, natural, persistent, highRisk, activeAlerts };
  }, [hotspots]);

  // Trigger Run Thermal Analysis
  const handleRunAnalysis = () => {
    setIsAnalysisModalOpen(true);
  };

  // Apply new simulation hotspots after modal completes
  const handleApplyNewHotspots = () => {
    setIsDemoRun(true);
    const existingIds = new Set(hotspots.map((h) => h.id));
    const newItems = SIMULATED_NEW_HOTSPOTS.filter((h) => !existingIds.has(h.id));
    const updated = [...newItems, ...hotspots];
    setHotspots(updated);

    const flagshipNew = updated.find((h) => h.id === 'TH-1024-LIVE') || updated[0];
    setSelectedHotspot(flagshipNew);

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
    setHotspots(REAL_HOTSPOTS);
    setSelectedHotspot(REAL_HOTSPOTS[0]);
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
              className="text-emerald-200 hover:text-white font-bold text-xs cursor-pointer"
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
        />

        {/* Main Content Area: ONLY THE 5 REQUIRED SCREENS */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* SCREEN 1: DASHBOARD (Overview + statistics + recent alerts) */}
          {activeTab === 'dashboard' && (
            <DashboardView
              hotspots={hotspots}
              counts={counts}
              onNavigateToTab={setActiveTab}
              onSelectHotspot={setSelectedHotspot}
              onRunAnalysis={handleRunAnalysis}
              isAnalyzing={isAnalyzing}
            />
          )}

          {/* SCREEN 2: LIVE GIS MAP (MAIN MODULE: Hotspots, Classification, Industrial facilities, Forest areas, Risk layers, Filters) */}
          {activeTab === 'gis-map' && (
            <LiveGISMapView
              hotspots={hotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={setSelectedHotspot}
              counts={counts}
              onInspectHotspot={setInspectedHotspot}
              onNavigateToAnalysis={(h) => {
                setSelectedHotspot(h);
                setActiveTab('hotspot-analysis');
              }}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          )}

          {/* SCREEN 3: HOTSPOT ANALYSIS (Detailed information about one selected thermal event) */}
          {activeTab === 'hotspot-analysis' && (
            <HotspotAnalysisView
              hotspots={hotspots}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={setSelectedHotspot}
              onNavigateToTab={setActiveTab}
            />
          )}

          {/* SCREEN 4: HISTORICAL ANALYSIS (Persistence + recurrence + timeline) */}
          {activeTab === 'historical-analysis' && (
            <HistoricalAnalysisView
              hotspots={hotspots}
              onSelectHotspot={(h) => {
                setSelectedHotspot(h);
                setActiveTab('hotspot-analysis');
              }}
              onNavigateToTab={setActiveTab}
            />
          )}

          {/* SCREEN 5: ALERTS (High-risk industrial/natural thermal events) */}
          {activeTab === 'alerts' && (
            <AlertsView
              hotspots={hotspots}
              onSelectHotspot={(h) => {
                setSelectedHotspot(h);
                setActiveTab('hotspot-analysis');
              }}
              onNavigateToTab={setActiveTab}
            />
          )}
        </main>
      </div>

      {/* Analysis Simulation Modal */}
      <RunAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        onApplyNewHotspots={handleApplyNewHotspots}
      />

      {/* Deep Event Inspection Modal */}
      <EventInspectionModal
        hotspot={inspectedHotspot}
        isOpen={Boolean(inspectedHotspot)}
        onClose={() => setInspectedHotspot(null)}
      />

      {/* Clean Global Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="font-bold text-slate-700">THERMAL TRACERS</span>
            <span>|</span>
            <span>SIH 2026 NTRO Solution (PS 26162)</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>NASA FIRMS • Sentinel-1 SAR • Sentinel-2 MSI • Sentinel-5P TROPOMI • OpenStreetMap Fusion</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              5 Core Platform Screens
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
