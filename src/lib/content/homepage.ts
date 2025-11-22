import { z } from 'zod'
import { sanityClient } from '$lib/utils/sanity'

export type HeroSignal = {
  label: string
  value: string
  detail: string
}

export type CredibilitySignal = {
  label: string
  title: string
  detail: string
  icon: 'shield' | 'chip' | 'lock' | 'pulse'
}

export type OperatingLoop = {
  title: string
  description: string
  chips: string[]
}

export type PlatformPillar = {
  title: string
  description: string
  stat: string
  icon: 'chart' | 'network' | 'cpu' | 'shield'
}

export type OutcomeStat = {
  value: string
  label: string
  context: string
  source: string
  sourceLink?: string
}

export type HomepageContent = {
  hero: {
    tag: string
    heading: string
    subheading: string
    signals: HeroSignal[]
  }
  credibility: {
    title: string
    description: string
    items: CredibilitySignal[]
  }
  operating: {
    title: string
    description: string
  }
  loops: OperatingLoop[]
  pillars: PlatformPillar[]
  outcomes: {
    title: string
    description: string
    stats: OutcomeStat[]
    footnotes: string[]
  }
  cta: {
    tag: string
    title: string
    description: string
    primaryLabel: string
    secondaryLabel: string
    badges: string[]
  }
}

const loopsBase: OperatingLoop[] = [
  {
    title: 'Signal Layer',
    description: 'Real-time telemetry from the mobile app, SMS, and EHR events fuels predictive alerts.',
    chips: ['SDOH ingestion', 'Sentiment scanning', 'Warm handoffs']
  },
  {
    title: 'Orchestrate Layer',
    description: 'Ops console routes playbooks, supervision, and billing artifacts with zero spreadsheets.',
    chips: ['Playbook routing', 'Clean fee schedules', 'Coach QA & supervision']
  },
  {
    title: 'Proof Layer',
    description: 'Audit ledger captures every touch with payer-friendly evidence and ROI reporting.',
    chips: ['Encounter ledger', 'Medicaid exports', 'Outcome visualizations']
  }
]

const pillarsBase: PlatformPillar[] = [
  {
    title: 'Data Spine',
    description: 'Normalized recovery capital, referrals, and claims into one streaming telemetry feed.',
    icon: 'chart',
    stat: '12 Colorado markets live'
  },
  {
    title: 'Interoperability Mesh',
    description: 'Push peer encounter notes and billing data into Epic, Athena, and Netsmart without manual files.',
    icon: 'network',
    stat: 'EHR agnostic'
  },
  {
    title: 'Engagement Cloud',
    description: 'White-label mobile app plus AI-driven nudges keep members connected between sessions.',
    icon: 'cpu',
    stat: '95% opt-in engagement'
  },
  {
    title: 'Governance Core',
    description: 'Audit-ready ledger mapped to Colorado RSSO standards with Medicaid H0038 coding baked in.',
    icon: 'shield',
    stat: '100% audit-ready threads'
  }
]

const outcomesBase = {
  title: 'Every partner gets a telemetry report, not a testimonial.',
  description:
    'We quantify field operations in the same units as CFOs, quality teams, and Medicaid reviewers. That means faster approvals, faster reimbursements, and fewer “trust us” decks.',
  stats: [
    {
      value: '4.2x',
      label: 'More peer touchpoints captured',
      context: 'vs manual spreadsheets + phone trees',
      source: 'Internal cohort analysis, 2024',
      sourceLink: 'https://metzler.care/reports/field-ops-2024'
    },
    {
      value: '32%',
      label: 'Faster claim approval cycle',
      context: 'clean H0038 exports & auto-notes',
      source: 'Colorado Medicaid pilot, Q2 2024',
      sourceLink: 'https://metzler.care/reports/medicaid-q2-2024'
    },
    {
      value: '<4 min',
      label: 'Average risk escalation response',
      context: 'hybrid AI + human coverage',
      source: 'Metzler Ops telemetry, 2024',
      sourceLink: 'https://metzler.care/reports/telemetry-2024'
    }
  ],
  footnotes: [
    'Internal cohort analysis covers 1,200 encounters across Denver and Mesa counties (Jan–Jun 2024).',
    'Medicaid pilot data validated with Colorado HCPF program integrity team, May 2024.'
  ]
}

const ctaBase = {
  tag: 'First impression ≠ final delivery',
  title: 'Let’s architect recovery infrastructure once, not reinvent it every contract.',
  description:
    'We onboard with your clinicians, finance leads, and field teams in the same sprint so everyone is shipping from day one.',
  primaryLabel: 'Book a working session',
  secondaryLabel: 'Access partner portal',
  badges: ['Medicaid H0038 ready', 'Colorado RSSO certified', 'Security-first delivery']
}

