# MetzlerCares Website Index
Complete inventory of all pages, dashboards, and SEO pages with URLs and purposes.

## Table of Contents
1. [Public Pages](#public-pages)
2. [Application & User Pages](#application--user-pages)
3. [Dashboards](#dashboards)
4. [SEO Pages](#seo-pages)
5. [Dynamic City Pages](#dynamic-city-pages)
6. [Dynamic Treatment Pages](#dynamic-treatment-pages)
7. [Resource Pages](#resource-pages)
8. [Authentication Pages](#authentication-pages)
9. [Legal & Policy Pages](#legal--policy-pages)
10. [API Endpoints](#api-endpoints)
11. [System Pages](#system-pages)

---

## Public Pages

### Homepage
- **URL:** `/`
- **Purpose:** Main landing page introducing Metzler Foundations, featuring peer coaching, rent assistance, and transition support services. Includes CTAs for "Get Support" and "For Facilities".

### About
- **URL:** `/about`
- **Purpose:** Information about Metzler Foundations organization, mission, and values.

### Contact
- **URL:** `/contact`
- **Purpose:** Contact form and information for reaching Metzler Foundations.

### Impact
- **URL:** `/impact`
- **Purpose:** Showcases the organization's impact, success stories, and outcomes from recovery support programs.

### Stories
- **URL:** `/stories`
- **Purpose:** Collection of recovery success stories and testimonials from beneficiaries.

### Get Help
- **URL:** `/get-help`
- **Purpose:** Information page directing users to crisis resources and immediate help options.

### Crisis Resources
- **URL:** `/crisis`
- **Purpose:** Emergency crisis resources, hotlines, and immediate support information for individuals in crisis.

### Donate
- **URL:** `/donate`
- **Purpose:** Donation page for supporters to contribute financially to Metzler Foundations.

### Give Support
- **URL:** `/give-support`
- **Purpose:** Information page for donors and supporters about how to contribute and support the organization.

### Scholarships
- **URL:** `/scholarships`
- **Purpose:** Information about scholarship programs available for recovery housing and treatment.

### Partners
- **URL:** `/partners`
- **Purpose:** Information for treatment facilities and sober living homes interested in partnering with Metzler Foundations. Includes partnership application form.

### Partner Portal
- **URL:** `/partner-portal`
- **Purpose:** Entry point for partner facilities to access their portal (requires authentication).

### Partner Update
- **URL:** `/partner-update/[token]`
- **Purpose:** Secure token-based page for partners to update their facility information without logging in.

### Partner Update Resend
- **URL:** `/partner-update/resend`
- **Purpose:** Page for partners to request a new update token if theirs expired.

### Partner Update Success
- **URL:** `/partner-update/success`
- **Purpose:** Confirmation page after partner successfully updates their information.

### FAQ
- **URL:** `/faq`
- **Purpose:** General frequently asked questions about Metzler Foundations services.

### FAQ - Sober Living
- **URL:** `/faq/sober-living`
- **Purpose:** Specific FAQ page focused on sober living questions and answers.

### Guides - Sober Living Colorado
- **URL:** `/guides/sober-living-colorado`
- **Purpose:** Comprehensive guide about sober living options in Colorado.

### Guides - Consumer Protection
- **URL:** `/guides/consumer-protection`
- **Purpose:** Educational content about consumer protection in addiction treatment and recovery services.

### Guides - Scholarship Pathways
- **URL:** `/guides/scholarship-pathways`
- **Purpose:** Guide explaining scholarship application processes and pathways.

### Colorado Recovery
- **URL:** `/colorado-recovery`
- **Purpose:** Overview page for Colorado recovery services.

### Denver Recovery
- **URL:** `/denver-recovery`
- **Purpose:** Denver-specific recovery services information page.

### Colorado Springs Recovery
- **URL:** `/colorado-springs-recovery`
- **Purpose:** Colorado Springs-specific recovery services information page.

### Age Verification
- **URL:** `/age-verification`
- **Purpose:** Age verification page for age-restricted content or services.

### Accessibility
- **URL:** `/accessibility`
- **Purpose:** Accessibility statement and information about website accessibility features.

---

## Application & User Pages

### Get Aid (Landing)
- **URL:** `/get-aid`
- **Purpose:** Landing page for individuals seeking financial aid and support services.

### Get Aid - Apply
- **URL:** `/get-aid/apply`
- **Purpose:** Application form for beneficiaries to request housing aid, rent assistance, and recovery support.

### Get Aid - Success
- **URL:** `/get-aid/success`
- **Purpose:** Confirmation page after successful application submission.

### App - Apply
- **URL:** `/app/apply`
- **Purpose:** Alternative application pathway for beneficiaries (requires authentication).

### App - Success
- **URL:** `/app/success`
- **Purpose:** Success confirmation after application submission through app route.

### E-Sign Consent
- **URL:** `/esign/[id]`
- **Purpose:** Electronic signature page for consent forms and agreements.

### Dashboard (User-Specific)
- **URL:** `/dashboard/[userId]`
- **Purpose:** Individual user dashboard (legacy route, may redirect to app dashboard).

---

## Dashboards

### Beneficiary Portal
- **URL:** `/portal`
- **Purpose:** Main dashboard for beneficiaries to view their applications, consents, and support services. Protected route requiring beneficiary authentication.

### Beneficiary Portal - Privacy
- **URL:** `/portal/privacy`
- **Purpose:** Privacy information and settings for beneficiaries within their portal.

### App Dashboard
- **URL:** `/app/dashboard`
- **Purpose:** Authenticated dashboard for beneficiaries showing their profile, applications, consents, and application status.

### Staff Dashboard
- **URL:** `/staff-dashboard`
- **Purpose:** Main staff dashboard showing pending applications, disbursements ready, recent applications, and SLA breach tracking. Requires staff role authentication.

### Staff Dashboard - Applications CSV Export
- **URL:** `/staff-dashboard/applications.csv`
- **Purpose:** API endpoint to export applications data as CSV for staff use.

### Staff Operations Dashboard
- **URL:** `/operations`
- **Purpose:** Staff operations dashboard for managing day-to-day operations and workflows.

### Staff Operations - Outcomes
- **URL:** `/operations/outcomes`
- **Purpose:** Staff page for tracking and managing outcome data and reporting.

### Staff Operations - Outcomes CSV Export
- **URL:** `/operations/outcomes.csv`
- **Purpose:** API endpoint to export outcomes data as CSV.

### Staff Application Detail
- **URL:** `/application/[id]`
- **Purpose:** Detailed view of a specific application for staff review and processing.

### Staff Kanban Board
- **URL:** `/staff/kanban/[id]`
- **Purpose:** Kanban board view for staff to manage applications workflow (specific board ID).

### Staff SEO Analytics
- **URL:** `/staff/seo-analytics`
- **Purpose:** Staff dashboard for viewing SEO analytics and performance metrics.

### Staff Security
- **URL:** `/staff/security`
- **Purpose:** Security settings and information page for staff members.

### Staff Training
- **URL:** `/staff/training`
- **Purpose:** Training resources and materials for staff members.

### Donor Dashboard
- **URL:** `/donor-dashboard`
- **Purpose:** Dashboard for donors showing their giving history, total giving, individuals housed, giving frequency, and impact stories. Requires donor role authentication.

### Donor Dashboard (Nested)
- **URL:** `/donor-dashboard/dashboard`
- **Purpose:** Alternative donor dashboard route (nested structure).

### Partners Dashboard
- **URL:** `/partners/dashboard`
- **Purpose:** Dashboard for partner facilities showing their facilities, occupancy stats, applications, recent payments, and facility management tools. Requires partner authentication.

### SEO Dashboard
- **URL:** `/seo-dashboard`
- **Purpose:** Administrative dashboard for managing SEO content generation, bulk indexing, and SEO automation features.

---

## SEO Pages

### SEO Page Generator (Dynamic)
- **URL:** `/seo/[slug]`
- **Purpose:** Dynamically generated SEO pages targeting specific keywords and city-service combinations. Generated by `seoPageGenerator` utility.

**Generated SEO Pages Include:**
- City-specific detox pages (e.g., `denver-detox-colorado-detox-centers`, `denver-detox-colorado-alcohol-detox`)
- City-specific rehab pages (e.g., `denver-rehab-colorado-drug-rehab`, `denver-rehab-colorado-inpatient-rehab`)
- City-specific sober living pages (e.g., `denver-sober-living-colorado-sober-living`)
- Competitor-gap pages (e.g., `colorado-rehab-scams-to-avoid`, `colorado-detox-center-complaints`, `colorado-treatment-center-lawsuits`)
- Informational pages (e.g., `colorado-addiction-recovery-journey`, `colorado-substance-abuse-statistics`, `colorado-recovery-success-stories`)

**SEO Page Generation Formula:**
- **Cities:** 4 (Denver, Colorado Springs, Fort Collins, Pueblo)
- **Service Types:** detox (2 clusters), rehab (2 clusters), sober-living (1 cluster), competitor-gap (2 clusters)
- **Total SEO Pages:** ~4 cities × (2+2+1+2) clusters = ~28 base SEO pages + 3 informational pages = **~31 SEO pages**

**Note:** These pages are generated programmatically for each city in `COLORADO_LOCATIONS` combined with service types and keyword clusters from `COLORADO_REHAB_KEYWORD_CLUSTERS`. Each page targets specific keywords and competitor gaps.

---

## Dynamic City Pages

### Colorado Recovery Services Overview
- **URL:** `/co`
- **Purpose:** Comprehensive directory and overview of recovery services across Colorado, including all cities, counties, and service types.

### City-Specific Recovery Services
- **URL:** `/co/[city]`
- **Purpose:** City-specific recovery services page with local information, nearby services, and city-specific content. Generated dynamically for each city in `COLORADO_LOCATIONS`.

**Available Cities:**
- `/co/denver` - Denver recovery services
- `/co/colorado-springs` - Colorado Springs recovery services
- `/co/fort-collins` - Fort Collins recovery services
- `/co/pueblo` - Pueblo recovery services

**Note:** Pages are generated dynamically using `seoGenerator.generateCityContent()` with location data from `colorado-seo-data.ts`.

---

## Dynamic Treatment Pages

### City + Treatment Type Pages
- **URL:** `/co/[city]/[treatment]`
- **Purpose:** City-specific treatment type pages (e.g., sober-living, detox, rehab, outpatient, aftercare) with detailed service information.

**Treatment Types:**
- `sober-living` - Sober living homes and recovery housing
- `detox` - Medical detoxification services
- `rehab` - Addiction treatment programs
- `outpatient` - Outpatient treatment programs
- `aftercare` - Aftercare and continuing care services

**Example URLs:**
- `/co/denver/sober-living`
- `/co/colorado-springs/detox`
- `/co/fort-collins/rehab`
- `/co/pueblo/outpatient`

**Note:** These pages are generated dynamically using SEO templates from `SEO_TEMPLATES` in `colorado-seo-data.ts`.

---

## Resource Pages

### Colorado Resources Hub
- **URL:** `/resources/colorado`
- **Purpose:** Main hub page for Colorado recovery resources, treatment centers, and support services.

### Colorado Detox Resources
- **URL:** `/resources/colorado-detox`
- **Purpose:** Comprehensive resource page listing detox centers and medical detox services in Colorado.

### Colorado Rehab Resources
- **URL:** `/resources/colorado-rehab`
- **Purpose:** Resource page listing addiction treatment centers and rehab programs in Colorado.

### Colorado Sober Living Resources
- **URL:** `/resources/colorado-sober-living`
- **Purpose:** Resource page listing sober living homes and recovery housing options in Colorado.

### Dynamic Resource Pages (Sanity CMS)
- **URL:** `/resources/[slug]`
- **Purpose:** Dynamically generated resource pages from Sanity CMS pillar pages. Content managed through Sanity Studio.

---

## Authentication Pages

### Login
- **URL:** `/auth/login`
- **Purpose:** User login page for beneficiaries, staff, donors, and partners.

### Donor Login
- **URL:** `/login` (under donor layout)
- **Purpose:** Specific login page for donors (within donor layout group).

### Forgot Password
- **URL:** `/auth/forgot-password`
- **Purpose:** Password reset request page for users who forgot their password.

### Reset Password
- **URL:** `/auth/reset-password`
- **Purpose:** Password reset form page (accessed via reset token link).

### Verify Email
- **URL:** `/auth/verify-email`
- **Purpose:** Email verification page for new user registrations.

### Account - MFA
- **URL:** `/account/mfa`
- **Purpose:** Multi-factor authentication setup and management page.

### Account - Password
- **URL:** `/account/password`
- **Purpose:** Account password change page for authenticated users.

---

## Legal & Policy Pages

### Privacy Policy
- **URL:** `/privacy`
- **Purpose:** Privacy policy page explaining data collection and usage.

### Privacy Policy (Server)
- **URL:** `/privacy-policy`
- **Purpose:** Alternative privacy policy route (server-rendered version).

### Terms and Conditions
- **URL:** `/terms`
- **Purpose:** Terms and conditions page.

### Terms and Conditions (Server)
- **URL:** `/terms-and-conditions`
- **Purpose:** Alternative terms route (server-rendered version).

### Cookie Policy
- **URL:** `/cookie-policy`
- **Purpose:** Cookie policy and cookie usage information.

### DMCA
- **URL:** `/dmca`
- **Purpose:** DMCA (Digital Millennium Copyright Act) takedown policy and procedures.

---

## Insurance Pages

### Insurance Provider Pages (Dynamic)
- **URL:** `/insurance/[provider]`
- **Purpose:** Insurance provider-specific pages with information about coverage, verification, and accepted insurance types.

**Available Providers:**
- `/insurance/aetna`
- `/insurance/blue-cross-blue-shield`
- `/insurance/kaiser`
- `/insurance/cigna`
- `/insurance/unitedhealthcare`
- `/insurance/medicaid`

---

## API Endpoints

### Analytics Tracking
- **URL:** `/api/analytics/track`
- **Method:** POST
- **Purpose:** Endpoint for tracking user analytics and events.

### Auth - Login
- **URL:** `/api/auth/login`
- **Method:** POST
- **Purpose:** Authentication endpoint for user login.

### Facilities API
- **URL:** `/api/facilities`
- **Method:** GET, POST
- **Purpose:** API for retrieving and creating facility data.

### Facility by ID
- **URL:** `/api/facilities/[id]`
- **Method:** GET
- **Purpose:** Retrieve specific facility information by ID.

### Insurance Verification
- **URL:** `/api/insurance/verify`
- **Method:** POST
- **Purpose:** API endpoint for verifying insurance coverage.

### SEO API
- **URL:** `/api/seo`
- **Method:** GET, POST
- **Purpose:** API for SEO content generation and management.

### SEO Analytics
- **URL:** `/api/seo/analytics`
- **Method:** GET
- **Purpose:** API endpoint for retrieving SEO analytics data.

### SEO Ping
- **URL:** `/api/seo/ping`
- **Method:** GET, POST
- **Purpose:** Health check and ping endpoint for SEO services.

### SEO Rapid Index
- **URL:** `/api/seo/rapid-index`
- **Method:** GET, POST
- **Purpose:** API for triggering rapid indexing of SEO pages.

### Blog Search (Disabled)
- **URL:** `/api/blog/search`
- **Status:** Disabled
- **Purpose:** Blog search API endpoint (currently disabled).

### Blog (Disabled)
- **URL:** `/api/blog`
- **Status:** Disabled
- **Purpose:** Blog API endpoint (currently disabled).

### E-Sign Consent (Disabled)
- **URL:** `/api/esign/consent`
- **Status:** Disabled
- **Purpose:** E-signature consent API (currently disabled).

---

## System Pages

### Robots.txt
- **URL:** `/robots.txt`
- **Purpose:** Search engine crawler instructions and sitemap location.

### Sitemap.xml
- **URL:** `/sitemap.xml`
- **Purpose:** XML sitemap for search engines listing all public pages, SEO pages, and dynamic routes.

### Health Check
- **URL:** `/health`
- **Method:** GET
- **Purpose:** Health check endpoint for monitoring and uptime checks.

### Error Page
- **URL:** `+error.svelte` (handles all errors)
- **Purpose:** Global error page displayed for 404, 500, and other error states.

### Unauthorized
- **URL:** `/unauthorized`
- **Purpose:** Error page displayed when users attempt to access restricted content without proper permissions.

---

## Layout Groups

### Beneficiary Layout Group
- **Route Prefix:** `(beneficiary)/`
- **Pages:** `/portal/*`
- **Purpose:** Layout wrapper for beneficiary-specific pages with authentication checks.

### Donor Layout Group
- **Route Prefix:** `(donor)/`
- **Pages:** `/donor-dashboard/*`, `/login`
- **Purpose:** Layout wrapper for donor-specific pages with authentication checks.

### Partner Layout Group
- **Route Prefix:** `(partner)/`
- **Pages:** Partner portal pages
- **Purpose:** Layout wrapper for partner-specific pages with authentication checks.

### Staff Layout Group
- **Route Prefix:** `(staff)/`
- **Pages:** `/staff-dashboard/*`, `/operations/*`, `/application/*`, `/dashboard`
- **Purpose:** Layout wrapper for staff-specific pages with authentication and role checks.

---

## Summary Statistics

- **Total Static Pages:** ~40+
- **Dynamic SEO Pages:** ~31 pages (generated from 4 cities × 7 keyword clusters + 3 informational pages)
- **City Pages:** 4 (Denver, Colorado Springs, Fort Collins, Pueblo)
- **Treatment Type Pages:** 5 types × 4 cities = 20 pages
- **Dashboards:** 7 unique dashboards
- **API Endpoints:** 15+ endpoints
- **Resource Pages:** 4+ static + dynamic Sanity CMS pages
- **Insurance Pages:** 6 provider pages
- **Total Estimated Pages:** ~100+ unique URLs

---

## Notes

1. **Dynamic Content:** Many pages are generated programmatically using SEO generators (`seoPageGenerator`, `seoGenerator`) and data from `colorado-seo-data.ts`.

2. **Authentication Required:** Dashboards and portal pages require authentication and specific user roles (beneficiary, staff, donor, partner).

3. **SEO Strategy:** The site uses a comprehensive SEO strategy with:
   - City-specific pages for major Colorado cities
   - Service-specific pages (detox, rehab, sober-living, aftercare)
   - Competitor-gap targeting pages
   - Informational content pages

4. **CMS Integration:** Resource pages (`/resources/[slug]`) are managed through Sanity CMS.

5. **Disabled Endpoints:** Some API endpoints are currently disabled (blog, e-sign) but remain in codebase.

6. **Layout Groups:** SvelteKit layout groups (`(beneficiary)`, `(donor)`, `(staff)`, `(partner)`) provide route-level authentication and layout wrapping.

---

*Last Updated: Generated from codebase analysis*
*Base URL: https://metzlercares.com*
