import React, { useState, useEffect } from 'react';
import {
  Flame,
  Satellite,
  Activity,
  RefreshCw,
  Layers,
  ShieldAlert,
  Play
} from 'lucide-react';
import { BackendBadge } from './CommonStates';
import { checkBackendHealth } from '../services/api';

export default function Header({
  activeTab,
  setActiveTab,
  onRunAnalysis,
  isAnalyzing,
  isDemoRun,
  onResetDemo
}) {
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  const verifyHealth = async () => {
    const health = await checkBackendHealth();
    setIsBackendOnline(health.online);
  };

  useEffect(() => {
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const navTabs = [
    { id: 'dashboard', label: '1. Dashboard' },
    { id: 'gis-map', label: '2. Live GIS Map' },
    { id: 'hotspot-analysis', label: '3. Hotspot Analysis' },
    { id: 'historical-analysis', label: '4. Historical Analysis' },
    { id: 'alerts', label: '5. Alerts' }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 shrink-0">
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
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                NTRO Problem Statement 26162
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Action Area */}
          <div className="flex items-center space-x-2.5 shrink-0">
            {/* Backend Connectivity Status Badge */}
            <BackendBadge isOnline={isBackendOnline} onCheck={verifyHealth} />

            {/* Reset Demo State Button */}
            {isDemoRun && (
              <button
                onClick={onResetDemo}
                title="Reset simulation state"
                className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm transition-all cursor-pointer ${
                isAnalyzing
                  ? 'bg-sky-400 cursor-not-allowed'
                  : 'bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-sky-600/25'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5" />
                  <span>Run Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
