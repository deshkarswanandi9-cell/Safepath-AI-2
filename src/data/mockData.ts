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

// -------------------------------------------------------------
// Verified Safe Havens Network Dataset
// -------------------------------------------------------------

export const MOCK_SAFE_HAVENS: import('../types').SafeHaven[] = [
  {
    id: 'sh-1',
    name: 'Apollo 24/7 Verified Emergency Pharmacy & Safe Haven',
    category: 'pharmacy_247',
    address: 'Connaught Place Radial 3, Outer Circle',
    distance: '180 m',
    eta: '2 min walk',
    isOpen247: true,
    phone: '+91 11 2341 9000',
    femaleStaffOnDuty: true,
    cctvVerified: true,
    coords: { x: 28, y: 76 },
    rating: 4.9,
    verifiedBadges: ['24/7 Safe Haven', 'Women Staff On Duty', 'CCTV Monitored', 'Direct Police Link']
  },
  {
    id: 'sh-2',
    name: 'Delhi Police All-Women Helpdesk & PCR Kiosk',
    category: 'women_helpdesk',
    address: 'Janpath Road opposite Central Cottage Industries',
    distance: '320 m',
    eta: '4 min walk',
    isOpen247: true,
    phone: '1091 / 112',
    femaleStaffOnDuty: true,
    cctvVerified: true,
    coords: { x: 42, y: 68 },
    rating: 5.0,
    verifiedBadges: ['Official Helpdesk', 'Immediate Escort', 'First Responder Unit', '1091 Hotlink']
  },
  {
    id: 'sh-3',
    name: 'Central University Security Command Post & Escort Booth',
    category: 'campus_security',
    address: 'City University North Gate, Gate 1',
    distance: '490 m',
    eta: '6 min walk',
    isOpen247: true,
    phone: '+91 11 2766 8888',
    femaleStaffOnDuty: true,
    cctvVerified: true,
    coords: { x: 62, y: 55 },
    rating: 4.8,
    verifiedBadges: ['Campus Warden', 'Night Escort Service', 'CCTV Surveillance', 'Emergency Shelter']
  },
  {
    id: 'sh-4',
    name: 'Chaayos 24/7 Night Lounge & Women Safe Refuge Point',
    category: 'verified_retail',
    address: 'Radial 4 Plaza, Inner Circle',
    distance: '240 m',
    eta: '3 min walk',
    isOpen247: true,
    phone: '+91 98100 23456',
    femaleStaffOnDuty: true,
    cctvVerified: true,
    coords: { x: 35, y: 82 },
    rating: 4.7,
    verifiedBadges: ['Verified Safe Spot', 'Well-Lit Interior', 'Phone Charging Available', 'Assistance Hub']
  },
  {
    id: 'sh-5',
    name: 'Dr. RML Hospital Emergency & Trauma Triage Reception',
    category: 'hospital',
    address: 'Baba Kharak Singh Marg',
    distance: '750 m',
    eta: '8 min walk',
    isOpen247: true,
    phone: '102 / 112',
    femaleStaffOnDuty: true,
    cctvVerified: true,
    coords: { x: 18, y: 90 },
    rating: 4.9,
    verifiedBadges: ['24/7 Trauma Care', 'Security Wardens', 'Ambulance Bay', 'Zero-Refusal Triage']
  }
];

// -------------------------------------------------------------
// Smart Streetlight & Municipal Infrastructure Reports Dataset
// -------------------------------------------------------------

export const MOCK_INFRASTRUCTURE_ISSUES: import('../types').InfrastructureIssue[] = [
  {
    id: 'inf-1',
    type: 'broken_streetlight',
    title: '3 consecutive dark streetlights along Radial Road 2 alley',
    location: 'Radial Road 2 & School Lane Corner',
    reportedAt: '2 hours ago',
    status: 'assigned_ward',
    municipalWard: 'NDMC Ward 4 (Central Lighting Division)',
    upvotes: 48,
    impactScore: 'High Concern'
  },
  {
    id: 'inf-2',
    type: 'dark_bus_stop',
    title: 'Unlit bus shelter with non-functional solar light',
    location: 'Ashoka Road Bus Stop (Opposite Bangla Sahib)',
    reportedAt: 'Yesterday, 8:40 PM',
    status: 'work_in_progress',
    municipalWard: 'DTC & NDMC Joint Infrastructure',
    upvotes: 35,
    impactScore: 'High Concern'
  },
  {
    id: 'inf-3',
    type: 'blind_spot_cctv',
    title: 'Tree branch fully obstructing CCTV camera 14',
    location: 'Janpath Subway Entrance Gate 2',
    reportedAt: '3 days ago',
    status: 'resolved',
    municipalWard: 'Delhi Safe City Project Wing',
    upvotes: 29,
    impactScore: 'Moderate',
    resolvedDate: 'Today, 2:15 PM'
  },
  {
    id: 'inf-4',
    type: 'damaged_footpath',
    title: 'Broken pavers and construction debris forcing pedestrians onto road',
    location: 'Tolstoy Marg Pedestrian Walkway',
    reportedAt: '1 day ago',
    status: 'assigned_ward',
    municipalWard: 'PWD Central Division',
    upvotes: 21,
    impactScore: 'Moderate'
  }
];

// -------------------------------------------------------------
// Community Safe Walk & Verified Guardian Network Dataset
// -------------------------------------------------------------

export const MOCK_SAFE_WALK_BUDDIES: import('../types').SafeWalkerBuddy[] = [
  {
    id: 'sw-1',
    name: 'Officer Priya Sharma',
    badgeType: 'campus_security',
    organization: 'City University Special Night Warden Unit',
    rating: 4.98,
    completedWalks: 142,
    distance: '120 m away',
    eta: '2 min pickup',
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
    verifiedId: true,
    phone: '+91 98111 22334'
  },
  {
    id: 'sw-2',
    name: 'Ananya Verma (NSS Volunteer)',
    badgeType: 'verified_volunteer',
    organization: 'Verified Women Student Safety Network',
    rating: 4.92,
    completedWalks: 58,
    distance: '250 m away',
    eta: '3 min pickup',
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    verifiedId: true,
    phone: '+91 98222 33445'
  },
  {
    id: 'sw-3',
    name: 'Warden Rajesh Kumar',
    badgeType: 'community_guardian',
    organization: 'Connaught Place Merchant Safety Patrol',
    rating: 4.88,
    completedWalks: 89,
    distance: '380 m away',
    eta: '5 min pickup',
    isAvailable: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    verifiedId: true,
    phone: '+91 98333 44556'
  }
];

export const MOCK_TRANSIT_COMPANION_DEFAULT: import('../types').TransitCompanionTrip = {
  vehicleType: 'cab_uber',
  vehiclePlate: 'DL 01 RT 4829 (White Swift Dzire)',
  driverName: 'Mukesh K. (4.89 ★ • 2,400+ trips)',
  driverRating: 4.89,
  routeDeviationMeters: 45,
  unusualStopSeconds: 0,
  destinationEta: '14 mins',
  isLiveTracking: true,
  guardianNotified: true
};


