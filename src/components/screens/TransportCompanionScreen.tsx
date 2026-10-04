import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  AlertTriangle, 
  Share2, 
  AlertOctagon, 
  ChevronLeft, 
  CheckCircle2, 
  Radio, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { ScreenId, TransitCompanionTrip } from '../../types';
import { MOCK_TRANSIT_COMPANION_DEFAULT, MOCK_ROUTES } from '../../data/mockData';
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
    setTimeout(() => setSharedToast(false), 2500);
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-6">
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
          <Badge variant="safe" size="sm">
            Telemetry Active
          </Badge>
        </div>

        {/* Toast */}
        {sharedToast && (
          <div className="mb-2.5 p-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold shadow-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Live cab coordinates shared with 3 registered guardians</span>
          </div>
        )}

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
            Vehicle GPS Locked: {trip.vehiclePlate}
          </div>
        </div>

        {/* Active Deviation or Stop Warning Banners */}
        {deviationAlert && (
          <div className="mb-2.5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Route Deviation Alert: +{trip.routeDeviationMeters}m off trajectory</span>
            </div>
            <button
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
              <span>Prolonged Stop: Stationary {trip.unusualStopSeconds}s</span>
            </div>
            <button
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

        {/* Test Simulation Controls */}
        <Card variant="subtle" padding="sm" className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
            Ride Simulation Triggers
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={handleSimulateDeviation}
              className="py-1 px-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[9px] font-bold text-black dark:text-white hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center"
            >
              +280m Deviation
            </button>

            <button
              type="button"
              onClick={handleSimulateStop}
              className="py-1 px-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[9px] font-bold text-black dark:text-white hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center"
            >
              +3m Stop Alert
            </button>

            <button
              type="button"
              onClick={handleResetTrip}
              className="py-1 px-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-[9px] font-bold text-black dark:text-white hover:border-black dark:hover:border-white transition-colors cursor-pointer text-center"
            >
              Reset Trip
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
