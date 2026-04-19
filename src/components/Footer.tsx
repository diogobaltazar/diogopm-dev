import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Mail, Check } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiLeetcode } from 'react-icons/si'
import { useTheme } from '../context/ThemeContext'

const EMAIL    = 'pereiramarques.diogo@ssl-mail.com'
const SITE_YEAR = 2026

// ─── data ─────────────────────────────────────────────────────────────────────

const OPEN_SOURCE = [
  { label: 'TopGun',  href: 'https://github.com/diogobaltazar/TopGun' },
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

const UNIVERSITIES = [
  { label: 'University of Lisbon',     href: 'https://www.ulisboa.pt', icon: '/logos/ulisboa.svg' },
  { label: 'University of Copenhagen', href: 'https://www.ku.dk',      icon: '/logos/ku.svg' },
]

const COMPANY_LOGOS: Record<string, { src: string; height?: number }> = {
  Roche: { src: '/logos/roche.svg', height: 24 },
  'Novo Nordisk': { src: '/logos/novo-nordisk.svg', height: 38 },
  'A.P. Moller – Maersk': { src: '/logos/maersk.svg', height: 38 },
  Airbus: { src: '/logos/airbus.svg', height: 38 },
  Accenture: { src: '/logos/accenture.svg', height: 24 },
}

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

function IconOnlyLink({
  href,
  label,
  icon,
  height = 38,
  darkOnLight = false,
}: {
  href: string
  label: string
  icon: string
  height?: number
  darkOnLight?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="tech-icon tech-link"
      data-label={label}
      aria-label={label}
      title={label}
      style={{
        color: 'var(--muted)',
        minHeight: 42,
        minWidth: 42,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--fg)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
    >
      <img
        src={icon}
        alt=""
        aria-hidden="true"
        style={{
          height,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          opacity: 0.98,
          filter: darkOnLight ? 'invert(1)' : 'none',
        }}
      />
    </a>
  )
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Footer() {
  const { pathname } = useLocation()
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)
  const isCv = pathname.startsWith('/cv') || pathname.startsWith('/about')
  const isDay = theme === 'day'

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
      {isCv && (
        <div
          style={{
            padding: '2.5rem 2rem 2rem',
            display: 'flex',
            gap: '3.5rem',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: '1 1 110px' }}>
            <ColHead>Open Source</ColHead>
            {OPEN_SOURCE.map(({ label, href }) => (
              <ColLink key={label} href={href}>{label}</ColLink>
            ))}
          </div>

          <div style={{ flex: '1 1 110px' }}>
            <ColHead>Countries</ColHead>
            {COUNTRIES.map(c => <ColText key={c}>{c}</ColText>)}
          </div>

          <div style={{ flex: '1 1 180px' }}>
            <ColHead>University</ColHead>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.95rem', flexWrap: 'wrap' }}>
              {UNIVERSITIES.map(({ label, href, icon }) => (
                <IconOnlyLink key={label} href={href} label={label} icon={icon} height={38} darkOnLight={isDay} />
              ))}
            </div>
          </div>

          <div style={{ flex: '1 1 180px' }}>
            <ColHead>Company</ColHead>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {COMPANIES.map(({ label, href }) => {
              const logo = COMPANY_LOGOS[label]
              return (
                <IconOnlyLink
                  key={label}
                  href={href}
                  label={label}
                  icon={logo.src}
                  height={logo.height ?? 30}
                  darkOnLight={isDay}
                />
              )
            })}
            </div>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ alignSelf: 'flex-start' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>© {SITE_YEAR}</p>
          </div>
        </div>
      )}

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
