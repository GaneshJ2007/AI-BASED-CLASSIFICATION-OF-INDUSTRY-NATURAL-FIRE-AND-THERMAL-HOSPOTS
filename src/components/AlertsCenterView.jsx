import React, { useState, useEffect } from 'react';
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
  Search
} from 'lucide-react';
import { fetchAlerts, updateAlertStatus } from '../services/api';
import { LoadingState, EmptyState } from './CommonStates';

export default function AlertsCenterView({ onSelectHotspot, onInspectHotspot }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  const loadAlerts = async () => {
    setLoading(true);
    const data = await fetchAlerts({ status: statusFilter, riskTier: riskFilter });
    setAlerts(data.alerts || []);
    if (data.alerts && data.alerts.length > 0 && !selectedAlert) {
      setSelectedAlert(data.alerts[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAlerts();
  }, [statusFilter, riskFilter]);

  const handleStatusChange = async (alertId, newStatus) => {
    const res = await updateAlertStatus(alertId, newStatus);
    if (res.success) {
      setActionFeedback(`Alert ${alertId} updated to ${newStatus}`);
      setTimeout(() => setActionFeedback(null), 4000);
      setAlerts((prev) =>
        prev.map((a) => (a.alert_id === alertId ? res.alert : a))
      );
      if (selectedAlert && selectedAlert.alert_id === alertId) {
        setSelectedAlert(res.alert);
      }
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.alert_id.toLowerCase().includes(q) ||
      a.event_id.toLowerCase().includes(q) ||
      a.location.toLowerCase().includes(q) ||
      a.classification.toLowerCase().includes(q) ||
      (a.nearest_facility && a.nearest_facility.toLowerCase().includes(q))
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold animate-pulse';
      case 'ACKNOWLEDGED':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'INVESTIGATING':
        return 'bg-sky-100 text-sky-800 border-sky-300 font-bold';
      case 'RESOLVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getRiskBadge = (tier) => {
    switch (tier) {
      case 'Critical':
        return 'bg-rose-600 text-white';
      case 'High':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 font-display">
                Enterprise Hazard Alerts Center
              </h2>
              <p className="text-xs text-slate-500">
                Operational incident queue with audit logs and disaster dispatch integration for industrial emergencies.
              </p>
            </div>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Alerts</span>
            <span className="text-base font-extrabold text-rose-600 font-mono">
              {alerts.filter((a) => a.status !== 'RESOLVED').length}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Critical Tier</span>
            <span className="text-base font-extrabold text-slate-800 font-mono">
              {alerts.filter((a) => a.risk_tier === 'Critical').length}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Resolved Today</span>
            <span className="text-base font-extrabold text-emerald-600 font-mono">
              {alerts.filter((a) => a.status === 'RESOLVED').length}
            </span>
          </div>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Main Grid: Alert List + Selected Detail Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alert Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Controls Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search alerts by ID, location, facility..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center space-x-1 text-xs">
              {['All', 'NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table / List */}
          <div className="flex-1 overflow-y-auto max-h-[560px]">
            {loading ? (
              <LoadingState message="Fetching active emergency alerts..." />
            ) : filteredAlerts.length === 0 ? (
              <EmptyState
                title="No Alerts Found"
                description="No hazard alerts match the selected status or query."
                onReset={() => {
                  setStatusFilter('All');
                  setSearchQuery('');
                }}
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredAlerts.map((alert) => {
                  const isSelected = selectedAlert && selectedAlert.alert_id === alert.alert_id;
                  return (
                    <div
                      key={alert.alert_id}
                      onClick={() => setSelectedAlert(alert)}
                      className={`p-4 transition-colors cursor-pointer flex items-center justify-between gap-3 hover:bg-slate-50 ${
                        isSelected ? 'bg-sky-50/70 border-l-4 border-sky-600' : ''
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-extrabold text-slate-900">
                            {alert.alert_id}
                          </span>
                          <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full border ${getStatusBadge(alert.status)}`}>
                            {alert.status}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${getRiskBadge(alert.risk_tier)}`}>
                            {alert.risk_tier} Risk ({alert.risk_score}%)
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-800 truncate" title={alert.location}>
                          {alert.location}
                        </p>

                        <div className="flex items-center space-x-3 text-[11px] text-slate-500 font-mono">
                          <span>Event: {alert.event_id}</span>
                          <span>•</span>
                          <span>{alert.timestamp}</span>
                          <span>•</span>
                          <span>Temp: {alert.temperature}</span>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Alert Detail & Incident Controller */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col space-y-4">
          {selectedAlert ? (
            <>
              {/* Header */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {selectedAlert.alert_id}
                  </span>
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedAlert.status)}`}>
                    {selectedAlert.status}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-2 font-display">
                  {selectedAlert.classification}
                </h3>
                <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedAlert.location}</span>
                </p>
              </div>

              {/* Status Transition Control Buttons */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400 block">
                  Incident Lifecycle Status
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handleStatusChange(selectedAlert.alert_id, 'ACKNOWLEDGED')}
                    disabled={selectedAlert.status === 'ACKNOWLEDGED'}
                    className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold transition-colors disabled:opacity-50 cursor-pointer text-center"
                  >
                    Acknowledge
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedAlert.alert_id, 'INVESTIGATING')}
                    disabled={selectedAlert.status === 'INVESTIGATING'}
                    className="py-1.5 px-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold transition-colors disabled:opacity-50 cursor-pointer text-center"
                  >
                    Investigate
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedAlert.alert_id, 'RESOLVED')}
                    disabled={selectedAlert.status === 'RESOLVED'}
                    className="col-span-2 py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition-colors disabled:opacity-50 cursor-pointer text-center"
                  >
                    Mark as Resolved
                  </button>
                </div>
              </div>

              {/* Recommended Action & Dispatch Protocol */}
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-rose-800 text-xs font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Disaster Protocol (SOP)</span>
                </div>
                <p className="text-xs text-rose-900 leading-relaxed font-medium">
                  {selectedAlert.recommended_action}
                </p>
              </div>

              {/* Authority & Facility Details */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Nearest Facility:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[150px]" title={selectedAlert.nearest_facility}>
                    {selectedAlert.nearest_facility}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Facility Type:</span>
                  <span className="font-semibold text-slate-800">{selectedAlert.facility_category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Dispatch Unit:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                    {selectedAlert.dispatch_authority}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Coordinates:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedAlert.lat?.toFixed(4)}, {selectedAlert.lng?.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Audit Log / History */}
              <div className="space-y-1.5 border-t border-slate-100 pt-3">
                <label className="text-[10px] font-bold uppercase text-slate-400 block flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Incident Audit Log</span>
                </label>
                <div className="space-y-2 max-h-36 overflow-y-auto text-[11px]">
                  {selectedAlert.history_log &&
                    selectedAlert.history_log.map((log, i) => (
                      <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>{log.status}</span>
                          <span>{log.timestamp}</span>
                        </div>
                        <p className="text-slate-700">{log.note}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* View in Map & Full Dossier button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onInspectHotspot) {
                      onInspectHotspot(selectedAlert);
                    }
                  }}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Inspect Full Telemetry Dossier</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Select an alert from the queue to view audit trail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
