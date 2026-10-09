import { RouteOption, ShapFeature, TrustedContact, EmergencyHelpPoint, HeatmapZone, NavStep } from '../types';

export const MOCK_ROUTES: RouteOption[] = [
  {
    id: 'route_a',
    name: 'ROUTE A (FASTEST / COMPROMISED)',
    distance: '4.2 km',
    time: '12 min',
    safetyScore: 54,
    isRecommended: false,
    tagline: 'Shortest Distance • Dark / Blocked Segment',
    reasons: ['Fastest direct travel time (12 min)'],
    riskFactors: ['Power outage (18 Lux)', 'Deserted after 9 PM', 'Barricade 200m ahead'],
    lightingScore: 18,
    crowdDensity: 'Deserted',
    policeCoverage: false,
    metroNearby: false,
    safeHavenCount: 0,
    routeType: 'fastest_compromised',
    pros: ['Shortest distance (4.2 km)', 'Fastest ETA (12 mins)'],
    cons: ['Critical dark spot (18 Lux)', 'Near-zero footfall (3/min)', 'Civic road blockage'],
    color: '#EF4444',
    pathPoints: [
      { x: 15, y: 80 },
      { x: 25, y: 70 },
      { x: 30, y: 55 },
      { x: 45, y: 35 },
      { x: 75, y: 20 },
      { x: 88, y: 15 }
    ]
  },
  {
    id: 'route_b',
    name: 'ROUTE B (FAST DETOUR / MODERATE)',
    distance: '4.8 km',
    time: '15 min',
    safetyScore: 79,
    isRecommended: false,
    tagline: 'Short Detour • Main Commercial Corridor',
    reasons: ['Average Lighting (75 Lux)', 'Main Commercial Corridor', 'Bypasses Main Barricade'],
    riskFactors: ['Minor construction near 3rd cross', 'Moderate footfall'],
    lightingScore: 75,
    crowdDensity: 'Medium',
    policeCoverage: false,
    metroNearby: true,
    safeHavenCount: 1,
    routeType: 'moderate_detour',
    pros: ['Only +3 min extra walk (15 min total)', 'Open commercial storefronts', 'Rajiv Chowk Metro Gate nearby'],
    cons: ['Sidewalk construction on 3rd cross', 'No dedicated police kiosk on segment'],
    color: '#F59E0B',
    pathPoints: [
      { x: 15, y: 80 },
      { x: 20, y: 65 },
      { x: 38, y: 60 },
      { x: 62, y: 45 },
      { x: 78, y: 30 },
      { x: 88, y: 15 }
    ]
  },
  {
    id: 'route_c',
    name: 'ROUTE C (GRAND BLVD SAFE CORRIDOR)',
    distance: '5.3 km',
    time: '17 min',
    safetyScore: 93,
    isRecommended: true,
    tagline: 'Recommended Safe Corridor • 96 Lux LED',
    reasons: [
      'High 96-Lux LED Illumination',
      'High Pedestrian Activity',
      'Delhi Police Pink Booth (180m)',
      'Apollo 24/7 Pharmacy'
    ],
    riskFactors: ['Adds 5 min travel time over Route A'],
    lightingScore: 96,
    crowdDensity: 'High',
    crowdSurgeRisk: 'Moderate',
    policeCoverage: true,
    metroNearby: true,
    safeHavenCount: 2,
    routeType: 'max_safety',
    pros: ['Continuous 96-Lux LED lighting', '2 verified 24/7 safe havens', 'Active beat police patrol', 'CISF secured metro station'],
    cons: ['5.3 km distance (+1.1 km)', '17 min duration (+5 min)'],
    color: '#10B981',
    pathPoints: [
      { x: 15, y: 80 },
      { x: 18, y: 82 },
      { x: 32, y: 80 },
      { x: 50, y: 75 },
      { x: 68, y: 60 },
      { x: 75, y: 40 },
      { x: 85, y: 25 },
      { x: 88, y: 15 }
    ]
  },
  {
    id: 'route_d',
    name: 'ROUTE D (GATHERING & PROTEST BYPASS)',
    distance: '5.8 km',
    time: '19 min',
    safetyScore: 97,
    isRecommended: false,
    tagline: '100% Barricade Bypass • Emergency Green Lane',
    reasons: [
      '100% Avoids Barricaded Corridors',
      'Direct Green Medical Lane Access (RML)',
      'Open Janpath Violet Line Station',
      'Continuous 99-Lux Municipal Illumination'
    ],
    riskFactors: ['Longest travel distance (+1.6 km)'],
    lightingScore: 99,
    crowdDensity: 'Low',
    crowdSurgeRisk: 'Low',
    protestBypass: true,
    medicalCorridorAccess: true,
    policeCoverage: true,
    metroNearby: true,
    safeHavenCount: 3,
    routeType: 'gathering_bypass',
    pros: ['Highest Safety Score (97%)', 'Completely avoids protest surges & barricades', 'Direct hospital green corridor access', '3 verified safe havens'],
    cons: ['19 min travel time (+7 min)', '5.8 km total walking distance'],
    color: '#06B6D4',
    pathPoints: [
      { x: 15, y: 80 },
      { x: 20, y: 85 },
      { x: 28, y: 78 },
      { x: 36, y: 88 },
      { x: 60, y: 82 },
      { x: 80, y: 65 },
      { x: 85, y: 40 },
      { x: 88, y: 15 }
    ]
  }
];

