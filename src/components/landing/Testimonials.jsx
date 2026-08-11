import React from "react";
import { Quote } from "lucide-react";
import { Reveal, SectionLabel, GlitchTitle } from "./shared";
import { TESTIMONIALS } from "../../data/landingData";

export default function Testimonials() {
  return (
    <section className="hx-section">
      <SectionLabel num="05" title="Survivor Testimonies" icon={Quote} />
      <Reveal>
        <GlitchTitle text="What They Whispered" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 56, color: "var(--bone)" }} />
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div className="hx-card" style={{ padding: "30px 26px", height: "100%" }}>
              <Quote size={20} color="var(--blood-bright)" style={{ marginBottom: 14, opacity: 0.7 }} />
              <p style={{ color: "var(--bone)", fontStyle: "italic", lineHeight: 1.6, marginBottom: 20, fontSize: 15 }}>
                "{t.quote}"
              </p>
              <div className="hx-mono" style={{ fontSize: 11.5, color: "var(--amber)" }}>{t.name.toUpperCase()}</div>
              <div className="hx-mono" style={{ fontSize: 10.5, color: "var(--bone-dim)", marginTop: 2 }}>{t.role}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}