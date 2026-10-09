-- ============================================================================
-- SafeRoute AI — Supabase Database Schema Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- for geo queries (optional but recommended)

-- ============================================================================
-- ENUMERATIONS
-- ============================================================================
DO $$ BEGIN
  CREATE TYPE haven_type AS ENUM (
    'police_station', 'hospital', 'pharmacy_24h',
    'petrol_station', 'verified_safe_haven', 'metro_station'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE alert_status AS ENUM ('active', 'acknowledged', 'resolved', 'false_alarm');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE journey_status AS ENUM ('active', 'completed', 'escalated', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE checkin_status AS ENUM ('safe', 'needs_help', 'missed', 'pending');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE incident_category AS ENUM (
    'streetlight_outage', 'road_damage', 'suspicious_activity',
    'harassment', 'natural_hazard', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================================
-- TABLE: users  (extends Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name            TEXT,
  phone_number         TEXT UNIQUE,
  avatar_url           TEXT,
  home_address         TEXT,
  work_address         TEXT,
  emergency_pin        TEXT,  -- store hashed value, never plain text
  language_preference  TEXT NOT NULL DEFAULT 'en',
  theme_preference     TEXT NOT NULL DEFAULT 'system'
                         CHECK (theme_preference IN ('light', 'dark', 'system')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can only read/insert/update/delete their own row
DROP POLICY IF EXISTS "users: own row" ON public.users;
DROP POLICY IF EXISTS "users: select own" ON public.users;
DROP POLICY IF EXISTS "users: insert own" ON public.users;
DROP POLICY IF EXISTS "users: update own" ON public.users;
DROP POLICY IF EXISTS "users: delete own" ON public.users;

CREATE POLICY "users: select own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users: insert own" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users: update own" ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "users: delete own" ON public.users FOR DELETE USING (auth.uid() = id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ============================================================================
-- TABLE: safe_havens
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.safe_havens (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                    TEXT NOT NULL,
  type                    haven_type NOT NULL,
  latitude                DOUBLE PRECISION NOT NULL,
  longitude               DOUBLE PRECISION NOT NULL,
  address                 TEXT NOT NULL,
  phone_number            TEXT,
  is_24h                  BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified             BOOLEAN NOT NULL DEFAULT FALSE,
  is_staffed              BOOLEAN NOT NULL DEFAULT TRUE,
  current_lighting_lux    SMALLINT NOT NULL DEFAULT 80 CHECK (current_lighting_lux BETWEEN 0 AND 200),
  safety_score            SMALLINT NOT NULL DEFAULT 70 CHECK (safety_score BETWEEN 0 AND 100),
  walking_minutes         SMALLINT,        -- NULL = not yet calculated
  distance_meters         INTEGER,
  accepts_women_only      BOOLEAN NOT NULL DEFAULT FALSE,
  has_cctv                BOOLEAN NOT NULL DEFAULT FALSE,
  has_emergency_button    BOOLEAN NOT NULL DEFAULT FALSE,
  operating_hours         TEXT,
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.safe_havens ENABLE ROW LEVEL SECURITY;

-- Public read access for safe havens (everyone can see them)
CREATE POLICY "safe_havens: public read" ON public.safe_havens
  FOR SELECT USING (TRUE);

-- Only service role (admin) can write
CREATE POLICY "safe_havens: service write" ON public.safe_havens
  FOR ALL USING (auth.role() = 'service_role');

CREATE TRIGGER safe_havens_updated_at BEFORE UPDATE ON public.safe_havens
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ============================================================================
-- TABLE: sos_alerts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.sos_alerts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  latitude          DOUBLE PRECISION NOT NULL,
  longitude         DOUBLE PRECISION NOT NULL,
  severity          alert_severity NOT NULL DEFAULT 'high',
  status            alert_status NOT NULL DEFAULT 'active',
  message           TEXT,
  vehicle_number    TEXT,
  driver_name       TEXT,
  dispatch_id       TEXT,
  acknowledged_by   TEXT,
  acknowledged_at   TIMESTAMPTZ,
  resolved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.sos_alerts ENABLE ROW LEVEL SECURITY;

-- Users can insert their own alerts; police dashboard uses service_role to read all
CREATE POLICY "sos_alerts: user insert" ON public.sos_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sos_alerts: user read own" ON public.sos_alerts
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: monitored_journeys
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.monitored_journeys (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                     UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  origin                      TEXT NOT NULL,
  destination                 TEXT NOT NULL,
  concern_message             TEXT NOT NULL,
  status                      journey_status NOT NULL DEFAULT 'active',
  route_deviation_detected    BOOLEAN NOT NULL DEFAULT FALSE,
  last_latitude               DOUBLE PRECISION,
  last_longitude              DOUBLE PRECISION,
  check_in_interval_minutes   SMALLINT NOT NULL DEFAULT 10,
  next_checkin_at             TIMESTAMPTZ,
  operator_notes              TEXT,
  vehicle_number              TEXT,
  started_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at                TIMESTAMPTZ,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.monitored_journeys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "monitored_journeys: user own" ON public.monitored_journeys
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TABLE: trusted_contacts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.trusted_contacts (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name                    TEXT NOT NULL,
  relation                TEXT NOT NULL,
  phone_number            TEXT NOT NULL,
  notify_on_sos           BOOLEAN NOT NULL DEFAULT TRUE,
  notify_on_checkin_miss  BOOLEAN NOT NULL DEFAULT TRUE,
  avatar_initials         TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.trusted_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trusted_contacts: user own" ON public.trusted_contacts
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TABLE: safety_checkins
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.safety_checkins (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  journey_id            UUID REFERENCES public.monitored_journeys(id) ON DELETE SET NULL,
  latitude              DOUBLE PRECISION,
  longitude             DOUBLE PRECISION,
  status                checkin_status NOT NULL DEFAULT 'pending',
  response_time_seconds INTEGER,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.safety_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "safety_checkins: user own" ON public.safety_checkins
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TABLE: incident_reports
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES public.users(id) ON DELETE SET NULL,  -- nullable = anon
  latitude      DOUBLE PRECISION NOT NULL,
  longitude     DOUBLE PRECISION NOT NULL,
  category      incident_category NOT NULL,
  description   TEXT NOT NULL,
  photo_url     TEXT,
  is_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  upvote_count  INTEGER NOT NULL DEFAULT 0,
  resolved      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can report (including anonymous)
CREATE POLICY "incident_reports: public insert" ON public.incident_reports
  FOR INSERT WITH CHECK (TRUE);

-- Public read for verified reports only
CREATE POLICY "incident_reports: public read verified" ON public.incident_reports
  FOR SELECT USING (is_verified = TRUE OR auth.uid() = user_id);

CREATE TRIGGER incident_reports_updated_at BEFORE UPDATE ON public.incident_reports
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ============================================================================
-- SEED: Sample Safe Havens (Delhi area — matches mockData.ts coordinates)
-- ============================================================================
INSERT INTO public.safe_havens
  (name, type, latitude, longitude, address, phone_number, is_24h, is_verified,
   is_staffed, current_lighting_lux, safety_score, accepts_women_only,
   has_cctv, has_emergency_button, operating_hours)
VALUES
  ('Connaught Place Police Station', 'police_station', 28.6315, 77.2167,
   'CP Inner Circle, Connaught Place, New Delhi', '100', TRUE, TRUE,
   TRUE, 150, 98, FALSE, TRUE, TRUE, '24/7'),

  ('Apollo Hospital Emergency', 'hospital', 28.6280, 77.2310,
   'Indraprastha Apollo Hospital, Sarita Vihar, Delhi', '1860-500-1066',
   TRUE, TRUE, TRUE, 180, 96, FALSE, TRUE, TRUE, '24/7'),

  ('Apollo 24/7 Pharmacy', 'pharmacy_24h', 28.6350, 77.2180,
   'Shop 14, Janpath, Connaught Place, New Delhi', '+91-11-23412345',
   TRUE, TRUE, TRUE, 90, 85, FALSE, TRUE, FALSE, '24/7'),

  ('HP Petrol Station – Kasturba', 'petrol_station', 28.6365, 77.2095,
   'Kasturba Gandhi Marg, New Delhi', NULL,
   TRUE, TRUE, TRUE, 120, 80, FALSE, TRUE, FALSE, '24/7'),

  ('Sakhi One Stop Centre', 'verified_safe_haven', 28.6420, 77.2250,
   'AIIMS Trauma Centre Campus, Ansari Nagar, New Delhi', '181',
   TRUE, TRUE, TRUE, 140, 94, TRUE, TRUE, TRUE, '24/7'),

  ('Rajiv Chowk Metro Station', 'metro_station', 28.6330, 77.2195,
   'Rajiv Chowk Metro, Connaught Place, New Delhi', '155370',
   FALSE, TRUE, TRUE, 160, 88, FALSE, TRUE, FALSE, '05:30–23:30')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DONE
-- ============================================================================
COMMENT ON TABLE public.safe_havens IS 'Verified emergency safe locations indexed by SafeRoute AI';
COMMENT ON TABLE public.sos_alerts IS 'SOS distress signals sent by users, routed to police control room';
COMMENT ON TABLE public.monitored_journeys IS 'Proactive police-monitored journeys (Challenge 4)';
COMMENT ON TABLE public.trusted_contacts IS 'Emergency contacts notified on SOS / missed check-in';
COMMENT ON TABLE public.safety_checkins IS 'Periodic user check-in responses during a monitored journey';
COMMENT ON TABLE public.incident_reports IS 'Community-reported infrastructure and safety hazards';