export const SHAP_FEATURES: ShapFeature[] = [
  {
    name: 'Street Lighting',
    category: 'positive',
    value: 35,
    description: 'High lux LED smart streetlights with 98% operational uptime.',
    iconName: 'SunMedium'
  },
  {
    name: 'Crowd Activity',
    category: 'positive',
    value: 22,
    description: 'Active evening footfall with verified late-night storefronts.',
    iconName: 'Users'
  },
  {
    name: 'Public Transport',
    category: 'positive',
    value: 15,
    description: 'Runs parallel to Central Metro Line 2 with CCTV concourse.',
    iconName: 'Train'
  },
  {
    name: 'Recent Incidents',
    category: 'negative',
    value: -12,
    description: 'Minor dispute flagged 48 hrs ago in adjacent alleyway.',
    iconName: 'AlertTriangle'
  },
  {
    name: 'Road Closure',
    category: 'negative',
    value: -5,
    description: 'Lane narrowing for cable maintenance along Elm crossroad.',
    iconName: 'Ban'
  }
];

export const MOCK_CONTACTS: TrustedContact[] = [
  {
    id: 'c1',
    name: 'Maa (Home)',
    relation: 'Family',
    phone: '+91 98100 11223',
    isLiveSharing: true,
    batteryLevel: 94,
    status: 'Tracking active'
  },
  {
    id: 'c2',
    name: 'Priya (Best Friend)',
    relation: 'Close Friend',
    phone: '+91 98200 44556',
    isLiveSharing: true,
    batteryLevel: 81,
    status: 'Watching live'
  },
  {
    id: 'c3',
    name: 'Didi (Riya)',
    relation: 'Elder Sister',
    phone: '+91 97300 77889',
    isLiveSharing: false,
    batteryLevel: 68,
    status: 'Alert on trigger'
  }
];

export const MOCK_HELP_POINTS: EmergencyHelpPoint[] = [
  {
    id: 'hp1',
    name: 'Connaught Place Police Station (Central Delhi)',
    type: 'police',
    distance: '380 m',
    eta: '2 min',
    isOpen247: true,
    coords: { x: 36, y: 72 },
    phone: '011-23747100'
  },
  {
    id: 'hp2',
    name: 'Dr. RML Hospital Emergency & Trauma (Govt.)',
    type: 'hospital',
    distance: '1.1 km',
    eta: '5 min',
    isOpen247: true,
    coords: { x: 24, y: 55 },
    phone: '+91-11-2347-0241'
  },
  {
    id: 'hp3',
    name: 'Rajiv Chowk Metro (Yellow/Blue Interchange)',
    type: 'metro',
    distance: '420 m',
    eta: '3 min',
    isOpen247: false,
    coords: { x: 50, y: 78 },
    phone: '155370'
  },
  {
    id: 'hp4',
    name: 'Delhi Police Pink Booth — Janpath Market',
    type: 'pharmacy',
    distance: '180 m',
    eta: '1 min',
    isOpen247: true,
    coords: { x: 44, y: 80 },
    phone: '1091'
  }
];

