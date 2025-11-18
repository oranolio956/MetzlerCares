-- MetzlerCares Database Schema
-- Comprehensive schema for conversion-focused landing page system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table with persona-based segmentation
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    persona_type VARCHAR(50) NOT NULL CHECK (persona_type IN ('crisis', 'family', 'post-rehab', 'partner')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    insurance_provider VARCHAR(255),
    insurance_member_id VARCHAR(255),
    insurance_verified BOOLEAN DEFAULT false,
    recovery_start_date DATE,
    partner_code VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversion events tracking for analytics
CREATE TABLE conversion_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    persona VARCHAR(50) NOT NULL,
    page_url VARCHAR(500),
    referrer_url VARCHAR(500),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatment facilities and sober living homes
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    facility_type VARCHAR(50) NOT NULL CHECK (facility_type IN ('rehab', 'sober-living', 'detox', 'outpatient')),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    phone VARCHAR(20),
    website VARCHAR(500),
    email VARCHAR(255),
    accepts_medicaid BOOLEAN DEFAULT false,
    accepts_medicare BOOLEAN DEFAULT false,
    private_insurance_accepted TEXT[],
    accreditation TEXT[],
    specialties TEXT[],
    amenities TEXT[],
    success_rate DECIMAL(5,2),
    average_cost_range VARCHAR(100),
    bed_capacity INTEGER,
    current_availability INTEGER,
    average_wait_time_days INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partner organizations and referral sources
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    access_code VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    partner_type VARCHAR(50) NOT NULL CHECK (partner_type IN ('treatment-center', 'therapist', 'interventionist', 'sober-living', 'other')),
    commission_rate DECIMAL(5,2) DEFAULT 0.00,
    referral_count INTEGER DEFAULT 0,
    successful_admissions INTEGER DEFAULT 0,
    total_earned DECIMAL(10,2) DEFAULT 0.00,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referral tracking system
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referral_code VARCHAR(100) UNIQUE NOT NULL,
    referrer_user_id UUID REFERENCES users(id),
    partner_id UUID REFERENCES partners(id),
    client_first_name VARCHAR(100),
    client_last_name VARCHAR(100),
    client_phone VARCHAR(20),
    client_email VARCHAR(255),
    client_insurance_provider VARCHAR(255),
    preferred_facility_type VARCHAR(50),
    urgency_level VARCHAR(20) CHECK (urgency_level IN ('immediate', 'within-week', 'within-month', 'exploring')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'assessed', 'admitted', 'completed', 'declined')),
    admitted_to_facility_id UUID REFERENCES facilities(id),
    referral_date DATE DEFAULT CURRENT_DATE,
    admission_date DATE,
    completion_date DATE,
    commission_earned DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievement and gamification system
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    badge_icon VARCHAR(100),
    badge_color VARCHAR(50),
    points_awarded INTEGER DEFAULT 0,
    criteria_type VARCHAR(50) NOT NULL,
    criteria_value INTEGER NOT NULL,
    achievement_category VARCHAR(50) CHECK (achievement_category IN ('recovery', 'community', 'referral', 'engagement')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements earned
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    achievement_id UUID REFERENCES achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_percentage INTEGER DEFAULT 100,
    metadata JSONB DEFAULT '{}'
);

-- Recovery progress tracking
CREATE TABLE recovery_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    milestone_type VARCHAR(100) NOT NULL,
    milestone_name VARCHAR(255) NOT NULL,
    current_value INTEGER DEFAULT 0,
    target_value INTEGER NOT NULL,
    unit VARCHAR(50),
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    celebration_shown BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recovery buddy matching
CREATE TABLE buddy_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    buddy_user_id UUID REFERENCES users(id),
    connection_status VARCHAR(50) DEFAULT 'pending' CHECK (connection_status IN ('pending', 'accepted', 'declined', 'blocked')),
    connection_strength INTEGER DEFAULT 1 CHECK (connection_strength BETWEEN 1 AND 10),
    shared_goals TEXT[],
    last_interaction TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance verification cache for performance
CREATE TABLE insurance_verification_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name VARCHAR(255) NOT NULL,
    member_id_hash VARCHAR(255) NOT NULL,
    coverage_data JSONB NOT NULL,
    verification_status VARCHAR(50) NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bed availability real-time tracking
CREATE TABLE bed_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES facilities(id),
    facility_type VARCHAR(50) NOT NULL,
    total_beds INTEGER NOT NULL,
    occupied_beds INTEGER DEFAULT 0,
    available_beds INTEGER GENERATED ALWAYS AS (total_beds - occupied_beds) STORED,
    reserved_beds INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by VARCHAR(255),
    UNIQUE(facility_id, facility_type)
);

