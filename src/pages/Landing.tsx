import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageTransition from '../components/PageTransition'

const ENTRY_STYLE: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  padding: '1rem 0',
  borderTop: '1px solid var(--border)',
  color: 'inherit',
  textDecoration: 'none',
  transition: 'color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
}

export default function Landing() {
  return (
    <PageTransition>
      <section
        style={{
          minHeight: 'calc(100vh - 7.5rem)',
          padding: 'clamp(2.5rem, 6vh, 4.5rem) clamp(1.5rem, 4vw, 3rem) clamp(2rem, 4vh, 3rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 'min(860px, 100%)',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '0.74rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            PERSONAL PORTFOLIO
          </p>

          <h1
            style={{
              margin: '1rem 0 0',
              fontSize: 'clamp(2.25rem, 5.8vw, 4.8rem)',
              lineHeight: 0.94,
              letterSpacing: '-0.055em',
              fontWeight: 500,
              color: 'var(--fg)',
              textWrap: 'balance',
            }}
          >
            Diogo Pereira-Marques
          </h1>

          <p
            className="landing-subtitle"
            style={{
              maxWidth: 'none',
              margin: '1.3rem auto 0',
              fontSize: 'clamp(1rem, 1.3vw, 1.1rem)',
              lineHeight: 1.8,
              color: 'var(--desc)',
            }}
          >
            Builder of AI systems at the boundary of software engineering and science @ Roche.
          </p>

          <div
            style={{
              width: 'min(560px, 100%)',
              margin: 'clamp(15rem, 26vh, 20rem) auto 0',
              textAlign: 'left',
              backdropFilter: 'blur(10px)',
              background: 'color-mix(in srgb, var(--nav-bg) 58%, transparent)',
              border: '1px solid color-mix(in srgb, var(--border) 88%, transparent)',
              borderRadius: 22,
              padding: '0 1.25rem',
              boxShadow: '0 24px 70px rgba(0, 0, 0, 0.12)',
            }}
          >
            <Link
              to="/cv"
              style={ENTRY_STYLE}
              onMouseEnter={event => {
                event.currentTarget.style.color = 'var(--fg)'
                event.currentTarget.style.borderColor = 'color-mix(in srgb, var(--industry-accent) 34%, var(--border))'
                event.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={event => {
                event.currentTarget.style.color = 'inherit'
                event.currentTarget.style.borderColor = 'var(--border)'
                event.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--industry-accent)',
                  }}
                >
                  CV
                </p>
                <p
                  style={{
                    margin: '0.45rem 0 0',
                    fontSize: '0.98rem',
                    lineHeight: 1.7,
                    color: 'var(--desc)',
                  }}
                >
                  Experience, projects, and the places that shaped the work.
                </p>
              </div>
              <ArrowRight size={16} strokeWidth={1.7} />
            </Link>

            <Link
              to="/blog"
              style={{ ...ENTRY_STYLE, borderBottom: 'none' }}
              onMouseEnter={event => {
                event.currentTarget.style.color = 'var(--fg)'
                event.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent) 34%, var(--border))'
                event.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={event => {
                event.currentTarget.style.color = 'inherit'
                event.currentTarget.style.borderColor = 'var(--border)'
                event.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.72rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                  }}
                >
                  Blog
                </p>
                <p
                  style={{
                    margin: '0.45rem 0 0',
                    fontSize: '0.98rem',
                    lineHeight: 1.7,
                    color: 'var(--desc)',
                  }}
                >
                  Essays and notes where technology becomes a personal point of view.
                </p>
              </div>
              <ArrowRight size={16} strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
