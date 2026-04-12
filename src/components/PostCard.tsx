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
      className="group block py-7 border-b"
      style={{ borderColor: '#e5e2de' }}
    >
      <time className="text-xs tracking-wide" style={{ color: '#6b6b6b' }}>
        {formatDate(date)}
      </time>
      <h2
        className="mt-2 font-serif text-xl leading-snug transition-colors duration-200"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {title}
      </h2>
      <p className="mt-1 text-sm leading-relaxed" style={{ color: '#6b6b6b' }}>
        {description}
      </p>
    </Link>
  )
}
