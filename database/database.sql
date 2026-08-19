-- Database Schema Setup for Kenmarie Technologies App
-- Run this in Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. ROLES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed the roles table with default roles
INSERT INTO public.roles (name, description) VALUES
  ('user', 'Standard user with basic project access'),
  ('admin', 'Administrator with project management capabilities'),
  ('super_admin', 'Super administrator with full system access')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 2. USERS TABLE (WITH ROLE REFERENCE)
-- ============================================================

-- First, add role_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'role_id'
  ) THEN
    ALTER TABLE public.users ADD COLUMN role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL;
    
    -- Set default role for existing users
    UPDATE public.users SET role_id = (SELECT id FROM public.roles WHERE name = 'user' LIMIT 1) WHERE role_id IS NULL;
  END IF;
  
  -- Drop old role column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    -- Migrate existing role data to role_id
    UPDATE public.users SET role_id = (
      CASE 
        WHEN role = 'admin' THEN (SELECT id FROM public.roles WHERE name = 'admin' LIMIT 1)
        WHEN role = 'super_admin' THEN (SELECT id FROM public.roles WHERE name = 'super_admin' LIMIT 1)
        ELSE (SELECT id FROM public.roles WHERE name = 'user' LIMIT 1)
      END
    ) WHERE role_id IS NULL;
    
    ALTER TABLE public.users DROP COLUMN role;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  github_username TEXT,
  avatar_url TEXT,
  role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_github_username ON public.users(github_username);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON public.users(role_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid duplicate errors)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;
DROP POLICY IF EXISTS "Super admins can delete users" ON public.users;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Service role can insert users" 
ON public.users FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Admins can view all users
CREATE POLICY "Admins can view all users" 
ON public.users FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Admins can update any user
CREATE POLICY "Admins can update any user" 
ON public.users FOR UPDATE 
USING (public.is_admin(auth.uid()));

-- Super admins can delete users
CREATE POLICY "Super admins can delete users" 
ON public.users FOR DELETE 
USING (public.is_super_admin(auth.uid()));

-- ============================================================
-- 2. PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_name TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('nodejs', 'python', 'html')),
  repository_url TEXT NOT NULL,
  repository_name TEXT NOT NULL,
  repository_branch TEXT DEFAULT 'main',
  deployment_status TEXT DEFAULT 'pending' 
    CHECK (deployment_status IN ('pending', 'building', 'deploying', 'deployed', 'failed', 'stopped')),
  deployment_url TEXT,
  azure_resource_group TEXT,
  azure_app_service TEXT,
  azure_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deployed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for projects table
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_deployment_status ON public.projects(deployment_status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_user_status ON public.projects(user_id, deployment_status);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update any project" ON public.projects;

-- RLS Policies for projects table
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Admins can view all projects
CREATE POLICY "Admins can view all projects" ON public.projects
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Admins can update any project
CREATE POLICY "Admins can update any project" ON public.projects
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- ============================================================
-- 3. ENVIRONMENT VARIABLES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.environment_variables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL, -- Encrypted in production
  is_secret BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(project_id, key)
);

-- Indexes for environment_variables table
CREATE INDEX IF NOT EXISTS idx_env_vars_project_id ON public.environment_variables(project_id);
CREATE INDEX IF NOT EXISTS idx_env_vars_key ON public.environment_variables(key);

-- Enable RLS
ALTER TABLE public.environment_variables ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own env vars" ON public.environment_variables;
DROP POLICY IF EXISTS "Users can insert own env vars" ON public.environment_variables;
DROP POLICY IF EXISTS "Users can update own env vars" ON public.environment_variables;
DROP POLICY IF EXISTS "Users can delete own env vars" ON public.environment_variables;

-- RLS Policies for environment_variables table
CREATE POLICY "Users can view own env vars" ON public.environment_variables
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = environment_variables.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own env vars" ON public.environment_variables
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = environment_variables.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can update own env vars" ON public.environment_variables
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = environment_variables.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own env vars" ON public.environment_variables
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = environment_variables.project_id AND projects.user_id = auth.uid())
  );