const FALLBACK_CONTENT = {
  en: {
    hero: {
      tag: 'Colorado built · RSSO Licensed',
      heading: 'Recovery infrastructure built like mission control.',
      subheading:
        'Metzler Cares is the operating system for peer-led recovery: telemetry-rich, Medicaid-clean, and designed so clinicians, payers, and field teams finally see the same truth.',
      signals: [
        {
          label: 'H0038 claims',
          value: '100% auto-coded',
          detail: 'Structured exports with payer-ready notes and supervision logs.'
        },
        {
          label: 'Coverage',
          value: '24/7 hybrid team',
          detail: 'AI + certified peers resolve escalations in under four minutes.'
        },
        {
          label: 'Deployments',
          value: '12 Colorado regions',
          detail: 'Hospital networks and county programs run Metzler end-to-end.'
        }
      ]
    },
    credibility: {
      title: 'Infrastructure signals the boardroom remembers.',
      description:
        'Instead of generic logo farms, we lead with the regulatory, billing, and security receipts that matter to CFOs, Medicaid reviewers, and CMOs evaluating behavioral health partners.',
      items: [
        {
          label: 'Assurance',
          title: 'RSSO License MC-247',
          detail: 'Colorado OBH verified workforce, Medicaid billing, and supervision stack.',
          icon: 'shield'
        },
        {
          label: 'Billing engine',
          title: 'Medicaid + commercial ready',
          detail: 'H0038, T1012, and SUD codes exported with encounter documentation.',
          icon: 'chip'
        },
        {
          label: 'Security posture',
          title: 'HIPAA + SOC 2 controls',
          detail: 'Hardened Supabase Postgres with automated audit webhooks.',
          icon: 'lock'
        },
        {
          label: 'Adoption',
          title: 'Clinics & payers in sync',
          detail: 'Health systems, FQHCs, and managed care orgs co-manage inside Metzler.',
          icon: 'pulse'
        }
      ]
    },
    operating: {
      title: 'A three-layer operating system that captures the entire recovery loop.',
      description:
        'Every workflow snaps into a loop—Signal, Orchestrate, Prove—so field teams, clinicians, and finance speak the same language without duct-taped software.'
    },
    loops: loopsBase,
    pillars: pillarsBase,
    outcomes: outcomesBase,
    cta: ctaBase
  },
  es: {
    hero: {
      tag: 'Construido en Colorado · Licencia RSSO',
      heading: 'Infraestructura de recuperación con precisión de misión.',
      subheading:
        'Metzler Cares es el sistema operativo para la recuperación guiada por pares: telemetría rica, cumplimiento Medicaid y datos compartidos entre clínicas y pagadores.',
      signals: [
        {
          label: 'Reclamaciones H0038',
          value: '100% auto codificadas',
          detail: 'Exportaciones estructuradas con notas listas para pagadores y bitácoras de supervisión.'
        },
        {
          label: 'Cobertura',
          value: 'Equipo híbrido 24/7',
          detail: 'IA + pares certificados resuelven escaladas en menos de cuatro minutos.'
        },
        {
          label: 'Despliegues',
          value: '12 regiones en CO',
          detail: 'Redes hospitalarias y condados operan Metzler end-to-end.'
        }
      ]
    },
    credibility: {
      title: 'Pruebas que Finanzas y Clínicos recuerdan.',
      description:
        'Mostramos licencias, codificación y seguridad auditables para que CFOs y revisores Medicaid confíen en la infraestructura.',
      items: [
        {
          label: 'Licenciamiento',
          title: 'RSSO MC-247',
          detail: 'Capital humano verificado por OBH, facturación Medicaid y supervisión activa.',
          icon: 'shield'
        },
        {
          label: 'Motor de cobro',
          title: 'Listo para Medicaid y comercial',
          detail: 'Exportamos códigos H0038, T1012 y SUD con documentación adjunta.',
          icon: 'chip'
        },
        {
          label: 'Seguridad',
          title: 'Controles HIPAA + SOC 2',
          detail: 'Postgres endurecido con webhooks de auditoría automatizados.',
          icon: 'lock'
        },
        {
          label: 'Adopción',
          title: 'Equipos sincronizados',
          detail: 'Sistemas de salud, FQHCs y MCOs colaboran dentro de Metzler.',
          icon: 'pulse'
        }
      ]
    },
    operating: {
      title: 'Un sistema operativo de tres capas para toda la recuperación.',
      description:
        'Cada flujo cae en Señal, Orquestar o Probar para que campo, clínicos y finanzas compartan el mismo lenguaje.'
    },
    loops: loopsBase,
    pillars: pillarsBase,
    outcomes: outcomesBase,
    cta: ctaBase
  }
} satisfies Record<'en' | 'es', HomepageContent>

type SupportedLocale = keyof typeof FALLBACK_CONTENT
const FALLBACK_LOCALE: SupportedLocale = 'en'
export type HomepageLocale = SupportedLocale

const HOMEPAGE_QUERY = /* groq */ `
  *[_type == "homepageContent" && locale == $locale][0]{
    locale,
    hero{
      tag,
      heading,
      subheading,
      signals[]{
        label,
        value,
        detail
      }
    },
    credibility{
      title,
      description,
      items[]{
        label,
        title,
        detail,
        icon
      }
    },
    operating{
      title,
      description
    },
    loops[]{
      title,
      description,
      chips
    },
    pillars[]{
      title,
      description,
      stat,
      icon
    },
    outcomes{
      title,
      description,
      stats[]{
        value,
        label,
        context,
        source,
        sourceLink
      },
      footnotes
    },
    cta{
      tag,
      title,
      description,
      primaryLabel,
      secondaryLabel,
      badges
    }
  }
`

const heroSignalSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  detail: z.string().min(1)
})

const credibilitySignalSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  detail: z.string().min(1),
  icon: z.enum(['shield', 'chip', 'lock', 'pulse'])
})

const operatingLoopSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  chips: z.array(z.string().min(1)).default([])
})

const platformPillarSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  stat: z.string().min(1),
  icon: z.enum(['chart', 'network', 'cpu', 'shield'])
})

const outcomeStatSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  context: z.string().min(1),
  source: z.string().min(1),
  sourceLink: z.string().url().optional()
})

const homepageSchema = z.object({
  locale: z.string().optional(),
  hero: z.object({
    tag: z.string().min(1),
    heading: z.string().min(1),
    subheading: z.string().min(1),
    signals: z.array(heroSignalSchema).default([])
  }),
  credibility: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    items: z.array(credibilitySignalSchema).default([])
  }),
  operating: z.object({
    title: z.string().min(1),
    description: z.string().min(1)
  }),
  loops: z.array(operatingLoopSchema).default([]),
  pillars: z.array(platformPillarSchema).default([]),
  outcomes: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    stats: z.array(outcomeStatSchema).default([]),
    footnotes: z.array(z.string().min(1)).default([])
  }),
  cta: z.object({
    tag: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    primaryLabel: z.string().min(1),
    secondaryLabel: z.string().min(1),
    badges: z.array(z.string().min(1)).default([])
  })
})

type HomepageDocument = z.infer<typeof homepageSchema>

const contentCache = new Map<SupportedLocale, HomepageContent>()

const clone = <T>(value: T): T =>
  typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value))

const normalizeLocale = (locale?: string | null): SupportedLocale => {
  if (!locale) return FALLBACK_LOCALE
  const normalized = locale.toLowerCase().split('-')[0]
  return (Object.keys(FALLBACK_CONTENT) as SupportedLocale[]).includes(normalized as SupportedLocale)
    ? (normalized as SupportedLocale)
    : FALLBACK_LOCALE
}

const arrayOrFallback = <T>(candidate: T[] | undefined, fallback: T[]): T[] =>
  candidate && candidate.length ? candidate : fallback

function mergeWithFallback(locale: SupportedLocale, data?: HomepageDocument | null): HomepageContent {
  const fallback = clone(FALLBACK_CONTENT[locale] ?? FALLBACK_CONTENT[FALLBACK_LOCALE])
  if (!data) {
    return fallback
  }

  return {
    hero: {
      ...fallback.hero,
      ...data.hero,
      signals: arrayOrFallback(data.hero.signals, fallback.hero.signals)
    },
    credibility: {
      ...fallback.credibility,
      ...data.credibility,
      items: arrayOrFallback(data.credibility.items, fallback.credibility.items)
    },
    operating: {
      ...fallback.operating,
      ...data.operating
    },
    loops: arrayOrFallback(data.loops, fallback.loops),
    pillars: arrayOrFallback(data.pillars, fallback.pillars),
    outcomes: {
      ...fallback.outcomes,
      ...data.outcomes,
      stats: arrayOrFallback(data.outcomes.stats, fallback.outcomes.stats),
      footnotes: arrayOrFallback(data.outcomes.footnotes, fallback.outcomes.footnotes)
    },
    cta: {
      ...fallback.cta,
      ...data.cta,
      badges: arrayOrFallback(data.cta.badges, fallback.cta.badges)
    }
  }
}

export async function getHomepageContent(locale = 'en'): Promise<HomepageContent> {
  const normalizedLocale = normalizeLocale(locale)

  if (contentCache.has(normalizedLocale)) {
    return contentCache.get(normalizedLocale)!
  }

  if (!sanityClient) {
    const fallback = mergeWithFallback(normalizedLocale)
    contentCache.set(normalizedLocale, fallback)
    return fallback
  }

  try {
    const result = await sanityClient.fetch<HomepageDocument | null>(HOMEPAGE_QUERY, {
      locale: normalizedLocale
    })
    const parsed = result ? homepageSchema.parse(result) : undefined
    const merged = mergeWithFallback(normalizedLocale, parsed)
    contentCache.set(normalizedLocale, merged)
    return merged
  } catch (error) {
    console.warn('Failed to load homepage content from Sanity. Falling back to static copy.', error)
    const fallback = mergeWithFallback(normalizedLocale)
    contentCache.set(normalizedLocale, fallback)
    return fallback
  }
}

export function getHomepageFixture(locale: SupportedLocale = FALLBACK_LOCALE): HomepageContent {
  return mergeWithFallback(locale)
}

export const heroSignals = FALLBACK_CONTENT.en.hero.signals
export const credibilitySignals = FALLBACK_CONTENT.en.credibility.items
export const operatingLoops = FALLBACK_CONTENT.en.loops
export const platformPillars = FALLBACK_CONTENT.en.pillars
export const outcomeStats = FALLBACK_CONTENT.en.outcomes.stats
