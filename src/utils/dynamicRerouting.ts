import { 
  RouteOption, 
  EnvironmentalConditionsState, 
  DynamicSafetyCalculation, 
  StoppedWaypointState,
  ShapFeature 
} from '../types';
import { MOCK_ROUTES, MOCK_HELP_POINTS } from '../data/mockData';
import { calculateDynamicSafety, DEFAULT_OPTIMAL_CONDITIONS } from '../data/conditionSimulator';

// Helper to interpolate coordinate along route points based on 0-100% progress
export function interpolateRoutePoint(
  points: { x: number; y: number }[],
  progress: number
): { x: number; y: number; segIndex: number } {
  if (!points || points.length === 0) return { x: 50, y: 50, segIndex: 0 };
  if (points.length === 1) return { ...points[0], segIndex: 0 };

  const clamped = Math.max(0, Math.min(100, progress)) / 100;
  const totalSegments = points.length - 1;
  const rawIndex = clamped * totalSegments;
  const segIndex = Math.min(Math.floor(rawIndex), totalSegments - 1);
  const fraction = rawIndex - segIndex;

  const p1 = points[segIndex];
  const p2 = points[segIndex + 1];

  const x = Math.round((p1.x + (p2.x - p1.x) * fraction) * 10) / 10;
  const y = Math.round((p1.y + (p2.y - p1.y) * fraction) * 10) / 10;

  return { x, y, segIndex };
}

// Find nearest named landmark/waypoint for user-friendly display
export function getLandmarkForCoords(coords: { x: number; y: number }): string {
  if (coords.x <= 25 && coords.y >= 70) return 'Janpath Metro Station (Gate 2)';
  if (coords.x <= 40 && coords.y >= 55) return 'Ashoka Road Radial Bypass';
  if (coords.x <= 60 && coords.y >= 45) return 'Sansad Marg Commercial Crossroad';
  if (coords.x <= 75 && coords.y >= 30) return 'Tolstoy Marg Junction';
  return 'Westwood Park Corridor';
}

// Find nearest safe haven from any arbitrary coordinate
export function getNearestHavenFromLocation(coords: { x: number; y: number }) {
  let closest = MOCK_HELP_POINTS[0];
  let minDistanceSq = Number.MAX_VALUE;

  for (const hp of MOCK_HELP_POINTS) {
    const dx = hp.coords.x - coords.x;
    const dy = hp.coords.y - coords.y;
    const distSq = dx * dx + dy * dy;
    if (distSq < minDistanceSq) {
      minDistanceSq = distSq;
      closest = hp;
    }
  }

  // Rough estimation: 1 unit on grid ≈ 25 meters in CP area
  const distanceMeters = Math.round(Math.sqrt(minDistanceSq) * 25);
  return {
    haven: closest,
    distanceMeters,
    distanceLabel: distanceMeters > 1000 ? `${(distanceMeters / 1000).toFixed(1)} km` : `${distanceMeters} m`
  };
}

// Create stopped waypoint snapshot when emergency / reroute occurs
export function createStoppedWaypointSnapshot(
  activeRoute: RouteOption,
  progress: number,
  conditions: EnvironmentalConditionsState = DEFAULT_OPTIMAL_CONDITIONS,
  reason: StoppedWaypointState['reason'] = 'emergency_alert'
): StoppedWaypointState {
  const { x, y, segIndex } = interpolateRoutePoint(activeRoute.pathPoints, progress);
  const locationName = getLandmarkForCoords({ x, y });
  const totalKm = parseFloat(activeRoute.distance.replace(/[^\d.]/g, '')) || 4.2;
  const totalMin = parseInt(activeRoute.time.replace(/[^\d]/g, ''), 10) || 12;

  const remainingRatio = Math.max(0.1, (100 - progress) / 100);
  const remainingDistanceKm = Math.round(totalKm * remainingRatio * 10) / 10;
  const remainingTimeMin = Math.max(1, Math.round(totalMin * remainingRatio));

  const localCalc = calculateDynamicSafety(activeRoute.safetyScore, conditions);

  return {
    progress,
    stepIndex: segIndex,
    coords: { x, y },
    locationName,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    reason,
    localConditions: conditions,
    calculatedRiskScore: localCalc.currentScore,
    remainingDistanceKm,
    remainingTimeMin
  };
}

