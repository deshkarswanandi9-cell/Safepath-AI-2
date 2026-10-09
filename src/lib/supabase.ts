import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// ---------------------------------------------------------------------------
// Environment-variable guards
// ---------------------------------------------------------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || supabaseUrl === 'https://your-project-ref.supabase.co') {
  console.warn(
    '[SafeRoute AI] Supabase URL not configured. ' +
    'Add VITE_SUPABASE_URL to .env.local and restart the dev server.'
  );
}
if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key-here') {
  console.warn(
    '[SafeRoute AI] Supabase Anon Key not configured. ' +
    'Add VITE_SUPABASE_ANON_KEY to .env.local and restart the dev server.'
  );
}

// ---------------------------------------------------------------------------
// Singleton Supabase client (typed via generated Database types)
// ---------------------------------------------------------------------------
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ---------------------------------------------------------------------------
// Convenience table accessors  (re-exported so consumers don't repeat types)
// ---------------------------------------------------------------------------
export const db = {
  users:           () => supabase.from('users'),
  safeHavens:      () => supabase.from('safe_havens'),
  sosAlerts:       () => supabase.from('sos_alerts'),
  monitoredJourneys: () => supabase.from('monitored_journeys'),
  incidentReports: () => supabase.from('incident_reports'),
  trustedContacts: () => supabase.from('trusted_contacts'),
  safetyCheckins:  () => supabase.from('safety_checkins'),
};

export default supabase;
