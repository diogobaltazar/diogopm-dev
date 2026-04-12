import { Link } from 'react-router-dom'

interface Props {
  slug: string
  title: string
  date: string
  description: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function PostCard({ slug, title, date, description }: Props) {
  return (
    <Link
      to={`/blog/${slug}`}
      className="group block py-6 transition-colors duration-200"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <time className="text-xs" style={{ color: 'var(--muted)' }}>
        {formatDate(date)}
      </time>
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
