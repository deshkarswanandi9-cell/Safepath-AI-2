/**
 * SafeRoute AI — Supabase React Hooks
 *
 * Each hook follows the same pattern:
 *   { data, loading, error, refetch }
 *
 * They fall back to the existing mock data when Supabase is not yet configured,
 * so the app works out-of-the-box without credentials.
 */

import { useState, useEffect, useCallback } from 'react';
import { db } from '../lib/supabase';
import type {
  SafeHavenRow,
  SosAlertRow,
  MonitoredJourneyRow,
  TrustedContactRow,
  IncidentReportRow,
} from '../lib/database.types';

// ---------------------------------------------------------------------------
// Generic helper
// ---------------------------------------------------------------------------
type UseQueryResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

const isSupabaseConfigured = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  return Boolean(url && url !== 'https://your-project-ref.supabase.co');
};

// ---------------------------------------------------------------------------
// 1. Safe Havens — read all verified havens (used by NearestSafePlaceScreen)
// ---------------------------------------------------------------------------
export function useSafeHavens(): UseQueryResult<SafeHavenRow[]> {
  const [data, setData] = useState<SafeHavenRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return; // will fall back to mock data in the screen component
    }
    setLoading(true);
    setError(null);
    const { data: rows, error: err } = await db
      .safeHavens()
      .select('*')
      .eq('is_verified', true)
      .order('safety_score', { ascending: false });

    if (err) setError(err.message);
    else setData(rows);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// 2. SOS Alerts — submit a new SOS alert
// ---------------------------------------------------------------------------
export function useSosAlert() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitAlert = useCallback(async (
    payload: Omit<SosAlertRow, 'id' | 'created_at' | 'status'>
  ) => {
    if (!isSupabaseConfigured()) {
      console.info('[SafeRoute AI] SOS alert (mock):', payload);
      setSuccess(true);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: err } = await db.sosAlerts().insert({
      ...payload,
      status: 'active',
    });

    if (err) setError(err.message);
    else setSuccess(true);
    setLoading(false);
  }, []);

  return { loading, error, success, submitAlert };
}

// ---------------------------------------------------------------------------
// 3. Monitored Journeys — start / update / complete a police-monitored journey
// ---------------------------------------------------------------------------
export function useMonitoredJourney() {
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startJourney = useCallback(async (
    payload: Omit<MonitoredJourneyRow, 'id' | 'created_at' | 'status' | 'route_deviation_detected'>
  ) => {
    if (!isSupabaseConfigured()) {
      const mockId = `mock-journey-${Date.now()}`;
      setJourneyId(mockId);
      console.info('[SafeRoute AI] Journey started (mock):', mockId);
      return mockId;
    }
    setLoading(true);
    setError(null);

    const { data, error: err } = await db.monitoredJourneys().insert({
      ...payload,
      status: 'active',
      route_deviation_detected: false,
    }).select('id').single();

    if (err) { setError(err.message); setLoading(false); return null; }
    const id = data?.id ?? null;
    setJourneyId(id);
    setLoading(false);
    return id;
  }, []);

  const updateLocation = useCallback(async (
    id: string,
    lat: number,
    lng: number
  ) => {
    if (!isSupabaseConfigured()) return;
    await db.monitoredJourneys().update({
      last_latitude: lat,
      last_longitude: lng,
    }).eq('id', id);
  }, []);

  const completeJourney = useCallback(async (id: string) => {
    if (!isSupabaseConfigured()) return;
    await db.monitoredJourneys().update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    }).eq('id', id);
  }, []);

  return { journeyId, loading, error, startJourney, updateLocation, completeJourney };
}

// ---------------------------------------------------------------------------
// 4. Trusted Contacts — list contacts for the current user
// ---------------------------------------------------------------------------
export function useTrustedContacts(userId?: string): UseQueryResult<TrustedContactRow[]> {
  const [data, setData] = useState<TrustedContactRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!isSupabaseConfigured() || !userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const { data: rows, error: err } = await db
      .trustedContacts()
      .select('*')
      .eq('user_id', userId)
      .order('created_at');

    if (err) setError(err.message);
    else setData(rows);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ---------------------------------------------------------------------------
// 5. Incident Reports — submit a new infrastructure / hazard report
// ---------------------------------------------------------------------------
export function useIncidentReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitReport = useCallback(async (
    payload: Omit<IncidentReportRow, 'id' | 'created_at' | 'updated_at' | 'is_verified' | 'upvote_count' | 'resolved'>
  ) => {
    if (!isSupabaseConfigured()) {
      console.info('[SafeRoute AI] Incident report (mock):', payload);
      setSuccess(true);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: err } = await db.incidentReports().insert({
      ...payload,
      is_verified: false,
      upvote_count: 0,
      resolved: false,
    });

    if (err) setError(err.message);
    else setSuccess(true);
    setLoading(false);
  }, []);

  return { loading, error, success, submitReport };
}

// ---------------------------------------------------------------------------
// 6. Safety Check-ins — log a check-in response
// ---------------------------------------------------------------------------
export function useSafetyCheckin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logCheckin = useCallback(async (
    userId: string,
    status: 'safe' | 'needs_help' | 'missed',
    journeyId?: string,
    lat?: number,
    lng?: number
  ) => {
    if (!isSupabaseConfigured()) {
      console.info('[SafeRoute AI] Check-in logged (mock):', { userId, status });
      return;
    }
    setLoading(true);
    setError(null);

    const { error: err } = await db.safetyCheckins().insert({
      user_id: userId,
      journey_id: journeyId ?? null,
      latitude: lat ?? null,
      longitude: lng ?? null,
      status,
      response_time_seconds: null,
    });

    if (err) setError(err.message);
    setLoading(false);
  }, []);

  return { loading, error, logCheckin };
}
