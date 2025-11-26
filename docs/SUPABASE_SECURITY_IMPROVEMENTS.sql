/**
 * Run these SQL queries in Supabase to improve security and session tracking
 * 
 * 1. Add session tracking table
 * 2. Add updated_at timestamps to existing tables
 * 3. Ensure RLS policies are strict
 */

-- Sessions table for tracking active user sessions
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_is_active ON sessions(is_active);

-- Enable RLS on sessions
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY sessions_select_own ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY sessions_insert_own ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY sessions_update_own ON sessions
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY sessions_delete_own ON sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at columns to existing tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE chats ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Improve chats table with proper indexes
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chats_starred ON chats(starred) WHERE starred = TRUE;

-- Create audit log table (optional - for tracking data changes)
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own audit logs
CREATE POLICY audit_logs_select_own ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Refresh RLS policies for chats to be more strict
DROP POLICY IF EXISTS chats_select_own ON chats;
DROP POLICY IF EXISTS chats_insert_own ON chats;
DROP POLICY IF EXISTS chats_update_own ON chats;
DROP POLICY IF EXISTS chats_delete_own ON chats;

CREATE POLICY chats_select_own ON chats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY chats_insert_own ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id AND user_id = auth.uid());

CREATE POLICY chats_update_own ON chats
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id AND user_id = auth.uid());

CREATE POLICY chats_delete_own ON chats
  FOR DELETE USING (auth.uid() = user_id);

-- Verify RLS is enabled
SELECT tablename, 
  (SELECT array_agg(policyname) FROM pg_policies WHERE schemaname = 'public' AND tablename = t.tablename) as policies
FROM pg_tables t
WHERE schemaname = 'public' AND tablename IN ('profiles', 'chats', 'sessions', 'audit_logs');
