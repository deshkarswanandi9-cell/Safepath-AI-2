import { 
  EnvironmentalConditionsState, 
  DynamicSafetyCalculation, 
  ConditionScenarioPreset, 
  FactorImpactBreakdown,
  RouteOption,
  AdaptiveRecommendationState,
  FactorComparisonItem
} from '../types';

// Default baseline optimal state for Route C / Recommended route
export const DEFAULT_OPTIMAL_CONDITIONS: EnvironmentalConditionsState = {
  lighting: {
    status: 'optimal',
    luxLevel: 96,
    label: '96 Lux LED Illumination',
    details: 'Smart Municipal LED streetlights active with 99% uptime along Baba Kharak Singh Marg.',
    scoreDelta: 0
  },
  pedestrian: {
    status: 'high',
    footfallPerMin: 52,
    density: 'High',
    label: 'High Pedestrian Footfall',
    details: 'Active evening footfall with verified late-night storefronts and commuter transit flow.',
    scoreDelta: 0
  },
  gathering: {
    status: 'none',
    label: 'No Disruption Reported',
    locationName: 'Sansad Marg Corridor',
    details: 'Clear passage, unobstructed sidewalks, normal vehicular and pedestrian transit.',
    scoreDelta: 0
  },
  safeHaven: {
    status: 'optimal_nearby',
    nearestHavenName: 'Delhi Police Pink Booth — Janpath',
    nearestHavenDistance: '180 m',
    isOpen247: true,
    details: '24/7 Verified Pink Booth with women police staff on duty 180m ahead.',
    scoreDelta: 4
  },
  policePatrol: {
    status: 'active_pcr_pink_booth',
    label: 'Active PCR Van & Beat Patrol',
    details: 'Parliament Street PCR Mobile Patrol Unit active on Sansad Marg beat.',
    scoreDelta: 3
  }
};