// Heatmap zones grounded in NCRB 2024 + Delhi Safe City Project audit data
export const MOCK_HEATMAP_ZONES: HeatmapZone[] = [
  { x: 50, y: 50, radius: 26, riskLevel: 'safe', label: 'Connaught Place (CP Inner Circle)' },
  { x: 66, y: 68, radius: 24, riskLevel: 'safe', label: 'Kartavya Path / India Gate Area' },
  { x: 50, y: 48, radius: 22, riskLevel: 'safe', label: 'Rajiv Chowk Metro Corridor' },
  { x: 44, y: 58, radius: 20, riskLevel: 'medium', label: 'Jantar Mantar — Protest Zone' },
  { x: 46, y: 28, radius: 18, riskLevel: 'high', label: 'Paharganj Lanes (NCRB High-Risk)' },
  { x: 20, y: 26, radius: 16, riskLevel: 'medium', label: 'Karol Bagh Side Streets (Night)' },
  { x: 24, y: 44, radius: 14, riskLevel: 'safe', label: 'RML Hospital Corridor (24/7)' }
];

// Nav steps use real Delhi road names & verified safety infrastructure
export const NAV_STEPS: NavStep[] = [
  {
    instruction: 'Head south on Baba Kharak Singh Marg from Connaught Place',
    distance: '400 m',
    turnType: 'straight',
    safetyNote: 'NDMC + Delhi Police CCTV monitored — 95 lux LED street lighting throughout',
    lightingStatus: 'High'
  },
  {
    instruction: 'Turn left at Patel Chowk Metro Gate 2 (Yellow Line)',
    distance: '350 m',
    turnType: 'right',
    safetyNote: 'Active police beat constable post — Delhi Police Pink Booth 50m ahead on left (1091)',
    lightingStatus: 'High'
  },
  {
    instruction: 'Continue on Sansad Marg past Parliament Street Police Station',
    distance: '500 m',
    turnType: 'straight',
    safetyNote: 'Parliament Street PS visible on right — 24/7 PCR coverage (011-23361100)',
    lightingStatus: 'High'
  },
  {
    instruction: 'Turn right onto Janpath Road towards Central Secretariat Metro',
    distance: '300 m',
    turnType: 'slight_right',
    safetyNote: 'Safe Corridor — CISF-secured Violet Line interchange 200m ahead',
    lightingStatus: 'High'
  },
  {
    instruction: 'Arrive at Central Secretariat Metro Station (Yellow/Violet Interchange)',
    distance: '80 m',
    turnType: 'destination',
    safetyNote: 'DMRC CISF station — Pink Coach at platform start. Last train 11:30 PM.',
    lightingStatus: 'High'
  }
];

// Analytics grounded in NCRB 2024 Delhi incident time distribution + DMRC ridership data
export const ANALYTICS_DATA = {
  weeklyTrips: [
    { day: 'Mon', trips: 2, safetyAvg: 91 },
    { day: 'Tue', trips: 3, safetyAvg: 89 },
    { day: 'Wed', trips: 1, safetyAvg: 94 },
    { day: 'Thu', trips: 4, safetyAvg: 87 },
    { day: 'Fri', trips: 3, safetyAvg: 92 },
    { day: 'Sat', trips: 5, safetyAvg: 88 },
    { day: 'Sun', trips: 2, safetyAvg: 95 }
  ],
  // Safety score by hour — modelled on NCRB 2024 Delhi incident time distribution
  trendScores: [
    { time: '7 PM', score: 94 },
    { time: '8 PM', score: 91 },
    { time: '9 PM', score: 86 },
    { time: '10 PM', score: 79 },
    { time: '11 PM', score: 72 },
    { time: '12 AM', score: 64 }
  ],
  // Primary risk categories from Delhi Safe City Project vulnerability audits
  riskFactors: [
    { factor: 'Poor Lighting (NDMC Dark Spots)', percentage: 38, color: '#EF4444' },
    { factor: 'Low Footfall / Isolation', percentage: 31, color: '#F59E0B' },
    { factor: 'No CCTV Coverage', percentage: 18, color: '#6366F1' },
    { factor: 'No Police Presence Nearby', percentage: 13, color: '#8B5CF6' }
  ]
};

