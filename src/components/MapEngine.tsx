import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  Shield, 
  Layers, 
  Plus, 
  Minus, 
  Compass, 
  Building2, 
  Train, 
  X,
  LocateFixed,
  Hospital
} from 'lucide-react';
import { RouteOption, EmergencyHelpPoint } from '../types';
import { MOCK_HELP_POINTS, MOCK_HEATMAP_ZONES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

interface MapEngineProps {
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
}

export const MapEngine: React.FC<MapEngineProps> = ({
  activeRoute,
  showHeatmap = true,
  showHelpPoints = true,
  showStreetlights = true,
  showPublicGatherings = false,
  showBarricades = false,
  showMedicalCorridor = false,
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
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Synchronize internal heatmap state when prop changes
  React.useEffect(() => {
    setHeatmapVisible(showHeatmap);
  }, [showHeatmap]);

  // Authentic cartographic palette for pure Light and Dark modes
  const colors = {
    canvas: isDark ? '#0C0E12' : '#EEF2F6',
    block: isDark ? '#141820' : '#E2E7ED',
    blockStroke: isDark ? '#1D222E' : '#D6DCE4',
    water: isDark ? '#0F2038' : '#CBE0FA',
    waterStroke: isDark ? '#162F52' : '#B5D3F8',
    park: isDark ? '#11261B' : '#D2EBD5',
    parkStroke: isDark ? '#183827' : '#BEE2C3',
    roadMinorCasing: isDark ? '#1E232F' : '#D5DCE4',
    roadMinorFill: isDark ? '#262D3B' : '#FFFFFF',
    roadMajorCasing: isDark ? '#2E3647' : '#BAC6D3',
    roadMajorFill: isDark ? '#3A4458' : '#FFFFFF',
    bridgeDeck: isDark ? '#313A4D' : '#CFD8E3',
    bridgeParapet: isDark ? '#4A556B' : '#94A3B8',
    textPrimary: isDark ? '#FFFFFF' : '#111827',
    textMuted: isDark ? '#9CA3AF' : '#6B7280',
    badgeBg: isDark ? 'rgba(0, 0, 0, 0.92)' : 'rgba(255, 255, 255, 0.96)',
    badgeBorder: isDark ? '#27272A' : '#E5E7EB'
  };

  // Interpolated GPS position along active route
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
    <div className={`relative w-full overflow-hidden select-none transition-colors ${heightClass}`} style={{ backgroundColor: colors.canvas }}>
      {/* SVG Vector Map Canvas */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full object-cover transition-transform duration-300 ease-out"
        style={{ transform: `scale(${zoom})` }}
      >
        <defs>
          {/* Heatmaps */}
          <radialGradient id="heat-safe" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#10B981" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat-caution" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
            <stop offset="80%" stopColor="#F59E0B" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="heat-danger" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#EF4444" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </radialGradient>

          {/* Navigation Beam Cone */}
          <linearGradient id="nav-beam-cone" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* 1. Base Land Canvas */}
        <rect width="500" height="500" fill={colors.canvas} />

        {/* 2. City Blocks / Parcels (Subtle, realistic urban density) */}
        <g fill={colors.block} stroke={colors.blockStroke} strokeWidth="1">
          {/* Northwest Sector */}
          <rect x="25" y="25" width="45" height="35" rx="3" />
          <rect x="90" y="25" width="55" height="35" rx="3" />
          <rect x="25" y="80" width="45" height="30" rx="3" />
          <rect x="90" y="80" width="55" height="30" rx="3" />
          
          {/* Central-North Sector */}
          <rect x="175" y="25" width="25" height="35" rx="3" />
          <rect x="175" y="80" width="25" height="30" rx="3" />
          <rect x="315" y="25" width="60" height="35" rx="3" />
          <rect x="390" y="25" width="85" height="35" rx="3" />
          <rect x="315" y="80" width="60" height="30" rx="3" />

          {/* Mid City Core (Between Northway y=120 and Central Ave y=250) */}
          <rect x="25" y="130" width="45" height="40" rx="3" />
          <rect x="90" y="130" width="55" height="40" rx="3" />
          <rect x="175" y="130" width="60" height="40" rx="3" />
          <rect x="250" y="130" width="75" height="40" rx="3" />
          <rect x="345" y="130" width="60" height="40" rx="3" />
          <rect x="420" y="130" width="55" height="40" rx="3" />

          <rect x="115" y="190" width="30" height="45" rx="3" />
          <rect x="160" y="190" width="75" height="45" rx="3" />
          <rect x="250" y="190" width="75" height="45" rx="3" />
          <rect x="345" y="190" width="60" height="45" rx="3" />
          <rect x="420" y="190" width="55" height="45" rx="3" />

          {/* South Corridor (Above Canal) */}
          <rect x="25" y="260" width="45" height="45" rx="3" />
          <rect x="90" y="260" width="55" height="45" rx="3" />
          <rect x="160" y="260" width="75" height="45" rx="3" />
          <rect x="250" y="260" width="75" height="45" rx="3" />
          <rect x="345" y="260" width="60" height="45" rx="3" />
          <rect x="420" y="260" width="55" height="45" rx="3" />

          {/* South District (Below Canal y=380) */}
          <rect x="25" y="420" width="55" height="55" rx="3" />
          <rect x="95" y="420" width="50" height="55" rx="3" />
          <rect x="160" y="420" width="75" height="55" rx="3" />
          <rect x="250" y="420" width="75" height="55" rx="3" />
          <rect x="345" y="420" width="45" height="55" rx="3" />
          <rect x="405" y="420" width="70" height="55" rx="3" />
        </g>

        {/* 3. Waterway (Canal with natural curve) */}
        <path
          d="M -10 340 Q 120 330, 240 350 T 510 340 L 510 380 Q 370 390, 240 380 T -10 375 Z"
          fill={colors.water}
          stroke={colors.waterStroke}
          strokeWidth="1.5"
        />

        {/* Waterway Label */}
        <text
          x="420"
          y="363"
          textAnchor="middle"
          fill={isDark ? '#4B7AB8' : '#2563EB'}
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="0.8"
          opacity="0.85"
        >
          HARBOR CANAL
        </text>

        {/* 4. Parks & Public Greens */}
        {/* West Botanical Reserve */}
        <rect x="25" y="185" width="75" height="55" rx="8" fill={colors.park} stroke={colors.parkStroke} strokeWidth="1" />
        <text x="62" y="215" textAnchor="middle" fill={isDark ? '#4ADE80' : '#166534'} fontSize="7.5" fontWeight="700">
          🌿 City Botanical
        </text>

        {/* North Heritage Memorial Park */}
        <rect x="215" y="25" width="85" height="75" rx="8" fill={colors.park} stroke={colors.parkStroke} strokeWidth="1" />
        <text x="257" y="65" textAnchor="middle" fill={isDark ? '#4ADE80' : '#166534'} fontSize="8" fontWeight="700">
          🌲 Memorial Park
        </text>

        {/* 5. Road Network Hierarchy */}
        {/* Secondary Connector Streets (Underlay) */}
        <g stroke={colors.roadMinorCasing} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <line x1="20" y1="70" x2="480" y2="70" />
          <line x1="20" y1="180" x2="480" y2="180" />
          <line x1="20" y1="315" x2="480" y2="315" />
          <line x1="20" y1="415" x2="480" y2="415" />

          <line x1="80" y1="20" x2="80" y2="335" />
          <line x1="80" y1="380" x2="80" y2="480" />
          <line x1="150" y1="20" x2="150" y2="335" />
          <line x1="150" y1="380" x2="150" y2="480" />
          <line x1="410" y1="20" x2="410" y2="335" />
          <line x1="410" y1="380" x2="410" y2="480" />
        </g>
        <g stroke={colors.roadMinorFill} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="20" y1="70" x2="480" y2="70" />
          <line x1="20" y1="180" x2="480" y2="180" />
          <line x1="20" y1="315" x2="480" y2="315" />
          <line x1="20" y1="415" x2="480" y2="415" />

          <line x1="80" y1="20" x2="80" y2="335" />
          <line x1="80" y1="380" x2="80" y2="480" />
          <line x1="150" y1="20" x2="150" y2="335" />
          <line x1="150" y1="380" x2="150" y2="480" />
          <line x1="410" y1="20" x2="410" y2="335" />
          <line x1="410" y1="380" x2="410" y2="480" />
        </g>

        {/* Primary Arterial Avenues (Avenue & Highway Grid) */}
        {/* Casing */}
        <g stroke={colors.roadMajorCasing} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          {/* Northway Arterial */}
          <line x1="20" y1="120" x2="480" y2="120" />
          {/* Central Commercial Avenue */}
          <line x1="20" y1="250" x2="480" y2="250" />
          {/* Radial Crossway */}
          <line x1="240" y1="20" x2="240" y2="480" />
          {/* Metro Boulevard */}
          <line x1="335" y1="20" x2="335" y2="480" />
          {/* Grand Boulevard (Diagonal Corridor) */}
          <path d="M 60 450 L 160 380 L 240 310 L 335 220 L 450 75" />
        </g>
        {/* Fill */}
        <g stroke={colors.roadMajorFill} strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="20" y1="120" x2="480" y2="120" />
          <line x1="20" y1="250" x2="480" y2="250" />
          <line x1="240" y1="20" x2="240" y2="480" />
          <line x1="335" y1="20" x2="335" y2="480" />
          <path d="M 60 450 L 160 380 L 240 310 L 335 220 L 450 75" />
        </g>

        {/* Bridges Across Canal (Realistic bridge decks sitting above water) */}
        <g fill={colors.bridgeDeck} stroke={colors.bridgeParapet} strokeWidth="1">
          {/* Grand Blvd Bridge */}
          <rect x="180" y="340" width="22" height="42" rx="2" transform="rotate(-35 191 361)" />
          {/* Radial Crossway Bridge */}
          <rect x="233" y="340" width="14" height="42" rx="1.5" />
          {/* Metro Way Bridge */}
          <rect x="328" y="340" width="14" height="42" rx="1.5" />
        </g>

        {/* Street Name Labels (High contrast, restrained placement) */}
        <g opacity="0.9">
          <rect x="175" y="242" width="70" height="13" rx="3" fill={colors.badgeBg} stroke={colors.badgeBorder} strokeWidth="0.8" />
          <text x="210" y="251.5" textAnchor="middle" fill={colors.textPrimary} fontSize="7.5" fontWeight="700">
            Central Ave
          </text>

          <rect x="260" y="295" width="72" height="13" rx="3" fill={colors.badgeBg} stroke={colors.badgeBorder} strokeWidth="0.8" />
          <text x="296" y="304.5" textAnchor="middle" fill={colors.textPrimary} fontSize="7.5" fontWeight="700">
            Grand Blvd
          </text>
        </g>

        {/* 6. Streetlight Nodes along the Lit Corridor */}
        {showStreetlights && (
          <g opacity="0.9">
            {[
              { x: 75, y: 400 },
              { x: 110, y: 390 },
              { x: 160, y: 380 },
              { x: 200, y: 345 },
              { x: 240, y: 310 },
              { x: 290, y: 265 },
              { x: 335, y: 220 },
              { x: 385, y: 155 },
              { x: 425, y: 105 }
            ].map((st, i) => (
              <g key={`st-${i}`}>
                <circle cx={st.x} cy={st.y} r="6" fill="#FEF08A" opacity={isDark ? "0.35" : "0.5"} />
                <circle cx={st.x} cy={st.y} r="2" fill="#D97706" />
              </g>
            ))}
          </g>
        )}

        {/* 7. Heatmap Risk Zones Overlay */}
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
                <circle
                  key={`zone-${idx}`}
                  cx={zone.x * 5}
                  cy={zone.y * 5}
                  r={zone.radius * 3.2}
                  fill={gradId}
                />
              );
            })}
          </g>
        )}

        {/* 8. Reroute Previous Path (Screen 9 Comparison Mode only) */}
        {rerouteMode && (
          <path
            d="M 75 400 L 125 350 L 150 275 L 225 175 L 440 75"
            stroke="#EF4444"
            strokeWidth="4"
            strokeDasharray="6 4"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
        )}

        {/* 9. Active Selected Navigation Route */}
        {activeRoute && activeRoute.pathPoints && (
          <g key={activeRoute.id}>
            {/* High-contrast outline casing */}
            <motion.path
              d={pointsToSvgPath(activeRoute.pathPoints)}
              fill="none"
              stroke={isDark ? '#000000' : '#FFFFFF'}
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
              initial={shouldReduceMotion ? false : { pathLength: 0.2, opacity: 0.6 }}
              animate={shouldReduceMotion ? false : { pathLength: 1, opacity: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Core navigation route line (Emerald for verified safe) */}
            <motion.path
              d={pointsToSvgPath(activeRoute.pathPoints)}
              fill="none"
              stroke={activeRoute.isRecommended ? '#10B981' : (isDark ? '#FFFFFF' : '#111827')}
              strokeWidth="6.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={shouldReduceMotion ? false : { pathLength: 0.2, opacity: 0.7 }}
              animate={shouldReduceMotion ? false : { pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Directional Dash Chevrons */}
            <path
              d={pointsToSvgPath(activeRoute.pathPoints)}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeDasharray="5 18"
              strokeLinecap="round"
              opacity="0.95"
            />
          </g>
        )}

        {/* 10. Origin Start Point */}
        <g transform="translate(75, 400)">
          <circle cx="0" cy="0" r="10" fill="#10B981" opacity="0.2" className="animate-pulse" />
          <circle cx="0" cy="0" r="5.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
        </g>

        {/* 11. Destination Pin */}
        <g transform="translate(440, 75)">
          <circle cx="0" cy="0" r="12" fill={userProgress >= 100 ? '#10B981' : '#EF4444'} opacity={userProgress >= 100 ? 0.35 : 0.2} />
          <path
            d="M 0 0 C -6 -8, -8 -13, -8 -17 C -8 -22, -4 -26, 0 -26 C 4 -26, 8 -22, 8 -17 C 8 -13, 6 -8, 0 0 Z"
            fill={userProgress >= 100 ? '#10B981' : '#EF4444'}
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"
          />
          <circle cx="0" cy="-17" r="3.5" fill="#FFFFFF" />
          <g transform="translate(-52, -44)">
            <rect width="104" height="15" rx="3.5" fill={colors.badgeBg} stroke={userProgress >= 100 ? '#10B981' : colors.badgeBorder} strokeWidth="1" />
            <text x="52" y="10.5" textAnchor="middle" fill={userProgress >= 100 ? '#10B981' : colors.textPrimary} fontSize="8" fontWeight="800">
              {userProgress >= 100 ? 'Westwood Res. ✓ Arrived' : 'Westwood Res. 🏁'}
            </text>
          </g>
        </g>

        {/* 12. Verified Help Points (POIs) */}
        {showHelpPoints &&
          MOCK_HELP_POINTS.map((hp) => {
            const px = hp.coords.x * 5;
            const py = hp.coords.y * 5;
            const isPolice = hp.type === 'police';
            const isHosp = hp.type === 'hospital';
            const isMetro = hp.type === 'metro';

            const bgCol = isPolice ? '#1A73E8' : isHosp ? '#EF4444' : isMetro ? '#E37400' : '#10B981';

            return (
              <g
                key={hp.id}
                transform={`translate(${px}, ${py})`}
                className="cursor-pointer transition-transform hover:scale-115"
                onClick={() => {
                  setSelectedHp(hp);
                  if (onHelpPointClick) onHelpPointClick(hp);
                }}
              >
                <circle cx="0" cy="0" r="10" fill={colors.badgeBg} stroke={colors.badgeBorder} strokeWidth="1" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.15))" />
                <circle cx="0" cy="0" r="8" fill={bgCol} />
                {isPolice && (
                  <path d="M-2.5 -2.5 L0 -4 L2.5 -2.5 L2.5 1.5 C2.5 2.5 0 4 0 4 C0 4 -2.5 2.5 -2.5 1.5 Z" fill="#FFFFFF" />
                )}
                {isHosp && (
                  <path d="M-1.5 -3.5 h3 v2 h2 v3 h-2 v2 h-3 v-2 h-2 v-3 h2 Z" fill="#FFFFFF" />
                )}
                {isMetro && (
                  <circle cx="0" cy="0" r="2.8" fill="#FFFFFF" />
                )}
                {!isPolice && !isHosp && !isMetro && (
                  <circle cx="0" cy="0" r="2.8" fill="#FFFFFF" />
                )}
              </g>
            );
          })}

        {/* 13. GPS Navigation Puck with Dynamic Heading Beam */}
        {navMode && (
          <g transform={`translate(${currentGps.x * 5}, ${currentGps.y * 5})`}>
            {/* Dynamic Direction Beam (only when moving) */}
            {userProgress < 100 && (
              <path
                d="M 0 0 L -25 -65 A 65 65 0 0 1 25 -65 Z"
                fill="url(#nav-beam-cone)"
                transform={`rotate(${currentGps.angle})`}
              />
            )}

            {/* GPS Pulse Ring */}
            <circle cx="0" cy="0" r="18" fill="#10B981" opacity="0.2" className="animate-ping" />
            <circle cx="0" cy="0" r="12" fill="#10B981" opacity="0.25" />
            
            {/* High-Contrast Navigation Puck */}
            <circle cx="0" cy="0" r="9" fill="#FFFFFF" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.35))" />
            <circle cx="0" cy="0" r="7" fill="#10B981" />
            
            {/* Directional Arrow Tip */}
            <path
              d="M 0 -7 L 3.5 1.5 L 0 0 L -3.5 1.5 Z"
              fill="#FFFFFF"
              transform={`rotate(${currentGps.angle})`}
            />
          </g>
        )}
      </svg>

      {/* Floating Controls for General / Preview Mode only (Suppressed in navMode to avoid collision with nav rail) */}
      {!navMode && interactive && (
        <div className="absolute right-3 top-3.5 flex flex-col gap-1.5 z-10">
          <button
            id="btn-map-compass"
            aria-label="Map Compass"
            onClick={() => setZoom(1)}
            className="w-8 h-8 rounded-lg bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center cursor-pointer hover:border-black dark:hover:border-white transition-colors"
            title="Reset Map Orientation"
          >
            <Compass className="w-4 h-4 text-red-500" />
          </button>

          <button
            id="btn-map-recenter"
            aria-label="Re-Center Location"
            onClick={() => setZoom(1)}
            className="w-8 h-8 rounded-lg bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center cursor-pointer hover:border-black dark:hover:border-white transition-colors"
            title="Re-Center on Location"
          >
            <LocateFixed className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          <button
            id="btn-toggle-heatmap"
            aria-label="Toggle Heatmap"
            onClick={() => setHeatmapVisible(!heatmapVisible)}
            className={`w-8 h-8 rounded-lg border shadow-sm flex items-center justify-center cursor-pointer transition-colors ${
              heatmapVisible
                ? 'bg-emerald-600 text-white border-emerald-700'
                : 'bg-white/95 dark:bg-black/95 text-black dark:text-white border-neutral-200 dark:border-neutral-800'
            }`}
            title="Toggle Safety Heatmap"
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            id="btn-zoom-in"
            aria-label="Zoom In"
            onClick={() => setZoom((z) => Math.min(z + 0.2, 1.8))}
            className="w-8 h-8 rounded-lg bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center cursor-pointer hover:border-black dark:hover:border-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            id="btn-zoom-out"
            aria-label="Zoom Out"
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
            className="w-8 h-8 rounded-lg bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center cursor-pointer hover:border-black dark:hover:border-white transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Speedometer & Lux Telemetry Pill (Repositioned to bottom-22 in navMode to avoid overlapping bottom card) */}
      <div className={`absolute z-10 flex items-center gap-1.5 ${navMode ? 'left-3 bottom-22' : 'left-3 bottom-3'}`}>
        <div className="px-2.5 py-1 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm backdrop-blur-xs flex items-center gap-2">
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
            {userProgress >= 100 ? '0.0' : '4.8'}
          </span>
          <span className="text-[9px] uppercase font-bold text-neutral-500">
            {userProgress >= 100 ? 'Arrived' : 'km/h Walk'}
          </span>
        </div>

        <div className="px-2 py-1 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-sm backdrop-blur-xs flex items-center gap-1 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-700 dark:text-emerald-400">98 Lux</span>
        </div>
      </div>

      {/* Help Point Selected Card Popover */}
      {selectedHp && (
        <div className="absolute left-3 right-3 bottom-20 z-30 p-3 bg-white dark:bg-black text-black dark:text-white rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                selectedHp.type === 'police'
                  ? 'bg-blue-600'
                  : selectedHp.type === 'hospital'
                  ? 'bg-red-600'
                  : selectedHp.type === 'metro'
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
            >
              {selectedHp.type === 'police' && <Shield className="w-4 h-4" />}
              {selectedHp.type === 'hospital' && <Hospital className="w-4 h-4" />}
              {selectedHp.type === 'metro' && <Train className="w-4 h-4" />}
              {selectedHp.type === 'pharmacy' && <Building2 className="w-4 h-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold truncate">{selectedHp.name}</h4>
                {selectedHp.isOpen247 && (
                  <span className="px-1.5 py-0.2 rounded text-[8px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shrink-0">
                    24/7
                  </span>
                )}
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                {selectedHp.distance} away • ETA {selectedHp.eta} walk
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <a
              href={`tel:${selectedHp.phone}`}
              className="px-2.5 py-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs hover:opacity-90 transition-opacity"
            >
              Call
            </a>
            <button
              type="button"
              onClick={() => setSelectedHp(null)}
              className="p-1 rounded-md text-neutral-400 hover:text-black dark:hover:text-white"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
