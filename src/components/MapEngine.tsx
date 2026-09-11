import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Navigation, 
  Layers, 
  Plus, 
  Minus, 
  Compass, 
  Building2, 
  Cross, 
  Train, 
  SunMedium, 
  AlertTriangle,
  Radio,
  CheckCircle2,
  X,
  LocateFixed,
  TreePine,
  Coffee,
  Hospital
} from 'lucide-react';
import { RouteOption, EmergencyHelpPoint } from '../types';
import { MOCK_HELP_POINTS, MOCK_HEATMAP_ZONES } from '../data/mockData';

interface MapEngineProps {
  activeRoute?: RouteOption;
  selectedRouteId?: string;
  onSelectRoute?: (routeId: string) => void;
  showHeatmap?: boolean;
  showHelpPoints?: boolean;
  showStreetlights?: boolean;
  interactive?: boolean;
  heightClass?: string;
  userProgress?: number; // 0 to 100 for navigation progression
  navMode?: boolean;
  onHelpPointClick?: (hp: EmergencyHelpPoint) => void;
  rerouteMode?: boolean; // for Screen 9 comparison
}

export const MapEngine: React.FC<MapEngineProps> = ({
  activeRoute,
  selectedRouteId = 'route_c',
  onSelectRoute,
  showHeatmap = true,
  showHelpPoints = true,
  showStreetlights = true,
  interactive = true,
  heightClass = 'h-full min-h-[380px]',
  userProgress = 25,
  navMode = false,
  onHelpPointClick,
  rerouteMode = false
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [heatmapVisible, setHeatmapVisible] = useState<boolean>(showHeatmap);
  const [selectedHp, setSelectedHp] = useState<EmergencyHelpPoint | null>(null);

  // Compute interpolated GPS position along active route
  const getGpsPosition = () => {
    if (!activeRoute || !activeRoute.pathPoints || activeRoute.pathPoints.length < 2) {
      return { x: 18, y: 80, angle: 45 };
    }
    const points = activeRoute.pathPoints;
    const totalSegments = points.length - 1;
    const clampedProgress = Math.max(0, Math.min(100, userProgress)) / 100;
    const rawIndex = clampedProgress * totalSegments;
    const segIndex = Math.min(Math.floor(rawIndex), totalSegments - 1);
    const segFraction = rawIndex - segIndex;

    const p1 = points[segIndex];
    const p2 = points[segIndex + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    return {
      x: p1.x + dx * segFraction,
      y: p1.y + dy * segFraction,
      angle
    };
  };

  const currentGps = getGpsPosition();

  // Helper for SVG polyline points string
  const pointsToSvgPath = (pts: { x: number; y: number }[]) => {
    if (!pts.length) return '';
    return pts.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x * 5} ${pt.y * 5}` : `${acc} L ${pt.x * 5} ${pt.y * 5}`;
    }, '');
  };

  return (
    <div className={`relative w-full overflow-hidden bg-[#E8ECEF] select-none ${heightClass}`}>
      {/* SVG Vector Map Canvas with Google Maps Aesthetic */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full object-cover transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoom})` }}
      >
        <defs>
          {/* Google Maps Building Blocks Pattern */}
          <pattern id="gmap-buildings" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect width="20" height="18" x="4" y="4" rx="2" fill="#E1E5E9" />
            <rect width="18" height="16" x="28" y="4" rx="2" fill="#DEE2E6" />
            <rect width="16" height="20" x="4" y="26" rx="2" fill="#DEE2E6" />
            <rect width="20" height="16" x="24" y="28" rx="2" fill="#E1E5E9" />
          </pattern>

          {/* Google Maps Park Gradient */}
          <linearGradient id="gmap-park" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C8E6C9" />
            <stop offset="100%" stopColor="#A5D6A7" />
          </linearGradient>

          {/* Google Maps Waterway */}
          <linearGradient id="gmap-water" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#AADAFF" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>

          {/* Google Maps Royal Blue Navigation Route */}
          <linearGradient id="gmap-nav-blue" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#1A73E8" />
            <stop offset="100%" stopColor="#4285F4" />
          </linearGradient>

          {/* Safe Corridor Emerald Line */}
          <linearGradient id="gmap-safe-corridor" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#0F9D58" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#1A73E8" />
          </linearGradient>

          {/* Heatmaps */}
          <radialGradient id="heat-safe" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0F9D58" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#34A853" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#34A853" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat-caution" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FBBC04" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#FBBC04" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#FBBC04" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat-danger" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EA4335" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#EA4335" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#EA4335" stopOpacity="0" />
          </radialGradient>

          {/* Navigation Cone Gradient */}
          <linearGradient id="nav-cone-beam" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#4285F4" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#4285F4" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Base Map Canvas / Land */}
        <rect width="500" height="500" fill="#F0F3F6" />
        <rect width="500" height="500" fill="url(#gmap-buildings)" />

        {/* Google Maps Style River / Water Body */}
        <path
          d="M -10 320 C 120 310, 210 360, 310 340 C 410 320, 480 370, 520 360 L 520 415 C 480 425, 410 375, 310 395 C 210 415, 120 365, -10 375 Z"
          fill="url(#gmap-water)"
        />

        {/* River Label */}
        <text x="360" y="360" fill="#1A73E8" fontSize="8" fontWeight="600" letterSpacing="0.8" opacity="0.8">
          RIVER HARBOR CANAL
        </text>

        {/* Google Maps Parks & Greenery */}
        <rect x="230" y="35" width="85" height="75" rx="10" fill="url(#gmap-park)" />
        <text x="272" y="75" textAnchor="middle" fill="#2E7D32" fontSize="9" fontWeight="700">
          🌲 Memorial Park
        </text>

        <rect x="25" y="185" width="70" height="95" rx="10" fill="url(#gmap-park)" />
        <text x="60" y="235" textAnchor="middle" fill="#2E7D32" fontSize="8" fontWeight="700">
          🌳 City Botanical
        </text>

        {/* Minor City Streets (Google Maps Clean Light Gray Casing + White Fill) */}
        <g stroke="#D1D5DB" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <line x1="20" y1="70" x2="480" y2="70" />
          <line x1="20" y1="160" x2="480" y2="160" />
          <line x1="20" y1="260" x2="480" y2="260" />
          <line x1="20" y1="410" x2="480" y2="410" />

          <line x1="80" y1="20" x2="80" y2="480" />
          <line x1="180" y1="20" x2="180" y2="480" />
          <line x1="290" y1="20" x2="290" y2="480" />
          <line x1="410" y1="20" x2="410" y2="480" />
        </g>
        <g stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
          <line x1="20" y1="70" x2="480" y2="70" />
          <line x1="20" y1="160" x2="480" y2="160" />
          <line x1="20" y1="260" x2="480" y2="260" />
          <line x1="20" y1="410" x2="480" y2="410" />

          <line x1="80" y1="20" x2="80" y2="480" />
          <line x1="180" y1="20" x2="180" y2="480" />
          <line x1="290" y1="20" x2="290" y2="480" />
          <line x1="410" y1="20" x2="410" y2="480" />
        </g>

        {/* Major Arterial Highway / Safe Corridor (Google Maps Yellow / Gold Highway Style) */}
        <path
          d="M 50 430 L 170 380 L 260 290 L 370 190 L 450 70"
          stroke="#FCD34D"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 50 430 L 170 380 L 260 290 L 370 190 L 450 70"
          stroke="#FEF08A"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Clean Street Name Badges (Google Maps Style) */}
        <rect x="235" y="55" width="90" height="14" rx="3" fill="#FFFFFF" opacity="0.9" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))" />
        <text x="280" y="65" textAnchor="middle" fill="#3C4043" fontSize="8" fontWeight="700">
          Grand Blvd
        </text>

        <rect x="180" y="248" width="105" height="14" rx="3" fill="#FFFFFF" opacity="0.9" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.1))" />
        <text x="232" y="258" textAnchor="middle" fill="#3C4043" fontSize="8" fontWeight="700">
          Central Ave (Lit Corridor)
        </text>

        {/* Streetlight Nodes */}
        {showStreetlights && (
          <g opacity="0.85">
            {[
              { x: 90, y: 410 },
              { x: 130, y: 395 },
              { x: 170, y: 380 },
              { x: 215, y: 335 },
              { x: 260, y: 290 },
              { x: 315, y: 240 },
              { x: 370, y: 190 },
              { x: 410, y: 130 },
              { x: 440, y: 80 }
            ].map((st, i) => (
              <g key={`st-${i}`}>
                <circle cx={st.x} cy={st.y} r="7" fill="#FEF08A" opacity="0.45" />
                <circle cx={st.x} cy={st.y} r="2.5" fill="#D97706" />
              </g>
            ))}
          </g>
        )}

        {/* Heatmap Zones Overlay */}
        {heatmapVisible && (
          <g className="transition-opacity duration-300">
            {MOCK_HEATMAP_ZONES.map((zone, idx) => {
              const gradId =
                zone.riskLevel === 'safe'
                  ? 'url(#heat-safe)'
                  : zone.riskLevel === 'medium'
                  ? 'url(#heat-caution)'
                  : 'url(#heat-danger)';
              return (
                <g key={`zone-${idx}`}>
                  <circle
                    cx={zone.x * 5}
                    cy={zone.y * 5}
                    r={zone.radius * 3.2}
                    fill={gradId}
                  />
                  {zone.riskLevel === 'high' && (
                    <g transform={`translate(${zone.x * 5 - 12}, ${zone.y * 5 - 12})`}>
                      <circle cx="12" cy="12" r="12" fill="#EA4335" opacity="0.2" className="animate-ping" />
                      <circle cx="12" cy="12" r="8" fill="#EA4335" />
                      <path d="M12 8v4m0 2h.01" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        )}

        {/* Old Reroute Path (Screen 9) */}
        {rerouteMode && (
          <path
            d="M 75 400 L 125 350 L 150 275 L 225 175 L 440 75"
            stroke="#EA4335"
            strokeWidth="5"
            strokeDasharray="6 4"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        )}

        {/* Active Route Line (Google Maps Route Blue & Chevrons) */}
        {activeRoute && activeRoute.pathPoints && (
          <g>
            {/* White route border */}
            <path
              d={pointsToSvgPath(activeRoute.pathPoints)}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            />
            {/* Main navigation route line */}
            <path
              d={pointsToSvgPath(activeRoute.pathPoints)}
              fill="none"
              stroke={activeRoute.isRecommended ? 'url(#gmap-safe-corridor)' : 'url(#gmap-nav-blue)'}
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Google Maps style Directional Chevron Dots (>>>) */}
            <path
              d={pointsToSvgPath(activeRoute.pathPoints)}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="6 18"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
        )}

        {/* Google Maps Origin Pin */}
        <g transform="translate(75, 400)">
          <circle cx="0" cy="0" r="10" fill="#1A73E8" opacity="0.2" className="animate-ping" />
          <circle cx="0" cy="0" r="6.5" fill="#1A73E8" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="12" y="-10" width="85" height="16" rx="4" fill="#FFFFFF" opacity="0.95" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.15))" />
          <text x="17" y="1" fill="#1A73E8" fontSize="8" fontWeight="800">
            📍 Current Location
          </text>
        </g>

        {/* Google Maps Classic Red Destination Pin */}
        <g transform="translate(440, 75)">
          <circle cx="0" cy="0" r="16" fill="#EA4335" opacity="0.2" />
          {/* Red Teardrop Marker */}
          <path
            d="M 0 0 C -7 -10, -9 -16, -9 -20 C -9 -26, -5 -30, 0 -30 C 5 -30, 9 -26, 9 -20 C 9 -16, 7 -10, 0 0 Z"
            fill="#EA4335"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
          />
          <circle cx="0" cy="-20" r="4" fill="#FFFFFF" />
          <rect x="-85" y="-48" width="105" height="16" rx="4" fill="#202124" opacity="0.95" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))" />
          <text x="-32" y="-37" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="700">
            Westwood Residence 🏁
          </text>
        </g>

        {/* Google Maps Style POI Icons (Help Points) */}
        {showHelpPoints &&
          MOCK_HELP_POINTS.map((hp) => {
            const px = hp.coords.x * 5;
            const py = hp.coords.y * 5;
            const isPolice = hp.type === 'police';
            const isHosp = hp.type === 'hospital';
            const isMetro = hp.type === 'metro';

            const bgCol = isPolice ? '#1A73E8' : isHosp ? '#EA4335' : isMetro ? '#E37400' : '#34A853';

            return (
              <g
                key={hp.id}
                transform={`translate(${px}, ${py})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => {
                  setSelectedHp(hp);
                  if (onHelpPointClick) onHelpPointClick(hp);
                }}
              >
                <circle cx="0" cy="0" r="12" fill="#FFFFFF" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.18))" />
                <circle cx="0" cy="0" r="10" fill={bgCol} />
                {isPolice && (
                  <path d="M-3 -3 L0 -5 L3 -3 L3 2 C3 3.5 0 5 0 5 C0 5 -3 3.5 -3 2 Z" fill="#FFFFFF" />
                )}
                {isHosp && (
                  <path d="M-1.5 -4 h3 v2.5 h2.5 v3 h-2.5 v2.5 h-3 v-2.5 h-2.5 v-3 h2.5 Z" fill="#FFFFFF" />
                )}
                {isMetro && (
                  <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                )}
                {!isPolice && !isHosp && !isMetro && (
                  <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                )}
              </g>
            );
          })}

        {/* Google Maps GPS Navigation Puck with Heading Beam */}
        {navMode && (
          <g transform={`translate(${currentGps.x * 5}, ${currentGps.y * 5})`}>
            {/* GPS Dynamic Beam Cone */}
            <path
              d="M 0 0 L -30 -75 A 75 75 0 0 1 30 -75 Z"
              fill="url(#nav-cone-beam)"
              transform={`rotate(${currentGps.angle})`}
            />

            {/* GPS Pulse Ring */}
            <circle cx="0" cy="0" r="20" fill="#4285F4" opacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="14" fill="#4285F4" opacity="0.25" />
            
            {/* 3D Navigation Arrow Puck */}
            <circle cx="0" cy="0" r="10" fill="#FFFFFF" filter="drop-shadow(0 3px 6px rgba(0,0,0,0.3))" />
            <circle cx="0" cy="0" r="7" fill="#1A73E8" />
            
            {/* Arrow Tip */}
            <path
              d="M 0 -8 L 4 2 L 0 0 L -4 2 Z"
              fill="#FFFFFF"
              transform={`rotate(${currentGps.angle})`}
            />
          </g>
        )}
      </svg>

      {/* Google Maps Floating Controls (Right Side) */}
      <div className="absolute right-3 top-3.5 flex flex-col gap-2 z-10">
        {/* Google Maps 3D Compass */}
        <button
          id="btn-map-compass"
          aria-label="Map Compass"
          onClick={() => setZoom(1)}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 active:scale-95 transition-all hover:bg-slate-50"
          title="Reset Map Orientation"
        >
          <Compass className="w-5 h-5 text-rose-500" />
        </button>

        {/* Google Maps Re-Center Button */}
        <button
          id="btn-map-recenter"
          aria-label="Re-Center Location"
          onClick={() => setZoom(1)}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-blue-600 active:scale-95 transition-all hover:bg-slate-50"
          title="Re-Center on My GPS Location"
        >
          <LocateFixed className="w-5 h-5 text-blue-600" />
        </button>

        {/* Heatmap & Safety Layers FAB */}
        <button
          id="btn-toggle-heatmap"
          aria-label="Toggle Heatmap"
          onClick={() => setHeatmapVisible(!heatmapVisible)}
          className={`w-10 h-10 rounded-full shadow-md border flex items-center justify-center transition-all ${
            heatmapVisible
              ? 'bg-[#188038] text-white border-[#137333] shadow-emerald-300/40'
              : 'bg-white text-slate-700 border-slate-200/80'
          }`}
          title="Toggle Google Maps Safety Heatmap"
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Zoom In */}
        <button
          id="btn-zoom-in"
          aria-label="Zoom In"
          onClick={() => setZoom((z) => Math.min(z + 0.2, 1.8))}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 active:scale-95 transition-all hover:bg-slate-50"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Zoom Out */}
        <button
          id="btn-zoom-out"
          aria-label="Zoom Out"
          onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-200/80 flex items-center justify-center text-slate-700 active:scale-95 transition-all hover:bg-slate-50"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>

      {/* Google Maps Floating Speedometer & Lux Badge (Bottom Left) */}
      <div className="absolute left-3 bottom-3 z-10 flex flex-col gap-1.5">
        <div className="px-3 py-1.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
            4.8
          </div>
          <div>
            <div className="text-[9px] uppercase font-bold text-slate-400">km/h</div>
            <div className="text-[10px] font-bold text-slate-700">Walk Pace</div>
          </div>
        </div>

        {/* Safety Lux Gauge */}
        <div className="px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm flex items-center gap-1.5 text-[10px] font-bold text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>98 Lux • High Light</span>
        </div>
      </div>

      {/* Help Point Selected Card Popover */}
      {selectedHp && (
        <div className="absolute left-3 right-3 bottom-14 z-20 p-3.5 bg-white rounded-2xl shadow-2xl border border-slate-200 flex items-center justify-between animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${
                selectedHp.type === 'police'
                  ? 'bg-[#1A73E8]'
                  : selectedHp.type === 'hospital'
                  ? 'bg-[#EA4335]'
                  : selectedHp.type === 'metro'
                  ? 'bg-[#E37400]'
                  : 'bg-[#34A853]'
              }`}
            >
              {selectedHp.type === 'police' && <Shield className="w-5 h-5" />}
              {selectedHp.type === 'hospital' && <Hospital className="w-5 h-5" />}
              {selectedHp.type === 'metro' && <Train className="w-5 h-5" />}
              {selectedHp.type === 'pharmacy' && <Building2 className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900">{selectedHp.name}</h4>
                {selectedHp.isOpen247 && (
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    24/7 OPEN
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {selectedHp.distance} away • ETA {selectedHp.eta} walk
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <a
              href={`tel:${selectedHp.phone}`}
              className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#1A73E8] font-bold text-xs border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              Call
            </a>
            <button
              onClick={() => setSelectedHp(null)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
