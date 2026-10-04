import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  Share2, 
  AlertOctagon, 
  Navigation, 
  Clock, 
  ChevronLeft, 
  CheckCircle2, 
  Radio, 
  Phone, 
  UserCheck, 
  Zap,
  RotateCcw,
  Sparkles,
  Train,
  ShieldAlert,
  Info,
  Check
} from 'lucide-react';
import { ScreenId, TransitCompanionTrip } from '../../types';
import { MOCK_TRANSIT_COMPANION_DEFAULT, MOCK_ROUTES } from '../../data/mockData';
import { DMRC_SAFETY_FEATURES, RIDE_APP_SAFETY_FEATURES, REAL_DELHI_METRO_STATIONS } from '../../data/realData';
import { MapEngine } from '../MapEngine';

interface TransportCompanionScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenSos: () => void;
}

export const TransportCompanionScreen: React.FC<TransportCompanionScreenProps> = ({
  onNavigate,
  onOpenSos
}) => {
  const [activeTab, setActiveTab] = useState<'cab' | 'metro'>('cab');
  const [trip, setTrip] = useState<TransitCompanionTrip>(MOCK_TRANSIT_COMPANION_DEFAULT);
  const [deviationAlert, setDeviationAlert] = useState<boolean>(false);
  const [unusualStopAlert, setUnusualStopAlert] = useState<boolean>(false);
  const [sharedToast, setSharedToast] = useState<string | null>(null);

  const handleSimulateDeviation = () => {
    setDeviationAlert(true);
    setTrip(prev => ({ ...prev, routeDeviationMeters: 280 }));
  };

  const handleSimulateStop = () => {
    setUnusualStopAlert(true);
    setTrip(prev => ({ ...prev, unusualStopSeconds: 185 }));
  };

  const handleResetTrip = () => {
    setDeviationAlert(false);
    setUnusualStopAlert(false);
    setTrip(MOCK_TRANSIT_COMPANION_DEFAULT);
  };

  const triggerToast = (msg: string) => {
    setSharedToast(msg);
    setTimeout(() => setSharedToast(null), 3500);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto no-scrollbar pb-28 select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl text-white px-4 pt-3 pb-3 border-b border-slate-800 shadow-md">
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1">
                  Public Transport Companion
                </h1>
              </div>
              <p className="text-[10px] text-slate-400">
                Delhi Metro Pink Coach & Cab Deviation Guard
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="bg-slate-800 p-0.5 rounded-xl flex text-[10px] font-bold border border-slate-700">
            <button
              onClick={() => setActiveTab('cab')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'cab' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cab / Auto
            </button>
            <button
              onClick={() => setActiveTab('metro')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeTab === 'metro' ? 'bg-purple-600 text-white font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              DMRC Metro
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'cab' ? (
        <>
          {/* Embedded Map Section with Active Route & Car Pin */}
          <div className="relative w-full h-[200px] bg-slate-200 border-b border-slate-300">
            <MapEngine
              activeRoute={MOCK_ROUTES[2]}
              selectedRouteId="route_c"
              showHelpPoints={true}
              heightClass="h-full"
              userProgress={45}
              navMode={true}
            />

            {/* Live Ride Status Pill Overlay */}
            <div className="absolute top-2 left-2 z-20 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-2 border border-slate-700 shadow-lg">
              <Car className="w-3.5 h-3.5 text-blue-400" />
              <span>{trip.vehiclePlate}</span>
            </div>

            {/* Deviation Warning Overlay Badge */}
            {deviationAlert && (
              <div className="absolute top-2 right-2 z-20 bg-rose-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-lg animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>280m Route Deviation!</span>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="p-4 space-y-3.5">
            {sharedToast && (
              <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold">{sharedToast}</span>
                </div>
              </div>
            )}

            {/* Active Deviation Warning Modal Card */}
            {deviationAlert && (
              <div className="p-4 rounded-3xl bg-rose-50 border-2 border-rose-400 shadow-xl space-y-3 animate-pulse">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-rose-600 text-white rounded-2xl shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-rose-950 uppercase tracking-tight">
                      Unexpected Route Deviation Detected
                    </h3>
                    <p className="text-[11px] text-rose-800 mt-0.5 leading-snug">
                      Your driver took an unauthorized turn away from the approved corridor (+280m off track).
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={onOpenSos}
                    className="flex-1 py-2 px-3 rounded-xl bg-rose-600 text-white font-black text-xs shadow-md shadow-rose-600/30 flex items-center justify-center gap-1"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    Trigger SOS Alert
                  </button>
                  <button
                    onClick={() => setDeviationAlert(false)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white border border-rose-300 text-rose-900 font-bold text-xs"
                  >
                    False Alarm (Safe)
                  </button>
                </div>
              </div>
            )}

            {/* Driver & Ride Details Card */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Car className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900">{trip.vehiclePlate}</h3>
                    <p className="text-[11px] text-slate-600 font-semibold">{trip.driverName}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Ride
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-t border-slate-100 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">ETA</div>
                  <div className="font-extrabold text-slate-900">{trip.destinationEta}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">Off-Route</div>
                  <div className={`font-extrabold ${deviationAlert ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {trip.routeDeviationMeters}m
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold">Guardians</div>
                  <div className="font-extrabold text-emerald-600">Sync 100%</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => triggerToast('Vehicle plate & live GPS shared with all trusted contacts')}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  Share Live Ride
                </button>

                <button
                  onClick={() => onNavigate('safe_haven_network')}
                  className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Nearest Safe Havens
                </button>
              </div>
            </div>

            {/* Ride Verification Safety Protocol Checklist */}
            <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Delhi Ride Safety Verification Checklist</span>
              </h4>
              <div className="space-y-1.5 text-[11px] text-slate-700">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verify vehicle plate starts with <strong>DL</strong> matching your booking</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Ask driver &apos;Who are you picking up?&apos; before boarding</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Child lock check: confirm rear door opens from inside</span>
                </div>
              </div>
            </div>

            {/* Simulation Sandbox Triggers */}
            <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-2.5 shadow-lg border border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Ride Anomaly Simulator
                </h4>
                <button 
                  onClick={handleResetTrip}
                  className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleSimulateDeviation}
                  className="py-2 px-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold border border-rose-500/30 transition text-left"
                >
                  ⚠️ Test Route Deviation
                </button>

                <button
                  onClick={handleSimulateStop}
                  className="py-2 px-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold border border-amber-500/30 transition text-left"
                >
                  ⏱️ Test 3-Min Stop Alarm
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ======================================================= */
        /* DMRC METRO PINK COACH & VERIFIED STATIONS DIRECTORY     */
        /* ======================================================= */
        <div className="p-4 space-y-4">
          {/* Pink Coach Hero Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-pink-600 via-purple-700 to-indigo-900 text-white shadow-xl space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
                  <Train className="w-6 h-6 text-pink-200" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">DMRC Pink Coach Protocol</h3>
                  <p className="text-[10px] text-pink-200">First Coach Reserved Exclusively for Women</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-400/30 text-pink-100 border border-pink-300/40">
                100% CCTV
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-2xl bg-white/10 border border-white/10">
                <div className="text-xs font-black text-pink-100">Coach #1</div>
                <div className="text-[9px] text-pink-200 mt-0.5">Every Train</div>
              </div>
              <div className="p-2 rounded-2xl bg-white/10 border border-white/10">
                <div className="text-xs font-black text-amber-300">₹250 Fine</div>
                <div className="text-[9px] text-pink-200 mt-0.5">CISF Penalty</div>
              </div>
              <div className="p-2 rounded-2xl bg-white/10 border border-white/10">
                <div className="text-xs font-black text-emerald-300">4 Cams/Coach</div>
                <div className="text-[9px] text-pink-200 mt-0.5">30-Day Backup</div>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-pink-100 font-medium space-y-1">
              <p>• {DMRC_SAFETY_FEATURES.pinkCoach.additionalFeatures.join(' • ')}</p>
            </div>
          </div>

          {/* DMRC Verified Emergency Hotlines */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-purple-600" />
              <span>Official DMRC Emergency Helplines</span>
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${DMRC_SAFETY_FEATURES.helplines.dmrtHelpline}`}
                className="p-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 font-bold transition text-left"
              >
                <div className="text-xs font-black text-purple-700">155370</div>
                <div className="text-[10px] text-slate-700 font-bold">DMRC 24/7 Helpline</div>
                <div className="text-[8px] text-slate-500">Toll-Free Control Room</div>
              </a>

              <a
                href={`tel:${DMRC_SAFETY_FEATURES.helplines.securityHelpline}`}
                className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-950 font-bold transition text-left"
              >
                <div className="text-xs font-black text-rose-700">011-23417910</div>
                <div className="text-[10px] text-slate-700 font-bold">CISF Security Help</div>
                <div className="text-[8px] text-slate-500">Platform Armed Guard</div>
              </a>

              <a
                href={`https://wa.me/918800333600`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold transition text-left col-span-2 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-black text-emerald-700">8800-333-600 (WhatsApp)</div>
                  <div className="text-[10px] text-slate-700 font-bold">DMRC Instant WhatsApp Grievance</div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">Chat</span>
              </a>
            </div>
          </div>

          {/* Real Delhi Metro Stations Directory with Safety Ratings */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Central Delhi Metro Stations (DMRC Verified)</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-400">All CISF Secured</span>
            </div>

            <div className="space-y-2.5">
              {REAL_DELHI_METRO_STATIONS.map((station) => (
                <div
                  key={station.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-slate-900">{station.name}</div>
                      <div className="text-[10px] text-slate-500">{station.address}</div>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      ★ {station.safetyRating} Safety
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {station.lines.map((line, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: station.lineColors[idx] || '#2563EB' }}
                      >
                        {line}
                      </span>
                    ))}
                    {station.interchange && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                        Interchange Hub
                      </span>
                    )}
                    {station.pcr && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        PCR Booth
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-slate-500 italic mt-0.5">{station.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Last Train Departure Timetable */}
          <div className="p-4 rounded-3xl bg-slate-900 text-white space-y-2 border border-slate-800">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>DMRC Last Train Timetable (Night Transit)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-amber-300 font-bold">Yellow Line:</span> {DMRC_SAFETY_FEATURES.lastTrainTimes.yellowLine}
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-blue-300 font-bold">Blue Line:</span> {DMRC_SAFETY_FEATURES.lastTrainTimes.blueLine}
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-purple-300 font-bold">Violet Line:</span> {DMRC_SAFETY_FEATURES.lastTrainTimes.violetLine}
              </div>
              <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                <span className="text-orange-300 font-bold">Airport Express:</span> {DMRC_SAFETY_FEATURES.lastTrainTimes.airportExpress}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
