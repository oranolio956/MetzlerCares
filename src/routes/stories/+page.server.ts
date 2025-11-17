import type { PageServerLoad } from './$types'
import { supabase } from '$lib/utils/supabase'

export const load: PageServerLoad = async ({ setHeaders }) => {
  // Set caching headers for public content
  setHeaders({
    'Cache-Control': 'public, max-age=1800, s-maxage=3600' // 30 min browser, 1 hour CDN
  })

  try {
    // Fetch all published impact stories
    const { data: stories, error } = await supabase
      .from('impact_stories')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    // Mock data for development
    const mockStories = [
      {
        id: '1',
        title: 'From Crisis to Stability',
        story:
          "Sarah was at immediate risk of homelessness when she completed treatment. Within 48 hours of applying, she received a scholarship covering her first month's rent at a certified sober living home. 'This gave me the breathing room I needed to focus on my recovery,' she shares. Three months later, Sarah has maintained her housing, continued her recovery program, and even secured part-time employment. The stability provided by this scholarship was the foundation she needed to rebuild her life.",
        location: 'Denver, CO',
        housing_type: 'Sober Living Home',
        time_to_housing: '2 days',
        success_indicators: [
          'Stable housing secured',
          'Continued recovery program',
          'Employment maintained',
          'Family reunification'
        ],
        created_at: '2024-10-15T00:00:00Z',
        published: true,
        is_featured: true,
        photo_url: '/api/placeholder/800/600'
      },
      {
        id: '2',
        title: 'A Second Chance at Life',
        story:
          "Marcus had been cycling through unstable housing situations for months. Our automated verification process approved his application in under 20 minutes. He now has stable housing and is rebuilding his support network. 'I was losing hope,' Marcus explains. 'The instant approval and direct payment meant I could move in immediately without the usual bureaucratic delays.' Six months later, Marcus has completed his treatment program and is working toward long-term recovery.",
        location: 'Boulder, CO',
        housing_type: 'Transitional Housing',
        time_to_housing: '1 day',
        success_indicators: [
          'Housing stability achieved',
          'Community reintegration',
          'Ongoing treatment engagement',
          'Peer support network'
        ],
        created_at: '2024-09-22T00:00:00Z',
        published: true,
        is_featured: false,
        photo_url: '/api/placeholder/800/600'
      },
      {
        id: '3',
        title: 'Breaking the Cycle of Homelessness',
        story:
          "After losing her housing due to treatment, Jennifer faced immediate homelessness. Our scholarship provided immediate relief, allowing her to move into a supportive environment where she could continue her recovery journey. 'Without this help, I would have been on the street,' Jennifer says. 'The speed and dignity of the process restored my faith in getting help.' Jennifer has now been housed for four months and is actively participating in her recovery community.",
        location: 'Colorado Springs, CO',
        housing_type: 'Recovery Residence',
        time_to_housing: '3 days',
        success_indicators: [
          'Homelessness prevented',
          'Recovery continuity maintained',
          'Family reunification support',
          'Community involvement'
        ],
        created_at: '2024-08-30T00:00:00Z',
        published: true,
        is_featured: false,
        photo_url: '/api/placeholder/800/600'
      },
      {
        id: '4',
        title: 'Restoring Family Bonds',
        story:
          "David's journey through recovery brought him to a crossroads. Having lost contact with his family during his struggle with addiction, he needed stable housing to begin rebuilding those relationships. Our scholarship made that possible. 'My family could see the change in me because I had a stable place to live,' David shares. Today, David is reunited with his family and actively contributes to his recovery community as a peer supporter.",
        location: 'Fort Collins, CO',
        housing_type: 'Sober Living Home',
        time_to_housing: '1 day',
        success_indicators: [
          'Family reconciliation',
          'Peer support role',
          'Community leadership',
          'Long-term stability'
        ],
        created_at: '2024-08-15T00:00:00Z',
        published: true,
        is_featured: false,
        photo_url: '/api/placeholder/800/600'
      },
      {
        id: '5',
        title: 'Reclaiming Independence',
        story:
          "Maria had been in and out of shelters for over a year. The constant instability made it nearly impossible to maintain her recovery. When she applied for our scholarship, she was approved within minutes. 'For the first time in years, I had a place I could call home,' Maria says. Maria has now been stably housed for five months and is pursuing educational opportunities to build a brighter future.",
        location: 'Pueblo, CO',
        housing_type: 'Transitional Housing',
        time_to_housing: '2 days',
        success_indicators: [
          'Shelter system exit',
          'Educational advancement',
          'Financial independence',
          'Recovery maintenance'
        ],
        created_at: '2024-07-28T00:00:00Z',
        published: true,
        is_featured: false,
        photo_url: '/api/placeholder/800/600'
      },
      {
        id: '6',
        title: 'From Despair to Hope',
        story:
          "Robert faced homelessness after completing residential treatment. With no family support nearby and limited resources, he applied for our housing scholarship as a last resort. The automated approval process gave him hope during his darkest hour. 'I was approved so quickly, I thought it must be too good to be true,' Robert recalls. Eight months later, Robert has maintained his sobriety, secured employment, and become a mentor for others in recovery.",
        location: 'Grand Junction, CO',
        housing_type: 'Recovery Residence',
        time_to_housing: '1 day',
        success_indicators: ['Sobriety maintenance', 'Employment secured', 'Mentorship role', 'Self-sufficiency'],
        created_at: '2024-07-10T00:00:00Z',
        published: true,
        is_featured: false,
        photo_url: '/api/placeholder/800/600'
      }
    ]

    if (error) {
      console.error('Error fetching impact stories:', error)
    }

    return {
      stories: stories || mockStories
    }
  } catch (error) {
    console.error('Server error in stories page:', error)
    return {
      stories: [],
      error: 'Server error loading stories'
    }
  }
}