-- ============================================================
-- 4. DEPLOYMENTS TABLE (History & Tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  deployment_status TEXT NOT NULL 
    CHECK (deployment_status IN ('pending', 'building', 'deploying', 'deployed', 'failed', 'cancelled')),
  commit_hash TEXT,
  commit_message TEXT,
  commit_author TEXT,
  deployment_trigger TEXT DEFAULT 'manual' 
    CHECK (deployment_trigger IN ('manual', 'auto', 'webhook')),
  azure_deployment_id TEXT,
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  error_message TEXT,
  logs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for deployments table
CREATE INDEX IF NOT EXISTS idx_deployments_project_id ON public.deployments(project_id);
CREATE INDEX IF NOT EXISTS idx_deployments_status ON public.deployments(deployment_status);
CREATE INDEX IF NOT EXISTS idx_deployments_deployed_at ON public.deployments(deployed_at);
CREATE INDEX IF NOT EXISTS idx_deployments_project_status ON public.deployments(project_id, deployment_status);
CREATE INDEX IF NOT EXISTS idx_deployments_azure_id ON public.deployments(azure_deployment_id);

-- Enable RLS
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can insert own deployments" ON public.deployments;
DROP POLICY IF EXISTS "Users can update own deployments" ON public.deployments;

-- RLS Policies for deployments table
CREATE POLICY "Users can view own deployments" ON public.deployments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = deployments.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own deployments" ON public.deployments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = deployments.project_id AND projects.user_id = auth.uid())
  );

CREATE POLICY "Users can update own deployments" ON public.deployments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.projects WHERE projects.id = deployments.project_id AND projects.user_id = auth.uid())
  );

-- ============================================================
-- 5. REALTIME CONFIGURATION
-- ============================================================

-- Enable Replica Identity for Realtime
ALTER TABLE public.deployments REPLICA IDENTITY FULL;
ALTER TABLE public.projects REPLICA IDENTITY FULL;
ALTER TABLE public.environment_variables REPLICA IDENTITY FULL;
ALTER TABLE public.users REPLICA IDENTITY FULL;

-- Add tables to the publication
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime 
    FOR TABLE 
      public.deployments,
      public.projects,
      public.environment_variables,
      public.users,
      public.roles;
COMMIT;

-- Realtime RLS Policies
-- Users can see their own deployment updates
DROP POLICY IF EXISTS "Users can see own deployment updates" ON public.deployments;
CREATE POLICY "Users can see own deployment updates"
ON public.deployments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = deployments.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Admins can see all deployment updates
DROP POLICY IF EXISTS "Admins can see all deployment updates" ON public.deployments;
CREATE POLICY "Admins can see all deployment updates"
ON public.deployments
FOR ALL
USING (public.is_admin(auth.uid()));

-- Users can see their own project updates
DROP POLICY IF EXISTS "Users can see own project updates" ON public.projects;
CREATE POLICY "Users can see own project updates"
ON public.projects
FOR ALL
USING (auth.uid() = user_id);

-- Admins can see all project updates
DROP POLICY IF EXISTS "Admins can see all project updates" ON public.projects;
CREATE POLICY "Admins can see all project updates"
ON public.projects
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Users can see env var updates for their own projects
DROP POLICY IF EXISTS "Users can see own env var updates" ON public.environment_variables;
CREATE POLICY "Users can see own env var updates"
ON public.environment_variables
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = environment_variables.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- ============================================================
-- 6. TRIGGERS & FUNCTIONS
-- ============================================================

-- Function to handle new user signup with role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, role_id)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    (SELECT id FROM public.roles WHERE name = 'user' LIMIT 1) -- Default role for new users
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on all tables
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_env_vars_updated_at ON public.environment_variables;
CREATE TRIGGER update_env_vars_updated_at BEFORE UPDATE ON public.environment_variables
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 7. HELPER FUNCTIONS FOR ROLE MANAGEMENT
-- ============================================================

-- Function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    INNER JOIN public.roles ON users.role_id = roles.id
    WHERE users.id = user_id 
    AND roles.name = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user is an admin (admin or super_admin)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    INNER JOIN public.roles ON users.role_id = roles.id
    WHERE users.id = user_id 
    AND roles.name IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    INNER JOIN public.roles ON users.role_id = roles.id
    WHERE users.id = user_id 
    AND roles.name = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's role name
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role_name TEXT;
BEGIN
  SELECT roles.name INTO user_role_name 
  FROM public.users 
  INNER JOIN public.roles ON users.role_id = roles.id
  WHERE users.id = auth.uid();
  RETURN user_role_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 8. GRANT PERMISSIONS
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.users TO anon, authenticated;
GRANT ALL ON TABLE public.projects TO anon, authenticated;
GRANT ALL ON TABLE public.environment_variables TO anon, authenticated;
GRANT ALL ON TABLE public.deployments TO anon, authenticated;
GRANT SELECT ON TABLE public.roles TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION public.has_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_role() TO authenticated;

-- ============================================================
-- 9. VERIFY TABLES
-- ============================================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ============================================================
-- 10. VERIFY ROLES DATA
-- ============================================================
SELECT name, description, permissions 
FROM public.roles 
ORDER BY name;