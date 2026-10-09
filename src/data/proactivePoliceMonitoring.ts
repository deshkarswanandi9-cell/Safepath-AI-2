import { ProactiveSafetySession, VehicleTelemetry, TelemetryLogEntry, PcrDispatchUnit } from '../types';

export const INITIAL_PROACTIVE_SESSION_MOCK: ProactiveSafetySession = {
  id: 'PCR-DL-2026-8841',
  userName: 'Shivani Sharma',
  userPhone: '+91 98112 45890',
  userEmergencyContact: 'Rohan Sharma (Brother) • +91 98112 45891',
  initialConcern: 'Driver took an unlit secondary bypass road without asking; feel uncomfortable with sudden route detour.',
  status: 'active_monitoring',
  startedAt: '10:14 PM',
  expectedEta: '10:32 PM (18 min)',
  maxThresholdMinutes: 22,
  elapsedMinutes: 6,
  originName: 'Janpath Metro Station Gate 2',
  destinationName: 'Westwood Residency, Tower B',
  currentLocationCoords: { x: 38, y: 52 },
  currentLocationName: 'Near Ashoka Road Junction (Radial Bypass)',
  vehicleInfo: {
    serviceProvider: 'Uber',
    vehicleNumber: 'DL 1ZB 9482',
    driverName: 'Ramesh K. (4.72 ★)',
    driverRating: '4.72 ★ (840 trips)',
    currentSpeedKmH: 34,
    routeDeviationMeters: 45,
    prolongedStopDurationSec: 0,
    isOffRoute: false
  },
  authorizedAgency: {
    name: 'Delhi Police Command & Control Centre (112)',
    unitName: 'Special Women Safety & Transit Monitoring Desk',
    operatorName: 'Sub-Inspector Meena Sharma',
    operatorBadge: 'DL-PCR-7492',
    controlRoomStation: 'Parliament Street HQ Central Console',
    helpline: '112 / 1091'
  },
  telemetryLogs: [
    {
      id: 'log-1',
      timestamp: '10:14:02 PM',
      event: 'User reported feeling uncomfortable via SafeRoute AI chatbot',
      severity: 'info',
      details: 'Discreet intake completed. User gave authorized consent to stream live GPS & Cab telemetry to Police Control Room.'
    },
    {
      id: 'log-2',
      timestamp: '10:14:15 PM',
      event: 'Session PCR-DL-2026-8841 activated with Delhi Police PCR Desk #4',
      severity: 'info',
      details: 'Operator SI Meena Sharma assigned. Max safe threshold locked at 22 minutes (10:36 PM).'
    },
    {
      id: 'log-3',
      timestamp: '10:17:40 PM',
      event: 'Vehicle Telemetry Stream Synchronized: DL 1ZB 9482',
      severity: 'info',
      details: 'Speed: 38 km/h. Moving along Ashoka Rd. Zero deviation.'
    }
  ],
  operatorNotes: [
    '10:14 PM: Monitored session initiated by passenger. Vehicle details verified against municipal transport registry.',
    '10:18 PM: Route telemetry active. Patrol Unit Van #42 alerted on standby in Sector 4 beat.'
  ],
  verificationAttempt: {
    status: 'none',
    method: 'in_app_prompt',
    operatorMessage: 'SafeRoute Operator Verification: Shivani, your cab appears to have paused or deviated. Are you safe? Please tap to confirm or speak.'
  },
  pcrDispatchInfo: {
    unitId: 'Delhi Police PCR Van #42',
    officerInCharge: 'ASI Rajesh Kumar & Constable Rekha',
    officerBadge: 'DL-PATROL-421',
    contactPhone: '112-EXT-42',
    vehicleType: 'Mahindra Scorpio PCR Mobile Patrol Unit',
    etaMins: 3,
    currentDistance: '1.1 km away (Janpath Beat)',
    assignedAt: 'Standby mode',
    status: 'standby'
  }
};

// Simulation Action Handlers for Challenge 4 Interactive Testing

export function simulateAnomalyDeviation(session: ProactiveSafetySession): ProactiveSafetySession {
  const newLogs: TelemetryLogEntry[] = [
    ...session.telemetryLogs,
    {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: '⚠️ Unexplained Route Deviation Detected (>320m off corridor)',
      severity: 'alert',
      details: 'Vehicle turned into unpaved service lane deviating from Westwood designated corridor.'
    }
  ];

  return {
    ...session,
    status: 'anomaly_detected',
    vehicleInfo: {
      ...session.vehicleInfo,
      routeDeviationMeters: 340,
      isOffRoute: true,
      currentSpeedKmH: 22
    },
    telemetryLogs: newLogs,
    operatorNotes: [
      ...session.operatorNotes,
      `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ALERT triggered - Vehicle deviated 340m onto unlit service road. Initiating verification protocol.`
    ]
  };
}

