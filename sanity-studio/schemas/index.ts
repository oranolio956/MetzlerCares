import { type SchemaTypeDefinition } from 'sanity'

// Public content schemas for Metzler Foundations
export const schemaTypes: SchemaTypeDefinition[] = [
  // =============================================
  // PILLAR PAGE SCHEMA
  // =============================================
  // Main, long-form SEO content hubs
  // Strategy: Create comprehensive content that ranks for target keywords
  {
    name: 'pillarPage',
    title: 'Pillar Page',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Page Title',
        type: 'string',
        validation: Rule => Rule.required(),
        description: 'SEO-optimized title for the pillar page'
      },
      {
        name: 'slug',
        title: 'URL Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96
        },
        validation: Rule => Rule.required(),
        description: 'URL-friendly version of the title'
      },
      {
        name: 'metaDescription',
        title: 'Meta Description',
        type: 'text',
        rows: 3,
        validation: Rule => Rule.max(160),
        description: 'SEO meta description (max 160 characters)'
      },
      {
        name: 'heroImage',
        title: 'Hero Image',
        type: 'image',
        options: {
          hotspot: true
        },
        description: 'Main banner image for the page'
      },
      {
        name: 'heroTitle',
        title: 'Hero Title',
        type: 'string',
        description: 'Compelling headline for the hero section'
      },
      {
        name: 'heroSubtitle',
        title: 'Hero Subtitle',
        type: 'text',
        rows: 2,
        description: 'Supporting text under the hero title'
      },
      {
        name: 'content',
        title: 'Main Content',
        type: 'array',
        of: [
          {
            type: 'block',
            styles: [
              { title: 'Normal', value: 'normal' },
              { title: 'Heading 1', value: 'h1' },
              { title: 'Heading 2', value: 'h2' },
              { title: 'Heading 3', value: 'h3' },
              { title: 'Quote', value: 'blockquote' }
            ],
            marks: {
              decorators: [
                { title: 'Strong', value: 'strong' },
                { title: 'Emphasis', value: 'em' },
                { title: 'Underline', value: 'underline' }
              ],
              annotations: [
                {
                  name: 'link',
                  type: 'object',
                  title: 'URL',
                  fields: [
                    {
                      name: 'href',
                      type: 'url',
                      title: 'URL'
                    }
                  ]
                }
              ]
            }
          },
          {
            type: 'image',
            options: { hotspot: true },
            fields: [
              {
                name: 'alt',
                type: 'string',
                title: 'Alt Text',
                validation: Rule => Rule.required()
              },
              {
                name: 'caption',
                type: 'string',
                title: 'Caption'
              }
            ]
          }
        ],
        description: "Rich content using Sanity's block editor"
      },
      {
        name: 'targetKeywords',
        title: 'Target Keywords',
        type: 'array',
        of: [{ type: 'string' }],
        description: 'Primary keywords this pillar page targets for SEO'
      },
      {
        name: 'relatedClusterPages',
        title: 'Related Cluster Pages',
        type: 'array',
        of: [
          {
            type: 'reference',
            to: [{ type: 'clusterPage' }]
          }
        ],
        description: 'Blog posts that support this pillar page'
      },
      {
        name: 'publishedAt',
        title: 'Published Date',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
        description: 'When this content was first published'
      },
      {
        name: 'isPublished',
        title: 'Published',
        type: 'boolean',
        initialValue: false,
        description: 'Whether this page is live on the website'
      }
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'slug.current',
        media: 'heroImage'
      }
    }
  },

  // =============================================
  // CLUSTER PAGE SCHEMA
  // =============================================
  // Supporting blog posts that link back to pillar pages
  // Strategy: Create content that drives traffic to pillar pages
  {
    name: 'clusterPage',
    title: 'Cluster Page (Blog Post)',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Post Title',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'slug',
        title: 'URL Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96
        },
        validation: Rule => Rule.required()
      },
      {
        name: 'excerpt',
        title: 'Excerpt',
        type: 'text',
        rows: 3,
        validation: Rule => Rule.max(200),
        description: 'Brief summary for meta description and previews (max 200 chars)'
      },
      {
        name: 'featuredImage',
        title: 'Featured Image',
        type: 'image',
        options: {
          hotspot: true
        },
        validation: Rule => Rule.required()
      },
      {
        name: 'pillarPage',
        title: 'Related Pillar Page',
        type: 'reference',
        to: [{ type: 'pillarPage' }],
        validation: Rule => Rule.required(),
        description: 'The main pillar page this cluster post supports'
      },
      {
        name: 'content',
        title: 'Post Content',
        type: 'array',
        of: [
          {
            type: 'block',
            styles: [
              { title: 'Normal', value: 'normal' },
              { title: 'Heading 2', value: 'h2' },
              { title: 'Heading 3', value: 'h3' },
              { title: 'Quote', value: 'blockquote' }
            ],
            marks: {
              decorators: [
                { title: 'Strong', value: 'strong' },
                { title: 'Emphasis', value: 'em' },
                { title: 'Code', value: 'code' }
              ],
              annotations: [
                {
                  name: 'link',
                  type: 'object',
                  title: 'URL',
                  fields: [
                    {
                      name: 'href',
                      type: 'url',
                      title: 'URL'
                    },
                    {
                      name: 'blank',
                      type: 'boolean',
                      title: 'Open in new tab'
                    }
                  ]
                }
              ]
            }
          },
          {
            type: 'image',
            options: { hotspot: true },
            fields: [
              {
                name: 'alt',
                type: 'string',
                title: 'Alt Text',
                validation: Rule => Rule.required()
              },
              {
                name: 'caption',
                type: 'string',
                title: 'Caption'
              }
            ]
          }
        ]
      },
      {
        name: 'tags',
        title: 'Tags',
        type: 'array',
        of: [{ type: 'string' }],
        description: 'SEO tags and categories for this post'
      },
      {
        name: 'readTime',
        title: 'Estimated Read Time',
        type: 'number',
        description: 'Estimated reading time in minutes'
      },
      {
        name: 'author',
        title: 'Author',
        type: 'reference',
        to: [{ type: 'teamMember' }],
        description: 'Who wrote this post'
      },
      {
        name: 'publishedAt',
        title: 'Published Date',
        type: 'datetime',
        initialValue: () => new Date().toISOString()
      },
      {
        name: 'isPublished',
        title: 'Published',
        type: 'boolean',
        initialValue: false
      }
    ],
    preview: {
      select: {
        title: 'title',
        subtitle: 'pillarPage.title',
        media: 'featuredImage'
      },
      prepare(selection) {
        const { title, subtitle, media } = selection
        return {
          title,
          subtitle: `Pillar: ${subtitle}`,
          media
        }
      }
    }
  },

  // =============================================
  // LOCAL RESOURCE SCHEMA
  // =============================================
  // AI-powered resource matching for crisis support
  {
    name: 'localResource',
    title: 'Local Resource',
    type: 'document',
    fields: [
      {
        name: 'organizationName',
        title: 'Organization Name',
        type: 'string',
        validation: Rule => Rule.required(),
        description: 'Name of the organization providing the service'
      },
      {
        name: 'description',
        title: 'Service Description',
        type: 'text',
        rows: 4,
        validation: Rule => Rule.required(),
        description: 'Detailed description of services offered (used for AI matching)'
      },
      {
        name: 'resourceType',
        title: 'Resource Type',
        type: 'string',
        options: {
          list: [
            { title: 'Housing/Shelter', value: 'housing' },
            { title: 'Food Assistance', value: 'food' },
            { title: 'Medical Care', value: 'medical' },
            { title: 'Mental Health', value: 'mental_health' },
            { title: 'Substance Use Treatment', value: 'treatment' },
            { title: 'Detox Services', value: 'detox' },
            { title: 'Rehab Programs', value: 'rehab' },
            { title: 'Sober Living Homes', value: 'sober_living' },
            { title: 'Recovery Support', value: 'recovery_support' },
            { title: 'AA/NA Meetings', value: 'meetings' },
            { title: 'Dual Diagnosis Treatment', value: 'dual_diagnosis' },
            { title: 'Medication-Assisted Treatment', value: 'mat' },
            { title: 'Outpatient Programs', value: 'outpatient' },
            { title: 'Inpatient Programs', value: 'inpatient' },
            { title: 'Employment Services', value: 'employment' },
            { title: 'Legal Aid', value: 'legal' },
            { title: 'Transportation', value: 'transportation' },
            { title: 'Crisis Hotline', value: 'crisis' },
            { title: 'Other Support', value: 'other' }
          ]
        },
        validation: Rule => Rule.required(),
        description: 'Category of service provided'
      },
      {
        name: 'phone',
        title: 'Phone Number',
        type: 'string',
        description: 'Primary contact phone number'
      },
      {
        name: 'website',
        title: 'Website',
        type: 'url',
        description: 'Organization website URL'
      },
      {
        name: 'addressCity',
        title: 'City',
        type: 'string',
        description: 'Service location city'
      },
      {
        name: 'addressState',
        title: 'State',
        type: 'string',
        initialValue: 'CO',
        description: 'Service location state (defaults to Colorado)'
      },
      {
        name: 'hours',
        title: 'Hours of Operation',
        type: 'text',
        rows: 2,
        description: 'When the service is available'
      },
      {
        name: 'eligibility',
        title: 'Eligibility Requirements',
        type: 'text',
        rows: 3,
        description: 'Who can use this service (income, residency, etc.)'
      },
      {
        name: 'cost',
        title: 'Cost/Fees',
        type: 'string',
        description: 'Cost information (free, sliding scale, etc.)'
      },
      {
        name: 'languages',
        title: 'Languages Spoken',
        type: 'array',
        of: [{ type: 'string' }],
        description: 'Languages available for service'
      },
      {
        name: 'isActive',
        title: 'Currently Active',
        type: 'boolean',
        initialValue: true,
        description: 'Whether this resource is currently available'
      },
      {
        name: 'lastVerified',
        title: 'Last Verified',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
        description: 'When this resource information was last confirmed'
      },
      {
        name: 'notes',
        title: 'Internal Notes',
        type: 'text',
        rows: 2,
        description: 'Internal notes for staff (not shown to users)'
      }
    ],
    preview: {
      select: {
        title: 'organizationName',
        subtitle: 'resourceType',
        city: 'addressCity',
        state: 'addressState'
      },
      prepare(selection) {
        const { title, subtitle, city, state } = selection
        return {
          title,
          subtitle: `${subtitle} • ${city}, ${state}`
        }
      }
    }
  },

  // =============================================
  // IMPACT METRIC SCHEMA
  // =============================================
  // Public dashboard metrics for transparency and impact reporting
  {
    name: 'impactMetric',
    title: 'Impact Metric',
    type: 'document',
    fields: [
      {
        name: 'label',
        title: 'Metric Label',
        type: 'string',
        validation: Rule => Rule.required(),
        description: 'Display name (e.g., "People Housed", "Recovery Success Rate")'
      },
      {
        name: 'value',
        title: 'Current Value',
        type: 'string',
        validation: Rule => Rule.required(),
        description: 'The metric value (can be number, percentage, or text)'
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        rows: 2,
        description: 'Brief explanation of what this metric represents'
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
        options: {
          list: [
            { title: 'Housing', value: 'housing' },
            { title: 'Recovery', value: 'recovery' },
            { title: 'Community', value: 'community' },
            { title: 'Financial', value: 'financial' },
            { title: 'Partnerships', value: 'partnerships' }
          ]
        },
        description: 'Grouping category for dashboard organization'
      },
      {
        name: 'displayOrder',
        title: 'Display Order',
        type: 'number',
        description: 'Order in which metrics appear on dashboard (lower numbers first)'
      },
      {
        name: 'isActive',
        title: 'Active',
        type: 'boolean',
        initialValue: true,
        description: 'Whether to display this metric on the public dashboard'
      },
      {
        name: 'lastUpdated',
        title: 'Last Updated',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
        description: 'When this metric was last verified/updated'
      }
    ],
    preview: {
      select: {
        title: 'label',
        subtitle: 'value',
        category: 'category'
      },
      prepare(selection) {
        const { title, subtitle, category } = selection
        return {
          title: `${title}: ${subtitle}`,
          subtitle: category ? `Category: ${category}` : ''
        }
      }
    }
  },

  // =============================================
  // TEAM MEMBER SCHEMA
  // =============================================
  // About us page content
  {
    name: 'teamMember',
    title: 'Team Member',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Full Name',
        type: 'string',
        validation: Rule => Rule.required()
      },
      {
        name: 'title',
        title: 'Job Title',
        type: 'string',
        validation: Rule => Rule.required(),
        description: 'Professional title or role'
      },
      {
        name: 'image',
        title: 'Profile Photo',
        type: 'image',
        options: {
          hotspot: true
        },
        validation: Rule => Rule.required(),
        description: 'Professional headshot or photo'
      },
      {
        name: 'bio',
        title: 'Biography',
        type: 'text',
        rows: 4,
        validation: Rule => Rule.max(500),
        description: 'Brief professional biography (max 500 characters)'
      },
      {
        name: 'email',
        title: 'Email',
        type: 'string',
        validation: Rule => Rule.email(),
        description: 'Professional email address'
      },
      {
        name: 'linkedin',
        title: 'LinkedIn Profile',
        type: 'url',
        description: 'LinkedIn profile URL (optional)'
      },
      {
        name: 'department',
        title: 'Department',
        type: 'string',
        options: {
          list: [
            { title: 'Executive Leadership', value: 'executive' },
            { title: 'Case Management', value: 'case_management' },
            { title: 'Housing Coordination', value: 'housing' },
            { title: 'Recovery Support', value: 'recovery' },
            { title: 'Community Outreach', value: 'outreach' },
            { title: 'Administration', value: 'administration' },
            { title: 'Development', value: 'development' }
          ]
        },
        description: 'Department or functional area'
      },
      {
        name: 'startDate',
        title: 'Start Date',
        type: 'date',
        description: 'When this person joined the organization'
      },
      {
        name: 'isActive',
        title: 'Currently Active',
        type: 'boolean',
        initialValue: true,
        description: 'Whether this person is currently employed'
      },
      {
        name: 'displayOrder',
        title: 'Display Order',
        type: 'number',
        description: 'Order in which team members appear (lower numbers first)'
      }
    ],
    preview: {
      select: {
        title: 'name',
        subtitle: 'title',
        media: 'image'
      }
    }
  },

  // =============================================
  // PARTNERSHIP MOU SCHEMA
  // =============================================
  // Legal framework for preferred provider network relationships
  {
    name: 'partnershipMou',
    title: 'Partnership MOU',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Document Title',
        type: 'string',
        initialValue: 'Metzler Foundations Preferred Provider Network Memorandum of Understanding',
        readOnly: true
      },
      {
        name: 'version',
        title: 'Version',
        type: 'string',
        initialValue: '1.0'
      },
      {
        name: 'lastUpdated',
        title: 'Last Updated',
        type: 'datetime',
        initialValue: () => new Date().toISOString()
      },
      {
        name: 'parties',
        title: 'Parties Section',
        type: 'text',
        rows: 3,
        initialValue:
          'This Memorandum of Understanding (MOU) is made between Metzler Foundations, Inc. ("The Foundation") and [Partner Facility Name] ("The Provider").',
        readOnly: true
      },
      {
        name: 'purpose',
        title: 'Purpose Section',
        type: 'text',
        rows: 4,
        initialValue:
          'To establish a collaborative partnership to provide rapid, transitional housing scholarships for individuals in recovery from Substance Use Disorder (SUD), ensuring funds are deployed efficiently and beneficiaries are housed in safe, certified environments.',
        readOnly: true
      },
      {
        name: 'term',
        title: 'Term Section',
        type: 'text',
        rows: 2,
        initialValue:
          "This MOU shall be in effect for one year from the date of signing and will auto-renew unless terminated by either party with 30 days' written notice.",
        readOnly: true
      },
      {
        name: 'foundationResponsibilities',
        title: 'Foundation Responsibilities',
        type: 'array',
        of: [{ type: 'text' }],
        initialValue: [
          'Referral & Verification: The Foundation will perform all beneficiary intake, 42 CFR Part 2/CPA-compliant consenting, and automated eligibility verification.',
          "Payment: The Foundation will pay the scholarship amount (e.g., $300) directly to The Provider via ACH transfer (using Stripe) within 24 hours of a beneficiary's approval in our internal portal.",
          'Data: The Foundation will share only the minimum necessary beneficiary information (Name, Approval Status) required for placement.'
        ],
        readOnly: true
      },
      {
        name: 'providerResponsibilities',
        title: 'Provider Responsibilities',
        type: 'array',
        of: [{ type: 'text' }],
        initialValue: [
          'Certification: The Provider must maintain valid NARR (or state equivalent) certification and general liability insurance for the duration of this agreement.',
          'Bed Guarantee: Upon receiving an approval notice from The Foundation, The Provider agrees to hold the approved bed for the beneficiary for a minimum of 24 hours.',
          'Data Reporting: To facilitate long-term outcome tracking, The Provider agrees to respond to automated status requests from The Foundation\'s platform (via Keragon or email) at the 30, 60, and 90-day marks for each placed beneficiary. This response will confirm the beneficiary\'s status (e.g., "Still in residence," "Completed program," "Discharged").'
        ],
        readOnly: true
      },
      {
        name: 'confidentiality',
        title: 'Confidentiality Section',
        type: 'text',
        rows: 3,
        initialValue:
          'Both parties agree to handle all beneficiary data in strict accordance with HIPAA and 42 CFR Part 2. This MOU acts as a BAA-equivalent for the limited data being shared.',
        readOnly: true
      },
      {
        name: 'fullDocument',
        title: 'Complete MOU Text',
        type: 'array',
        of: [
          {
            type: 'block',
            styles: [
              { title: 'Heading 1', value: 'h1' },
              { title: 'Heading 2', value: 'h2' },
              { title: 'Normal', value: 'normal' }
            ]
          }
        ],
        initialValue: [
          {
            _type: 'block',
            style: 'h1',
            children: [
              { _type: 'span', text: 'Metzler Foundations Preferred Provider Network Memorandum of Understanding' }
            ]
          },
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Parties' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'This Memorandum of Understanding (MOU) is made between Metzler Foundations, Inc. ("The Foundation") and [Partner Facility Name] ("The Provider").'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Purpose' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'To establish a collaborative partnership to provide rapid, transitional housing scholarships for individuals in recovery from Substance Use Disorder (SUD), ensuring funds are deployed efficiently and beneficiaries are housed in safe, certified environments.'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Foundation Responsibilities' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '• Referral & Verification: Perform all beneficiary intake and automated eligibility verification\n• Payment: Direct ACH transfers within 24 hours of approval\n• Data: Share only minimum necessary information for placement'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Provider Responsibilities' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: '• Certification: Maintain valid NARR certification and liability insurance\n• Bed Guarantee: Hold approved beds for minimum 24 hours\n• Data Reporting: Respond to 30/60/90-day outcome requests'
              }
            ]
          },
          {
            _type: 'block',
            style: 'h2',
            children: [{ _type: 'span', text: 'Confidentiality & Compliance' }]
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Both parties agree to handle all beneficiary data in strict accordance with HIPAA and 42 CFR Part 2. This MOU acts as a BAA-equivalent for the limited data being shared.'
              }
            ]
          }
        ],
        readOnly: true
      }
    ]
  }
]