// Generate new alternative emergency routes rooted from the EXACT stopped location
export function generateEmergencyReroutesFromStoppedPoint(
  stoppedWaypoint: StoppedWaypointState,
  conditions: EnvironmentalConditionsState
): RouteOption[] {
  const { x, y } = stoppedWaypoint.coords;
  const dest = { x: 88, y: 15 };
  const nearestHaven = getNearestHavenFromLocation({ x, y });

  // 1. Route A (Compromised / Blocked ahead on original path)
  const routeA_pts = [
    { x, y },
    { x: x + (dest.x - x) * 0.4, y: y + (dest.y - y) * 0.4 },
    dest
  ];
  const routeA_calc = calculateDynamicSafety(54, conditions);

  // 2. Route B (Detour via Open Commercial Corridor)
  const routeB_pts = [
    { x, y },
    { x: Math.min(85, x + 15), y: Math.max(25, y - 10) },
    { x: Math.min(85, x + 25), y: Math.max(20, y - 25) },
    dest
  ];
  const routeB_score = Math.min(88, Math.max(68, 79 + (conditions.lighting.luxLevel < 40 ? -6 : 4)));

  // 3. Route C (Grand Boulevard Safe Escape Corridor via 24/7 Pink Booth)
  // Connects immediately from stopped point to the nearest safe haven, then well-lit boulevard
  const havenPt = nearestHaven.haven.coords;
  const routeC_pts = [
    { x, y },
    { x: (x + havenPt.x) / 2, y: (y + havenPt.y) / 2 },
    havenPt,
    { x: 75, y: 40 },
    { x: 85, y: 25 },
    dest
  ];
  const routeC_score = 93; // Guaranteed optimal escape corridor

  // 4. Route D (Direct Safe Haven Intercept / Emergency Shelter)
  const routeD_pts = [
    { x, y },
    { x: (x + havenPt.x) * 0.5, y: (y + havenPt.y) * 0.5 },
    havenPt
  ];

  return [
    {
      id: 'reroute_a',
      name: 'ORIGINAL PATH (COMPROMISED / BLOCKED)',
      distance: `${stoppedWaypoint.remainingDistanceKm} km`,
      time: `${stoppedWaypoint.remainingTimeMin} min`,
      safetyScore: routeA_calc.currentScore,
      isRecommended: false,
      tagline: `Continues from ${stoppedWaypoint.locationName} • Hazard Ahead`,
      reasons: ['Fastest direct continuation'],
      riskFactors: [
        `Incident reported ${Math.round(stoppedWaypoint.remainingDistanceKm * 300)}m ahead`,
        'Low illumination (18 Lux)',
        'Isolated road segment'
      ],
      lightingScore: conditions.lighting.luxLevel,
      crowdDensity: 'Deserted',
      policeCoverage: false,
      metroNearby: false,
      safeHavenCount: 0,
      routeType: 'fastest_compromised',
      pros: [`Direct continuation from current location (${stoppedWaypoint.remainingDistanceKm} km)`],
      cons: ['Severe safety risk from current location', 'Road blockage ahead', 'Zero safe havens on segment'],
      color: '#EF4444',
      pathPoints: routeA_pts
    },
    {
      id: 'reroute_b',
      name: 'ROUTE B (LATERAL DETOUR TO COMMERCIAL CORRIDOR)',
      distance: `${(stoppedWaypoint.remainingDistanceKm + 0.4).toFixed(1)} km`,
      time: `${stoppedWaypoint.remainingTimeMin + 3} min`,
      safetyScore: routeB_score,
      isRecommended: false,
      tagline: `Detours immediately from ${stoppedWaypoint.locationName}`,
      reasons: ['Bypasses hazard 120m away', 'Open storefronts on Sansad Marg'],
      riskFactors: ['Minor sidewalk construction on turn'],
      lightingScore: 78,
      crowdDensity: 'Medium',
      policeCoverage: false,
      metroNearby: true,
      safeHavenCount: 1,
      routeType: 'moderate_detour',
      pros: ['Immediate turn away from dark spot', 'Active pedestrian presence (+38/min)'],
      cons: ['Adds ~3 min travel time over direct line'],
      color: '#F59E0B',
      pathPoints: routeB_pts
    },
    {
      id: 'reroute_c',
      name: 'ROUTE C (RECOMMENDED SAFE ESCAPE CORRIDOR)',
      distance: `${(stoppedWaypoint.remainingDistanceKm + 0.8).toFixed(1)} km`,
      time: `${stoppedWaypoint.remainingTimeMin + 5} min`,
      safetyScore: routeC_score,
      isRecommended: true,
      tagline: `Routes via ${nearestHaven.haven.name} (${nearestHaven.distanceLabel})`,
      reasons: [
        `Passes verified 24/7 Pink Booth in ${nearestHaven.distanceLabel}`,
        'Continuous 96-Lux LED illumination',
        'Active Delhi Police PCR Van on beat',
        'CISF Metro Security corridor'
      ],
      riskFactors: ['Adds ~5 mins extra walk to assure 100% safety'],
      lightingScore: 96,
      crowdDensity: 'High',
      policeCoverage: true,
      metroNearby: true,
      safeHavenCount: 2,
      routeType: 'max_safety',
      pros: [
        `Starts immediately from your current stopped spot`,
        `Direct sanctuary: ${nearestHaven.haven.name} in ${nearestHaven.distanceLabel}`,
        'High-density lit corridor (+39 pts safety gain)'
      ],
      cons: ['+0.8 km detour for maximum safety guarantee'],
      color: '#10B981',
      pathPoints: routeC_pts
    }
  ];
}
