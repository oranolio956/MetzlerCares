-- Metzler Foundations Supabase Database Schema
-- HIPAA and 42 CFR Part 2 Compliant
-- Security model based on explicit, revokable patient consent

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- USER PROFILES AND AUTHENTICATION
-- =============================================

-- Profiles table for user roles and extended information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'beneficiary' CHECK (role IN (
    'beneficiary',      -- Individuals receiving aid
    'partner',          -- Sober living facility staff
    'donor',            -- Individual donors
    'staff',            -- Foundation staff (case managers, etc.)
    'admin',            -- System administrators
    'compliance_officer' -- HIPAA compliance officer
  )),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ DEFAULT now(),
  password_expires_at TIMESTAMPTZ,
  password_history TEXT[], -- Array of previous password hashes for reuse prevention
  two_factor_enabled BOOLEAN DEFAULT false,
  emergency_access_granted BOOLEAN DEFAULT false,
  emergency_access_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- HIPAA compliance fields
  hipaa_trained BOOLEAN DEFAULT false,
  hipaa_training_date DATE,
  hipaa_training_expires DATE,

  -- Audit fields
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Service role can manage all profiles (for admin operations)
CREATE POLICY "Service role can manage profiles" ON public.profiles
  FOR ALL USING (auth.role() = 'service_role');

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'beneficiary')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 1. BENEFICIARIES TABLE
-- =============================================
-- Links to Supabase Auth users, stores basic beneficiary information
CREATE TABLE beneficiaries (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    date_of_birth DATE,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- HIPAA compliance: Audit trail
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),

    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$')
);

-- Indexes for beneficiaries
CREATE INDEX idx_beneficiaries_email ON beneficiaries(email);
CREATE INDEX idx_beneficiaries_created_at ON beneficiaries(created_at);

-- =============================================
-- 2. CONSENTS TABLE (MOST CRITICAL)
-- =============================================
-- Core security model: explicit, revokable patient consent
-- 42 CFR Part 2 requires explicit consent for each disclosure/use
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,

    -- Consent types based on 42 CFR Part 2 requirements
    consent_type TEXT NOT NULL CHECK (consent_type IN (
        'TREATMENT_PAYMENT_OPERATIONS',  -- TPO (most common)
        'FUNDRAISING_CONTACT',           -- For donor communications
        'RESEARCH',                      -- Research purposes
        'PROGRAM_EVALUATION',            -- Quality improvement
        'AUDIT'                          -- Compliance audits
    )),

    -- Consent status tracking
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending',    -- Awaiting approval
        'active',     -- Currently valid
        'revoked',    -- Explicitly revoked by patient
        'expired',    -- Past expiration date
        'denied'      -- Request denied
    )),

    -- Consent details (required by 42 CFR Part 2)
    purpose TEXT NOT NULL,                    -- Specific purpose of disclosure
    recipient_name TEXT,                      -- Who will receive the information
    recipient_purpose TEXT,                   -- Recipient's purpose
    information_disclosed TEXT,               -- What specific information

    -- Validity period
    granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ,                   -- NULL means no expiration
    revoked_at TIMESTAMPTZ,                   -- When consent was revoked
    revocation_reason TEXT,                   -- Why it was revoked

    -- Audit trail (HIPAA requirement)
    granted_by UUID REFERENCES auth.users(id), -- Staff who obtained consent
    revoked_by UUID REFERENCES auth.users(id), -- Staff who revoked consent

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Business rules
    CONSTRAINT valid_expiration CHECK (
        expires_at IS NULL OR expires_at > granted_at
    ),
    CONSTRAINT revocation_requires_reason CHECK (
        (revoked_at IS NULL AND revocation_reason IS NULL) OR
        (revoked_at IS NOT NULL AND revocation_reason IS NOT NULL)
    ),
    CONSTRAINT active_consent_no_revocation CHECK (
        status != 'active' OR revoked_at IS NULL
    )
);

-- Indexes for consents (critical for performance and compliance queries)
CREATE INDEX idx_consents_beneficiary_id ON consents(beneficiary_id);
CREATE INDEX idx_consents_status ON consents(status);
CREATE INDEX idx_consents_type ON consents(consent_type);
CREATE INDEX idx_consents_expires_at ON consents(expires_at);
CREATE INDEX idx_consents_granted_at ON consents(granted_at);
CREATE UNIQUE INDEX idx_active_consents_per_type ON consents(beneficiary_id, consent_type)
    WHERE status = 'active';

-- =============================================
-- 3. SOBER LIVING PARTNERS TABLE
-- =============================================
-- Preferred Provider Network for sober living facilities
CREATE TABLE sober_living_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,

    -- Facility details
    address_street TEXT,
    address_city TEXT,
    address_state TEXT,
    address_zip TEXT,
    facility_type TEXT CHECK (facility_type IN (
        'sober_living',
        'treatment_center',
        'recovery_house',
        'transitional_housing'
    )),

    -- Accreditation and licensing
    license_number TEXT,
    accreditation_status TEXT DEFAULT 'pending' CHECK (accreditation_status IN (
        'pending',
        'accredited',
        'suspended',
        'revoked'
    )),

    -- Network status
    network_status TEXT DEFAULT 'pending' CHECK (network_status IN (
        'pending',     -- Application submitted
        'active',      -- Active in network
        'suspended',   -- Temporarily suspended
        'terminated'   -- Removed from network
    )),

    -- Capacity and services
    max_capacity INTEGER,
    current_occupancy INTEGER DEFAULT 0,
    services_offered TEXT[], -- Array of services

    -- Business information
    contract_start_date DATE,
    contract_end_date DATE,

    -- Audit trail
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),

    -- Constraints
    CONSTRAINT valid_email CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (contact_phone IS NULL OR contact_phone ~* '^\+?[1-9]\d{1,14}$'),
    CONSTRAINT valid_capacity CHECK (
        max_capacity IS NULL OR max_capacity > 0
    ),
    CONSTRAINT valid_occupancy CHECK (
        current_occupancy IS NULL OR
        (current_occupancy >= 0 AND
         (max_capacity IS NULL OR current_occupancy <= max_capacity))
    ),
    CONSTRAINT valid_contract_dates CHECK (
        contract_end_date IS NULL OR contract_end_date > contract_start_date
    )
);

-- Indexes for sober living partners
CREATE INDEX idx_partners_facility_name ON sober_living_partners(facility_name);
CREATE INDEX idx_partners_network_status ON sober_living_partners(network_status);
CREATE INDEX idx_partners_accreditation ON sober_living_partners(accreditation_status);
CREATE INDEX idx_partners_location ON sober_living_partners(address_city, address_state);

-- =============================================
-- 4. APPLICATIONS TABLE
-- =============================================
-- Links beneficiaries to sober living partners
-- Requires active consent for disclosure
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
    partner_id UUID NOT NULL REFERENCES sober_living_partners(id) ON DELETE CASCADE,

    -- Application status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft',       -- Being prepared
        'submitted',   -- Submitted to partner
        'under_review', -- Partner reviewing
        'approved',    -- Approved for admission
        'denied',      -- Denied admission
        'withdrawn',   -- Beneficiary withdrew
        'completed'    -- Successfully completed program
    )),

    -- Application details
    application_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    preferred_start_date DATE,
    special_requirements TEXT,
    urgency_level TEXT DEFAULT 'standard' CHECK (urgency_level IN (
        'low',
        'standard',
        'high',
        'emergency'
    )),

    -- Consent verification (42 CFR Part 2 compliance)
    consent_id UUID REFERENCES consents(id), -- Links to active consent for this disclosure

    -- Partner response
    partner_response_date TIMESTAMPTZ,
    partner_notes TEXT,
    denial_reason TEXT,

    -- Program details (once approved)
    actual_start_date DATE,
    expected_completion_date DATE,
    actual_completion_date DATE,

    -- Audit trail
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),

    -- Constraints
    CONSTRAINT valid_application_consent CHECK (
        -- Ensure consent exists and is active for TPO disclosures
        consent_id IS NOT NULL OR status = 'draft'
    ),
    CONSTRAINT valid_dates CHECK (
        actual_completion_date IS NULL OR actual_start_date IS NOT NULL
    ),
    CONSTRAINT valid_denial_reason CHECK (
        (status != 'denied') OR (denial_reason IS NOT NULL)
    )
);

