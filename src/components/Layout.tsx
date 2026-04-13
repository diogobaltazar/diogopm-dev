import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import Globe from './Globe'
import { useGlobeCtx } from '../context/GlobeContext'
import { useTheme } from '../context/ThemeContext'

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const { activeArc, activeLocation, onCityClick } = useGlobeCtx()
  const { theme } = useTheme()
  const isOrb = pathname !== '/'

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
          <div style={{
            position: 'absolute',
            left: '-10%', bottom: '-20%',
            width: '65vw', height: '120%',
            pointerEvents: isOrb ? 'none' : 'auto',
          }}>
            <Globe
              mode={isOrb ? 'orb' : 'globe'}
              activeArc={activeArc}
              activeLocation={activeLocation}
              onCityClick={onCityClick}
            />
          </div>
        </div>

        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
