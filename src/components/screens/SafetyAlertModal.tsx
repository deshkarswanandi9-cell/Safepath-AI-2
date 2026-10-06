import React, { useEffect } from 'react';
import { AlertTriangle, X, Radio, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Button } from '../ui/Button';
import { modalBackdropVariants, modalContentVariants } from '../../utils/motion';

interface SafetyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecalculate: () => void;
}

export const SafetyAlertModal: React.FC<SafetyAlertModalProps> = ({
  isOpen,
  onClose,
  onRecalculate
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
                    Safety Incident Alert
                  </h3>
                  <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    High Priority
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

            {/* Message */}
            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
              Route conditions have changed due to a recently reported civic incident nearby.
            </p>

            {/* Telemetry Details */}
            <div className="mt-3 p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] space-y-1">
              <div className="flex items-center justify-between font-bold text-black dark:text-white">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-red-500" />
                  <span>Reported: Unscheduled Blockade</span>
                </span>
                <span className="text-[10px] text-neutral-500">3 min ago</span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Location: Elm Street crossing • 220m ahead of current trajectory.
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
                Recalculate Safer Route
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
