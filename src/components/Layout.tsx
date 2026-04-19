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
  const scene = pathname === '/'
    ? 'landing'
    : pathname.startsWith('/cv') || pathname.startsWith('/about')
      ? 'cv'
      : 'blog'
  const globeMode = scene === 'landing' ? 'hero' : scene === 'cv' ? 'globe' : 'orb'
  const isInteractive = scene === 'cv'
  const globeFrame = scene === 'landing'
    ? {
        left: '50%',
        top: '50%',
        width: 'min(82vw, 980px)',
        height: 'min(82vw, 980px)',
        transform: 'translate(-50%, -46%)',
      }
    : scene === 'cv'
      ? {
        left: '72%',
        top: '52%',
        width: 'min(76vw, 960px)',
        height: 'min(108vh, 1120px)',
        transform: 'translate(-50%, -44%)',
      }
      : {
        left: '50%',
        top: '52%',
        width: 'min(62vw, 780px)',
        height: '82%',
        transform: 'translate(-50%, -50%)',
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
            initial={false}
            animate={globeFrame}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              pointerEvents: isInteractive ? 'auto' : 'none',
              willChange: 'left, top, width, height, transform',
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              style={{ width: '100%', height: '100%' }}
            >
              <Globe
                mode={globeMode}
                activeArc={activeArc}
                activeLocation={activeLocation}
                activeType={activeType}
                onCityClick={onCityClick}
              />
            </motion.div>
          </motion.div>
        </div>

        <Nav />
        <main style={{ flex: 1, pointerEvents: 'none' }}>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
