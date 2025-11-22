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
    title: 'Module A: Benefits Autopilot',
    description: 'We legally act as your "Authorized Representative" to automate Medicaid & SNAP applications via PEAK.',
    chips: ['7 CFR 273.2(n) Compliant', 'PEAKPro Integration', 'Auto-Recertification']
  },
  {
    title: 'Module B: RideCommand',
    description: 'Batch-book 15+ IntelliRide NEMT trips in seconds. No more 45-minute hold times.',
    chips: ['Headless Browser Agent', 'Calendar Sync', 'No-Show Reduction']
  },
  {
    title: 'Module C: CourtSync',
    description: 'Auto-generate JDF compliance reports for probation officers from your UA logs.',
    chips: ['Direct-to-PO Email', 'JDF Form Filling', 'Parole Board Ready']
  }
]

const pillarsBase: PlatformPillar[] = [
  {
    title: 'Zero-Friction Intake',
    description: 'Mobile-first "Magic Link" intake that interviews clients via AI to pre-fill ROI and legal forms.',
    icon: 'network',
    stat: '10x faster admissions'
  },
  {
    title: 'Revenue Engine',
    description: 'Scan case notes for SDoH Z-codes to unlock RAE value-based incentive payments.',
    icon: 'chart',
    stat: 'New revenue stream'
  },
  {
    title: 'Digital Compliance',
    description: 'BHA-ready audit trails. Every AI action is logged in an immutable ledger for liability protection.',
    icon: 'shield',
    stat: '100% Audit Ready'
  },
  {
    title: 'Interoperability',
    description: 'We play nice with Kipu and BestNotes. We do the dirty work; they store the clinical data.',
    icon: 'cpu',
    stat: 'Works with your EHR'
  }
]

const outcomesBase = {
  title: 'We sell time, not software.',
  description:
    'Case managers are drowning in bureaucracy. RecoveryOS gives them back 20+ hours a week to do what they were hired to do: save lives.',
  stats: [
    {
      value: '40%',
      label: 'Billable Hours Reclaimed',
      context: 'from manual data entry tasks',
      source: 'Colorado Pilot Data, 2025',
      sourceLink: '#'
    },
    {
      value: '$25k+',
      label: 'New Annual Revenue',
      context: 'per facility via SDoH incentives',
      source: 'RAE Value-Based Payment Models',
      sourceLink: '#'
    },
    {
      value: '0 min',
      label: 'Time on Hold',
      context: 'with IntelliRide for bookings',
      source: 'RideCommand Benchmarks',
      sourceLink: '#'
    }
  ],
  footnotes: [
    'Based on average case manager caseload of 25-30 clients in high-volume Medicaid facilities.',
    'Revenue projections based on full utilization of SDoH Z-code capture and RAE incentive structures.'
  ]
}

const ctaBase = {
  tag: 'The "Crisis of Capacity" Ends Here',
  title: 'Stop being a data entry clerk. Start saving lives.',
  description:
    'Deploy your digital workforce today. Automate the bureaucracy so you can focus on recovery.',
  primaryLabel: 'Get RecoveryOS',
  secondaryLabel: 'See the Demo',
  badges: ['Built for Colorado', 'HIPAA Compliant', 'BHA Ready']
}

const FALLBACK_CONTENT = {
  en: {
    hero: {
      tag: 'The Operating System for Recovery',
      heading: 'Your digital case manager for Colorado.',
      subheading:
        'RecoveryOS is the agentic workflow engine that automates the "dirty work"—Medicaid filings, NEMT bookings, and court reporting—so your team can focus on care.',
      signals: [
        {
          label: 'Medicaid',
          value: 'Auto-Filed',
          detail: 'PEAK applications submitted without manual entry.'
        },
        {
          label: 'Transport',
          value: 'Batch Booked',
          detail: 'IntelliRide trips scheduled in seconds.'
        },
        {
          label: 'Court',
          value: 'Synced',
          detail: 'Probation reports auto-generated and sent.'
        }
      ]
    },
    credibility: {
      title: 'The only platform built for Colorado’s complex plumbing.',
      description:
        'We don’t just store data like an EHR. We execute work. Built specifically to navigate PEAK, IntelliRide, and the Colorado Judicial System.',
      items: [
        {
          label: 'Legal Standing',
          title: '7 CFR 273.2(n)',
          detail: 'Authorized Representative compliance for benefits application.',
          icon: 'shield'
        },
        {
          label: 'Integration',
          title: 'PEAKPro & IntelliRide',
          detail: 'Direct automation of state portals for benefits and rides.',
          icon: 'chip'
        },
        {
          label: 'Security',
          title: 'HIPAA + SOC 2',
          detail: 'Enterprise-grade encryption and role-based access control.',
          icon: 'lock'
        },
        {
          label: 'Impact',
          title: 'Value-Based Care',
          detail: 'Unlock RAE incentives by closing social gaps automatically.',
          icon: 'pulse'
        }
      ]
    },
    operating: {
      title: 'A modular ecosystem designed to do the heavy lifting.',
      description:
        'Start with our Zero-Friction Intake, then activate the specialized agents that subsidize your labor costs.'
    },
    loops: loopsBase,
    pillars: pillarsBase,
    outcomes: outcomesBase,
    cta: ctaBase
  },
  es: {
    hero: {
      tag: 'El Sistema Operativo para la Recuperación',
      heading: 'Su administrador de casos digital para Colorado.',
      subheading:
        'RecoveryOS es el motor de flujo de trabajo agéntico que automatiza el "trabajo sucio"—trámites de Medicaid, reservas de NEMT e informes judiciales—para que su equipo pueda concentrarse en la atención.',
      signals: [
        {
          label: 'Medicaid',
          value: 'Auto-Presentado',
          detail: 'Aplicaciones PEAK enviadas sin entrada manual.'
        },
        {
          label: 'Transporte',
          value: 'Reserva por Lotes',
          detail: 'Viajes de IntelliRide programados en segundos.'
        },
        {
          label: 'Corte',
          value: 'Sincronizado',
          detail: 'Informes de libertad condicional generados y enviados automáticamente.'
        }
      ]
    },
    credibility: {
      title: 'La única plataforma construida para la compleja infraestructura de Colorado.',
      description:
        'No solo almacenamos datos como un EHR. Ejecutamos el trabajo. Construido específicamente para navegar PEAK, IntelliRide y el Sistema Judicial de Colorado.',
      items: [
        {
          label: 'Respaldo Legal',
          title: '7 CFR 273.2(n)',
          detail: 'Cumplimiento de Representante Autorizado para solicitud de beneficios.',
          icon: 'shield'
        },
        {
          label: 'Integración',
          title: 'PEAKPro e IntelliRide',
          detail: 'Automatización directa de portales estatales para beneficios y viajes.',
          icon: 'chip'
        },
        {
          label: 'Seguridad',
          title: 'HIPAA + SOC 2',
          detail: 'Cifrado de grado empresarial y control de acceso basado en roles.',
          icon: 'lock'
        },
        {
          label: 'Impacto',
          title: 'Atención Basada en Valor',
          detail: 'Desbloquee incentivos RAE cerrando brechas sociales automáticamente.',
          icon: 'pulse'
        }
      ]
    },
    operating: {
      title: 'Un ecosistema modular diseñado para hacer el trabajo pesado.',
      description:
        'Comience con nuestra Admisión Sin Fricción, luego active los agentes especializados que subsidian sus costos laborales.'
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
