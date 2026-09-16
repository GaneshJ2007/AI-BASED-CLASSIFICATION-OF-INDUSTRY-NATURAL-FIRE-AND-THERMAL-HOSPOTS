import React from 'react';
import { Flame, Satellite, Activity, RefreshCw, Layers, ShieldAlert } from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onRunAnalysis, 
  isAnalyzing, 
  isDemoRun, 
  onResetDemo 
}) {
  const navTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'hotspots', label: 'Hotspots' },
    { id: 'risk', label: 'Risk Analysis' },
    { id: 'history', label: 'History' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">
                  THERMAL TRACERS
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                AI-Powered Thermal Anomaly Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-sky-700 shadow-sm border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Action Area */}
          <div className="flex items-center space-x-3">
            {/* Live Feed Status indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 bg-slate-50 rounded-full border border-slate-200 text-xs text-slate-600">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium text-slate-700">FIRMS / Sentinel-2 Feed</span>
            </div>

            {/* Reset Demo Button (if analysis already executed) */}
            {isDemoRun && (
              <button
                onClick={onResetDemo}
                title="Reset simulation state"
                className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors border border-slate-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className={`inline-flex items-center space-x-2 px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-all duration-150 ${
                isAnalyzing
                  ? 'bg-sky-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-sky-600/25 hover:shadow-md'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Scanning Feeds...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>RUN THERMAL ANALYSIS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
