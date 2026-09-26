import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { INDUSTRIAL_CLUSTERS } from '../data/mockHotspots';
import { OSM_INDUSTRIAL_FACILITIES, QUICK_JUMP_LOCATIONS } from '../data/industrialFacilities';
import { SOUTH_INDIA_FOREST_AREAS } from '../data/forestAreas';
import {
  Layers,
  Factory,
  Trees,
  Zap,
  Eye,
  ShieldAlert,
  Search,
  Compass,
  AlertCircle,
  Filter,
  Check,
  Flame,
  Info,
  ArrowRight
} from 'lucide-react';

// Custom Marker for South India Forest Reserves
const createForestIcon = () => {
  return L.divIcon({
    className: 'forest-map-marker',
    html: `
      <div style="width: 22px; height: 22px; border-radius: 50%; background: #064e3b; border: 2px solid #34d399; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.35); cursor: pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m8 14 4 4 4-4"/><path d="M12 10v6"/><path d="M10 3 8 7l4 2 4-2-2-4z"/><path d="M14 21v-4"/></svg>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11]
  });
};

// Custom Leaflet DivIcon Generator for Hotspots
const createCustomIcon = (type, isSelected, isNew, riskTier, riskScore) => {
  let color = '#0284c7';
  let pulseClass = '';
  let svgIcon = '';

  const isCritical = riskTier === 'Critical' || (riskScore && riskScore >= 80);
  const isHigh = riskTier === 'High' || (riskScore && riskScore >= 60);

  if (type === 'Industrial Fire') {
    color = '#ef4444'; // Red
    // Only pulse if active critical/high risk hazard or new live trigger
    if (isNew || isCritical || isHigh) {
      pulseClass = 'pulse-ring-industrial';
    }
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>`;
  } else if (type === 'Natural Fire') {
    color = '#f59e0b'; // Amber
    // Natural fires do NOT pulse unless truly critical emergency or new detection
    if (isNew || isCritical) {
      pulseClass = 'pulse-ring-natural';
    }
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v6"/><path d="m8 14 4 4 4-4"/><path d="M10 3 8 7l4 2 4-2-2-4z"/><path d="M14 21v-4"/></svg>`;
  } else if (type === 'Persistent Thermal') {
    color = '#8b5cf6'; // Purple
    // Persistent thermal is a WHITELISTED operational facility (power plant, refinery)
    // NEVER pulse - this is a routine compliant heat source, NOT an emergency!
    pulseClass = '';
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  }

  const selectedRing = isSelected
    ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #0284c7; top: -5px; left: -5px; box-shadow: 0 0 14px rgba(2, 132, 199, 0.9);"></div>`
    : '';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        ${pulseClass ? `<div class="${pulseClass}"></div>` : ''}
        ${selectedRing}
        <div style="width: 22px; height: 22px; border-radius: 50%; background: ${color}; border: 2px solid #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); z-index: 10; position: relative;">
          ${svgIcon}
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Custom Marker for OSM Industrial Facility Cadastre
const createFacilityIcon = () => {
  return L.divIcon({
    className: 'facility-map-marker',
    html: `
      <div style="width: 20px; height: 20px; border-radius: 4px; background: #0f172a; border: 1.5px solid #38bdf8; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.4); cursor: pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

// Cluster Icon Generator
const createClusterIcon = (count, hasIndustrial, hasNatural, hasPersistent) => {
  let bgColor = '#f59e0b';
  let badgeHalo = 'rgba(245, 158, 11, 0.25)';

  if (hasIndustrial) {
    bgColor = '#ef4444'; // Red if cluster contains industrial fires
    badgeHalo = 'rgba(239, 68, 68, 0.25)';
  } else if (!hasNatural && hasPersistent) {
    bgColor = '#8b5cf6'; // Purple if only persistent thermal
    badgeHalo = 'rgba(139, 92, 246, 0.25)';
  }

  return L.divIcon({
    className: 'custom-cluster-marker',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background: ${badgeHalo};"></div>
        <div style="width: 26px; height: 26px; border-radius: 50%; background: ${bgColor}; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 11px; z-index: 10;">
          ${count}
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

// Map Zoom & Pan Tracker
function MapStateController({ targetCoord, zoomLevel, onZoomChange }) {
  const map = useMap();

  useMapEvents({
    zoomend: () => {
      if (onZoomChange) onZoomChange(map.getZoom());
    }
  });

  useEffect(() => {
    if (targetCoord && targetCoord[0] && targetCoord[1]) {
      map.flyTo(targetCoord, zoomLevel || 11, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [targetCoord, zoomLevel, map]);

  return null;
}

export default function InteractiveMap({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  counts,
  onInspectHotspot,
  onNavigateToAnalysis
}) {
  const [showIndustrialZones, setShowIndustrialZones] = useState(true);
  const [showOsmFacilities, setShowOsmFacilities] = useState(true);
  const [showForestAreas, setShowForestAreas] = useState(true);
  const [showSafetyBuffers, setShowSafetyBuffers] = useState(true);
  const [showRiskLayers, setShowRiskLayers] = useState(true);
  const [clusterMode, setClusterMode] = useState(true);
  const [currentZoom, setCurrentZoom] = useState(7);
  const [mapStyle, setMapStyle] = useState('osm'); // 'osm' | 'esri' | 'satellite'
  const [searchQuery, setSearchQuery] = useState('');
  const [jumpCoord, setJumpCoord] = useState(null);

  // Independent Layer Visibility Toggles
  const [layers, setLayers] = useState({
    industrial: true,
    natural: true,
    persistent: true
  });

  const toggleLayer = (layerKey) => {
    setLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  };

  const isolateIndustrialOnly = () => {
    setLayers({
      industrial: true,
      natural: false,
      persistent: false
    });
  };

  const showAllLayers = () => {
    setLayers({
      industrial: true,
      natural: true,
      persistent: true
    });
  };

  const southIndiaCenter = [13.0, 79.5];

  const tileUrls = {
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    esri: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const tileAttributions = {
    osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    esri: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    satellite: 'Tiles &copy; Esri &mdash; NASA FIRMS & Sentinel-2 Overlay'
  };

  // Center to selected hotspot
  useEffect(() => {
    if (selectedHotspot && selectedHotspot.lat && selectedHotspot.lng) {
      setJumpCoord([selectedHotspot.lat, selectedHotspot.lng]);
    }
  }, [selectedHotspot]);

  const handleQuickJump = (loc) => {
    setJumpCoord([loc.lat, loc.lng]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.toLowerCase().trim();
    const matchHotspot = hotspots.find(
      (h) =>
        (h.id && h.id.toLowerCase().includes(q)) ||
        (h.location && h.location.toLowerCase().includes(q)) ||
        (h.nearestFacility && h.nearestFacility.toLowerCase().includes(q))
    );

    if (matchHotspot) {
      onSelectHotspot(matchHotspot);
      setJumpCoord([matchHotspot.lat, matchHotspot.lng]);
      return;
    }

    const matchFacility = OSM_INDUSTRIAL_FACILITIES.find(
      (f) => f.name.toLowerCase().includes(q) || f.city.toLowerCase().includes(q)
    );

    if (matchFacility) {
      setJumpCoord([matchFacility.lat, matchFacility.lng]);
    }
  };

  // Filter hotspots based on layer toggles
  const layerFilteredHotspots = useMemo(() => {
    return hotspots.filter((item) => {
      if (item.type === 'Industrial Fire' && !layers.industrial) return false;
      if (item.type === 'Natural Fire' && !layers.natural) return false;
      if (item.type === 'Persistent Thermal' && !layers.persistent) return false;
      return true;
    });
  }, [hotspots, layers]);

  // Spatial Grid Clustering for clean, uncluttered display when zoomed out
  const mapDisplayItems = useMemo(() => {
    // If clustering disabled or zoomed in sufficiently (>=9), render all items individually
    if (!clusterMode || currentZoom >= 9 || layerFilteredHotspots.length <= 25) {
      return { clusters: [], singles: layerFilteredHotspots };
    }

    // Grid size step in degrees lat/lng
    let step = 0.45;
    if (currentZoom <= 6) step = 0.65;
    else if (currentZoom === 7) step = 0.38;
    else if (currentZoom === 8) step = 0.20;

    const grid = new Map();

    layerFilteredHotspots.forEach((h) => {
      const latGrid = Math.floor(h.lat / step);
      const lngGrid = Math.floor(h.lng / step);
      const key = `${latGrid}_${lngGrid}`;
      if (!grid.has(key)) {
        grid.set(key, []);
      }
      grid.get(key).push(h);
    });

    const clusters = [];
    const singles = [];

    grid.forEach((items, key) => {
      if (items.length === 1) {
        singles.push(items[0]);
      } else {
        const avgLat = items.reduce((acc, cur) => acc + cur.lat, 0) / items.length;
        const avgLng = items.reduce((acc, cur) => acc + cur.lng, 0) / items.length;
        const hasIndustrial = items.some((i) => i.type === 'Industrial Fire');
        const hasNatural = items.some((i) => i.type === 'Natural Fire');
        const hasPersistent = items.some((i) => i.type === 'Persistent Thermal');
        const countInd = items.filter((i) => i.type === 'Industrial Fire').length;
        const countNat = items.filter((i) => i.type === 'Natural Fire').length;
        const countPer = items.filter((i) => i.type === 'Persistent Thermal').length;

        clusters.push({
          id: `cluster_${key}`,
          lat: avgLat,
          lng: avgLng,
          count: items.length,
          items,
          hasIndustrial,
          hasNatural,
          hasPersistent,
          countInd,
          countNat,
          countPer
        });
      }
    });

    return { clusters, singles };
  }, [layerFilteredHotspots, clusterMode, currentZoom]);

  return (
    <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[580px] lg:h-[640px]">
      {/* Map Controls Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            South India Thermal GIS Map
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {layerFilteredHotspots.length} Visible
          </span>
        </div>

        {/* Quick Search Locator */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="Search Event ID, City, or Facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs pl-7 pr-3 py-1 w-44 sm:w-56 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 bg-slate-50"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
        </form>

        {/* Cluster Toggle & Layer Controls */}
        <div className="flex items-center space-x-3 text-xs">
          <label className="flex items-center space-x-1 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={clusterMode}
              onChange={(e) => setClusterMode(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium">Smart Clustering</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={showOsmFacilities}
              onChange={(e) => setShowOsmFacilities(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium">OSM Facilities</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={showForestAreas}
              onChange={(e) => setShowForestAreas(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium text-emerald-800 font-semibold">Forest Areas</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={showSafetyBuffers}
              onChange={(e) => setShowSafetyBuffers(e.target.checked)}
              className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium">1.5km Buffer</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={showRiskLayers}
              onChange={(e) => setShowRiskLayers(e.target.checked)}
              className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium">Risk Halos</span>
          </label>

          <div className="h-4 w-px bg-slate-200" />

          {/* Map Base Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setMapStyle('osm')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                mapStyle === 'osm' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              OSM
            </button>
            <button
              onClick={() => setMapStyle('esri')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                mapStyle === 'esri' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Esri Gray
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer ${
                mapStyle === 'satellite' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Quick Jump Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 flex items-center space-x-2 overflow-x-auto text-[11px] z-10">
        <span className="text-slate-500 font-bold shrink-0 flex items-center gap-1">
          <Compass className="w-3 h-3 text-sky-600" />
          <span>Jump to:</span>
        </span>
        {QUICK_JUMP_LOCATIONS.map((loc, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickJump(loc)}
            className="px-2 py-0.5 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 shadow-2xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* Map Leaflet Container */}
      <div className="flex-1 w-full h-full relative">
        <MapContainer center={southIndiaCenter} zoom={7} scrollWheelZoom={true} style={{ width: '100%', height: '100%' }}>
          <TileLayer attribution={tileAttributions[mapStyle]} url={tileUrls[mapStyle]} maxZoom={19} />

          <MapStateController
            targetCoord={jumpCoord}
            zoomLevel={11}
            onZoomChange={setCurrentZoom}
          />

          {/* Industrial Buffer Zones Polygons */}
          {showIndustrialZones &&
            INDUSTRIAL_CLUSTERS.map((zone) => (
              <Rectangle
                key={zone.id}
                bounds={zone.bounds}
                pathOptions={{
                  color: zone.color,
                  weight: 1.5,
                  dashArray: '4, 4',
                  fillColor: zone.color,
                  fillOpacity: 0.12
                }}
              >
                <Popup>
                  <div className="p-2 max-w-xs text-slate-800 text-xs">
                    <div className="flex items-center space-x-1.5 mb-1 text-slate-900 font-bold">
                      <Factory className="w-3.5 h-3.5 text-sky-600" />
                      <span>{zone.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-1">{zone.city}</p>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      {zone.hazardLevel}
                    </span>
                  </div>
                </Popup>
              </Rectangle>
            ))}

          {/* OSM Industrial Facilities Markers & Buffers */}
          {showOsmFacilities &&
            OSM_INDUSTRIAL_FACILITIES.map((facility) => (
              <React.Fragment key={facility.id}>
                <Marker position={[facility.lat, facility.lng]} icon={createFacilityIcon()}>
                  <Popup>
                    <div className="p-2.5 w-60 text-slate-800 text-xs">
                      <div className="flex items-center space-x-1.5 font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1.5">
                        <Factory className="w-3.5 h-3.5 text-sky-600" />
                        <span>{facility.name}</span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-700">Category:</span> {facility.category}
                        </p>
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-700">Location:</span> {facility.city}, {facility.state}
                        </p>
                        <span className="inline-block font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 mt-1">
                          {facility.hazardLevel}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* 1.5 km Critical Safety Buffer */}
                {showSafetyBuffers && (
                  <Circle
                    center={[facility.lat, facility.lng]}
                    radius={1500}
                    pathOptions={{
                      color: '#ef4444',
                      weight: 1,
                      dashArray: '3, 3',
                      fillColor: '#ef4444',
                      fillOpacity: 0.08
                    }}
                  />
                )}
              </React.Fragment>
            ))}

          {/* South India Forest Reserves & Protected Wildland Areas */}
          {showForestAreas &&
            SOUTH_INDIA_FOREST_AREAS.map((forest) => (
              <React.Fragment key={forest.id}>
                <Rectangle
                  bounds={forest.bounds}
                  pathOptions={{
                    color: forest.color || '#10b981',
                    weight: 2,
                    dashArray: '5, 5',
                    fillColor: forest.color || '#10b981',
                    fillOpacity: 0.16
                  }}
                >
                  <Popup>
                    <div className="p-2.5 max-w-xs text-slate-800 text-xs">
                      <div className="flex items-center space-x-1.5 font-bold text-emerald-950 border-b border-emerald-100 pb-1 mb-1.5">
                        <Trees className="w-4 h-4 text-emerald-600" />
                        <span>{forest.name}</span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-700">Canopy Category:</span> {forest.category}
                        </p>
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-700">Location:</span> {forest.district}, {forest.state}
                        </p>
                        <p className="text-slate-600">
                          <span className="font-semibold text-slate-700">Canopy Cover:</span> {forest.canopyCover} • {forest.areaSqKm} km²
                        </p>
                        <div className="mt-1.5 p-1 rounded bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-semibold">
                          Wildfire Flammability: {forest.flammability} (Peak: {forest.fireSeason})
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Rectangle>

                <Marker position={[forest.lat, forest.lng]} icon={createForestIcon()}>
                  <Popup>
                    <div className="p-2 text-xs">
                      <div className="flex items-center space-x-1 font-bold text-emerald-900">
                        <Trees className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{forest.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{forest.category}</p>
                      <p className="text-[10px] text-emerald-700 font-semibold mt-1">Protected Ecological Reserve</p>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}

          {/* Critical Risk Layer Halos */}
          {showRiskLayers &&
            layerFilteredHotspots
              .filter((h) => h.riskTier === 'Critical' || (h.riskScore && h.riskScore >= 75))
              .map((h) => (
                <Circle
                  key={`risk_halo_${h.id}`}
                  center={[h.lat, h.lng]}
                  radius={2400}
                  pathOptions={{
                    color: h.type === 'Industrial Fire' ? '#ef4444' : '#f59e0b',
                    weight: 1.5,
                    dashArray: '3, 4',
                    fillColor: h.type === 'Industrial Fire' ? '#ef4444' : '#f59e0b',
                    fillOpacity: 0.10
                  }}
                />
              ))}

          {/* Selected Hotspot 1.5km Perimeter Highlight */}
          {selectedHotspot && selectedHotspot.lat && (
            <Circle
              center={[selectedHotspot.lat, selectedHotspot.lng]}
              radius={1500}
              pathOptions={{
                color: selectedHotspot.type === 'Industrial Fire' ? '#ef4444' : '#0284c7',
                weight: 2,
                dashArray: '4, 4',
                fillColor: selectedHotspot.type === 'Industrial Fire' ? '#ef4444' : '#0284c7',
                fillOpacity: 0.15
              }}
            />
          )}

          {/* Render Cluster Badges when zoomed out */}
          {mapDisplayItems.clusters.map((cluster) => {
            const clusterIcon = createClusterIcon(
              cluster.count,
              cluster.hasIndustrial,
              cluster.hasNatural,
              cluster.hasPersistent
            );

            return (
              <Marker
                key={cluster.id}
                position={[cluster.lat, cluster.lng]}
                icon={clusterIcon}
                eventHandlers={{
                  click: () => {
                    setJumpCoord([cluster.lat, cluster.lng]);
                    // Auto select the first high-severity event in the cluster
                    const primary =
                      cluster.items.find((i) => i.type === 'Industrial Fire') ||
                      cluster.items.find((i) => i.riskTier === 'Critical') ||
                      cluster.items[0];
                    if (primary) onSelectHotspot(primary);
                  }
                }}
              >
                <Popup>
                  <div className="p-2.5 w-56 text-slate-800 text-xs">
                    <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2 flex items-center justify-between">
                      <span>Regional Cluster</span>
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-600 font-extrabold">
                        {cluster.count} Events
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] mb-2.5">
                      {cluster.countInd > 0 && (
                        <div className="flex justify-between items-center text-rose-700 font-medium">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            Industrial Fires:
                          </span>
                          <span className="font-bold">{cluster.countInd}</span>
                        </div>
                      )}
                      {cluster.countNat > 0 && (
                        <div className="flex justify-between items-center text-amber-700 font-medium">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            Natural Fires:
                          </span>
                          <span className="font-bold">{cluster.countNat}</span>
                        </div>
                      )}
                      {cluster.countPer > 0 && (
                        <div className="flex justify-between items-center text-purple-700 font-medium">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                            Persistent Sources:
                          </span>
                          <span className="font-bold">{cluster.countPer}</span>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setJumpCoord([cluster.lat, cluster.lng]);
                      }}
                      className="w-full py-1 text-[10px] font-bold text-center text-sky-700 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 transition-colors cursor-pointer"
                    >
                      Zoom In To Expand Cluster
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Render Individual Hotspots */}
          {mapDisplayItems.singles.map((item) => {
            const isSelected = selectedHotspot && selectedHotspot.id === item.id;
            const icon = createCustomIcon(
              item.type,
              isSelected,
              item.isNew,
              item.riskTier,
              item.riskScore
            );

            return (
              <Marker
                key={item.id}
                position={[item.lat, item.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectHotspot(item)
                }}
              >
                <Popup>
                  <div className="p-3 w-64 text-slate-800 text-xs font-sans">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <span className="font-extrabold text-slate-900 font-display">Event ID: {item.id}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.type === 'Industrial Fire'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : item.type === 'Natural Fire'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-purple-100 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Location:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[130px]" title={item.location}>
                          {item.zone || item.location}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Risk Tier:</span>
                        <span
                          className="font-bold px-1.5 py-0.2 rounded text-[10px]"
                          style={{ backgroundColor: `${item.riskColor || '#f59e0b'}20`, color: item.riskColor || '#f59e0b' }}
                        >
                          {item.riskTier || 'Medium'} ({item.riskScore}%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Confidence:</span>
                        <span className="font-bold text-sky-600">{item.confidence}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nearby Industry:</span>
                        <span className="font-medium text-slate-700 truncate max-w-[120px]">{item.nearbyIndustry || item.distToIndustrial}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Surface Temp:</span>
                        <span className="font-bold text-slate-800">{item.temperature || `${item.lst_c}°C`}</span>
                      </div>
                    </div>

                    {item.type === 'Persistent Thermal' && (
                      <div className="mt-2 p-1.5 rounded bg-purple-50 border border-purple-100 text-[10px] text-purple-800 flex items-center gap-1">
                        <Info className="w-3 h-3 text-purple-600 shrink-0" />
                        <span>Whitelisted routine operational facility. Not an emergency fire outbreak.</span>
                      </div>
                    )}

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                      {onNavigateToAnalysis && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHotspot(item);
                            onNavigateToAnalysis(item);
                          }}
                          className="w-full py-1.5 text-[11px] font-bold text-center text-white bg-sky-600 hover:bg-sky-500 rounded shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Open Hotspot Analysis →</span>
                        </button>
                      )}
                      {onInspectHotspot && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHotspot(item);
                            onInspectHotspot(item);
                          }}
                          className="w-full py-1 text-[10px] font-semibold text-center text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <span>Quick Dossier Modal</span>
                        </button>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend with Interactive Layer Toggles */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md text-xs w-72">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-sky-600" />
              <span>Map Layers & Legend</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={isolateIndustrialOnly}
                title="Isolate Industrial Fires Only"
                className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                Industrial Only
              </button>
              <button
                onClick={showAllLayers}
                title="Reset All Layers"
                className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                All
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            {/* Layer 1: Industrial Fire */}
            <button
              type="button"
              onClick={() => toggleLayer('industrial')}
              className={`w-full flex items-center justify-between px-2 py-1 rounded transition-colors text-left cursor-pointer ${
                layers.industrial ? 'bg-rose-50/70 hover:bg-rose-100/70 text-slate-800' : 'bg-slate-50 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold ${
                  layers.industrial ? 'bg-rose-500 shadow-xs' : 'bg-slate-300'
                }`}>
                  {layers.industrial ? '✓' : ''}
                </span>
                <span className="text-[11px] font-medium">Industrial Fire (Hazmat)</span>
              </div>
              <span className={`font-bold text-[11px] ${layers.industrial ? 'text-rose-600' : 'text-slate-400'}`}>
                {counts.industrial}
              </span>
            </button>

            {/* Layer 2: Natural Fire */}
            <button
              type="button"
              onClick={() => toggleLayer('natural')}
              className={`w-full flex items-center justify-between px-2 py-1 rounded transition-colors text-left cursor-pointer ${
                layers.natural ? 'bg-amber-50/70 hover:bg-amber-100/70 text-slate-800' : 'bg-slate-50 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold ${
                  layers.natural ? 'bg-amber-500 shadow-xs' : 'bg-slate-300'
                }`}>
                  {layers.natural ? '✓' : ''}
                </span>
                <span className="text-[11px] font-medium">Natural Fire (Forest/Eco)</span>
              </div>
              <span className={`font-bold text-[11px] ${layers.natural ? 'text-amber-600' : 'text-slate-400'}`}>
                {counts.natural}
              </span>
            </button>

            {/* Layer 3: Persistent Thermal Source */}
            <button
              type="button"
              onClick={() => toggleLayer('persistent')}
              className={`w-full flex items-center justify-between px-2 py-1 rounded transition-colors text-left cursor-pointer ${
                layers.persistent ? 'bg-purple-50/70 hover:bg-purple-100/70 text-slate-800' : 'bg-slate-50 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[8px] font-bold ${
                  layers.persistent ? 'bg-purple-500 shadow-xs' : 'bg-slate-300'
                }`}>
                  {layers.persistent ? '✓' : ''}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-medium">Persistent Thermal</span>
                  <span className="text-[9px] px-1 rounded bg-purple-100 text-purple-700 font-semibold">Whitelisted</span>
                </div>
              </div>
              <span className={`font-bold text-[11px] ${layers.persistent ? 'text-purple-600' : 'text-slate-400'}`}>
                {counts.persistent}
              </span>
            </button>

            <div className="pt-1.5 mt-1 border-t border-slate-100 space-y-1">
              <div className="flex items-center space-x-2 text-[10px] text-slate-600">
                <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-sky-400 flex items-center justify-center text-[7px] text-sky-400 font-bold">
                  🏭
                </div>
                <span>OSM Industrial Facility Cadastre</span>
              </div>

              {showForestAreas && (
                <div className="flex items-center space-x-2 text-[10px] text-emerald-700">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-900 border border-emerald-400 flex items-center justify-center text-[7px] text-emerald-400 font-bold">
                    🌲
                  </div>
                  <span>South India Forest Reserves & Corridors</span>
                </div>
              )}

              {showSafetyBuffers && (
                <div className="flex items-center space-x-2 text-[10px] text-rose-600">
                  <span className="w-3 h-2 border border-dashed border-rose-500 bg-rose-100/50 rounded-xs"></span>
                  <span>1.5km Industrial Hazard Critical Buffer</span>
                </div>
              )}

              {showRiskLayers && (
                <div className="flex items-center space-x-2 text-[10px] text-amber-600">
                  <span className="w-3 h-2 border border-dashed border-amber-500 bg-amber-100/50 rounded-xs"></span>
                  <span>Critical Risk Anomaly Halo (&gt;75%)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
