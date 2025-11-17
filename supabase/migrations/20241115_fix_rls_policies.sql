-- Fix RLS policies to include WITH CHECK for write operations
-- This ensures data integrity for INSERT and UPDATE operations

-- Drop existing policies and recreate with proper WITH CHECK
DROP POLICY IF EXISTS "Users can only see their own tenant data" ON public.tenants;
DROP POLICY IF EXISTS "Users can only see their tenant users" ON public.tenant_users;
DROP POLICY IF EXISTS "Users can only see their tenant clients" ON public.clients;
DROP POLICY IF EXISTS "Users can only see their tenant kanban cards" ON public.kanban_cards;
DROP POLICY IF EXISTS "Users can only see their tenant time tracking" ON public.time_tracking;
DROP POLICY IF EXISTS "Users can only see their tenant impact metrics" ON public.impact_metrics;
DROP POLICY IF EXISTS "Users can only see their tenant audit logs" ON public.audit_logs;

-- Recreate policies with both USING and WITH CHECK for complete RLS coverage
CREATE POLICY "Users can only see their own tenant data" ON public.tenants
  FOR ALL USING (check_user_tenant_access(id))
  WITH CHECK (check_user_tenant_access(id));

CREATE POLICY "Users can only see their tenant users" ON public.tenant_users
  FOR ALL USING (tenant_id = get_current_user_tenant_id())
  WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can only see their tenant clients" ON public.clients
  FOR ALL USING (tenant_id = get_current_user_tenant_id())
  WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can only see their tenant kanban cards" ON public.kanban_cards
  FOR ALL USING (tenant_id = get_current_user_tenant_id())
  WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can only see their tenant time tracking" ON public.time_tracking
  FOR ALL USING (tenant_id = get_current_user_tenant_id())
  WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can only see their tenant impact metrics" ON public.impact_metrics
  FOR ALL USING (tenant_id = get_current_user_tenant_id())
  WITH CHECK (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can only see their tenant audit logs" ON public.audit_logs
  FOR ALL USING (tenant_id = get_current_user_tenant_id())
  WITH CHECK (tenant_id = get_current_user_tenant_id());

-- Fix overly permissive grants - restrict to authenticated users only
REVOKE ALL ON public.tenants FROM anon;
REVOKE ALL ON public.tenant_users FROM anon;
REVOKE ALL ON public.clients FROM anon;
REVOKE ALL ON public.kanban_boards FROM anon;
REVOKE ALL ON public.kanban_columns FROM anon;
REVOKE ALL ON public.kanban_cards FROM anon;
REVOKE ALL ON public.time_tracking FROM anon;
REVOKE ALL ON public.impact_metrics FROM anon;
REVOKE ALL ON public.audit_logs FROM anon;

-- Grant appropriate permissions to authenticated users only
GRANT SELECT ON public.tenants TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.tenant_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kanban_boards TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kanban_columns TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kanban_cards TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.time_tracking TO authenticated;
GRANT SELECT, INSERT ON public.impact_metrics TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;