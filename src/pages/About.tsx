import PageTransition from '../components/PageTransition'

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/diogobaltazar' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/' },
  { label: 'Email', href: 'mailto:d.ogobaltazar+github@gmail.com' },
]

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className="text-xs font-medium tracking-widest uppercase mb-5"
      style={{ color: 'var(--muted)' }}
    >
      {children}
    </p>
  )
}

function Divider() {
  return <div className="my-12" style={{ borderTop: '1px solid var(--border)' }} />
}

export default function About() {
  return (
    <PageTransition>
      <article className="pt-20">

        {/* Hero */}
        <h1
          className="text-5xl font-semibold leading-tight tracking-tight mb-4"
          style={{
            background: 'linear-gradient(to bottom, #ffffff 50%, rgba(255,255,255,0.5))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Diogo Pereira Marques
        </h1>
        <p className="text-base" style={{ color: 'var(--muted)' }}>
          Software engineer. Builder of things.
        </p>

        <Divider />

        {/* About */}
        <section>
          <SectionLabel>About</SectionLabel>
          <p className="text-sm leading-relaxed" style={{ color: '#c8c8c8' }}>
            Write a short introduction about yourself here. Where you are,
            what you care about, what you are working on.
          </p>
        </section>

        <Divider />

        {/* Experience */}
        <section>
          <SectionLabel>Experience</SectionLabel>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
                  Company Name
                </span>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  2022 – present
                </span>
              </div>
              <p className="mt-0.5 text-sm" style={{ color: 'var(--muted)' }}>Role</p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: '#c8c8c8' }}>
                Short description of what you did.
              </p>
            </div>
          </div>
        </section>

        <Divider />

        {/* Education */}
        <section>
          <SectionLabel>Education</SectionLabel>
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
              University Name
            </span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              2015 – 2019
            </span>
          </div>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--muted)' }}>Degree</p>
        </section>

        <Divider />

        {/* Links */}
        <section>
          <SectionLabel>Links</SectionLabel>
          <div className="flex gap-6">
            {LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline decoration-1 underline-offset-4 transition-opacity duration-200 hover:opacity-60"
                style={{ color: 'var(--fg)' }}
              >
                {label}
              </a>
            ))}
          </div>
        </section>

      </article>
    </PageTransition>
  )
}
