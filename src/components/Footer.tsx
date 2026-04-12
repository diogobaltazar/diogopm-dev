import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiLeetcode } from 'react-icons/si'

const EMAIL    = 'pereiramarques.diogo@ssl-mail.com'
const SITE_YEAR = 2025

// ─── data ─────────────────────────────────────────────────────────────────────

const OPEN_SOURCE = [
  { label: 'topgun',  href: 'https://github.com/diogobaltazar/topgun' },
  { label: 'Move37',  href: 'https://github.com/Genentech/Move37'     },
]

const COUNTRIES = ['United Kingdom', 'Denmark', 'France', 'Portugal']

const COMPANIES = [
  { label: 'Roche',                href: 'https://www.roche.com'           },
  { label: 'Novo Nordisk',         href: 'https://www.novonordisk.com'     },
  { label: 'A.P. Moller – Maersk', href: 'https://www.maersk.com'          },
  { label: 'Airbus',               href: 'https://www.airbus.com'          },
  { label: 'Accenture',            href: 'https://www.accenture.com'       },
]

// ─── sub-components ───────────────────────────────────────────────────────────

function ColHead({ children }: { children: string }) {
  return (
    <p style={{
      fontSize: '0.62rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--fg)',
      marginBottom: '0.875rem',
    }}>
      {children}
    </p>
  )
}

const linkStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--muted)',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '0.45rem',
  transition: 'color 0.15s',
}

function ColLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={linkStyle}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
    >
      {children}
    </a>
  )
}

function ColText({ children }: { children: string }) {
  return <p style={{ ...linkStyle, cursor: 'default' }}>{children}</p>
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Footer() {
  const [copied, setCopied] = useState(false)

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const MailIcon = copied ? Check : Mail
  const dimmed: React.CSSProperties = {
    color: 'var(--muted)',
    opacity: 0.32,
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
  }
  const iconBtn: React.CSSProperties = {
    color: 'var(--fg)',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'opacity 0.2s',
  }

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        position: 'relative',
        zIndex: 30,
      }}
    >
      {/* ── Columns ── */}
      <div
        style={{
          padding: '2.5rem 2rem 2rem',
          display: 'flex',
          gap: '3.5rem',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {/* Brand */}
        <div style={{ flex: '0 0 auto' }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: 'var(--fg)',
          }}>
            dpm
          </p>
        </div>

        {/* Open Source */}
        <div style={{ flex: '1 1 110px' }}>
          <ColHead>Open Source</ColHead>
          {OPEN_SOURCE.map(({ label, href }) => (
            <ColLink key={label} href={href}>{label}</ColLink>
          ))}
        </div>

        {/* Countries */}
        <div style={{ flex: '1 1 110px' }}>
          <ColHead>Countries</ColHead>
          {COUNTRIES.map(c => <ColText key={c}>{c}</ColText>)}
        </div>

        {/* Company */}
        <div style={{ flex: '1 1 140px' }}>
          <ColHead>Company</ColHead>
          {COMPANIES.map(({ label, href }) => (
            <ColLink key={label} href={href}>{label}</ColLink>
          ))}
        </div>

        {/* Spacer pushes year to far right */}
        <div style={{ flex: 1 }} />

        {/* Year — far right */}
        <div style={{ alignSelf: 'flex-start' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>© {SITE_YEAR}</p>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          padding: '0.7rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Social icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <a
            href="https://github.com/diogobaltazar"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={iconBtn}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <FaGithub size={15} />
          </a>
          <a
            href="https://linkedin.com/in/diogopereiramarques"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            style={iconBtn}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <FaLinkedin size={15} />
          </a>
          <button
            onClick={copyEmail}
            aria-label={copied ? 'Email copied' : 'Copy email'}
            style={iconBtn}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.6')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            <MailIcon size={15} strokeWidth={1.5} />
          </button>
          <span aria-label="X / Twitter (not yet active)" style={dimmed}>
            <FaXTwitter size={15} />
          </span>
          <span aria-label="LeetCode (not yet active)" style={dimmed}>
            <SiLeetcode size={15} />
          </span>
        </div>

        {/* Version */}
        <span style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.05em' }}>
          v{__APP_VERSION__}
        </span>
      </div>
    </footer>
  )
}