export function simulateProlongedStop(session: ProactiveSafetySession): ProactiveSafetySession {
  const newLogs: TelemetryLogEntry[] = [
    ...session.telemetryLogs,
    {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: '⚠️ Prolonged Stationary Stop Detected (>3 mins in unlit zone)',
      severity: 'alert',
      details: 'Vehicle speed dropped to 0 km/h with engine idling for 195 seconds at isolated coordinate.'
    }
  ];

  return {
    ...session,
    status: 'anomaly_detected',
    vehicleInfo: {
      ...session.vehicleInfo,
      currentSpeedKmH: 0,
      prolongedStopDurationSec: 195
    },
    telemetryLogs: newLogs,
    operatorNotes: [
      ...session.operatorNotes,
      `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: ALERT - Vehicle stationary for >3 min without traffic jam indicator.`
    ]
  };
}

export function initiateOperatorVerification(session: ProactiveSafetySession, method: 'in_app_prompt' | 'operator_call' | 'discreet_sms'): ProactiveSafetySession {
  const newLogs: TelemetryLogEntry[] = [
    ...session.telemetryLogs,
    {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: `Police Operator verification initiated via ${method === 'in_app_prompt' ? 'Discreet In-App Priority Prompt' : method === 'operator_call' ? 'Direct Voice Check' : 'Discreet SMS PIN'}`,
      severity: 'caution',
      details: 'Operator SI Meena Sharma sent verification challenge to confirm passenger safety status.'
    }
  ];

  return {
    ...session,
    status: 'operator_verifying',
    verificationAttempt: {
      status: 'initiated',
      attemptedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method,
      operatorMessage: 'SafeRoute Operator Verification: Shivani, we detected an unexpected vehicle stop/deviation. Are you safe? Tap below or reply.'
    },
    telemetryLogs: newLogs,
    operatorNotes: [
      ...session.operatorNotes,
      `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: Verification dispatch sent via ${method}. Waiting for passenger acknowledgment.`
    ]
  };
}

export function handleUserConfirmSafe(session: ProactiveSafetySession, closeSession: boolean = false): ProactiveSafetySession {
  const newLogs: TelemetryLogEntry[] = [
    ...session.telemetryLogs,
    {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: 'User Confirmed Safety ("I am Safe - Traffic / Legitimate Detour")',
      severity: 'info',
      details: closeSession ? 'User reached destination safely. Monitored session closed successfully.' : 'Monitoring continues in active background mode.'
    }
  ];

  return {
    ...session,
    status: closeSession ? 'safe_closed' : 'active_monitoring',
    verificationAttempt: {
      ...session.verificationAttempt,
      status: 'user_responded_safe'
    },
    vehicleInfo: {
      ...session.vehicleInfo,
      isOffRoute: false,
      routeDeviationMeters: 0,
      prolongedStopDurationSec: 0
    },
    telemetryLogs: newLogs,
    operatorNotes: [
      ...session.operatorNotes,
      `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: Passenger confirmed safety. ${closeSession ? 'Session closed cleanly.' : 'Active monitoring resumed.'}`
    ]
  };
}

export function handleEscalateDispatch(session: ProactiveSafetySession): ProactiveSafetySession {
  const newLogs: TelemetryLogEntry[] = [
    ...session.telemetryLogs,
    {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: '🚨 EMERGENCY DISPATCH ESCALATION: PCR Van #42 Intercept Dispatched',
      severity: 'escalation',
      details: 'Passenger indicated distress / no response to verification. PCR Van #42 dispatched to current GPS coordinates (Ashoka Rd Radial).'
    }
  ];

  return {
    ...session,
    status: 'escalated_dispatch',
    verificationAttempt: {
      ...session.verificationAttempt,
      status: 'user_requested_help'
    },
    pcrDispatchInfo: {
      ...session.pcrDispatchInfo!,
      status: 'en_route',
      assignedAt: 'Just now',
      etaMins: 2
    },
    telemetryLogs: newLogs,
    operatorNotes: [
      ...session.operatorNotes,
      `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: EMERGENCY ESCALATION. PCR Van #42 en route with siren mute protocol to prevent driver hostility.`
    ]
  };
}

export function handleExtendEtaThreshold(session: ProactiveSafetySession, addMinutes: number = 5): ProactiveSafetySession {
  const newThreshold = session.maxThresholdMinutes + addMinutes;
  const newLogs: TelemetryLogEntry[] = [
    ...session.telemetryLogs,
    {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      event: `User Extended Journey Threshold (+${addMinutes} mins for traffic delay)`,
      severity: 'info',
      details: `Max arrival threshold updated from ${session.maxThresholdMinutes}m to ${newThreshold}m.`
    }
  ];

  return {
    ...session,
    maxThresholdMinutes: newThreshold,
    telemetryLogs: newLogs,
    operatorNotes: [
      ...session.operatorNotes,
      `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}: Passenger added +${addMinutes} min buffer for legitimate traffic.`
    ]
  };
}
