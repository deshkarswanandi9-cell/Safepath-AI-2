import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Siren, 
  Radio, 
  Phone, 
  Car, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Navigation, 
  Camera, 
  Send, 
  Clock, 
  Users, 
  Volume2, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ChevronRight, 
  Search, 
  Activity, 
  Lock, 
  ExternalLink, 
  Sparkles,
  Smartphone,
  Eye,
  Sliders,
  Check,
  AlertOctagon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapEngine } from '../MapEngine';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  INITIAL_PROACTIVE_SESSION_MOCK, 
  simulateAnomalyDeviation, 
  simulateProlongedStop, 
  initiateOperatorVerification, 
  handleUserConfirmSafe, 
  handleEscalateDispatch, 
  handleExtendEtaThreshold 
} from '../../data/proactivePoliceMonitoring';
import { ProactiveSafetySession, ScreenId } from '../../types';

interface PoliceCommandCenterProps {
  onSwitchToCitizenApp: () => void;
  onNavigateCitizenScreen?: (screen: ScreenId) => void;
}

export const PoliceCommandCenter: React.FC<PoliceCommandCenterProps> = ({
  onSwitchToCitizenApp,
  onNavigateCitizenScreen,
}) => {
  const { profile, liveTime, liveDate } = useUser();
  const { t } = useLanguage();

  const [session, setSession] = useState<ProactiveSafetySession>(() => {
    return {
      ...INITIAL_PROACTIVE_SESSION_MOCK,
      userName: profile.full_name || 'Swanandi Deshkar',
      userPhone: profile.phone_number || '+91 98765 43210',
    };
  });

  // Keep session username updated if profile changes
  useEffect(() => {
    if (profile.full_name) {
      setSession(prev => ({
        ...prev,
        userName: profile.full_name,
        userPhone: profile.phone_number || prev.userPhone
      }));
    }
  }, [profile.full_name, profile.phone_number]);

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('incident-1');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'active'>('all');
  const [operatorChatInput, setOperatorChatInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'telemetry' | 'cctv' | 'sop'>('telemetry');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);
  const [activeCctvCam, setActiveCctvCam] = useState<string>('CAM-04 (Ashoka Bypass)');

  const [chatMessages, setChatMessages] = useState<{ sender: 'citizen' | 'police'; text: string; time: string }[]>([
    {
      sender: 'police',
      text: `Namaste ${profile.full_name?.split(' ')[0] || 'Citizen'}. This is SI Meena Sharma at the Delhi Police Women Safety PCR Desk. Your journey telemetry is live.`,
      time: '10:14 PM'
    },
    {
      sender: 'citizen',
      text: 'Thank you officer. Driver took an unlit bypass lane, feeling uncomfortable.',
      time: '10:15 PM'
    },
    {
      sender: 'police',
      text: 'Locked cab DL 1ZB 9482 on radar. PCR Van #42 alerted on standby in your sector.',
      time: '10:16 PM'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendOperatorChat = () => {
    if (!operatorChatInput.trim()) return;
    const newMsg = {
      sender: 'police' as const,
      text: operatorChatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    setOperatorChatInput('');
    showToast('Dispatched encrypted communication to citizen handset.');
  };

  const handleSimulateOffRoute = () => {
    setSession(prev => simulateAnomalyDeviation(prev));
    showToast('🚨 Simulated: Off-Route Deviation trigger sent to PCR console');
  };

  const handleSimulateStop = () => {
    setSession(prev => simulateProlongedStop(prev));
    showToast('⏱️ Simulated: Prolonged vehicle stoppage (>4 mins)');
  };

  const handleDispatchPcrVan = () => {
    setSession(prev => handleEscalateDispatch(prev));
    showToast('🚨 URGENT: PCR Van #42 dispatched to vehicle coordinates (ETA 2.5 min)');
  };

  const handleToggleSiren = () => {
    setIsSirenActive(prev => !prev);
    showToast(!isSirenActive ? '🔊 High-Decibel Remote Deterrent Siren Activated on Citizen App!' : 'Siren Deactivated.');
  };

  return (
    <div className="w-full h-full min-h-screen bg-neutral-950 text-white flex flex-col font-sans select-none overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. TOP COMMAND HEADER & CONTROL BAR                                       */}
      {/* ========================================================================= */}
      <header className="h-14 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between shrink-0 z-30">
        {/* Left: Law Enforcement Badge & Unit Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center shadow-lg shadow-red-900/30 border border-red-400/30">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-white">
                DELHI POLICE PCR & WOMEN SAFETY COMMAND HQ
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                112 LIVE DISPATCH
              </span>
            </div>
            <div className="text-[10px] text-neutral-400 flex items-center gap-2 font-medium">
              <span>Desk #4: SI Meena Sharma (Badge #DL-PCR-7492)</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Supabase DB: Connected (14ms)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live Telemetry Status & Switch to Mobile View */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/60 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-300">{liveDate}</span>
            <span className="text-white font-mono">{liveTime}</span>
          </div>

          {/* Quick Switch to Citizen Phone View */}
          <button
            type="button"
            onClick={onSwitchToCitizenApp}
            className="px-3 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Switch to Citizen App</span>
          </button>
        </div>
      </header>

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-neutral-900 border border-red-500/60 text-white text-xs font-bold shadow-2xl flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. THREE-PANEL COMMAND WORKSTATION GRID                                    */}
      {/* ========================================================================= */}
      <div className="flex-1 grid grid-cols-12 gap-3 p-3 min-h-0 overflow-hidden">
        
        {/* ======================================================================= */}
        {/* LEFT COLUMN: LIVE INCIDENTS & MONITORED CITIZENS (Cols 1-3)             */}
        {/* ======================================================================= */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex flex-col flex-1 min-h-0 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-black text-white">
                <Radio className="w-3.5 h-3.5 text-red-500" />
                <span>ACTIVE RADAR SESSIONS ({filterSeverity === 'critical' ? '1' : '3'})</span>
              </div>
              <span className="text-[10px] font-bold text-neutral-400">Auto-refresh 5s</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 my-2">
              <button
                type="button"
                onClick={() => setFilterSeverity('all')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                  filterSeverity === 'all'
                    ? 'bg-neutral-700 text-white'
                    : 'bg-neutral-800/60 text-neutral-400 hover:text-white'
                }`}
              >
                All (3)
              </button>
              <button
                type="button"
                onClick={() => setFilterSeverity('critical')}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                  filterSeverity === 'critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-800/60 text-neutral-400 hover:text-white'
                }`}
              >
                🚨 Critical (1)
              </button>
            </div>

            {/* Incident Cards List */}
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 no-scrollbar">
              
              {/* Primary Active Session: User e.g. Swanandi Deshkar */}
              <div 
                onClick={() => setSelectedIncidentId('incident-1')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  selectedIncidentId === 'incident-1'
                    ? 'bg-neutral-800/90 border-red-500 ring-1 ring-red-500/50 shadow-md'
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-black text-white truncate">{session.userName}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-black">
                        {session.status === 'anomaly_detected' ? 'ANOMALY' : 'ESCORT'}
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      {session.vehicleInfo.serviceProvider} • {session.vehicleInfo.vehicleNumber}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-red-400">Risk 88%</span>
                </div>

                <div className="mt-2 text-[10px] bg-neutral-950/80 p-1.5 rounded-lg text-neutral-300 border border-neutral-800 flex items-center justify-between">
                  <span className="truncate">Ashoka Rd Radial Bypass</span>
                  <span className="text-amber-400 font-bold shrink-0">Dev: +340m</span>
                </div>
              </div>

              {/* Mock Incident 2: Priya Verma */}
              {filterSeverity !== 'critical' && (
                <div 
                  onClick={() => setSelectedIncidentId('incident-2')}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedIncidentId === 'incident-2'
                      ? 'bg-neutral-800/90 border-emerald-500 ring-1 ring-emerald-500/50'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-black text-white truncate">Priya Verma</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black">
                          WALK
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">Green Park Metro Corridor</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400">Safe 94%</span>
                  </div>
                </div>
              )}

              {/* Mock Incident 3: Aarav Nair */}
              {filterSeverity !== 'critical' && (
                <div 
                  onClick={() => setSelectedIncidentId('incident-3')}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    selectedIncidentId === 'incident-3'
                      ? 'bg-neutral-800/90 border-neutral-500 ring-1 ring-neutral-500/50'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-xs font-black text-white truncate">Aarav Nair</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-black">
                          TRANSIT
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">DTC Bus #412 • Ring Road</p>
                    </div>
                    <span className="text-[10px] font-bold text-blue-400">Normal</span>
                  </div>
                </div>
              )}

            </div>

            {/* Simulation Triggers for Hackathon Demonstration */}
            <div className="pt-2 border-t border-neutral-800 space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block">
                ⚡ Simulation Test Controls
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={handleSimulateOffRoute}
                  className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold text-left cursor-pointer transition-colors"
                >
                  + Trigger Deviation
                </button>
                <button
                  type="button"
                  onClick={handleSimulateStop}
                  className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[10px] font-bold text-left cursor-pointer transition-colors"
                >
                  + Trigger Stop
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* CENTER COLUMN: TACTICAL GIS MAP & LIVE VEHICLE RADAR (Cols 4-8)        */}
        {/* ======================================================================= */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-3 min-h-0">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex flex-col flex-1 min-h-0 shadow-lg relative overflow-hidden">
            
            {/* Tactical Map Header Bar */}
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 z-10">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  TACTICAL LIVE GIS & RADAR INTERCEPT
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-400">
                <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                  PCR Patrol Fleet: 4 Units
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                  Pink Booths: 3 Active
                </span>
              </div>
            </div>

            {/* Tactical Map Container */}
            <div className="flex-1 min-h-64 relative rounded-xl overflow-hidden my-2 border border-neutral-800">
              <MapEngine 
                variant="police"
                className="w-full h-full"
                showHeatmap={true}
                showHavens={true}
              />

              {/* Floating Live Telemetry Overlay */}
              <div className="absolute top-2 left-2 right-2 bg-neutral-950/90 backdrop-blur-md p-2.5 rounded-xl border border-neutral-800 text-xs flex items-center justify-between shadow-2xl z-20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-black">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-black text-white text-xs">{session.vehicleInfo.vehicleNumber} ({session.vehicleInfo.serviceProvider})</div>
                    <div className="text-[10px] text-neutral-400">Driver: {session.vehicleInfo.driverName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">{session.vehicleInfo.currentSpeedKmH} km/h</div>
                    <div className="text-[9px] text-neutral-500">SPEED</div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-bold">18 Lux</div>
                    <div className="text-[9px] text-neutral-500">LIGHTING</div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-bold">{session.pcrDispatchInfo.etaMins} min</div>
                    <div className="text-[9px] text-neutral-500">VAN #42 ETA</div>
                  </div>
                </div>
              </div>

              {/* CCTV Camera Mini-Feed Selector at Bottom */}
              <div className="absolute bottom-2 left-2 right-2 bg-neutral-950/90 backdrop-blur-md p-2 rounded-xl border border-neutral-800 z-20 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 font-bold text-neutral-300">
                  <Camera className="w-3.5 h-3.5 text-blue-400" />
                  <span>Municipal CCTV Mesh:</span>
                </div>
                <div className="flex items-center gap-1">
                  {['CAM-04 (Ashoka Bypass)', 'CAM-11 (Janpath Jn)', 'CAM-18 (Pink Booth)'].map(cam => (
                    <button
                      key={cam}
                      type="button"
                      onClick={() => setActiveCctvCam(cam)}
                      className={`px-2 py-0.5 rounded text-[9px] font-bold transition-colors cursor-pointer ${
                        activeCctvCam === cam
                          ? 'bg-blue-600 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {cam.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Real-time Telemetry Bar */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
              <div className="bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
                <span className="text-neutral-500 block text-[9px]">DEVIATION</span>
                <span className="text-amber-400">{session.vehicleInfo.routeDeviationMeters} m</span>
              </div>
              <div className="bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
                <span className="text-neutral-500 block text-[9px]">MAX THRESHOLD</span>
                <span className="text-white">{session.maxThresholdMinutes} min</span>
              </div>
              <div className="bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
                <span className="text-neutral-500 block text-[9px]">BEAT UNIT</span>
                <span className="text-emerald-400">{session.pcrDispatchInfo.unitId.split(' ')[2]}</span>
              </div>
              <div className="bg-neutral-950 p-1.5 rounded-lg border border-neutral-800">
                <span className="text-neutral-500 block text-[9px]">PHONE BATTERY</span>
                <span className="text-white">84%</span>
              </div>
            </div>

          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: DISPATCH CONSOLE & 2-WAY OPERATOR UPLINK (Cols 9-12)      */}
        {/* ======================================================================= */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0">
          
          {/* Dispatch Actions Suite */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 shadow-lg space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <Siren className="w-3.5 h-3.5 text-red-500" />
                <span>Standard Operating Procedure (SOP)</span>
              </span>
            </div>

            {/* Main Action Buttons */}
            <button
              type="button"
              onClick={handleDispatchPcrVan}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 cursor-pointer transition-all"
            >
              <Car className="w-4 h-4" />
              <span>DISPATCH PCR VAN #42 (INTERCEPT)</span>
            </button>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={handleToggleSiren}
                className={`py-1.5 px-2 rounded-xl border text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isSirenActive
                    ? 'bg-amber-600 border-amber-400 text-white animate-pulse'
                    : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-neutral-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSirenActive ? 'STOP SIREN' : 'SIREN ALARM'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSession(prev => initiateOperatorVerification(prev));
                  showToast('Operator Verification Ping pushed to citizen mobile.');
                }}
                className="py-1.5 px-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-[11px] font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>PING CITIZEN</span>
              </button>
            </div>
          </div>

          {/* 2-Way Operator Uplink Terminal */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 flex flex-col flex-1 min-h-0 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-1.5 text-xs font-black text-white">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>2-WAY OPERATOR ↔ CITIZEN UPLINK</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black">
                ENCRYPTED
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 no-scrollbar text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl max-w-[90%] ${
                    msg.sender === 'police'
                      ? 'ml-auto bg-neutral-800 text-neutral-100 border border-neutral-700'
                      : 'mr-auto bg-red-950/60 text-red-200 border border-red-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5 text-[9px] font-bold opacity-75">
                    <span>{msg.sender === 'police' ? 'SI Meena (Desk #4)' : session.userName}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="pt-2 border-t border-neutral-800 flex items-center gap-1.5">
              <input
                type="text"
                value={operatorChatInput}
                onChange={(e) => setOperatorChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOperatorChat()}
                placeholder="Type command message to passenger..."
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={handleSendOperatorChat}
                className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white cursor-pointer transition-colors"
                title="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