// Scenario Presets showcasing Challenge 1 scenarios
export const CONDITION_SCENARIO_PRESETS: ConditionScenarioPreset[] = [
  {
    id: 'optimal',
    name: 'Optimal Baseline Conditions',
    tagline: 'All safety indicators green',
    iconName: 'ShieldCheck',
    description: 'Optimal 96-lux LED lighting, bustling pedestrian activity, nearby 24/7 Pink Booth, zero road blockades.',
    expectedScore: 93,
    severity: 'low',
    conditions: {
      ...DEFAULT_OPTIMAL_CONDITIONS
    }
  },
  {
    id: 'streetlight_failure',
    name: 'Streetlight Grid Failure',
    tagline: 'Sudden Dark Stretch (-18 pts)',
    iconName: 'LightbulbOff',
    description: 'Municipal transformer trip plunges 350m stretch into darkness (18 Lux). Visibility drastically reduced.',
    expectedScore: 75,
    severity: 'moderate',
    conditions: {
      ...DEFAULT_OPTIMAL_CONDITIONS,
      lighting: {
        status: 'failed',
        luxLevel: 18,
        label: 'Grid Power Failure (18 Lux)',
        details: 'Transformer outage reported across 350m corridor. NDMC dark spot alert active.',
        scoreDelta: -18
      }
    }
  },
  {
    id: 'crowd_dispersal',
    name: 'Deserted Stretch / Low Footfall',
    tagline: 'Footfall Plummets (-15 pts)',
    iconName: 'UserMinus',
    description: 'Commercial market closure causes pedestrian activity to drop rapidly from 52/min to 4/min, creating an isolated corridor.',
    expectedScore: 78,
    severity: 'moderate',
    conditions: {
      ...DEFAULT_OPTIMAL_CONDITIONS,
      pedestrian: {
        status: 'deserted',
        footfallPerMin: 4,
        density: 'Deserted',
        label: 'Isolated Stretch (4/min)',
        details: 'Storefronts shuttered. Pedestrian presence dropped below safe baseline threshold.',
        scoreDelta: -15
      }
    }
  },
  {
    id: 'gathering_blockade',
    name: 'Public Gathering & Police Barricade',
    tagline: 'Road Disruption Ahead (-19 pts)',
    iconName: 'AlertOctagon',
    description: 'Civic assembly and precautionary police barricade block intersection 200m ahead on current trajectory.',
    expectedScore: 72,
    severity: 'high',
    conditions: {
      ...DEFAULT_OPTIMAL_CONDITIONS,
      gathering: {
        status: 'road_blockage',
        label: 'Barricaded Intersection (200m Ahead)',
        locationName: 'Ashoka Rd & Patel Chowk Crossing',
        details: 'Police barricades narrowing road width. Pedestrian crossing restricted.',
        scoreDelta: -19
      }
    }
  },
  {
    id: 'compound_risk',
    name: 'Compound Risk (Challenge 1 Example)',
    tagline: 'Lighting Failure + Low Activity + Blockade (-39 pts)',
    iconName: 'AlertTriangle',
    description: 'Primary Challenge 1 Scenario: Street lighting fails (18 Lux), footfall collapses to 3/min, and road diversion detected. Route safety drops to 54%. Rerouting strongly advised.',
    expectedScore: 54,
    severity: 'critical',
    conditions: {
      lighting: {
        status: 'failed',
        luxLevel: 16,
        label: 'Power Outage (16 Lux)',
        details: 'Dark spot generated — complete loss of municipal lighting.',
        scoreDelta: -20
      },
      pedestrian: {
        status: 'deserted',
        footfallPerMin: 3,
        density: 'Deserted',
        label: 'Deserted Stretch (3/min)',
        details: 'Footfall collapsed after 10 PM. No open commercial eyes on street.',
        scoreDelta: -16
      },
      gathering: {
        status: 'road_blockage',
        label: 'Civic Blockade & Diversion',
        locationName: 'Radial Road 2 Crossing',
        details: 'Pedestrian sidewalk restricted with barrier fencing.',
        scoreDelta: -12
      },
      safeHaven: {
        status: 'limited',
        nearestHavenName: 'Connaught Place PS (Out of range)',
        nearestHavenDistance: '850 m',
        isOpen247: true,
        details: 'Nearest safe refuge is >800m away through unlit segment.',
        scoreDelta: -4
      },
      policePatrol: {
        status: 'reduced',
        label: 'No Active Patrol in Segment',
        details: 'Patrol van redirected to main roundabout.',
        scoreDelta: -5
      }
    }
  },
  {
    id: 'safe_haven_corridor',
    name: 'Safe Haven Green Corridor',
    tagline: 'High Security Boost (+8 pts)',
    iconName: 'Shield',
    description: 'User enters high-security zone with active 24/7 Delhi Police Pink Booth, continuous CCTV, and Apollo 24/7 pharmacy.',
    expectedScore: 98,
    severity: 'low',
    conditions: {
      ...DEFAULT_OPTIMAL_CONDITIONS,
      safeHaven: {
        status: 'optimal_nearby',
        nearestHavenName: 'Delhi Police Pink Booth (50m) + Apollo 24/7 (120m)',
        nearestHavenDistance: '50 m',
        isOpen247: true,
        details: 'Dual verified safe havens with female staff and SOS hotlink within 50m.',
        scoreDelta: 8
      },
      policePatrol: {
        status: 'active_pcr_pink_booth',
        label: 'Static Police Booth + 2 Patrol Officers',
        details: 'On-foot Delhi Police Pink Force marshals present.',
        scoreDelta: 6
      }
    }
  }
];

