-- SEO Analytics Database Schema for Colorado Rehab SEO

-- Main SEO analytics tracking table
CREATE TABLE seo_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  city TEXT NOT NULL,
  service TEXT NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0.00,
  position DECIMAL(5,2) DEFAULT 0.00,
  date DATE NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  competitor_rankings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword rankings tracking
CREATE TABLE keyword_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  position INTEGER NOT NULL,
  url TEXT NOT NULL,
  search_volume INTEGER DEFAULT 0,
  competition TEXT CHECK (competition IN ('low', 'medium', 'high')),
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content velocity tracking
CREATE TABLE content_velocity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pages_published INTEGER DEFAULT 0,
  pages_indexed INTEGER DEFAULT 0,
  indexing_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_time_to_index TEXT DEFAULT '0 days',
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core Web Vitals monitoring
CREATE TABLE core_web_vitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  lcp DECIMAL(5,2) DEFAULT 0.00, -- Largest Contentful Paint
  fid DECIMAL(5,2) DEFAULT 0.00, -- First Input Delay
  cls DECIMAL(5,2) DEFAULT 0.00, -- Cumulative Layout Shift
  fcp DECIMAL(5,2) DEFAULT 0.00, -- First Contentful Paint
  ttfb DECIMAL(5,2) DEFAULT 0.00, -- Time to First Byte
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitor analysis tracking
CREATE TABLE competitor_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  competitor_url TEXT NOT NULL,
  competitor_position INTEGER NOT NULL,
  our_position INTEGER NOT NULL,
  position_difference INTEGER GENERATED ALWAYS AS (competitor_position - our_position) STORED,
  analysis_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backlink tracking
CREATE TABLE backlinks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  anchor_text TEXT NOT NULL,
  domain_authority INTEGER DEFAULT 0,
  page_authority INTEGER DEFAULT 0,
  follow_type TEXT CHECK (follow_type IN ('follow', 'nofollow', 'sponsored')),
  discovered_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_seo_analytics_page_slug ON seo_analytics(page_slug);
CREATE INDEX idx_seo_analytics_city ON seo_analytics(city);
CREATE INDEX idx_seo_analytics_service ON seo_analytics(service);
CREATE INDEX idx_seo_analytics_date ON seo_analytics(date);
CREATE INDEX idx_keyword_rankings_keyword ON keyword_rankings(keyword);
CREATE INDEX idx_keyword_rankings_date ON keyword_rankings(date);
CREATE INDEX idx_competitor_analysis_keyword ON competitor_analysis(keyword);
CREATE INDEX idx_competitor_analysis_date ON competitor_analysis(analysis_date);
CREATE INDEX idx_backlinks_target_url ON backlinks(target_url);
CREATE INDEX idx_backlinks_domain_authority ON backlinks(domain_authority);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_seo_analytics_updated_at BEFORE UPDATE ON seo_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_keyword_rankings_updated_at BEFORE UPDATE ON keyword_rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for Colorado rehab keywords
INSERT INTO keyword_rankings (keyword, position, url, search_volume, competition, trend, date) VALUES
('colorado detox centers', 8, 'https://metzlercares.org/seo/denver-detox-colorado-detox-centers', 2400, 'medium', 'up', CURRENT_DATE),
('denver drug rehab', 12, 'https://metzlercares.org/seo/denver-rehab-denver-drug-rehab', 1800, 'high', 'stable', CURRENT_DATE),
('colorado springs sober living', 5, 'https://metzlercares.org/seo/colorado-springs-sober-living-colorado-sober-living', 900, 'low', 'up', CURRENT_DATE),
('boulder addiction treatment', 15, 'https://metzlercares.org/seo/boulder-rehab-boulder-addiction-treatment', 1200, 'medium', 'down', CURRENT_DATE),
('fort collins detox', 3, 'https://metzlercares.org/seo/fort-collins-detox-fort-collins-detox', 600, 'low', 'up', CURRENT_DATE);

-- Insert sample competitor analysis data
INSERT INTO competitor_analysis (keyword, competitor_url, competitor_position, our_position, analysis_date) VALUES
('colorado detox centers', 'https://ripoffreport.com/detox-colorado', 3, 8, CURRENT_DATE),
('colorado detox centers', 'https://medium.com/colorado-detox-guide', 7, 8, CURRENT_DATE),
('denver drug rehab', 'https://rehabs.com/denver', 2, 12, CURRENT_DATE),
('denver drug rehab', 'https://addictioncenter.com/denver-rehab', 5, 12, CURRENT_DATE),
('colorado springs sober living', 'https://ripoffreport.com/sober-living-colorado-springs', 1, 5, CURRENT_DATE);