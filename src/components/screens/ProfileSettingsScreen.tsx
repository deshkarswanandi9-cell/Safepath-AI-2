import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  ShieldAlert, 
  Lock, 
  ChevronRight, 
  Check, 
  LogOut, 
  Sparkles,
  Phone,
  Radio,
  FileText,
  X,
  HeartPulse,
  Droplet
} from 'lucide-react';
import { ScreenId } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../data/translations';

interface ProfileSettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
}

export const ProfileSettingsScreen: React.FC<ProfileSettingsScreenProps> = ({
  onNavigate,
  onLogout
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [anonymizeGps, setAnonymizeGps] = useState(false);
  const [autoSosThreshold, setAutoSosThreshold] = useState('30 Seconds');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    const names = { en: 'English (US)', hi: 'Hindi (हिन्दी)', es: 'Español', fr: 'Français' };
    showToast(`Language updated to ${names[newLang]}`);
  };

  return (
    <div className={`relative min-h-[640px] h-full flex flex-col justify-between overflow-y-auto no-scrollbar p-4 pb-20 transition-colors ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      <div>
        {/* Top Header */}
        <div className="pt-2 flex items-center justify-between mb-4">
          <button
            id="btn-settings-back"
            onClick={() => onNavigate('dashboard')}
            className={`p-2 rounded-2xl shadow-sm border transition-colors ${
              darkMode 
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white' 
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
          }`}>
            <span>{t.accountPreferences}</span>
          </div>
          <div className="w-8" />
        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="mb-3 p-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* User Card */}
        <div className={`p-4 rounded-3xl border shadow-sm flex items-center gap-3.5 mb-5 ${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 p-0.5 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                alt="Shivani avatar"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[8px]">
              ✓
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Shivani Sharma</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Verified SafeID
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>shivani.safety@gmail.com</p>
            <p className="text-[10px] text-blue-500 font-semibold mt-1">
              Member of SafeRoute Network since 2025
            </p>
          </div>
        </div>

        {/* Settings Group 1: Account & Regional */}
        <div className="space-y-3 mb-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
            Preferences & Security
          </h3>

          {/* Option 1: Personal Information */}
          <div 
            onClick={() => setShowInfoModal(true)}
            className={`p-3.5 rounded-2xl border shadow-xs flex items-center justify-between transition-colors cursor-pointer ${
              darkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.personalInfo}</div>
                <div className="text-[10px] text-slate-400">{t.personalInfoDesc}</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Option 2: Language Selection Card with flags and dropdown */}
          <div className={`p-3.5 rounded-2xl border shadow-xs flex flex-col gap-2.5 transition-colors ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.languageSelect}</div>
                  <div className="text-[10px] text-slate-400">{t.languageSelectDesc}</div>
                </div>
              </div>
              <select
                id="select-language-dropdown"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                className="text-xs font-bold text-blue-600 bg-transparent focus:outline-none cursor-pointer border border-blue-200 rounded-lg px-2 py-1"
              >
                <option value="en">English (US)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>

            {/* Quick 1-click Language Flag Buttons */}
            <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700">
              {[
                { code: 'en' as SupportedLanguage, flag: '🇺🇸', label: 'English' },
                { code: 'hi' as SupportedLanguage, flag: '🇮🇳', label: 'हिन्दी' },
                { code: 'es' as SupportedLanguage, flag: '🇪🇸', label: 'Español' },
                { code: 'fr' as SupportedLanguage, flag: '🇫🇷', label: 'Français' }
              ].map((item) => (
                <button
                  key={item.code}
                  id={`btn-lang-${item.code}`}
                  onClick={() => handleLanguageChange(item.code)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    language === item.code
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{item.flag}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Option 3: Dark Mode */}
          <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.nightMode}</div>
                <div className="text-[10px] text-slate-400">{t.nightModeDesc}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => {
                  setDarkMode(e.target.checked);
                  showToast(e.target.checked ? 'Night Mode Enabled 🌙' : 'Light Mode Enabled ☀️');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* Settings Group 2: Safety & Emergency Preferences */}
        <div className="space-y-3 mb-5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
            Safety & System Protocols
          </h3>

          {/* Option 4: Notification Settings */}
          <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.notificationSettings}</div>
                <div className="text-[10px] text-slate-400">{t.notificationSettingsDesc}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => {
                  setPushNotifications(e.target.checked);
                  showToast(e.target.checked ? 'Push alerts enabled' : 'Push alerts paused');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Option 5: Emergency Preferences */}
          <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.emergencyPrefs}</div>
                <div className="text-[10px] text-slate-400">{t.emergencyPrefsDesc}</div>
              </div>
            </div>
            <select
              value={autoSosThreshold}
              onChange={(e) => {
                setAutoSosThreshold(e.target.value);
                showToast(`SOS Threshold set to ${e.target.value}`);
              }}
              className="text-xs font-bold text-slate-700 bg-slate-100 dark:bg-slate-700 dark:text-slate-200 px-2 py-1 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="15 Seconds">15 Seconds</option>
              <option value="30 Seconds">30 Seconds</option>
              <option value="60 Seconds">60 Seconds</option>
            </select>
          </div>

          {/* Option 6: Privacy Controls */}
          <div className={`p-3.5 rounded-2xl border shadow-xs flex items-center justify-between ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{t.privacyControls}</div>
                <div className="text-[10px] text-slate-400">{t.privacyControlsDesc}</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={anonymizeGps}
                onChange={(e) => {
                  setAnonymizeGps(e.target.checked);
                  showToast(e.target.checked ? 'GPS logs auto-delete enabled' : 'GPS standard logging active');
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Logout Button */}
        <button
          id="btn-logout"
          onClick={onLogout}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.signOut}</span>
        </button>
      </div>

      {/* Personal Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900">Emergency Medical Profile</h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Full Name</span>
                <span className="font-bold text-slate-800">Shivani Sharma</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-rose-500" /> Blood Group
                </span>
                <span className="font-black text-rose-600">O+ Positive</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-blue-500" /> Medical Conditions
                </span>
                <span className="font-semibold text-slate-700">None</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between">
                <span className="text-slate-500 font-medium">Primary Guardian</span>
                <span className="font-bold text-purple-700">Mother (+1 555-382-9102)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowInfoModal(false);
                showToast('Emergency profile verified');
              }}
              className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
