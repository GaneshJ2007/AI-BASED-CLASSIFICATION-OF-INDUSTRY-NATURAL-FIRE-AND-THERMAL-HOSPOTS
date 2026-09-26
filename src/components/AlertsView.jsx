import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Download,
  AlertTriangle,
  Factory,
  Trees,
  Zap,
  MapPin,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Search,
  Compass,
  Eye,
  Radio,
  Send
} from 'lucide-react';
import { fetchAlerts, updateAlertStatus } from '../services/api';

export default function AlertsView({
  hotspots,
  onSelectHotspot,
  onNavigateToTab
}) {
  const [alerts, setAlerts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Load alerts from API or local high-risk events
  useEffect(() => {
    async function load() {
      const data = await fetchAlerts({ status: statusFilter, riskTier: severityFilter });
      if (data && data.alerts && data.alerts.length > 0) {
        setAlerts(data.alerts);
        if (!selectedAlert) setSelectedAlert(data.alerts[0]);
      } else {
        // Fallback directly from high-risk hotspots
        const highRiskItems = hotspots
          .filter((h) => h.riskTier === 'Critical' || h.riskTier === 'High' || (h.riskScore && h.riskScore >= 60))
          .filter((h) => h.type !== 'Persistent Thermal')
          .slice(0, 20);

        const syntheticAlerts = highRiskItems.map((h, idx) => ({
          alert_id: `ALT-2026-${String(idx + 101).padStart(4, '0')}`,
          event_id: h.id,
          hotspot_id: h.id,
          timestamp: h.timestamp || h.date || '2026-09-22 14:15 UTC',
          location: h.location,
          classification: h.type,
          risk_score: h.riskScore || (h.riskTier === 'Critical' ? 92 : 74),
          risk_tier: h.riskTier || 'High',
          status: idx === 0 ? 'NEW' : idx === 1 ? 'ACKNOWLEDGED' : idx === 2 ? 'INVESTIGATING' : 'RESOLVED',
          nearest_facility: h.nearestFacility || h.nearbyIndustry || 'Industrial Asset',
          facility_category: h.facilityCategory || (h.type === 'Industrial Fire' ? 'Petrochemical' : 'Forest Reserve'),
          lat: h.lat,
          lng: h.lng,
          temperature: h.temperature || `${h.lst_c}°C`,
          frp: h.frp || 48.2,
          recommended_action: h.recommendedAction || 'Establish 1.5km cordon & deploy hazmat emergency foam units.',
          history_log: [
            {
              timestamp: '2026-09-22 14:15 UTC',
              status: 'NEW',
              note: 'Automated satellite anomaly ingest from VIIRS & Sentinel-5P stream.'
            }
          ]
        }));

        setAlerts(syntheticAlerts);
        if (syntheticAlerts.length > 0 && !selectedAlert) {
          setSelectedAlert(syntheticAlerts[0]);
        }
      }
    }

    load();
  }, [statusFilter, severityFilter, hotspots]);

  // Handle status update
  const handleStatusChange = async (alertId, newStatus) => {
    const res = await updateAlertStatus(alertId, newStatus);
    setActionFeedback(`Alert ${alertId} updated to ${newStatus}`);
    setTimeout(() => setActionFeedback(null), 4000);

    setAlerts((prev) =>
      prev.map((a) =>
        a.alert_id === alertId ? { ...a, status: newStatus } : a
      )
    );

    if (selectedAlert && selectedAlert.alert_id === alertId) {
      setSelectedAlert((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (statusFilter !== 'All' && a.status.toUpperCase() !== statusFilter.toUpperCase()) return false;
      if (severityFilter !== 'All' && a.risk_tier.toLowerCase() !== severityFilter.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.alert_id.toLowerCase().includes(q) ||
          a.event_id.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.classification.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [alerts, statusFilter, severityFilter, searchQuery]);

  // Computed summary counts
  const alertCounts = useMemo(() => {
    const total = alerts.length;
    const critical = alerts.filter((a) => a.risk_tier === 'Critical').length;
    const newAlerts = alerts.filter((a) => a.status === 'NEW').length;
    const industrial = alerts.filter((a) => a.classification === 'Industrial Fire').length;
    const natural = alerts.filter((a) => a.classification === 'Natural Fire').length;

    return { total, critical, newAlerts, industrial, natural };
  }, [alerts]);

  return (
    <div className="space-y-6">
      {/* 1. Alerts Command Header & Quick KPI Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-rose-900/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mr-1.5" />
                Emergency Command Active
              </span>
              <span className="text-xs text-slate-400">High-Risk Industrial & Natural Thermal Events</span>
            </div>
            <h1 className="text-2xl font-extrabold font-display">
              Enterprise Alert Dispatch & Escalation Center
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Automated SOP incident routing for acute chemical refinery fires, high-radiance industrial hazards, and fast-moving forest canopy wildfires.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-md px-4 py-3 rounded-xl border border-rose-500/30 shrink-0">
            <div className="text-center px-2">
              <p className="text-[10px] text-rose-300 uppercase font-bold">New Unhandled</p>
              <p className="text-2xl font-extrabold text-rose-400 font-display">{alertCounts.newAlerts}</p>
            </div>
            <div className="h-8 w-px bg-rose-500/30" />
            <div className="text-center px-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Critical Hazmat</p>
              <p className="text-2xl font-extrabold text-white font-display">{alertCounts.critical}</p>
            </div>
            <div className="h-8 w-px bg-rose-500/30" />
            <div className="text-center px-2">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Avg TTD</p>
              <p className="text-xl font-extrabold text-emerald-400 font-display">12.4m</p>
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {actionFeedback && (
          <div className="mt-4 p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
        )}
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mr-1">
            Status:
          </span>
          {['All', 'NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer text-[11px] ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 font-semibold bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical Hazmat (&gt;80%)</option>
            <option value="High">High Wildfire / Thermal (&gt;60%)</option>
          </select>

          {/* Search Query */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search alert, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-7 pr-3 py-1.5 w-44 sm:w-56 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 bg-slate-50"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Alerts Grid & Inspection Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alert Cards List (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800">No active alerts matching your filter criteria.</p>
              <p className="text-slate-400 mt-1">All industrial facilities and forest reserves operating within normal baseline.</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSelected = selectedAlert && selectedAlert.alert_id === alert.alert_id;
              const isCrit = alert.risk_tier === 'Critical';
              const isInd = alert.classification === 'Industrial Fire';

              return (
                <div
                  key={alert.alert_id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-500/20'
                      : isCrit
                      ? 'border-rose-200 hover:border-rose-400'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Badge Strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isCrit
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {isCrit ? 'CRITICAL HAZARD' : 'HIGH PRIORITY'}
                      </span>

                      <span className="font-mono text-xs font-bold text-slate-900">
                        {alert.alert_id}
                      </span>

                      <span className="text-[11px] font-mono text-slate-400">
                        ({alert.event_id})
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        alert.status === 'NEW'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                          : alert.status === 'ACKNOWLEDGED'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : alert.status === 'INVESTIGATING'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center space-x-2">
                      {isInd ? (
                        <Factory className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <Trees className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <h3 className="font-extrabold text-sm text-slate-900 font-display">
                        {alert.location}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      Target Asset: <strong className="text-slate-700">{alert.nearest_facility}</strong> ({alert.facility_category})
                    </p>
                  </div>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Risk Score:</span>
                      <span className="font-bold text-rose-600 font-mono">{alert.risk_score}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Thermal FRP:</span>
                      <span className="font-bold text-slate-800 font-mono">{alert.frp || 54.2} MW</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Surface Temp:</span>
                      <span className="font-bold text-slate-800 font-mono">{alert.temperature}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Detection Time:</span>
                      <span className="font-bold text-slate-700 font-mono">{alert.timestamp}</span>
                    </div>
                  </div>

                  {/* Recommended Action & Direct Navigation */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                    <p className="text-slate-600 text-[11px] truncate max-w-md">
                      <strong className="text-slate-800">SOP: </strong>{alert.recommended_action}
                    </p>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const matchHotspot = hotspots.find((h) => h.id === alert.event_id) || {
                            id: alert.event_id,
                            location: alert.location,
                            lat: alert.lat,
                            lng: alert.lng,
                            type: alert.classification,
                            riskScore: alert.risk_score,
                            riskTier: alert.risk_tier
                          };
                          onSelectHotspot(matchHotspot);
                          onNavigateToTab('gis-map');
                        }}
                        className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded text-[11px] font-bold border border-sky-200 transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <Compass className="w-3 h-3" />
                        <span>Map</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const matchHotspot = hotspots.find((h) => h.id === alert.event_id) || {
                            id: alert.event_id,
                            location: alert.location,
                            lat: alert.lat,
                            lng: alert.lng,
                            type: alert.classification,
                            riskScore: alert.risk_score,
                            riskTier: alert.risk_tier
                          };
                          onSelectHotspot(matchHotspot);
                          onNavigateToTab('hotspot-analysis');
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] font-bold transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Dossier</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Alert Incident Dossier (1/3) */}
        <div className="lg:col-span-1">
          {selectedAlert ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-20">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Selected Incident
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 font-display">
                    {selectedAlert.alert_id}
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${
                    selectedAlert.risk_tier === 'Critical' ? 'bg-rose-600' : 'bg-amber-500'
                  }`}
                >
                  {selectedAlert.risk_tier}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Event Link:</span>
                  <span className="font-mono font-bold text-sky-700">{selectedAlert.event_id}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Classification:</span>
                  <span className="font-bold text-slate-800">{selectedAlert.classification}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Facility / Reserve:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[140px]">{selectedAlert.nearest_facility}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Coordinates:</span>
                  <span className="font-mono text-slate-700">
                    {selectedAlert.lat ? selectedAlert.lat.toFixed(4) : '13.1672'}°N, {selectedAlert.lng ? selectedAlert.lng.toFixed(4) : '80.2641'}°E
                  </span>
                </div>
              </div>

              {/* Status Change Selector */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Update Emergency Status:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedAlert.alert_id, st)}
                      className={`p-1.5 rounded font-bold border transition-colors cursor-pointer text-center text-[10px] ${
                        selectedAlert.status === st
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-Agency Escalation Ledger */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <p className="font-bold text-slate-800">Dispatch Log & Agency Transmissions:</p>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>State Disaster Management Authority</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fire & Emergency Services Brigade</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>District Hazmat Response Unit</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    const matchHotspot = hotspots.find((h) => h.id === selectedAlert.event_id) || {
                      id: selectedAlert.event_id,
                      location: selectedAlert.location,
                      lat: selectedAlert.lat,
                      lng: alert.lng,
                      type: selectedAlert.classification,
                      riskScore: selectedAlert.risk_score,
                      riskTier: selectedAlert.risk_tier
                    };
                    onSelectHotspot(matchHotspot);
                    onNavigateToTab('hotspot-analysis');
                  }}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open Full Event Dossier →</span>
                </button>

                <button
                  onClick={() => {
                    const matchHotspot = hotspots.find((h) => h.id === selectedAlert.event_id) || {
                      id: selectedAlert.event_id,
                      location: selectedAlert.location,
                      lat: selectedAlert.lat,
                      lng: alert.lng,
                      type: selectedAlert.classification,
                      riskScore: selectedAlert.risk_score,
                      riskTier: selectedAlert.risk_tier
                    };
                    onSelectHotspot(matchHotspot);
                    onNavigateToTab('gis-map');
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-sky-600" />
                  <span>Locate Incident on GIS Map</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-xs">
              Select an alert from the list to view escalation dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
