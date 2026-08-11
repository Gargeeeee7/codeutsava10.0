import React from "react";
import { Reveal } from "./shared";

/**
 * Full-bleed atmospheric break.
 * Pass silent to show only the image (no text) — used as a divider between sections.
 */
export default function PhotoBreak({ silent = false }) {
  return (
    <section
      style={{
        position: "relative",
        minHeight: silent ? "28vh" : "48vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
        margin: "20px 0",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/images/intro-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          backgroundAttachment: "fixed",
          filter: "saturate(1.05) contrast(1.05) brightness(0.75)",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: silent
            ? "linear-gradient(to bottom, rgba(10,8,7,0.55), rgba(10,8,7,0.25) 50%, rgba(10,8,7,0.55))"
            : "linear-gradient(to bottom, rgba(10,8,7,0.75), rgba(10,8,7,0.35) 45%, rgba(10,8,7,0.85))",
        }}
        aria-hidden="true"
      />
      {!silent && (
        <Reveal>
          <div style={{ position: "relative", zIndex: 1, padding: "0 24px" }}>
            <p className="hx-eyebrow" style={{ marginBottom: 14 }}>
              Whispers From the Woods
            </p>
            <p
              style={{
                fontFamily: "'EB Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(18px, 2.6vw, 26px)",
                color: "var(--bone)",
                maxWidth: 620,
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Somewhere past the treeline, the arch is still glowing. It has been glowing since 9.0.
              Nobody has asked why. Nobody plans to.
            </p>
          </div>
        </Reveal>
      )}
    </section>
  );
}