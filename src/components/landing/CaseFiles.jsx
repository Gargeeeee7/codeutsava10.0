import React, { useState } from "react";
import { Skull } from "lucide-react";
import { Reveal, SectionLabel, GlitchTitle } from "./shared";
import { CASES } from "../../data/landingData";

export default function CaseFiles() {
  const [activeCase, setActiveCase] = useState(null);

  return (
    <section className="hx-section">
      <SectionLabel num="00.5" title="Open Cases · Evidence Tags" icon={Skull} />
      <Reveal>
        <GlitchTitle text="The Ones Still Missing" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 48, color: "var(--bone)" }} />
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 28 }}>
        {CASES.map((c) => (
          <Reveal key={c.id}>
            <div
              onClick={() => setActiveCase(activeCase === c.id ? null : c.id)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              {/* Manila folder */}
              <div
                style={{
                  position: "relative",
                  background: "#d6c6a8",
                  color: "#1c1917",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.45)",
                  clipPath: "polygon(0 0, 100% 0, 100% 92%, 97% 100%, 3% 100%, 0 92%)",
                }}
              >
                {/* folder tab */}
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    left: 16,
                    width: 72,
                    height: 14,
                    background: "#c4b08a",
                    borderRadius: "3px 3px 0 0",
                    border: "1px solid #a89b7a",
                  }}
                />

                {/* red stamped number */}
                <div style={{ position: "absolute", top: 14, right: 14, transform: "rotate(-8deg)" }}>
                  <div
                    style={{
                      border: "2px solid #b91c1c",
                      color: "#b91c1c",
                      padding: "2px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      opacity: 0.9,
                    }}
                  >
                    {c.id}
                  </div>
                </div>

                <div style={{ padding: "28px 22px 22px" }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#78716c", marginBottom: 4 }}>
                    CASE FILE
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "0.04em", marginBottom: 12, borderBottom: "1px solid rgba(168,155,122,0.55)", paddingBottom: 8 }}>
                    {c.name}
                  </div>

                  <div style={{ fontSize: 11, lineHeight: 1.55 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#57534e" }}>STATUS</span>
                      <span style={{ fontWeight: 700, letterSpacing: "0.06em", color: "#b91c1c" }}>{c.status}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#57534e" }}>LAST SEEN</span>
                      <span style={{ textAlign: "right", maxWidth: "58%" }}>{c.lastSeen}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      overflow: "hidden",
                      transition: "max-height 0.3s ease, opacity 0.3s ease, margin-top 0.3s ease",
                      maxHeight: activeCase === c.id ? 120 : 0,
                      opacity: activeCase === c.id ? 1 : 0,
                      marginTop: activeCase === c.id ? 14 : 0,
                    }}
                  >
                    <div style={{ fontSize: 11, lineHeight: 1.55, borderTop: "1px solid rgba(168,155,122,0.45)", paddingTop: 12, color: "#44403c" }}>
                      {c.note}
                    </div>
                  </div>

                  {/* paper-clip detail */}
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 12,
                      width: 10,
                      height: 22,
                      borderLeft: "2px solid rgba(120,113,108,0.4)",
                      borderTop: "2px solid rgba(120,113,108,0.4)",
                      borderBottom: "2px solid rgba(120,113,108,0.4)",
                      borderRadius: "3px 0 0 3px",
                    }}
                  />
                </div>

                {/* aged edge */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    opacity: 0.18,
                    background: "linear-gradient(135deg, transparent 55%, #78716c 100%)",
                  }}
                />
              </div>

              {/* red evidence tag */}
              <div
                style={{
                  position: "absolute",
                  bottom: -10,
                  left: "50%",
                  transform: "translateX(-50%) rotate(1deg)",
                  width: 64,
                  height: 22,
                  background: "#991b1b",
                  color: "#fecaca",
                  fontSize: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  letterSpacing: "0.14em",
                  fontWeight: 700,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.35)",
                }}
              >
                EVIDENCE
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}