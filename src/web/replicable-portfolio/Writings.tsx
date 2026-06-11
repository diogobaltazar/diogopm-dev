import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PortfolioFrame from "../components/PortfolioFrame";
import { fetchWritingsIndex, type WritingPostMeta } from "../api";
import { WRITING_SERIES } from "../portfolio";

function formatDate(value: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Writings() {
  const { series } = useParams<{ series?: string }>();
  const [posts, setPosts] = useState<WritingPostMeta[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    fetchWritingsIndex(series)
      .then(setPosts)
      .catch(err => setError(err instanceof Error ? err.message : "Unable to load writings"));
  }, [series]);

  const currentSeries = useMemo(
    () => WRITING_SERIES.find(item => item.slug === series) ?? null,
    [series],
  );

  return (
    <PortfolioFrame orbMode="essay">
      <section className="portfolio-essay-hero">
        <p className="portfolio-eyebrow">{series ? "/SERIES" : "/ESSAY"}</p>
        <h1 className="portfolio-title portfolio-title--essay">
          {currentSeries ? currentSeries.label : "Writings on technology and building."}
        </h1>
        <p className="portfolio-description portfolio-description--essay">
          {currentSeries
            ? currentSeries.description
            : "Essays, notes, and small arguments about engineering, technology, and the conditions under which useful work gets made."}
        </p>
      </section>

      {series && (
        <div className="portfolio-series-back">
          <Link to="/essay">← Back to all writings</Link>
        </div>
      )}

      {!series && WRITING_SERIES.length > 0 && (
        <section className="portfolio-series-strip">
          {WRITING_SERIES.map(item => (
            <Link key={item.slug} to={`/essay/series/${item.slug}`} className="portfolio-series-link">
              <span>{item.label}</span>
              <span>{item.description}</span>
            </Link>
          ))}
        </section>
      )}

      {error ? (
        <div className="portfolio-panel">
          <p className="portfolio-panel-copy">{error}</p>
        </div>
      ) : (
        <section className="portfolio-writing-grid">
          {posts.map(post => (
            <Link key={post.slug} to={`/essay/${post.slug}`} className="portfolio-writing-card">
              <div className={`portfolio-writing-media portfolio-writing-media--${post.series ?? "general"}`}>
                <span>{post.series ? post.series.replace(/-/g, " ") : "essay"}</span>
              </div>

              <div className="portfolio-writing-body">
                <div className="portfolio-writing-meta">
                  <span>{formatDate(post.date)}</span>
                  {post.series && (
                    <span className="portfolio-series-chip">{post.series}</span>
                  )}
                </div>

                <h2>{post.title}</h2>
                <p>{post.description}</p>

                <div className="portfolio-writing-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="portfolio-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}

          {posts.length === 0 && (
            <div className="portfolio-panel">
              <p className="portfolio-panel-copy">No writings published in this series yet.</p>
            </div>
          )}
        </section>
      )}
    </PortfolioFrame>
  );
}
