import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  ChevronLeft, 
  Search, 
  CheckCircle2, 
  Building2 
} from 'lucide-react';
import { ScreenId, SafeHaven, RouteOption } from '../../types';
import { MOCK_SAFE_HAVENS, MOCK_ROUTES } from '../../data/mockData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface SafeHavenNetworkScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectRoute?: (route: RouteOption) => void;
}

export const SafeHavenNetworkScreen: React.FC<SafeHavenNetworkScreenProps> = ({
  onNavigate,
  onSelectRoute
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHaven, setSelectedHaven] = useState<SafeHaven>(MOCK_SAFE_HAVENS[0]);

  const filteredHavens = MOCK_SAFE_HAVENS.filter((haven) => {
    const matchesCat = activeCategory === 'all' || haven.category === activeCategory;
    const matchesSearch = haven.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          haven.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleNavigateToHaven = (haven: SafeHaven) => {
    setSelectedHaven(haven);
    if (onSelectRoute) {
      onSelectRoute(MOCK_ROUTES[2]);
    }
    onNavigate('live_navigation');
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
                Safe Haven Network
              </h1>
              <p className="text-[10px] text-neutral-500">24/7 Verified Refuges & Helpdesks</p>
            </div>
          </div>
          <Badge variant="safe" size="sm">
            5 Open Nearby
          </Badge>
        </div>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search safe havens, pharmacies, kiosks..."
            className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-3 py-2 pl-9 text-xs text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 mb-3">
          {[
            { id: 'all', label: 'All Refuges' },
            { id: 'pharmacy_247', label: '24/7 Pharmacy' },
            { id: 'police_kiosk', label: 'Police Kiosk' },
            { id: 'women_helpdesk', label: 'Women Helpdesk' },
            { id: 'campus_security', label: 'Campus Post' }
          ].map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Refuge List */}
        <div className="space-y-2">
          {filteredHavens.map((haven) => (
            <Card key={haven.id} variant="default" padding="sm" className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs font-black text-black dark:text-white">{haven.name}</h3>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span>{haven.address}</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 flex items-center gap-2 mt-0.5 font-medium">
                    <span>{haven.distance} ({haven.eta} walk)</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Open 24/7</span>
                  </div>
                </div>

                <Badge variant="subtle" size="sm">
                  ★ {haven.rating}
                </Badge>
              </div>

              {/* Verified Badges */}
              <div className="flex flex-wrap gap-1 pt-1">
                {haven.verifiedBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[8px] font-bold text-neutral-700 dark:text-neutral-300"
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleNavigateToHaven(haven)}
                  icon={<Navigation className="w-3.5 h-3.5" />}
                >
                  Direct Route
                </Button>

                <a
                  href={`tel:${haven.phone}`}
                  className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-xs font-bold text-black dark:text-white flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
