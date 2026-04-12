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
      <div className="mx-auto max-w-[680px] px-6 pb-32">
        <article className="pt-16">
          <Link
            to="/blog"
            className="inline-block text-xs tracking-widest uppercase mb-12 transition-opacity hover:opacity-60"
            style={{ color: 'var(--muted)' }}
          >
            ← Writing
          </Link>

          <header className="mb-10">
            <time className="text-xs" style={{ color: 'var(--muted)' }}>
              {formatDate(frontmatter.date)}
            </time>
            <h1
              className="mt-3 text-4xl font-semibold tracking-tight leading-tight"
              style={{
                background: 'linear-gradient(to bottom, #ffffff 50%, rgba(255,255,255,0.6))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {frontmatter.title}
            </h1>
          </header>

          <div className="prose prose-sm prose-invert max-w-none">
            <Component />
          </div>
        </article>
      </div>
    </PageTransition>
  )
}
