import { RouteOption, ShapFeature, TrustedContact, EmergencyHelpPoint, HeatmapZone, NavStep } from '../types';

export const MOCK_ROUTES: RouteOption[] = [
  {
    id: 'route_a',
    name: 'ROUTE A',
    distance: '4.2 km',
    time: '12 min',
    safetyScore: 58,
    isRecommended: false,
    tagline: 'Shortest Distance',
    riskFactors: ['Poor Lighting', 'Low Activity'],
    lightingScore: 42,
    crowdDensity: 'Low',
    policeCoverage: false,
    metroNearby: false,
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
    name: 'ROUTE B',
    distance: '4.8 km',
    time: '15 min',
    safetyScore: 79,
    isRecommended: false,
    tagline: 'Moderate Balance',
    reasons: ['Average Lighting', 'Main Commercial Corridor'],
    riskFactors: ['Construction work near 3rd cross'],
    lightingScore: 75,
    crowdDensity: 'Medium',
    policeCoverage: false,
    metroNearby: true,
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
    name: 'ROUTE C',
    distance: '5.3 km',
    time: '17 min',
    safetyScore: 93,
    isRecommended: true,
    tagline: 'Recommended Safe Route',
    reasons: [
      'Better Lighting',
      'High Crowd Activity',
      'Nearby Metro Station',
      'Police Help Point Nearby'
    ],
    lightingScore: 96,
    crowdDensity: 'High',
    crowdSurgeRisk: 'Moderate',
    policeCoverage: true,
    metroNearby: true,
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
    name: 'ROUTE D (GATHERING BYPASS)',
    distance: '5.8 km',
    time: '19 min',
    safetyScore: 97,
    isRecommended: false,
    tagline: 'Protest Bypass & Medical Corridor',
    reasons: [
      '100% Avoids Barricaded Corridors',
      'Direct Green Medical Lane Access',
      'Open Janpath Violet Line Station',
      'Continuous 100-Lux Municipal Lighting'
    ],
    riskFactors: ['Slightly longer distance (+500m)'],
    lightingScore: 99,
    crowdDensity: 'Low',
    crowdSurgeRisk: 'Low',
    protestBypass: true,
    medicalCorridorAccess: true,
    policeCoverage: true,
    metroNearby: true,
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
    name: 'Mother',
    relation: 'Family',
    phone: '+1 (555) 382-9102',
    isLiveSharing: true,
    batteryLevel: 94,
    status: 'Tracking active'
  },
  {
    id: 'c2',
    name: 'Friend (Aanya)',
    relation: 'Close Friend',
    phone: '+1 (555) 724-6019',
    isLiveSharing: true,
    batteryLevel: 81,
    status: 'Watching live'
  },
  {
    id: 'c3',
    name: 'Sister (Riya)',
    relation: 'Sibling',
    phone: '+1 (555) 902-3481',
    isLiveSharing: false,
    batteryLevel: 68,
    status: 'Alert on trigger'
  }
];

export const MOCK_HELP_POINTS: EmergencyHelpPoint[] = [
  {
    id: 'hp1',
    name: 'Metro City Police Station (Div 4)',
    type: 'police',
    distance: '350 m',
    eta: '2 min',
    isOpen247: true,
    coords: { x: 42, y: 72 },
    phone: '911'
  },
  {
    id: 'hp2',
    name: 'St. Jude General Hospital & Trauma',
    type: 'hospital',
    distance: '680 m',
    eta: '4 min',
    isOpen247: true,
    coords: { x: 65, y: 55 },
    phone: '911'
  },
  {
    id: 'hp3',
    name: 'Central Promenade Metro Concourse',
    type: 'metro',
    distance: '420 m',
    eta: '3 min',
    isOpen247: true,
    coords: { x: 34, y: 78 },
    phone: '+1 800 555-SAFE'
  },
  {
    id: 'hp4',
    name: 'Guardian 24/7 Pharmacy & Help Booth',
    type: 'pharmacy',
    distance: '210 m',
    eta: '1 min',
    isOpen247: true,
    coords: { x: 22, y: 80 },
    phone: '+1 800 555-BOOTH'
  }
];

export const MOCK_HEATMAP_ZONES: HeatmapZone[] = [
  { x: 30, y: 75, radius: 26, riskLevel: 'safe', label: 'Well-lit Avenue' },
  { x: 55, y: 68, radius: 24, riskLevel: 'safe', label: 'Commercial Square' },
  { x: 75, y: 45, radius: 22, riskLevel: 'safe', label: 'Metro Corridor' },
  { x: 40, y: 40, radius: 20, riskLevel: 'medium', label: 'Industrial Zone' },
  { x: 28, y: 50, radius: 18, riskLevel: 'high', label: 'Dim Alley / Incident Area' },
  { x: 60, y: 25, radius: 16, riskLevel: 'medium', label: 'Underpass Construction' }
];

export const NAV_STEPS: NavStep[] = [
  {
    instruction: 'Head north along Grand Boulevard',
    distance: '300 m',
    turnType: 'straight',
    safetyNote: 'CCTV monitored, bright street lights every 15 meters',
    lightingStatus: 'High'
  },
  {
    instruction: 'Turn right at Central Metro Station Plaza',
    distance: '450 m',
    turnType: 'right',
    safetyNote: 'High pedestrian density, active police kiosk',
    lightingStatus: 'High'
  },
  {
    instruction: 'Continue on Royal Promenade past Guardian 24/7',
    distance: '600 m',
    turnType: 'straight',
    safetyNote: 'Designated Safe Corridor zone',
    lightingStatus: 'High'
  },
  {
    instruction: 'Slight right towards Parkview Avenue',
    distance: '200 m',
    turnType: 'slight_right',
    safetyNote: 'Residential area with community wardens',
    lightingStatus: 'Good'
  },
  {
    instruction: 'Arrive safely at Westwood Residence',
    distance: '50 m',
    turnType: 'destination',
    safetyNote: 'Destination verified safe drop-off zone',
    lightingStatus: 'High'
  }
];

export const ANALYTICS_DATA = {
  weeklyTrips: [
    { day: 'Mon', trips: 2, safetyAvg: 94 },
    { day: 'Tue', trips: 3, safetyAvg: 91 },
    { day: 'Wed', trips: 1, safetyAvg: 96 },
    { day: 'Thu', trips: 4, safetyAvg: 89 },
    { day: 'Fri', trips: 3, safetyAvg: 95 },
    { day: 'Sat', trips: 5, safetyAvg: 92 },
    { day: 'Sun', trips: 2, safetyAvg: 97 }
  ],
  trendScores: [
    { time: '8 PM', score: 96 },
    { time: '9 PM', score: 94 },
    { time: '10 PM', score: 88 },
    { time: '11 PM', score: 82 },
    { time: '12 AM', score: 79 },
    { time: '1 AM', score: 74 }
  ],
  riskFactors: [
    { factor: 'Poor Lighting', percentage: 46, color: '#EF4444' },
    { factor: 'Low Footfall', percentage: 28, color: '#F59E0B' },
    { factor: 'Road Closures', percentage: 14, color: '#6366F1' },
    { factor: 'Alleyway Cuts', percentage: 12, color: '#8B5CF6' }
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

