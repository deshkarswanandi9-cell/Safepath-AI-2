import React from 'react';
import { Shield, ArrowRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { ScreenId } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface SplashScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  return (
    <div className="relative h-full flex flex-col justify-between p-5 bg-white dark:bg-black text-black dark:text-white select-none transition-colors">
      {/* Top Header Pill */}
      <div className="flex justify-between items-center z-10 pt-1">
        <Badge variant="subtle" size="sm" className="font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Safety Active</span>
        </Badge>
        <button
          id="btn-splash-skip"
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          Skip to Home →
        </button>
      </div>

      {/* Hero Visual Area: Minimalist Monochrome Shield */}
      <div className="flex-1 flex flex-col items-center justify-center my-3 z-10 text-center">
        {/* Emblem */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center shadow-sm">
            <Shield className="w-10 h-10 text-black dark:text-white stroke-[2]" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <h1 className="text-2xl font-black tracking-tight text-black dark:text-white">
          SafeRoute AI
        </h1>
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs leading-relaxed">
          Predictive urban navigation & night safety intelligence
        </p>

        {/* Route Preview Graphic */}
        <Card variant="default" padding="sm" className="mt-4 w-full max-w-xs shadow-xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 dark:text-neutral-400 mb-2 px-1">
            <span>Route Intelligence</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 98% Confidence
            </span>
          </div>

          {/* SVG Route Trajectory */}
          <div className="relative h-12 w-full bg-neutral-50 dark:bg-neutral-950 rounded-xl overflow-hidden flex items-center px-3 border border-neutral-200 dark:border-neutral-900">
            <svg viewBox="0 0 240 40" className="w-full h-8">
              <path
                d="M 10 20 Q 70 8, 120 22 T 230 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-neutral-300 dark:text-neutral-700"
                strokeLinecap="round"
              />
              <path
                d="M 10 20 Q 70 8, 120 22 T 230 15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-black dark:text-white"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
              {/* Origin, waypoint, destination */}
              <circle cx="10" cy="20" r="3.5" fill="currentColor" className="text-black dark:text-white" />
              <circle cx="120" cy="22" r="3" fill="currentColor" className="text-neutral-400" />
              <circle cx="230" cy="15" r="4.5" fill="#10B981" />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-1.5 mt-2.5 text-center">
            <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold">Lighting</div>
              <div className="text-xs font-black text-black dark:text-white">98% Lux</div>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold">Pedestrians</div>
              <div className="text-xs font-black text-black dark:text-white">Active</div>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold">Refuges</div>
              <div className="text-xs font-black text-black dark:text-white">5 Safe</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Primary Actions */}
      <div className="space-y-2 z-10 pb-1">
        <Button
          id="btn-splash-get-started"
          variant="primary"
          size="md"
          fullWidth
          onClick={() => onNavigate('dashboard')}
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Get Started
        </Button>

        <Button
          id="btn-splash-sign-in"
          variant="outline"
          size="md"
          fullWidth
          onClick={() => onNavigate('login')}
          icon={<Lock className="w-3.5 h-3.5" />}
        >
          Sign In / Register
        </Button>
      </div>
    </div>
  );
};
