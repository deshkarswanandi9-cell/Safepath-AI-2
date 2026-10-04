import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertOctagon, 
  Clock, 
  CheckCircle2, 
  BellRing, 
  ArrowLeft 
} from 'lucide-react';
import { ScreenId } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface SafetyCheckInScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSafe: () => void;
  onNeedHelp: () => void;
}

export const SafetyCheckInScreen: React.FC<SafetyCheckInScreenProps> = ({
  onNavigate,
  onSafe,
  onNeedHelp
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [timerExpired, setTimerExpired] = useState(false);
  const [confirmedSafe, setConfirmedSafe] = useState(false);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      setTimerExpired(true);
      return;
    }
    if (confirmedSafe) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining, confirmedSafe]);

  const handleSafeClick = () => {
    setConfirmedSafe(true);
    setTimeout(() => {
      onSafe();
      onNavigate('live_navigation');
    }, 1000);
  };

  const totalSeconds = 30;
  const strokeDashoffset = (1 - secondsRemaining / totalSeconds) * 283;

  return (
    <div className="relative h-full flex flex-col justify-between p-5 bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-hidden">
      {/* Top Header */}
      <div className="pt-1 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigate('live_navigation')}
          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Back to Navigation"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-black text-black dark:text-white">
          Scheduled Safety Check-In
        </span>
        <div className="w-7" />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center my-3">
        {confirmedSafe ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-lg font-black text-black dark:text-white">Status Recorded: Safe!</h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs">
              Resuming active navigation route...
            </p>
          </div>
        ) : timerExpired ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500 text-red-600 dark:text-red-400 flex items-center justify-center mb-3">
              <BellRing className="w-9 h-9 animate-pulse" />
            </div>
            <h2 className="text-lg font-black text-red-600 dark:text-red-400">Timer Expired</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs font-semibold">
              Emergency coordinates dispatched to Mother, Friend, and Sister.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-black text-black dark:text-white tracking-tight">
              Are you safe?
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5 max-w-xs">
              Confirm your status within 30 seconds or an automatic alert will dispatch.
            </p>

            {/* Circular Countdown Timer */}
            <div className="relative w-40 h-40 my-6 flex items-center justify-center">
              <svg className="w-40 h-40 -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="45"
                  className="stroke-neutral-200 dark:stroke-neutral-800"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="45"
                  className={`transition-all duration-1000 ease-linear ${
                    secondsRemaining <= 10
                      ? 'stroke-red-500'
                      : 'stroke-black dark:stroke-white'
                  }`}
                  strokeWidth="6"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-4xl font-black tracking-tight ${
                  secondsRemaining <= 10 ? 'text-red-600 dark:text-red-400' : 'text-black dark:text-white'
                }`}>
                  {secondsRemaining}s
                </span>
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">
                  Remaining
                </span>
              </div>
            </div>

            <Card variant="subtle" padding="sm" className="max-w-xs text-center">
              <p className="text-[10px] text-neutral-500">
                Telemetry and coordinates are monitored continuously along your route.
              </p>
            </Card>
          </>
        )}
      </div>

      {/* Action Buttons */}
      {!confirmedSafe && (
        <div className="space-y-2 pb-1">
          <Button
            id="btn-checkin-safe"
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSafeClick}
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          >
            I am Safe — Continue Journey
          </Button>

          <Button
            id="btn-checkin-help"
            variant="danger"
            size="md"
            fullWidth
            onClick={onNeedHelp}
            icon={<AlertOctagon className="w-4 h-4" />}
          >
            I Need Emergency Assistance
          </Button>
        </div>
      )}
    </div>
  );
};
