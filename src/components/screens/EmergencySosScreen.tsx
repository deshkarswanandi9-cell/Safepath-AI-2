import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  PhoneCall, 
  Users, 
  AlertOctagon, 
  Volume2, 
  VolumeX, 
  Radio, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert,
  Check 
} from 'lucide-react';
import { ScreenId } from '../../types';
import { MOCK_HELP_POINTS } from '../../data/mockData';
import { INDIA_EMERGENCY_HELPLINES } from '../../data/realData';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useSosAlert } from '../../hooks/useSupabase';

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
  const { submitAlert } = useSosAlert();

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
    setTimeout(() => setActiveActionToast(null), 3000);
  };

  const handleSosPress = () => {
    setSosTriggered(true);
    setSirenPlaying(true);
    triggerToast('Emergency SOS Broadcast Transmitted to 3 Guardians & Police Dispatch');
    // Persist SOS alert to Supabase (falls back to console log if not configured)
    submitAlert({
      user_id: 'demo-user',       // Replace with auth.user.id in production
      latitude: 28.6315,           // Replace with navigator.geolocation in production
      longitude: 77.2167,
      severity: 'critical',
      message: 'SOS triggered via EmergencySosScreen',
      vehicle_number: null,
      driver_name: null,
      dispatch_id: null,
      acknowledged_by: null,
      acknowledged_at: null,
      resolved_at: null,
    });
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-20">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between pt-1 mb-2">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="px-2.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-wider">
            Emergency Command
          </span>
          <button
            type="button"
            onClick={() => setSirenPlaying(!sirenPlaying)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              sirenPlaying
                ? 'bg-red-600 text-white border-red-500'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
            }`}
            title={sirenPlaying ? 'Mute Siren Alarm' : 'Play Siren Alarm'}
            aria-label="Toggle Siren Alarm Audio"
          >
            {sirenPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Action Toast Feedback */}
        {activeActionToast && (
          <div className="mb-2.5 p-2 rounded-xl bg-red-600 text-white text-[11px] font-bold shadow-md flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 shrink-0" />
            <span>{activeActionToast}</span>
          </div>
        )}

        {/* Central SOS Action */}
        <div className="my-4 flex flex-col items-center justify-center text-center">
          <button
            id="btn-central-sos"
            type="button"
            onClick={handleSosPress}
            className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer ${
              sosTriggered
                ? 'bg-red-700 text-white ring-4 ring-red-500'
                : 'bg-red-600 hover:bg-red-700 text-white ring-4 ring-red-300 dark:ring-red-900'
            }`}
            title="Press to trigger Emergency SOS"
            aria-label="Emergency SOS button. Tap to broadcast live emergency coordinates"
          >
            <AlertOctagon className="w-10 h-10 stroke-[2.2]" />
            <span className="text-2xl font-black tracking-widest mt-1">SOS</span>
            <span className="text-[8px] font-black uppercase tracking-wider opacity-90">
              {sosTriggered ? 'BROADCAST ACTIVE' : 'TAP FOR HELP'}
            </span>
          </button>

          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 mt-3 max-w-xs">
            {sosTriggered
              ? '🔴 Emergency transmission active: Live GPS coordinates sent to Guardians and Dispatch.'
              : 'Pressing SOS transmits live GPS, audio stream, and activates siren alarm.'}
          </p>
        </div>

        {/* Nearest Safe Place Recommendation Hero Card */}
        <div className="mb-3 p-3 rounded-2xl bg-gradient-to-r from-red-600/10 via-emerald-600/10 to-transparent border border-red-500/30 dark:border-red-500/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-black dark:text-white">
                Emergency Safe Haven Finder
              </span>
            </div>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
              Ranked by Safety & Staffing
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-300 font-medium mt-1">
            Immediately find and navigate to the nearest open police booth, hospital emergency ward, or verified 24/7 safe haven.
          </p>
          <button
            type="button"
            id="btn-open-safe-haven-finder"
            onClick={() => onNavigate('nearest_safe_place')}
            className="mt-2 w-full py-2 px-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-black text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Find Nearest Safe Place & Navigate →</span>
          </button>
        </div>

        {/* Direct Helpline Hotlinks */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <a
            href="tel:112"
            className="p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 hover:border-black dark:hover:border-white transition-colors flex items-center justify-center gap-2 text-xs font-black text-black dark:text-white"
          >
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>Call 112 (Police)</span>
          </a>

          <a
            href="tel:1091"
            className="p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 hover:border-black dark:hover:border-white transition-colors flex items-center justify-center gap-2 text-xs font-black text-black dark:text-white"
          >
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>Call 1091 (Women)</span>
          </a>
        </div>

        {/* Nearby Emergency Refuges */}
        <Card variant="default" padding="sm" className="space-y-2 mb-3">
          <div className="flex items-center justify-between pb-1 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
              Nearest Refuges (Under 500m)
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Open 24/7</span>
          </div>

          <div className="space-y-1.5">
            {MOCK_HELP_POINTS.slice(0, 3).map((hp) => (
              <div
                key={hp.id}
                className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-black dark:text-white">{hp.name}</h4>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{hp.distance} ({hp.eta} walk)</span>
                  </div>
                </div>

                <a
                  href={`tel:${hp.phone}`}
                  className="px-2.5 py-1 rounded-md bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            ))}
          </div>
        </Card>

        {/* National Helplines Directory Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAllHelplines(!showAllHelplines)}
            className="w-full py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white text-neutral-800 dark:text-neutral-200 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Verified National Helplines (India)</span>
            </span>
            <span className="text-[10px] text-neutral-500">
              {showAllHelplines ? 'Hide' : 'View (8 Helplines)'}
            </span>
          </button>

          {showAllHelplines && (
            <div className="mt-2 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2">
              <a
                href={`tel:${INDIA_EMERGENCY_HELPLINES.domesticViolence.number}`}
                onClick={() => triggerToast('Connecting to 181 Women Helpline...')}
                className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-900 dark:text-purple-200 hover:bg-purple-500/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-700 dark:text-purple-300">181</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-800 dark:text-purple-200 font-bold">24/7</span>
                </div>
                <div className="text-[10px] font-bold mt-0.5">Domestic & GBV Distress</div>
                <div className="text-[8px] text-neutral-500">Govt. Emergency Link</div>
              </a>

              <a
                href={`tel:${INDIA_EMERGENCY_HELPLINES.ncwHelpline.number}`}
                onClick={() => triggerToast('Connecting to 14490 NCW Helpline...')}
                className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-500/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-700 dark:text-indigo-300">14490</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 font-bold">24/7</span>
                </div>
                <div className="text-[10px] font-bold mt-0.5">NCW National Commission</div>
                <div className="text-[8px] text-neutral-500">Digital Complaint & FIR</div>
              </a>

              <a
                href={`tel:${INDIA_EMERGENCY_HELPLINES.ambulance.number}`}
                onClick={() => triggerToast('Connecting to 102 CATS Ambulance...')}
                className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 hover:bg-rose-500/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-rose-700 dark:text-rose-300">102 / 108</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-800 dark:text-rose-200 font-bold">Free</span>
                </div>
                <div className="text-[10px] font-bold mt-0.5">Ambulance Emergency</div>
                <div className="text-[8px] text-neutral-500">CATS Govt. Dispatch</div>
              </a>

              <a
                href="https://wa.me/917835075012"
                target="_blank"
                rel="noreferrer"
                onClick={() => triggerToast('Opening Delhi Police WhatsApp Helpline...')}
                className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-500/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">WhatsApp PCR</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-bold">Police</span>
                </div>
                <div className="text-[10px] font-bold mt-0.5">7835075012</div>
                <div className="text-[8px] text-neutral-500">Delhi Police Digital Help</div>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Notify Guardians Action */}
      <div className="mt-3 pt-1">
        <Button
          id="btn-alert-guardians"
          variant="secondary"
          fullWidth
          size="md"
          onClick={() => triggerToast('Coordinates dispatched via SMS to 3 registered guardians')}
          icon={<Users className="w-4 h-4" />}
        >
          Dispatch Coordinates to 3 Guardians
        </Button>
      </div>
    </div>
  );
};
