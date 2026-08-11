import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function useCountdown(target) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

export function GlitchTitle({ text, style = {} }) {
  return (
    <motion.h2 data-text={text} className="hx-glitch hx-display" style={style}>
      {text}
    </motion.h2>
  );
}

export function Reveal({ children, delay = 0, y = 36 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({ icon: Icon, num, title }) {
  return (
    <Reveal>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <span className="hx-num">{num}</span>
        <div className="hx-divider" style={{ width: 40, height: 1 }} />
        {Icon && <Icon size={16} color="var(--amber)" />}
        <span className="hx-eyebrow">{title}</span>
      </div>
    </Reveal>
  );
}

export function DaggerDivider() {
  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, maxWidth: 260, margin: "70px auto" }}
      aria-hidden="true"
    >
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, var(--hair))" }} />
      <svg viewBox="0 0 24 40" width="13" height="22">
        <rect x="10" y="0" width="4" height="7" fill="var(--bone-dim)" opacity="0.7" />
        <rect x="6" y="12" width="12" height="3" fill="var(--bone-dim)" opacity="0.7" />
        <polygon points="9,15 15,15 12.5,38 11.5,38" fill="var(--bone-dim)" opacity="0.7" />
      </svg>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, var(--hair))" }} />
    </div>
  );
}

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: 260,
        height: 260,
        marginLeft: -130,
        marginTop: -130,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(194,36,47,0.10), transparent 70%)",
        pointerEvents: "none",
        zIndex: 1,
        transition: "left 0.18s ease-out, top 0.18s ease-out",
      }}
    />
  );
}