import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Phone, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Star 
} from 'lucide-react';
import { ScreenId, SafeWalkerBuddy } from '../../types';
import { MOCK_SAFE_WALK_BUDDIES } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CommunitySafeWalkScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CommunitySafeWalkScreen: React.FC<CommunitySafeWalkScreenProps> = ({
  onNavigate
}) => {
  const [buddies] = useState<SafeWalkerBuddy[]>(MOCK_SAFE_WALK_BUDDIES);
  const [selectedBuddy, setSelectedBuddy] = useState<SafeWalkerBuddy | null>(null);
  const [requestConfirmed, setRequestConfirmed] = useState<boolean>(false);

  const handleRequestWalk = (buddy: SafeWalkerBuddy) => {
    setSelectedBuddy(buddy);
    setRequestConfirmed(true);
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
                Safe Walk Network
              </h1>
              <p className="text-[10px] text-neutral-500">Verified campus security & volunteer escorts</p>
            </div>
          </div>
          <Badge variant="safe" size="sm">
            3 Available
          </Badge>
        </div>

        {/* Confirmation Alert */}
        {requestConfirmed && selectedBuddy && (
          <div className="mb-3 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black text-black dark:text-white">Accompaniment Confirmed</span>
              </div>
              <Badge variant="subtle" size="sm">2 min ETA</Badge>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
              <strong>{selectedBuddy.name}</strong> ({selectedBuddy.organization}) is en route to your current GPS pin.
            </p>
            <div className="flex gap-2 pt-1">
              <Button variant="primary" size="sm" fullWidth onClick={() => setRequestConfirmed(false)}>
                Track Approach
              </Button>
              <Button variant="outline" size="sm" onClick={() => setRequestConfirmed(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <Card variant="subtle" padding="sm" className="mb-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-black dark:text-white">Verified Peer Escorts</span>
              <p className="text-[10px] text-neutral-500">Background-checked students & campus safety wardens</p>
            </div>
            <Badge variant="safe" size="sm">
              Zero Incidents
            </Badge>
          </div>
        </Card>

        {/* Buddy List */}
        <div className="space-y-2">
          {buddies.map((buddy) => (
            <Card key={buddy.id} variant="default" padding="sm" className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
                    <img
                      src={buddy.avatarUrl}
                      alt={buddy.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-black text-black dark:text-white">{buddy.name}</h3>
                      <span className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[8px] font-bold text-neutral-700 dark:text-neutral-300">
                        {buddy.badgeType.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500">{buddy.organization}</div>
                    <div className="text-[9px] text-neutral-400 mt-0.5 flex items-center gap-1.5">
                      <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                      <span>{buddy.rating} ({buddy.completedWalks} walks)</span>
                      <span>•</span>
                      <span>{buddy.distance} ({buddy.eta})</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${buddy.phone}`}
                  className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                  title={`Call ${buddy.name}`}
                  aria-label={`Call ${buddy.name}`}
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Request Button */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleRequestWalk(buddy)}
                >
                  Request Walk Accompaniment
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