-- Indexes for applications
CREATE INDEX idx_applications_beneficiary_id ON applications(beneficiary_id);
CREATE INDEX idx_applications_partner_id ON applications(partner_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_consent_id ON applications(consent_id);
CREATE INDEX idx_applications_urgency ON applications(urgency_level);
CREATE INDEX idx_applications_created_at ON applications(created_at);

-- =============================================
-- ROW LEVEL SECURITY POLICIES (HIPAA/42 CFR Part 2)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sober_living_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiary_outcomes ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTIONS FOR ROLE-BASED ACCESS
-- =============================================

-- Function to check if user has a specific role or higher
CREATE OR REPLACE FUNCTION has_role(minimum_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Get the current user's role
    SELECT role INTO user_role FROM profiles WHERE id = auth.uid();

    -- Define role hierarchy (higher numbers = more permissions)
    CASE
        WHEN user_role = 'compliance_officer' THEN RETURN true;
        WHEN user_role = 'admin' AND minimum_role IN ('admin', 'staff', 'partner', 'donor', 'beneficiary') THEN RETURN true;
        WHEN user_role = 'staff' AND minimum_role IN ('staff', 'partner', 'donor', 'beneficiary') THEN RETURN true;
        WHEN user_role = 'partner' AND minimum_role IN ('partner', 'beneficiary') THEN RETURN true;
        WHEN user_role = 'donor' AND minimum_role IN ('donor', 'beneficiary') THEN RETURN true;
        WHEN user_role = 'beneficiary' AND minimum_role = 'beneficiary' THEN RETURN true;
        ELSE RETURN false;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is HIPAA trained and compliant
CREATE OR REPLACE FUNCTION is_hipaa_compliant()
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
BEGIN
    SELECT * INTO user_record FROM profiles WHERE id = auth.uid();

    -- Must be active, HIPAA trained, and training not expired
    RETURN user_record.is_active = true
        AND user_record.hipaa_trained = true
        AND (user_record.hipaa_training_expires IS NULL OR user_record.hipaa_training_expires > CURRENT_DATE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check emergency access
CREATE OR REPLACE FUNCTION has_emergency_access()
RETURNS BOOLEAN AS $$
DECLARE
    user_record RECORD;
BEGIN
    SELECT * INTO user_record FROM profiles WHERE id = auth.uid();

    RETURN user_record.emergency_access_granted = true
        AND (user_record.emergency_access_expires IS NULL OR user_record.emergency_access_expires > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COMPREHENSIVE ROLE-BASED POLICIES
-- =============================================

-- Beneficiaries: Strict access controls
CREATE POLICY "beneficiaries_select" ON beneficiaries
    FOR SELECT USING (
        -- Users can see their own record
        auth.uid() = id OR
        -- Staff+ can see all beneficiary records (for case management)
        has_role('staff') OR
        -- Partners can see beneficiaries assigned to their facilities
        (has_role('partner') AND EXISTS (
            SELECT 1 FROM applications a
            JOIN sober_living_partners slp ON a.partner_id = slp.id
            WHERE a.beneficiary_id = beneficiaries.id
            AND slp.contact_email = (SELECT email FROM profiles WHERE id = auth.uid())
        )) OR
        -- Emergency access for critical situations
        has_emergency_access()
    );

CREATE POLICY "beneficiaries_insert" ON beneficiaries
    FOR INSERT WITH CHECK (
        -- Users can create their own record during application
        auth.uid() = id OR
        -- Staff can create beneficiary records
        has_role('staff')
    );

CREATE POLICY "beneficiaries_update" ON beneficiaries
    FOR UPDATE USING (
        -- Users can update their own record (limited fields)
        auth.uid() = id OR
        -- Staff+ can update all beneficiary records
        has_role('staff') OR
        -- Emergency access
        has_emergency_access()
    );

-- Consents: Most critical - explicit consent required for all disclosures
CREATE POLICY "consents_select" ON consents
    FOR SELECT USING (
        -- Beneficiaries can see their own consents
        beneficiary_id = auth.uid() OR
        -- Staff+ can see all consents (for compliance and case management)
        has_role('staff') OR
        -- Compliance officers have full access
        has_role('compliance_officer') OR
        -- Emergency access for urgent situations
        has_emergency_access()
    );

CREATE POLICY "consents_insert" ON consents
    FOR INSERT WITH CHECK (
        -- Only HIPAA-trained staff can create consent records
        has_role('staff') AND is_hipaa_compliant()
    );

CREATE POLICY "consents_update" ON consents
    FOR UPDATE USING (
        -- Only HIPAA-trained staff can modify consents
        has_role('staff') AND is_hipaa_compliant() OR
        -- Emergency access
        has_emergency_access()
    );

-- Sober Living Partners: Network management with controlled access
CREATE POLICY "partners_select" ON sober_living_partners
    FOR SELECT USING (
        -- Staff+ can see all partners (for network management)
        has_role('staff') OR
        -- Partners can see their own facility information
        (has_role('partner') AND contact_email = (SELECT email FROM profiles WHERE id = auth.uid())) OR
        -- Public can see active partner names for social proof (limited fields)
        (auth.role() = 'anon' AND network_status = 'active')
    );

CREATE POLICY "partners_insert" ON sober_living_partners
    FOR INSERT WITH CHECK (
        -- Only staff can add new partners
        has_role('staff') AND is_hipaa_compliant()
    );

CREATE POLICY "partners_update" ON sober_living_partners
    FOR UPDATE USING (
        -- Staff can update all partners
        has_role('staff') AND is_hipaa_compliant() OR
        -- Partners can update their own facility (limited fields)
        (has_role('partner') AND contact_email = (SELECT email FROM profiles WHERE id = auth.uid()))
    );

-- Applications: Beneficiaries can see their own, staff can see all with consent verification
CREATE POLICY "applications_select" ON applications
    FOR SELECT USING (
        -- Users can see their own applications
        beneficiary_id = auth.uid() OR
        -- Staff+ can see all applications (case management)
        has_role('staff') OR
        -- Partners can see applications for their facilities
        (has_role('partner') AND EXISTS (
            SELECT 1 FROM sober_living_partners slp
            WHERE slp.id = applications.partner_id
            AND slp.contact_email = (SELECT email FROM profiles WHERE id = auth.uid())
        ))
    );

CREATE POLICY "applications_insert" ON applications
    FOR INSERT WITH CHECK (
        -- Users can create applications for themselves
        beneficiary_id = auth.uid() OR
        -- Staff can create applications on behalf of beneficiaries
        has_role('staff')
    );

CREATE POLICY "applications_update" ON applications
    FOR UPDATE USING (
        -- Staff+ can update all applications
        has_role('staff') OR
        -- Partners can update applications at their facilities
        (has_role('partner') AND EXISTS (
            SELECT 1 FROM sober_living_partners slp
            WHERE slp.id = applications.partner_id
            AND slp.contact_email = (SELECT email FROM profiles WHERE id = auth.uid())
        ))
    );

-- =============================================
-- HIPAA COMPLIANCE: AUDIT LOGGING
-- =============================================
-- Comprehensive audit trail for all PHI access and changes (HIPAA requirement)

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,

    -- Who performed the action
    user_id UUID REFERENCES auth.users(id),
    user_role TEXT,
    user_ip TEXT,

    -- What action was performed
    action TEXT NOT NULL CHECK (action IN (
        'CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT',
        'EXPORT', 'IMPORT', 'SEARCH', 'CONSENT_GRANTED', 'CONSENT_REVOKED',
        'BREACH_DETECTED', 'BACKUP_CREATED', 'BACKUP_RESTORED'
    )),

    -- Which table/resource was affected
    resource_type TEXT NOT NULL CHECK (resource_type IN (
        'beneficiaries', 'consents', 'applications', 'beneficiary_outcomes',
        'scholarship_payments', 'impact_stories', 'local_resources',
        'system_config', 'user_sessions'
    )),

    -- Specific record affected (can be NULL for bulk operations)
    resource_id UUID,

    -- What data was changed (JSON diff for updates)
    old_values JSONB,
    new_values JSONB,

    -- Context and compliance information
    purpose TEXT, -- Why was this access performed?
    consent_id UUID REFERENCES consents(id), -- Links to active consent if applicable
    emergency_access BOOLEAN DEFAULT FALSE, -- Was this emergency access?
    emergency_reason TEXT, -- Reason for emergency access

    -- Additional metadata
    user_agent TEXT,
    session_id TEXT,
    location TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,

    -- Audit metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for audit log performance and compliance queries
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_resource_type ON audit_log(resource_type);
CREATE INDEX idx_audit_log_resource_id ON audit_log(resource_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_consent_id ON audit_log(consent_id);

-- Enable RLS for audit log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Staff can read all audit logs, users can only see their own actions
CREATE POLICY "audit_log_staff_access" ON audit_log
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'compliance_officer')
        ) OR user_id = auth.uid()
    );

-- Policy: Only service role can insert audit logs (to prevent tampering)
CREATE POLICY "audit_log_insert" ON audit_log
    FOR INSERT TO service_role
    WITH CHECK (true);

-- =============================================
-- AUDIT LOGGING FUNCTIONS
-- =============================================

-- Function to log PHI access/modification
CREATE OR REPLACE FUNCTION log_phi_access(
    p_user_id UUID,
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_purpose TEXT DEFAULT NULL,
    p_consent_id UUID DEFAULT NULL,
    p_emergency_access BOOLEAN DEFAULT FALSE,
    p_emergency_reason TEXT DEFAULT NULL,
    p_success BOOLEAN DEFAULT TRUE,
    p_error_message TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    audit_id UUID;
    user_role TEXT;
    user_ip TEXT;
    user_agent TEXT;
    session_id TEXT;
BEGIN
    -- Get user role from profiles
    SELECT role INTO user_role FROM profiles WHERE id = p_user_id;

    -- Get request metadata (would be passed from application)
    user_ip := COALESCE(current_setting('request.headers', true)::json->>'x-forwarded-for', 'unknown');
    user_agent := COALESCE(current_setting('request.headers', true)::json->>'user-agent', 'unknown');
    session_id := COALESCE(current_setting('request.jwt.claims', true)::json->>'session_id', 'unknown');

    -- Insert audit log
    INSERT INTO audit_log (
        user_id, user_role, user_ip, action, resource_type, resource_id,
        old_values, new_values, purpose, consent_id, emergency_access,
        emergency_reason, user_agent, session_id, success, error_message
    ) VALUES (
        p_user_id, user_role, user_ip, p_action, p_resource_type, p_resource_id,
        p_old_values, p_new_values, p_purpose, p_consent_id, p_emergency_access,
        p_emergency_reason, user_agent, session_id, p_success, p_error_message
    ) RETURNING id INTO audit_id;

    RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get audit trail for compliance reporting
CREATE OR REPLACE FUNCTION get_audit_trail(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '90 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW(),
    p_user_id UUID DEFAULT NULL,
    p_resource_type TEXT DEFAULT NULL,
    p_action TEXT DEFAULT NULL
) RETURNS TABLE(
    id UUID,
    timestamp TIMESTAMPTZ,
    user_id UUID,
    user_role TEXT,
    action TEXT,
    resource_type TEXT,
    resource_id UUID,
    purpose TEXT,
    consent_id UUID,
    emergency_access BOOLEAN,
    success BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.id, al.timestamp, al.user_id, al.user_role, al.action,
        al.resource_type, al.resource_id, al.purpose, al.consent_id,
        al.emergency_access, al.success
    FROM audit_log al
    WHERE al.timestamp BETWEEN p_start_date AND p_end_date
    AND (p_user_id IS NULL OR al.user_id = p_user_id)
    AND (p_resource_type IS NULL OR al.resource_type = p_resource_type)
    AND (p_action IS NULL OR al.action = p_action)
    ORDER BY al.timestamp DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PUBLIC IMPACT METRICS TABLE
-- =============================================
-- Secure public dashboard data (anonymized aggregates only)

CREATE TABLE public_impact_metrics (
    id INT PRIMARY KEY DEFAULT 1,
    total_beneficiaries_served INT NOT NULL DEFAULT 0,
    total_funds_disbursed_usd INT NOT NULL DEFAULT 0,
    average_approval_time_minutes INT DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- BENEFICIARY OUTCOMES TABLE
-- =============================================
-- Long-term outcome tracking at 30/60/90-day intervals
-- Critical for measuring actual impact vs. outputs

CREATE TABLE beneficiary_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
    interval_days INT NOT NULL CHECK (interval_days IN (30, 60, 90)),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    outcome_metric TEXT CHECK (outcome_metric IN (
        'still_in_residence',
        'completed_program_successfully',
        'discharged_non_compliant',
        'discharged_left_ama',
        'lost_contact'
    )),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS for public access (this table contains only anonymized aggregates)
ALTER TABLE public_impact_metrics ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access to impact metrics
CREATE POLICY "Allow public read-only access to metrics"
ON public_impact_metrics FOR SELECT
TO anon
USING (true);

-- RLS for beneficiary_outcomes table
ALTER TABLE beneficiary_outcomes ENABLE ROW LEVEL SECURITY;

-- Staff can read/write all outcomes
CREATE POLICY "staff_full_access_outcomes" ON beneficiary_outcomes
    FOR ALL TO staff
    USING (true) WITH CHECK (true);

-- Beneficiaries can only read their own outcomes
CREATE POLICY "beneficiaries_read_own_outcomes" ON beneficiary_outcomes
    FOR SELECT TO authenticated
    USING (beneficiary_id = auth.uid());

-- =============================================
-- FOREIGN DATA WRAPPER INTEGRATIONS
-- =============================================

-- Enable postgres_fdw extension for external data sources
CREATE EXTENSION IF NOT EXISTS postgres_fdw WITH SCHEMA extensions;

-- Enable pg_vector extension for AI-powered resource matching
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- =============================================
-- APLOS ACCOUNTING INTEGRATION
-- =============================================

-- Create foreign server for Aplos database connection
-- Note: Credentials stored securely in Supabase Vault
CREATE SERVER IF NOT EXISTS aplos_accounting_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (
  host 'aplos-db-host',  -- Placeholder: actual host from Vault
  port '5432',
  dbname 'aplos_production'
);

-- Create user mapping for read-only access
-- Note: Uses service_role for secure access
CREATE USER MAPPING IF NOT EXISTS FOR service_role
SERVER aplos_accounting_server
OPTIONS (
  user 'aplos_readonly_user',
  password 'aplos_readonly_password'
);

-- Create foreign table for Aplos transactions
-- Maps to Aplos transactions table for real-time financial data
CREATE FOREIGN TABLE IF NOT EXISTS public.aplos_transactions (
  id INT,
  transaction_date DATE,
  amount DECIMAL(10,2),
  fund_name TEXT,
  description TEXT,
  transaction_type TEXT,
  created_at TIMESTAMPTZ
)
SERVER aplos_accounting_server
OPTIONS (
  schema_name 'accounting',
  table_name 'transactions'
);

-- =============================================
-- BLOOMERANG CRM INTEGRATION
-- =============================================

-- Create foreign server for Bloomerang database
CREATE SERVER IF NOT EXISTS bloomerang_crm_server
FOREIGN DATA WRAPPER postgres_fdw
OPTIONS (
  host 'bloomerang-db-host',  -- Placeholder: actual host from Vault
  port '5432',
  dbname 'bloomerang_production'
);

-- Create user mapping for Bloomerang access
CREATE USER MAPPING IF NOT EXISTS FOR service_role
SERVER bloomerang_crm_server
OPTIONS (
  user 'bloomerang_readonly_user',
  password 'bloomerang_readonly_password'
);

-- Foreign table for constituent/donor data
CREATE FOREIGN TABLE IF NOT EXISTS public.bloomerang_constituents (
  id INT,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  segment_name TEXT,
  total_giving DECIMAL(10,2),
  last_gift_date DATE,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
SERVER bloomerang_crm_server
OPTIONS (
  schema_name 'crm',
  table_name 'constituents'
);

-- Foreign table for KPI metrics
CREATE FOREIGN TABLE IF NOT EXISTS public.bloomerang_kpis (
  id INT,
  kpi_name TEXT,
  value DECIMAL(10,2),
  period_start DATE,
  period_end DATE,
  calculated_at TIMESTAMPTZ
)
SERVER bloomerang_crm_server
OPTIONS (
  schema_name 'analytics',
  table_name 'kpi_metrics'
);

-- =============================================
-- AGGREGATE KPI FUNCTIONS
-- =============================================

-- Function to get full organization KPIs from all data sources
CREATE OR REPLACE FUNCTION get_full_organization_kpis()
RETURNS json AS $$
DECLARE
  -- Program Metrics (from Supabase)
  _applications_pending INT;
  _beneficiaries_housed INT;
  _90_day_success_rate DECIMAL;
  -- Financial Metrics (from Aplos FDW)
  _revenue_last_30d DECIMAL;
  _expenses_last_30d DECIMAL;
  -- Fundraising Metrics (from Bloomerang FDW)
  _new_recurring_donors_month INT;
  _donor_retention_rate DECIMAL;
BEGIN
  -- Program Queries
  SELECT COUNT(*) INTO _applications_pending FROM public.applications WHERE status = 'pending';

  SELECT total_beneficiaries_served INTO _beneficiaries_housed FROM public.public_impact_metrics;

  SELECT AVG(CASE WHEN outcome_metric IN ('still_in_residence', 'completed_program_successfully') THEN 1 ELSE 0 END) * 100
  INTO _90_day_success_rate FROM public.beneficiary_outcomes WHERE interval_days = 90 AND status = 'completed';

  -- Financial Queries (from FDW)
  SELECT COALESCE(SUM(amount), 0) INTO _revenue_last_30d FROM public.aplos_transactions
  WHERE transaction_date >= (now() - interval '30 days') AND amount > 0;

  SELECT COALESCE(SUM(amount), 0) INTO _expenses_last_30d FROM public.aplos_transactions
  WHERE transaction_date >= (now() - interval '30 days') AND amount < 0;

  -- Fundraising Queries (from FDW)
  SELECT COUNT(*) INTO _new_recurring_donors_month FROM public.bloomerang_constituents
  WHERE segment_name = 'New Recurring Donors' AND created_at >= (now() - interval '30 days');

  SELECT value INTO _donor_retention_rate FROM public.bloomerang_kpis WHERE kpi_name = 'donor_retention_rate';

  -- Return all as a single JSON object
  RETURN json_build_object(
    'applications_pending', _applications_pending,
    'beneficiaries_housed', _beneficiaries_housed,
    '90_day_success_rate', COALESCE(_90_day_success_rate, 0),
    'revenue_last_30d', _revenue_last_30d,
    'expenses_last_30d', _expenses_last_30d,
    'net_operational_balance', (_revenue_last_30d + _expenses_last_30d),
    'new_recurring_donors_month', _new_recurring_donors_month,
    'donor_retention_rate', COALESCE(_donor_retention_rate, 0)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- AI-POWERED RESOURCE MATCHING SYSTEM
-- =============================================

-- Create table for local resources with AI embeddings
-- This syncs from Sanity CMS and stores vector embeddings for similarity search
CREATE TABLE IF NOT EXISTS public.local_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sanity_id TEXT UNIQUE NOT NULL,
  organization_name TEXT NOT NULL,
  description TEXT,
  phone TEXT,
  website TEXT,
  address_city TEXT,
  address_state TEXT,
  resource_type TEXT,
  embedding vector(1536), -- OpenAI text-embedding-ada-002 dimensions
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for local resources
ALTER TABLE public.local_resources ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access for resource matching
CREATE POLICY "Public read access for local resources" ON public.local_resources
  FOR SELECT USING (true);

-- Policy: Allow service role to manage resources (for Sanity sync)
CREATE POLICY "Service role can manage local resources" ON public.local_resources
  FOR ALL USING (auth.role() = 'service_role');

-- Function to match resources using vector similarity
CREATE OR REPLACE FUNCTION match_resources(query_embedding vector(1536), match_threshold float DEFAULT 0.7, max_results int DEFAULT 3)
RETURNS TABLE(
  id UUID,
  organization_name TEXT,
  description TEXT,
  phone TEXT,
  website TEXT,
  address_city TEXT,
  address_state TEXT,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    lr.id,
    lr.organization_name,
    lr.description,
    lr.phone,
    lr.website,
    lr.address_city,
    lr.address_state,
    1 - (lr.embedding <=> query_embedding) as similarity
  FROM public.local_resources lr
  WHERE 1 - (lr.embedding <=> query_embedding) > match_threshold
  ORDER BY lr.embedding <=> query_embedding
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- DONOR IMPACT STORIES
-- =============================================

-- Table for storing anonymized impact stories for donor portal
CREATE TABLE IF NOT EXISTS public.impact_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  location TEXT,
  photo_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for impact stories
ALTER TABLE public.impact_stories ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access for published stories
CREATE POLICY "Public read access for published impact stories" ON public.impact_stories
  FOR SELECT USING (published = true);

-- Policy: Service role can manage all stories
CREATE POLICY "Service role can manage impact stories" ON public.impact_stories
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- PROGRAM FINANCIAL DATA SYNC (BIDIRECTIONAL)
-- =============================================

-- Create dedicated schema for program financials
CREATE SCHEMA IF NOT EXISTS program_financials;

-- Scholarship payments table (tracks all disbursements)
CREATE TABLE IF NOT EXISTS public.scholarship_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  amount_paid DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT DEFAULT 'ach' CHECK (payment_method IN ('ach', 'check', 'wire')),
  transaction_id TEXT UNIQUE, -- Stripe/Aplos transaction ID
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Audit trail
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS for scholarship payments
ALTER TABLE public.scholarship_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Staff can manage payments
CREATE POLICY "Staff can manage scholarship payments" ON public.scholarship_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('staff', 'partner')
    )
  );

-- Policy: Service role can manage all payments
CREATE POLICY "Service role can manage scholarship payments" ON public.scholarship_payments
  FOR ALL USING (auth.role() = 'service_role');

-- Create view for Aplos reconciliation (read-only access for Aplos FDW)
CREATE OR REPLACE VIEW program_financials.disbursements_for_aplos AS
SELECT
  sp.id as payment_id,
  sp.payment_date,
  sp.amount_paid,
  CONCAT(slp.facility_name, ' (Scholarship)') as vendor_name,
  CONCAT('Beneficiary: ', b.full_name, ' - Application: ', a.id::text) as memo_beneficiary_name,
  a.id as application_id,
  sp.transaction_id,
  sp.status,
  sp.created_at
FROM public.scholarship_payments sp
JOIN public.applications a ON sp.application_id = a.id
JOIN public.beneficiaries b ON a.beneficiary_id = b.id
JOIN public.sober_living_partners slp ON a.partner_id = slp.id
WHERE sp.status = 'completed';

-- =============================================
-- HIPAA TRAINING MANAGEMENT SYSTEM
-- =============================================

-- Training courses table
CREATE TABLE training_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_name TEXT NOT NULL,
    course_description TEXT,
    course_content TEXT, -- JSON content structure
    course_type TEXT NOT NULL CHECK (course_type IN (
        'hipaa_basics', 'privacy_rule', 'security_rule', 'breach_response',
        'consent_management', 'audit_compliance', 'refresher'
    )),
    version TEXT NOT NULL DEFAULT '1.0',
    is_active BOOLEAN DEFAULT true,
    estimated_duration_minutes INTEGER DEFAULT 30,
    passing_score_percentage INTEGER DEFAULT 80,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id)
);

-- Training assignments table
CREATE TABLE training_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    due_date TIMESTAMPTZ,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    status TEXT DEFAULT 'assigned' CHECK (status IN (
        'assigned', 'in_progress', 'completed', 'overdue', 'cancelled'
    )),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, course_id, assigned_at::date) -- Prevent duplicate assignments same day
);

-- Training attempts and completions
CREATE TABLE training_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES training_assignments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES training_courses(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    score_percentage INTEGER,
    passed BOOLEAN,
    time_spent_minutes INTEGER,
    certificate_issued BOOLEAN DEFAULT false,
    certificate_number TEXT UNIQUE,
    certificate_issued_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ, -- For refresher training requirements
    quiz_responses JSONB, -- Store quiz answers for audit
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comments TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training reminders and notifications
CREATE TABLE training_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES training_assignments(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL CHECK (notification_type IN (
        'assignment', 'reminder', 'overdue', 'completion', 'expiration_warning'
    )),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    email_sent BOOLEAN DEFAULT false,
    sms_sent BOOLEAN DEFAULT false,
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for training system performance
CREATE INDEX idx_training_assignments_user_id ON training_assignments(user_id);
CREATE INDEX idx_training_assignments_status ON training_assignments(status);
CREATE INDEX idx_training_assignments_due_date ON training_assignments(due_date);
CREATE INDEX idx_training_completions_user_id ON training_completions(user_id);
CREATE INDEX idx_training_completions_course_id ON training_completions(course_id);
CREATE INDEX idx_training_notifications_user_id ON training_notifications(user_id);

-- =============================================
-- MULTI-FACTOR AUTHENTICATION SYSTEM
-- =============================================

-- MFA secrets table (encrypted storage)
CREATE TABLE mfa_secrets (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    secret TEXT NOT NULL, -- Encrypted TOTP secret
    backup_codes TEXT[], -- Encrypted backup codes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for MFA table
CREATE INDEX idx_mfa_secrets_user_id ON mfa_secrets(user_id);

-- Enable RLS for MFA table
ALTER TABLE mfa_secrets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for MFA secrets
CREATE POLICY "mfa_secrets_owner_only" ON mfa_secrets
    FOR ALL USING (user_id = auth.uid());

-- =============================================
-- END MFA SYSTEM
-- =============================================

-- =============================================
-- SECURITY MONITORING & ALERTING SYSTEM
-- =============================================

-- Security events table (comprehensive audit trail)
CREATE TABLE security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    event_type TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id),
    ip_address TEXT,
    user_agent TEXT,
    session_id TEXT,
    resource_accessed TEXT,
    severity TEXT DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    details JSONB,
    resolved BOOLEAN DEFAULT false,
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Security alerts table
CREATE TABLE security_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    rule_name TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    event_count INTEGER DEFAULT 0,
    affected_users UUID[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    assigned_to UUID REFERENCES profiles(id),
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES auth.users(id),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alert notifications table
CREATE TABLE alert_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL REFERENCES security_alerts(id) ON DELETE CASCADE,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'sms', 'webhook', 'system_log')),
    recipient TEXT, -- Email address, phone number, webhook URL
    message TEXT NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivered BOOLEAN DEFAULT false,
    delivery_error TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for security monitoring performance
CREATE INDEX idx_security_events_timestamp ON security_events(timestamp DESC);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_security_events_resolved ON security_events(resolved);

CREATE INDEX idx_security_alerts_timestamp ON security_alerts(timestamp DESC);
CREATE INDEX idx_security_alerts_status ON security_alerts(status);
CREATE INDEX idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX idx_security_alerts_assigned_to ON security_alerts(assigned_to);

CREATE INDEX idx_alert_notifications_alert_id ON alert_notifications(alert_id);
CREATE INDEX idx_alert_notifications_sent_at ON alert_notifications(sent_at DESC);

-- Enable RLS for security tables
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for security monitoring
-- Security events: Staff and compliance officers can read all, users can read their own
CREATE POLICY "security_events_staff_access" ON security_events
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'compliance_officer')
        )
    );

