import { motion } from "framer-motion";

export default function PortfolioOrb({
  mode,
}: {
  mode: "landing" | "cv" | "essay";
}) {
  const palette = mode === "essay"
    ? [
        "rgba(109, 129, 255, 0.38)",
        "rgba(113, 208, 192, 0.28)",
        "rgba(164, 140, 255, 0.22)",
      ]
    : mode === "cv"
      ? [
          "rgba(78, 196, 159, 0.22)",
          "rgba(96, 130, 255, 0.26)",
          "rgba(232, 236, 247, 0.08)",
        ]
      : [
          "rgba(73, 131, 255, 0.26)",
          "rgba(73, 199, 160, 0.2)",
          "rgba(225, 233, 246, 0.08)",
        ];

  return (
    <div className={`portfolio-orb portfolio-orb--${mode}`}>
      <motion.div
        className="portfolio-orb-core"
        animate={{
          background: [
            `radial-gradient(circle at 35% 35%, ${palette[2]} 0%, ${palette[0]} 36%, rgba(7, 10, 16, 0.94) 76%)`,
            `radial-gradient(circle at 62% 32%, ${palette[2]} 0%, ${palette[1]} 30%, rgba(7, 10, 16, 0.93) 72%)`,
            `radial-gradient(circle at 48% 64%, ${palette[2]} 0%, ${palette[0]} 32%, rgba(7, 10, 16, 0.94) 74%)`,
            `radial-gradient(circle at 35% 35%, ${palette[2]} 0%, ${palette[0]} 36%, rgba(7, 10, 16, 0.94) 76%)`,
          ],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="portfolio-orb-ring portfolio-orb-ring--outer" />
      <div className="portfolio-orb-ring portfolio-orb-ring--inner" />
      <div className="portfolio-orb-line portfolio-orb-line--a" />
      <div className="portfolio-orb-line portfolio-orb-line--b" />
    </div>
  );
}
