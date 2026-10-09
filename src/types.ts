export type ScreenId =
  | 'splash'                 // Screen 1
  | 'login'                  // Screen 2
  | 'dashboard'              // Screen 3
  | 'route_search'           // Screen 4
  | 'route_comparison'       // Screen 5
  | 'shap_explain'           // Screen 6
  | 'live_navigation'        // Screen 7
  | 'safety_alert'           // Screen 8 (Modal/Screen)
  | 'dynamic_reroute'        // Screen 9
  | 'safety_checkin'         // Screen 10
  | 'emergency_sos'          // Screen 11
  | 'trusted_contacts'       // Screen 12
  | 'safety_analytics'       // Screen 13
  | 'profile_settings'       // Screen 14
  | 'public_gathering_hub'   // Screen 15 (Public Gathering & Disruption Hub)
  | 'safe_haven_network'     // Screen 16 (Verified Safe Haven Directory)
  | 'transport_companion'    // Screen 17 (Safe Transit & Ride Companion)
  | 'infrastructure_reporting' // Screen 18 (Streetlight & Infrastructure Reporting)
  | 'community_safe_walk'   // Screen 19 (Community Safe Walk & Buddy Network)
  | 'proactive_police_monitoring' // Screen 20 (Challenge 4: Proactive Police-Assisted Safety Monitoring)
  | 'nearest_safe_place';         // Screen 21 (Emergency Safe Haven Finder & Nearest Safe Place System)

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
  crowdDensity: 'Low' | 'Medium' | 'High' | 'Deserted';
  crowdSurgeRisk?: 'Low' | 'Moderate' | 'High' | 'Critical';
  protestBypass?: boolean;
  medicalCorridorAccess?: boolean;
  policeCoverage: boolean;
  metroNearby: boolean;
  safeHavenCount?: number;
  pros?: string[];
  cons?: string[];
  routeType?: 'fastest_compromised' | 'moderate_detour' | 'max_safety' | 'gathering_bypass';
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

// -------------------------------------------------------------
// Women's Safety Ecosystem, Safe Havens & Transit Companion Types
// -------------------------------------------------------------

export interface SafeHaven {
  id: string;
  name: string;
  category: 'pharmacy_247' | 'police_kiosk' | 'women_helpdesk' | 'campus_security' | 'verified_retail' | 'hospital';
  address: string;
  distance: string;
  eta: string;
  isOpen247: boolean;
  phone: string;
  femaleStaffOnDuty: boolean;
  cctvVerified: boolean;
  coords: { x: number; y: number };
  rating: number;
  verifiedBadges: string[];
}

export interface TransitCompanionTrip {
  vehicleType: 'cab_uber' | 'auto_rickshaw' | 'metro' | 'city_bus';
  vehiclePlate: string;
  driverName?: string;
  driverRating?: number;
  routeDeviationMeters: number;
  unusualStopSeconds: number;
  destinationEta: string;
  isLiveTracking: boolean;
  guardianNotified: boolean;
}

export interface InfrastructureIssue {
  id: string;
  type: 'broken_streetlight' | 'dark_bus_stop' | 'blind_spot_cctv' | 'damaged_footpath' | 'isolated_subway';
  title: string;
  location: string;
  reportedAt: string;
  status: 'reported' | 'assigned_ward' | 'work_in_progress' | 'resolved';
  municipalWard: string;
  upvotes: number;
  impactScore: 'High Concern' | 'Moderate' | 'Low';
  resolvedDate?: string;
}

export interface SafeWalkerBuddy {
  id: string;
  name: string;
  badgeType: 'campus_security' | 'verified_volunteer' | 'community_guardian';
  organization: string;
  rating: number;
  completedWalks: number;
  distance: string;
  eta: string;
  isAvailable: boolean;
  avatarUrl: string;
  verifiedId: boolean;
  phone: string;
}

// -------------------------------------------------------------
// Challenge 1: Changing Conditions & Dynamic Safety Status Types
// -------------------------------------------------------------

export type LightingConditionStatus = 'optimal' | 'moderate' | 'failed' | 'dark_spot';
export type PedestrianConditionStatus = 'high' | 'moderate' | 'low' | 'deserted';
export type GatheringConditionStatus = 'none' | 'peaceful_march' | 'crowd_surge' | 'road_blockage';
export type SafeHavenConditionStatus = 'optimal_nearby' | 'moderate' | 'limited' | 'none_in_reach';
export type PoliceConditionStatus = 'active_pcr_pink_booth' | 'regular' | 'reduced' | 'no_coverage';

export interface EnvironmentalConditionsState {
  lighting: {
    status: LightingConditionStatus;
    luxLevel: number; // e.g. 96 (optimal) down to 18 (failed)
    label: string;
    details: string;
    scoreDelta: number; // e.g. 0, -8, -20
  };
  pedestrian: {
    status: PedestrianConditionStatus;
    footfallPerMin: number; // e.g. 48 down to 2
    density: 'High' | 'Medium' | 'Low' | 'Deserted';
    label: string;
    details: string;
    scoreDelta: number; // e.g. 0, -6, -16
  };
  gathering: {
    status: GatheringConditionStatus;
    label: string;
    locationName: string;
    details: string;
    scoreDelta: number; // e.g. 0, -5, -18
  };
  safeHaven: {
    status: SafeHavenConditionStatus;
    nearestHavenName: string;
    nearestHavenDistance: string;
    isOpen247: boolean;
    details: string;
    scoreDelta: number; // e.g. +5, 0, -8
  };
  policePatrol: {
    status: PoliceConditionStatus;
    label: string;
    details: string;
    scoreDelta: number; // e.g. +4, 0, -10
  };
}

