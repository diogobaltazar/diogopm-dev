import PageTransition from '../components/PageTransition'
import PostCard from '../components/PostCard'
import { posts } from '../lib/posts'

export default function Blog() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-[760px] px-6 pb-32">
        <section style={{ paddingTop: '5rem', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.9rem' }}>
            Blog
          </p>
          <p style={{ maxWidth: 620, marginTop: '1.1rem', fontSize: '0.96rem', lineHeight: 1.75, color: 'var(--desc)' }}>
            This blog is where the author&apos;s views on technology take shape in public:
            practical, opinionated notes on software, AI, systems, and the trade-offs behind building them well.
          </p>
        </section>
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {posts.map(({ slug, frontmatter }) => (
            <PostCard
              key={slug}
              slug={slug}
              title={frontmatter.title}
              date={frontmatter.date}
              description={frontmatter.description}
              version={frontmatter.version}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
