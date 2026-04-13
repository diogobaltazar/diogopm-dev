import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const links = [
  { to: '/', label: 'About' },
  { to: '/blog', label: 'Blog' },
]

export default function Nav() {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()

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
            <button
              onClick={toggleTheme}
              aria-label={theme === 'day' ? 'Switch to night' : 'Switch to day'}
              title={theme === 'day' ? 'Night' : 'Day'}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', padding: '0.25rem',
                display: 'flex', alignItems: 'center',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--fg)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
            >
              {theme === 'day'
                ? <Moon size={14} strokeWidth={1.5} />
                : <Sun  size={14} strokeWidth={1.5} />
              }
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
