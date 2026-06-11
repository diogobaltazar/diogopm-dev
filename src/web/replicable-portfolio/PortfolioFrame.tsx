import type { ReactNode } from "react";
import PortfolioFooter from "./PortfolioFooter";
import PortfolioOrb from "./PortfolioOrb";
import PortfolioTopBar from "./PortfolioTopBar";

export default function PortfolioFrame({
  children,
  orbMode,
}: {
  children: ReactNode;
  orbMode: "landing" | "cv" | "essay";
}) {
  return (
    <div className={`portfolio-page portfolio-page--${orbMode}`}>
      <div className="portfolio-dot-grid" />
      <div className="portfolio-glow" />
      <div className="portfolio-orb-layer" aria-hidden="true">
        <PortfolioOrb mode={orbMode} />
      </div>

      <div className="portfolio-content">
        <PortfolioTopBar />
        <main className="portfolio-main">{children}</main>
        <PortfolioFooter />
      </div>
    </div>
  );
}
