import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Shield, 
  Layers, 
  Plus, 
  Minus, 
  Navigation, 
  Building2, 
  Train, 
  X,
  Hospital,
  AlertTriangle,
  Moon
} from 'lucide-react';
import { RouteOption, EmergencyHelpPoint } from '../types';
import { MOCK_HELP_POINTS, MOCK_HEATMAP_ZONES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export interface MapEngineProps {
  activeRoute?: RouteOption;
  selectedRouteId?: string;
  onSelectRoute?: (routeId: string) => void;
  showHeatmap?: boolean;
  showHelpPoints?: boolean;
  showStreetlights?: boolean;
  showPublicGatherings?: boolean;
  showBarricades?: boolean;
  showMedicalCorridor?: boolean;
  interactive?: boolean;
  heightClass?: string;
  userProgress?: number; // 0 to 100 for navigation progression
  navMode?: boolean;
  onHelpPointClick?: (hp: EmergencyHelpPoint) => void;
  rerouteMode?: boolean; // for Screen 9 comparison
  routesToCompare?: RouteOption[]; // Multiple alternatives for Challenge 2
  lastStoppedLocation?: { x: number; y: number; label?: string } | null;
  luxLevel?: number; // Real-time environmental lux from Challenge 1 simulator
  lightingStatus?: 'optimal' | 'moderate' | 'failed' | 'dark_spot';
  disruptionLabel?: string;
  onExpandMap?: () => void;
  expandMapLabel?: string;
}

// Center of Connaught Place, Central Delhi (matches screenshot visual and coordinates)
const CP_LAT = 28.6315;
const CP_LNG = 77.2167;

// Converts normalized {x: 0..100, y: 0..100} route coordinates to realistic Delhi Lat/Lng
const toLatLng = (pt: { x: number; y: number }): [number, number] => {
  // y=0 is North, y=100 is South; x=0 is West, x=100 is East
  const lat = CP_LAT + (50 - pt.y) * 0.00032;
  const lng = CP_LNG + (pt.x - 50) * 0.00034;
  return [lat, lng];
};

export const MapEngine: React.FC<MapEngineProps> = ({
  activeRoute,
  selectedRouteId,
  onSelectRoute,
  showHeatmap = true,
  showHelpPoints = true,
  interactive = true,
  heightClass = 'h-full min-h-[380px]',
  userProgress = 25,
  navMode = false,
  onHelpPointClick,
  rerouteMode = false,
  routesToCompare,
  lastStoppedLocation,
  luxLevel = 96,
  lightingStatus = 'optimal',
  disruptionLabel,
  onExpandMap,
  expandMapLabel
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const [heatmapVisible, setHeatmapVisible] = useState<boolean>(showHeatmap);
  const [selectedHp, setSelectedHp] = useState<EmergencyHelpPoint | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Synchronize internal heatmap state with prop
  useEffect(() => {
    setHeatmapVisible(showHeatmap);
  }, [showHeatmap]);

  // Interpolated GPS position along active route
  const getGpsPosition = useCallback(() => {
    if (!activeRoute || !activeRoute.pathPoints || activeRoute.pathPoints.length < 2) {
      return { latLng: [CP_LAT, CP_LNG] as [number, number], angle: 45 };
    }
    const points = activeRoute.pathPoints;
    const totalSegments = points.length - 1;
    const clampedProgress = Math.max(0, Math.min(100, userProgress)) / 100;
    const rawIndex = clampedProgress * totalSegments;
    const segIndex = Math.min(Math.floor(rawIndex), totalSegments - 1);
    const segFraction = rawIndex - segIndex;

    const p1 = points[segIndex];
    const p2 = points[segIndex + 1];

    const currentX = p1.x + (p2.x - p1.x) * segFraction;
    const currentY = p1.y + (p2.y - p1.y) * segFraction;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    // Map screen angle to navigation compass angle
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    return {
      latLng: toLatLng({ x: currentX, y: currentY }),
      angle
    };
  }, [activeRoute, userProgress]);

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    const initialCenter: [number, number] = navMode 
      ? getGpsPosition().latLng 
      : [CP_LAT, CP_LNG];

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
    });

    // High quality OpenStreetMap standard tiles
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layersGroupRef.current = layerGroup;
    mapRef.current = map;

    // Handle container resize
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
      layersGroupRef.current = null;
    };
  }, [interactive]);

  // 2. Render all overlays (Routes, Heatmaps, Help Points, Hazard Markers, GPS Puck)
  useEffect(() => {
    const map = mapRef.current;
    const layerGroup = layersGroupRef.current;
    if (!map || !layerGroup) return;

    // Clear existing overlay layers
    layerGroup.clearLayers();

    // --- A. Heatmap Risk Zones ---
    if (heatmapVisible) {
      MOCK_HEATMAP_ZONES.forEach((zone) => {
        const center = toLatLng({ x: zone.x, y: zone.y });
        const radiusInMeters = zone.radius * 9.5; // realistic urban radius
        const isSafe = zone.riskLevel === 'safe';
        const isMedium = zone.riskLevel === 'medium';

        const color = isSafe ? '#10B981' : isMedium ? '#F59E0B' : '#EF4444';
        const fillOpacity = isSafe ? 0.16 : isMedium ? 0.22 : 0.28;

        const circle = L.circle(center, {
          radius: radiusInMeters,
          color,
          fillColor: color,
          fillOpacity,
          weight: 1.5,
          dashArray: isMedium ? '4 4' : undefined
        });

        circle.bindTooltip(`<b>${zone.label}</b><br/>Safety: ${zone.riskLevel.toUpperCase()}`, {
          direction: 'top',
          className: 'custom-map-tooltip'
        });

        circle.addTo(layerGroup);
      });
    }

    // --- B. Alternative Routes (Challenge 2 & Comparison) ---
    if (routesToCompare && routesToCompare.length > 0) {
      routesToCompare.forEach((r) => {
        const isSelected = (activeRoute?.id === r.id) || (selectedRouteId === r.id);
        if (isSelected) return; // Rendered below with active primary styling

        const latLngs = r.pathPoints.map(toLatLng);
        const polyline = L.polyline(latLngs, {
          color: r.color || '#6B7280',
          weight: 4.5,
          opacity: 0.65,
          dashArray: r.id === 'route_a' ? '6 6' : undefined,
          lineCap: 'round',
          lineJoin: 'round'
        });

        polyline.on('click', () => {
          onSelectRoute?.(r.id);
        });

        polyline.bindTooltip(`${r.name} (${r.safetyScore}%)`, {
          sticky: true,
          direction: 'top'
        });

        polyline.addTo(layerGroup);
      });
    }

    // Fallback reroute mode line (Screen 9)
    if (rerouteMode && !routesToCompare) {
      const fallbackPts = [
        { x: 15, y: 80 },
        { x: 25, y: 70 },
        { x: 30, y: 55 },
        { x: 45, y: 35 },
        { x: 88, y: 15 }
      ].map(toLatLng);

      L.polyline(fallbackPts, {
        color: '#EF4444',
        weight: 4,
        dashArray: '6 6',
        opacity: 0.75
      }).addTo(layerGroup);
    }

    // --- C. Active Navigation Route ---
    if (activeRoute && activeRoute.pathPoints && activeRoute.pathPoints.length > 0) {
      const latLngs = activeRoute.pathPoints.map(toLatLng);

      // Casing outline for crisp contrast
      L.polyline(latLngs, {
        color: isDark ? '#000000' : '#FFFFFF',
        weight: 9,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup);

      // Core route stroke
      const routeColor = activeRoute.color || (activeRoute.isRecommended ? '#10B981' : '#2563EB');
      L.polyline(latLngs, {
        color: routeColor,
        weight: 5.5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layerGroup);

      // Origin start dot
      const startPt = latLngs[0];
      const originIcon = L.divIcon({
        className: 'origin-marker',
        html: `
          <div style="width: 14px; height: 14px; border-radius: 50%; background-color: #10B981; border: 2.5px solid #FFFFFF; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>
        `,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });
      L.marker(startPt, { icon: originIcon }).addTo(layerGroup);

      // Destination Flag/Pin
      const endPt = latLngs[latLngs.length - 1];
      const isArrived = userProgress >= 100;
      const destIcon = L.divIcon({
        className: 'destination-marker',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translateY(-26px);">
            <div style="padding: 2px 6px; border-radius: 4px; background: ${isDark ? '#000000' : '#FFFFFF'}; border: 1px solid ${isArrived ? '#10B981' : '#EF4444'}; font-size: 9px; font-weight: 800; color: ${isArrived ? '#10B981' : (isDark ? '#FFFFFF' : '#111827')}; box-shadow: 0 2px 5px rgba(0,0,0,0.25); white-space: nowrap;">
              ${isArrived ? 'Arrived ✓' : 'Destination 🏁'}
            </div>
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${isArrived ? '#10B981' : '#EF4444'}; border: 2px solid #FFFFFF; margin-top: 2px;"></div>
          </div>
        `,
        iconSize: [80, 32],
        iconAnchor: [40, 32]
      });
      L.marker(endPt, { icon: destIcon }).addTo(layerGroup);

      // Stopped / Incident Origin Pin (when rerouting or stopped mid-route)
      if (lastStoppedLocation) {
        const stoppedPt = toLatLng(lastStoppedLocation);
        const stoppedIcon = L.divIcon({
          className: 'stopped-location-marker',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; transform: translateY(-28px); z-index: 100;">
              <div style="padding: 2.5px 7px; border-radius: 6px; background: #DC2626; color: #FFFFFF; font-size: 9px; font-weight: 900; box-shadow: 0 3px 8px rgba(220,38,38,0.45); white-space: nowrap; border: 1.5px solid #FFFFFF; display: flex; align-items: center; gap: 3px;">
                <span>📍</span>
                <span>${lastStoppedLocation.label || 'Stopped / Reroute Point'}</span>
              </div>
              <div style="position: relative; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; margin-top: 2px;">
                <div style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: rgba(220,38,38,0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="width: 12px; height: 12px; border-radius: 50%; background: #DC2626; border: 2.5px solid #FFFFFF; z-index: 2;"></div>
              </div>
            </div>
          `,
          iconSize: [120, 36],
          iconAnchor: [60, 36]
        });
        L.marker(stoppedPt, { icon: stoppedIcon, zIndexOffset: 500 }).addTo(layerGroup);
      }
    }

    // --- D. Verified Safe Havens / Help Points (POIs) ---
    if (showHelpPoints) {
      MOCK_HELP_POINTS.forEach((hp) => {
        const hpLatLng = toLatLng(hp.coords);
        const isPolice = hp.type === 'police';
        const isHosp = hp.type === 'hospital';
        const isMetro = hp.type === 'metro';

        const bgCol = isPolice ? '#2563EB' : isHosp ? '#EF4444' : isMetro ? '#D97706' : '#10B981';
        const iconChar = isPolice ? '🛡️' : isHosp ? '🏥' : isMetro ? '🚇' : '💊';

        const hpIcon = L.divIcon({
          className: 'poi-marker',
          html: `
            <div style="
              width: 24px; 
              height: 24px; 
              border-radius: 50%; 
              background: ${bgCol}; 
              border: 2px solid #FFFFFF; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 11px; 
              cursor: pointer;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              transition: transform 0.2s ease;
            ">
              ${iconChar}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(hpLatLng, { icon: hpIcon });
        marker.on('click', () => {
          setSelectedHp(hp);
          if (onHelpPointClick) onHelpPointClick(hp);
        });
        marker.addTo(layerGroup);
      });
    }

    // --- E. Environmental Dark Spot & Hazard Markers (Challenge 1 & 3) ---
    if (lightingStatus === 'failed' || lightingStatus === 'dark_spot') {
      const darkSpotCenter = toLatLng({ x: 52, y: 56 });
      const darkSpotIcon = L.divIcon({
        className: 'dark-spot-hazard',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(239,68,68,0.25); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 20px; height: 20px; border-radius: 50%; background: #EF4444; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; font-weight: bold; z-index: 2;">
              ⚡
            </div>
            <div style="margin-top: 3px; padding: 2px 6px; border-radius: 4px; background: rgba(0,0,0,0.85); color: #EF4444; font-size: 8px; font-weight: 800; border: 1px solid #EF4444; white-space: nowrap; z-index: 2;">
              DARK SPOT (${luxLevel} LUX)
            </div>
          </div>
        `,
        iconSize: [100, 40],
        iconAnchor: [0, 0]
      });
      L.marker(darkSpotCenter, { icon: darkSpotIcon }).addTo(layerGroup);
    }

    if (disruptionLabel) {
      const hazardCenter = toLatLng({ x: 62, y: 48 });
      const hazardIcon = L.divIcon({
        className: 'disruption-hazard',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%);">
            <div style="width: 22px; height: 22px; border-radius: 50%; background: #DC2626; border: 2px solid #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 11px; color: white;">
              ⚠️
            </div>
            <div style="margin-top: 2px; padding: 2px 6px; border-radius: 4px; background: rgba(0,0,0,0.88); color: #FCA5A5; font-size: 8px; font-weight: 800; border: 1px solid #DC2626; white-space: nowrap;">
              ${disruptionLabel}
            </div>
          </div>
        `,
        iconSize: [110, 40],
        iconAnchor: [0, 0]
      });
      L.marker(hazardCenter, { icon: hazardIcon }).addTo(layerGroup);
    }

    // --- F. GPS User Puck (matches screenshot: Blue glowing GPS dot + DELHI bold label) ---
    if (navMode) {
      const { latLng: gpsLatLng, angle: gpsAngle } = getGpsPosition();
      const navGpsIcon = L.divIcon({
        className: 'nav-gps-puck',
        html: `
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transform: translate(-18px, -18px);">
            <!-- Directional Navigation Cone -->
            <div style="
              position: absolute;
              top: -18px;
              left: 50%;
              transform: translateX(-50%) rotate(${gpsAngle}deg);
              width: 0;
              height: 0;
              border-left: 10px solid transparent;
              border-right: 10px solid transparent;
              border-bottom: 22px solid rgba(16, 185, 129, 0.45);
              transform-origin: bottom center;
            "></div>
            <!-- Pulsing Halo -->
            <div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(16, 185, 129, 0.3); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <!-- Solid High-Contrast Puck -->
            <div style="width: 18px; height: 18px; border-radius: 50%; background: #FFFFFF; border: 3px solid #10B981; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></div>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [0, 0]
      });

      L.marker(gpsLatLng, { icon: navGpsIcon }).addTo(layerGroup);

      // Pan to follow user in navMode smoothly
      map.panTo(gpsLatLng, { animate: true, duration: 0.5 });
    } else {
      // General / Dashboard Preview Mode: Exact blue dot & DELHI label from user's screenshot!
      const previewCenter: [number, number] = [CP_LAT, CP_LNG];
      const previewGpsIcon = L.divIcon({
        className: 'delhi-preview-puck',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%); pointer-events: none;">
            <!-- Prominent "DELHI" Typography Label as seen in screenshot -->
            <div style="
              font-size: 15px; 
              font-weight: 900; 
              letter-spacing: 1px; 
              color: ${isDark ? '#93C5FD' : '#2563EB'}; 
              text-shadow: 0 1px 3px ${isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)'}, 0 0 10px ${isDark ? 'rgba(37,99,235,0.4)' : 'rgba(255,255,255,0.9)'};
              margin-bottom: 2px;
            ">
              DELHI
            </div>
            
            <!-- Concentric Blue Pulsing Glow Dot -->
            <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
              <!-- Outer glowing pulse aura -->
              <div class="gps-pulse-aura" style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(37, 99, 235, 0.35);"></div>
              <div style="position: absolute; width: 20px; height: 20px; border-radius: 50%; background: rgba(59, 130, 246, 0.45);"></div>
              <!-- Inner solid blue core -->
              <div style="width: 12px; height: 12px; border-radius: 50%; background: #2563EB; border: 2.5px solid #FFFFFF; box-shadow: 0 2px 6px rgba(0,0,0,0.35); z-index: 2;"></div>
            </div>
          </div>
        `,
        iconSize: [80, 50],
        iconAnchor: [0, 0]
      });

      L.marker(previewCenter, { icon: previewGpsIcon }).addTo(layerGroup);
    }
  }, [
    activeRoute,
    selectedRouteId,
    routesToCompare,
    rerouteMode,
    heatmapVisible,
    showHelpPoints,
    userProgress,
    navMode,
    luxLevel,
    lightingStatus,
    disruptionLabel,
    isDark,
    getGpsPosition,
    onSelectRoute,
    onHelpPointClick
  ]);

  // Recenter map handler
  const handleRecenter = () => {
    if (!mapRef.current) return;
    if (navMode) {
      mapRef.current.setView(getGpsPosition().latLng, 16, { animate: true });
    } else {
      mapRef.current.setView([CP_LAT, CP_LNG], 15, { animate: true });
    }
  };

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  return (
    <div className={`relative w-full overflow-hidden select-none ${heightClass}`}>
      {/* 1. Underlying Leaflet Map Canvas */}
      <div 
        ref={containerRef} 
        className="w-full h-full z-0" 
      />

      {/* 2. Top-Left Badge: "Live Street Map · Sector 4" (as seen in user screenshot) */}
      <div className="absolute top-2.5 left-2.5 z-500 pointer-events-none">
        <div className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md border border-neutral-200/90 dark:border-neutral-800 text-[10px] font-extrabold text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>Live Street Map • Sector 4</span>
        </div>
      </div>

      {/* 3. Sleek Floating Zoom & Recenter Control Pill (Matches user screenshot right column) */}
      {interactive && !navMode && (
        <div className="absolute right-2.5 top-2.5 z-500 flex flex-col bg-white/95 dark:bg-black/95 backdrop-blur-md rounded-xl border border-neutral-200/90 dark:border-neutral-800 shadow-sm overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800">
          <button
            type="button"
            id="btn-map-zoom-in"
            aria-label="Zoom In"
            onClick={handleZoomIn}
            className="w-7 h-7.5 flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            title="Zoom In"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            id="btn-map-zoom-out"
            aria-label="Zoom Out"
            onClick={handleZoomOut}
            className="w-7 h-7.5 flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            id="btn-map-recenter"
            aria-label="Recenter Map"
            onClick={handleRecenter}
            className="w-7 h-7.5 flex items-center justify-center text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
            title="Recenter Map on Delhi"
          >
            <Navigation className="w-3 h-3 text-neutral-800 dark:text-neutral-200" />
          </button>

          <button
            type="button"
            id="btn-map-heatmap-toggle"
            aria-label="Toggle Heatmap"
            onClick={() => setHeatmapVisible(!heatmapVisible)}
            className={`w-7 h-7.5 flex items-center justify-center cursor-pointer transition-colors ${
              heatmapVisible ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Toggle Heatmap"
          >
            <Layers className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 4. Bottom-Left Speedometer & Real-time Lux Telemetry Pill */}
      {navMode && (
        <div className="absolute left-3 bottom-22 z-500 flex items-center gap-1.5 pointer-events-none">
          <div className="px-2.5 py-1 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm backdrop-blur-xs flex items-center gap-1.5">
            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
              {userProgress >= 100 ? '0.0' : '4.8'}
            </span>
            <span className="text-[9px] uppercase font-bold text-neutral-500">
              {userProgress >= 100 ? 'Arrived' : 'km/h'}
            </span>
          </div>

          <div className={`px-2 py-1 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border shadow-sm backdrop-blur-xs flex items-center gap-1 text-[10px] font-bold ${
            luxLevel < 40 
              ? 'border-red-400 text-red-600 dark:text-red-400' 
              : luxLevel < 70 
              ? 'border-amber-400 text-amber-600 dark:text-amber-400' 
              : 'border-neutral-200 dark:border-neutral-800 text-emerald-700 dark:text-emerald-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
              luxLevel < 40 ? 'bg-red-500' : luxLevel < 70 ? 'bg-amber-500' : 'bg-emerald-500'
            }`} />
            <span>{luxLevel} Lux</span>
          </div>
        </div>
      )}

      {/* 5. Bottom Right Expand Map Pill (if provided via onExpandMap) */}
      {onExpandMap && (
        <div className="absolute right-2.5 bottom-2.5 z-500">
          <button
            type="button"
            id="btn-expand-map"
            onClick={onExpandMap}
            className="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-black/95 border border-neutral-200 dark:border-neutral-800 text-[10px] font-extrabold text-neutral-800 dark:text-neutral-100 flex items-center gap-1 shadow-sm hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          >
            <span>{expandMapLabel || 'Ampliar Mapa'}</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* 6. Selected Help Point Details Popover */}
      {selectedHp && (
        <div className="absolute left-2.5 right-2.5 bottom-3 z-600 p-2.5 bg-white dark:bg-black text-black dark:text-white rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs ${
                selectedHp.type === 'police'
                  ? 'bg-blue-600'
                  : selectedHp.type === 'hospital'
                  ? 'bg-red-600'
                  : selectedHp.type === 'metro'
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
            >
              {selectedHp.type === 'police' && <Shield className="w-3.5 h-3.5" />}
              {selectedHp.type === 'hospital' && <Hospital className="w-3.5 h-3.5" />}
              {selectedHp.type === 'metro' && <Train className="w-3.5 h-3.5" />}
              {selectedHp.type === 'pharmacy' && <Building2 className="w-3.5 h-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-[11px] font-bold truncate">{selectedHp.name}</h4>
                {selectedHp.isOpen247 && (
                  <span className="px-1 py-0.2 rounded text-[7.5px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    24/7
                  </span>
                )}
              </div>
              <p className="text-[9px] text-neutral-500 dark:text-neutral-400 truncate">
                {selectedHp.distance} away • ETA {selectedHp.eta} walk
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <a
              href={`tel:${selectedHp.phone}`}
              className="px-2.5 py-1 rounded-md bg-black text-white dark:bg-white dark:text-black font-bold text-[10px] hover:opacity-90 transition-opacity"
            >
              Call
            </a>
            <button
              type="button"
              onClick={() => setSelectedHp(null)}
              className="p-1 rounded-md text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              aria-label="Close Help Point"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
