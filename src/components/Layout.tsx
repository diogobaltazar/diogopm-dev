import type { ReactNode } from 'react'
import Nav from './Nav'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto max-w-[720px] px-6">
        <Nav />
        <main className="pb-24">{children}</main>
      </div>
    </div>
  )
}
