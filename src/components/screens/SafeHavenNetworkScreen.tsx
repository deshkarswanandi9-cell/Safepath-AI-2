import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Navigation, 
  ChevronRight, 
  Search, 
  Hospital, 
  Sparkles, 
  Coffee, 
  Building2, 
  ShieldCheck, 
  Radio, 
  UserCheck, 
  Camera, 
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { ScreenId, SafeHaven, RouteOption } from '../../types';
import { MOCK_SAFE_HAVENS, MOCK_ROUTES } from '../../data/mockData';
import { MapEngine } from '../MapEngine';

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
  const [callInitiated, setCallInitiated] = useState<boolean>(false);

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

  const handleCallHaven = (phone: string) => {
    setCallInitiated(true);
    setTimeout(() => setCallInitiated(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto no-scrollbar pb-28 select-none">
      {/* Top Header Card */}
      <div className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-xl text-white px-4 pt-3 pb-3.5 border-b border-slate-800 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1">
                  Verified Safe Haven Network
                </h1>
              </div>
              <p className="text-[10px] text-slate-400">
                24/7 Verified Refuges, Women Helpdesks & Safe Spaces
              </p>
            </div>
          </div>

          <span className="px-2 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            5 Open Nearby
          </span>
        </div>

        {/* Search Input */}
        <div className="mt-3 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search safe havens, pharmacies, kiosks..."
            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-2 pl-9 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'All Safe Havens' },
            { id: 'pharmacy_247', label: '24/7 Pharmacy' },
            { id: 'women_helpdesk', label: 'Women Helpdesk' },
            { id: 'campus_security', label: 'Campus Security' },
            { id: 'verified_retail', label: 'Verified Retail' },
            { id: 'hospital', label: 'Emergency Trauma' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Embedded Map Locator Section */}
      <div className="relative w-full h-[190px] bg-slate-200 border-b border-slate-300">
        <MapEngine
          activeRoute={MOCK_ROUTES[2]}
          selectedRouteId="route_c"
          showHelpPoints={true}
          showHeatmap={false}
          heightClass="h-full"
          userProgress={25}
        />
        <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-slate-700 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Showing Verified Refuges in 1km Radius</span>
        </div>
      </div>

      {/* Safe Haven Directory Cards */}
      <div className="p-4 space-y-3">
        {callInitiated && (
          <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="text-xs font-bold">Connecting to Safe Haven Hotline...</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Live</span>
          </div>
        )}

        {filteredHavens.map((haven) => (
          <div
            key={haven.id}
            className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
                  haven.category === 'women_helpdesk'
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-purple-200'
                    : haven.category === 'pharmacy_247'
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-200'
                    : haven.category === 'hospital'
                    ? 'bg-gradient-to-tr from-rose-600 to-red-600 shadow-rose-200'
                    : 'bg-gradient-to-tr from-blue-600 to-cyan-600 shadow-blue-200'
                }`}>
                  {haven.category === 'hospital' ? (
                    <Hospital className="w-5 h-5" />
                  ) : haven.category === 'women_helpdesk' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : haven.category === 'campus_security' ? (
                    <Building2 className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-900 leading-snug">{haven.name}</h3>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {haven.address}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {haven.distance}
                </span>
                <div className="text-[9px] font-bold text-slate-400 mt-1">{haven.eta}</div>
              </div>
            </div>

            {/* Verification Feature Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {haven.femaleStaffOnDuty && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Female Staff on Duty
                </span>
              )}
              {haven.cctvVerified && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  24/7 CCTV Monitored
                </span>
              )}
              {haven.isOpen247 && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Open 24/7
                </span>
              )}
            </div>

            {/* Action Buttons: Navigate & Call */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleCallHaven(haven.phone)}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                Call Safe Haven
              </button>

              <button
                onClick={() => handleNavigateToHaven(haven)}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                Navigate Here
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