export interface FactorImpactBreakdown {
  id: string;
  name: string;
  category: 'lighting' | 'pedestrian' | 'gathering' | 'safe_haven' | 'police';
  status: string;
  scoreDelta: number;
  description: string;
  isPositive: boolean;
  icon: string;
}

export interface DynamicSafetyCalculation {
  baselineScore: number;
  currentScore: number;
  scoreDelta: number;
  statusLevel: 'optimal' | 'moderate' | 'compromised' | 'critical';
  statusLabel: string;
  statusColor: string;
  factorBreakdown: FactorImpactBreakdown[];
  activeAlerts: string[];
  recommendedAction: 'continue' | 'caution' | 'reroute_recommended' | 'emergency_evacuate';
  summaryMessage: string;
  alternativeRouteAvailable: boolean;
  alternativeGain: number;
}

export type ScenarioPresetId = 
  | 'optimal' 
  | 'streetlight_failure' 
  | 'crowd_dispersal' 
  | 'gathering_blockade' 
  | 'compound_risk' 
  | 'safe_haven_corridor';

export interface ConditionScenarioPreset {
  id: ScenarioPresetId;
  name: string;
  tagline: string;
  iconName: string;
  description: string;
  conditions: EnvironmentalConditionsState;
  expectedScore: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

// -------------------------------------------------------------
// Challenge 3: Adaptive Recommendation & XAI Reasoner Types
// -------------------------------------------------------------

export interface FactorComparisonItem {
  factorName: string;
  category: 'lighting' | 'pedestrian' | 'gathering' | 'safe_haven' | 'police' | 'eta';
  currentRouteValue: string;
  recommendedRouteValue: string;
  isAdvantage: boolean;
  scoreImpact: string;
}

export interface AdaptiveRecommendationState {
  hasRecommendationChanged: boolean;
  initialRouteId: string;
  initialRouteName: string;
  initialRouteScore: number;
  currentRouteScore: number;
  recommendedRouteId: string;
  recommendedRouteName: string;
  recommendedRouteScore: number;
  scoreGain: number; // e.g. +39 pts
  timeDelta: string; // e.g. "+4 min"
  distanceDelta: string; // e.g. "+400m"
  triggerCause: string;
  whyRecommendationChanged: string;
  keyProtections: string[];
  factorComparison: FactorComparisonItem[];
  confidencePct: number;
  timestamp: string;
  tradeoffSummary: {
    safetyAdvantage: string;
    timeCost: string;
    convenienceNote: string;
  };
}

// -------------------------------------------------------------
// Challenge 4: Proactive Police-Assisted Safety Monitoring Types
// -------------------------------------------------------------

export type ProactiveMonitoringStatus = 
  | 'idle'
  | 'consent_pending'
  | 'active_monitoring'
  | 'anomaly_detected'     // Route deviation or prolonged stop or threshold alert
  | 'operator_verifying'   // Police operator attempting discreet check-in / call
  | 'escalated_dispatch'   // PCR van dispatched to exact GPS coordinate
  | 'safe_closed';         // Safely arrived and session terminated

export interface VehicleTelemetry {
  serviceProvider: 'Uber' | 'Ola' | 'BluSmart' | 'Auto' | 'Private Taxi' | 'Walking';
  vehicleNumber: string;
  driverName: string;
  driverRating: string;
  currentSpeedKmH: number;
  routeDeviationMeters: number;
  prolongedStopDurationSec: number;
  isOffRoute: boolean;
}

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  event: string;
  severity: 'info' | 'caution' | 'alert' | 'escalation';
  details?: string;
}

export interface VerificationAttempt {
  status: 'none' | 'initiated' | 'user_responded_safe' | 'no_response' | 'user_requested_help';
  attemptedAt?: string;
  method: 'in_app_prompt' | 'operator_call' | 'discreet_sms';
  operatorMessage: string;
}

export interface PcrDispatchUnit {
  unitId: string;
  officerInCharge: string;
  officerBadge: string;
  contactPhone: string;
  vehicleType: string;
  etaMins: number;
  currentDistance: string;
  assignedAt: string;
  status: 'en_route' | 'on_scene' | 'standby';
}

export interface ProactiveSafetySession {
  id: string;                          // e.g., 'PCR-DL-2026-8841'
  userName: string;
  userPhone: string;
  userEmergencyContact: string;
  initialConcern: string;              // e.g. "Driver taking unlit detour, feeling uneasy"
  status: ProactiveMonitoringStatus;
  startedAt: string;
  expectedEta: string;
  maxThresholdMinutes: number;         // e.g., 20 min threshold
  elapsedMinutes: number;
  originName: string;
  destinationName: string;
  currentLocationCoords: { x: number; y: number };
  currentLocationName: string;
  vehicleInfo: VehicleTelemetry;
  authorizedAgency: {
    name: string;
    unitName: string;
    operatorName: string;
    operatorBadge: string;
    controlRoomStation: string;
    helpline: string;
  };
  telemetryLogs: TelemetryLogEntry[];
  operatorNotes: string[];
  verificationAttempt: VerificationAttempt;
  pcrDispatchInfo?: PcrDispatchUnit;
}

export interface StoppedWaypointState {
  progress: number;
  stepIndex: number;
  coords: { x: number; y: number };
  locationName: string;
  timestamp: string;
  reason: 'emergency_alert' | 'route_pause' | 'manual_detour' | 'emergency_reroute' | 'user_stopped';
  localConditions: EnvironmentalConditionsState;
  calculatedRiskScore: number;
  remainingDistanceKm: number;
  remainingTimeMin: number;
}