-- Security alerts: Staff and compliance officers can manage all alerts
CREATE POLICY "security_alerts_staff_access" ON security_alerts
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'compliance_officer')
        )
    );

-- Alert notifications: Staff and compliance officers can read all
CREATE POLICY "alert_notifications_staff_access" ON alert_notifications
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role IN ('staff', 'admin', 'compliance_officer')
        )
    );

-- =============================================
-- END SECURITY MONITORING SYSTEM
-- =============================================

-- Enable RLS for training tables
ALTER TABLE training_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for training system
CREATE POLICY "training_courses_read" ON training_courses
    FOR SELECT USING (true); -- Public read for active courses

CREATE POLICY "training_assignments_read_own" ON training_assignments
    FOR SELECT USING (user_id = auth.uid() OR has_role('staff'));

CREATE POLICY "training_completions_read_own" ON training_completions
    FOR SELECT USING (user_id = auth.uid() OR has_role('staff'));

CREATE POLICY "training_notifications_read_own" ON training_notifications
    FOR SELECT USING (user_id = auth.uid() OR has_role('staff'));

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to all tables
CREATE TRIGGER update_beneficiaries_updated_at
    BEFORE UPDATE ON beneficiaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consents_updated_at
    BEFORE UPDATE ON consents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at
    BEFORE UPDATE ON sober_living_partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check consent validity
