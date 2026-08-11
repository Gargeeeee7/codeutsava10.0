import React from "react";

/**
 * GlassSmudge — fixed dirty-glass layer.
 * Fingerprints, oily smears, and a soft haze that sits over the whole site.
 * pointer-events: none so it never blocks clicks.
 */
export default function GlassSmudge() {
  return (
    <div className="hx-glass-smudge" aria-hidden="true">
      {/* large oily smear top-left */}
      <div
        className="hx-smudge"
        style={{
          top: "8%",
          left: "4%",
          width: 220,
          height: 160,
          transform: "rotate(-12deg)",
          opacity: 0.35,
        }}
      />
      {/* fingerprint cluster mid-right */}
      <div
        className="hx-smudge hx-smudge--print"
        style={{
          top: "38%",
          right: "6%",
          width: 90,
          height: 110,
          transform: "rotate(8deg)",
          opacity: 0.4,
        }}
      />
      {/* streak across lower third */}
      <div
        className="hx-smudge"
        style={{
          bottom: "18%",
          left: "22%",
          width: 340,
          height: 70,
          transform: "rotate(-3deg) skewX(-8deg)",
          opacity: 0.28,
        }}
      />
      {/* small print near top center */}
      <div
        className="hx-smudge hx-smudge--print"
        style={{
          top: "12%",
          left: "48%",
          width: 70,
          height: 85,
          transform: "rotate(-18deg)",
          opacity: 0.32,
        }}
      />
      {/* corner wipe residue */}
      <div
        className="hx-smudge"
        style={{
          bottom: "6%",
          right: "10%",
          width: 160,
          height: 120,
          transform: "rotate(15deg)",
          opacity: 0.3,
        }}
      />
    </div>
  );
}