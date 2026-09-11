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
  Radio
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

      {/* Fast Action Buttons Grid (Prompt Requirements) */}
      <div className="px-4 space-y-2.5">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Emergency Quick Actions
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Action 1: Call Emergency Services */}
          <a
            id="btn-sos-call-911"
            href="tel:911"
            onClick={() => triggerToast('Connecting to 911 Emergency Dispatch...')}
            className="p-3 rounded-2xl bg-rose-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-md shadow-rose-600/20 hover:bg-rose-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="leading-tight">{t.call911}</div>
              <div className="text-[9px] text-rose-100 font-normal">Police / Medical</div>
            </div>
          </a>

          {/* Action 2: Alert Trusted Contacts */}
          <button
            id="btn-sos-alert-contacts"
            onClick={() => triggerToast('SMS & Voice alert dispatched to Mother, Friend & Sister')}
            className="p-3 rounded-2xl bg-purple-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="leading-tight">{t.alertContacts}</div>
              <div className="text-[9px] text-purple-100 font-normal">3 Guardians</div>
            </div>
          </button>

          {/* Action 3: Share Live Location */}
          <button
            id="btn-sos-share-location"
            onClick={() => triggerToast('Live GPS beacon link copied and shared')}
            className="p-3 rounded-2xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2.5 shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="leading-tight">{t.shareGps}</div>
              <div className="text-[9px] text-blue-100 font-normal">Real-time link</div>
            </div>
          </button>

          {/* Action 4: Nearest Police Station */}
          <button
            id="btn-sos-nearest-police"
            onClick={() => triggerToast('Routing to Metro Police Station (350m away)')}
            className="p-3 rounded-2xl bg-slate-900 text-white font-bold text-xs flex items-center gap-2.5 shadow-md hover:bg-slate-800 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/30 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="leading-tight">{t.policeStation}</div>
              <div className="text-[9px] text-slate-300 font-normal">350 m away</div>
            </div>
          </button>
        </div>

        {/* Nearest Hospital Card */}
        <button
          id="btn-sos-nearest-hospital"
          onClick={() => triggerToast('Routing to St. Jude General Hospital (680m away)')}
          className="w-full p-3 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 flex items-center justify-between shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Cross className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800">{t.nearestHospital}</div>
              <div className="text-[10px] text-slate-500">St. Jude General • 680 m • 4 min walk</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
            {t.open247}
          </span>
        </button>
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
