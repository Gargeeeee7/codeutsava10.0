import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Volume2, VolumeX } from "lucide-react";
import SpookyBackground from "./SpookyBackground.jsx";

const WISH_DURATION_MS = 60 * 60 * 1000; // 1 hour

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

// Full-screen gate. On "Enter", runs a tunnel-rush sequence that zooms
// into the cave mouth, then hands off to the game stage.
// Easter egg: the One Wish Willow above the title opens a wish modal.
export default function Intro({ onEnter }) {
  const [exiting, setExiting] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [wish, setWish] = useState("");
  const [wishSent, setWishSent] = useState(false);
  const [wishEndsAt, setWishEndsAt] = useState(null);
  const [remaining, setRemaining] = useState(WISH_DURATION_MS);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  // Intro ambient — public/audio/intro-ambient.mp3
  useEffect(() => {
    const audio = new Audio("/audio/intro-ambient.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {});
    };
    tryPlay();

    const unlock = () => {
      tryPlay();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
    if (!muted) audio.play().catch(() => {});
  }, [muted]);

  // Stop intro music when leaving via tunnel
  useEffect(() => {
    if (!exiting) return;
    const audio = audioRef.current;
    if (!audio) return;
    const fade = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume = Math.max(0, audio.volume - 0.05);
      } else {
        audio.pause();
        clearInterval(fade);
      }
    }, 80);
    return () => clearInterval(fade);
  }, [exiting]);

  // tick the 1-hour countdown while a wish is active
  useEffect(() => {
    if (!wishSent || !wishEndsAt) return;
    const tick = () => {
      const left = Math.max(0, wishEndsAt - Date.now());
      setRemaining(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [wishSent, wishEndsAt]);

  const handleEnter = () => {
    if (exiting || wishOpen) return;
    setExiting(true);
    setTimeout(onEnter, 1500);
  };

  const handleWishSubmit = (e) => {
    e.preventDefault();
    if (!wish.trim()) return;
    setWishSent(true);
    setWishEndsAt(Date.now() + WISH_DURATION_MS);
    setRemaining(WISH_DURATION_MS);
  };

  return (
    <motion.div
      className="hx-static-in"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
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
        className={exiting ? "hx-tunnel-bg hx-tunnel-bg--rush" : "hx-tunnel-bg"}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/images/intro-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 42%",
          filter: "saturate(0.92) contrast(1.05) brightness(1.08)",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,8,7,0.42) 0%, rgba(10,8,7,0.18) 35%, rgba(10,8,7,0.42) 70%, rgba(10,8,7,0.82) 100%)",
          opacity: exiting ? 0 : 1,
          transition: "opacity 0.4s ease",
        }}
        aria-hidden="true"
      />
      <SpookyBackground />
      <div className="hx-intro-vignette" style={{ opacity: exiting ? 0 : 1, transition: "opacity 0.3s ease" }} />

      <motion.div
        animate={exiting ? { opacity: 0, scale: 1.15, filter: "blur(6px)" } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeIn" }}
        style={{ position: "relative", zIndex: 1, marginTop: "-35vh", pointerEvents: exiting ? "none" : "auto" }}
      >
        {/* One Wish Willow — easter egg (PNG) */}
        <motion.button
          type="button"
          className="hx-willow"
          onClick={() => setWishOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          title="One Wish Willow"
          aria-label="One Wish Willow — make a wish"
        >
          <img
            src="/images/one-wish-willow.png"
            alt="One Wish Willow"
            className="hx-willow-img"
            draggable={false}
          />
        </motion.button>

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
            margin: "16px auto 0",
            maxWidth: 460,
            textAlign: "center",
          }}
        >
          A festival to die for.
        </p>
      </motion.div>

      <motion.div
        animate={exiting ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: "8vh",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: exiting || wishOpen ? "none" : "auto",
        }}
      >
        <div className="hx-heartbeat-glow" />
        <motion.button
          className="hx-btn"
          onClick={handleEnter}
          whileTap={{ scale: 0.96 }}
          style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10 }}
        >
          Dare to Enter ?
          <span className="hx-blink">▮</span>
        </motion.button>
      </motion.div>

      {/* Make a Wish modal */}
      <AnimatePresence>
        {wishOpen && (
          <motion.div
            className="hx-wish-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => !wishSent && setWishOpen(false)}
          >
            <motion.div
              className="hx-wish-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="wish-title"
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="hx-wish-close"
                onClick={() => setWishOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className="hx-wish-icon">
                <img
                  src="/images/one-wish-willow.png"
                  alt=""
                  className="hx-willow-img hx-willow-img--modal"
                  draggable={false}
                />
              </div>

              <h2 id="wish-title" className="hx-wish-title">
                One Wish Willow
              </h2>
              <p className="hx-wish-sub">
                You only get one wish. Crack it open and whisper into the dark.
              </p>

              {wishSent ? (
                <motion.div
                  className="hx-wish-thanks"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="hx-wish-thanks-line">
                    <Sparkles size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
                    Your wish has been taken by the wind…
                  </p>
                  <p className="hx-wish-timer-label">
                    {remaining > 0
                      ? "Your wish will be completed in"
                      : "Your wish should be complete"}
                  </p>
                  {remaining > 0 && (
                    <p className="hx-wish-timer" aria-live="polite">
                      {formatCountdown(remaining)}
                    </p>
                  )}
                </motion.div>
              ) : (
                <form onSubmit={handleWishSubmit} className="hx-wish-form">
                  <input
                    className="hx-wish-input"
                    type="text"
                    value={wish}
                    onChange={(e) => setWish(e.target.value)}
                    placeholder="Make a wish…"
                    maxLength={120}
                    autoFocus
                  />
                  <button type="submit" className="hx-wish-submit" disabled={!wish.trim()}>
                    Crack &amp; send
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute — bottom right */}
      <button
        type="button"
        className="hx-btn"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute sound" : "Mute sound"}
        title={muted ? "Unmute" : "Mute"}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 40,
          padding: "9px 12px",
          fontSize: 11,
          display: "flex",
          alignItems: "center",
          gap: 6,
          pointerEvents: exiting ? "none" : "auto",
          opacity: exiting ? 0 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        {muted ? "Sound Off" : "Sound On"}
      </button>

      {/* Tunnel rush */}
      <AnimatePresence>
        {exiting && (
          <>
            <div className="hx-tunnel-stage" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="hx-tunnel-ring"
                  style={{ animationDelay: `${i * 0.09}s` }}
                />
              ))}
              <div className="hx-tunnel-core" />
            </div>
            <div className="hx-tunnel-streaks" aria-hidden="true" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.4, ease: "easeIn" }}
              style={{
                position: "fixed",
                inset: 0,
                background: "#000",
                zIndex: 95,
                pointerEvents: "none",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}