-- Urgency indicators and scarcity data
CREATE TABLE urgency_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indicator_type VARCHAR(50) NOT NULL,
    facility_id UUID REFERENCES facilities(id),
    message_text VARCHAR(500),
    urgency_level INTEGER CHECK (urgency_level BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT true,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Page performance and SEO tracking
CREATE TABLE page_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_url VARCHAR(500) NOT NULL,
    page_type VARCHAR(100) NOT NULL,
    load_time_ms INTEGER,
    core_web_vitals JSONB,
    conversion_rate DECIMAL(5,4),
    bounce_rate DECIMAL(5,4),
    avg_session_duration INTEGER,
    mobile_traffic_percentage DECIMAL(5,2),
    tracking_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance optimization
CREATE INDEX idx_users_persona ON users(persona_type);
CREATE INDEX idx_users_partner_code ON users(partner_code);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_conversion_events_user_id ON conversion_events(user_id);
CREATE INDEX idx_conversion_events_created_at ON conversion_events(created_at DESC);
CREATE INDEX idx_conversion_events_event_type ON conversion_events(event_type);
CREATE INDEX idx_referrals_partner_id ON referrals(partner_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_referral_code ON referrals(referral_code);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_recovery_milestones_user_id ON recovery_milestones(user_id);
CREATE INDEX idx_buddy_connections_user_id ON buddy_connections(user_id);
CREATE INDEX idx_bed_availability_facility ON bed_availability(facility_id);
CREATE INDEX idx_insurance_cache_provider ON insurance_verification_cache(provider_name, member_id_hash);

-- Grant permissions for Supabase RLS
GRANT SELECT ON ALL TABLES TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES TO authenticated;

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE recovery_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_connections ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY users_own_data ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY conversion_events_own_data ON conversion_events FOR ALL USING (user_id = auth.uid());
CREATE POLICY user_achievements_own_data ON user_achievements FOR ALL USING (user_id = auth.uid());
CREATE POLICY recovery_milestones_own_data ON recovery_milestones FOR ALL USING (user_id = auth.uid());
CREATE POLICY buddy_connections_own_data ON buddy_connections FOR ALL USING (user_id = auth.uid() OR buddy_user_id = auth.uid());

-- Partners can access their own referral data
CREATE POLICY referrals_partner_access ON referrals FOR ALL USING (
    partner_id IN (
        SELECT id FROM partners WHERE access_code = current_setting('app.partner_code', true)
    )
);

-- Public read access for facilities and bed availability
CREATE POLICY facilities_public_read ON facilities FOR SELECT USING (is_active = true);
CREATE POLICY bed_availability_public_read ON bed_availability FOR SELECT USING (true);
CREATE POLICY urgency_indicators_public_read ON urgency_indicators FOR SELECT USING (is_active = true AND (end_time IS NULL OR end_time > NOW()));

-- Insert default achievements
INSERT INTO achievements (name, description, badge_icon, badge_color, points_awarded, criteria_type, criteria_value, achievement_category) VALUES
('First Step', 'Complete your first recovery milestone', 'star', 'gold', 10, 'milestone_completed', 1, 'recovery'),
('Week Warrior', 'Stay sober for 7 days', 'calendar-week', 'green', 25, 'sober_days', 7, 'recovery'),
('Month Master', 'Stay sober for 30 days', 'calendar-month', 'blue', 50, 'sober_days', 30, 'recovery'),
('Helper Hero', 'Refer 3 people to treatment', 'hands-helping', 'purple', 30, 'referrals_made', 3, 'referral'),
('Community Champion', 'Connect with 5 recovery buddies', 'users', 'orange', 40, 'buddy_connections', 5, 'community'),
('Engagement Expert', 'Complete 10 engagement activities', 'trophy', 'red', 35, 'engagement_activities', 10, 'engagement');

-- Insert sample facilities (Colorado rehab centers)
INSERT INTO facilities (name, facility_type, address, city, state, zip_code, phone, accepts_medicaid, accepts_medicare, bed_capacity, current_availability, specialties) VALUES
('Denver Recovery Center', 'rehab', '123 Main St', 'Denver', 'CO', '80202', '(303) 555-0101', true, true, 50, 3, ARRAY['alcohol', 'drugs', 'dual-diagnosis']),
('Boulder Sober Living', 'sober-living', '456 Pine St', 'Boulder', 'CO', '80301', '(303) 555-0102', false, false, 20, 5, ARRAY['sober-living', 'aftercare']),
('Colorado Springs Treatment', 'rehab', '789 Oak Ave', 'Colorado Springs', 'CO', '80901', '(719) 555-0103', true, false, 35, 1, ARRAY['drugs', 'alcohol', 'outpatient']),
('Fort Collins Recovery House', 'sober-living', '321 Elm St', 'Fort Collins', 'CO', '80521', '(970) 555-0104', false, false, 15, 2, ARRAY['sober-living', 'peer-support']),
('Aurora Detox Center', 'detox', '654 Maple Dr', 'Aurora', 'CO', '80010', '(303) 555-0105', true, true, 25, 0, ARRAY['detox', 'medical']);

-- Insert sample partners
INSERT INTO partners (company_name, contact_person, access_code, email, partner_type, commission_rate) VALUES
('Colorado Intervention Services', 'Sarah Johnson', 'CIS2024', 'sarah@cointerventions.com', 'interventionist', 10.00),
('Rocky Mountain Therapy', 'Mike Chen', 'RMT2024', 'mike@rmtherapy.com', 'therapist', 8.00),
('Denver Sober Living Network', 'Lisa Rodriguez', 'DSLN2024', 'lisa@denversln.org', 'sober-living', 12.00);

-- Insert urgency indicators
INSERT INTO urgency_indicators (indicator_type, facility_id, message_text, urgency_level, end_time) VALUES
('bed_availability', (SELECT id FROM facilities WHERE name = 'Denver Recovery Center'), 'Only 3 beds available - Same-day admission possible', 5, NOW() + INTERVAL '24 hours'),
('bed_availability', (SELECT id FROM facilities WHERE name = 'Colorado Springs Treatment'), '1 bed remaining - Call now', 5, NOW() + INTERVAL '12 hours'),
('general_urgency', NULL, 'Addiction doesn''t wait - Get help now', 4, NOW() + INTERVAL '7 days');