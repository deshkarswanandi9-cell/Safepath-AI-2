import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Phone, 
  Car, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  Radio, 
  Send, 
  ChevronRight, 
  UserCheck, 
  Sparkles, 
  Activity, 
  Navigation, 
  AlertOctagon, 
  RotateCcw, 
  Building2,
  Check,
  X,
  MessageSquare,
  Shield,
  Siren,
  Sliders
} from 'lucide-react';
import { ScreenId, ProactiveSafetySession } from '../../types';
import { 
  INITIAL_PROACTIVE_SESSION_MOCK, 
  simulateAnomalyDeviation, 
  simulateProlongedStop, 
  initiateOperatorVerification, 
  handleUserConfirmSafe, 
  handleEscalateDispatch, 
  handleExtendEtaThreshold 
} from '../../data/proactivePoliceMonitoring';
import { MapEngine } from '../MapEngine';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useMonitoredJourney } from '../../hooks/useSupabase';
import { useUser } from '../../context/UserContext';

interface ProactivePoliceMonitoringScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenSos: () => void;
  onOpenPoliceCommandCenter?: () => void;
}

export const ProactivePoliceMonitoringScreen: React.FC<ProactivePoliceMonitoringScreenProps> = ({
  onNavigate,
  onOpenSos,
  onOpenPoliceCommandCenter
}) => {
  const { profile } = useUser();
  const [session, setSession] = useState<ProactiveSafetySession>(() => ({
    ...INITIAL_PROACTIVE_SESSION_MOCK,
    userName: profile.full_name || 'Swanandi Deshkar',
    userPhone: profile.phone_number || '+91 98765 43210',
  }));
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);
  const [operatorChatOpen, setOperatorChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const { startJourney, completeJourney, journeyId } = useMonitoredJourney();
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'operator'; text: string; time: string }[]>([
    { sender: 'operator', text: 'Namaste Shivani. I am Sub-Inspector Meena at the Women Safety PCR Desk. Your journey from Janpath to Westwood is under active monitoring. We are tracking your cab live.', time: '10:14 PM' },
    { sender: 'user', text: 'Thank you maam. Driver took an unlit secondary bypass, feeling a bit uneasy.', time: '10:15 PM' },
    { sender: 'operator', text: 'Understood. We have locked your cab DL 1ZB 9482 on radar and alerted PCR Van #42 on Ashoka beat. Stay relaxed and let us know if anything feels wrong.', time: '10:16 PM' }
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      sender: 'user' as const,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');

    setTimeout(() => {
      const reply = {
        sender: 'operator' as const,
        text: 'Acknowledged. Telemetry is stable at 34 km/h. Continuing to monitor.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, reply]);
    }, 800);
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar pb-20 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 left-4 right-4 z-50 p-3 rounded-2xl bg-neutral-900 border border-emerald-500/60 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="p-3.5 pt-2 pb-2 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-md sticky top-0 z-30 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                id="btn-police-monitoring-back"
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <h1 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                    Proactive Police Monitoring
                  </h1>
                </div>
                <p className="text-[10px] text-neutral-500">Non-emergency safety companion & PCR link</p>
              </div>
            </div>

            {/* External Portal Launcher Button: Open Police Command HQ */}
            {onOpenPoliceCommandCenter && (
              <button
                type="button"
                onClick={onOpenPoliceCommandCenter}
                className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shrink-0"
                title="Launch Full 112 Police Command Center Workstation"
              >
                <Siren className="w-3.5 h-3.5 animate-pulse" />
                <span>Police HQ Portal ↗</span>
              </button>
            )}
          </div>

          {/* Connection Status Pill */}
          <div className="flex items-center justify-between px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{session.authorizedAgency.unitName}</span>
            </div>
            <span className="font-extrabold text-[9px] px-1.5 py-0.2 rounded bg-emerald-200/50 dark:bg-emerald-800/50">
              {session.id}
            </span>
          </div>
        </div>

        {/* PASSENGER PERSPECTIVE */}
        <div className="p-3.5 space-y-3 flex-1">
            {/* Operator Verification Prompt Modal / Banner (When Triggered) */}
            {(session.status === 'operator_verifying' || session.status === 'anomaly_detected') && (
              <div className="p-3.5 rounded-2xl bg-amber-500/15 border-2 border-amber-500 text-black dark:text-white shadow-xl animate-in fade-in slide-in-from-top-2 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-xl bg-amber-500 text-black font-black">
                      <Phone className="w-4 h-4 animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                        Police Operator Safety Verification
                      </h3>
                      <p className="text-[10px] text-neutral-500">{session.authorizedAgency.operatorName}</p>
                    </div>
                  </div>
                  <Badge variant="caution" size="sm">Verification Required</Badge>
                </div>

                <p className="text-xs text-neutral-700 dark:text-neutral-200 leading-relaxed font-semibold bg-white/60 dark:bg-black/60 p-2.5 rounded-xl border border-amber-500/30">
                  "{session.verificationAttempt.operatorMessage}"
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button
                    id="btn-confirm-safe"
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2 shadow-md cursor-pointer"
                    onClick={() => {
                      setSession(prev => handleUserConfirmSafe(prev, false));
                      showToast('Safety confirmed to Delhi Police Control Room. Active monitoring continues.');
                    }}
                    icon={<Check className="w-3.5 h-3.5" />}
                  >
                    I am Safe (Traffic)
                  </Button>
                  <Button
                    id="btn-escalate-help"
                    variant="danger"
                    size="sm"
                    className="bg-red-600 hover:bg-red-500 text-white font-black text-xs py-2 shadow-md cursor-pointer"
                    onClick={() => {
                      setSession(prev => handleEscalateDispatch(prev));
                      showToast('🚨 Police PCR Patrol Van #42 has been dispatched to your exact GPS coordinates.');
                    }}
                    icon={<AlertOctagon className="w-3.5 h-3.5" />}
                  >
                    I Need Help! (Dispatch)
                  </Button>
                </div>
              </div>
            )}

            {/* Escalated Status Card */}
            {session.status === 'escalated_dispatch' && (
              <div className="p-3.5 rounded-2xl bg-red-600/15 border-2 border-red-500 text-white shadow-xl space-y-2 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Siren className="w-5 h-5 text-red-500" />
                    <span className="text-xs font-black uppercase text-red-500">
                      PCR Patrol Intercept En Route
                    </span>
                  </div>
                  <Badge variant="emergency" size="sm">ETA 2 Min</Badge>
                </div>
                <p className="text-xs text-neutral-300">
                  {session.pcrDispatchInfo?.unitId} ({session.pcrDispatchInfo?.officerInCharge}) is intercepting your cab near {session.currentLocationName}. Siren is muted for passenger discretion.
                </p>
              </div>
            )}

            {/* Map Preview of Monitored Route */}
            <div className="relative h-44 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
              <MapEngine
                heightClass="h-full"
                showHeatmap={true}
                showHelpPoints={true}
                interactive={false}
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/90 text-white text-[10px] font-bold flex items-center gap-1.5 shadow-xs">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>Live Encrypted Telemetry Stream</span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 rounded-lg bg-black/90 text-white text-[9px] font-bold">
                <span>Vehicle: {session.vehicleInfo.vehicleNumber}</span>
                <span>Speed: {session.vehicleInfo.currentSpeedKmH} km/h</span>
                <span className={session.vehicleInfo.routeDeviationMeters > 100 ? 'text-red-400' : 'text-emerald-400'}>
                  Dev: {session.vehicleInfo.routeDeviationMeters}m
                </span>
              </div>
            </div>

            {/* Journey Status & Time-Bound Threshold Card */}
            <Card variant="default" padding="sm" className="space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    Time-Bound Journey Threshold
                  </span>
                  <div className="text-xs font-black text-black dark:text-white mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Expected: {session.expectedEta}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-neutral-400 block">Max Buffer</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                    {session.maxThresholdMinutes} min (10:36 PM)
                  </span>
                </div>
              </div>

              {/* Progress Bar of Agreed Threshold */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[9px] font-bold text-neutral-500">
                  <span>Elapsed: {session.elapsedMinutes} min</span>
                  <span>Threshold: {session.maxThresholdMinutes} min</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${(session.elapsedMinutes / session.maxThresholdMinutes) * 100}%` }}
                  />
                </div>
              </div>

              {/* Vehicle & Ride Details */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-200 dark:border-neutral-800 text-[10px]">
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500 text-[9px] font-bold block">Cab Details</span>
                  <span className="text-black dark:text-white font-extrabold text-xs">{session.vehicleInfo.serviceProvider} • {session.vehicleInfo.vehicleNumber}</span>
                  <span className="text-neutral-500 text-[9px] block mt-0.5">{session.vehicleInfo.driverName}</span>
                </div>
                <div className="p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-500 text-[9px] font-bold block">Destination</span>
                  <span className="text-black dark:text-white font-extrabold text-xs truncate block">{session.destinationName}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[9px] font-bold block mt-0.5">Assigned: SI Meena</span>
                </div>
              </div>
            </Card>

            {/* Test Simulation Controls for Judges & Testing */}
            <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Challenge 4 Anomaly Simulator:</span>
                </span>
                <span className="text-[9px] font-bold text-neutral-400">Test Scenarios</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSession(prev => simulateAnomalyDeviation(prev));
                    showToast('⚠️ Route deviation detected (340m off corridor). Anomaly logged.');
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-black border border-amber-300 dark:border-amber-800/60 text-left text-xs font-bold hover:border-amber-500 transition-colors cursor-pointer"
                >
                  <div className="text-[10px] font-black text-amber-600 dark:text-amber-400">Simulate Deviation</div>
                  <div className="text-[8px] text-neutral-500 mt-0.5">Turns onto unlit alley</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSession(prev => simulateProlongedStop(prev));
                    showToast('⚠️ Prolonged stop detected (>3 mins idle). Anomaly logged.');
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-black border border-amber-300 dark:border-amber-800/60 text-left text-xs font-bold hover:border-amber-500 transition-colors cursor-pointer"
                >
                  <div className="text-[10px] font-black text-amber-600 dark:text-amber-400">Simulate Prolonged Stop</div>
                  <div className="text-[8px] text-neutral-500 mt-0.5">Idling 195s in dark spot</div>
                </button>
              </div>
            </div>

            {/* Passenger Action Buttons */}
            <div className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                {/* 1. Safe Arrival Confirmation */}
                <Button
                  id="btn-passenger-arrived-safely"
                  variant="primary"
                  size="md"
                  fullWidth
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs"
                  onClick={() => {
                    setSession(prev => handleUserConfirmSafe(prev, true));
                    showToast('Journey completed safely. Monitoring session closed and logged.');
                  }}
                  icon={<CheckCircle2 className="w-4 h-4" />}
                >
                  I Have Arrived Safely
                </Button>

                {/* 2. Extend Threshold (+5 min) */}
                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setSession(prev => handleExtendEtaThreshold(prev, 5));
                    showToast('+5 min added to journey threshold for traffic delay.');
                  }}
                  icon={<Clock className="w-4 h-4" />}
                >
                  Extend ETA (+5m)
                </Button>
              </div>

              {/* Discreet Chat with Operator */}
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setOperatorChatOpen(!operatorChatOpen)}
                icon={<MessageSquare className="w-4 h-4 text-emerald-500" />}
              >
                {operatorChatOpen ? 'Hide Discreet Operator Chat' : 'Discreet Chat with Operator Meena'}
              </Button>

              {/* Direct to Nearest Safe Place Finder */}
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={() => onNavigate('nearest_safe_place')}
                icon={<Building2 className="w-4 h-4 text-emerald-500" />}
              >
                Find & Navigate to Nearest Safe Place (Pink Booth 180m)
              </Button>

              {/* Emergency SOS Escalation */}
              <Button
                variant="danger"
                size="md"
                fullWidth
                onClick={onOpenSos}
                icon={<AlertOctagon className="w-4 h-4" />}
              >
                Trigger Immediate SOS Alarm
              </Button>
            </div>

            {/* Discreet Operator Chat Drawer */}
            {operatorChatOpen && (
              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-700 text-white space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black uppercase text-emerald-400">
                      Discreet PCR Chat • SI Meena
                    </span>
                  </div>
                  <span className="text-[9px] text-neutral-400">Silent Encrypted Channel</span>
                </div>

                <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar text-xs">
                  {chatMessages.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`p-2 rounded-xl text-[11px] leading-relaxed max-w-[85%] ${
                        m.sender === 'user'
                          ? 'ml-auto bg-emerald-600 text-white rounded-br-none'
                          : 'bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700'
                      }`}
                    >
                      <p>{m.text}</p>
                      <span className="text-[8px] opacity-70 block text-right mt-0.5">{m.time}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    placeholder="Type discreet message to operator..."
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-black text-white border border-neutral-700 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleSendChatMessage}
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