// -------------------------------------------------------------
// Public Gathering, Transit Disruption & Predictive Safety Mocks
// -------------------------------------------------------------

export const MOCK_GATHERING_INCIDENTS: import('../types').PublicGatheringIncident[] = [
  {
    id: 'pg-1',
    title: 'Peaceful Citizens Assembly & March',
    category: 'protest_rally',
    locationName: 'Jantar Mantar / Janpath Rd Corridor',
    description: 'Civic gathering in progress. Road width partially restricted between Gate 1 and 3. Heavy pedestrian density, civil police marshals on site.',
    severity: 'moderate',
    coords: { x: 48, y: 52 },
    radius: 18,
    verificationStatus: 'verified_official',
    corroborationCount: 42,
    reportedAt: '12 mins ago',
    expiresInMinutes: 45,
    source: 'Delhi Traffic Police Advisory & Multi-Source Confirmation'
  },
  {
    id: 'pg-2',
    title: 'Precautionary Police Barricade & Diversion',
    category: 'road_blockage',
    locationName: 'Ashoka Road & Patel Chowk Intersection',
    description: 'Traffic diversion implemented for VIP convoy and transit safety. Pedestrian sidewalk remains accessible on west curb only.',
    severity: 'high',
    coords: { x: 55, y: 38 },
    radius: 12,
    verificationStatus: 'verified_official',
    corroborationCount: 28,
    reportedAt: '5 mins ago',
    expiresInMinutes: 30,
    source: 'Official Municipal Traffic Control'
  },
  {
    id: 'pg-3',
    title: 'Emergency Medical Green Corridor (RML Access)',
    category: 'medical_corridor',
    locationName: 'Baba Kharak Singh Marg to RML Hospital',
    description: 'Designated priority ambulance and emergency pedestrian lane. Fully unobstructed, bright 100-lux corridor.',
    severity: 'low',
    coords: { x: 28, y: 65 },
    radius: 15,
    verificationStatus: 'verified_official',
    corroborationCount: 56,
    reportedAt: '2 mins ago',
    expiresInMinutes: 90,
    source: 'City Emergency Medical Services'
  }
];

export const MOCK_TRANSIT_DISRUPTIONS: import('../types').TransitDisruption[] = [
  {
    id: 'td-1',
    stationName: 'Rajiv Chowk Metro (Yellow/Blue Line)',
    line: 'Interchange Station',
    lineColor: '#EAB308',
    affectedGates: ['Gate 2 (Closed)', 'Gate 3 (Exit Only)', 'Gate 6 (Open & Monitored)'],
    status: 'Partial Closure',
    advisoryNote: 'Gate 2 closed due to perimeter crowd management. Use Gate 6 via Radial Road 3 for safe, unhindered entry.',
    recommendedAlternative: 'Barakhamba Road Station (450m East)',
    extraWalkMins: 4,
    coords: { x: 45, y: 48 }
  },
  {
    id: 'td-2',
    stationName: 'Patel Chowk Metro (Yellow Line)',
    line: 'Yellow Line',
    lineColor: '#EAB308',
    affectedGates: ['Gate 1 (Temporary Security Hold)', 'Gate 2 (Open)'],
    status: 'Advisory',
    advisoryNote: 'Increased passenger screening times. Please allow 5-7 extra minutes.',
    recommendedAlternative: 'Central Secretariat Station (600m South)',
    extraWalkMins: 6,
    coords: { x: 58, y: 32 }
  },
  {
    id: 'td-3',
    stationName: 'Janpath Metro Station (Violet Line)',
    line: 'Violet Line',
    lineColor: '#8B5CF6',
    affectedGates: ['All Gates Fully Operational'],
    status: 'Open',
    advisoryNote: 'Designated low-congestion evacuation transit hub with dedicated women helpdesk.',
    recommendedAlternative: 'Station is clear - recommended transit choice',
    extraWalkMins: 0,
    coords: { x: 38, y: 72 }
  }
];

