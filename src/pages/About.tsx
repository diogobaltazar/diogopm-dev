import { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Database, Cloud, Anchor, Plane, Briefcase,
  Code, BookOpen, Calculator, FlaskConical, Dna,
  Download, Check,
} from 'lucide-react'
import { FaGithub as GithubIcon } from 'react-icons/fa'
import {
  SiPython, SiTypescript, SiJavascript, SiDocker, SiGit, SiGithub,
  SiReact, SiPytorch, SiPostgresql, SiElasticsearch, SiApachespark,
  SiPalantir, SiMlflow, SiDatabricks, SiCloudera, SiAnthropic,
  SiOpenjdk, SiDotnet, SiApachehadoop, SiKubernetes, SiTerraform,
  SiLangchain, SiOpenai, SiNodedotjs,
} from 'react-icons/si'
import GitGraph from '../components/GitGraph'
import { useGlobeCtx } from '../context/GlobeContext'

// ─── tech icons ───────────────────────────────────────────────────────────────

type IconComponent = React.ComponentType<{ size?: number; style?: React.CSSProperties }>

const TECH_ICON_MAP: Record<string, IconComponent> = {
  python:            SiPython,
  ts:                SiTypescript,
  typescript:        SiTypescript,
  js:                SiJavascript,
  javascript:        SiJavascript,
  docker:            SiDocker,
  git:               SiGit,
  github:            SiGithub,
  react:             SiReact,
  pytorch:           SiPytorch,
  postgresql:        SiPostgresql,
  psql:              SiPostgresql,
  elasticsearch:     SiElasticsearch,
  pyspark:           SiApachespark,
  spark:             SiApachespark,
  'apache spark':    SiApachespark,
  'palantir foundry': SiPalantir,
  palantir:          SiPalantir,
  mlflow:            SiMlflow,
  databricks:        SiDatabricks,
  cloudera:          SiCloudera,
  'cloudera hadoop': SiCloudera,
  hadoop:            SiApachehadoop,
  'claude api':      SiAnthropic,
  anthropic:         SiAnthropic,
  java:              SiOpenjdk,
  openjdk:           SiOpenjdk,
  'c# asp.net':      SiDotnet,
  'asp.net':         SiDotnet,
  dotnet:            SiDotnet,
  kubernetes:        SiKubernetes,
  terraform:         SiTerraform,
  langchain:         SiLangchain,
  openai:            SiOpenai,
  node:              SiNodedotjs,
  nodejs:            SiNodedotjs,
}

