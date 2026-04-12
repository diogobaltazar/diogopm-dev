import PageTransition from '../components/PageTransition'
import PostCard from '../components/PostCard'
import { posts } from '../lib/posts'

export default function Blog() {
  return (
    <PageTransition>
      <h1
        className="pt-4 text-5xl leading-tight"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Writing
      </h1>
      <div className="mt-10 border-t" style={{ borderColor: '#e5e2de' }}>
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
    </PageTransition>
  )
}
