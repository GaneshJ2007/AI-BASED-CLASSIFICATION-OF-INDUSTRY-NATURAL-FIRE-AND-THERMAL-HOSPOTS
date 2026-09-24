import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Flame, Factory, Trees, Zap, Eye } from 'lucide-react';

export default function HotspotTable({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  selectedFilter,
  onFilterChange,
  onInspectHotspot
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filterTabs = [
    { id: 'All', label: 'All' },
    { id: 'Industrial Fire', label: 'Industrial Fire' },
    { id: 'Natural Fire', label: 'Natural Fire' },
    { id: 'Persistent Thermal', label: 'Persistent Thermal' },
    { id: 'High Risk', label: 'High Risk (>80%)' },
  ];

  // Filtering
  const filteredHotspots = hotspots.filter((item) => {
    // Type/Risk filter
    let matchesFilter = true;
    if (selectedFilter === 'High Risk') {
      matchesFilter = item.riskScore >= 80;
    } else if (selectedFilter !== 'All') {
      matchesFilter = item.type === selectedFilter;
    }

    // Search query filter
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch =
        item.id.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        (item.zone && item.zone.toLowerCase().includes(q)) ||
        item.type.toLowerCase().includes(q);
    }

    return matchesFilter && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredHotspots.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredHotspots.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadge = (status, risk) => {
    if (status === 'Critical' || risk >= 85) {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    if (status === 'High' || risk >= 70) {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Industrial Fire':
        return <Factory className="w-3.5 h-3.5 text-rose-600 mr-1.5" />;
      case 'Natural Fire':
        return <Trees className="w-3.5 h-3.5 text-amber-600 mr-1.5" />;
      case 'Persistent Thermal':
        return <Zap className="w-3.5 h-3.5 text-purple-600 mr-1.5" />;
      default:
        return <Flame className="w-3.5 h-3.5 text-sky-600 mr-1.5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 font-display">
            Thermal Hotspot Registry
          </h3>
          <p className="text-xs text-slate-500">
            Real-time catalog of satellite thermal anomalies with AI risk classification
          </p>
        </div>

        {/* Filter Pills & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Event ID, location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto">
            {filterTabs.map((tab) => {
              const isSelected = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onFilterChange(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Event ID</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4 text-center">Risk</th>
              <th className="py-3 px-4 text-center">Confidence</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-400">
                  No thermal hotspots match your filter criteria.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => {
                const isSelected = selectedHotspot && selectedHotspot.id === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectHotspot(item)}
                    className={`hover:bg-sky-50/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-50/90 font-medium' : ''
                    }`}
                  >
                    {/* Event ID */}
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center space-x-1.5">
                        <span>{item.id}</span>
                        {item.isNew && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-700">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-4 max-w-xs truncate" title={item.location}>
                      <span className="font-medium text-slate-800">{item.zone || item.location}</span>
                      <span className="block text-[10px] text-slate-400 truncate">{item.location}</span>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTypeIcon(item.type)}
                        <span>{item.type}</span>
                      </div>
                    </td>

                    {/* Risk Score */}
                    <td className="py-3 px-4 text-center whitespace-nowrap font-bold">
                      <span
                        className={
                          item.riskScore >= 80
                            ? 'text-rose-600'
                            : item.riskScore >= 60
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }
                      >
                        {item.riskScore}%
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="py-3 px-4 text-center whitespace-nowrap font-bold text-sky-600">
                      {item.confidence}%
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(
                          item.status,
                          item.riskScore
                        )}`}
                      >
                        {item.status || (item.riskScore >= 80 ? 'High' : item.riskScore >= 60 ? 'Medium' : 'Low')}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectHotspot(item);
                          if (onInspectHotspot) {
                            onInspectHotspot(item);
                          }
                        }}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-600 text-[11px] font-semibold transition-colors cursor-pointer"
                        title="Inspect Full Event Dossier"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{filteredHotspots.length === 0 ? 0 : startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(startIndex + itemsPerPage, filteredHotspots.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{filteredHotspots.length}</span> hotspots
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-semibold text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
