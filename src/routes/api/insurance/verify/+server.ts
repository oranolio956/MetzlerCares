import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const supabaseAnon = process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null

// Mock insurance verification - in production, integrate with real insurance APIs
const insuranceProviders = {
  Medicaid: { verificationTime: 2000, successRate: 0.95 },
  Medicare: { verificationTime: 1500, successRate: 0.98 },
  Aetna: { verificationTime: 3000, successRate: 0.85 },
  'Blue Cross Blue Shield': { verificationTime: 2500, successRate: 0.88 },
  Cigna: { verificationTime: 2800, successRate: 0.82 },
  Humana: { verificationTime: 2200, successRate: 0.9 },
  'Kaiser Permanente': { verificationTime: 1800, successRate: 0.92 },
  UnitedHealthcare: { verificationTime: 3200, successRate: 0.8 },
  TriCare: { verificationTime: 2400, successRate: 0.94 },
  Other: { verificationTime: 4000, successRate: 0.7 }
}

export const POST: RequestHandler = async ({ request, fetch }) => {
  let persona: string | undefined
  try {
    const payload = await request.json()
    const { provider, memberId, groupNumber, dob, firstName, lastName } = payload
    persona = payload?.persona

    // Validate required fields
    if (!provider || !memberId || !dob || !firstName || !lastName) {
      return json(
        {
          verified: false,
          error: 'Missing required fields',
          message: 'Please provide all required information'
        },
        { status: 400 }
      )
    }

    // Validate date of birth (must be 18+ years ago)
    const birthDate = new Date(dob)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()

    if (age < 18) {
      return json(
        {
          verified: false,
          error: 'Age validation failed',
          message: 'Must be 18 years or older for treatment'
        },
        { status: 400 }
      )
    }

    // Check cache first
    const memberIdHash = crypto.createHash('sha256').update(memberId).digest('hex')
    const cacheKey = `${provider}:${memberIdHash}`

    let cachedResult: any = null
    if (supabase) {
      const { data } = await supabase
        .from('insurance_verification_cache')
        .select('*')
        .eq('provider_name', provider)
        .eq('member_id_hash', memberIdHash)
        .gt('expires_at', new Date().toISOString())
        .single()
      cachedResult = data
    }

    if (cachedResult) {
      // Track cache hit
      await trackVerificationEvent('insurance_verification_cache_hit', {
        provider,
        persona,
        cached: true
      })

      return json({
        verified: cachedResult.verification_status === 'verified',
        coverage: cachedResult.coverage_data,
        cached: true,
        message:
          cachedResult.verification_status === 'verified'
            ? 'Insurance verified successfully'
            : 'Insurance verification failed'
      })
    }

    // Simulate API verification delay
    const providerConfig =
      insuranceProviders[provider as keyof typeof insuranceProviders] || insuranceProviders['Other']
    await new Promise(resolve => setTimeout(resolve, providerConfig.verificationTime))

    // Simulate verification result
    const isVerified = Math.random() < providerConfig.successRate

    let coverageData = null
    let verificationStatus = 'failed'
    let message = 'Insurance verification failed'

    if (isVerified) {
      verificationStatus = 'verified'
      message = 'Insurance verified successfully'

      // Generate realistic coverage data
      coverageData = {
        type: getCoverageType(provider),
        networkStatus: Math.random() > 0.2 ? 'in-network' : 'out-of-network',
        deductible: generateDeductible(provider),
        copay: generateCopay(provider),
        coinsurance: Math.random() > 0.5 ? 20 : 0, // 20% coinsurance or 0%
        outOfPocketMax: generateOutOfPocketMax(provider),
        effectiveDate: new Date().toISOString().split('T')[0],
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    }

    // Cache the result
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    if (supabase)
      await supabase.from('insurance_verification_cache').insert({
        provider_name: provider,
        member_id_hash: memberIdHash,
        coverage_data: coverageData,
        verification_status: verificationStatus,
        expires_at: expiresAt.toISOString()
      })

    // Track verification event
    await trackVerificationEvent('insurance_verification_complete', {
      provider,
      persona,
      verified: isVerified,
      verification_status: verificationStatus
    })

    // Track conversion event
    await trackConversionEvent('insurance_verification', persona, {
      provider,
      verified: isVerified,
      verification_status: verificationStatus
    })

    return json({
      verified: isVerified,
      coverage: coverageData,
      message,
      provider,
      verification_id: crypto.randomUUID()
    })
  } catch (err) {
    console.error('Insurance verification error:', err)

    // Track error
    await trackVerificationEvent('insurance_verification_error', {
      error: err instanceof Error ? err.message : 'Unknown error',
      persona: persona || 'unknown'
    })

    return json(
      {
        verified: false,
        error: 'Verification service unavailable',
        message: 'Please try again later or call our admissions team'
      },
      { status: 500 }
    )
  }
}

function getCoverageType(provider: string): string {
  if (provider.includes('Medicaid')) return 'Medicaid'
  if (provider.includes('Medicare')) return 'Medicare'
  if (provider.includes('TriCare')) return 'Military'
  return 'Private Insurance'
}

function generateDeductible(provider: string): number {
  const baseRates = {
    Medicaid: 0,
    Medicare: 1600, // Part A deductible
    Aetna: 2500,
    'Blue Cross Blue Shield': 3000,
    Cigna: 2800,
    Humana: 2200,
    'Kaiser Permanente': 1500,
    UnitedHealthcare: 3500,
    TriCare: 1000,
    Other: 4000
  }

  const baseRate = baseRates[provider as keyof typeof baseRates] || 3000
  const variation = (Math.random() - 0.5) * 0.4 // ±20% variation

  return Math.round(baseRate * (1 + variation))
}

function generateCopay(provider: string): number {
  const baseCopays = {
    Medicaid: 0,
    Medicare: 200, // Specialist visit
    Aetna: 40,
    'Blue Cross Blue Shield': 50,
    Cigna: 45,
    Humana: 35,
    'Kaiser Permanente': 25,
    UnitedHealthcare: 60,
    TriCare: 30,
    Other: 75
  }

  const baseCopay = baseCopays[provider as keyof typeof baseCopays] || 50
  const variation = (Math.random() - 0.5) * 0.3 // ±15% variation

  return Math.round(baseCopay * (1 + variation))
}

function generateOutOfPocketMax(provider: string): number {
  const baseMaxes = {
    Medicaid: 0,
    Medicare: 8000,
    Aetna: 8000,
    'Blue Cross Blue Shield': 8500,
    Cigna: 8200,
    Humana: 7800,
    'Kaiser Permanente': 6500,
    UnitedHealthcare: 9000,
    TriCare: 3500,
    Other: 12000
  }

  const baseMax = baseMaxes[provider as keyof typeof baseMaxes] || 8000
  const variation = (Math.random() - 0.5) * 0.2 // ±10% variation

  return Math.round(baseMax * (1 + variation))
}

async function trackVerificationEvent(eventType: string, metadata: any) {
  try {
    if (!supabase) return
    await supabase.from('conversion_events').insert({
      event_type: eventType,
      persona: metadata.persona || 'unknown',
      metadata,
      created_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Failed to track verification event:', err)
  }
}

async function trackConversionEvent(eventType: string, persona: string | null | undefined, metadata: any) {
  try {
    if (!supabase) return
    await supabase.from('conversion_events').insert({
      event_type: eventType,
      persona: persona || 'unknown',
      metadata,
      created_at: new Date().toISOString()
    })
  } catch (err) {
    console.error('Failed to track conversion event:', err)
  }
}
