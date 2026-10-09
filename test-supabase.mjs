/**
 * SafeRoute AI — Supabase Connection Diagnostic
 * Run with: node test-supabase.mjs
 * 
 * This script tests:
 * 1. Whether .env.local has real credentials
 * 2. Whether Supabase can be reached
 * 3. Whether the database tables exist
 * 4. Whether a test user can sign up and have their profile saved
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// ─── Load .env.local manually ────────────────────────────────────────────────
let url = '';
let key = '';
try {
  const envFile = readFileSync('.env.local', 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      url = trimmed.replace('VITE_SUPABASE_URL=', '').trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      key = trimmed.replace('VITE_SUPABASE_ANON_KEY=', '').trim();
    }
  }
} catch {
  console.error('❌  Could not read .env.local — make sure you run this from the project root.');
  process.exit(1);
}

// ─── Check 1: Are credentials real? ──────────────────────────────────────────
console.log('\n══════════════════════════════════════════');
console.log('   SafeRoute AI — Supabase Diagnostics   ');
console.log('══════════════════════════════════════════\n');

const urlOk = url && url !== 'https://your-project-ref.supabase.co';
const keyOk = key && key !== 'your-anon-key-here';

console.log('CHECK 1 — Credentials in .env.local');
console.log(`  VITE_SUPABASE_URL  : ${urlOk ? '✅ ' + url : '❌ STILL PLACEHOLDER — needs your real project URL'}`);
console.log(`  VITE_SUPABASE_ANON_KEY: ${keyOk ? '✅ set (' + key.slice(0, 20) + '...)' : '❌ STILL PLACEHOLDER — needs your real anon key'}`);

if (!urlOk || !keyOk) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('ACTION NEEDED: Open .env.local and replace the placeholder values:');
  console.log('');
  console.log('  VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co');
  console.log('  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  console.log('');
  console.log('Get these from:');
  console.log('  https://supabase.com/dashboard → your project → Settings → API');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1);
}

// ─── Check 2: Can we reach Supabase? ─────────────────────────────────────────
const supabase = createClient(url, key);

console.log('\nCHECK 2 — Supabase connection...');
try {
  const { error } = await supabase.from('safe_havens').select('id').limit(1);
  if (error) {
    if (error.code === '42P01') {
      console.log('  ⚠️  Connected but table "safe_havens" does not exist yet.');
      console.log('     → Run the SQL migration: supabase/migrations/001_saferoute_schema.sql');
    } else {
      console.log(`  ❌ Error: ${error.message} (code: ${error.code})`);
    }
  } else {
    console.log('  ✅ Connected to Supabase successfully!');
  }
} catch (e) {
  console.log(`  ❌ Network error: ${e.message}`);
  process.exit(1);
}

// ─── Check 3: Do tables exist? ───────────────────────────────────────────────
console.log('\nCHECK 3 — Tables exist in database...');
const tables = ['users', 'safe_havens', 'sos_alerts', 'monitored_journeys', 'trusted_contacts', 'safety_checkins', 'incident_reports'];

for (const table of tables) {
  const { error } = await supabase.from(table).select('count').limit(0);
  if (error && error.code === '42P01') {
    console.log(`  ❌ Table "${table}" — NOT FOUND (run the SQL migration)`);
  } else if (error) {
    console.log(`  ⚠️  Table "${table}" — ${error.message}`);
  } else {
    console.log(`  ✅ Table "${table}" — exists`);
  }
}

// ─── Check 4: Safe havens seed data ──────────────────────────────────────────
console.log('\nCHECK 4 — Seed data in safe_havens...');
const { data: havens, error: havensErr } = await supabase
  .from('safe_havens')
  .select('name, type')
  .limit(10);

if (havensErr) {
  console.log(`  ❌ ${havensErr.message}`);
} else if (!havens || havens.length === 0) {
  console.log('  ⚠️  Table is empty — seed data not inserted yet.');
  console.log('     Re-run the SQL migration to insert sample safe havens.');
} else {
  console.log(`  ✅ ${havens.length} safe haven(s) found:`);
  for (const h of havens) {
    console.log(`     • ${h.name} (${h.type})`);
  }
}

// ─── Check 5: Auth — try creating a test user ────────────────────────────────
console.log('\nCHECK 5 — Auth: sign up a test user...');
const testEmail = `saferoute-test-${Date.now()}@example.com`;
const testPassword = 'SafeRoute@2025!';

const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
  email: testEmail,
  password: testPassword,
});

if (signUpError) {
  console.log(`  ❌ Sign up failed: ${signUpError.message}`);
} else if (signUpData.user) {
  console.log(`  ✅ Auth works! Test user created: ${testEmail}`);
  console.log(`     User ID: ${signUpData.user.id}`);

  // Try upserting profile row
  const { error: profileError } = await supabase.from('users').upsert({
    id: signUpData.user.id,
    full_name: 'Test User (Diagnostic)',
    language_preference: 'en',
    theme_preference: 'system',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });

  if (profileError) {
    console.log(`  ❌ Profile row insert failed: ${profileError.message}`);
    if (profileError.code === '42501') {
      console.log('     → RLS policy is blocking insert. Check that the "users: own row" policy exists in Supabase.');
    }
  } else {
    console.log('  ✅ Profile row saved to public.users table!');
    console.log('  ✅ DATA IS FLOWING — login will save to database correctly.');
  }
} else {
  console.log('  ⚠️  User created but email confirmation required.');
  console.log('     → Go to Supabase Dashboard → Authentication → Settings');
  console.log('       and disable "Confirm email" to allow instant login.');
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log('\n══════════════════════════════════════════');
console.log('  Diagnostic complete — check results above');
console.log('══════════════════════════════════════════\n');
