import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const links = [
  { to: '/', label: 'PEREIRA-MARQUES' },
  { to: '/cv', label: '/WORK' },
  { to: '/blog', label: '/ESSAY' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const { theme, setTheme } = useTheme()
  const [themeOpen, setThemeOpen] = useState(false)
  const themeMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (themeMenuRef.current?.contains(event.target as Node)) return
      setThemeOpen(false)
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setThemeOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const themeLabel = theme === 'day' ? 'Darwin' : 'Turing'
  const themeOptions = [
    { value: 'day' as const, label: 'Darwin' },
    { value: 'night' as const, label: 'Turing' },
  ]

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="px-8">
        <nav className="flex items-center gap-6 h-12">
          {links.map(({ to, label }) => {
            const active =
              to === '/' ? pathname === '/' : pathname.startsWith(to)

            return (
              <Link key={to} to={to} className="relative pb-px group">
                <span
                  className="text-xs font-medium tracking-widest uppercase transition-colors duration-200"
                  style={{ color: active ? 'var(--fg)' : 'var(--muted)' }}
                >
                  {label}
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ backgroundColor: 'var(--accent)', transformOrigin: 'left' }}
                  initial={false}
                  animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                />
              </Link>
            )
          })}

          <div style={{ marginLeft: 'auto' }}>
            <div
              ref={themeMenuRef}
              style={{
                position: 'relative',
              }}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={themeOpen}
                aria-label="Theme"
                onClick={() => setThemeOpen(open => !open)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  color: 'var(--muted)',
                  padding: '0.28rem 0.7rem 0.28rem 0.8rem',
                  border: 'none',
                  borderRadius: 7,
                  background: 'color-mix(in srgb, var(--nav-bg) 72%, var(--card-bg))',
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    fontSize: '0.62rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  /Theme
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--fg)',
                  }}
                >
                  {themeLabel}
                </span>
                <ChevronDown
                  size={13}
                  strokeWidth={1.6}
                  style={{
                    color: 'var(--muted)',
                    transform: themeOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {themeOpen && (
                <div
                  role="menu"
                  aria-label="Theme options"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    minWidth: 152,
                    padding: '0.35rem',
                    border: '1px solid var(--border)',
                    borderRadius: 9,
                    background: 'color-mix(in srgb, var(--nav-bg) 94%, var(--bg))',
                    backdropFilter: 'blur(18px)',
                    boxShadow: '0 18px 38px rgba(0, 0, 0, 0.18)',
                  }}
                >
                  {themeOptions.map(option => {
                    const active = option.value === theme
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => {
                          setTheme(option.value)
                          setThemeOpen(false)
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          padding: '0.6rem 0.75rem',
                          border: 'none',
                          borderRadius: 6,
                          background: active ? 'var(--card-bg-hover)' : 'transparent',
                          color: active ? 'var(--fg)' : 'var(--muted)',
                          fontSize: '0.68rem',
                          fontWeight: active ? 500 : 400,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'background-color 0.18s ease, color 0.18s ease',
                        }}
                        onMouseEnter={event => {
                          if (!active) {
                            event.currentTarget.style.background = 'var(--card-bg)'
                            event.currentTarget.style.color = 'var(--fg)'
                          }
                        }}
                        onMouseLeave={event => {
                          if (!active) {
                            event.currentTarget.style.background = 'transparent'
                            event.currentTarget.style.color = 'var(--muted)'
                          }
                        }}
                      >
                        <span>{option.label}</span>
                        <span style={{ opacity: active ? 0.9 : 0, transition: 'opacity 0.18s ease' }}>•</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
