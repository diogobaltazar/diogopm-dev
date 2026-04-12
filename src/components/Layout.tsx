import type { ReactNode } from 'react'
import Nav from './Nav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Background effects */}
      <div className="dot-grid" />
      <div className="top-glow" />

      {/* Content */}
      <div className="relative z-10">
        <Nav />
        <div className="mx-auto max-w-[680px] px-6">
          <main className="pb-32">{children}</main>
        </div>
      </div>
    </div>
  )
}
