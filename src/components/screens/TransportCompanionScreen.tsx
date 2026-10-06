import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  AlertTriangle, 
  Share2, 
  AlertOctagon, 
  ChevronLeft, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Train,
  ShieldAlert,
  ShieldCheck,
  Check,
  Clock,
  Phone
} from 'lucide-react';
import { ScreenId, TransitCompanionTrip } from '../../types';
import { MOCK_TRANSIT_COMPANION_DEFAULT, MOCK_ROUTES } from '../../data/mockData';
import { DMRC_SAFETY_FEATURES, REAL_DELHI_METRO_STATIONS } from '../../data/realData';
import { MapEngine } from '../MapEngine';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

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

  const handleShareTrip = () => {
    setSharedToast('Live cab coordinates shared with registered guardians');
    setTimeout(() => setSharedToast(null), 3000);
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-20">
      <div>
        {/* Header */}
        <div className="pt-1 flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Back to Dashboard"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
                Transit Companion
              </h1>
              <p className="text-[10px] text-neutral-500">Cab & public transport deviation monitor</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-lg flex text-[10px] font-bold border border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab('cab')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeTab === 'cab'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Cab / Auto
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('metro')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeTab === 'metro'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Metro
            </button>
          </div>
        </div>

        {/* Shared Toast */}
        {sharedToast && (
          <div className="mb-2.5 p-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold shadow-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{sharedToast}</span>
          </div>
        )}

        {activeTab === 'cab' ? (
          <>
            {/* Map Preview */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-800 mb-3 shadow-xs">
              <MapEngine
                activeRoute={MOCK_ROUTES[2]}
                selectedRouteId="route_c"
                showHelpPoints={true}
                heightClass="h-full"
                userProgress={45}
                interactive={false}
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/95 dark:bg-black/95 border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold text-black dark:text-white">
                GPS Locked: {trip.vehiclePlate}
              </div>
            </div>

            {/* Active Deviation or Stop Warning Banners */}
            {deviationAlert && (
              <div className="mb-2.5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Deviation: +{trip.routeDeviationMeters}m off route</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenSos}
                  className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black cursor-pointer"
                >
                  SOS
                </button>
              </div>
            )}

            {unusualStopAlert && (
              <div className="mb-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Stationary: {trip.unusualStopSeconds}s</span>
                </div>
                <button
                  type="button"
                  onClick={onOpenSos}
                  className="px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-black cursor-pointer"
                >
                  Report
                </button>
              </div>
            )}

            {/* Ride Details Card */}
            <Card variant="default" padding="sm" className="mb-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-black dark:text-white">{trip.vehiclePlate}</h3>
                    <p className="text-[10px] text-neutral-500">{trip.driverName} • ★ {trip.driverRating}</p>
                  </div>
                </div>

                <Badge variant="subtle" size="sm">
                  ETA: {trip.destinationEta}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[10px]">
                <Button variant="secondary" size="sm" onClick={handleShareTrip} icon={<Share2 className="w-3 h-3" />}>
                  Share Ride
                </Button>
                <Button variant="danger" size="sm" onClick={onOpenSos} icon={<AlertOctagon className="w-3 h-3" />}>
                  Trigger SOS
                </Button>
              </div>
            </Card>

            {/* Ride Verification Safety Protocol Checklist */}
            <Card variant="default" padding="sm" className="mb-3 space-y-2">
              <h4 className="text-xs font-black text-black dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Ride Safety Checklist</span>
              </h4>
              <div className="space-y-1 text-[10px] text-neutral-700 dark:text-neutral-300">
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Verify license plate matches booking exactly</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Ask driver &apos;Who are you picking up?&apos; before boarding</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Child lock check: confirm rear door opens from inside</span>
                </div>
              </div>
            </Card>

            {/* Test Simulation Controls */}
            <Card variant="subtle" padding="sm" className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Ride Simulation Triggers
                </span>
                <button
                  type="button"
                  onClick={handleResetTrip}
                  className="text-[9px] text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={handleSimulateDeviation}
                  className="py-1 px-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[9px] font-bold text-black dark:text-white hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center"
                >
                  ⚠️ +280m Deviation
                </button>

                <button
                  type="button"
                  onClick={handleSimulateStop}
                  className="py-1 px-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[9px] font-bold text-black dark:text-white hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center"
                >
                  ⏱️ +3m Stop Alert
                </button>
              </div>
            </Card>
          </>
        ) : (
          /* ======================================================= */
          /* DMRC METRO PINK COACH & VERIFIED STATIONS DIRECTORY     */
          /* ======================================================= */
          <div className="space-y-3">
            {/* Pink Coach Hero Banner */}
            <Card variant="default" padding="sm" className="space-y-2 bg-pink-950/40 border-pink-500/30 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300">
                    <Train className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-pink-100">DMRC Pink Coach Protocol</h3>
                    <p className="text-[9px] text-pink-300">Coach #1 Reserved for Women • 100% CCTV</p>
                  </div>
                </div>
                <Badge variant="safe" size="sm">
                  CISF Monitored
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
                <div className="p-1.5 rounded-lg bg-pink-900/40 border border-pink-500/20">
                  <div className="font-black text-pink-200">Coach #1</div>
                  <div className="text-[8px] text-pink-400">Every Train</div>
                </div>
                <div className="p-1.5 rounded-lg bg-pink-900/40 border border-pink-500/20">
                  <div className="font-black text-amber-300">₹250 Fine</div>
                  <div className="text-[8px] text-pink-400">Unauthorized</div>
                </div>
                <div className="p-1.5 rounded-lg bg-pink-900/40 border border-pink-500/20">
                  <div className="font-black text-emerald-300">4 Cams/Coach</div>
                  <div className="text-[8px] text-pink-400">Live Feed</div>
                </div>
              </div>
            </Card>

            {/* DMRC Emergency Hotlines */}
            <Card variant="default" padding="sm" className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-black dark:text-white">
                <Phone className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>DMRC Emergency Helplines</span>
              </h4>

              <div className="grid grid-cols-2 gap-1.5">
                <a
                  href={`tel:${DMRC_SAFETY_FEATURES.helplines.dmrtHelpline}`}
                  className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-950 dark:text-purple-200 transition"
                >
                  <div className="text-xs font-black text-purple-700 dark:text-purple-300">155370</div>
                  <div className="text-[9px] font-bold">24/7 Helpline</div>
                </a>

                <a
                  href={`tel:${DMRC_SAFETY_FEATURES.helplines.securityHelpline}`}
                  className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-950 dark:text-red-200 transition"
                >
                  <div className="text-xs font-black text-red-700 dark:text-red-300">011-23417910</div>
                  <div className="text-[9px] font-bold">CISF Security</div>
                </a>

                <a
                  href="https://wa.me/918800333600"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200 transition col-span-2 flex items-center justify-between text-xs font-bold"
                >
                  <span>WhatsApp: 8800-333-600</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold">Chat</span>
                </a>
              </div>
            </Card>

            {/* Central Delhi Metro Stations Directory */}
            <Card variant="default" padding="sm" className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-200 dark:border-neutral-800">
                <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-black dark:text-white">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Central Metro Stations</span>
                </h4>
                <span className="text-[9px] text-neutral-500">CISF Secured</span>
              </div>

              <div className="space-y-2">
                {REAL_DELHI_METRO_STATIONS.map((station) => (
                  <div
                    key={station.id}
                    className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-black dark:text-white">{station.name}</div>
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        ★ {station.safetyRating} Safety
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {station.lines.map((line, idx) => (
                        <span
                          key={idx}
                          className="text-[8px] font-bold px-1.5 py-0.2 rounded text-white"
                          style={{ backgroundColor: station.lineColors[idx] || '#2563EB' }}
                        >
                          {line}
                        </span>
                      ))}
                      {station.interchange && (
                        <span className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                          Interchange
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Last Train Departure Timetable */}
            <Card variant="default" padding="sm" className="space-y-2 bg-neutral-900 text-white border-neutral-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Last Train Departures</span>
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-[9px]">
                <div className="p-1.5 rounded-lg bg-neutral-800/60 border border-neutral-700/50">
                  <span className="text-amber-300 font-bold">Yellow:</span> {DMRC_SAFETY_FEATURES.lastTrainTimes.yellowLine}
                </div>
                <div className="p-1.5 rounded-lg bg-neutral-800/60 border border-neutral-700/50">
                  <span className="text-blue-300 font-bold">Blue:</span> {DMRC_SAFETY_FEATURES.lastTrainTimes.blueLine}
                </div>
                <div className="p-1.5 rounded-lg bg-neutral-800/60 border border-neutral-700/50">
                  <span className="text-purple-300 font-bold">Violet:</span> {DMRC_SAFETY_FEATURES.lastTrainTimes.violetLine}
                </div>
                <div className="p-1.5 rounded-lg bg-neutral-800/60 border border-neutral-700/50">
                  <span className="text-orange-300 font-bold">Airport:</span> {DMRC_SAFETY_FEATURES.lastTrainTimes.airportExpress}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
