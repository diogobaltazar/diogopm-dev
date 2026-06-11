import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PortfolioFrame from "../components/PortfolioFrame";
import { fetchWriting, fetchWritingsIndex, type WritingPostMeta } from "../api";
import { renderProse } from "../utils/prose";

function formatDate(value: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function WritingPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [body, setBody] = useState<string | null>(null);
  const [meta, setMeta] = useState<WritingPostMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBody(null);
    setMeta(null);
    setError(null);

    Promise.all([fetchWriting(slug), fetchWritingsIndex()])
      .then(([content, posts]) => {
        setBody(content);
        setMeta(posts.find(post => post.slug === slug) ?? null);
      })
      .catch(err => setError(err instanceof Error ? err.message : "Unable to load writing"));
  }, [slug]);

  const seriesHref = useMemo(
    () => (meta?.series ? `/essay/series/${meta.series}` : null),
    [meta],
  );

  return (
    <PortfolioFrame orbMode="essay">
      <article className="portfolio-post">
        {error ? (
          <div className="portfolio-panel">
            <p className="portfolio-panel-copy">{error}</p>
          </div>
        ) : body === null ? (
          <div className="portfolio-panel">
            <p className="portfolio-panel-copy">Loading writing…</p>
          </div>
        ) : (
          <>
            <div className="portfolio-post-head">
              <p className="portfolio-eyebrow">/ESSAY</p>
              {meta && <h1 className="portfolio-post-title">{meta.title}</h1>}
              {meta && (
                <div className="portfolio-post-meta">
                  <span>{formatDate(meta.date)}</span>
                  {seriesHref && <Link to={seriesHref}>{meta.series}</Link>}
                </div>
              )}
            </div>

            <div className="portfolio-prose">{renderProse(body)}</div>
          </>
        )}
      </article>
    </PortfolioFrame>
  );
}
