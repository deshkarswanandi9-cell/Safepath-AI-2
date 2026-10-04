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
  Clock
} from 'lucide-react';
import { ScreenId } from '../../types';
import { MapEngine } from '../MapEngine';
import { MOCK_HELP_POINTS } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';

interface EmergencySosScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const EmergencySosScreen: React.FC<EmergencySosScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [activeActionToast, setActiveActionToast] = useState<string | null>(null);
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
    <div className="relative min-h-[640px] h-full flex flex-col justify-between bg-gradient-to-b from-rose-50/50 via-white to-slate-50 overflow-y-auto no-scrollbar pb-28">
      {/* Top Header */}
      <div className="p-4 pt-3 flex items-center justify-between border-b border-rose-100 bg-white/80 backdrop-blur-md">
        <button
          id="btn-sos-back"
          onClick={() => onNavigate('dashboard')}
          className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black uppercase tracking-wider">
          <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
          <span>{t.emergencyCommand}</span>
        </div>
        <button
          onClick={() => setSirenPlaying(!sirenPlaying)}
          className={`p-2 rounded-2xl border transition-colors ${
            sirenPlaying
              ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          title={sirenPlaying ? 'Mute Siren Alarm' : 'Play Siren Alarm'}
        >
          {sirenPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Action Toast */}
      {activeActionToast && (
        <div className="mx-4 mt-2 p-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Radio className="w-4 h-4 text-rose-400 animate-pulse shrink-0" />
          <span>{activeActionToast}</span>
        </div>
      )}

      {/* Large Central SOS Button */}
      <div className="my-6 flex flex-col items-center justify-center text-center px-4">
        <div className="relative flex items-center justify-center">
          {/* Animated Ripple Rings */}
          <div className="absolute w-56 h-56 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
          <div className="absolute w-44 h-44 rounded-full bg-rose-500/30 animate-pulse pointer-events-none" />

          {/* Core Central SOS Touch Button */}
          <button
            id="btn-central-sos"
            onClick={handleSosPress}
            className={`relative w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 cursor-pointer ${
              sosTriggered
                ? 'bg-gradient-to-tr from-red-600 via-rose-700 to-red-800 ring-8 ring-rose-300'
                : 'bg-gradient-to-tr from-rose-500 via-red-600 to-rose-700 ring-8 ring-rose-100 hover:ring-rose-200'
            }`}
          >
            <AlertOctagon className="w-10 h-10 text-white drop-shadow-md stroke-[2]" />
            <span className="text-2xl font-black text-white tracking-widest mt-1">
              SOS
            </span>
            <span className="text-[9px] uppercase font-extrabold text-rose-100 tracking-wider">
              {sosTriggered ? t.sosActivated : t.tapForHelp}
            </span>
          </button>
        </div>

        <p className="text-xs font-bold text-slate-700 mt-4 max-w-xs">
          {sosTriggered
            ? '🔴 Emergency services and your 3 trusted contacts have been sent your live telemetry!'
            : 'Pressing SOS immediately shares live GPS, streams audio, and contacts dispatch.'}
        </p>
      </div>

      {/* Multi-Tier Emergency Escalation Protocol & Status */}
      <div className="px-4 space-y-2.5">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-600" />
              Multi-Tier Emergency Escalation
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Active Tier 1
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Tier 1: Primary Guardians (Mother, Aanya)
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">Delivered (100%)</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700 font-medium border border-slate-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Tier 2: Campus Security & Safe Walker
              </span>
              <span className="text-[10px] text-slate-500 font-bold">Auto-escalates in 35s</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-slate-700 font-medium border border-slate-200">
              <span className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                Tier 3: National Emergency Police (112)
              </span>
              <span className="text-[10px] text-rose-700 font-bold">Ready</span>
            </div>
          </div>
        </div>

        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 pt-1">
          Emergency Quick Actions (India & Campus Hotlines)
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Action 1: Call National Emergency 112 */}
          <a
            id="btn-sos-call-112"
            href="tel:112"
            onClick={() => triggerToast('Connecting to 112 National Emergency Dispatch...')}
            className="p-3 rounded-2xl bg-rose-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="leading-tight font-black">Call 112 (Emergency)</div>
              <div className="text-[9px] text-rose-100 font-normal">Police / Ambulance</div>
            </div>
          </a>

          {/* Action 2: Call Women Helpline 1091 */}
          <a
            id="btn-sos-call-1091"
            href="tel:1091"
            onClick={() => triggerToast('Connecting to 1091 Women Helpline...')}
            className="p-3 rounded-2xl bg-purple-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="leading-tight font-black">Call 1091 Helpline</div>
              <div className="text-[9px] text-purple-100 font-normal">Women Safety Desk</div>
            </div>
          </a>

          {/* Action 3: Alert Trusted Contacts */}
          <button
            id="btn-sos-alert-contacts"
            onClick={() => triggerToast('SMS, GPS coordinates & audio stream sent to 3 trusted guardians')}
            className="p-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="leading-tight">{t.alertContacts}</div>
              <div className="text-[9px] text-indigo-100 font-normal">Discreet Audio + GPS</div>
            </div>
          </button>

          {/* Action 4: Nearest Safe Haven */}
          <button
            onClick={() => onNavigate('safe_haven_network')}
            className="p-3 rounded-2xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2.5 shadow-md hover:bg-slate-800 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="leading-tight font-black">Nearby Safe Haven</div>
              <div className="text-[9px] text-slate-300 font-normal">Apollo 24/7 (180m)</div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Section: Interactive Map (Prompt Requirement) */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            {t.nearestHelpPointsTitle}
          </span>
          <span className="text-[10px] font-bold text-emerald-600">4 Active Points</span>
        </div>

        <div className="h-44 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
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
