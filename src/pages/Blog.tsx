import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import { posts } from '../lib/posts'
import { useTheme } from '../context/ThemeContext'

type ThoughtCardItem = {
  title: string
  description: string
  image: string
  to?: string
  status?: string
}

type ThoughtSection = {
  title: string
  intro: string
  cards: ThoughtCardItem[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function ThoughtCard({ item }: { item: ThoughtCardItem }) {
  const content = (
    <>
      <div className="thought-card-media">
        <img className="thought-card-image" src={item.image} alt="" aria-hidden="true" />
      </div>

      <div className="thought-card-copy">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', flexWrap: 'wrap' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              lineHeight: 1.2,
              fontWeight: 500,
              color: 'var(--fg)',
            }}
          >
            {item.title}
          </h3>
          <span
            style={{
              fontSize: '0.62rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            {item.status ?? 'Archive'}
          </span>
        </div>

        <p
          style={{
            margin: '0.85rem 0 0',
            fontSize: '0.9rem',
            lineHeight: 1.75,
            color: 'var(--desc)',
          }}
        >
          {item.description}
        </p>

        <span className="thought-card-cta">
          /READ
        </span>
      </div>
    </>
  )

  if (item.to) {
    return (
      <Link to={item.to} className="thought-card">
        {content}
      </Link>
    )
  }

  return (
    <article className="thought-card">
      {content}
    </article>
  )
}

export default function Blog() {
  const { theme } = useTheme()
  const isDay = theme === 'day'

  function reviewImageFor(slug: string) {
    const themed = isDay ? 'darwin' : 'turing'

    const imageMap: Record<string, string> = {
      'usage-limit-reached': `/placeholders/thought/usage-limit-${themed}.svg`,
      'AIE-2026': `/placeholders/thought/aie-2026-${themed}.svg`,
      'Building-a-Team': `/placeholders/thought/team-building-${themed}.svg`,
    }

    return imageMap[slug] ?? `/placeholders/thought/technology-review-${themed}.svg`
  }

  const technologyCards: ThoughtCardItem[] = posts.slice(0, 2).map(post => ({
    title: post.frontmatter.title,
    description: `${post.frontmatter.description} Published ${formatDate(post.frontmatter.date)}.`,
    image: reviewImageFor(post.slug),
    to: `/blog/${post.slug}`,
    status: 'Essay',
  }))

  const sections: ThoughtSection[] = [
    {
      title: 'Technology Review',
      intro: 'Reviews, essays, and field notes on software engineering, AI systems, developer tools, and the trade-offs behind modern technical work.',
      cards: technologyCards.length > 0 ? technologyCards : [
        {
          title: 'Forthcoming Review',
          description: 'A placeholder for longer-form reviews of tools, frameworks, and engineering practice.',
          image: isDay ? '/placeholders/thought/technology-review-darwin.svg' : '/placeholders/thought/technology-review-turing.svg',
          status: 'Soon',
        },
      ],
    },
  ]

  return (
    <PageTransition>
      <div className="mx-auto max-w-[1120px] px-6 pb-32">
        <section style={{ paddingTop: '5rem', marginBottom: '4.5rem', maxWidth: 760 }}>
          <p
            style={{
              fontSize: '0.68rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
              marginBottom: '0.9rem',
            }}
          >
            Thought
          </p>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(2.6rem, 5vw, 4.7rem)',
              lineHeight: 0.94,
              letterSpacing: '-0.05em',
              fontWeight: 500,
              color: 'var(--fg)',
            }}
          >
            Archive of essays.
          </h1>
          <p style={{ maxWidth: 680, marginTop: '1.25rem', fontSize: '0.98rem', lineHeight: 1.8, color: 'var(--desc)' }}>
            Technology Review et al.
          </p>
        </section>

        <div style={{ display: 'grid', gap: '4.25rem' }}>
          {sections.map(section => (
            <section key={section.title}>
              <div
                className="thought-section-head"
                style={{
                  marginBottom: '1.4rem',
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.76rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--fg)',
                    }}
                  >
                    {section.title}
                  </p>
                </div>
                <p style={{ margin: 0, maxWidth: 720, fontSize: '0.92rem', lineHeight: 1.8, color: 'var(--desc)' }}>
                  {section.intro}
                </p>
              </div>

              <div className="thought-grid">
                {section.cards.map(card => (
                  <ThoughtCard key={`${section.title}-${card.title}`} item={card} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
