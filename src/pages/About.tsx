import PageTransition from '../components/PageTransition'

export default function About() {
  return (
    <PageTransition>
      <article className="pt-4 pb-16">
        <h1
          className="text-5xl leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Diogo Pereira Marques
        </h1>
        <p className="mt-4 text-base" style={{ color: '#6b6b6b' }}>
          Software engineer. Builder of things.
        </p>

        <div
          className="mt-12 space-y-10 text-sm leading-[1.9]"
          style={{ color: 'var(--fg)' }}
        >
          {/* ── Replace the sections below with your real content ── */}

          <section>
            <h2
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: '#6b6b6b' }}
            >
              About
            </h2>
            <p>
              Write a short introduction about yourself here. Where you are,
              what you care about, what you are working on.
            </p>
          </section>

          <section>
            <h2
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: '#6b6b6b' }}
            >
              Experience
            </h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between">
                  <span className="font-medium">Company Name</span>
                  <span style={{ color: '#6b6b6b' }}>2022 – present</span>
                </div>
                <div style={{ color: '#6b6b6b' }}>Role</div>
                <p className="mt-1">Short description of what you did.</p>
              </div>
            </div>
          </section>

          <section>
            <h2
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: '#6b6b6b' }}
            >
              Education
            </h2>
            <div className="flex justify-between">
              <span className="font-medium">University Name</span>
              <span style={{ color: '#6b6b6b' }}>2015 – 2019</span>
            </div>
            <div style={{ color: '#6b6b6b' }}>Degree</div>
          </section>

          <section>
            <h2
              className="text-xs tracking-widest uppercase mb-4"
              style={{ color: '#6b6b6b' }}
            >
              Links
            </h2>
            <div className="flex gap-6">
              {[
                { label: 'GitHub', href: 'https://github.com/diogobaltazar' },
                { label: 'LinkedIn', href: 'https://linkedin.com/in/' },
                { label: 'Email', href: 'mailto:d.ogobaltazar+github@gmail.com' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline decoration-1 underline-offset-4 transition-opacity hover:opacity-60"
                  style={{ color: '#2d4a3e' }}
                >
                  {label}
                </a>
              ))}
            </div>
          </section>
        </div>
      </article>
    </PageTransition>
  )
}
