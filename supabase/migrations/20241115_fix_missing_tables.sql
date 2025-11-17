-- Fix missing tables and schema mismatches identified during final testing

-- Create consent_records table for 42 CFR Part 2 compliance
CREATE TABLE IF NOT EXISTS consent_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    partner_id UUID NOT NULL REFERENCES tenant_users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL DEFAULT 'TPO', -- Treatment, Payment, Operations
    consent_data JSONB DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, signed, expired, revoked
    expires_at TIMESTAMP WITH TIME ZONE,
    signed_at TIMESTAMP WITH TIME ZONE,
    signature_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security_logs table for security event logging
CREATE TABLE IF NOT EXISTS security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    level VARCHAR(20) NOT NULL, -- info, warn, error, critical
    category VARCHAR(50) NOT NULL, -- auth, access, data, system
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE
);

-- Add RLS policies for consent_records
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can only see their own consent records" ON consent_records
FOR ALL USING (
    (SELECT get_current_user_tenant_id()) = tenant_id
) WITH CHECK (
    (SELECT get_current_user_tenant_id()) = tenant_id
);

-- Add RLS policies for security_logs (staff only)
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view security logs for their tenant" ON security_logs
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM tenant_users 
        WHERE tenant_users.user_id = auth.uid() 
        AND tenant_users.tenant_id = security_logs.tenant_id
        AND tenant_users.role IN ('admin', 'staff')
    )
);

-- Grant appropriate permissions
GRANT SELECT ON consent_records TO authenticated;
GRANT INSERT ON consent_records TO authenticated;
GRANT UPDATE ON consent_records TO authenticated;
GRANT DELETE ON consent_records TO authenticated;

GRANT SELECT ON security_logs TO authenticated;
GRANT INSERT ON security_logs TO authenticated;

-- Fix audit_logs schema alignment
-- The audit_logs table already exists with correct schema from the main migration
-- We just need to ensure the API calls use the correct field names

-- Update RLS policies to include WITH CHECK for write operations
-- These are already mostly correct but let's ensure completeness

-- Add updated_at trigger for consent_records
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_consent_records_updated_at 
    BEFORE UPDATE ON consent_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();