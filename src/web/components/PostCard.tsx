import { Link } from 'react-router-dom'

interface Props {
  slug: string
  title: string
  date: string
  description: string
  version?: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function PostCard({ slug, title, date, description, version }: Props) {
  return (
    <Link
      to={`/blog/${slug}`}
      className="group block py-6 transition-colors duration-200"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
        <time className="text-xs" style={{ color: 'var(--muted)' }}>
          {formatDate(date)}
        </time>
        {version && (
          <span style={{ fontSize: '0.6rem', color: 'var(--muted)', opacity: 0.45, letterSpacing: '0.04em' }}>
            v{version}
          </span>
        )}
      </div>
      <h2
        className="mt-2 text-sm font-medium transition-colors duration-200"
        style={{ color: 'var(--fg)' }}
      >
        {title}
      </h2>
      <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
        {description}
      </p>
    </Link>
  )
}
