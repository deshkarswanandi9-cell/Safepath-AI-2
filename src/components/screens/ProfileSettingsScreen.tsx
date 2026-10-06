import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  Lock, 
  LogOut, 
  Check, 
  Shield, 
  Radio
} from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { SupportedLanguage } from '../../data/translations';
import { Card } from '../ui/Card';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { motion, useReducedMotion } from 'motion/react';
import { TRANSITIONS } from '../../utils/motion';

interface ProfileSettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  onNavigate,
  onLogout
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, toggleTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [anonymizeGps, setAnonymizeGps] = useState(false);
  const [autoSosThreshold, setAutoSosThreshold] = useState('30 Seconds');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    const names = { en: 'English', hi: 'हिन्दी', es: 'Español', fr: 'Français' };
    showToast(`Language set to ${names[newLang]}`);
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar p-4 pb-20">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pt-1 mb-3">
          <button
            id="btn-settings-back"
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
            {t.accountPreferences}
          </span>
          <div className="w-7" />
        </div>

        {/* Feedback Toast */}
        {toastMsg && (
          <div className="mb-3 p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold shadow-md flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* User Card */}
        <Card variant="default" padding="sm" className="flex items-center gap-3 mb-3 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
              alt="Shivani profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black text-black dark:text-white truncate">Shivani Sharma</h2>
              <span className="px-1.5 py-0.2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[8px] font-black rounded">
                VERIFIED
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">shivani.safety@gmail.com</p>
            <p className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300 mt-0.5">+1 (555) 789-2045</p>
          </div>
        </Card>

        {/* Settings Groups */}
        <div className="space-y-3">
          {/* Appearance & Global Theme Section */}
          <Card variant="default" padding="sm" className="space-y-2.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
              Appearance
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-black dark:text-white">Theme Selection</div>
                <div className="text-[10px] text-neutral-500">Pure monochrome high contrast</div>
              </div>

              <div 
                role="radiogroup" 
                aria-label="Theme Selection"
                className="relative inline-flex items-center p-0.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 text-xs font-bold"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={theme === 'light'}
                  onClick={() => setTheme('light')}
                  className="relative px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {theme === 'light' && (
                    <motion.span
                      layoutId="profile-theme-indicator"
                      transition={shouldReduceMotion ? TRANSITIONS.reduced : TRANSITIONS.indicatorSpring}
                      className="absolute inset-0 rounded-md bg-white shadow-xs z-0"
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${theme === 'light' ? 'text-black font-black' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Light</span>
                  </span>
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={theme === 'dark'}
                  onClick={() => setTheme('dark')}
                  className="relative px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {theme === 'dark' && (
                    <motion.span
                      layoutId="profile-theme-indicator"
                      transition={shouldReduceMotion ? TRANSITIONS.reduced : TRANSITIONS.indicatorSpring}
                      className="absolute inset-0 rounded-md bg-black shadow-xs z-0"
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-1.5 ${theme === 'dark' ? 'text-white font-black' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}>
                    <Moon className="w-3.5 h-3.5 text-neutral-300" />
                    <span>Dark</span>
                  </span>
                </button>
              </div>
            </div>
          </Card>

          {/* Language Selector */}
          <Card variant="default" padding="sm" className="space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
              Language / भाषा
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { code: 'en', label: 'English (US)' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
                { code: 'es', label: 'Español' },
                { code: 'fr', label: 'Français' }
              ].map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code as SupportedLanguage)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-bold border transition-colors flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Safety & Sensor Preferences */}
          <Card variant="default" padding="sm" className="space-y-2.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
              Safety Automation
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-black dark:text-white">Push Notifications</div>
                <div className="text-[10px] text-neutral-500">Immediate incident route alerts</div>
              </div>
              <Switch
                id="switch-push"
                checked={pushNotifications}
                onChange={setPushNotifications}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div>
                <div className="text-xs font-bold text-black dark:text-white">Anonymize GPS Log</div>
                <div className="text-[10px] text-neutral-500">Zero persistent telemetry logs</div>
              </div>
              <Switch
                id="switch-anon"
                checked={anonymizeGps}
                onChange={setAnonymizeGps}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div>
                <div className="text-xs font-bold text-black dark:text-white">Check-In Threshold</div>
                <div className="text-[10px] text-neutral-500">Auto emergency dispatch window</div>
              </div>
              <select
                value={autoSosThreshold}
                onChange={(e) => setAutoSosThreshold(e.target.value)}
                className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white text-xs font-bold rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="15 Seconds">15 Seconds</option>
                <option value="30 Seconds">30 Seconds</option>
                <option value="60 Seconds">60 Seconds</option>
              </select>
            </div>
          </Card>
        </div>
      </div>

      {/* Logout Action */}
      <div className="mt-4 pt-2">
        <Button
          id="btn-settings-logout"
          variant="outline"
          fullWidth
          size="md"
          onClick={onLogout}
          icon={<LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />}
        >
          Sign Out of SafeRoute
        </Button>
      </div>
    </div>
  );
};
