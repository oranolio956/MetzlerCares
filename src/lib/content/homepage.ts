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
      source: 'Internal cohort analysis, 2024'
    },
    {
      value: '32%',
      label: 'Faster claim approval cycle',
      context: 'clean H0038 exports & auto-notes',
      source: 'Colorado Medicaid pilot, Q2 2024'
    },
    {
      value: '<4 min',
      label: 'Average risk escalation response',
      context: 'hybrid AI + human coverage',
      source: 'Metzler Ops telemetry, 2024'
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

const homepageContent: Record<string, HomepageContent> = {
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
}

export function getHomepageContent(locale = 'en'): HomepageContent {
  return homepageContent[locale] ?? homepageContent.en
}

export const heroSignals = homepageContent.en.hero.signals
export const credibilitySignals = homepageContent.en.credibility.items
export const operatingLoops = homepageContent.en.loops
export const platformPillars = homepageContent.en.pillars
export const outcomeStats = homepageContent.en.outcomes.stats
