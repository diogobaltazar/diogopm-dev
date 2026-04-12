import { useState, useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Brain, Database, Cloud, Anchor, Plane, Briefcase,
  Code, BookOpen, Calculator, FlaskConical, Dna,
  Download, X,
} from 'lucide-react'
import { FaGithub as GithubIcon } from 'react-icons/fa'
import Globe from '../components/Globe'
import GitGraph from '../components/GitGraph'

// ─── types ────────────────────────────────────────────────────────────────────

type LocationKey = 'lisbon' | 'toulouse' | 'copenhagen' | 'london'
type ArcId =
  | 'lisbon-toulouse'
  | 'toulouse-copenhagen'
  | 'copenhagen-london'
  | 'lisbon-copenhagen-edu'
  | null

interface Tag { icon: React.ElementType; label: string }

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
  team?: string
  teamUrl?: string
  description?: string
  tags?: string
  tags2?: Tag[]
  note?: string
  thesis?: string
  arcId: ArcId
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
    team: 'Lab-In-The-Loop @ gRED Computational Sciences',
    teamUrl: 'https://www.roche.com/research_and_development/who_we_are_how_we_work/research/computational-sciences',
    tags2: [{ icon: Brain, label: 'AI / ML' }, { icon: FlaskConical, label: 'Pharma & Biotech' }, { icon: Dna, label: 'Computational Biology' }],
    arcId: 'copenhagen-london',
  },
  {
    id: 'nn-lead', type: 'experience',
    title: 'Lead Software Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'london', locationLabel: 'London Area, UK',
    period: 'Oct 2023 – Dec 2025', startYear: 2023,
    team: 'R&ED – Target Discovery',
    description: 'Accelerating Target Discovery with Cloud-Based GenAI solutions: fusing ML and Computational Biology with Software Engineering.',
    tags2: [{ icon: Brain, label: 'AI / ML' }, { icon: Dna, label: 'Computational Biology' }, { icon: Cloud, label: 'Cloud & Platform' }, { icon: FlaskConical, label: 'Pharma' }],
    arcId: 'copenhagen-london',
  },
  {
    id: 'nn-platform', type: 'experience',
    title: 'Senior Platform Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen, Denmark',
    period: 'Jan 2023 – Oct 2023', startYear: 2023,
    team: 'PS – Data Management & Analytics',
    teamUrl: 'https://github.com/awslabs/aws-dataall',
    description: 'Data mesh (event-driven) architecture in AWS — see the open-source version at github.com/awslabs/aws-dataall',
    tags: 'ts, python, aws, docker, git, github, gnu',
    tags2: [{ icon: Cloud, label: 'Cloud & Platform' }, { icon: Database, label: 'Data Engineering' }, { icon: FlaskConical, label: 'Pharma' }],
    arcId: 'toulouse-copenhagen',
  },
  {
    id: 'ku', type: 'education',
    title: 'MSc, Computer Science',
    organization: 'Københavns Universitet – University of Copenhagen',
    organizationUrl: 'https://kurser.ku.dk/course/ndaa09027u',
    location: 'copenhagen', locationLabel: 'Copenhagen, Denmark',
    period: '2021', startYear: 2021,
    tags2: [{ icon: Code, label: 'Computer Science' }, { icon: Brain, label: 'AI / ML' }],
    arcId: 'lisbon-copenhagen-edu',
  },
  {
    id: 'nn-senior', type: 'experience',
    title: 'Senior Software Engineer',
    organization: 'Novo Nordisk', organizationUrl: 'https://www.novonordisk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen, Denmark',
    period: 'Sep 2020 – Jan 2023', startYear: 2020,
    team: 'CMC – Laboratory Digitalisation',
    description: 'Visualisations, data products, data pipelines, APIs.',
    tags: 'ts, js, python, aws, docker, git, github, gnu',
    tags2: [{ icon: Database, label: 'Data Engineering' }, { icon: Code, label: 'Software Engineering' }, { icon: FlaskConical, label: 'Pharma' }],
    arcId: 'toulouse-copenhagen',
  },
  {
    id: 'maersk', type: 'experience',
    title: 'Software Engineer',
    organization: 'A.P. Moller – Maersk', organizationUrl: 'https://www.maersk.com',
    location: 'copenhagen', locationLabel: 'Copenhagen Metropolitan Area · On-site',
    period: 'Oct 2019 – Sep 2020', startYear: 2019,
    team: 'Inland Container Logistics',
    description: 'Data pipelines and APIs.',
    tags: 'azure, Palantir Foundry, python, pyspark, databricks, git, docker',
    tags2: [{ icon: Anchor, label: 'Shipping & Logistics' }, { icon: Database, label: 'Data Engineering' }],
    arcId: 'toulouse-copenhagen',
  },
  {
    id: 'airbus', type: 'experience',
    title: 'Software Engineer',
    organization: 'Airbus', organizationUrl: 'https://www.airbus.com',
    location: 'toulouse', locationLabel: 'Greater Toulouse Metropolitan Area · On-site',
    period: 'Sep 2018 – Oct 2019', startYear: 2018,
    description: 'Fleet Reliability – Skywise Core. Migration of Airbus A350 FAL Quality Platform to Skywise.',
    tags: 'Palantir Foundry, js, AWS, python, pyspark, postgresql, git, docker, nosql, elasticsearch',
    tags2: [{ icon: Plane, label: 'Aerospace' }, { icon: Database, label: 'Data Engineering' }],
    note: 'contractor',
    arcId: 'lisbon-toulouse',
  },
  {
    id: 'accenture-se', type: 'experience',
    title: 'Software Engineer',
    organization: 'Accenture', organizationUrl: 'https://www.accenture.com',
    location: 'lisbon', locationLabel: 'Lisbon Area, Portugal',
    period: 'Mar 2018 – Aug 2018', startYear: 2018,
    description: 'On-premises Cloudera Data Lake (telco).',
    tags: 'Cloudera Hadoop, pyspark, java, oracle sql/psql, git',
    tags2: [{ icon: Briefcase, label: 'Consulting' }, { icon: Database, label: 'Data Engineering' }],
    arcId: null,
  },
  {
    id: 'accenture-fsd', type: 'experience',
    title: 'Full-stack Developer',
    organization: 'Accenture', organizationUrl: 'https://www.accenture.com',
    location: 'lisbon', locationLabel: 'Lisbon Area, Portugal',
    period: 'Sep 2017 – Feb 2018', startYear: 2017,
    tags: 'C# ASP.NET, js, git',
    tags2: [{ icon: Briefcase, label: 'Consulting' }, { icon: Code, label: 'Software Engineering' }],
    arcId: null,
  },
  {
    id: 'fcul-cs', type: 'education',
    title: 'BSc, Computer Software Engineering',
    organization: 'Faculdade de Ciências da Universidade de Lisboa',
    organizationUrl: 'https://ciencias.ulisboa.pt',
    location: 'lisbon', locationLabel: 'Lisbon, Portugal',
    period: '2015 – 2018', startYear: 2015,
    description: 'Cybersecurity, AI, Machine Learning, Statistics, Software Engineering, Algorithms.',
    tags2: [{ icon: Code, label: 'Computer Science' }, { icon: Brain, label: 'AI / ML' }],
    arcId: null,
  },
  {
    id: 'fcul-math', type: 'education',
    title: 'BSc, Mathematics',
    organization: 'Faculdade de Ciências da Universidade de Lisboa',
    organizationUrl: 'https://ciencias.ulisboa.pt',
    location: 'lisbon', locationLabel: 'Lisbon, Portugal',
    period: '2014 – 2015', startYear: 2014,
    description: 'Real Analysis, Algebra, Discrete Mathematics, Logic.',
    tags2: [{ icon: Calculator, label: 'Mathematics' }],
    arcId: null,
  },
  {
    id: 'flul-phil', type: 'education',
    title: 'BPhil, Philosophy',
    organization: 'Faculdade de Letras da Universidade de Lisboa',
    organizationUrl: 'https://letras.ulisboa.pt',
    location: 'lisbon', locationLabel: 'Lisbon, Portugal',
    period: '2011 – 2014', startYear: 2011,
    description: 'Logic, Logical Philosophy, Philosophy of Logic, Philosophy of Mathematics, Philosophy of Language, Philosophy of Science.',
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
  entry, activeIdx, entryRef, idx, onClick,
}: {
  entry: TimelineEntry
  activeIdx: number | null
  entryRef: (el: HTMLDivElement | null) => void
  idx: number
  onClick: () => void
}) {
  const CYAN   = '#00e5ff'
  const PURPLE = '#cc44ff'
  const typeColor = entry.type === 'experience' ? CYAN : PURPLE
  const isActive = activeIdx === idx
  const opacity = activeIdx === null ? 0.8 : isActive ? 1 : 0.3

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
          {entry.note && <span style={{ fontSize: '0.7rem', color: 'var(--muted)', marginLeft: '0.5rem', fontStyle: 'italic' }}>({entry.note})</span>}
        </span>
        <span style={{ fontSize: '0.68rem', color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{entry.period}</span>
      </div>

      {/* Organisation */}
      <div style={{ marginTop: '0.25rem' }}>
        {entry.organizationUrl
          ? <a href={entry.organizationUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--muted)', textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'rgba(255,255,255,0.18)' }}>{entry.organization}</a>
          : <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{entry.organization}</span>
        }
        <span style={{ fontSize: '0.68rem', color: 'var(--muted)', opacity: 0.5, marginLeft: '0.5rem' }}>{entry.locationLabel}</span>
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
      {entry.tags && <p style={{ marginTop: '0.6rem', fontSize: '0.68rem', color: 'var(--muted)', opacity: 0.65 }}>{entry.tags}</p>}

      {/* Industry icons */}
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
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

const GLOB_W = '44vw'  // width of the fixed globe panel

export default function About() {
  const [activeIdx, setActiveIdx]   = useState<number | null>(null)
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

  const active = activeIdx !== null ? TIMELINE[activeIdx] : null

  function toggleEntry(idx: number) {
    setActiveIdx(prev => prev === idx ? null : idx)
  }

  // Globe city click → scroll to entry + highlight it
  function handleCityClick(locationKey: string) {
    const idx = TIMELINE.findIndex(e => e.location === locationKey)
    if (idx === -1) return
    setActiveIdx(prev => {
      if (prev !== idx) {
        setTimeout(() => refs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
      }
      return prev === idx ? null : idx
    })
  }

  return (
    <>
      {pdfOpen && <PdfModal onClose={() => setPdfOpen(false)} />}

      {/* ── Globe — fixed, behind all content, exits bottom-left ── */}
      <div
        style={{
          position: 'fixed',
          left: 0,
          top: '3rem',
          bottom: 0,
          width: GLOB_W,
          zIndex: 1,
          overflow: 'visible',
        }}
      >
        {/* Shift globe so it exits left (~20%) and bottom (~20%), Europe stays visible */}
        <div
          style={{
            position: 'absolute',
            left: '-20%',
            bottom: '-20%',
            width: '130%',
            height: '130%',
          }}
        >
          <Globe
            activeArc={active?.arcId ?? null}
            activeLocation={active?.location ?? null}
            onCityClick={handleCityClick}
          />
        </div>
      </div>

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
              diogo pereira-marques
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
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>principal ai engineer · london</p>
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
            scroll to explore · click a city on the globe to jump
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            {/* Git graph — scrolls with entries */}
            <GitGraph
              segments={TIMELINE.map(e => ({
                lane: e.type === 'experience' ? 1 : 0,
                entryId: e.id,
              }))}
              activeIdx={activeIdx}
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
                  activeIdx={activeIdx}
                  idx={idx}
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
