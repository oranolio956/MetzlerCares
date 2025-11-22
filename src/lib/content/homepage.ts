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
}

export const heroSignals: HeroSignal[] = [
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

export const credibilitySignals: CredibilitySignal[] = [
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

export const operatingLoops: OperatingLoop[] = [
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

export const platformPillars: PlatformPillar[] = [
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

export const outcomeStats: OutcomeStat[] = [
  { value: '4.2x', label: 'More peer touchpoints captured', context: 'vs manual spreadsheets + phone trees' },
  { value: '32%', label: 'Faster claim approval cycle', context: 'clean H0038 exports & auto-notes' },
  { value: '<4 min', label: 'Average risk escalation response', context: 'hybrid AI + human coverage' }
]