// Calculation function to derive current real-time safety score and breakdown
export function calculateDynamicSafety(
  baselineScore: number = 93,
  conditions: EnvironmentalConditionsState = DEFAULT_OPTIMAL_CONDITIONS
): DynamicSafetyCalculation {
  const factorBreakdown: FactorImpactBreakdown[] = [];
  const activeAlerts: string[] = [];

  // 1. Street Lighting Impact
  const lightingDelta = conditions.lighting.scoreDelta;
  factorBreakdown.push({
    id: 'factor-lighting',
    name: 'Street Lighting & Illumination',
    category: 'lighting',
    status: `${conditions.lighting.luxLevel} Lux (${conditions.lighting.status})`,
    scoreDelta: lightingDelta,
    description: conditions.lighting.details,
    isPositive: lightingDelta >= 0,
    icon: lightingDelta < 0 ? 'LightbulbOff' : 'SunMedium'
  });
  if (conditions.lighting.status === 'failed' || conditions.lighting.status === 'dark_spot') {
    activeAlerts.push(`Street lighting failure: Illumination dropped to ${conditions.lighting.luxLevel} Lux (${lightingDelta} pts)`);
  }

  // 2. Pedestrian Activity Impact
  const pedestrianDelta = conditions.pedestrian.scoreDelta;
  factorBreakdown.push({
    id: 'factor-pedestrian',
    name: 'Pedestrian & Crowd Footfall',
    category: 'pedestrian',
    status: `${conditions.pedestrian.density} (${conditions.pedestrian.footfallPerMin}/min)`,
    scoreDelta: pedestrianDelta,
    description: conditions.pedestrian.details,
    isPositive: pedestrianDelta >= 0,
    icon: pedestrianDelta < 0 ? 'UserMinus' : 'Users'
  });
  if (conditions.pedestrian.status === 'low' || conditions.pedestrian.status === 'deserted') {
    activeAlerts.push(`Pedestrian activity dropped to ${conditions.pedestrian.footfallPerMin} people/min (${pedestrianDelta} pts)`);
  }

  // 3. Public Gathering & Road Disruption Impact
  const gatheringDelta = conditions.gathering.scoreDelta;
  if (conditions.gathering.status !== 'none') {
    factorBreakdown.push({
      id: 'factor-gathering',
      name: 'Road Disruption / Gathering',
      category: 'gathering',
      status: conditions.gathering.label,
      scoreDelta: gatheringDelta,
      description: conditions.gathering.details,
      isPositive: false,
      icon: 'AlertTriangle'
    });
    activeAlerts.push(`Disruption reported: ${conditions.gathering.label} at ${conditions.gathering.locationName}`);
  }

  // 4. Safe Haven Availability Impact
  const havenDelta = conditions.safeHaven.scoreDelta;
  factorBreakdown.push({
    id: 'factor-safehaven',
    name: 'Verified Safe Haven Proximity',
    category: 'safe_haven',
    status: `${conditions.safeHaven.nearestHavenName} (${conditions.safeHaven.nearestHavenDistance})`,
    scoreDelta: havenDelta,
    description: conditions.safeHaven.details,
    isPositive: havenDelta >= 0,
    icon: 'ShieldCheck'
  });
  if (havenDelta < 0) {
    activeAlerts.push(`Safe haven out of direct range (${conditions.safeHaven.nearestHavenDistance})`);
  }

  // 5. Police Patrol Coverage
  const policeDelta = conditions.policePatrol.scoreDelta;
  factorBreakdown.push({
    id: 'factor-police',
    name: 'Police & Security Presence',
    category: 'police',
    status: conditions.policePatrol.label,
    scoreDelta: policeDelta,
    description: conditions.policePatrol.details,
    isPositive: policeDelta >= 0,
    icon: 'Shield'
  });

  // Calculate sum of deltas
  const totalDelta = lightingDelta + pedestrianDelta + gatheringDelta + havenDelta + policeDelta;
  const rawScore = baselineScore + totalDelta;
  const currentScore = Math.max(25, Math.min(99, rawScore));
  const scoreDelta = currentScore - baselineScore;

  // Determine status level and colors
  let statusLevel: 'optimal' | 'moderate' | 'compromised' | 'critical';
  let statusLabel: string;
  let statusColor: string;
  let recommendedAction: 'continue' | 'caution' | 'reroute_recommended' | 'emergency_evacuate';
  let summaryMessage: string;

  if (currentScore >= 85) {
    statusLevel = 'optimal';
    statusLabel = 'Optimal Safe Route';
    statusColor = '#10B981';
    recommendedAction = 'continue';
    summaryMessage = 'Current route conditions remain highly suitable with strong illumination and verified safe havens.';
  } else if (currentScore >= 72) {
    statusLevel = 'moderate';
    statusLabel = 'Caution: Degraded Conditions';
    statusColor = '#F59E0B';
    recommendedAction = 'caution';
    summaryMessage = 'Minor environmental degradation detected along current trajectory. Stay vigilant and monitor updates.';
  } else if (currentScore >= 55) {
    statusLevel = 'compromised';
    statusLabel = 'Compromised Safety: Reroute Advised';
    statusColor = '#EF4444';
    recommendedAction = 'reroute_recommended';
    summaryMessage = 'Significant risk factors identified ahead (lighting outage & low activity). Safe alternative route is available.';
  } else {
    statusLevel = 'critical';
    statusLabel = 'Critical Risk: Immediate Detour';
    statusColor = '#DC2626';
    recommendedAction = 'emergency_evacuate';
    summaryMessage = 'Multiple severe hazards detected ahead. Immediate diversion to Grand Blvd Safe Corridor strongly advised.';
  }

  return {
    baselineScore,
    currentScore,
    scoreDelta,
    statusLevel,
    statusLabel,
    statusColor,
    factorBreakdown,
    activeAlerts,
    recommendedAction,
    summaryMessage,
    alternativeRouteAvailable: currentScore < 80,
    alternativeGain: currentScore < 80 ? Math.max(15, 91 - currentScore) : 0
  };
}

