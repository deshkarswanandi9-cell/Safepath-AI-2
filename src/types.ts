export type ScreenId =
  | 'splash'            // Screen 1
  | 'login'             // Screen 2
  | 'dashboard'         // Screen 3
  | 'route_search'      // Screen 4
  | 'route_comparison'  // Screen 5
  | 'shap_explain'      // Screen 6
  | 'live_navigation'   // Screen 7
  | 'safety_alert'      // Screen 8 (Modal/Screen)
  | 'dynamic_reroute'   // Screen 9
  | 'safety_checkin'    // Screen 10
  | 'emergency_sos'     // Screen 11
  | 'trusted_contacts'  // Screen 12
  | 'safety_analytics'  // Screen 13
  | 'profile_settings'  // Screen 14
  | 'public_gathering_hub'; // Screen 15 (Public Gathering & Disruption Hub)

export interface RouteOption {
  id: string;
  name: string;
  distance: string;
  time: string;
  safetyScore: number;
  isRecommended?: boolean;
  tagline?: string;
  reasons?: string[];
  riskFactors?: string[];
  lightingScore: number; // 0-100
  crowdDensity: 'Low' | 'Medium' | 'High';
  crowdSurgeRisk?: 'Low' | 'Moderate' | 'High' | 'Critical';
  protestBypass?: boolean;
  medicalCorridorAccess?: boolean;
  policeCoverage: boolean;
  metroNearby: boolean;
  pathPoints: { x: number; y: number }[];
  color: string;
}

export interface ShapFeature {
  name: string;
  category: 'positive' | 'negative';
  value: number;
  description: string;
  iconName: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isLiveSharing: boolean;
  avatarUrl?: string;
  batteryLevel?: number;
  status?: string;
}

export interface EmergencyHelpPoint {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'metro' | 'pharmacy' | 'booth';
  distance: string;
  eta: string;
  isOpen247: boolean;
  coords: { x: number; y: number };
  phone: string;
}

export interface HeatmapZone {
  x: number;
  y: number;
  radius: number;
  riskLevel: 'safe' | 'medium' | 'high';
  label: string;
}

export interface NavStep {
  instruction: string;
  distance: string;
  turnType: 'straight' | 'left' | 'right' | 'slight_right' | 'destination';
  safetyNote: string;
  lightingStatus: 'High' | 'Good' | 'Moderate';
}

// -------------------------------------------------------------
// Public Gathering, Transit Disruption & Predictive Safety Types
// -------------------------------------------------------------

export interface PublicGatheringIncident {
  id: string;
  title: string;
  category: 'protest_rally' | 'road_blockage' | 'metro_disruption' | 'crowd_surge' | 'medical_corridor' | 'safe_exit';
  locationName: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  coords: { x: number; y: number };
  radius?: number;
  verificationStatus: 'verified_official' | 'corroborated' | 'unverified';
  corroborationCount: number;
  reportedAt: string;
  expiresInMinutes: number;
  source: string;
}

export interface TransitDisruption {
  id: string;
  stationName: string;
  line: string;
  lineColor: string;
  affectedGates: string[];
  status: 'Open' | 'Partial Closure' | 'Advisory' | 'Station Closed';
  advisoryNote: string;
  recommendedAlternative: string;
  extraWalkMins: number;
  coords: { x: number; y: number };
}

export interface CrowdSurgePrediction {
  id: string;
  areaName: string;
  horizonMinutes: number; // 15 or 30 min
  currentDensity: number; // 0-100%
  forecastedDensity: number; // 0-100%
  surgeRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  bottleneckLocation: string;
  confidenceScore: number; // 0-100%
  contributingFactors: {
    factor: string;
    impact: 'increase' | 'decrease';
    weight: number;
  }[];
}

export interface SafeEvacuationExit {
  id: string;
  name: string;
  type: 'metro_open_gate' | 'wide_avenue' | 'emergency_shelter' | 'medical_access';
  distance: string;
  eta: string;
  crowdCongestion: 'Clear' | 'Moderate' | 'Heavy';
  coords: { x: number; y: number };
  status: 'Open & Unobstructed' | 'Caution' | 'Congested';
}

export interface CommunityReport {
  id: string;
  title: string;
  category: 'road_block' | 'lighting' | 'crowding' | 'police_advisory' | 'medical';
  location: string;
  timestamp: string;
  corroborations: number;
  status: 'verified_official' | 'corroborated' | 'unverified';
  userAvatar?: string;
}

