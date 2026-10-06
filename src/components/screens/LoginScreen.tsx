import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Phone, 
  ScanFace, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { ScreenId } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface LoginScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onLoginSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('shivani.safety@gmail.com');
  const [phone, setPhone] = useState('+1 (555) 789-2045');
  const [password, setPassword] = useState('••••••••••••');
  const [faceIdActive, setFaceIdActive] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSuccess) onLoginSuccess();
    onNavigate('dashboard');
  };

  const handleFaceId = () => {
    setFaceIdActive(true);
    setTimeout(() => {
      setFaceIdActive(false);
      if (onLoginSuccess) onLoginSuccess();
      onNavigate('dashboard');
    }, 900);
  };

  return (
    <div className="relative h-full flex flex-col justify-between p-5 bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          id="btn-login-back"
          type="button"
          onClick={() => onNavigate('splash')}
          className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Back to Splash"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 text-xs font-black tracking-tight text-black dark:text-white">
          <Shield className="w-4 h-4" />
          <span>SafeRoute AI</span>
        </div>
        <div className="w-7" />
      </div>

      {/* Brand & Auth Title */}
      <div className="my-2 text-center">
        <div className="w-12 h-12 rounded-xl mx-auto bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-2">
          <Lock className="w-5 h-5 text-black dark:text-white" />
        </div>
        <h2 className="text-lg font-black text-black dark:text-white tracking-tight">
          Welcome to SafeRoute
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Verify identity to unlock AI route protection
        </p>
      </div>

      {/* Auth Tab Switcher */}
      <div className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-xl flex text-xs font-bold border border-neutral-200 dark:border-neutral-800 mb-3">
        <button
          id="btn-login-tab-email"
          type="button"
          onClick={() => setLoginMethod('email')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            loginMethod === 'email'
              ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email</span>
        </button>
        <button
          id="btn-login-tab-phone"
          type="button"
          onClick={() => setLoginMethod('phone')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            loginMethod === 'phone'
              ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
              : 'text-neutral-500 hover:text-black dark:hover:text-white'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Phone</span>
        </button>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleAuth} className="space-y-2.5">
        {loginMethod === 'email' ? (
          <Input
            id="input-login-email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />
        ) : (
          <Input
            id="input-login-phone"
            label="Mobile Phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={<Phone className="w-4 h-4" />}
            required
          />
        )}

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="input-login-password" className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
              PIN / Password
            </label>
            <span className="text-[10px] font-bold text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer">
              Forgot?
            </span>
          </div>
          <Input
            id="input-login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
          />
        </div>

        <Button
          id="btn-login-submit"
          type="submit"
          variant="primary"
          fullWidth
          size="md"
          className="mt-1"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Continue Safely
        </Button>
      </form>

      {/* Biometric & Fast Auth Alternatives */}
      <div className="mt-3 pt-2.5 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Quick Mock Auth */}
          <button
            id="btn-login-google"
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="py-2 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs font-bold text-black dark:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Google</span>
          </button>

          {/* Biometric Face ID */}
          <button
            id="btn-login-faceid"
            type="button"
            onClick={handleFaceId}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              faceIdActive
                ? 'bg-neutral-200 dark:bg-neutral-800 border-black dark:border-white text-black dark:text-white'
                : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white'
            }`}
          >
            <ScanFace className="w-4 h-4" />
            <span>{faceIdActive ? 'Verifying...' : 'Face ID'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
