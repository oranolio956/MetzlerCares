-- Powerhouse Platform v2.0 Multi-Tenant Architecture
-- Row Level Security (RLS) implementation for HIPAA compliance

-- Create tenants table for multi-tenancy
CREATE TABLE public.tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('rehab', 'partner', 'organization')),
  contact_email TEXT,
  contact_phone TEXT,
  address JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tenant_users junction table
CREATE TABLE public.tenant_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'staff', 'pss', 'read_only')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Create clients table with tenant isolation
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  case_manager_id UUID REFERENCES auth.users(id),
  discharge_date DATE,
  status TEXT CHECK (status IN ('active', 'discharged', 'transferred')),
  consent_status TEXT CHECK (consent_status IN ('pending', 'signed', 'expired', 'revoked')),
  consent_signed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kanban_boards for PSS workflow
CREATE TABLE public.kanban_boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kanban_columns
CREATE TABLE public.kanban_columns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES public.kanban_boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  color TEXT DEFAULT '#e0e0e0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create kanban_cards (tasks)
CREATE TABLE public.kanban_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  column_id UUID NOT NULL REFERENCES public.kanban_columns(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('id', 'snap', 'housing', 'workforce', 'fresh_start', 'other')),
  position INTEGER NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  time_logged INTEGER DEFAULT 0, -- minutes
  due_date DATE,
  status TEXT CHECK (status IN ('todo', 'in_progress', 'submitted', 'complete')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_tracking table
CREATE TABLE public.time_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  card_id UUID REFERENCES public.kanban_cards(id),
  minutes INTEGER NOT NULL,
  notes TEXT,
  billable BOOLEAN DEFAULT true,
  service_code TEXT DEFAULT 'H0038',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create impact_metrics for donor dashboard
CREATE TABLE public.impact_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  metric_type TEXT CHECK (metric_type IN ('clients_stabilized', 'sober_living_funded', 'snap_benefits_secured', 'ids_obtained', 'workforce_registrations')),
  value INTEGER NOT NULL DEFAULT 0,
  period_date DATE DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, metric_type, period_date)
);

-- Create audit_logs for compliance
CREATE TABLE public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create functions for RLS policies
CREATE OR REPLACE FUNCTION get_current_user_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION check_user_tenant_access(target_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tenant_users 
    WHERE user_id = auth.uid() AND tenant_id = target_tenant_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Tenants isolation
CREATE POLICY "Users can only see their own tenant data" ON public.tenants
  FOR ALL USING (check_user_tenant_access(id));

CREATE POLICY "Users can only see their tenant users" ON public.tenant_users
  FOR ALL USING (tenant_id = get_current_user_tenant_id());

-- RLS Policies: Client data isolation
CREATE POLICY "Users can only see their tenant clients" ON public.clients
  FOR ALL USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can only see their tenant kanban cards" ON public.kanban_cards
  FOR ALL USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can only see their tenant time tracking" ON public.time_tracking
  FOR ALL USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can only see their tenant impact metrics" ON public.impact_metrics
  FOR ALL USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can only see their tenant audit logs" ON public.audit_logs
  FOR ALL USING (tenant_id = get_current_user_tenant_id());

-- Grant permissions
GRANT ALL ON public.tenants TO anon, authenticated;
GRANT ALL ON public.tenant_users TO anon, authenticated;
GRANT ALL ON public.clients TO anon, authenticated;
GRANT ALL ON public.kanban_boards TO anon, authenticated;
GRANT ALL ON public.kanban_columns TO anon, authenticated;
GRANT ALL ON public.kanban_cards TO anon, authenticated;
GRANT ALL ON public.time_tracking TO anon, authenticated;
GRANT ALL ON public.impact_metrics TO anon, authenticated;
GRANT ALL ON public.audit_logs TO anon, authenticated;

-- Create indexes for performance
CREATE INDEX idx_clients_tenant_id ON public.clients(tenant_id);
CREATE INDEX idx_clients_status ON public.clients(status);
CREATE INDEX idx_kanban_cards_tenant_id ON public.kanban_cards(tenant_id);
CREATE INDEX idx_kanban_cards_client_id ON public.kanban_cards(client_id);
CREATE INDEX idx_time_tracking_tenant_id ON public.time_tracking(tenant_id);
CREATE INDEX idx_time_tracking_user_id ON public.time_tracking(user_id);
CREATE INDEX idx_audit_logs_tenant_id ON public.audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);