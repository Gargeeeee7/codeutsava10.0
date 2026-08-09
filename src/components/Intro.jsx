import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull } from "lucide-react";
import SpookyBackground from "./SpookyBackground.jsx";

// Eyes that flicker into existence in a random dark corner every so often,
// then vanish. Pure atmosphere — nothing to click, nothing to explain.
function WatchingEyes() {
  const CORNERS = [
    { top: "14%", left: "8%" },
    { top: "12%", right: "8%" },
    { bottom: "18%", left: "10%" },
    { bottom: "16%", right: "9%" },
  ];
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState(CORNERS[0]);

  useEffect(() => {
    let showTimer, hideTimer, loopTimer;
    const cycle = () => {
      setPos(CORNERS[Math.floor(Math.random() * CORNERS.length)]);
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 1600 + Math.random() * 700);
      loopTimer = setTimeout(cycle, 7000 + Math.random() * 6000);
    };
    showTimer = setTimeout(cycle, 3500);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(loopTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, times: [0, 0.2, 0.75, 1] }}
          style={{ position: "absolute", ...pos, display: "flex", gap: 10, zIndex: 1 }}
          aria-hidden="true"
        >
          <span className="hx-eye" />
          <span className="hx-eye" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// A skull that slides in from a random screen edge (left or right),
// holds there for a moment like it's peeking around a doorframe, then
// slides back out. Runs on its own random timer, independent of the eyes.
function PeekingSkull() {
  const [visible, setVisible] = useState(false);
  const [side, setSide] = useState("left");
  const [top, setTop] = useState("40%");

  useEffect(() => {
    let showTimer, hideTimer, loopTimer;
    const cycle = () => {
      setSide(Math.random() < 0.5 ? "left" : "right");
      setTop(`${18 + Math.random() * 58}%`);
      setVisible(true);
      hideTimer = setTimeout(() => setVisible(false), 1900 + Math.random() * 900);
      loopTimer = setTimeout(cycle, 4200 + Math.random() * 4000);
    };
    showTimer = setTimeout(cycle, 2600);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(loopTimer);
    };
  }, []);

  const isLeft = side === "left";
  const baseRot = isLeft ? -24 : 24;
  const SKULL_W = 84;
  const hiddenX = isLeft ? -(SKULL_W + 40) : SKULL_W + 40; // fully off-screen
  const peekX = isLeft ? -(SKULL_W * 0.3) : SKULL_W * 0.3; // ~70% visible, peeking in

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: hiddenX, opacity: 0, rotate: baseRot }}
          animate={{
            x: peekX,
            opacity: 1,
            rotate: [baseRot, baseRot + (isLeft ? 4 : -4), baseRot - (isLeft ? 3 : -3), baseRot],
          }}
          exit={{ x: hiddenX, opacity: 0, rotate: baseRot }}
          transition={{
            x: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.5 },
            rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            top,
            left: isLeft ? 0 : "auto",
            right: isLeft ? "auto" : 0,
            zIndex: 1,
          }}
          aria-hidden="true"
        >
          <div style={{ position: "relative" }}>
            <div
              className="hx-flicker"
              style={{
                position: "absolute",
                inset: -18,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(194,36,47,0.5), transparent 70%)",
                filter: "blur(6px)",
              }}
            />
            <Skull
              size={84}
              color="var(--bone)"
              strokeWidth={1.75}
              style={{
                position: "relative",
                filter:
                  "drop-shadow(0 0 14px rgba(194,36,47,0.85)) drop-shadow(0 0 30px rgba(194,36,47,0.4))",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

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
      <SpookyBackground />
      <div className="hx-intro-vignette" />
      <WatchingEyes />
      <PeekingSkull />

      <Skull size={30} color="var(--blood-bright)" style={{ marginBottom: 22, position: "relative", zIndex: 1 }} />

      <p className="hx-eyebrow hx-flicker" style={{ marginBottom: 14, position: "relative", zIndex: 1 }}>
        Turing Club of Programmers presents
      </p>

      <h1
        data-text="CODEUTSAVA"
        className="hx-glitch hx-display"
        style={{ fontSize: "clamp(48px, 12vw, 118px)", margin: 0, position: "relative", zIndex: 1 }}
      >
        CODEUTSAVA
      </h1>

      <p
        style={{
          fontFamily: "'EB Garamond', serif",
          fontStyle: "italic",
          color: "var(--bone-dim)",
          fontSize: "clamp(15px, 2vw, 19px)",
          margin: "16px 0 46px",
          maxWidth: 460,
          position: "relative",
          zIndex: 1,
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