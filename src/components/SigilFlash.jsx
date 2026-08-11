import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SigilFlash — rare occult glyph that briefly appears then dies.
 * Fires every ~12–28s at a random screen position.
 * Extremely short lived so it feels like a glitch, not decoration.
 */

const SIGILS = [
  // inverted cross with barbs
  "M12 2 L12 22 M8 6 L16 6 M9 18 L12 22 L15 18",

  // open eye (watching)
  "M2 12 Q12 4 22 12 Q12 20 2 12 M12 12 m-2.5 0 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0",

  // broken circle / incomplete seal
  "M12 3 A9 9 0 1 1 5 6 M12 3 L12 7 M5 6 L7.5 9",

  // three vertical scratches (claw / tally)
  "M7 4 L6 20 M12 3 L12 21 M17 4 L18 20",

  // spiral that collapses inward
  "M12 12 m0 -8 a8 8 0 1 1 -0.1 0 M12 12 m0 -5 a5 5 0 1 0 0.1 0 M12 12 m0 -2.5 a2.5 2.5 0 1 1 -0.1 0",

  // jagged vertical rift
  "M12 2 L10 7 L13 10 L9 14 L12 17 L11 22",

  // horned mark / crude goat skull suggestion
  "M12 8 L8 4 M12 8 L16 4 M8 10 Q12 20 16 10 M10 12 L14 12",

  // crossed bones-ish X with center point
  "M5 5 L19 19 M19 5 L5 19 M12 12 m-1.5 0 a1.5 1.5 0 1 0 3 0 a1.5 1.5 0 1 0 -3 0",

  // sealed door / barrier rune
  "M6 4 L6 20 L18 20 L18 4 M6 4 L12 8 L18 4 M9 12 L15 12 M9 16 L15 16",

  // worm / tendril coil
  "M4 16 Q8 8 12 12 Q16 16 20 8",
];

function randomSigil() {
  return {
    id: Date.now() + Math.random(),
    path: SIGILS[Math.floor(Math.random() * SIGILS.length)],
    x: 8 + Math.random() * 84,   // %
    y: 10 + Math.random() * 70,  // %
    size: 48 + Math.random() * 56,
    rot: -25 + Math.random() * 50,
  };
}

export default function SigilFlash() {
  const [sigil, setSigil] = useState(null);

  const trigger = useCallback(() => {
    setSigil(randomSigil());
    // hold visible briefly then clear
    const clear = setTimeout(() => setSigil(null), 380 + Math.random() * 220);
    return () => clearTimeout(clear);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let timer;

const schedule = () => {
    // TEST: every 4–7s, always fire
    // PROD later: 12000 + Math.random() * 16000, and Math.random() < 0.55
    const delay = 4000 + Math.random() * 3000;
    timer = setTimeout(() => {
      if (cancelled) return;
      trigger();          // always fire while testing
      schedule();
    }, delay);
  }

// first flash after 2s
  timer = setTimeout(() => {
    if (!cancelled) {
      trigger();
      schedule();
    }
  }, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trigger]);

  return (
    <div className="hx-sigil-layer" aria-hidden="true">
      <AnimatePresence>
        {sigil && (
          <motion.div
            key={sigil.id}
            initial={{ opacity: 0, scale: 0.7, filter: "blur(6px)" }}
            animate={{
              opacity: [0, 0.85, 0.4, 0.9, 0],
              scale: [0.7, 1.05, 0.98, 1.02, 1.1],
              filter: ["blur(6px)", "blur(0px)", "blur(1px)", "blur(0px)", "blur(4px)"],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, times: [0, 0.15, 0.4, 0.7, 1] }}
            style={{
              position: "absolute",
              left: `${sigil.x}%`,
              top: `${sigil.y}%`,
              width: sigil.size,
              height: sigil.size,
              transform: `translate(-50%, -50%) rotate(${sigil.rot}deg)`,
              pointerEvents: "none",
            }}
          >
            <svg
  viewBox="0 0 24 24"
  width="100%"
  height="100%"
  fill="none"
  stroke="rgba(194, 36, 47, 0.95)"
  strokeWidth="1.35"
  strokeLinecap="round"
  strokeLinejoin="round"
  style={{
    filter:
      "drop-shadow(0 0 6px rgba(194,36,47,0.7)) drop-shadow(0 0 14px rgba(80,0,10,0.5))",
  }}
>
  <path d={sigil.path} />
</svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}