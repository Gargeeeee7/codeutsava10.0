import React from "react";
import { Reveal } from "./shared";
import { STATS } from "../../data/landingData";

export default function StatsBand() {
  return (
    <section id="stats" className="hx-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <Reveal>
        <p
          className="hx-mono"
          style={{
            textAlign: "center",
            fontSize: 12,
            letterSpacing: "0.28em",
            color: "var(--amber)",
            marginBottom: 18,
            textTransform: "uppercase",
          }}
        >
          THE ONES WHO CAME BEFORE
        </p>
        <div
          className="hx-card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 0,
            padding: "36px 20px",
            textAlign: "center",
          }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} style={{ borderLeft: i === 0 ? "none" : "1px solid var(--hair)" }}>
              <div className="hx-display" style={{ fontSize: "clamp(26px, 4vw, 40px)", color: "var(--blood-bright)" }}>
                {s.value}
              </div>
              <div className="hx-mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--bone-dim)", marginTop: 6 }}>
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
        <p className="hx-mono" style={{ fontSize: 10, color: "var(--bone-dim)", opacity: 0.5, textAlign: "center", marginTop: 12 }}>
          *ALLEGEDLY. THE COVEN DOES NOT CONFIRM OR DENY.
        </p>
      </Reveal>
    </section>
  );
}