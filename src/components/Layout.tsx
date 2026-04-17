import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import Globe from './Globe'
import { useGlobeCtx } from '../context/GlobeContext'
import { useTheme } from '../context/ThemeContext'

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const { activeArc, activeLocation, activeType, onCityClick } = useGlobeCtx()
  const { theme } = useTheme()
  const isOrb = pathname !== '/'
  const isHome = pathname === '/'
  const globeFrame = isHome
    ? {
        left: '38%',
        bottom: '-12%',
        width: '80vw',
        height: '120%',
        transform: 'translateX(0)',
      }
    : {
        left: '50%',
        bottom: '6%',
        width: 'min(62vw, 780px)',
        height: '82%',
        transform: 'translateX(-50%)',
      }

  return (
    <div
      data-theme={theme}
      className="relative min-h-screen"
      style={{ backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column' }}
    >
      {/* Background effects */}
      <div className="dot-grid" />
      <div className="top-glow" />

      {/* Content — globe lives inside this stacking context (z:10) so its z:1
          sits above the empty <main> (z:auto) but below About's content panel (z:2) */}
      <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Globe / Orb */}
        <div style={{
          position: 'fixed',
          left: 0, top: '3rem', right: 0, bottom: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}>
          <motion.div
            animate={globeFrame}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
            position: 'absolute',
            pointerEvents: isOrb ? 'none' : 'auto',
            willChange: 'left, bottom, width, height, transform',
          }}
          >
            <Globe
              mode={isOrb ? 'orb' : 'globe'}
              activeArc={activeArc}
              activeLocation={activeLocation}
              activeType={activeType}
              onCityClick={onCityClick}
            />
          </motion.div>
        </div>

        <Nav />
        <main style={{ flex: 1, pointerEvents: 'none' }}>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
