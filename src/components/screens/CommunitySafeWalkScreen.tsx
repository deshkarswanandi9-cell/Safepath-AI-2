import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Phone, 
  ChevronLeft, 
  CheckCircle2, 
  UserCheck, 
  Sparkles, 
  Star, 
  Award,
  Navigation,
  ExternalLink
} from 'lucide-react';
import { ScreenId, SafeWalkerBuddy } from '../../types';
import { MOCK_SAFE_WALK_BUDDIES } from '../../data/mockData';

interface CommunitySafeWalkScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CommunitySafeWalkScreen: React.FC<CommunitySafeWalkScreenProps> = ({
  onNavigate
}) => {
  const [buddies] = useState<SafeWalkerBuddy[]>(MOCK_SAFE_WALK_BUDDIES);
  const [selectedBuddy, setSelectedBuddy] = useState<SafeWalkerBuddy | null>(null);
  const [requestConfirmed, setRequestConfirmed] = useState<boolean>(false);

  const handleRequestWalk = (buddy: SafeWalkerBuddy) => {
    setSelectedBuddy(buddy);
    setRequestConfirmed(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto no-scrollbar pb-28 select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl text-white px-4 pt-3 pb-3.5 border-b border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1">
                  Community Safe Walk Network
                </h1>
              </div>
              <p className="text-[10px] text-slate-400">
                Verified Campus Security & Volunteer Walk Accompaniment
              </p>
            </div>
          </div>

          <span className="px-2 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            3 Buddies Available
          </span>
        </div>
      </div>

      {/* Confirmation Banner */}
      {requestConfirmed && selectedBuddy && (
        <div className="mx-4 mt-3 p-4 rounded-3xl bg-emerald-600 text-white shadow-xl space-y-2 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span className="text-xs font-black">Walk Request Confirmed!</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">2 Min ETA</span>
          </div>

          <p className="text-[11px] text-emerald-100 leading-relaxed">
            <strong>{selectedBuddy.name}</strong> ({selectedBuddy.organization}) is en route to your current GPS point.
          </p>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setRequestConfirmed(false)}
              className="py-1.5 px-3 rounded-xl bg-white text-emerald-900 font-extrabold text-xs flex-1 shadow-sm"
            >
              Track Live Buddy Approach
            </button>
            <button
              onClick={() => setRequestConfirmed(false)}
              className="py-1.5 px-3 rounded-xl bg-emerald-700 text-white font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="p-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white shadow-md border border-indigo-800/40 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              Zero-Alone Night Escort Policy
            </h3>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Request an in-person walk accompaniment between metro stations, campus hostels, bus stops, and parking lots. All walkers are background-verified.
          </p>
        </div>
      </div>

      {/* Buddies Directory */}
      <div className="px-4 space-y-3">
        <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
          Nearby Available Safe Walkers
        </h3>

        {buddies.map((buddy) => (
          <div
            key={buddy.id}
            className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 hover:border-emerald-300 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={buddy.avatarUrl}
                    alt={buddy.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black text-white">
                    ✓
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-black text-slate-900">{buddy.name}</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      ID Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold">{buddy.organization}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{buddy.rating}</span>
                </div>
                <div className="text-[9px] text-slate-400 font-bold">{buddy.completedWalks} walks</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="flex items-center gap-1">📍 <strong>{buddy.distance}</strong></span>
              <span className="flex items-center gap-1">⏱️ <strong>{buddy.eta}</strong></span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleRequestWalk(buddy)}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Request Walk
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 transition"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                Call Officer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
