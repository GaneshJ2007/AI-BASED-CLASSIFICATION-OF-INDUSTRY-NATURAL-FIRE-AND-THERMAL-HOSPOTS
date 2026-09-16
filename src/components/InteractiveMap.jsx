import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { INDUSTRIAL_CLUSTERS } from '../data/mockHotspots';
import { Layers, Maximize2, Shield, Info, Flame, Factory, Trees, Zap } from 'lucide-react';

// Custom Leaflet DivIcon Generator
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
    ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; border: 3px solid #0284c7; top: -5px; left: -5px; box-shadow: 0 0 12px rgba(2, 132, 199, 0.8);"></div>`
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
    popupAnchor: [0, -12],
  });
};

// Map controller to dynamically pan/zoom when a hotspot is clicked from table or cards
function MapFlyTo({ selectedHotspot }) {
  const map = useMap();
  useEffect(() => {
    if (selectedHotspot && selectedHotspot.lat && selectedHotspot.lng) {
      map.flyTo([selectedHotspot.lat, selectedHotspot.lng], 11, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [selectedHotspot, map]);
  return null;
}

export default function InteractiveMap({
  hotspots,
  selectedHotspot,
  onSelectHotspot,
  counts
}) {
  const [showIndustrialZones, setShowIndustrialZones] = useState(true);
  const [mapStyle, setMapStyle] = useState('osm'); // 'osm' | 'esri' | 'satellite'

  const southIndiaCenter = [13.0, 79.5]; // Centered nicely over TN, AP, Karnataka

  const tileUrls = {
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    esri: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const tileAttributions = {
    osm: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    esri: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    satellite: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  };

  return (
    <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[560px] lg:h-[620px]">
      {/* Map Top Bar Controls */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-20">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            South India Thermal GIS Map
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {hotspots.length} Markers Rendered
          </span>
        </div>

        {/* Toggle Options */}
        <div className="flex items-center space-x-3 text-xs">
          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 hover:text-slate-900 select-none">
            <input
              type="checkbox"
              checked={showIndustrialZones}
              onChange={(e) => setShowIndustrialZones(e.target.checked)}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-3.5 h-3.5"
            />
            <span className="font-medium text-[11px]">Industrial Risk Zones (OSM)</span>
          </label>

          <div className="h-4 w-px bg-slate-200" />

          {/* Map Base Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setMapStyle('osm')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                mapStyle === 'osm'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              OSM Standard
            </button>
            <button
              onClick={() => setMapStyle('esri')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                mapStyle === 'esri'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Esri Gray
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                mapStyle === 'satellite'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Satellite View
            </button>
          </div>
        </div>
      </div>

      {/* Map Leaflet Container */}
      <div className="flex-1 w-full h-full relative">
        <MapContainer
          center={southIndiaCenter}
          zoom={7}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            key={mapStyle}
            attribution={tileAttributions[mapStyle]}
            url={tileUrls[mapStyle]}
            maxZoom={19}
          />

          <MapFlyTo selectedHotspot={selectedHotspot} />

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
                  fillOpacity: 0.12,
                }}
              >
                <Popup>
                  <div className="p-2.5 max-w-xs text-slate-800">
                    <div className="flex items-center space-x-1.5 mb-1 text-slate-900 font-bold text-xs">
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
                  click: () => onSelectHotspot(item),
                }}
              >
                <Popup>
                  <div className="p-3 w-64 text-slate-800 text-xs font-sans">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                      <span className="font-extrabold text-slate-900 font-display">
                        Event ID: {item.id}
                      </span>
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
                        <span className="font-medium text-slate-700 truncate max-w-[120px]">{item.nearbyIndustry}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Previous Detections:</span>
                        <span className="font-bold text-slate-800">{item.detectionCount || '7'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectHotspot(item)}
                      className="mt-2.5 w-full py-1 text-[11px] font-bold text-center text-white bg-sky-600 hover:bg-sky-700 rounded transition-colors"
                    >
                      Inspect Full Event
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 shadow-md text-xs w-60">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              Hotspot Legend
            </span>
            <span className="text-[10px] text-slate-400">Live Ingest</span>
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

            {showIndustrialZones && (
              <div className="pt-1.5 mt-1 border-t border-slate-100 flex items-center space-x-2 text-[10px] text-slate-500">
                <span className="w-3 h-2 border border-dashed border-rose-500 bg-rose-100/50 rounded-xs"></span>
                <span>OSM Industrial Safety Buffer (1.5km)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
