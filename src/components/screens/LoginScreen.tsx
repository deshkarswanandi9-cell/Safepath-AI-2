import React, { useState } from 'react';
import { 
  Shield, 
  Mail, 
  Phone, 
  ScanFace, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User
} from 'lucide-react';
import { ScreenId } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../context/UserContext';

interface LoginScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onLoginSuccess?: () => void;
}

// ---------------------------------------------------------------------------
// Checks whether Supabase credentials are actually configured
// ---------------------------------------------------------------------------
const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  return Boolean(url && url !== 'https://your-project-ref.supabase.co');
};

// ---------------------------------------------------------------------------
// Upsert a row in public.users so the profile exists in the database.
// ---------------------------------------------------------------------------
const upsertUserProfile = async (
  userId: string,
  email: string | undefined,
  fullName?: string
) => {
  const { error } = await supabase.from('users').upsert(
    {
      id: userId,
      full_name: fullName?.trim() || email?.split('@')[0] || 'SafeRoute User',
      language_preference: 'en',
      theme_preference: 'system',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id', ignoreDuplicates: false }
  );
  if (error) console.warn('[SafeRoute] Profile upsert error:', error.message);
};

// ---------------------------------------------------------------------------
// Human-friendly error messages
// ---------------------------------------------------------------------------
const friendlyError = (msg: string): string => {
  const m = msg.toLowerCase();
  if (m.includes('rate limit') || m.includes('email rate'))
    return 'Too many attempts — wait a minute and try again, or use a different email.';
  if (m.includes('invalid login') || m.includes('invalid credentials'))
    return 'Incorrect email or password. Please try again.';
  if (m.includes('email not confirmed'))
    return 'Please confirm your email first, or ask your admin to disable email confirmation.';
  if (m.includes('user already registered') || m.includes('already been registered'))
    return 'An account with this email already exists. Switch to Sign In.';
  if (m.includes('password') && m.includes('6'))
    return 'Password must be at least 6 characters.';
  if (m.includes('invalid email') || m.includes('is invalid'))
    return 'Please enter a valid email address.';
  return msg;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate, onLoginSuccess }) => {
  const { updateProfile, refreshUser } = useUser();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [faceIdActive, setFaceIdActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  const clearMessages = () => { setError(null); setSuccessMsg(null); };

  // -------------------------------------------------------------------------
  // Main auth handler — tries Supabase first, falls back to mock if not set up
  // -------------------------------------------------------------------------
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!isSupabaseConfigured()) {
      // Mock mode — update local context and navigate
      if (fullName.trim()) {
        updateProfile({ full_name: fullName.trim(), email: email || 'user@safepath.ai' });
      }
      if (onLoginSuccess) onLoginSuccess();
      onNavigate('dashboard');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // ── Sign Up ──────────────────────────────────────────────────────────
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName.trim() }, // stored in auth.users.raw_user_meta_data
          },
        });
        if (signUpError) throw signUpError;

        if (data.user) {
          await upsertUserProfile(data.user.id, email, fullName);
          await updateProfile({
            id: data.user.id,
            full_name: fullName.trim() || email.split('@')[0],
            email: email,
          });
        }

        if (data.session) {
          // Email confirmation disabled — logged in immediately
          await refreshUser();
          if (onLoginSuccess) onLoginSuccess();
          onNavigate('dashboard');
        } else {
          setSuccessMsg('Account created! Check your email to confirm, then Sign In.');
          setIsSignUp(false);
        }

      } else {
        // ── Sign In ──────────────────────────────────────────────────────────
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;

        if (data.user) {
          // Ensure profile row exists
          const meta = data.user.user_metadata as { full_name?: string } | undefined;
          await upsertUserProfile(data.user.id, data.user.email, meta?.full_name);
          await refreshUser();
          if (onLoginSuccess) onLoginSuccess();
          onNavigate('dashboard');
        }
      }
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : 'Authentication failed.';
      setError(friendlyError(raw));
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Face ID biometric (mock — browser only)
  // -------------------------------------------------------------------------
  const handleFaceId = () => {
    setFaceIdActive(true);
    setTimeout(() => {
      setFaceIdActive(false);
      if (onLoginSuccess) onLoginSuccess();
      onNavigate('dashboard');
    }, 900);
  };

  // -------------------------------------------------------------------------
  // Google OAuth
  // -------------------------------------------------------------------------
  const handleGoogle = async () => {
    if (!isSupabaseConfigured()) { onNavigate('dashboard'); return; }
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
    if (oauthError) setError(friendlyError(oauthError.message));
  };

  const notConfigured = !isSupabaseConfigured();

  return (
    <div className="relative h-full flex flex-col bg-white dark:bg-black text-black dark:text-white select-none transition-colors overflow-y-auto no-scrollbar">
      {/* Gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-50 dark:from-indigo-950/30 to-transparent pointer-events-none" />

      <div className="relative flex flex-col h-full p-5 pb-6">
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
        <div className="my-4 text-center">
          <div className="w-14 h-14 rounded-2xl mx-auto bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-black text-black dark:text-white tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {isSignUp
              ? 'Sign up to save your safety profile'
              : 'Sign in to unlock AI route protection'}
          </p>
          {notConfigured && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full inline-block">
              Demo mode — Supabase not configured
            </p>
          )}
        </div>

        {/* Auth Tab Switcher */}
        <div className="bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-xl flex text-xs font-bold border border-neutral-200 dark:border-neutral-800 mb-4">
          <button
            id="btn-login-tab-email"
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              loginMethod === 'email'
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
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
                ? 'bg-white dark:bg-black text-black dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone</span>
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleAuth} className="space-y-3 flex-1">

          {/* Full Name — only shown during Sign Up */}
          {isSignUp && (
            <Input
              id="input-login-name"
              label="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              placeholder="e.g. Shivani Deshkar"
              required
            />
          )}

          {/* Email or Phone */}
          {loginMethod === 'email' ? (
            <Input
              id="input-login-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              placeholder="you@example.com"
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
              placeholder="+91 98765 43210"
              required
            />
          )}

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="input-login-password" className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                PIN / Password
              </label>
              {!isSignUp && (
                <span className="text-[10px] font-bold text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer">
                  Forgot?
                </span>
              )}
            </div>
            <Input
              id="input-login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-4 h-4" />}
              placeholder={isSignUp ? 'Min. 6 characters' : 'Enter password'}
              required
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl text-[11px] font-medium bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl text-[11px] font-medium bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit */}
          <Button
            id="btn-login-submit"
            type="submit"
            variant="primary"
            fullWidth
            size="md"
            className="mt-1 bg-gradient-to-r from-indigo-600 to-violet-600 border-0 text-white"
            icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            disabled={loading}
          >
            {loading ? 'Verifying...' : isSignUp ? 'Create Account' : 'Continue Safely'}
          </Button>

          {/* Toggle Sign Up / Sign In */}
          <p className="text-center text-[11px] text-neutral-500 dark:text-neutral-400 pt-0.5">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); clearMessages(); }}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>

        {/* Biometric & Fast Auth Alternatives */}
        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-center text-[10px] text-neutral-400 mb-2 font-medium uppercase tracking-wide">Or continue with</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-login-google"
              type="button"
              onClick={handleGoogle}
              className="py-2.5 px-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs font-bold text-black dark:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              id="btn-login-faceid"
              type="button"
              onClick={handleFaceId}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                faceIdActive
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white'
              }`}
            >
              <ScanFace className="w-3.5 h-3.5" />
              <span>{faceIdActive ? 'Verifying...' : 'Face ID'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
