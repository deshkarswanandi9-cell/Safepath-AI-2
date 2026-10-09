import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from './LanguageContext';
import { SupportedLanguage } from '../data/translations';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  avatar_url?: string;
  emergency_pin?: string;
  home_address?: string;
  work_address?: string;
  blood_group?: string;
  emergency_notes?: string;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

interface UserContextType {
  profile: UserProfile;
  firstName: string;
  timeOfDay: TimeOfDay;
  greeting: string;
  liveTime: string;
  liveDate: string;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;
  refreshUser: () => Promise<void>;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest-user',
  full_name: 'Swanandi Deshkar',
  email: 'deshkarswanandi9@gmail.com',
  phone_number: '+91 98765 43210',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  blood_group: 'B+',
  emergency_notes: 'Asthma inhaler in outer bag pocket',
};

const STORAGE_KEY = 'saferoute_user_profile';

const GREETINGS_BY_LANG: Record<SupportedLanguage, Record<TimeOfDay, string>> = {
  en: {
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',
    night: 'Stay Safe Tonight',
  },
  hi: {
    morning: 'सुप्रभात',
    afternoon: 'शुभ दोपहर',
    evening: 'शुभ संध्या',
    night: 'शुभ रात्रि',
  },
  es: {
    morning: 'Buenos Días',
    afternoon: 'Buenas Tardes',
    evening: 'Buenas Noches',
    night: 'Buenas Noches',
  },
  fr: {
    morning: 'Bonjour',
    afternoon: 'Bon après-midi',
    evening: 'Bonsoir',
    night: 'Bonne nuit',
  },
};

const getTimeOfDay = (date: Date): TimeOfDay => {
  const hours = date.getHours();
  if (hours >= 5 && hours < 12) return 'morning';
  if (hours >= 12 && hours < 17) return 'afternoon';
  if (hours >= 17 && hours < 22) return 'evening';
  return 'night';
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(cached) };
      }
    } catch {
      // ignore JSON parse error
    }
    return DEFAULT_PROFILE;
  });

  const [currentDateObj, setCurrentDateObj] = useState<Date>(() => new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Live clock tick every 10 seconds (efficient for minute-accurate UI)
  useEffect(() => {
    const updateTime = () => setCurrentDateObj(new Date());
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Supabase user profile
  const fetchSupabaseProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const user = session.user;
      const userMeta = user.user_metadata || {};
      const fallbackName = userMeta.full_name || user.email?.split('@')[0] || 'SafeRoute User';

      // Query public.users table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('[UserContext] Supabase profile fetch warning:', error.message);
      }

      const mergedProfile: UserProfile = {
        id: user.id,
        full_name: data?.full_name || fallbackName,
        email: user.email || data?.email || DEFAULT_PROFILE.email,
        phone_number: data?.phone_number || userMeta.phone || DEFAULT_PROFILE.phone_number,
        avatar_url: data?.avatar_url || userMeta.avatar_url || DEFAULT_PROFILE.avatar_url,
        home_address: data?.home_address || '',
        work_address: data?.work_address || '',
      };

      setProfile(mergedProfile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedProfile));
    } catch (err) {
      console.warn('[UserContext] Profile sync error:', err);
    }
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    fetchSupabaseProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        fetchSupabaseProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchSupabaseProfile]);

  // Update profile handler (updates state, local storage & Supabase)
  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error?: string }> => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore storage error
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { error } = await supabase
          .from('users')
          .upsert(
            {
              id: session.user.id,
              full_name: updated.full_name,
              phone_number: updated.phone_number,
              avatar_url: updated.avatar_url,
              home_address: updated.home_address,
              work_address: updated.work_address,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          );

        if (error) {
          console.warn('[UserContext] Supabase upsert error:', error.message);
          return { error: error.message };
        }
      }
      return {};
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile in database';
      return { error: msg };
    }
  };

  const firstName = useMemo(() => {
    const trimmed = (profile.full_name || '').trim();
    if (!trimmed) return 'User';
    return trimmed.split(' ')[0];
  }, [profile.full_name]);

  const timeOfDay = useMemo(() => getTimeOfDay(currentDateObj), [currentDateObj]);

  const greeting = useMemo(() => {
    const langDict = GREETINGS_BY_LANG[language] || GREETINGS_BY_LANG.en;
    const prefix = langDict[timeOfDay];
    return `${prefix}, ${firstName} 👋`;
  }, [language, timeOfDay, firstName]);

  const liveTime = useMemo(() => {
    return currentDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [currentDateObj]);

  const liveDate = useMemo(() => {
    return currentDateObj.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }, [currentDateObj, language]);

  return (
    <UserContext.Provider
      value={{
        profile,
        firstName,
        timeOfDay,
        greeting,
        liveTime,
        liveDate,
        isLoading,
        updateProfile,
        refreshUser: fetchSupabaseProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
};