// -------------------------------------------------------------
// Challenge 3: Adaptive Recommendation Reassessment Engine
// -------------------------------------------------------------

export function evaluateAdaptiveRecommendation(
  currentRoute: RouteOption,
  allRoutes: RouteOption[],
  conditions: EnvironmentalConditionsState,
  dynamicCalculation: DynamicSafetyCalculation
): AdaptiveRecommendationState {
  const currentScore = dynamicCalculation.currentScore;
  const initialScore = dynamicCalculation.baselineScore;
  
  // Find the candidate alternative routes (excluding currently followed route)
  const candidateAlternatives = allRoutes.filter(r => r.id !== currentRoute.id);
  
  // Sort candidates by safetyScore descending
  const sortedAlternatives = [...candidateAlternatives].sort((a, b) => b.safetyScore - a.safetyScore);
  const bestAlternative = sortedAlternatives[0] || currentRoute;

  // Recommendation changes if current score dropped significantly (<75) and a safer alternative exists
  const hasRecommendationChanged = currentScore < 75 && bestAlternative.safetyScore > currentScore + 10;
  
  const scoreGain = Math.max(0, bestAlternative.safetyScore - currentScore);

  // Derive trigger cause from negative factors
  const negativeFactors = dynamicCalculation.factorBreakdown.filter(f => f.scoreDelta < 0);
  const primaryTrigger = negativeFactors.length > 0
    ? negativeFactors.map(f => `${f.name} (${f.scoreDelta} pts)`).join(' + ')
    : 'Environmental conditions degraded along trajectory';

  // Natural Language Explainable Reason for the change
  const whyRecommendationChanged = hasRecommendationChanged
    ? `SafeRoute AI re-evaluated all available corridors in response to real-time condition updates. Your current route (${currentRoute.name}) safety score degraded from ${initialScore}% to ${currentScore}% due to ${negativeFactors.map(f => f.status).join(' and ')}. 

We now recommend switching to "${bestAlternative.name}" because it provides continuous 96-Lux illumination, stays within 180m of 24/7 verified Safe Havens (Pink Booth), and bypasses all reported disruptions. This yields a +${scoreGain}% safety index improvement for an estimated trade-off of only ${bestAlternative.time} (vs your current estimated arrival).`
    : `Current route (${currentRoute.name}) conditions remain within acceptable safety thresholds (${currentScore}% index). No recommendation change is required at this time.`;

  // Factor by factor comparison
  const factorComparison: FactorComparisonItem[] = [
    {
      factorName: 'Street Lighting & Illumination',
      category: 'lighting',
      currentRouteValue: `${conditions.lighting.luxLevel} Lux (${conditions.lighting.status === 'optimal' ? 'Well-Lit' : 'Dark/Outage'})`,
      recommendedRouteValue: '96 Lux (High-Visibility Smart LED)',
      isAdvantage: conditions.lighting.luxLevel < 70,
      scoreImpact: conditions.lighting.luxLevel < 70 ? '+20 pts advantage' : 'Equal'
    },
    {
      factorName: 'Pedestrian Activity Density',
      category: 'pedestrian',
      currentRouteValue: `${conditions.pedestrian.density} (${conditions.pedestrian.footfallPerMin} people/min)`,
      recommendedRouteValue: 'High Density (52+ people/min, active storefronts)',
      isAdvantage: conditions.pedestrian.footfallPerMin < 20,
      scoreImpact: conditions.pedestrian.footfallPerMin < 20 ? '+16 pts advantage' : 'Equal'
    },
    {
      factorName: 'Public Gatherings & Road Blocks',
      category: 'gathering',
      currentRouteValue: conditions.gathering.status === 'none' ? 'Clear' : `${conditions.gathering.label}`,
      recommendedRouteValue: 'Clear arterial road, zero barricades',
      isAdvantage: conditions.gathering.status !== 'none',
      scoreImpact: conditions.gathering.status !== 'none' ? '+19 pts advantage' : 'Equal'
    },
    {
      factorName: '24/7 Safe Haven Access',
      category: 'safe_haven',
      currentRouteValue: `${conditions.safeHaven.nearestHavenName} (${conditions.safeHaven.nearestHavenDistance})`,
      recommendedRouteValue: '4 Verified Havens (Delhi Police Pink Booth, Fortis 24/7, Apollo)',
      isAdvantage: true,
      scoreImpact: '+8 pts advantage'
    },
    {
      factorName: 'Estimated Travel Time',
      category: 'eta',
      currentRouteValue: currentRoute.time,
      recommendedRouteValue: bestAlternative.time,
      isAdvantage: false,
      scoreImpact: `${bestAlternative.time} (trade-off for personal safety)`
    }
  ];

  return {
    hasRecommendationChanged,
    initialRouteId: currentRoute.id,
    initialRouteName: currentRoute.name,
    initialRouteScore: initialScore,
    currentRouteScore: currentScore,
    recommendedRouteId: hasRecommendationChanged ? bestAlternative.id : currentRoute.id,
    recommendedRouteName: hasRecommendationChanged ? bestAlternative.name : currentRoute.name,
    recommendedRouteScore: hasRecommendationChanged ? bestAlternative.safetyScore : currentScore,
    scoreGain,
    timeDelta: '+4 min',
    distanceDelta: '+400m',
    triggerCause: primaryTrigger,
    whyRecommendationChanged,
    keyProtections: [
      'Bypasses dark unlit stretch & 16 Lux outage zone',
      '4 Verified 24/7 Safe Havens along alternative corridor',
      'Continuous Delhi Police Pink Booth & PCR beat presence',
      'Active commercial footfall (>50 pedestrians/min)'
    ],
    factorComparison,
    confidencePct: 96,
    timestamp: 'Just now (Live sensor telemetry)',
    tradeoffSummary: {
      safetyAdvantage: `+${scoreGain}% Safety Boost (${currentScore}% → ${bestAlternative.safetyScore}%)`,
      timeCost: '+4 minutes extra travel time',
      convenienceNote: 'Wide pedestrian sidewalks with uninterrupted CCTV surveillance'
    }
  };
}

