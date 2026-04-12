import { useState, useLayoutEffect, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain, Database, Cloud, Anchor, Plane, Briefcase,
  Code, BookOpen, Calculator, FlaskConical, Dna,
  Download, X,
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
  startTs: number       // Date.UTC timestamp — for lane overlap computation
  endTs: number | null  // null = ongoing / present
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
    name: 'topgun',
    org: 'diogobaltazar',
    url: 'https://github.com/diogobaltazar/topgun',
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
    location: 'london', locationLabel: 'London, UK · On-site',
    period: 'Jan 2026 – Present', startYear: 2026,
    startTs: ts(2026, 1), endTs: null,
    team: 'Lab-In-The-Loop @ gRED Computational Sciences',
    teamUrl: 'https://www.roche.com/research_and_development/who_we_are_how_we_work/research/computational-sciences',
    tags2: [{ icon: Brain, label: 'AI / ML' }, { icon: FlaskConical, label: 'Pharma & Biotech' }, { icon: Dna, label: 'Computational Biology' }],
    arcId: 'copenhagen-london',
    closedSource: [
      { name: 'Lab Agent', description: 'Autonomous agentic loop for Lab-in-the-Loop experimental workflows.', tags: ['python', 'aws', 'claude api'], status: 'ongoing' },
      { name: 'Protein Atlas Pipeline', description: 'Large-scale protein sequence embedding and retrieval pipeline.', tags: ['python', 'pytorch', 'aws'], status: 'ongoing' },
    ],
  },
  {
    id: 'nn-lead', type: 'experience',
    title: 'Lead Software Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'london', locationLabel: 'Oxford and London, UK',
    period: 'Oct 2023 – Dec 2025', startYear: 2023,
    startTs: ts(2023, 10), endTs: ts(2025, 12),
    team: 'R&ED – Target Discovery',
    description: 'Accelerating Target Discovery with Cloud-Based GenAI solutions: fusing ML and Computational Biology with Software Engineering.',
    tags2: [{ icon: Brain, label: 'AI / ML' }, { icon: Dna, label: 'Computational Biology' }, { icon: Cloud, label: 'Cloud & Platform' }, { icon: FlaskConical, label: 'Pharma' }],
    arcId: 'copenhagen-london',
    closedSource: [
      { name: 'Target Discovery RAG', description: 'Retrieval-augmented generation system for biological literature mining across 40M+ papers.', tags: ['python', 'aws', 'llm', 'vector db'], status: 'shipped' },
      { name: 'Omics Integration Platform', description: 'Cloud-native platform for multi-omics data integration and ML-driven target scoring.', tags: ['python', 'aws', 'spark', 'mlflow'], status: 'shipped' },
    ],
  },
  {
    id: 'nn-platform', type: 'experience',
    title: 'Senior Platform Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen, Denmark',
    period: 'Jan 2023 – Oct 2023', startYear: 2023,
    startTs: ts(2023, 1), endTs: ts(2023, 10),
    team: 'PS – Data Management & Analytics',
    teamUrl: 'https://github.com/awslabs/aws-dataall',
    description: 'Data mesh (event-driven) architecture in AWS — see the open-source version at github.com/awslabs/aws-dataall',
    tags: 'ts, python, aws, docker, git, github, gnu',
    tags2: [{ icon: Cloud, label: 'Cloud & Platform' }, { icon: Database, label: 'Data Engineering' }, { icon: FlaskConical, label: 'Pharma' }],
    arcId: 'toulouse-copenhagen',
    closedSource: [
      { name: 'DataAll (internal)', description: 'Internal fork of the AWS DataAll data mesh platform, adapted for Novo Nordisk regulatory requirements.', tags: ['python', 'ts', 'aws', 'cdk'], status: 'internal' },
    ],
  },
  {
    id: 'ku', type: 'education',
    title: 'MSc, Computer Science',
    organization: 'University of Copenhagen',
    organizationUrl: 'https://kurser.ku.dk/course/ndaa09027u',
    location: 'copenhagen', locationLabel: 'Copenhagen, Denmark',
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
    location: 'copenhagen', locationLabel: 'Copenhagen, Denmark',
    period: 'Sep 2020 – Jan 2023', startYear: 2020,
    startTs: ts(2020, 9), endTs: ts(2023, 1),
    team: 'CMC – Laboratory Digitalisation',
    description: 'Visualisations, data products, data pipelines, APIs.',
    tags: 'ts, js, python, aws, docker, git, github, gnu',
    tags2: [{ icon: Database, label: 'Data Engineering' }, { icon: Code, label: 'Software Engineering' }, { icon: FlaskConical, label: 'Pharma' }],
    arcId: 'toulouse-copenhagen',
    closedSource: [
      { name: 'Lab Digitalisation Suite', description: 'Full-stack web application for digitising CMC laboratory workflows and instrument data capture.', tags: ['ts', 'python', 'aws', 'react'], status: 'shipped' },
      { name: 'Batch Analytics Dashboard', description: 'Real-time analytics and anomaly detection dashboards for pharmaceutical batch manufacturing.', tags: ['python', 'plotly', 'aws', 'sql'], status: 'internal' },
    ],
  },
  {
    id: 'maersk', type: 'experience',
    title: 'Software Engineer',
    organization: 'A.P. Moller – Maersk', organizationUrl: 'https://www.maersk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen · On-site',
    period: 'Oct 2019 – Sep 2020', startYear: 2019,
    startTs: ts(2019, 10), endTs: ts(2020, 9),
    team: 'Inland Container Logistics',
    description: 'Data pipelines and APIs.',
    tags: 'azure, Palantir Foundry, python, pyspark, databricks, git, docker',
    tags2: [{ icon: Anchor, label: 'Shipping & Logistics' }, { icon: Database, label: 'Data Engineering' }],
    arcId: 'toulouse-copenhagen',
    closedSource: [
      { name: 'Inland Logistics Pipeline', description: 'End-to-end data pipeline for inland container movement tracking and forecasting.', tags: ['python', 'pyspark', 'azure', 'databricks'], status: 'internal' },
    ],
  },
  {
    id: 'airbus', type: 'experience',
    title: 'Software Engineer',
    organization: 'Airbus', organizationUrl: 'https://www.airbus.com',
    location: 'toulouse', locationLabel: 'Toulouse · On-site',
    period: 'Sep 2018 – Sep 2019', startYear: 2018,
    startTs: ts(2018, 9), endTs: ts(2019, 9),
    description: 'Fleet Reliability – Skywise Core. Migration of Airbus A350 FAL Quality Platform to Skywise.',
    tags: 'Palantir Foundry, js, AWS, python, pyspark, postgresql, git, docker, nosql, elasticsearch',
    tags2: [{ icon: Plane, label: 'Aerospace' }, { icon: Database, label: 'Data Engineering' }],
    note: 'contractor',
    arcId: 'lisbon-toulouse',
    closedSource: [
      { name: 'A350 Quality Platform', description: 'Migration of the Airbus A350 Final Assembly Line quality platform to Skywise (Palantir Foundry).', tags: ['Palantir Foundry', 'python', 'pyspark', 'js'], status: 'shipped' },
    ],
  },
  {
    id: 'accenture-se', type: 'experience',
    title: 'Software Engineer',
    organization: 'Accenture', organizationUrl: 'https://www.accenture.com',
    location: 'lisbon', locationLabel: 'Lisbon Area, Portugal',
    period: 'Mar 2018 – Aug 2018', startYear: 2018,
    startTs: ts(2018, 3), endTs: ts(2018, 8),
    description: 'On-premises Cloudera Data Lake (telco).',
    tags: 'Cloudera Hadoop, pyspark, java, oracle sql/psql, git',
    tags2: [{ icon: Briefcase, label: 'Consulting' }, { icon: Database, label: 'Data Engineering' }],
    arcId: null,
    closedSource: [
      { name: 'Telco Data Lake', description: 'On-premises Cloudera Hadoop data lake for a major Portuguese telecommunications operator.', tags: ['Cloudera', 'pyspark', 'java', 'oracle sql'], status: 'deprecated' },
    ],
  },
  {
    id: 'accenture-fsd', type: 'experience',
    title: 'Full-stack Developer',
    organization: 'Accenture', organizationUrl: 'https://www.accenture.com',
    location: 'lisbon', locationLabel: 'Lisbon Area, Portugal',
    period: 'Sep 2017 – Feb 2018', startYear: 2017,
    startTs: ts(2017, 9), endTs: ts(2018, 2),
    tags: 'C# ASP.NET, js, git',
    tags2: [{ icon: Briefcase, label: 'Consulting' }, { icon: Code, label: 'Software Engineering' }],
    arcId: null,
    closedSource: [
      { name: 'Client Portal', description: 'Full-stack web portal for an insurance client, built with C# ASP.NET and vanilla JS.', tags: ['C# ASP.NET', 'js', 'sql server'], status: 'deprecated' },
    ],
  },
  {
    id: 'fcul-cs', type: 'education',
    title: 'BSc, Computer Software Engineering',
    organization: 'University of Lisbon',
    organizationUrl: 'https://ciencias.ulisboa.pt',
    location: 'lisbon', locationLabel: 'Lisbon, Portugal',
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
    location: 'lisbon', locationLabel: 'Lisbon, Portugal',
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
    location: 'lisbon', locationLabel: 'Lisbon, Portugal',
    period: '2011 – 2014', startYear: 2011,
    startTs: ts(2011, 9), endTs: ts(2014, 6),
    description: 'Logic, Philosophy of Mathematics, Mathematical Logic, and Philosophy of Language.',
    thesis: 'The Logicist Program of Arithmetic: Frege and Russell',
    tags2: [{ icon: BookOpen, label: 'Philosophy' }, { icon: Calculator, label: 'Mathematics' }],
    arcId: null,
  },
]

