import { useEffect, useRef } from 'react';
import { LOCATIONS } from '../data/mockData';

const getMarkerColor = (feasibility) => {
  if (feasibility > 85) return '#10b981';
  if (feasibility >= 75) return '#f59e0b';
  return '#f97316';
};

export default function MapDashboard({ activeLayers, selectedApi }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    let L;
    let map;

    const initMap = async () => {
      L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapRef.current || mapInstanceRef.current) return;

      map = L.map(mapRef.current, {
        center: [22.5, 82.0],
        zoom: 5,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      addMarkers(L, map);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const addMarkers = (L, map) => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    LOCATIONS.forEach((loc) => {
      const color = getMarkerColor(loc.feasibility);
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: 10,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:sans-serif;min-width:180px">
          <b style="color:#10b981">${loc.name}</b><br/>
          <span style="color:#6b7280">${loc.state}</span><br/><br/>
          <div>Feasibility: <b>${loc.feasibility}</b></div>
          <div>Cost Efficiency: <b>${loc.cost_efficiency}</b></div>
          <div>Logistics Score: <b>${loc.logistics_score}</b></div>
        </div>
      `);

      markersRef.current.push(marker);
    });
  };

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    import('leaflet').then(({ default: L }) => {
      addMarkers(L, map);
    });
  }, [activeLayers]);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h2 className="font-semibold text-gray-100">India Pharma Infrastructure Map</h2>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> High Feasibility (&gt;85)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span> Medium (75–85)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-orange-500 inline-block"></span> Lower (&lt;75)
          </span>
        </div>
      </div>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
    </div>
  );
}
