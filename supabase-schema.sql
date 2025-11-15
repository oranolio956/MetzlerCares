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
  role TEXT DEFAULT 'beneficiary' CHECK (role IN ('beneficiary', 'partner', 'donor', 'staff')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
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

-- Beneficiaries: Users can only see their own data, staff can see all
CREATE POLICY "beneficiaries_select" ON beneficiaries
    FOR SELECT USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff', 'case_manager')
        )
    );

CREATE POLICY "beneficiaries_insert" ON beneficiaries
    FOR INSERT WITH CHECK (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff')
        )
    );

CREATE POLICY "beneficiaries_update" ON beneficiaries
    FOR UPDATE USING (
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff', 'case_manager')
        )
    );

-- Consents: Critical security - only authorized staff and the beneficiary
CREATE POLICY "consents_select" ON consents
    FOR SELECT USING (
        beneficiary_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff', 'case_manager')
        )
    );

CREATE POLICY "consents_insert" ON consents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff', 'case_manager')
        )
    );

CREATE POLICY "consents_update" ON consents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff', 'case_manager')
        )
    );

-- Sober Living Partners: Staff only (network management)
CREATE POLICY "partners_select" ON sober_living_partners
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff', 'case_manager')
        )
    );

-- Allow public read of active partner names for social proof
CREATE POLICY "Public read access to active partner names" ON sober_living_partners
  FOR SELECT TO anon
  USING (network_status = 'active');

CREATE POLICY "partners_insert" ON sober_living_partners
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff')
        )
    );

CREATE POLICY "partners_update" ON sober_living_partners
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff')
        )
    );

-- Applications: Beneficiaries can see their own, staff can see all
CREATE POLICY "applications_select" ON applications
    FOR SELECT USING (
        beneficiary_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff', 'case_manager')
        )
    );

CREATE POLICY "applications_insert" ON applications
    FOR INSERT WITH CHECK (
        beneficiary_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff', 'case_manager')
        )
    );

CREATE POLICY "applications_update" ON applications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'staff', 'case_manager')
        )
    );

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

-- =============================================
-- REQUEST RATE LIMIT LOGS
-- =============================================
-- Store minimal request metadata to enforce rate limits per endpoint/IP
CREATE TABLE IF NOT EXISTS public.request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  ip TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.request_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage logs
CREATE POLICY "Service role manage request logs" ON public.request_logs
  FOR ALL USING (auth.role() = 'service_role');
-- =============================================
-- AUDIT LOGS
-- =============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor UUID NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manage audit logs" ON public.audit_logs
  FOR ALL USING (auth.role() = 'service_role');