// ─── PDF modal ────────────────────────────────────────────────────────────────

function PdfModal({ onClose }: { onClose: () => void }) {
  const token = new URLSearchParams(window.location.search).get('token')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0d0d0d', border: '1px solid var(--border)',
          borderRadius: 8, padding: '2rem', maxWidth: 360, width: '90%', position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} aria-label="Close" style={{
          position: 'absolute', top: '1rem', right: '1rem',
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 0,
        }}>
          <X size={15} strokeWidth={1.5} />
        </button>

        {token ? (
          <>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Access granted</p>
            <p style={{ fontSize: '0.8rem', color: '#c8c8c8', marginBottom: '1.5rem' }}>Use your browser's print dialog to save as PDF.</p>
            <button onClick={() => window.print()} style={submitBtn}>Print / Save as PDF</button>
          </>
        ) : submitted ? (
          <>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.75rem' }}>Request received</p>
            <p style={{ fontSize: '0.8rem', color: '#c8c8c8' }}>You'll receive a link shortly.</p>
          </>
        ) : (
          <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Request CV</p>
            <p style={{ fontSize: '0.8rem', color: '#c8c8c8', marginBottom: '1.25rem' }}>Enter your email and I'll send a PDF copy.</p>
            <input
              type="email" required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%', padding: '0.55rem 0.75rem', marginBottom: '0.75rem',
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                borderRadius: 4, color: 'var(--fg)', fontSize: '0.8rem',
                outline: 'none', fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
              }}
            />
            <button type="submit" style={submitBtn}>Send request</button>
          </form>
        )}
      </div>
    </div>
  )
}

