import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const links = [
  { to: '/', label: 'About' },
  { to: '/blog', label: 'Blog' },
]

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <nav className="flex items-center gap-8 py-10">
      {links.map(({ to, label }) => {
        const active =
          to === '/'
            ? pathname === '/'
            : pathname === to || pathname.startsWith(to + '/')

        return (
          <Link key={to} to={to} className="relative pb-1 group">
            <span
              className="text-sm tracking-widest uppercase transition-colors duration-200"
              style={{ color: active ? '#2d4a3e' : '#6b6b6b' }}
            >
              {label}
            </span>
            <motion.span
              className="absolute bottom-0 left-0 right-0 h-px"
              style={{ backgroundColor: '#2d4a3e', transformOrigin: 'left' }}
              initial={false}
              animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </Link>
        )
      })}
    </nav>
  )
}
