import React from "react";
import { ShieldAlert } from "lucide-react";
import { Reveal, SectionLabel, GlitchTitle } from "./shared";
import { RULES } from "../../data/landingData";

export default function RulesSection() {
  return (
    <section className="hx-section">
      <SectionLabel num="03" title="Rules of the Ritual" icon={ShieldAlert} />
      <Reveal>
        <GlitchTitle text="Read Before You Bleed" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 44, color: "var(--bone)" }} />
      </Reveal>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {RULES.map((rule, i) => (
          <Reveal key={rule} delay={i * 0.05}>
            <div style={{ display: "flex", gap: 18, padding: "16px 0", borderBottom: i < RULES.length - 1 ? "1px solid var(--hair)" : "none" }}>
              <span className="hx-display" style={{ color: "var(--blood-bright)", fontSize: 20, minWidth: 28 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ color: "var(--bone-dim)", lineHeight: 1.6 }}>{rule}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}