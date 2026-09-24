import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { INDUSTRIAL_CLUSTERS } from '../data/mockHotspots';
import { OSM_INDUSTRIAL_FACILITIES, QUICK_JUMP_LOCATIONS } from '../data/industrialFacilities';
import {
  Layers,
  Factory,
  Trees,
  Zap,
  Eye,
  ShieldAlert,
  Search,
  Crosshair,
  Compass,
  AlertCircle
} from 'lucide-react';

// Custom Leaflet DivIcon Generator for Hotspots
const createCustomIcon = (type, isSelected, isNew) => {
  let color = '#0284c7';
  let pulseClass = '';
  let svgIcon = '';

  if (type === 'Industrial Fire') {
    color = '#ef4444'; // Rose/Red
    pulseClass = 'pulse-ring-industrial';
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>`;
  } else if (type === 'Natural Fire') {
    color = '#f59e0b'; // Amber
    pulseClass = 'pulse-ring-natural';
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v6"/><path d="m8 14 4 4 4-4"/><path d="M10 3 8 7l4 2 4-2-2-4z"/><path d="M14 21v-4"/></svg>`;
  } else if (type === 'Persistent Thermal') {
    color = '#8b5cf6'; // Purple
    pulseClass = 'pulse-ring-persistent';
    svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
  }

  if (isNew) {
    pulseClass = 'pulse-ring-new';
  }

  const selectedRing = isSelected
    ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #0284c7; top: -5px; left: -5px; box-shadow: 0 0 14px rgba(2, 132, 199, 0.9);"></div>`
    : '';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div class="${pulseClass}"></div>
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

// Dynamic Map pan/fly controller
function MapFlyController({ targetCoord, zoomLevel }) {
  const map = useMap();
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
  onInspectHotspot
}) {
  const [showIndustrialZones, setShowIndustrialZones] = useState(true);
  const [showOsmFacilities, setShowOsmFacilities] = useState(true);
  const [showSafetyBuffers, setShowSafetyBuffers] = useState(true);
  const [mapStyle, setMapStyle] = useState('osm'); // 'osm' | 'esri' | 'satellite'
  const [searchQuery, setSearchQuery] = useState('');
  const [jumpCoord, setJumpCoord] = useState(null);

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

  // When selectedHotspot changes, center to it
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
    // Try matching hotspot
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

    // Try matching OSM facility
    const matchFacility = OSM_INDUSTRIAL_FACILITIES.find(
      (f) => f.name.toLowerCase().includes(q) || f.city.toLowerCase().includes(q)
    );

    if (matchFacility) {
      setJumpCoord([matchFacility.lat, matchFacility.lng]);
    }
  };

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
            {hotspots.length} Markers
          </span>
        </div>

        {/* Quick Search Locator */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="Search Event ID, City, or Facility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs pl-7 pr-3 py-1 w-48 sm:w-64 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 bg-slate-50"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
        </form>

        {/* Layer Toggles & Map Style */}
        <div className="flex items-center space-x-3 text-xs">
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
              checked={showSafetyBuffers}
              onChange={(e) => setShowSafetyBuffers(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium">1.5km Buffer</span>
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

          <MapFlyController targetCoord={jumpCoord} />

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

          {/* Hotspot Markers */}
          {hotspots.map((item) => {
            const isSelected = selectedHotspot && selectedHotspot.id === item.id;
            const icon = createCustomIcon(item.type, isSelected, item.isNew);

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
                        <span className="text-slate-500">Risk Score:</span>
                        <span className="font-bold text-rose-600">{item.riskScore}%</span>
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

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHotspot(item);
                        if (onInspectHotspot) {
                          onInspectHotspot(item);
                        }
                      }}
                      className="mt-2.5 w-full py-1.5 text-[11px] font-bold text-center text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Full Dossier</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md text-xs w-64">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Map Layers & Legend</span>
            <span className="text-[10px] text-slate-400">SIH 2026</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 border border-white shadow-xs"></span>
                <span className="text-slate-700 text-[11px] font-medium">Industrial Fire</span>
              </div>
              <span className="font-bold text-rose-600 text-[11px]">{counts.industrial}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-xs"></span>
                <span className="text-slate-700 text-[11px] font-medium">Natural Fire</span>
              </div>
              <span className="font-bold text-amber-600 text-[11px]">{counts.natural}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 border border-white shadow-xs"></span>
                <span className="text-slate-700 text-[11px] font-medium">Persistent Thermal</span>
              </div>
              <span className="font-bold text-purple-600 text-[11px]">{counts.persistent}</span>
            </div>

            <div className="pt-1.5 mt-1 border-t border-slate-100 space-y-1">
              <div className="flex items-center space-x-2 text-[10px] text-slate-600">
                <div className="w-3 h-3 rounded-xs bg-slate-900 border border-sky-400 flex items-center justify-center text-[7px] text-sky-400 font-bold">
                  🏭
                </div>
                <span>OSM Industrial Facility</span>
              </div>

              {showSafetyBuffers && (
                <div className="flex items-center space-x-2 text-[10px] text-rose-600">
                  <span className="w-3 h-2 border border-dashed border-rose-500 bg-rose-100/50 rounded-xs"></span>
                  <span>1.5km High-Hazard Critical Buffer</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