function TechTags({ tags }: { tags: string }) {
  const items = tags.split(',').map(t => t.trim()).filter(Boolean)
  return (
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
      {items.map(t => {
        const Icon = TECH_ICON_MAP[t.toLowerCase()]
        return Icon ? (
          <span key={t} title={t} style={{ color: 'var(--muted)', opacity: 0.55 }}>
            <Icon size={13} />
          </span>
        ) : (
          <span key={t} style={{ fontSize: '0.6rem', padding: '0.1rem 0.45rem', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--muted)', opacity: 0.55 }}>
            {t}
          </span>
        )
      })}
    </div>
  )
}

function TechTagList({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
      {tags.map(t => {
        const Icon = TECH_ICON_MAP[t.toLowerCase()]
        return Icon ? (
          <span key={t} title={t} style={{ color: 'var(--muted)', opacity: 0.6 }}>
            <Icon size={12} />
          </span>
        ) : (
          <span key={t} style={{ fontSize: '0.58rem', padding: '0.1rem 0.4rem', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--muted)' }}>
            {t}
          </span>
        )
      })}
    </div>
  )
}

// ─── email capture ────────────────────────────────────────────────────────────

type CapturePhase = 'idle' | 'open' | 'done'

function EmailCapture() {
  const [phase, setPhase] = useState<CapturePhase>('idle')
  const [email, setEmail] = useState('')

  function handleClick() {
    if (phase === 'idle') setPhase('open')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setPhase('done')
    setTimeout(() => { setPhase('idle'); setEmail('') }, 2200)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <button
        onClick={handleClick}
        aria-label={phase === 'done' ? 'Sent' : 'Download CV'}
        title={phase === 'done' ? 'Sent' : 'Download CV'}
        style={{
          background: 'none', border: 'none', padding: '0.2rem',
          cursor: phase === 'done' ? 'default' : 'pointer',
          color: phase === 'done' ? 'var(--accent)' : 'var(--muted)',
          display: 'flex', alignItems: 'center',
          transition: 'color 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={e => { if (phase === 'idle') (e.currentTarget as HTMLElement).style.color = 'var(--fg)' }}
        onMouseLeave={e => { if (phase === 'idle') (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
      >
        {phase === 'done'
          ? <Check size={15} strokeWidth={1.5} />
          : <Download size={15} strokeWidth={1.5} />
        }
      </button>

      <AnimatePresence>
        {phase === 'open' && (
          <motion.form
            key="cv-email"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            onSubmit={handleSubmit}
            style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <input
              autoFocus
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && setPhase('idle')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                color: 'var(--fg)',
                fontSize: '0.7rem',
                padding: '0.1rem 0.2rem',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                width: 158,
                whiteSpace: 'nowrap',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', fontSize: '0.75rem', padding: '0.1rem 0.2rem',
                display: 'flex', alignItems: 'center', flexShrink: 0,
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--fg)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
            >
              →
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── types ────────────────────────────────────────────────────────────────────

type LocationKey = 'lisbon' | 'toulouse' | 'copenhagen' | 'london'
type ArcId =
  | 'lisbon-toulouse'
  | 'toulouse-copenhagen'
  | 'copenhagen-london'
  | 'lisbon-copenhagen-edu'
  | null

interface Tag { icon: React.ElementType; label: string }

interface ClosedSourceProject {
  name: string
  description: string
  tags: string[]
  status: 'shipped' | 'internal' | 'deprecated' | 'ongoing'
  source?: 'closed' | 'inner'
  url?: string
}

interface TimelineEntry {
  id: string
  type: 'experience' | 'education'
  title: string
  organization: string
  organizationUrl?: string
  location: LocationKey
  locationLabel: string
  period: string
  startYear: number
  startTs: number
  endTs: number | null
  team?: string
  teamUrl?: string
  description?: string
  tags?: string
  tags2?: Tag[]
  note?: string
  thesis?: string
  arcId: ArcId
  closedSource?: ClosedSourceProject[]
}

function ts(year: number, month = 1, day = 1) {
  return Date.UTC(year, month - 1, day)
}

// ─── organisation logo map ────────────────────────────────────────────────────

const ORG_LOGO: Record<string, { src: string; height?: number }> = {
  roche:           { src: '/logos/roche.svg',        height: 18 },
  'nn-lead':       { src: '/logos/novo-nordisk.svg'             },
  'nn-platform':   { src: '/logos/novo-nordisk.svg'             },
  'nn-senior':     { src: '/logos/novo-nordisk.svg'             },
  maersk:          { src: '/logos/maersk.svg'                   },
  airbus:          { src: '/logos/airbus.svg'                   },
  'accenture-se':  { src: '/logos/accenture.svg',    height: 18 },
  'accenture-fsd': { src: '/logos/accenture.svg',    height: 18 },
  ku:              { src: '/logos/ku.svg'                       },
  'fcul-cs':       { src: '/logos/ulisboa.svg'                  },
  'fcul-math':     { src: '/logos/ulisboa.svg'                  },
  'flul-phil':     { src: '/logos/ulisboa.svg'                  },
}

function branchLabel(entry: { type: 'experience' | 'education'; title: string }) {
  const prefix = entry.type === 'experience' ? 'industry' : 'education'
  const slug   = entry.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${prefix}/${slug}`
}

// ─── projects ─────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    name: 'TopGun',
    org: 'diogobaltazar',
    url: 'https://github.com/diogobaltazar/TopGun',
    description: 'End-to-end AI development flow — research, plan, implement, test, deploy.',
    tags: ['AI', 'Developer Tools'],
  },
  {
    name: 'Move37',
    org: 'Genentech',
    url: 'https://github.com/Genentech/Move37',
    description: 'AI-powered drug-target interaction and molecular movement analysis.',
    tags: ['AI', 'Computational Biology', 'Drug Discovery'],
  },
]

// ─── timeline ─────────────────────────────────────────────────────────────────

const TIMELINE: TimelineEntry[] = [
  {
    id: 'roche', type: 'experience',
    title: 'Principal AI Engineer',
    organization: 'Roche', organizationUrl: 'https://www.roche.com',
    location: 'london', locationLabel: 'London · UK',
    period: 'Jan 2026 – Present', startYear: 2026,
    startTs: ts(2026, 1), endTs: null,
    team: 'gRED Computational Sciences',
    description: 'Lab-In-The-Loop / AI for Accelerated Drug Discovery',
    tags2: [{ icon: Brain, label: 'AI / ML' }, { icon: FlaskConical, label: 'Pharma & Biotech' }, { icon: Dna, label: 'Computational Biology' }],
    arcId: 'copenhagen-london',
    closedSource: [
      {
        name: 'EpicShelter',
        description: 'Unveiling Roche\'s known systems\' dependencies to produce a Knowledge Base enabling assessment of pressing refactoring priorities, decommissions, and opportunities.',
        tags: ['python', 'claude api', 'aws'],
        status: 'ongoing',
        source: 'inner',
      },
      {
        name: 'AutoLab',
        description: 'Oligonucleotide Workflow, Lab-In-The-Loop: autonomous agentic loop for experimental design and execution.',
        tags: ['python', 'claude api', 'aws'],
        status: 'ongoing',
        source: 'inner',
      },
    ],
  },
  {
    id: 'nn-lead', type: 'experience',
    title: 'Lead Software Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'london', locationLabel: 'Oxford and London · UK',
    period: 'Oct 2023 – Dec 2025', startYear: 2023,
    startTs: ts(2023, 10), endTs: ts(2025, 12),
    team: 'R&ED – Target Discovery',
    description: 'Accelerating Target Discovery with Cloud-Based GenAI solutions: fusing ML and Computational Biology with Software Engineering.',
    tags2: [{ icon: Brain, label: 'AI / ML' }, { icon: Dna, label: 'Computational Biology' }, { icon: Cloud, label: 'Cloud & Platform' }, { icon: FlaskConical, label: 'Pharma' }],
    arcId: 'copenhagen-london',
    closedSource: [
      {
        name: 'Gennyx',
        description: 'Scientific Committee Assistant: GenAI system to streamline scientific committee workflows and decision support.',
        tags: ['python', 'claude api', 'aws', 'react'],
        status: 'shipped',
        source: 'inner',
      },
      {
        name: 'Bio Reasoning FM Training',
        description: 'Infrastructure for Foundation Model training with OMICS data: scalable pipelines for biological sequence pre-training.',
        tags: ['python', 'pytorch', 'aws', 'kubernetes'],
        status: 'ongoing',
        source: 'inner',
      },
    ],
  },
  {
    id: 'nn-platform', type: 'experience',
    title: 'Senior Platform Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen · Denmark',
    period: 'Jan 2023 – Oct 2023', startYear: 2023,
    startTs: ts(2023, 1), endTs: ts(2023, 10),
    tags2: [{ icon: Cloud, label: 'Cloud & Platform' }, { icon: Database, label: 'Data Engineering' }, { icon: FlaskConical, label: 'Pharma' }],
    arcId: 'toulouse-copenhagen',
    closedSource: [
      {
        name: 'DataHub',
        description: 'DataAll — a fork of Novo Nordisk DataHub — an event-driven data mesh platform adapted for enterprise regulatory requirements.',
        tags: ['python', 'ts', 'aws'],
        status: 'internal',
        source: 'inner',
        url: 'https://github.com/awslabs/aws-dataall',
      },
    ],
  },
  {
    id: 'ku', type: 'education',
    title: 'MSc, Computer Science',
    organization: 'University of Copenhagen',
    organizationUrl: 'https://kurser.ku.dk/course/ndaa09027u',
    location: 'copenhagen', locationLabel: 'Copenhagen · Denmark',
    description: 'Signal and Image Processing with Fourier Analysis, Wavelets, and Deep Learning.',
    period: '2021 – 2021', startYear: 2021,
    startTs: ts(2021, 1), endTs: ts(2021, 8),
    tags2: [{ icon: Code, label: 'Computer Science' }, { icon: Brain, label: 'AI / ML' }],
    arcId: 'lisbon-copenhagen-edu',
  },
  {
    id: 'nn-senior', type: 'experience',
    title: 'Senior Software Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen · Denmark',
    period: 'Sep 2020 – Jan 2023', startYear: 2020,
    startTs: ts(2020, 9), endTs: ts(2023, 1),
    team: 'Chemistry, Manufacturing and Controls (CMC) – Lab Automation',
    tags2: [{ icon: Database, label: 'Data Engineering' }, { icon: Code, label: 'Software Engineering' }, { icon: FlaskConical, label: 'Pharma' }],
    arcId: 'toulouse-copenhagen',
    closedSource: [
      {
        name: 'CMC Campaign Cockpit',
        description: 'Monitoring toxicity and critical quality attributes in API campaigns: real-time visualisations and anomaly alerts for manufacturing batches.',
        tags: ['ts', 'python', 'aws', 'react'],
        status: 'shipped',
        source: 'inner',
      },
      {
        name: 'HPLC Performance',
        description: 'Forecasting Chemical Column Performance & Equipment Idle Time: predictive models for chromatography column degradation and maintenance scheduling.',
        tags: ['python', 'mlflow', 'aws'],
        status: 'shipped',
        source: 'inner',
      },
    ],
  },
  {
    id: 'maersk', type: 'experience',
    title: 'Software Engineer',
    organization: 'A.P. Moller – Maersk', organizationUrl: 'https://www.maersk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen · Denmark',
    period: 'Oct 2019 – Sep 2020', startYear: 2019,
    startTs: ts(2019, 10), endTs: ts(2020, 9),
    tags: '',
    tags2: [{ icon: Anchor, label: 'Shipping & Logistics' }, { icon: Database, label: 'Data Engineering' }],
    arcId: 'toulouse-copenhagen',
    closedSource: [
      {
        name: 'InRoute',
        description: 'Inland container router and container availability forecast: route optimisation and capacity prediction across intermodal networks.',
        tags: ['python', 'pyspark', 'azure', 'databricks', 'azure', 'Palantir Foundry', 'python', 'pyspark', 'databricks', 'git', 'docker'],
        status: 'internal',
        source: 'closed',
      },
      {
        name: 'Emma',
        description: 'REST API + backend to manage booking\'s insurance: microservices handling insurance policy creation, validation, and claims integration for cancelled container bookings.',
        tags: ['python', 'Palantir Foundry', 'azure'],
        status: 'internal',
        source: 'closed',
      },
    ],
  },
  {
    id: 'airbus', type: 'experience',
    title: 'Software Engineer',
    organization: 'Airbus', organizationUrl: 'https://www.airbus.com',
    location: 'toulouse', locationLabel: 'Toulouse · France',
    period: 'Sep 2018 – Sep 2019', startYear: 2018,
    startTs: ts(2018, 9), endTs: ts(2019, 9),
    description: 'Skywise Core',
    teamUrl: 'https://www.airbus.com/en/products-services/digital-services/skywise',
    tags2: [{ icon: Plane, label: 'Aerospace' }, { icon: Database, label: 'Data Engineering' }],
    note: 'contractor',
    arcId: 'lisbon-toulouse',
    closedSource: [
      {
        name: 'Skywise / Fleet Reliability',
        description: 'Benchmarking fleet performance against Airbus Engineering standards: analytical pipelines for aircraft reliability KPIs across global operator fleets.',
        tags: ['Palantir Foundry', 'python', 'pyspark', 'js', 'Palantir Foundry', 'js', 'python', 'pyspark', 'postgresql', 'git', 'docker', 'elasticsearch'],
        status: 'shipped',
        source: 'closed',
      },
      {
        name: 'A350 Quality',
        description: 'Migration of the A350 quality platform to Palantir Foundry: full data model and workflow migration for Final Assembly Line quality assurance.',
        tags: ['Palantir Foundry', 'python', 'pyspark', 'postgresql'],
        status: 'shipped',
        source: 'closed',
      },
    ],
  },
  {
    id: 'accenture-se', type: 'experience',
    title: 'Software Engineer',
    organization: 'Accenture', organizationUrl: 'https://www.accenture.com',
    location: 'lisbon', locationLabel: 'Lisbon Area · Portugal',
    period: 'Sep 2017 – Aug 2018', startYear: 2018,
    startTs: ts(2018, 3), endTs: ts(2018, 8),
    tags2: [{ icon: Briefcase, label: 'Consulting' }, { icon: Database, label: 'Data Engineering' }],
    arcId: null,
    closedSource: [
      {
        name: 'Client360',
        description: 'Unified 360° customer view for a major telco: integrating CRM, billing, and usage data into a consolidated analytics layer on Cloudera Hadoop.',
        tags: ['Cloudera Hadoop', 'pyspark', 'java', 'oracle sql', 'Cloudera Hadoop', 'pyspark', 'java', 'oracle sql/psql', 'git'],
        status: 'internal',
        source: 'closed',
      },
      {
        name: 'In-Premises Cloudera Hadoop Datalake',
        description: 'On-premises Cloudera Hadoop data lake: ingestion, governance, and serving layers for structured and semi-structured telco data at petabyte scale.',
        tags: ['Cloudera Hadoop', 'pyspark', 'java', 'psql'],
        status: 'deprecated',
        source: 'closed',
      },
      {
        name: 'ClinFlow',
        description: 'Clinical workflow automation platform for a hospital network: digitising patient-pathway orchestration, bed management, and inter-department handoffs.',
        tags: ['C# ASP.NET', 'js', 'sql server'],
        status: 'shipped',
        source: 'closed',
      },
    ],
  },
  {
    id: 'fcul-cs', type: 'education',
    title: 'BSc, Computer Software Engineering',
    organization: 'University of Lisbon',
    organizationUrl: 'https://ciencias.ulisboa.pt',
    location: 'lisbon', locationLabel: 'Lisbon · Portugal',
    period: '2015 – 2017', startYear: 2015,
    startTs: ts(2015, 9), endTs: ts(2017, 6),
    description: 'Computer Architecture, Networks, Operating Systems, Distributed Systems, Software Engineering, Algorithms and Machine Learning.',
    tags2: [{ icon: Code, label: 'Computer Science' }, { icon: Brain, label: 'AI / ML' }],
    arcId: null,
  },
  {
    id: 'fcul-math', type: 'education',
    title: 'BSc, Mathematics',
    organization: 'University of Lisbon',
    organizationUrl: 'https://ciencias.ulisboa.pt',
    location: 'lisbon', locationLabel: 'Lisbon · Portugal',
    period: '2014 – 2015', startYear: 2014,
    startTs: ts(2014, 9), endTs: ts(2015, 6),
    description: 'Calculus, Algebra, Discrete Mathematics and Logic.',
    tags2: [{ icon: Calculator, label: 'Mathematics' }],
    arcId: null,
  },
  {
    id: 'flul-phil', type: 'education',
    title: 'BPhil, Philosophy',
    organization: 'University of Lisbon',
    organizationUrl: 'https://letras.ulisboa.pt',
    location: 'lisbon', locationLabel: 'Lisbon · Portugal',
    period: '2011 – 2014', startYear: 2011,
    startTs: ts(2011, 9), endTs: ts(2014, 6),
    description: 'Logic, Philosophy of Mathematics, Mathematical Logic, and Philosophy of Language.',
    thesis: 'The Logicist Program of Arithmetic: Frege and Russell',
    tags2: [{ icon: BookOpen, label: 'Philosophy' }, { icon: Calculator, label: 'Mathematics' }],
    arcId: null,
  },
]

// ─── thesis download ──────────────────────────────────────────────────────────

function ThesisDownload({ title }: { title: string }) {
  const [phase, setPhase] = useState<CapturePhase>('idle')
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setPhase('done')
    setTimeout(() => { setPhase('idle'); setEmail('') }, 2200)
  }

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0.75rem 0.9rem',
        border: '1px solid var(--border)',
        borderRadius: 5,
        background: 'var(--card-bg)',
      }}
      onClick={e => e.stopPropagation()}
    >
      <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        Thesis
      </span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginTop: '0.3rem' }}>
        <span style={{ fontSize: '0.72rem', fontStyle: 'italic', color: 'var(--desc)' }}>{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={() => phase === 'idle' && setPhase('open')}
            aria-label={phase === 'done' ? 'Sent' : 'Download thesis'}
            style={{
              background: 'none', border: 'none', padding: '0.15rem',
              cursor: phase === 'done' ? 'default' : 'pointer',
              color: phase === 'done' ? 'var(--accent)' : 'var(--muted)',
              display: 'flex', alignItems: 'center', transition: 'color 0.2s',
            }}
            onMouseEnter={e => { if (phase === 'idle') (e.currentTarget as HTMLElement).style.color = 'var(--fg)' }}
            onMouseLeave={e => { if (phase === 'idle') (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
          >
            {phase === 'done' ? <Check size={13} strokeWidth={1.5} /> : <Download size={13} strokeWidth={1.5} />}
          </button>

          <AnimatePresence>
            {phase === 'open' && (
              <motion.form
                key="thesis-email"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                onSubmit={handleSubmit}
                style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
              >
                <input
                  autoFocus
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Escape' && setPhase('idle')}
                  style={{
                    background: 'none', border: 'none',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--fg)', fontSize: '0.68rem',
                    padding: '0.1rem 0.2rem', outline: 'none',
                    fontFamily: 'var(--font-sans)', width: 140,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--muted)', fontSize: '0.72rem', padding: '0.1rem',
                    display: 'flex', alignItems: 'center', flexShrink: 0,
                  }}
                >→</button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─── timeline entry ───────────────────────────────────────────────────────────

function Entry({
  entry, isActive, entryRef, onClick,
}: {
  entry: TimelineEntry
  isActive: boolean
  entryRef: (el: HTMLDivElement | null) => void
  onClick: () => void
}) {
  const orgLogo = ORG_LOGO[entry.id]
  const logoHeight = orgLogo?.height ?? 26
  const CYAN   = '#00e5ff'
  const PURPLE = '#cc44ff'
  const typeColor = entry.type === 'experience' ? CYAN : PURPLE
  const opacity = 1

  const statusColor: Record<string, string> = {
    shipped:    'rgba(0,229,255,0.55)',
    ongoing:    'rgba(100,220,100,0.6)',
    internal:   'rgba(180,180,180,0.45)',
    deprecated: 'rgba(180,180,180,0.28)',
  }

  // Derive section label from project source type
  function sectionLabel(projects: ClosedSourceProject[]) {
    const inner  = projects.some(p => p.source === 'inner')
    const closed = projects.some(p => p.source !== 'inner')
    if (inner && !closed) return 'Inner Source'
    if (closed && !inner) return 'Closed Source'
    return 'Projects'
  }

  return (
    <div
      ref={entryRef}
      style={{
        padding: '1.5rem 1rem',
        borderTop: '1px solid var(--border)',
        opacity,
        background: isActive ? 'var(--card-bg-hover)' : 'transparent',
        transition: 'opacity 0.35s ease, background 0.2s',
        cursor: 'pointer',
        borderRadius: 6,
      }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--card-bg-hover)' }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      onClick={onClick}
    >
      {/* Type badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: typeColor, flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: typeColor, opacity: 0.85 }}>
          {entry.type}
        </span>
      </div>

      {/* Title + period */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
        <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
          {entry.title}
        </span>
        <span style={{ fontSize: '0.68rem', color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{entry.period}</span>
      </div>

      {/* Organisation logo */}
      {orgLogo && (
        <div style={{ marginTop: '0.3rem', display: 'inline-block' }} title={entry.organization}>
          <img
            src={orgLogo.src}
            alt={entry.organization}
            style={{ height: logoHeight, width: 'auto', maxWidth: 100, objectFit: 'contain', opacity: 0.5, flexShrink: 0, display: 'block' }}
          />
        </div>
      )}

      {/* Expanded content */}
      <div style={{
        maxHeight: isActive ? '900px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{entry.locationLabel}</span>
          {entry.note && <span style={{ fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic' }}>· {entry.note}</span>}
        </div>

        {entry.team && (
          <div style={{ marginTop: '0.3rem' }}>
            {entry.teamUrl
              ? <a href={entry.teamUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'rgba(128,128,128,0.3)' }}>{entry.team}</a>
              : <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{entry.team}</span>
            }
          </div>
        )}

        {entry.description && <p style={{ marginTop: '0.6rem', fontSize: '0.8rem', lineHeight: 1.65, color: 'var(--desc)' }}>{entry.description}</p>}

        {/* Thesis */}
        {entry.thesis && <ThesisDownload title={entry.thesis} />}

        {entry.tags && <TechTags tags={entry.tags} />}

        {entry.tags2 && (
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {entry.tags2.map(({ icon: Icon, label }) => (
              <span key={label} title={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
                <Icon size={11} strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Closed / Inner Source projects */}
        {entry.closedSource && entry.closedSource.length > 0 && (
          <div style={{ marginTop: '1.25rem' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.7rem' }}>
              {sectionLabel(entry.closedSource)}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {entry.closedSource.map(p => (
                <div
                  key={p.name}
                  style={{
                    padding: '0.75rem 0.9rem',
                    border: '1px solid var(--border)',
                    borderRadius: 5,
                    background: 'var(--card-bg)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    {p.url
                      ? <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--fg)', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'var(--border)' }}>{p.name}</a>
                      : <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--fg)' }}>{p.name}</span>
                    }
                    <span style={{ fontSize: '0.7rem', color: statusColor[p.status] ?? 'var(--muted)', flexShrink: 0 }}>{p.status}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: '0.5rem' }}>{p.description}</p>
                  <TechTagList tags={p.tags} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

const GLOB_W = '44vw'

export default function About() {
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())
  const [entryHeights, setEntryHeights] = useState<number[]>([])
  const [githubDescs, setGithubDescs] = useState<Record<string, string>>({})
  const refs = useRef<(HTMLDivElement | null)[]>([])

  // Stable key that changes whenever the selected set changes
  const activeIndexKey = [...activeIndices].sort().join(',')

  // Measure entry heights for git graph alignment
  useLayoutEffect(() => {
    const measure = () => setEntryHeights(refs.current.map(el => el?.offsetHeight ?? 0))
    measure()
    const ro = new ResizeObserver(measure)
    refs.current.forEach(el => { if (el) ro.observe(el) })
    return () => ro.disconnect()
  }, [])

  // Fetch GitHub descriptions
  useEffect(() => {
    PROJECTS.forEach(async p => {
      try {
        const match = p.url.match(/github\.com\/([^/]+)\/([^/]+)/)
        if (!match) return
        const [, owner, repo] = match
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
        if (!res.ok) return
        const data = await res.json() as { description?: string }
        if (data.description) {
          setGithubDescs(prev => ({ ...prev, [p.name]: data.description! }))
        }
      } catch { /* silent fallback */ }
    })
  }, [])

  const primaryActiveEntry = activeIndices.size === 1
    ? TIMELINE[[...activeIndices][0]]
    : null

  // Derive location from the active set (works for 1 or many entries at same city)
  const activeLocations = new Set([...activeIndices].map(i => TIMELINE[i].location))
  const activeGlobeLocation = activeLocations.size === 1 ? [...activeLocations][0] : null

  function toggleEntry(idx: number) {
    setActiveIndices(prev => {
      if (prev.size === 1 && prev.has(idx)) return new Set()
      return new Set([idx])
    })
  }

  function handleCityClick(locationKey: string) {
    const matching = TIMELINE.map((e, i) => ({ e, i })).filter(({ e }) => e.location === locationKey).map(({ i }) => i)
    if (matching.length === 0) return
    setActiveIndices(prev => {
      const allActive = matching.every(i => prev.has(i))
      return allActive ? new Set() : new Set(matching)
    })
    setTimeout(() => refs.current[matching[0]]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const { _setOnCityClick, _setGlobeState } = useGlobeCtx()

  const cityClickFnRef = useRef(handleCityClick)
  useEffect(() => { cityClickFnRef.current = handleCityClick })
  useEffect(() => {
    _setOnCityClick((key) => cityClickFnRef.current(key))
    return () => _setOnCityClick(() => {})
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // Re-run whenever the selected set changes (not just when arcId or location changes)
  useEffect(() => {
    _setGlobeState({
      activeArc: primaryActiveEntry?.arcId ?? null,
      activeLocation: activeGlobeLocation,
    })
  }, [activeIndexKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* ── Right panel ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ marginLeft: GLOB_W, position: 'relative', zIndex: 2 }}
      >
        {/* Hero */}
        <div style={{ padding: '4rem 3.5rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <h1
              className="text-4xl font-semibold tracking-tight"
              style={{
                background: 'var(--hero-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Diogo Pereira-Marques
            </h1>
            <EmailCapture />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Principal AI Engineer · London, UK</p>
        </div>

        <div style={{ padding: '0 3.5rem 8rem' }}>

          {/* ── Open Source Projects ── */}
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>
            Open Source
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '3.5rem' }}>
            {PROJECTS.map(p => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  padding: '1rem 1.1rem',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  textDecoration: 'none',
                  background: 'transparent',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(128,128,128,0.35)'
                  ;(e.currentTarget as HTMLElement).style.background = 'var(--card-bg-hover)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <GithubIcon size={13} style={{ color: 'var(--muted)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--fg)' }}>{p.name}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--muted)', opacity: 0.6 }}>{p.org}</span>
                </div>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: '0.65rem' }}>
                  {githubDescs[p.name] || p.description}
                </p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {p.tags.map(t => (
                    <span key={t} style={{
                      fontSize: '0.6rem', padding: '0.15rem 0.5rem',
                      border: '1px solid var(--border)', borderRadius: 20,
                      color: 'var(--muted)',
                    }}>{t}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          {/* ── Experience & Education ── */}
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.2rem' }}>
            Experience & Education
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--hint)', marginBottom: '0.5rem' }}>
            scroll to explore · select to expand
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            <GitGraph
              entries={TIMELINE.map(e => ({
                type: e.type,
                branchLabel: branchLabel(e),
                startTs: e.startTs,
                endTs: e.endTs,
              }))}
              activeIndices={activeIndices}
              entryHeights={entryHeights}
              onNodeClick={idx => {
                toggleEntry(idx)
                refs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
              }}
            />

            {/* Timeline entries */}
            <div style={{ flex: 1 }}>
              {TIMELINE.map((entry, idx) => (
                <Entry
                  key={entry.id}
                  entry={entry}
                  isActive={activeIndices.has(idx)}
                  entryRef={el => { refs.current[idx] = el }}
                  onClick={() => toggleEntry(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
