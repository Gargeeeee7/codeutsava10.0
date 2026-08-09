import React, { useMemo } from "react";
import { motion } from "framer-motion";

// Fixed, full-page ambient background: three slow-drifting fog blobs
// plus a handful of embers rising like dust/ash. Sits behind everything
// (z-index -1) and is shared by both the intro and the landing page so
// the atmosphere never resets when the intro exits.
export default function Background() {
  const embers = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 10 + Math.random() * 14,
        delay: Math.random() * 10,
        drift: (Math.random() - 0.5) * 60,
      })),
    []
  );

  return (
    <div className="hx-bg" aria-hidden="true">
      <div className="hx-fog-blob hx-fog-1" />
      <div className="hx-fog-blob hx-fog-2" />
      <div className="hx-fog-blob hx-fog-3" />

      {embers.map((e) => (
        <motion.span
          key={e.id}
          className="hx-ember"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: "-110vh",
            x: [0, e.drift, 0],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
