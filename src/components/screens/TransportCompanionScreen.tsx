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
  Sparkles
} from 'lucide-react';
import { ScreenId, TransitCompanionTrip } from '../../types';
import { MOCK_TRANSIT_COMPANION_DEFAULT, MOCK_ROUTES } from '../../data/mockData';
import { MapEngine } from '../MapEngine';

interface TransportCompanionScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenSos: () => void;
}

export const TransportCompanionScreen: React.FC<TransportCompanionScreenProps> = ({
  onNavigate,
  onOpenSos
}) => {
  const [trip, setTrip] = useState<TransitCompanionTrip>(MOCK_TRANSIT_COMPANION_DEFAULT);
  const [deviationAlert, setDeviationAlert] = useState<boolean>(false);
  const [unusualStopAlert, setUnusualStopAlert] = useState<boolean>(false);
  const [sharedToast, setSharedToast] = useState<boolean>(false);

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

  const handleShareTrip = () => {
    setSharedToast(true);
    setTimeout(() => setSharedToast(false), 3000);
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
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1">
                  Safe Public Transport Companion
                </h1>
              </div>
              <p className="text-[10px] text-slate-400">
                Live Cab, Auto, Bus & Metro Journey Deviation Monitor
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Live Telemetry Active
          </span>
        </div>
      </div>

      {/* Embedded Map Section with Active Route & Car Pin */}
      <div className="relative w-full h-[220px] bg-slate-200 border-b border-slate-300">
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
              <span className="text-xs font-bold">Vehicle plate & live GPS shared with all trusted contacts</span>
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
                <p className="text-[11px] text-rose-800 mt-0.5 leading-relaxed">
                  Your cab has steered <strong>280 meters away</strong> from the approved route into an unlit residential alley.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={onOpenSos}
                className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 transition active:scale-95"
              >
                <AlertOctagon className="w-4 h-4" />
                Trigger SOS (112)
              </button>

              <button
                onClick={() => setDeviationAlert(false)}
                className="py-2.5 px-3 rounded-xl bg-white border border-rose-300 text-rose-800 font-bold text-xs flex items-center justify-center gap-1 transition active:scale-95"
              >
                I Am Safe (Dismiss)
              </button>
            </div>
          </div>
        )}

        {/* Active Prolonged Stop Warning Card */}
        {unusualStopAlert && (
          <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-400 shadow-xl space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="p-2 bg-amber-600 text-white rounded-2xl shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-amber-950 uppercase tracking-tight">
                  Prolonged Stationary Stop (3+ mins)
                </h3>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Vehicle has remained stationary for 185s in an isolated zone without traffic congestion.
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={onOpenSos}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition"
              >
                Escalate Alert
              </button>
              <button
                onClick={() => setUnusualStopAlert(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs"
              >
                Driver Fueling (Safe)
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

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleShareTrip}
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
    </div>
  );
};
