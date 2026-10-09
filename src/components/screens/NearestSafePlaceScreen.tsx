import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  Navigation, 
  Building2, 
  Hospital, 
  CheckCircle2, 
  AlertTriangle,
  Radio, 
  ExternalLink,
  ChevronRight,
  Flame,
  Clock,
  Car
} from 'lucide-react';
import { ScreenId, RouteOption } from '../../types';
import { 
  EmergencyType, 
  SafePlaceItem, 
  EMERGENCY_SCENARIOS, 
  getRankedSafeHavens, 
  havenToRouteOption 
} from '../../data/emergencySafeHavenFinder';
import { MapEngine } from '../MapEngine';

interface NearestSafePlaceScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectRoute?: (route: RouteOption) => void;
  initialEmergencyType?: EmergencyType;
}

export const NearestSafePlaceScreen: React.FC<NearestSafePlaceScreenProps> = ({
  onNavigate,
  onSelectRoute,
  initialEmergencyType = 'threat_harassment'
}) => {
  const [emergencyType, setEmergencyType] = useState<EmergencyType>(initialEmergencyType as EmergencyType);
  const [rankedData, setRankedData] = useState(() => getRankedSafeHavens((initialEmergencyType || 'threat_harassment') as EmergencyType));
  const [selectedHaven, setSelectedHaven] = useState<SafePlaceItem>(rankedData.heroRecommendation);
  const [activeNavMode, setActiveNavMode] = useState<boolean>(false);
  const [navProgress, setNavProgress] = useState<number>(20);
  const [isArrived, setIsArrived] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pcrStreamActive, setPcrStreamActive] = useState<boolean>(true);

  // Recalculate ranking whenever emergency type changes
  useEffect(() => {
    const data = getRankedSafeHavens(emergencyType);
    setRankedData(data);
    setSelectedHaven(data.heroRecommendation);
    triggerToast(`Re-ranked safe havens for ${data.emergencyContext.label}`);
  }, [emergencyType]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Turn-by-turn navigation simulation towards chosen safe haven
  useEffect(() => {
    if (!activeNavMode) return;

    const interval = setInterval(() => {
      setNavProgress((prev) => {
        if (prev >= 100) {
          setIsArrived(true);
          clearInterval(interval);
          triggerToast('Safely Arrived at Safe Haven! Guardians & Police notified.');
          return 100;
        }
        return prev + 15;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [activeNavMode]);

  const handleStartNavigation = (haven: SafePlaceItem) => {
    setSelectedHaven(haven);
    setActiveNavMode(true);
    setNavProgress(15);
    setIsArrived(false);
    const routeOpt = havenToRouteOption(haven);
    if (onSelectRoute) {
      onSelectRoute(routeOpt);
    }
    triggerToast(`Navigating to ${haven.name}. Route shared with PCR Dispatch & Guardians.`);
  };

  const activeRoute = havenToRouteOption(selectedHaven);

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar font-sans pb-24">
      <div>
        {/* ========================================================================= */}
        {/* 1. TOP EMERGENCY HEADER (High-Urgency SOS Banner)                        */}
        {/* ========================================================================= */}
        <div className="sticky top-0 z-40 bg-red-600 text-white px-3.5 py-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="p-1 rounded-lg bg-black/20 hover:bg-black/30 text-white transition-colors cursor-pointer"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span className="text-[11px] font-black uppercase tracking-wider">
                    Emergency Mode • SOS Active
                  </span>
                </div>
                <p className="text-[9.5px] text-red-100 font-medium">
                  Nearest Safe Place Recommendation System
                </p>
              </div>
            </div>

            <a
              href="tel:112"
              className="px-2.5 py-1 rounded-md bg-white text-red-700 text-xs font-black shadow-sm flex items-center gap-1 hover:bg-neutral-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>112 India</span>
            </a>
          </div>

          {/* Live Police Control Room Link Status */}
          <div className="mt-2 pt-1.5 border-t border-red-500/50 flex items-center justify-between text-[9px] text-red-100 font-bold">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-white animate-pulse" />
              <span>PCR Dispatch Unit 12 Telemetry Active</span>
            </span>
            <span>GPS Locked: Connaught Place</span>
          </div>
        </div>

        {/* Action Toast Feedback */}
        {toastMessage && (
          <div className="m-3 p-2.5 rounded-xl bg-neutral-900 text-white border border-neutral-700 text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1">{toastMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. EMERGENCY SCENARIO SELECTOR (Immediate Context Re-Ranking)             */}
        {/* ========================================================================= */}
        <div className="p-3 pb-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5">
            Select Emergency Scenario to Re-Rank Havens
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(EMERGENCY_SCENARIOS) as EmergencyType[]).map((typeKey) => {
              const sc = EMERGENCY_SCENARIOS[typeKey];
              const isSelected = emergencyType === typeKey;
              return (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => {
                    setEmergencyType(typeKey);
                    setActiveNavMode(false);
                  }}
                  className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-neutral-900 dark:border-white shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  <div className="text-[11px] font-black truncate">{sc.shortLabel}</div>
                  <div className="text-[8.5px] opacity-80 truncate mt-0.5">
                    Prioritizes {sc.priorityCategory === 'police' ? 'Police Kiosks' : 'Hospital Trauma'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. HERO RECOMMENDATION: "NEAREST SUITABLE SAFE PLACE"                     */}
        {/* ========================================================================= */}
        <div className="p-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-2 border-emerald-500/40 dark:border-emerald-500/30 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9.5px] font-black tracking-wider uppercase flex items-center gap-1">
                <span>★ Nearest Suitable Safe Place</span>
              </span>
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">
                {selectedHaven.routeSafetyScore}% Safe Route
              </span>
            </div>

            <div className="flex items-start justify-between gap-2 mt-2">
              <div>
                <h2 className="text-base font-black text-black dark:text-white leading-tight">
                  {selectedHaven.name}
                </h2>
                <p className="text-xs font-bold text-neutral-600 dark:text-neutral-300 mt-0.5">
                  {selectedHaven.categoryTitle} • <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{selectedHaven.walkEta} ({selectedHaven.distance})</span>
                </p>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                  {selectedHaven.address}
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                {selectedHaven.category === 'police' && <ShieldAlert className="w-5 h-5" />}
                {selectedHaven.category === 'hospital' && <Hospital className="w-5 h-5" />}
                {(selectedHaven.category === 'pharmacy' || selectedHaven.category === 'staffed_public') && <Building2 className="w-5 h-5" />}
              </div>
            </div>

            {/* Suitability explanation */}
            <div className="my-2.5 p-2 rounded-xl bg-white/80 dark:bg-black/60 border border-emerald-500/20 text-[11px] text-neutral-800 dark:text-neutral-200">
              <p className="font-semibold leading-relaxed">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">Why recommended: </span>
                {selectedHaven.purposeDescription} {selectedHaven.suitabilityReason}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[8.5px] font-bold text-neutral-700 dark:text-neutral-300">
                  ⚡ {selectedHaven.lightingScore} Lux Illuminated
                </span>
                <span className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[8.5px] font-bold text-neutral-700 dark:text-neutral-300">
                  👮 {selectedHaven.staffingLabel}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-[8.5px] font-bold text-emerald-800 dark:text-emerald-300">
                  ✓ Verified 24/7 Haven
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button
                type="button"
                id="btn-navigate-safe-place"
                onClick={() => handleStartNavigation(selectedHaven)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-black text-white dark:bg-white dark:text-black font-black text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Navigation className="w-4 h-4 text-emerald-400 dark:text-emerald-600 fill-emerald-400 dark:fill-emerald-600" />
                <span>Start Turn-by-Turn Guidance</span>
              </button>

              <a
                href={`tel:${selectedHaven.phone}`}
                className="py-2.5 px-3.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Haven</span>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. REAL OPENSTREETMAP LIVE GUIDANCE PREVIEW                               */}
        {/* ========================================================================= */}
        <div className="px-3 mb-3">
          <div className="relative rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-800 shadow-sm">
            <MapEngine
              heightClass="h-48"
              activeRoute={activeRoute}
              showHeatmap={false}
              showHelpPoints={true}
              interactive={true}
              navMode={activeNavMode}
              userProgress={navProgress}
              luxLevel={selectedHaven.lightingScore}
            />

            {/* In-Map Active Guidance Overlay Banner */}
            <div className="absolute top-2.5 left-2.5 right-2.5 z-400 p-2 rounded-xl bg-black/90 text-white backdrop-blur-md flex items-center justify-between text-[10px] font-bold shadow-md">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">Direct Path to: {selectedHaven.name}</span>
              </div>
              <span className="text-emerald-400 shrink-0 ml-2">
                {isArrived ? 'Arrived ✓' : `${Math.round((100 - navProgress) * 1.8)}m Remaining`}
              </span>
            </div>

            {/* Navigation Progress State Card */}
            {activeNavMode && (
              <div className="absolute bottom-2.5 left-2.5 right-2.5 z-400 p-2.5 rounded-xl bg-white/95 dark:bg-black/95 text-black dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase">
                    {isArrived ? 'Status: Protected & Safe' : 'Live Navigation Tracking'}
                  </div>
                  <div className="text-xs font-black mt-0.5">
                    {isArrived ? '✓ You have reached safe haven' : selectedHaven.recommendedAction}
                  </div>
                </div>
                {isArrived ? (
                  <span className="px-2 py-1 rounded-md bg-emerald-600 text-white text-[10px] font-bold">
                    Safe ✓
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setNavProgress(100);
                      setIsArrived(true);
                      triggerToast('Arrival confirmed. Emergency dispatch updated.');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Confirm Arrived
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. ALL VERIFIED CATEGORIZED OPTIONS (Detailed Alternative Places)         */}
        {/* ========================================================================= */}
        <div className="px-3 space-y-4">
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
              Nearby Verified Places by Category
            </h3>
            <p className="text-[10px] text-neutral-500">
              Multiple verified safe havens with active staffing and continuous lighting
            </p>
          </div>

          {/* Category A: Police Stations */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
              <h4 className="text-xs font-black text-black dark:text-white">Police Station</h4>
              <span className="text-[10px] text-neutral-500 font-medium">— Best when you need police assistance.</span>
            </div>

            <div className="space-y-2">
              {rankedData.policeOptions.map((haven) => {
                const isSelected = selectedHaven.id === haven.id;
                return (
                  <div
                    key={haven.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-black dark:text-white">{haven.name}</h5>
                          {haven.isOpen247 && (
                            <span className="px-1 py-0.2 rounded text-[7.5px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              24/7
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{haven.address}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-blue-600">{haven.walkEta}</div>
                        <div className="text-[9px] text-neutral-400">{haven.distance} away</div>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-neutral-600 dark:text-neutral-300 flex items-center justify-between">
                      <span>👮 {haven.staffingLabel}</span>
                      <span className="font-bold text-emerald-600">{haven.routeSafetyScore}% Safety</span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartNavigation(haven)}
                        className="flex-1 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-[10px] flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Navigate to Station</span>
                      </button>

                      <a
                        href={`tel:${haven.phone}`}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-[10px] font-bold text-black dark:text-white flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3 text-blue-600" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category B: Hospital Emergency Departments */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Hospital className="w-3.5 h-3.5 text-red-600" />
              <h4 className="text-xs font-black text-black dark:text-white">Hospital Emergency Department</h4>
              <span className="text-[10px] text-neutral-500 font-medium">— For injury, medical distress or urgent treatment.</span>
            </div>

            <div className="space-y-2">
              {rankedData.hospitalOptions.map((haven) => {
                const isSelected = selectedHaven.id === haven.id;
                return (
                  <div
                    key={haven.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-red-600 bg-red-50/50 dark:bg-red-950/20'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-black dark:text-white">{haven.name}</h5>
                          <span className="px-1 py-0.2 rounded text-[7.5px] font-extrabold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                            Trauma Unit
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{haven.address}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-red-600">{haven.driveEta}</div>
                        <div className="text-[9px] text-neutral-400">{haven.distance} away</div>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-neutral-600 dark:text-neutral-300 flex items-center justify-between">
                      <span>🏥 {haven.staffingLabel}</span>
                      <span className="font-bold text-emerald-600">{haven.routeSafetyScore}% Safety</span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartNavigation(haven)}
                        className="flex-1 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-[10px] flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Navigate to Emergency Bay</span>
                      </button>

                      <a
                        href={`tel:${haven.phone}`}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-[10px] font-bold text-black dark:text-white flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3 text-red-600" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category C: Verified Open Pharmacy or Staffed Public Location */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <h4 className="text-xs font-black text-black dark:text-white">Verified Open Pharmacy / Staffed Public Location</h4>
              <span className="text-[10px] text-neutral-500 font-medium">— A possible nearby place to seek help when appropriate.</span>
            </div>

            <div className="space-y-2">
              {rankedData.pharmacyAndPublicOptions.map((haven) => {
                const isSelected = selectedHaven.id === haven.id;
                return (
                  <div
                    key={haven.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-bold text-black dark:text-white">{haven.name}</h5>
                          {haven.isOpen247 && (
                            <span className="px-1 py-0.2 rounded text-[7.5px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              24/7 Open
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{haven.address}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-black text-amber-600">{haven.walkEta}</div>
                        <div className="text-[9px] text-neutral-400">{haven.distance} away</div>
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] text-neutral-600 dark:text-neutral-300 flex items-center justify-between">
                      <span>🏪 {haven.staffingLabel}</span>
                      <span className="font-bold text-emerald-600">{haven.routeSafetyScore}% Safety</span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartNavigation(haven)}
                        className="flex-1 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-[10px] flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Navigate to Haven</span>
                      </button>

                      <a
                        href={`tel:${haven.phone}`}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black text-[10px] font-bold text-black dark:text-white flex items-center gap-1"
                      >
                        <PhoneCall className="w-3 h-3 text-amber-600" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6. POLICE DASHBOARD BRIDGE & PANIC ESCALATION                             */}
          {/* ========================================================================= */}
          <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                <div>
                  <h4 className="text-xs font-black text-black dark:text-white">
                    Police Control Room Live Dashboard Bridge
                  </h4>
                  <p className="text-[9.5px] text-neutral-500">
                    Destination & route continuously streamed to authorized police monitor
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-extrabold">
                Live Sync
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
              <div>
                <span className="font-bold">Monitored Haven: </span>
                <span>{selectedHaven.name}</span>
              </div>
              <span className="text-emerald-600 font-bold">ETA: {selectedHaven.walkEta}</span>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('proactive_police_monitoring')}
              className="w-full py-2 px-3 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Police Control Room Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