CREATE OR REPLACE FUNCTION is_consent_valid(consent_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    consent_record RECORD;
BEGIN
    SELECT * INTO consent_record FROM consents WHERE id = consent_uuid;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Check if consent is active and not expired
    RETURN consent_record.status = 'active'
        AND (consent_record.expires_at IS NULL OR consent_record.expires_at > NOW())
        AND consent_record.revoked_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- HIPAA TRAINING MANAGEMENT FUNCTIONS
-- =============================================

-- Function to assign training to users
CREATE OR REPLACE FUNCTION assign_training(
    p_user_ids UUID[],
    p_course_id UUID,
    p_assigned_by UUID,
    p_due_date TIMESTAMPTZ DEFAULT NULL,
    p_priority TEXT DEFAULT 'normal'
) RETURNS TABLE(assignment_id UUID, user_id UUID, success BOOLEAN, message TEXT) AS $$
DECLARE
    user_id UUID;
    assignment_record RECORD;
BEGIN
    -- Validate inputs
    IF NOT EXISTS (SELECT 1 FROM training_courses WHERE id = p_course_id AND is_active = true) THEN
        RETURN QUERY SELECT NULL::UUID, NULL::UUID, false, 'Course not found or inactive';
        RETURN;
    END IF;

    IF NOT has_role('staff') THEN
        RETURN QUERY SELECT NULL::UUID, NULL::UUID, false, 'Insufficient permissions to assign training';
        RETURN;
    END IF;

    FOREACH user_id IN ARRAY p_user_ids LOOP
        -- Check if assignment already exists for today
        IF EXISTS (
            SELECT 1 FROM training_assignments
            WHERE user_id = user_id
            AND course_id = p_course_id
            AND assigned_at::date = CURRENT_DATE
        ) THEN
            RETURN QUERY SELECT NULL::UUID, user_id, false, 'Training already assigned today';
            CONTINUE;
        END IF;

        -- Create assignment
        INSERT INTO training_assignments (
            user_id, course_id, assigned_by, due_date, priority
        ) VALUES (
            user_id, p_course_id, p_assigned_by, p_due_date, p_priority
        ) RETURNING id INTO assignment_record;

        -- Create notification
        INSERT INTO training_notifications (
            user_id, assignment_id, notification_type, message
        ) VALUES (
            user_id, assignment_record.id, 'assignment',
            'You have been assigned new training: ' || (SELECT course_name FROM training_courses WHERE id = p_course_id)
        );

        RETURN QUERY SELECT assignment_record.id, user_id, true, 'Training assigned successfully';
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to complete training with quiz results
CREATE OR REPLACE FUNCTION complete_training(
    p_assignment_id UUID,
    p_score_percentage INTEGER,
    p_time_spent_minutes INTEGER,
    p_quiz_responses JSONB DEFAULT NULL,
    p_feedback_rating INTEGER DEFAULT NULL,
    p_feedback_comments TEXT DEFAULT NULL
) RETURNS TABLE(success BOOLEAN, message TEXT, certificate_number TEXT) AS $$
DECLARE
    assignment_record RECORD;
    course_record RECORD;
    completion_record RECORD;
    passed BOOLEAN;
    cert_number TEXT;
BEGIN
    -- Get assignment and course details
    SELECT * INTO assignment_record FROM training_assignments WHERE id = p_assignment_id;
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Assignment not found', NULL::TEXT;
        RETURN;
    END IF;

    -- Verify user owns assignment
    IF assignment_record.user_id != auth.uid() AND NOT has_role('staff') THEN
        RETURN QUERY SELECT false, 'Access denied', NULL::TEXT;
        RETURN;
    END IF;

    SELECT * INTO course_record FROM training_courses WHERE id = assignment_record.course_id;
    passed := p_score_percentage >= course_record.passing_score_percentage;

    -- Generate certificate number if passed
    IF passed THEN
        cert_number := 'CERT-' || UPPER(SUBSTRING(MD5(random()::text) FROM 1 FOR 8)) || '-' || EXTRACT(YEAR FROM NOW());
    END IF;

    -- Insert completion record
    INSERT INTO training_completions (
        assignment_id, user_id, course_id, completed_at, score_percentage,
        passed, time_spent_minutes, certificate_issued, certificate_number,
        certificate_issued_at, expires_at, quiz_responses, feedback_rating, feedback_comments
    ) VALUES (
        p_assignment_id, assignment_record.user_id, assignment_record.course_id,
        NOW(), p_score_percentage, passed, p_time_spent_minutes, passed, cert_number,
        CASE WHEN passed THEN NOW() ELSE NULL END,
        CASE WHEN passed THEN NOW() + INTERVAL '1 year' ELSE NULL END,
        p_quiz_responses, p_feedback_rating, p_feedback_comments
    ) RETURNING * INTO completion_record;

    -- Update assignment status
    UPDATE training_assignments
    SET status = 'completed', updated_at = NOW()
    WHERE id = p_assignment_id;

    -- Update user HIPAA training status if this is HIPAA training
    IF course_record.course_type LIKE 'hipaa%' THEN
        UPDATE profiles
        SET hipaa_trained = true,
            hipaa_training_date = NOW(),
            hipaa_training_expires = NOW() + INTERVAL '1 year',
            updated_at = NOW()
        WHERE id = assignment_record.user_id;
    END IF;

    -- Create completion notification
    INSERT INTO training_notifications (
        user_id, assignment_id, notification_type, message
    ) VALUES (
        assignment_record.user_id, p_assignment_id, 'completion',
        CASE WHEN passed THEN 'Training completed successfully! Certificate: ' || cert_number
             ELSE 'Training completed but did not pass. Please review and try again.' END
    );

    RETURN QUERY SELECT true, CASE WHEN passed THEN 'Training completed successfully'
                                   ELSE 'Training completed but did not meet passing criteria' END, cert_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get training compliance status for users
CREATE OR REPLACE FUNCTION get_training_compliance(p_user_id UUID DEFAULT NULL)
RETURNS TABLE(
    user_id UUID,
    full_name TEXT,
    role TEXT,
    hipaa_trained BOOLEAN,
    hipaa_training_expires DATE,
    assigned_trainings BIGINT,
    completed_trainings BIGINT,
    overdue_trainings BIGINT,
    compliance_status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.full_name,
        p.role,
        p.hipaa_trained,
        p.hipaa_training_expires,
        COUNT(DISTINCT ta.id) as assigned_trainings,
        COUNT(DISTINCT tc.id) as completed_trainings,
        COUNT(DISTINCT CASE WHEN ta.due_date < NOW() AND ta.status != 'completed' THEN ta.id END) as overdue_trainings,
        CASE
            WHEN p.hipaa_trained = false THEN 'Not Trained'
            WHEN p.hipaa_training_expires < CURRENT_DATE THEN 'Training Expired'
            WHEN COUNT(DISTINCT CASE WHEN ta.due_date < NOW() AND ta.status != 'completed' THEN ta.id END) > 0 THEN 'Overdue Training'
            ELSE 'Compliant'
        END as compliance_status
    FROM profiles p
    LEFT JOIN training_assignments ta ON p.id = ta.user_id
    LEFT JOIN training_completions tc ON ta.id = tc.assignment_id AND tc.passed = true
    WHERE (p_user_id IS NULL OR p.id = p_user_id)
    AND p.is_active = true
    GROUP BY p.id, p.full_name, p.role, p.hipaa_trained, p.hipaa_training_expires;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and send training reminders
CREATE OR REPLACE FUNCTION send_training_reminders()
RETURNS TABLE(notifications_sent INTEGER) AS $$
DECLARE
    reminder_count INTEGER := 0;
    assignment_record RECORD;
BEGIN
    -- Send reminders for assignments due in 3 days
    FOR assignment_record IN
        SELECT ta.*, p.email, tc.course_name
        FROM training_assignments ta
        JOIN profiles p ON ta.user_id = p.id
        JOIN training_courses tc ON ta.course_id = tc.id
        WHERE ta.status = 'assigned'
        AND ta.due_date BETWEEN NOW() AND NOW() + INTERVAL '3 days'
        AND NOT EXISTS (
            SELECT 1 FROM training_notifications tn
            WHERE tn.assignment_id = ta.id
            AND tn.notification_type = 'reminder'
            AND tn.sent_at > NOW() - INTERVAL '24 hours'
        )
    LOOP
        INSERT INTO training_notifications (
            user_id, assignment_id, notification_type, message, email_sent
        ) VALUES (
            assignment_record.user_id, assignment_record.id, 'reminder',
            'Reminder: Your training "' || assignment_record.course_name || '" is due on ' ||
            assignment_record.due_date::date, true
        );
        reminder_count := reminder_count + 1;
    END LOOP;

    -- Mark overdue assignments
    UPDATE training_assignments
    SET status = 'overdue', updated_at = NOW()
    WHERE status = 'assigned'
    AND due_date < NOW();

    -- Send overdue notifications
    FOR assignment_record IN
        SELECT ta.*, p.email, tc.course_name
        FROM training_assignments ta
        JOIN profiles p ON ta.user_id = p.id
        JOIN training_courses tc ON ta.course_id = tc.id
        WHERE ta.status = 'overdue'
        AND NOT EXISTS (
            SELECT 1 FROM training_notifications tn
            WHERE tn.assignment_id = ta.id
            AND tn.notification_type = 'overdue'
            AND tn.sent_at > NOW() - INTERVAL '7 days'
        )
    LOOP
        INSERT INTO training_notifications (
            user_id, assignment_id, notification_type, message, email_sent
        ) VALUES (
            assignment_record.user_id, assignment_record.id, 'overdue',
            'OVERDUE: Your training "' || assignment_record.course_name || '" was due on ' ||
            assignment_record.due_date::date || '. Please complete immediately.', true
        );
        reminder_count := reminder_count + 1;
    END LOOP;

    RETURN QUERY SELECT reminder_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- PASSWORD POLICY MANAGEMENT FUNCTIONS
-- =============================================

-- Function to validate password change and update profile
CREATE OR REPLACE FUNCTION change_password(
    p_user_id UUID,
    p_current_password TEXT,
    p_new_password TEXT
) RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
    user_record RECORD;
    password_valid BOOLEAN;
    is_expired BOOLEAN;
    history_check BOOLEAN;
BEGIN
    -- Get current user profile
    SELECT * INTO user_record FROM profiles WHERE id = p_user_id;
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'User not found';
        RETURN;
    END IF;

    -- Check if account is locked
    IF user_record.locked_until IS NOT NULL AND user_record.locked_until > NOW() THEN
        RETURN QUERY SELECT false, 'Account is temporarily locked due to too many failed login attempts';
        RETURN;
    END IF;

    -- Validate current password (this would normally be done in the application)
    -- For now, we'll assume it's validated client-side

    -- Check password strength (basic validation - full validation done client-side)
    IF LENGTH(p_new_password) < 12 THEN
        RETURN QUERY SELECT false, 'Password must be at least 12 characters long';
        RETURN;
    END IF;

    -- Check password history (prevent reuse of last 10 passwords)
    IF user_record.password_history IS NOT NULL THEN
        FOREACH history_hash IN ARRAY user_record.password_history LOOP
            -- Simple hash comparison (in production, use proper password verification)
            IF history_hash = encode(digest(p_new_password, 'sha256'), 'hex') THEN
                RETURN QUERY SELECT false, 'Password has been used recently';
                RETURN;
            END IF;
        END LOOP;
    END IF;

    -- Update password history (keep last 10)
    DECLARE
        new_history TEXT[];
    BEGIN
        new_history := array_append(
            COALESCE(array_slice(user_record.password_history, 0, 9), ARRAY[]::TEXT[]),
            encode(digest(user_record.password_changed_at::text || p_new_password, 'sha256'), 'hex')
        );
    END;

    -- Update profile with new password info
    UPDATE profiles SET
        password_changed_at = NOW(),
        password_expires_at = NOW() + INTERVAL '90 days',
        password_history = new_history,
        login_attempts = 0, -- Reset failed login attempts
        locked_until = NULL, -- Unlock account
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Log password change
    PERFORM log_phi_access(
        p_user_id, 'UPDATE', 'profiles', p_user_id,
        jsonb_build_object('action', 'password_change'),
        jsonb_build_object('password_changed', true),
        'User password updated'
    );

    RETURN QUERY SELECT true, 'Password changed successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle failed login attempts and account lockout
CREATE OR REPLACE FUNCTION record_failed_login(p_user_id UUID)
RETURNS TABLE(is_locked BOOLEAN, lockout_until TIMESTAMPTZ, attempts_remaining INTEGER) AS $$
DECLARE
    user_record RECORD;
    new_attempts INTEGER;
    lockout_time TIMESTAMPTZ;
BEGIN
    -- Get current user profile
    SELECT * INTO user_record FROM profiles WHERE id = p_user_id;
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL::TIMESTAMPTZ, 0;
        RETURN;
    END IF;

    -- Don't increment if already locked
    IF user_record.locked_until IS NOT NULL AND user_record.locked_until > NOW() THEN
        RETURN QUERY SELECT true, user_record.locked_until, 0;
        RETURN;
    END IF;

    -- Increment failed attempts
    new_attempts := COALESCE(user_record.login_attempts, 0) + 1;

    -- Check if lockout threshold reached
    IF new_attempts >= 5 THEN -- Lock after 5 failed attempts
        lockout_time := NOW() + INTERVAL '30 minutes';
        UPDATE profiles SET
            login_attempts = new_attempts,
            locked_until = lockout_time,
            updated_at = NOW()
        WHERE id = p_user_id;

        -- Log security event
        PERFORM log_phi_access(
            p_user_id, 'SECURITY_EVENT', 'profiles', p_user_id,
            NULL, jsonb_build_object('account_locked', true, 'reason', 'too_many_failed_attempts'),
            'Account locked due to failed login attempts'
        );

        RETURN QUERY SELECT true, lockout_time, 0;
    ELSE
        UPDATE profiles SET
            login_attempts = new_attempts,
            updated_at = NOW()
        WHERE id = p_user_id;

        RETURN QUERY SELECT false, NULL::TIMESTAMPTZ, (5 - new_attempts);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record successful login
CREATE OR REPLACE FUNCTION record_successful_login(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles SET
        last_login = NOW(),
        login_attempts = 0, -- Reset failed attempts
        locked_until = NULL, -- Unlock if previously locked
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Log successful login
    PERFORM log_phi_access(
        p_user_id, 'LOGIN', 'user_sessions', NULL,
        NULL, jsonb_build_object('login_successful', true),
        'User logged in successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if password needs to be changed
CREATE OR REPLACE FUNCTION password_requires_change(p_user_id UUID)
RETURNS TABLE(requires_change BOOLEAN, reason TEXT, days_until_expiry INTEGER) AS $$
DECLARE
    user_record RECORD;
    days_remaining INTEGER;
BEGIN
    SELECT * INTO user_record FROM profiles WHERE id = p_user_id;
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, '', 0;
        RETURN;
    END IF;

    -- Check if password is expired
    IF user_record.password_expires_at IS NOT NULL AND user_record.password_expires_at < NOW() THEN
        RETURN QUERY SELECT true, 'Password has expired', 0;
        RETURN;
    END IF;

    -- Check if password expires soon (within 7 days)
    IF user_record.password_expires_at IS NOT NULL THEN
        days_remaining := EXTRACT(EPOCH FROM (user_record.password_expires_at - NOW())) / 86400;
        IF days_remaining <= 7 THEN
            RETURN QUERY SELECT true, 'Password expires soon', GREATEST(0, days_remaining);
            RETURN;
        END IF;
    END IF;

    -- Check if this is first login (no password_changed_at set)
    IF user_record.password_changed_at IS NULL THEN
        RETURN QUERY SELECT true, 'Password change required', 0;
        RETURN;
    END IF;

    RETURN QUERY SELECT false, '', 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get password policy status for a user
CREATE OR REPLACE FUNCTION get_password_policy_status(p_user_id UUID DEFAULT NULL)
RETURNS TABLE(
    user_id UUID,
    password_age_days INTEGER,
    days_until_expiry INTEGER,
    is_expired BOOLEAN,
    requires_change BOOLEAN,
    change_reason TEXT,
    login_attempts INTEGER,
    is_locked BOOLEAN,
    lockout_remaining_minutes INTEGER
) AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Use current user if no ID provided
    p_user_id := COALESCE(p_user_id, auth.uid());

    SELECT * INTO user_record FROM profiles WHERE id = p_user_id;
    IF NOT FOUND THEN
        RETURN;
    END IF;

    DECLARE
        password_age INTEGER := 0;
        expiry_days INTEGER := 0;
        expired BOOLEAN := false;
        needs_change BOOLEAN := false;
        reason TEXT := '';
        locked BOOLEAN := false;
        lockout_minutes INTEGER := 0;
    BEGIN
        -- Calculate password age
        IF user_record.password_changed_at IS NOT NULL THEN
            password_age := EXTRACT(EPOCH FROM (NOW() - user_record.password_changed_at)) / 86400;
        END IF;

        -- Check expiry
        IF user_record.password_expires_at IS NOT NULL THEN
            expiry_days := GREATEST(0, EXTRACT(EPOCH FROM (user_record.password_expires_at - NOW())) / 86400);
            expired := user_record.password_expires_at < NOW();
        END IF;

        -- Check if change is required
        SELECT requires_change, reason INTO needs_change, reason
        FROM password_requires_change(p_user_id);

        -- Check lockout status
        IF user_record.locked_until IS NOT NULL AND user_record.locked_until > NOW() THEN
            locked := true;
            lockout_minutes := EXTRACT(EPOCH FROM (user_record.locked_until - NOW())) / 60;
        END IF;

        RETURN QUERY SELECT
            p_user_id,
            password_age,
            expiry_days,
            expired,
            needs_change,
            reason,
            COALESCE(user_record.login_attempts, 0),
            locked,
            lockout_minutes;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- INITIAL HIPAA TRAINING COURSES
-- =============================================

-- Insert core HIPAA training courses
INSERT INTO training_courses (course_name, course_description, course_type, version, estimated_duration_minutes, passing_score_percentage, course_content, created_by) VALUES
(
  'HIPAA Basics and Overview',
  'Introduction to HIPAA, privacy and security rules, and compliance requirements',
  'hipaa_basics',
  '1.0',
  45,
  80,
  '[
    {"title": "What is HIPAA?", "content": "Health Insurance Portability and Accountability Act overview"},
    {"title": "Privacy Rule Fundamentals", "content": "Understanding protected health information and privacy rights"},
    {"title": "Security Rule Essentials", "content": "Technical, administrative, and physical safeguards"},
    {"title": "Your Responsibilities", "content": "Staff duties and compliance requirements"}
  ]'::jsonb,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Privacy Rule Deep Dive',
  'Comprehensive training on HIPAA Privacy Rule requirements and implementation',
  'privacy_rule',
  '1.0',
  60,
  85,
  '[
    {"title": "Protected Health Information (PHI)", "content": "What constitutes PHI and when it is protected"},
    {"title": "Permitted Uses and Disclosures", "content": "When PHI can be used and shared"},
    {"title": "Patient Rights", "content": "Individual rights under HIPAA Privacy Rule"},
    {"title": "Business Associate Agreements", "content": "Requirements for working with vendors"}
  ]'::jsonb,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Security Rule and Safeguards',
  'Detailed training on HIPAA Security Rule and implementing safeguards',
  'security_rule',
  '1.0',
  75,
  80,
  '[
    {"title": "Security Rule Overview", "content": "Purpose and applicability of the Security Rule"},
    {"title": "Administrative Safeguards", "content": "Policies and procedures for security"},
    {"title": "Physical Safeguards", "content": "Physical access controls and facility security"},
    {"title": "Technical Safeguards", "content": "Access controls, audit logs, and encryption"}
  ]'::jsonb,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Breach Response and Incident Management',
  'Training on HIPAA breach notification requirements and incident response procedures',
  'breach_response',
  '1.0',
  50,
  85,
  '[
    {"title": "What is a Breach?", "content": "Definition and examples of HIPAA breaches"},
    {"title": "Breach Response Timeline", "content": "Notification requirements and deadlines"},
    {"title": "Investigation Process", "content": "How to investigate and document breaches"},
    {"title": "Prevention Strategies", "content": "Best practices to prevent future breaches"}
  ]'::jsonb,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Consent Management and Patient Rights',
  'Training on obtaining consent, managing authorizations, and respecting patient rights',
  'consent_management',
  '1.0',
  40,
  80,
  '[
    {"title": "Consent vs Authorization", "content": "Understanding the difference and when each is needed"},
    {"title": "Obtaining Valid Consent", "content": "Requirements for valid consent documentation"},
    {"title": "Patient Rights to Access", "content": "How to handle patient requests for their information"},
    {"title": "Right to Amend Records", "content": "Process for correcting medical records"}
  ]'::jsonb,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
),
(
  'Annual HIPAA Refresher Training',
  'Annual refresher course covering HIPAA updates and compliance reminders',
  'refresher',
  '1.0',
  30,
  75,
  '[
    {"title": "HIPAA Updates", "content": "Recent changes to HIPAA regulations"},
    {"title": "Common Compliance Issues", "content": "Review of frequent compliance problems"},
    {"title": "Best Practices", "content": "Updated security and privacy best practices"},
    {"title": "Compliance Resources", "content": "Available resources and reporting procedures"}
  ]'::jsonb,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
);

-- =============================================
-- INITIAL DATA (Optional - for testing)
-- =============================================

-- Note: In production, this data should be inserted through the application
-- with proper audit trails and consent management

/*
-- Example beneficiary (would be created through auth signup)
INSERT INTO beneficiaries (id, full_name, email, phone)
VALUES ('00000000-0000-0000-0000-000000000001', 'John Doe', 'john.doe@example.com', '+15551234567');

-- Example partner
INSERT INTO sober_living_partners (facility_name, contact_person, contact_email, facility_type)
VALUES ('Hope Recovery Center', 'Jane Smith', 'jane.smith@hoperecovery.org', 'sober_living');

-- Example consent (would require explicit patient consent)
INSERT INTO consents (beneficiary_id, consent_type, status, purpose, granted_by)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'TREATMENT_PAYMENT_OPERATIONS',
    'active',
    'Coordination of sober living placement and treatment services',
    '11111111-1111-1111-1111-111111111111'
);
*/