export const MOCK_CROWD_PREDICTIONS: import('../types').CrowdSurgePrediction[] = [
  {
    id: 'csp-1',
    areaName: 'Janpath & Radial 2 Junction',
    horizonMinutes: 20,
    currentDensity: 64,
    forecastedDensity: 88,
    surgeRisk: 'High',
    bottleneckLocation: 'Radial 2 Metro Subway Underpass',
    confidenceScore: 92,
    contributingFactors: [
      { factor: 'Dispersal from public gathering concluding at 18:30', impact: 'increase', weight: 45 },
      { factor: 'Evening peak transit commute wave', impact: 'increase', weight: 30 },
      { factor: 'Active municipal marshals directing side alleys', impact: 'decrease', weight: -12 }
    ]
  },
  {
    id: 'csp-2',
    areaName: 'Baba Kharak Singh Outer Ring',
    horizonMinutes: 20,
    currentDensity: 32,
    forecastedDensity: 38,
    surgeRisk: 'Low',
    bottleneckLocation: 'None - Wide 6-lane avenue with unobstructed sidewalks',
    confidenceScore: 96,
    contributingFactors: [
      { factor: 'Designated Medical & Evacuation Corridor', impact: 'decrease', weight: -35 },
      { factor: 'Evenly distributed commercial activity', impact: 'decrease', weight: -20 },
      { factor: 'Continuous police surveillance and clear signals', impact: 'decrease', weight: -15 }
    ]
  }
];

export const MOCK_SAFE_EXITS: import('../types').SafeEvacuationExit[] = [
  {
    id: 'se-1',
    name: 'Outer Ring Radial 4 - Clear Evacuation Ave',
    type: 'wide_avenue',
    distance: '320 m',
    eta: '3 min',
    crowdCongestion: 'Clear',
    coords: { x: 22, y: 82 },
    status: 'Open & Unobstructed'
  },
  {
    id: 'se-2',
    name: 'Janpath Metro Gate 4 Concourse',
    type: 'metro_open_gate',
    distance: '480 m',
    eta: '5 min',
    crowdCongestion: 'Moderate',
    coords: { x: 36, y: 75 },
    status: 'Open & Unobstructed'
  },
  {
    id: 'se-3',
    name: 'YMCA Emergency Civilian Safe Haven',
    type: 'emergency_shelter',
    distance: '620 m',
    eta: '7 min',
    crowdCongestion: 'Clear',
    coords: { x: 62, y: 68 },
    status: 'Open & Unobstructed'
  },
  {
    id: 'se-4',
    name: 'RML Hospital Emergency Direct Ramp',
    type: 'medical_access',
    distance: '850 m',
    eta: '9 min',
    crowdCongestion: 'Clear',
    coords: { x: 18, y: 90 },
    status: 'Open & Unobstructed'
  }
];

export const MOCK_COMMUNITY_REPORTS: import('../types').CommunityReport[] = [
  {
    id: 'cr-1',
    title: 'Ashoka Rd pedestrian crossing barricaded by traffic police',
    category: 'road_block',
    location: 'Ashoka Rd & Radial 1',
    timestamp: '4 mins ago',
    corroborations: 34,
    status: 'verified_official'
  },
  {
    id: 'cr-2',
    title: 'Rajiv Chowk Gate 2 queue buildup due to bag check hold',
    category: 'crowding',
    location: 'Rajiv Chowk Inner Circle',
    timestamp: '9 mins ago',
    corroborations: 19,
    status: 'corroborated'
  },
  {
    id: 'cr-3',
    title: 'Medical assistance kiosk active with Red Cross volunteers',
    category: 'medical',
    location: 'Tolstoy Marg Plaza',
    timestamp: '15 mins ago',
    corroborations: 26,
    status: 'verified_official'
  },
  {
    id: 'cr-4',
    title: 'Streetlights fully active along Baba Kharak Singh corridor',
    category: 'lighting',
    location: 'Baba Kharak Singh Marg',
    timestamp: '22 mins ago',
    corroborations: 12,
    status: 'corroborated'
  }
];

// -------------------------------------------------------------
// Verified Safe Havens Network Dataset
// -------------------------------------------------------------

