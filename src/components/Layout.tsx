import type { ReactNode } from 'react'
import Nav from './Nav'
import Footer from './Footer'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: 'var(--bg)', display: 'flex', flexDirection: 'column' }}
    >
      {/* Background effects */}
      <div className="dot-grid" />
      <div className="top-glow" />

      {/* Content */}
      <div className="relative z-10" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
