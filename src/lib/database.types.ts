// ============================================================================
// SafeRoute AI — Supabase Database Types
// Auto-generated mirror of the SQL schema below.
// ============================================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------------------------------------------------------------------------
// Enumerations (mirror of Postgres ENUM types)
// ---------------------------------------------------------------------------
export type HavenType =
  | 'police_station'
  | 'hospital'
  | 'pharmacy_24h'
  | 'petrol_station'
  | 'verified_safe_haven'
  | 'metro_station';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus   = 'active' | 'acknowledged' | 'resolved' | 'false_alarm';
export type JourneyStatus = 'active' | 'completed' | 'escalated' | 'cancelled';
export type CheckinStatus = 'safe' | 'needs_help' | 'missed' | 'pending';
export type IncidentCategory =
  | 'streetlight_outage'
  | 'road_damage'
  | 'suspicious_activity'
  | 'harassment'
  | 'natural_hazard'
  | 'other';

// ---------------------------------------------------------------------------
// Table Row Types
// ---------------------------------------------------------------------------

export interface UserRow {
  id: string;                     // UUID (matches auth.users.id)
  full_name: string | null;
  phone_number: string | null;
  avatar_url: string | null;
  home_address: string | null;
  work_address: string | null;
  emergency_pin: string | null;   // Hashed 4-digit PIN
  language_preference: string;    // e.g. 'en', 'hi', 'mr'
  theme_preference: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
}

export interface SafeHavenRow {
  id: string;                     // UUID
  name: string;
  type: HavenType;
  latitude: number;
  longitude: number;
  address: string;
  phone_number: string | null;
  is_24h: boolean;
  is_verified: boolean;
  is_staffed: boolean;
  current_lighting_lux: number;   // 0-200
  safety_score: number;           // 0-100 composite
  walking_minutes: number | null; // From user's current position (runtime calc)
  distance_meters: number | null;
  accepts_women_only: boolean;
  has_cctv: boolean;
  has_emergency_button: boolean;
  operating_hours: string | null; // e.g. "09:00–22:00"
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SosAlertRow {
  id: string;
  user_id: string;                // FK → users.id
  latitude: number;
  longitude: number;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string | null;         // Optional user message
  vehicle_number: string | null;  // Cab/ride vehicle
  driver_name: string | null;
  dispatch_id: string | null;     // Police dispatch reference
  acknowledged_by: string | null; // Officer/dispatcher name
  acknowledged_at: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface MonitoredJourneyRow {
  id: string;
  user_id: string;                // FK → users.id
  origin: string;
  destination: string;
  concern_message: string;        // User's initial concern
  status: JourneyStatus;
  route_deviation_detected: boolean;
  last_latitude: number | null;
  last_longitude: number | null;
  check_in_interval_minutes: number;
  next_checkin_at: string | null;
  operator_notes: string | null;
  vehicle_number: string | null;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface TrustedContactRow {
  id: string;
  user_id: string;                // FK → users.id
  name: string;
  relation: string;               // e.g. 'Mother', 'Friend'
  phone_number: string;
  notify_on_sos: boolean;
  notify_on_checkin_miss: boolean;
  avatar_initials: string | null;
  created_at: string;
}

export interface SafetyCheckinRow {
  id: string;
  user_id: string;                // FK → users.id
  journey_id: string | null;      // FK → monitored_journeys.id
  latitude: number | null;
  longitude: number | null;
  status: CheckinStatus;
  response_time_seconds: number | null;
  created_at: string;
}

export interface IncidentReportRow {
  id: string;
  user_id: string | null;         // Nullable for anonymous reports
  latitude: number;
  longitude: number;
  category: IncidentCategory;
  description: string;
  photo_url: string | null;
  is_verified: boolean;
  upvote_count: number;
  resolved: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Database Schema Map (used by createClient<Database>)
// ---------------------------------------------------------------------------
export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Partial<UserRow> & { id: string };
        Update: Partial<UserRow>;
      };
      safe_havens: {
        Row: SafeHavenRow;
        Insert: Omit<SafeHavenRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<SafeHavenRow>;
      };
      sos_alerts: {
        Row: SosAlertRow;
        Insert: Omit<SosAlertRow, 'id' | 'created_at'>;
        Update: Partial<SosAlertRow>;
      };
      monitored_journeys: {
        Row: MonitoredJourneyRow;
        Insert: Omit<MonitoredJourneyRow, 'id' | 'created_at'>;
        Update: Partial<MonitoredJourneyRow>;
      };
      trusted_contacts: {
        Row: TrustedContactRow;
        Insert: Omit<TrustedContactRow, 'id' | 'created_at'>;
        Update: Partial<TrustedContactRow>;
      };
      safety_checkins: {
        Row: SafetyCheckinRow;
        Insert: Omit<SafetyCheckinRow, 'id' | 'created_at'>;
        Update: Partial<SafetyCheckinRow>;
      };
      incident_reports: {
        Row: IncidentReportRow;
        Insert: Omit<IncidentReportRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<IncidentReportRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      haven_type: HavenType;
      alert_severity: AlertSeverity;
      alert_status: AlertStatus;
      journey_status: JourneyStatus;
      checkin_status: CheckinStatus;
      incident_category: IncidentCategory;
    };
  };
}