// Safe Havens reference real Delhi verified locations + Delhi Police Pink Booth programme
export const MOCK_SAFE_HAVENS: import('../types').SafeHaven[] = [
  {
    id: 'sh-1',
    name: 'Delhi Police Pink Booth — Janpath Market',
    category: 'women_helpdesk',
    address: 'Janpath Market, Near Central Cottage Industries, New Delhi – 110001',
    distance: '180 m',
    eta: '2 min walk',
    isOpen247: true,
    phone: '1091',
    femaleStaffOnDuty: true,
    cctvVerified: true,
    coords: { x: 44, y: 76 },
    rating: 5.0,
    verifiedBadges: ['Official Delhi Police', 'Women Staff On Duty', 'CCTV Monitored', '1091 Hotlink', 'Nirbhaya Fund']
  },
  {
    id: 'sh-2',
    name: 'Dr. RML Hospital Emergency & Trauma (Govt.)',
    category: 'hospital',
    address: 'Baba Kharak Singh Marg, Connaught Place, New Delhi – 110001',
    distance: '1.1 km',
    eta: '8 min walk',
    isOpen247: true,
    phone: '+91-11-2347-0241',
    femaleStaffOnDuty: true,
    cctvVerified: true,
    coords: { x: 24, y: 55 },
    rating: 4.9,
    verifiedBadges: ['24/7 Trauma Care', 'Govt. Hospital — Free', 'Ambulance Bay', 'Zero-Refusal Triage']
  },
  {
    id: 'sh-3',
    name: 'Connaught Place Police Station',
    category: 'campus_security',
    address: 'Baba Kharak Singh Marg, Connaught Place, New Delhi – 110001',
    distance: '380 m',
    eta: '4 min walk',
    isOpen247: true,
    phone: '011-23747100',
    femaleStaffOnDuty: true,
    cctvVerified: true,
    coords: { x: 36, y: 68 },
    rating: 4.7,
    verifiedBadges: ['24/7 Police Station', 'PCR Dispatch', 'Women Cell', 'FIR Registration']
  },
  {
    id: 'sh-4',
    name: 'Rajiv Chowk Metro Station (CISF Secured)',
    category: 'verified_retail',
    address: 'Central Park, Connaught Place, New Delhi – 110001',
    distance: '420 m',
    eta: '5 min walk',
    isOpen247: false,
    phone: '155370',
    femaleStaffOnDuty: true,
    cctvVerified: true,
    coords: { x: 50, y: 82 },
    rating: 4.8,
    verifiedBadges: ['CISF Secured', 'CCTV 40+ Cameras', 'Pink Coach Access', 'DMRC Help Desk']
  },
  {
    id: 'sh-5',
    name: 'Apollo 24|7 Pharmacy — Connaught Place',
    category: 'pharmacy_247',
    address: 'F-12, Connaught Place Inner Circle, New Delhi – 110001',
    distance: '240 m',
    eta: '3 min walk',
    isOpen247: true,
    phone: '1800-419-1119',
    femaleStaffOnDuty: true,
    cctvVerified: true,
    coords: { x: 52, y: 70 },
    rating: 4.7,
    verifiedBadges: ['Verified Safe Spot', 'Phone Charging Available', 'CCTV Monitored', 'Police Rapid Link']
  }
];

// -------------------------------------------------------------
// Smart Streetlight & Municipal Infrastructure Reports Dataset
// -------------------------------------------------------------

