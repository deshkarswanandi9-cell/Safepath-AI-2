import React, { useEffect } from 'react';
import { AlertTriangle, X, Radio, ArrowRight, LightbulbOff, Users, AlertOctagon, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Button } from '../ui/Button';
import { modalBackdropVariants, modalContentVariants } from '../../utils/motion';
import { DynamicSafetyCalculation, EnvironmentalConditionsState, StoppedWaypointState } from '../../types';

interface SafetyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecalculate: () => void;
  calculation?: DynamicSafetyCalculation;
  conditions?: EnvironmentalConditionsState;
  stoppedWaypoint?: StoppedWaypointState | null;
}

export const SafetyAlertModal: React.FC<SafetyAlertModalProps> = ({
  isOpen,
  onClose,
  onRecalculate,
  calculation,
  conditions,
  stoppedWaypoint
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Escape key dismiss handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const currentScore = calculation?.currentScore ?? 58;
  const scoreDelta = calculation?.scoreDelta ?? -27;
  const activeAlerts = calculation?.activeAlerts ?? ['Streetlight failure: Illumination dropped to 18 Lux (-18 pts)'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="alert-dialog-title"
          variants={shouldReduceMotion ? undefined : modalBackdropVariants}
          initial={shouldReduceMotion ? false : "initial"}
          animate={shouldReduceMotion ? false : "animate"}
          exit={shouldReduceMotion ? false : "exit"}
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none"
        >
          <motion.div
            variants={shouldReduceMotion ? undefined : modalContentVariants}
            className="relative w-full max-w-xs rounded-2xl bg-white dark:bg-black text-black dark:text-white p-5 border border-neutral-300 dark:border-neutral-800 shadow-2xl overflow-hidden transition-colors"
          >
            {/* Top Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center justify-center">
                  <AlertTriangle className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 id="alert-dialog-title" className="text-sm font-black tracking-tight text-black dark:text-white">
                    Dynamic Safety Alert
                  </h3>
                  <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    Condition Change Detected
                  </span>
                </div>
              </div>
              <button
                id="btn-alert-close"
                type="button"
                onClick={onClose}
                aria-label="Close Alert"
                className="p-1 rounded-md text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Score Impact Banner */}
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 mb-2.5 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                  Updated Route Safety Score
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-lg font-black text-red-600 dark:text-red-400">
                    {currentScore}%
                  </span>
                  <span className="text-[10px] text-neutral-500 font-bold">
                    (was 85%)
                  </span>
                </div>
              </div>
              <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-red-600 text-white flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" />
                <span>{scoreDelta} pts</span>
              </span>
            </div>

            {/* Message */}
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
              Environmental conditions have deteriorated along your active trajectory. SafeRoute AI identified key changes:
            </p>

            {/* Stopped Location Point Info */}
            {stoppedWaypoint && (
              <div className="mt-2 p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                  <span className="truncate">Stopped: {stoppedWaypoint.locationName}</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 shrink-0">@ {stoppedWaypoint.progress}%</span>
              </div>
            )}

            {/* Telemetry Details */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] space-y-1.5">
              {activeAlerts.slice(0, 3).map((alert, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-neutral-700 dark:text-neutral-300 text-[10px] font-medium leading-tight">
                  <Radio className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                  <span>{alert}</span>
                </div>
              ))}
              <p className="text-[9px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-200 dark:border-neutral-800">
                Location: {stoppedWaypoint ? stoppedWaypoint.locationName : 'Current waypoint'} • Immediate escape corridor ready.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              <Button
                id="btn-alert-recalculate"
                variant="primary"
                fullWidth
                onClick={onRecalculate}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Recalculate Safer Alternative (+37%)
              </Button>

              <Button
                id="btn-alert-continue"
                variant="outline"
                fullWidth
                onClick={onClose}
              >
                Continue Route Anyway
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
