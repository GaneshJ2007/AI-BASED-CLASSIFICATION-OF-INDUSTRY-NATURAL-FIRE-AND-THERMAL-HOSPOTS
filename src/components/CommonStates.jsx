import React from 'react';
import {
  Loader2,
  AlertTriangle,
  FolderOpen,
  RefreshCw,
  Wifi,
  WifiOff,
  Flame,
  Factory,
  Trees,
  Zap,
  ShieldCheck
} from 'lucide-react';

export function LoadingState({ message = 'Loading satellite telemetry stream...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3 bg-white rounded-xl border border-slate-200 shadow-xs">
      <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
      <div className="space-y-1">
        <p className="text-sm font-bold text-slate-800">{message}</p>
        <p className="text-xs text-slate-400">Co-registering NASA FIRMS & Sentinel-5P tensors</p>
      </div>
    </div>
  );
}

export function EmptyState({
  title = 'No Thermal Events Found',
  description = 'Try adjusting your spatial filters, risk tier, or search parameters.',
  onReset
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3 bg-white rounded-xl border border-dashed border-slate-300">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
        <FolderOpen className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <p className="text-sm font-bold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = 'Data Ingestion Error',
  message = 'Failed to fetch telemetry from server.',
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-3 bg-rose-50/70 rounded-xl border border-rose-200 text-rose-900">
      <AlertTriangle className="w-8 h-8 text-rose-600" />
      <div className="space-y-1">
        <p className="text-sm font-bold text-rose-900">{title}</p>
        <p className="text-xs text-rose-700">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}

export function BackendBadge({ isOnline, onCheck }) {
  return (
    <div
      onClick={onCheck}
      className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer transition-all ${
        isOnline
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
      }`}
      title={isOnline ? 'Connected to FastAPI Backend at http://127.0.0.1:8000' : 'Backend offline. Running on verified South India local dataset.'}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOnline ? 'bg-emerald-400' : 'bg-amber-400'
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOnline ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        ></span>
      </span>
      {isOnline ? (
        <span className="flex items-center gap-1 font-mono">
          <Wifi className="w-3 h-3 text-emerald-600" />
          <span>FastAPI Connected</span>
        </span>
      ) : (
        <span className="flex items-center gap-1 font-mono">
          <WifiOff className="w-3 h-3 text-amber-600" />
          <span>Offline Archive Mode</span>
        </span>
      )}
    </div>
  );
}

export function ClassificationBadge({ type, size = 'sm' }) {
  const isSm = size === 'sm';
  switch (type) {
    case 'Industrial Fire':
      return (
        <span
          className={`inline-flex items-center space-x-1 font-bold rounded-full border bg-rose-50 text-rose-700 border-rose-200 ${
            isSm ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <Factory className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Industrial Fire</span>
        </span>
      );
    case 'Natural Fire':
    case 'Forest/Natural Fire':
      return (
        <span
          className={`inline-flex items-center space-x-1 font-bold rounded-full border bg-amber-50 text-amber-700 border-amber-200 ${
            isSm ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <Trees className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Natural Fire</span>
        </span>
      );
    case 'Persistent Thermal':
    case 'Persistent Thermal Source':
      return (
        <span
          className={`inline-flex items-center space-x-1 font-bold rounded-full border bg-purple-50 text-purple-700 border-purple-200 ${
            isSm ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <Zap className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Persistent Thermal</span>
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center space-x-1 font-bold rounded-full border bg-slate-50 text-slate-700 border-slate-200 ${
            isSm ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <Flame className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>{type}</span>
        </span>
      );
  }
}
