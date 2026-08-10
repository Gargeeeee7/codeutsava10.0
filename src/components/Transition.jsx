import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Transition
 * Plays between the game and the landing page:
 *   1. glitch  — quick static/flicker burst
 *   2. welcome — "WELCOME" drips in, letter by letter, in blood-red;
 *                the "L" is replaced with a dagger, blood dripping off its tip
 *   3. wash    — a scalloped wave of blood sweeps down to fully cover the screen
 * Once fully covered, onComplete fires (the parent swaps to the landing
 * page). Landing itself then drains the blood away on mount (see the
 * BloodReveal piece in Landing.jsx) so the flood visually continues
 * into the reveal rather than cutting hard.
 */

const WELCOME = "WELCOME";

// Deterministic pseudo-random per-letter drip layout (2–3 drips each,
// varied position/width/length/timing) so it reads as organic rather
// than a single uniform streak under every letter. Anchored to the
// BOTTOM of each letter (see .tr-drip in index.css) so it always touches
// the glyph regardless of the display font's internal line metrics.
function seededRand(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const DRIP_LETTERS = WELCOME.split("").map((ch, i) => {
  const rand = seededRand(i * 137 + 11);
  const count = ch === "L" ? 2 : 2 + Math.round(rand());
  const drips = Array.from({ length: count }).map((_, d) => ({
    left: `${16 + rand() * 68}%`,
    width: `${3 + rand() * 2.5}px`,
    height: `${0.8 + rand() * 1.6}em`,
    duration: `${1.2 + rand() * 0.9}s`,
    delay: `${0.6 + i * 0.09 + rand() * 0.5}s`,
  }));
  return { ch, drips };
});

// A dagger: pommel + ridged grip at top, crossguard, blade tapering to a
// point at the bottom — matching a knife held hilt-up, blade-down, with
// blood running off the tip (the .tr-drip elements below handle that part).
function DaggerGlyph() {
  return (
    <svg viewBox="0 0 24 60" width="0.58em" height="1em" style={{ display: "block" }}>
      <rect x="9" y="0" width="6" height="3" rx="1" fill="#171310" />
      <rect x="8" y="3" width="8" height="18" rx="1.5" fill="#221a14" />
      {[6, 9, 12, 15, 18].map((y) => (
        <rect key={y} x="8" y={y} width="8" height="1.4" fill="#0e0b08" opacity="0.7" />
      ))}
      <rect x="4" y="21" width="16" height="4" rx="1.2" fill="#171310" />
      <polygon points="9,25 15,25 12.5,53 11.5,53" fill="#cfcac0" />
      <polygon points="11,25 13,25 12,50" fill="#8f897f" opacity="0.6" />
    </svg>
  );
}

// Builds a smooth SVG path through a sequence of [x,y] points using the
// midpoint-quadratic technique — enough to make a scalloped wave without
// needing a full spline library.
function smoothThrough(points) {
  let d = `M${points[0][0]},${points[0][1]} `;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    d += `Q${x0},${y0} ${mx},${my} `;
  }
  const last = points[points.length - 1];
  d += `L${last[0]},${last[1]} `;
  return d;
}

const WAVE_W = 400;
// mostly shallow scallops with two deeper drips, mirroring the reference wipe
const WAVE_POINTS = [
  [0, 55], [40, 78], [80, 48], [120, 102], [160, 58],
  [200, 82], [240, 42], [280, 98], [320, 62], [360, 86], [400, 55],
];
const WAVE_PATH = (() => {
  const reversed = [...WAVE_POINTS].reverse();
  const wave = smoothThrough(reversed).replace(/^M/, "L");
  return `M0,0 L${WAVE_W},0 ${wave} L0,0 Z`;
})();

function WaveWash() {
  return (
    <motion.div
      initial={{ y: "-100%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 0.95, ease: [0.6, 0, 0.2, 1] }}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "160%", zIndex: 5 }}
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${WAVE_W} 130`} preserveAspectRatio="none" width="100%" height="100%">
        <defs>
          <linearGradient id="tr-wave-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c2242f" />
            <stop offset="55%" stopColor="#8a121c" />
            <stop offset="100%" stopColor="#3d0a10" />
          </linearGradient>
        </defs>
        <path d={WAVE_PATH} fill="url(#tr-wave-grad)" />
      </svg>
    </motion.div>
  );
}

export default function Transition({ onComplete }) {
  const [phase, setPhase] = useState("glitch"); // glitch -> welcome -> wash

  useEffect(() => {
    const toWelcome = setTimeout(() => setPhase("welcome"), 550);
    const toWash = setTimeout(() => setPhase("wash"), 550 + 2100);
    const finish = setTimeout(onComplete, 550 + 2100 + 1000);
    return () => {
      clearTimeout(toWelcome);
      clearTimeout(toWash);
      clearTimeout(finish);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "var(--void)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {phase === "glitch" && <div className="tr-glitch-flash" aria-hidden="true" />}

      {(phase === "welcome" || phase === "wash") && (
        <div className="tr-welcome" aria-hidden="true">
          {DRIP_LETTERS.map(({ ch, drips }, i) =>
            ch === "L" ? (
              <span key={i} className="tr-knife-letter">
                <DaggerGlyph />
                {drips.map((d, j) => (
                  <span
                    key={j}
                    className="tr-drip"
                    style={{
                      "--dleft": d.left,
                      "--dw": d.width,
                      "--dh": d.height,
                      "--ddur": d.duration,
                      "--ddelay": d.delay,
                    }}
                  />
                ))}
              </span>
            ) : (
              <span key={i} className="tr-drip-letter" style={{ animationDelay: `${i * 0.08}s` }}>
                {ch}
                {drips.map((d, j) => (
                  <span
                    key={j}
                    className="tr-drip"
                    style={{
                      "--dleft": d.left,
                      "--dw": d.width,
                      "--dh": d.height,
                      "--ddur": d.duration,
                      "--ddelay": d.delay,
                    }}
                  />
                ))}
              </span>
            )
          )}
        </div>
      )}

      {phase === "wash" && <WaveWash />}
    </div>
  );
}