const submitBtn: React.CSSProperties = {
  width: '100%', padding: '0.6rem 1rem',
  background: 'rgba(255,255,255,0.07)', border: '1px solid var(--border)',
  borderRadius: 4, color: 'var(--fg)', fontSize: '0.78rem',
  cursor: 'pointer', letterSpacing: '0.05em', fontFamily: 'var(--font-sans)',
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
  const opacity = isActive ? 1 : 0.3

  const statusColor: Record<string, string> = {
    shipped: 'rgba(0,229,255,0.5)',
    ongoing: 'rgba(100,220,100,0.5)',
    internal: 'rgba(180,180,180,0.4)',
    deprecated: 'rgba(180,180,180,0.25)',
  }

  return (
    <div
      ref={entryRef}
      style={{
        padding: '1.5rem 0',
        borderTop: '1px solid var(--border)',
        opacity,
        transition: 'opacity 0.35s ease',
        cursor: 'pointer',
      }}
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

      {/* Organisation logo — always visible, name on hover */}
      {orgLogo && (
        <div style={{ marginTop: '0.3rem', display: 'inline-block' }} title={entry.organization}>
          <img
            src={orgLogo.src}
            alt={entry.organization}
            style={{ height: logoHeight, width: 'auto', maxWidth: 100, objectFit: 'contain', opacity: 0.5, flexShrink: 0, display: 'block' }}
          />
        </div>
      )}

      {/* ── Expanded content — animated via max-height ── */}
      <div style={{
        maxHeight: isActive ? '800px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Location + note (organisation already shown in collapsed header) */}
        <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--muted)', opacity: 0.55 }}>{entry.locationLabel}</span>
          {entry.note && <span style={{ fontSize: '0.68rem', color: 'var(--muted)', opacity: 0.55, fontStyle: 'italic' }}>· {entry.note}</span>}
        </div>

        {/* Team */}
        {entry.team && (
          <div style={{ marginTop: '0.3rem' }}>
            {entry.teamUrl
              ? <a href={entry.teamUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.7rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'rgba(255,255,255,0.12)' }}>{entry.team}</a>
              : <span style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{entry.team}</span>
            }
          </div>
        )}

        {entry.description && <p style={{ marginTop: '0.6rem', fontSize: '0.8rem', lineHeight: 1.65, color: '#c8c8c8' }}>{entry.description}</p>}
        {entry.thesis && <p style={{ marginTop: '0.4rem', fontSize: '0.7rem', fontStyle: 'italic', color: 'var(--muted)' }}>Thesis: {entry.thesis}</p>}
        {entry.tags && <TechTags tags={entry.tags} />}

        {/* Domain tags */}
        {entry.tags2 && (
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            {entry.tags2.map(({ icon: Icon, label }) => (
              <span key={label} title={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.62rem', color: 'var(--muted)', opacity: 0.6 }}>
                <Icon size={11} strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* ── Closed Source ── */}
        {entry.closedSource && entry.closedSource.length > 0 && (
          <div style={{ marginTop: '1.25rem' }} onClick={e => e.stopPropagation()}>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.7rem' }}>
              Closed Source
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {entry.closedSource.map(p => (
                <div
                  key={p.name}
                  style={{
                    padding: '0.75rem 0.9rem',
                    border: '1px solid var(--border)',
                    borderRadius: 5,
                    background: 'rgba(255,255,255,0.015)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--fg)' }}>{p.name}</span>
                    <span style={{ fontSize: '0.58rem', color: statusColor[p.status] ?? 'var(--muted)', flexShrink: 0 }}>{p.status}</span>
                  </div>
                  <p style={{ fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: '0.5rem' }}>{p.description}</p>
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

const GLOB_W = '44vw'  // width of the fixed globe panel

export default function About() {
  const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())
  const [activeGlobeLocation, setActiveGlobeLocation] = useState<string | null>(null)
  const [pdfOpen, setPdfOpen]       = useState(false)
  const [entryHeights, setEntryHeights] = useState<number[]>([])
  const refs = useRef<(HTMLDivElement | null)[]>([])

  // Measure entry heights for git graph alignment
  useLayoutEffect(() => {
    const measure = () => setEntryHeights(refs.current.map(el => el?.offsetHeight ?? 0))
    measure()
    const ro = new ResizeObserver(measure)
    refs.current.forEach(el => { if (el) ro.observe(el) })
    return () => ro.disconnect()
  }, [])

  // Primary entry: when exactly one is active, use it for globe arc + location
  const primaryActiveEntry = activeIndices.size === 1
    ? TIMELINE[[...activeIndices][0]]
    : null

  function toggleEntry(idx: number) {
    setActiveIndices(prev => {
      if (prev.size === 1 && prev.has(idx)) return new Set()
      return new Set([idx])
    })
    setActiveGlobeLocation(TIMELINE[idx].location)
  }

  // Globe city click → expand all entries at that location
  function handleCityClick(locationKey: string) {
    const matching = TIMELINE.map((e, i) => ({ e, i })).filter(({ e }) => e.location === locationKey).map(({ i }) => i)
    if (matching.length === 0) return
    setActiveIndices(prev => {
      const allActive = matching.every(i => prev.has(i))
      return allActive ? new Set() : new Set(matching)
    })
    setActiveGlobeLocation(locationKey)
    setTimeout(() => refs.current[matching[0]]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  // ── Sync globe state to Layout via context ──────────────────────────────────
  const { _setOnCityClick, _setGlobeState } = useGlobeCtx()

  // Register click handler once, using a ref so it always calls the latest closure
  const cityClickFnRef = useRef(handleCityClick)
  useEffect(() => { cityClickFnRef.current = handleCityClick })
  useEffect(() => {
    _setOnCityClick((key) => cityClickFnRef.current(key))
    return () => _setOnCityClick(() => {})
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // Sync active arc + location whenever selection changes
  useEffect(() => {
    _setGlobeState({
      activeArc: primaryActiveEntry?.arcId ?? null,
      activeLocation: activeGlobeLocation,
    })
  }, [primaryActiveEntry?.arcId, activeGlobeLocation]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {pdfOpen && <PdfModal onClose={() => setPdfOpen(false)} />}

      {/* ── Right panel — scrolls normally, above globe ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ marginLeft: GLOB_W, position: 'relative', zIndex: 2 }}
      >
        {/* Hero */}
        <div style={{ padding: '4rem 3.5rem 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <h1
              className="text-4xl font-semibold tracking-tight"
              style={{
                background: 'linear-gradient(to bottom, #ffffff 50%, rgba(255,255,255,0.5))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Diogo Pereira-Marques
            </h1>
            <button
              onClick={() => setPdfOpen(true)}
              aria-label="Download CV"
              title="Download CV"
              style={{
                background: 'none', border: 'none', padding: '0.2rem',
                cursor: 'pointer', color: 'var(--muted)', transition: 'color 0.2s',
                display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
            >
              <Download size={15} strokeWidth={1.5} />
            </button>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Principal AI Engineer · London, UK</p>
        </div>

        <div style={{ padding: '0 3.5rem 8rem' }}>

          {/* ── Projects ── */}
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
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
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
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)', lineHeight: 1.55, marginBottom: '0.65rem' }}>{p.description}</p>
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
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.18)', marginBottom: '0.5rem' }}>
            scroll to explore · select to expand
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            {/* Git graph — scrolls with entries */}
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
