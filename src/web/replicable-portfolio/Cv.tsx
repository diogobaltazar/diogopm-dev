import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchCvVersion, requestCvPdf } from "../api";
import { CV_HIGHLIGHTS, EDUCATION, EXPERIENCE, OPEN_SOURCE, PROFILE, type CvEntry } from "./portfolio";

function CvSection({
  title,
  items,
}: {
  title: string;
  items: CvEntry[];
}) {
  return (
    <section className="portfolio-section">
      <div className="portfolio-section-head">
        <p className="portfolio-section-label">{title}</p>
      </div>
      <div className="portfolio-stack">
        {items.map(item => (
          <article key={`${title}-${item.title}-${item.organization}`} className="portfolio-card">
            <div className="portfolio-card-topline">
              <h3>{item.title}</h3>
              <span>{item.period}</span>
            </div>
            <p className="portfolio-card-org">{item.organization}</p>
            <p className="portfolio-card-loc">{item.location}</p>
            <p className="portfolio-card-copy">{item.summary}</p>
            {item.technologies && item.technologies.length > 0 && (
              <div className="portfolio-tags">
                {item.technologies.map(tech => (
                  <span key={tech} className="portfolio-tag">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default function Cv() {
  const { isAuthenticated, isLoading, loginWithRedirect, getAccessTokenSilently } = useAuth0();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [cvVersion, setCvVersion] = useState<string | null>(null);

  const groupedHighlights = useMemo(() => CV_HIGHLIGHTS, []);

  useEffect(() => {
    let cancelled = false;
    fetchCvVersion()
      .then(v => { if (!cancelled) setCvVersion(v); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");
    setMessage("");
    setDownloadUrl(null);

    try {
      const token = await getAccessTokenSilently();
      const result = await requestCvPdf(token, email.trim());
      setStatus("success");
      setMessage("Request recorded. The PDF is ready to download now.");
      setDownloadUrl(result.download_url);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to request CV PDF");
    }
  }

  return (
    <div className="portfolio-page portfolio-page--cv">
      <div className="portfolio-dot-grid" />
      <div className="portfolio-glow" />
      <main className="portfolio-main">
      <section className="portfolio-cv-hero">
        <div>
          <p className="portfolio-eyebrow">/WORK</p>
          <h1 className="portfolio-title portfolio-title--cv">{PROFILE.name}</h1>
          <p className="portfolio-description portfolio-description--cv">{PROFILE.currentRole}</p>
        </div>
      </section>

      {isLoading ? (
        <div className="portfolio-gate">
          <div className="portfolio-panel">
            <p className="portfolio-panel-label">Authenticating</p>
            <p className="portfolio-panel-copy">Checking access to the private CV.</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <div className="portfolio-gate">
          <div className="portfolio-panel">
            <p className="portfolio-panel-label">Protected Curriculum Vitae</p>
            <p className="portfolio-panel-copy">
              Sign-in to access the full CV, including detailed experience, education, a snapshot of key highlights and PDF download.
            </p>
            <button
              type="button"
              className="portfolio-button"
              onClick={() => loginWithRedirect({ appState: { returnTo: "/cv" } })}
            >
              Sign in
            </button>
          </div>
        </div>
      ) : (
        <div className="portfolio-cv-grid">
          <aside className="portfolio-cv-side">
            <section className="portfolio-panel">
              <p className="portfolio-panel-label">Snapshot</p>
              <ul className="portfolio-highlight-list">
                {groupedHighlights.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="portfolio-panel">
              <p className="portfolio-panel-label">
                Request PDF{cvVersion ? ` · v${cvVersion}` : ""}
              </p>
              <p className="portfolio-panel-copy">
                Enter a valid email address to record the request and unlock the latest PDF version of the CV.
              </p>

              <form className="portfolio-request-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  className="portfolio-input"
                  placeholder="name@company.com"
                />
                <button type="submit" className="portfolio-button" disabled={status === "submitting"}>
                  {status === "submitting" ? "Requesting..." : "Request CV PDF"}
                </button>
              </form>

              {message && (
                <p className={`portfolio-inline-message portfolio-inline-message--${status}`}>
                  {message}
                </p>
              )}

              {downloadUrl && (
                <a href={downloadUrl} className="portfolio-link-button" target="_blank" rel="noreferrer">
                  Download PDF
                </a>
              )}
            </section>

            <section className="portfolio-panel">
              <p className="portfolio-panel-label">Open Source</p>
              <div className="portfolio-stack portfolio-stack--compact">
                {OPEN_SOURCE.map(project => (
                  <a key={project.name} href={project.url} target="_blank" rel="noreferrer" className="portfolio-mini-link">
                    <span>{project.name}</span>
                    <span>{project.description}</span>
                  </a>
                ))}
              </div>
            </section>
          </aside>

          <div className="portfolio-cv-main">
            <CvSection title="Experience" items={EXPERIENCE} />
            <CvSection title="Education" items={EDUCATION} />
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
