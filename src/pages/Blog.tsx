import PageTransition from '../components/PageTransition'
import PostCard from '../components/PostCard'
import { posts } from '../lib/posts'

export default function Blog() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-[680px] px-6 pb-32">
        <h1
          className="pt-20 text-5xl font-semibold tracking-tight mb-12"
          style={{
            background: 'linear-gradient(to bottom, #ffffff 50%, rgba(255,255,255,0.5))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          writing
        </h1>
        <div style={{ borderTop: '1px solid var(--border)' }}>
          {posts.map(({ slug, frontmatter }) => (
            <PostCard
              key={slug}
              slug={slug}
              title={frontmatter.title}
              date={frontmatter.date}
              description={frontmatter.description}
            />
          ))}
        </div>
      </div>
    </PageTransition>
  )
}
