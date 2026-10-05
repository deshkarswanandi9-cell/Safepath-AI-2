import React from 'react';
import { Shield, ArrowRight, Lock, Sparkles, CheckCircle2, Bot } from 'lucide-react';
import { ScreenId } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface SplashScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenAi?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate, onOpenAi }) => {
  return (
    <div className="relative h-full flex flex-col justify-between p-4 sm:p-5 bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar">
      {/* Top Header Row: Safety Active Pill + (AI Assistant Trigger & Skip Action) */}
      <div className="flex justify-between items-center z-10 pt-0.5 shrink-0 gap-2">
        <Badge variant="subtle" size="sm" className="font-bold shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Safety Active</span>
        </Badge>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            id="btn-floating-ai-copilot"
            data-testid="btn-splash-ai"
            type="button"
            onClick={onOpenAi}
            className="px-2.5 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-bold flex items-center gap-1.5 shadow-xs border border-neutral-700 dark:border-neutral-300 transition-all cursor-pointer hover:opacity-90 active:scale-95"
            aria-label="Open SafeRoute AI Assistant"
            title="Open SafeRoute AI Assistant"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-wider">AI</span>
          </button>

          <button
            id="btn-splash-skip"
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer py-1 px-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-900 shrink-0"
            aria-label="Skip to Home Dashboard"
          >
            Skip to Home →
          </button>
        </div>
      </div>

      {/* Hero Visual Area: Minimalist Monochrome Shield & Brand */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto py-2 z-10 text-center min-h-0">
        {/* Shield Emblem */}
        <div className="relative mb-3 shrink-0">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-center shadow-xs">
            <Shield className="w-8 h-8 sm:w-9 sm:h-9 text-black dark:text-white stroke-[2.2]" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <h1 className="text-2xl font-black tracking-tight text-black dark:text-white leading-tight">
          SafeRoute AI
        </h1>
        <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-1 max-w-[260px] leading-relaxed mx-auto">
          Predictive urban navigation & night safety intelligence
        </p>

        {/* Route Preview Graphic Card */}
        <Card variant="default" padding="sm" className="mt-3.5 w-full max-w-[320px] shadow-xs shrink-0">
          <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 px-0.5">
            <span className="uppercase tracking-wider">Route Intelligence</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 98% Confidence
            </span>
          </div>

          {/* SVG Route Trajectory */}
          <div className="relative h-10 w-full bg-neutral-50 dark:bg-neutral-950 rounded-lg overflow-hidden flex items-center px-2.5 border border-neutral-200 dark:border-neutral-900">
            <svg viewBox="0 0 240 32" className="w-full h-7">
              <path
                d="M 10 16 Q 70 6, 120 18 T 230 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-neutral-300 dark:text-neutral-700"
                strokeLinecap="round"
              />
              <path
                d="M 10 16 Q 70 6, 120 18 T 230 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-black dark:text-white"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
              {/* Origin, waypoint, destination */}
              <circle cx="10" cy="16" r="3.5" fill="currentColor" className="text-black dark:text-white" />
              <circle cx="120" cy="18" r="3" fill="currentColor" className="text-neutral-400" />
              <circle cx="230" cy="12" r="4.5" fill="#10B981" />
            </svg>
          </div>

          {/* Metric Row */}
          <div className="grid grid-cols-3 gap-1.5 mt-2 text-center">
            <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 min-w-0">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold truncate">Lighting</div>
              <div className="text-xs font-black text-black dark:text-white mt-0.5 truncate">98% Lux</div>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 min-w-0">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold truncate">Pedestrians</div>
              <div className="text-xs font-black text-black dark:text-white mt-0.5 truncate">Active</div>
            </div>
            <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 min-w-0">
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400 font-bold truncate">Refuges</div>
              <div className="text-xs font-black text-black dark:text-white mt-0.5 truncate">5 Safe</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Primary & Secondary Actions */}
      <div className="space-y-2 z-10 shrink-0 pt-2 pb-1.5">
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
