-- ============================================================================
-- SafeRoute AI — Confirm Test User + Fix RLS (run after disabling email confirmation)
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================================

-- 1. Manually confirm the test user so they can sign in immediately
UPDATE auth.users
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'shivani.safety@gmail.com'
  AND email_confirmed_at IS NULL;

-- 2. Fix users table RLS (split into explicit INSERT + SELECT + UPDATE policies)
DROP POLICY IF EXISTS "users: own row" ON public.users;

CREATE POLICY "users: select own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users: insert own" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "users: update own" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "users: delete own" ON public.users
  FOR DELETE USING (auth.uid() = id);

-- 3. Verify the user exists in auth.users
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
