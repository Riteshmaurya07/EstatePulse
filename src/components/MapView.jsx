import React, { useEffect, useRef } from 'react';
import Leaflet from 'leaflet';

const L = typeof window !== 'undefined' && window.L ? window.L : Leaflet;

export default function MapView({ projects, onSelectProject, onToggleCompare, selectedCompareIds }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Leaflet Map centered on Lucknow
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [26.85, 81.00],
        zoom: 12,
        zoomControl: true
      });

      // Standard OpenStreetMap tiles (100% free, no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    const bounds = [];

    // Add markers for projects
    projects.forEach(project => {
      if (!project.latitude || !project.longitude) return;

      const lat = parseFloat(project.latitude);
      const lng = parseFloat(project.longitude);

      if (isNaN(lat) || isNaN(lng)) return;

      bounds.push([lat, lng]);

      // Custom marker icon based on segment
      const isSelected = selectedCompareIds.includes(project.id);
      const markerColor = project.segment === 'Luxury' ? '#a855f7' : project.segment === 'Mid' ? '#0c8de4' : '#10b981';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            background-color: ${markerColor};
            width: ${isSelected ? '28px' : '22px'};
            height: ${isSelected ? '28px' : '22px'};
            border-radius: 50%;
            border: 3px solid #ffffff;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 10px;
            font-weight: bold;
            transition: all 0.3s ease;
          ">
            ${isSelected ? '✓' : ''}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 max-w-xs text-slate-800 font-sans';
      popupContent.innerHTML = `
        <div style="font-family: system-ui, sans-serif;">
          <div style="font-size: 10px; font-weight: 700; color: #0270c1; text-transform: uppercase; margin-bottom: 2px;">
            ${project.micromarket} • ${project.segment || 'Mid'}
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">
            ${project.projectName}
          </h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; font-weight: 500;">
            By ${project.developerName}
          </p>
          
          <div style="display: flex; justify-content: space-between; background: #f1f5f9; padding: 6px 8px; border-radius: 6px; font-size: 11px; margin-bottom: 8px;">
            <div>
              <span style="color: #64748b; display: block; font-size: 9px;">BSP Range</span>
              <strong style="color: #0f172a;">₹${project.bspInrSqftRange || 'N/A'}/sqft</strong>
            </div>
            <div>
              <span style="color: #64748b; display: block; font-size: 9px;">Absorption</span>
              <strong style="color: #10b981;">${project.percentSold}% Sold</strong>
            </div>
          </div>

          <div style="font-size: 10px; color: #475569; margin-bottom: 10px;">
            <div><strong>Sanitary:</strong> ${project.sanitaryBrands || 'Standard'}</div>
            <div><strong>Stage:</strong> ${project.constructionStatus || 'Under Construction'}</div>
          </div>

          <button id="view-proj-${project.id}" style="
            width: 100%;
            background: #0270c1;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            cursor: pointer;
          ">
            View B2B Specifications →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add click handler after popup opens
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-proj-${project.id}`);
        if (btn) {
          btn.onclick = () => onSelectProject(project);
        }
      });

      markersRef.current.push(marker);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [projects, selectedCompareIds]);

  return (
    <div className="space-y-4">
      
      {/* Map Control Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-xs">
          <span className="font-bold text-slate-300">Map Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500"></span>
            <span className="text-slate-400">Luxury Segment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-brand-500"></span>
            <span className="text-slate-400">Mid Segment</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">Affordable Segment</span>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing <strong className="text-white">{projects.length}</strong> mapped locations in Lucknow
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative w-full h-[600px] rounded-3xl overflow-hidden border border-slate-800 shadow-glow">
        <div ref={mapRef} className="w-full h-full" />
      </div>

    </div>
  );
}
