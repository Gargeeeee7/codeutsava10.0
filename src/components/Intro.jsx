import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull } from "lucide-react";
import SpookyBackground from "./SpookyBackground.jsx";

// Full-screen gate that plays a short "cursed tape warming up" static
// flicker on load, then waits for the visitor to enter. Clicking Enter
// triggers a quick flash-to-black transition before handing off to the
// landing page (see App.jsx).
export default function Intro({ onEnter }) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    if (exiting) return;
    setExiting(true);
    // let the flash animation play before mounting the landing page
    setTimeout(onEnter, 650);
  };

  return (
    <motion.div
      className="hx-static-in"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        background: "var(--void)",
        padding: 24,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/images/intro-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "saturate(1.05) contrast(1.08) brightness(0.92)",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,8,7,0.55) 0%, rgba(10,8,7,0.25) 35%, rgba(10,8,7,0.55) 70%, rgba(10,8,7,0.92) 100%)",
        }}
        aria-hidden="true"
      />
      <SpookyBackground />
      <div className="hx-intro-vignette" />

      <div style={{ position: "relative", zIndex: 1, marginTop: "-35vh" }}>
        <Skull size={30} color="var(--blood-bright)" style={{ marginBottom: 22 }} />

        <p className="hx-eyebrow hx-flicker" style={{ marginBottom: 14 }}>
          Turing Club of Programmers presents
        </p>

        <h1
          data-text="CODEUTSAVA X"
          className="hx-glitch hx-display"
          style={{ fontSize: "clamp(48px, 12vw, 118px)", margin: 0 }}
        >
          CODEUTSAVA X
        </h1>

        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontStyle: "italic",
            color: "var(--bone-dim)",
            fontSize: "clamp(15px, 2vw, 19px)",
            margin: "16px auto 46px",
            maxWidth: 460,
            textAlign: "center",
          }}
        >
          A festival to die for.
        </p>

        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="hx-heartbeat-glow" />
          <motion.button
            className="hx-btn"
            onClick={handleEnter}
            whileTap={{ scale: 0.96 }}
            style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}
          >
            Enter If You Dare
            <span className="hx-blink">▮</span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {exiting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, times: [0, 0.15, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--bone)",
              zIndex: 90,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}