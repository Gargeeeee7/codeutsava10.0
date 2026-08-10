import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Transition — colder, more liminal version
 * 1. static   — CRT noise / signal death
 * 2. message  — delayed, glitching text that feels incorrect
 * 3. presence — brief silhouette in the noise
 * 4. swallow  — void + blood red fills the screen, then hands off to Landing
 */

const LINES = [
  "YOU FOUND AN EXIT",
  "IT WASN'T YOURS",
  "WELCOME BACK",
];

export default function Transition({ onComplete }) {
  const [phase, setPhase] = useState("static"); // static → message → presence → swallow
  const [lineIndex, setLineIndex] = useState(0);
  const [glitchChar, setGlitchChar] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("message"), 900);
    const t2 = setTimeout(() => setLineIndex(1), 900 + 1400);
    const t3 = setTimeout(() => setLineIndex(2), 900 + 2800);
    const t4 = setTimeout(() => setPhase("presence"), 900 + 4200);
    const t5 = setTimeout(() => setPhase("swallow"), 900 + 5200);
    const t6 = setTimeout(onComplete, 900 + 5200 + 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  // occasional character corruption while text is visible
  useEffect(() => {
    if (phase !== "message" && phase !== "presence") return;
    const id = setInterval(() => {
      setGlitchChar(true);
      setTimeout(() => setGlitchChar(false), 60 + Math.random() * 80);
    }, 380 + Math.random() * 500);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        background: "#050403",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* persistent heavy grain */}
      <div className="tr-noise" aria-hidden="true" />

      {/* rolling CRT bar */}
      <div className="tr-scan" aria-hidden="true" />

      {/* PHASE: static burst */}
      <AnimatePresence>
        {phase === "static" && (
          <motion.div
            key="static"
            className="tr-static-burst"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* PHASE: message */}
      <AnimatePresence mode="wait">
        {(phase === "message" || phase === "presence") && (
          <motion.div
            key={lineIndex}
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)", y: 8 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={`tr-message ${glitchChar ? "tr-message--glitch" : ""}`}
          >
            {LINES[lineIndex]}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE: presence — brief wrong silhouette */}
      <AnimatePresence>
        {phase === "presence" && (
          <motion.div
            key="entity"
            className="tr-entity"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0.15, 0.55, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.95, times: [0, 0.15, 0.4, 0.7, 1] }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* PHASE: swallow — red-black fill that Landing can continue from */}
      <AnimatePresence>
        {phase === "swallow" && (
          <motion.div
            key="swallow"
            initial={{ scaleY: 0, opacity: 0.9 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.95, ease: [0.7, 0, 0.2, 1] }}
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "center top",
              background:
                "linear-gradient(180deg, #c2242f 0%, #6b0f18 35%, #1a0508 70%, #050403 100%)",
              zIndex: 20,
            }}
          />
        )}
      </AnimatePresence>

      {/* subtle vignette always on */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.75) 100%)",
          zIndex: 30,
        }}
      />
    </div>
  );
}