import { error, redirect } from '@sveltejs/kit'
import { createClient } from '@supabase/supabase-js'
import type { PageServerLoad } from './$types'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_role_key'
)

export const load: PageServerLoad = async ({ parent, locals }) => {
  const { session } = await parent()
  
  if (!session) {
    throw redirect(303, '/login')
  }

  // Check if user has staff role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (!profile || profile.role !== 'staff') {
    throw error(403, 'Access denied. Staff role required.')
  }

  try {
    // Fetch donation analytics data
    const { data: donations } = await supabase
      .from('donations')
      .select('amount, created_at, donor_id, recurring')
      .gte('created_at', new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()) // Last 6 months
      .order('created_at', { ascending: false })

    // Fetch partner facility data with success metrics
    const { data: partners } = await supabase
      .from('partner_facilities')
      .select(`
        id,
        name,
        total_funding,
        success_rate,
        cost_per_success,
        avg_stay_duration,
        graduates_employed,
        applications (
          id,
          status,
          created_at
        )
      `)

    // Calculate donation funnel metrics
    const totalDonations = donations?.reduce((sum, d) => sum + d.amount, 0) || 0
    const avgDonation = donations?.length ? totalDonations / donations.length : 0
    const recurringDonors = donations?.filter(d => d.recurring).length || 0
    const donorRetention = donations?.length ? (recurringDonors / donations.length) * 100 : 0

    // Calculate monthly metrics for the last 6 months
    const monthlyMetrics = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i)
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)
      
      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)

      const monthDonations = donations?.filter(d => 
        new Date(d.created_at) >= monthStart && new Date(d.created_at) < monthEnd
      ) || []
      
      const monthDonationTotal = monthDonations.reduce((sum, d) => sum + d.amount, 0)
      const monthExpenses = monthDonationTotal * 0.75 // Estimated 75% utilization rate
      const monthNet = monthDonationTotal - monthExpenses

      monthlyMetrics.push({
        month: monthStart.toLocaleString('default', { month: 'short' }),
        donations: monthDonationTotal,
        expenses: monthExpenses,
        net: monthNet,
        utilization_rate: 75 + Math.random() * 15 // Simulated variation
      })
    }

    // Process partner ROI data
    const partnerROI = partners?.map(partner => {
      const totalApplications = partner.applications?.length || 0
      const successfulApplications = partner.applications?.filter(a => a.status === 'approved').length || 0
      const successRate = totalApplications > 0 ? (successfulApplications / totalApplications) * 100 : 0
      
      // Calculate ROI score based on success rate and cost efficiency
      const roiScore = (successRate / 100) * (2000 / (partner.cost_per_success || 2000)) * (partner.avg_stay_duration / 180)

      return {
        partner_id: partner.id,
        partner_name: partner.name,
        total_funding: partner.total_funding || 0,
        success_rate: Math.round(successRate * 10) / 10,
        cost_per_success: partner.cost_per_success || 0,
        roi_score: Math.round(roiScore * 10) / 10,
        avg_stay_duration: partner.avg_stay_duration || 0,
        graduates_employed: partner.graduates_employed || 0
      }
    }) || []

    // Calculate overall KPIs
    const totalExpenses = monthlyMetrics.reduce((sum, m) => sum + m.expenses, 0)
    const netFunding = totalDonations - totalExpenses
    const avgROI = partnerROI.length ? partnerROI.reduce((sum, p) => sum + p.roi_score, 0) / partnerROI.length : 0
    const utilizationRate = partnerROI.length ? partnerROI.reduce((sum, p) => sum + p.success_rate, 0) / partnerROI.length : 0

    const kpis = {
      total_donations: Math.round(totalDonations),
      total_expenses: Math.round(totalExpenses),
      net_funding: Math.round(netFunding),
      avg_donation: Math.round(avgDonation),
      donor_retention: Math.round(donorRetention * 10) / 10,
      utilization_rate: Math.round(utilizationRate * 10) / 10,
      cost_per_success: partnerROI.length ? Math.round(partnerROI.reduce((sum, p) => sum + p.cost_per_success, 0) / partnerROI.length) : 0,
      roi_average: Math.round(avgROI * 10) / 10
    }

    // Calculate donation funnel data (simulated based on analytics)
    const donationFunnelData = [
      { stage: 'Website Visitors', count: 12500, conversion_rate: 100, value: 0 },
      { stage: 'Donation Page Views', count: 3200, conversion_rate: 25.6, value: 0 },
      { stage: 'Started Donation', count: 890, conversion_rate: 27.8, value: 0 },
      { stage: 'Completed Donation', count: donations?.length || 445, conversion_rate: 50.0, value: Math.round(totalDonations) },
      { stage: 'Recurring Donors', count: recurringDonors, conversion_rate: 20.0, value: Math.round(donations?.filter(d => d.recurring).reduce((sum, d) => sum + d.amount, 0) || 0) }
    ]

    return {
      kpis,
      donationFunnelData,
      partnerROI,
      monthlyMetrics,
      user: session.user
    }
  } catch (err) {
    console.error('Error loading financial analytics data:', err)
    throw error(500, 'Failed to load financial analytics data')
  }
}