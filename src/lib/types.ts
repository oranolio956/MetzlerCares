// TypeScript type definitions for MetzlerCares application

export interface Beneficiary {
  id: string
  full_name: string
  email: string
  phone?: string
  created_at: string
  updated_at?: string
}

export interface User {
  id: string
  email?: string
  created_at: string
  updated_at?: string
  [key: string]: any // Allow additional Supabase properties
}

export interface SoberLivingPartner {
  id: string
  facility_name: string
  address_city: string
  address_state: string
  contact_email: string
  contact_phone?: string
}

export interface Application {
  id: string
  beneficiary_id?: string
  partner_id?: string
  sober_living_partners?: SoberLivingPartner[]
  partner?: Partner
  status: 'pending' | 'approved' | 'funded' | 'rejected' | 'cancelled'
  amount_requested?: number
  preferred_start_date?: string
  special_requirements?: string
  payment_date?: string
  created_at: string
  updated_at?: string
  beneficiaries?: Beneficiary[] // For staff dashboard queries
  rejection_reason?: string
  [key: string]: any // Allow additional properties
}

export interface Partner {
  id: string
  organization_name?: string
  facility_name?: string
  contact_email: string
  contact_phone?: string
  address?: string
  created_at: string
  updated_at?: string
  [key: string]: any // Allow additional properties
}

export interface Consent {
  id: string
  beneficiary_id: string
  consent_type?: string
  type: 'TPO' | 'Fundraising_Contact' | 'Research' | 'Emergency_Contact'
  status?: string
  purpose?: string
  granted: boolean
  granted_at?: string
  expires_at?: string
  revoked_at?: string
  created_at: string
  updated_at?: string
  [key: string]: any // Allow additional properties
}

export interface KPIMetrics {
  applications_pending: number
  beneficiaries_housed: number
  '90_day_success_rate': number
  revenue_last_30d: number
  expenses_last_30d: number
  net_operational_balance: number
  new_recurring_donors_month: number
  donor_retention_rate: number
}

export interface ImpactMetrics {
  // Live calculation metrics from RPC
  total_beneficiaries_served: number
  total_funds_disbursed_usd: number
  average_approval_time_minutes: number
  total_applications_processed: number
  funded_applications_count: number
  success_rate_percentage: number
  last_updated: string
  // Legacy fields (keeping for compatibility)
  total_beneficiaries?: number
  success_rate?: number
  average_housing_time?: number
  partners_supported?: number
  total_funds_distributed?: number
  [key: string]: any
}

export interface Resource {
  id: string
  title: string
  description: string
  category: string
  city: string
  state: string
  contact_info?: string
  website?: string
  phone?: string
  address?: string
  created_at: string
  updated_at?: string
  // Additional properties from external data sources
  organization_name?: string
  organizationName?: string
  address_city?: string
  address_state?: string
  similarity?: number
  [key: string]: any // Allow additional properties
}

export interface PageData {
  title: string
  content: string | any[]
  excerpt?: string
  metaDescription?: string
  targetKeywords?: string[]
  slug: string
  published: boolean
  created_at: string
  updated_at?: string
  // Sanity CMS specific properties
  _type?: string
  heroImage?: any
  heroTitle?: string
  heroSubtitle?: string
  featuredImage?: any
  publishedAt?: string
  readTime?: number
  author?: any
  pillarPage?: any
  tags?: any[]
  relatedClusterPages?: any[]
  [key: string]: any // Allow additional properties from Sanity
}

export interface TableOfContentsItem {
  id: string
  text: string
  level: number
  index?: number
}

export interface FormError {
  message: string
  field?: string
}

// Form data types
export interface ApplicationFormData {
  eligibilityAccepted: boolean
  consentAccepted: boolean
  fullName: string
  dateOfBirth: string
  ssn: string
}

export interface PartnerFormData {
  organization_name: string
  contact_name: string
  contact_email: string
  contact_phone: string
  address: string
  mou_accepted: boolean
  insurance_provided: boolean
}

export interface LoginFormData {
  email: string
  password: string
}

// API Response types
export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: any
}