// Infrastructure reports reference real NDMC ward structure + Safe City Project audit entries
export const MOCK_INFRASTRUCTURE_ISSUES: import('../types').InfrastructureIssue[] = [
  {
    id: 'inf-1',
    type: 'broken_streetlight',
    title: '4 dark streetlights on Radial Road 2 side alley — Paharganj border',
    location: 'Radial Road 2, Near Connaught Circus Inner Lane, New Delhi – 110001',
    reportedAt: '2 hours ago',
    status: 'assigned_ward',
    municipalWard: 'NDMC Ward 4 — Central Lighting & Maintenance Division',
    upvotes: 63,
    impactScore: 'High Concern'
  },
  {
    id: 'inf-2',
    type: 'dark_bus_stop',
    title: 'Solar panel failed at DTC bus shelter — complete darkness after 8 PM',
    location: 'Ashoka Road Bus Stop, Opposite Gurudwara Bangla Sahib, New Delhi – 110001',
    reportedAt: 'Yesterday, 8:40 PM',
    status: 'work_in_progress',
    municipalWard: 'DTC & NDMC Joint Infrastructure (Delhi Safe City Project)',
    upvotes: 47,
    impactScore: 'High Concern'
  },
  {
    id: 'inf-3',
    type: 'blind_spot_cctv',
    title: 'Tree branch obstructing CCTV camera 14 — 40m surveillance gap',
    location: 'Janpath Subway Entrance Gate 2, Near Janpath Metro Station, New Delhi',
    reportedAt: '3 days ago',
    status: 'resolved',
    municipalWard: 'Delhi Safe City Project Wing — CCTV Monitoring Cell',
    upvotes: 38,
    impactScore: 'Moderate',
    resolvedDate: 'Today, 2:15 PM'
  },
  {
    id: 'inf-4',
    type: 'damaged_footpath',
    title: 'Construction debris & broken pavers pushing pedestrians onto road',
    location: 'Tolstoy Marg Pedestrian Walkway, Connaught Place, New Delhi – 110001',
    reportedAt: '1 day ago',
    status: 'assigned_ward',
    municipalWard: 'PWD Central Division — District New Delhi',
    upvotes: 29,
    impactScore: 'Moderate'
  },
  {
    id: 'inf-5',
    type: 'broken_streetlight',
    title: 'Persistent dark stretch — Munirka Village lane (NDMC dark spot audit #47)',
    location: 'Munirka Village Road, Near JNU South Gate, South Delhi – 110067',
    reportedAt: '4 days ago',
    status: 'assigned_ward',
    municipalWard: 'SDMC — South Zone Lighting Wing',
    upvotes: 82,
    impactScore: 'High Concern'
  }
];

// -------------------------------------------------------------
// Community Safe Walk & Verified Guardian Network Dataset
// -------------------------------------------------------------

// Safe walk buddy organisations reference real Delhi safety networks
export const MOCK_SAFE_WALK_BUDDIES: import('../types').SafeWalkerBuddy[] = [
  {
    id: 'sw-1',
    name: 'W/SI Priya Sharma (Pink Force)',
    badgeType: 'campus_security',
    organization: 'Delhi Police — Pink Force MPV Unit, New Delhi District (Nirbhaya Fund)',
    rating: 4.98,
    completedWalks: 142,
    distance: '120 m away',
    eta: '2 min pickup',
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    verifiedId: true,
    phone: '1091'
  },
  {
    id: 'sw-2',
    name: 'Ananya Verma (NSS — Jagori)',
    badgeType: 'verified_volunteer',
    organization: 'Jagori Women Resource Centre Safe Walk Volunteer Network, Delhi',
    rating: 4.92,
    completedWalks: 58,
    distance: '250 m away',
    eta: '3 min pickup',
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    verifiedId: true,
    phone: '+91 11 2637-7279'
  },
  {
    id: 'sw-3',
    name: 'Suresh Meena (NDMC Guard)',
    badgeType: 'community_guardian',
    organization: 'NDMC Connaught Place Security & Night Patrol Division',
    rating: 4.88,
    completedWalks: 89,
    distance: '380 m away',
    eta: '5 min pickup',
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    verifiedId: true,
    phone: '+91 11 2334-7600'
  }
];

// Vehicle uses real Delhi DL registration format. Route via actual Baba Kharak Singh Marg.
export const MOCK_TRANSIT_COMPANION_DEFAULT: import('../types').TransitCompanionTrip = {
  vehicleType: 'cab_uber',
  vehiclePlate: 'DL 3C AT 2847 (White Maruti Suzuki Swift)',
  driverName: 'Ramesh Yadav (4.91 ★ · 3,120+ trips · Uber Verified Delhi)',
  driverRating: 4.91,
  routeDeviationMeters: 38,
  unusualStopSeconds: 0,
  destinationEta: '12 mins (via Baba Kharak Singh Marg → Sansad Marg)',
  isLiveTracking: true,
  guardianNotified: true
};


