import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const links = [
  { to: '/', label: 'About' },
  { to: '/blog', label: 'Blog' },
]

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: 'rgba(8, 8, 8, 0.75)',
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
        </nav>
      </div>
    </header>
  )
}
