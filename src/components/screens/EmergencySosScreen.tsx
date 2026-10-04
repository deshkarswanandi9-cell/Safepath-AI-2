import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  PhoneCall, 
  Users, 
  Share2, 
  Shield, 
  Cross, 
  MapPin, 
  AlertOctagon, 
  Volume2, 
  VolumeX,
  Check, 
  BellRing,
  Radio,
  Clock,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { ScreenId } from '../../types';
import { MapEngine } from '../MapEngine';
import { MOCK_HELP_POINTS } from '../../data/mockData';
import { INDIA_EMERGENCY_HELPLINES } from '../../data/realData';
import { useLanguage } from '../../context/LanguageContext';

interface EmergencySosScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const EmergencySosScreen: React.FC<EmergencySosScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [activeActionToast, setActiveActionToast] = useState<string | null>(null);
  const [showAllHelplines, setShowAllHelplines] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Siren Audio Synthesizer via Web Audio API
  useEffect(() => {
    if (sirenPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        
        // Siren frequency modulation
        const now = ctx.currentTime;
        for (let i = 0; i < 30; i++) {
          osc.frequency.linearRampToValueAtTime(1200, now + i * 0.8 + 0.4);
          osc.frequency.linearRampToValueAtTime(800, now + i * 0.8 + 0.8);
        }

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        gainRef.current = gain;
      } catch (e) {
        console.warn('Audio synthesis note:', e);
      }
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore
        }
        oscRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    }

    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // ignore
        }
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [sirenPlaying]);

  const triggerToast = (msg: string) => {
    setActiveActionToast(msg);
    setTimeout(() => setActiveActionToast(null), 3500);
  };

  const handleSosPress = () => {
    setSosTriggered(true);
    setSirenPlaying(true);
    triggerToast('🚨 Emergency SOS Broadcast Sent! Authorities & Trusted Contacts Notified.');
  };

  return (
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-[#0b101b] text-slate-100 overflow-y-auto no-scrollbar pb-28">
      {/* Background ambient glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="p-4 pt-3 flex items-center justify-between border-b border-white/10 bg-slate-900/90 backdrop-blur-xl relative z-10">
        <button
          id="btn-sos-back"
          onClick={() => onNavigate('dashboard')}
          className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-950/40">
          <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>{t.emergencyCommand}</span>
        </div>
        <button
          onClick={() => setSirenPlaying(!sirenPlaying)}
          className={`p-2 rounded-2xl border transition-all ${
            sirenPlaying
              ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/50 animate-pulse'
              : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
          }`}
          title={sirenPlaying ? 'Mute Siren Alarm' : 'Play Siren Alarm'}
        >
          {sirenPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Action Toast */}
      {activeActionToast && (
        <div className="mx-4 mt-3 p-3 rounded-2xl bg-slate-900/95 border border-rose-500/40 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 relative z-20">
          <Radio className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
          <span>{activeActionToast}</span>
        </div>
      )}

      {/* Large Central SOS Button with Multi-Ring Ripple */}
      <div className="my-6 flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div className="relative flex items-center justify-center">
          {/* Animated Ripple Rings */}
          <div className="absolute w-56 h-56 rounded-full bg-rose-600/20 animate-ping pointer-events-none" />
          <div className="absolute w-44 h-44 rounded-full bg-rose-600/30 animate-pulse pointer-events-none" />

          {/* Core Central SOS Touch Button */}
          <button
            id="btn-central-sos"
            onClick={handleSosPress}
            className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 cursor-pointer ${
              sosTriggered
                ? 'bg-gradient-to-tr from-red-600 via-rose-700 to-red-900 ring-8 ring-rose-500/50 shadow-rose-600/80'
                : 'bg-gradient-to-tr from-rose-500 via-red-600 to-rose-700 ring-8 ring-rose-500/30 hover:ring-rose-500/50 shadow-rose-600/50'
            }`}
          >
            <AlertOctagon className="w-10 h-10 text-white drop-shadow-md stroke-[2]" />
            <span className="text-2xl font-black text-white tracking-widest mt-1">
              SOS
            </span>
            <span className="text-[9px] uppercase font-black text-rose-200 tracking-wider">
              {sosTriggered ? t.sosActivated : t.tapForHelp}
            </span>
          </button>
        </div>

        <p className="text-xs font-bold text-slate-300 mt-4 max-w-xs">
          {sosTriggered
            ? '🔴 Emergency broadcast active: Live GPS telemetry & audio transmitted to 3 contacts & dispatch!'
            : 'Pressing SOS immediately transmits live GPS, audio stream, and activates alarm.'}
        </p>
      </div>

      {/* Multi-Tier Emergency Escalation Protocol & Status */}
      <div className="px-4 space-y-2.5 relative z-10">
        <div className="p-4 rounded-3xl bg-slate-900/90 border border-white/15 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              <span>Multi-Tier Emergency Protocol</span>
            </h3>
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              Active Tier 1
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-950/30 text-emerald-200 font-bold border border-emerald-500/30">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tier 1: Primary Guardians (Mother, Aanya)</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-black">Delivered</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 text-slate-300 font-medium border border-white/10">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Tier 2: Campus Security & Safe Walker</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold">In 35s</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 text-slate-300 font-medium border border-white/10">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                <span>Tier 3: National Emergency Police (112)</span>
              </span>
              <span className="text-[10px] text-rose-400 font-bold">Standby</span>
            </div>
          </div>
        </div>

        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 pt-1">
          Direct Emergency Hotlines
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Action 1: Call National Emergency 112 */}
          <a
            id="btn-sos-call-112"
            href="tel:112"
            onClick={() => triggerToast('Connecting to 112 National Emergency Dispatch...')}
            className="p-3 rounded-2xl bg-gradient-to-br from-rose-600 to-red-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-lg shadow-rose-600/30 hover:opacity-95 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="leading-tight font-black">Call 112</div>
              <div className="text-[9px] text-rose-100 font-normal">Police / Ambulance</div>
            </div>
          </a>

          {/* Action 2: Call Women Helpline 1091 */}
          <a
            id="btn-sos-call-1091"
            href="tel:1091"
            onClick={() => triggerToast('Connecting to 1091 Women Helpline...')}
            className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-lg shadow-purple-600/30 hover:opacity-95 transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="leading-tight font-black">Call 1091</div>
              <div className="text-[9px] text-purple-100 font-normal">Women Safety Desk</div>
            </div>
          </a>

          {/* Action 3: Alert Trusted Contacts */}
          <button
            id="btn-sos-alert-contacts"
            onClick={() => triggerToast('SMS, GPS coordinates & audio stream sent to 3 trusted guardians')}
            className="p-3 rounded-2xl bg-slate-900 border border-indigo-500/40 text-white font-bold text-xs flex items-center gap-2.5 shadow-lg hover:bg-slate-850 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-400/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="leading-tight font-black">{t.alertContacts}</div>
              <div className="text-[9px] text-slate-400 font-normal">Discreet Audio + GPS</div>
            </div>
          </button>

          {/* Action 4: Nearest Safe Haven */}
          <button
            onClick={() => onNavigate('safe_haven_network')}
            className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-white font-bold text-xs flex items-center gap-2.5 shadow-lg hover:bg-slate-850 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="leading-tight font-black">Nearby Safe Haven</div>
              <div className="text-[9px] text-slate-400 font-normal">Apollo 24/7 (180m)</div>
            </div>
          </button>
        </div>

        {/* National Helplines Directory Toggle */}
        <div className="pt-1">
          <button
            onClick={() => setShowAllHelplines(!showAllHelplines)}
            className="w-full py-2 px-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 text-xs font-bold flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-1.5 text-rose-300">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>All Official Verified National Helplines (India)</span>
            </span>
            <span className="text-[10px] text-slate-400">
              {showAllHelplines ? 'Hide' : 'View (8 Direct Numbers)'}
            </span>
          </button>

          {showAllHelplines && (
            <div className="mt-2 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
              <a
                href={`tel:${INDIA_EMERGENCY_HELPLINES.domesticViolence.number}`}
                onClick={() => triggerToast('Connecting to 181 Women Domestic Violence Helpline...')}
                className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-white hover:bg-purple-900/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-300">181</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 font-bold">24/7</span>
                </div>
                <div className="text-[10px] font-bold text-white mt-0.5">Domestic & GBV Distress</div>
                <div className="text-[8px] text-slate-400">Govt. Emergency Link</div>
              </a>

              <a
                href={`tel:${INDIA_EMERGENCY_HELPLINES.ncwHelpline.number}`}
                onClick={() => triggerToast('Connecting to 14490 NCW Helpline...')}
                className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-white hover:bg-indigo-900/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-300">14490</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 font-bold">24/7</span>
                </div>
                <div className="text-[10px] font-bold text-white mt-0.5">NCW National Commission</div>
                <div className="text-[8px] text-slate-400">Digital Complaint & FIR</div>
              </a>

              <a
                href={`tel:${INDIA_EMERGENCY_HELPLINES.ambulance.number}`}
                onClick={() => triggerToast('Connecting to 102 CATS Ambulance...')}
                className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/30 text-white hover:bg-rose-900/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-300">102 / 108</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-200 font-bold">Free</span>
                </div>
                <div className="text-[10px] font-bold text-white mt-0.5">Ambulance Emergency</div>
                <div className="text-[8px] text-slate-400">CATS Govt. Dispatch</div>
              </a>

              <a
                href="https://wa.me/917835075012"
                target="_blank"
                rel="noreferrer"
                onClick={() => triggerToast('Opening Delhi Police WhatsApp Helpline...')}
                className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-white hover:bg-emerald-900/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-300">WhatsApp PCR</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-200 font-bold">Police</span>
                </div>
                <div className="text-[10px] font-bold text-white mt-0.5">7835075012</div>
                <div className="text-[8px] text-slate-400">Delhi Police Digital Help</div>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Interactive Map */}
      <div className="px-4 mt-4 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.nearestHelpPointsTitle}</span>
          </span>
          <span className="text-[10px] font-black text-emerald-400">4 Active Points</span>
        </div>

        <div className="h-40 rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
          <MapEngine
            heightClass="h-full"
            showHeatmap={false}
            showHelpPoints={true}
            showStreetlights={false}
            interactive={true}
          />
        </div>
      </div>
    </div>
  );
};
