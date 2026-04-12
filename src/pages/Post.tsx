import { useParams, Navigate, Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import { getPost } from '../lib/posts'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  if (!post) return <Navigate to="/blog" replace />

  const { Component, frontmatter } = post

  return (
    <PageTransition>
      <article>
        <Link
          to="/blog"
          className="inline-block text-xs tracking-widest uppercase mb-10 transition-opacity hover:opacity-60"
          style={{ color: '#6b6b6b' }}
        >
          ← Writing
        </Link>

        <header className="mb-10">
          <time className="text-xs tracking-wide" style={{ color: '#6b6b6b' }}>
            {formatDate(frontmatter.date)}
          </time>
          <h1
            className="mt-3 text-4xl leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {frontmatter.title}
          </h1>
        </header>

        <div className="prose prose-sm max-w-none">
          <Component />
        </div>
      </article>
    </PageTransition>
  )
}
