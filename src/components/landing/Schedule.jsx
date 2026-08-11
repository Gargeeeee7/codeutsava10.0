import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Moon } from "lucide-react";
import { Reveal, SectionLabel, GlitchTitle } from "./shared";
import { RITUALS } from "../../data/landingData";

const MATRIX_CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>[]{}|/\\#@$%&*";

/**
 * Glitch intensity presets (or pass a number 0–1).
 * 0 = off, 1 = full chaos.
 *
 *   low    → subtle, quick settle
 *   medium → balanced (default)
 *   high   → longer, denser scramble + stronger glow
 */
const GLITCH_PRESETS = {
  off:    { duration: 0,   frameMs: 40, glow: 0,    green: 0 },
  low:    { duration: 280, frameMs: 36, glow: 0.35, green: 0.55 },
  medium: { duration: 500, frameMs: 28, glow: 0.55, green: 0.75 },
  high:   { duration: 780, frameMs: 22, glow: 0.85, green: 1.0 },
};

// ── Change this one line to retune the whole schedule ──
const GLITCH_INTENSITY = "high"; // "off" | "low" | "medium" | "high" | 0..1

function resolveIntensity(intensity) {
  if (typeof intensity === "number") {
    const t = Math.max(0, Math.min(1, intensity));
    return {
      duration: Math.round(200 + t * 700),
      frameMs: Math.round(40 - t * 20),
      glow: 0.2 + t * 0.7,
      green: 0.4 + t * 0.6,
    };
  }
  return GLITCH_PRESETS[intensity] ?? GLITCH_PRESETS.medium;
}

/**
 * Scrambles text with a matrix/digital-rain feel, then resolves
 * to the real string. Fires once when `active` becomes true.
 * Intensity controls duration, frame rate, and glow strength.
 */
function MatrixGlitchText({ text, active, intensity = GLITCH_INTENSITY, style = {}, className = "" }) {
  const [display, setDisplay] = useState(text);
  const hasRun = useRef(false);
  const cfg = resolveIntensity(intensity);

  useEffect(() => {
    if (!active || hasRun.current) return;
    if (cfg.duration <= 0) {
      hasRun.current = true;
      setDisplay(text);
      return;
    }
    hasRun.current = true;

    const original = text;
    const totalFrames = Math.max(1, Math.ceil(cfg.duration / cfg.frameMs));
    let frame = 0;

    const id = setInterval(() => {
      frame += 1;
      const progress = frame / totalFrames;

      // ease-out lock: more scramble early, settles toward the end
      const lockRatio = progress * progress;
      const locked = Math.floor(lockRatio * original.length);

      let next = "";
      for (let i = 0; i < original.length; i++) {
        if (original[i] === " " || original[i] === "·") {
          next += original[i];
        } else if (i < locked) {
          next += original[i];
        } else {
          next += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        }
      }
      setDisplay(next);

      if (frame >= totalFrames) {
        clearInterval(id);
        setDisplay(original);
      }
    }, cfg.frameMs);

    return () => clearInterval(id);
  }, [active, text, cfg.duration, cfg.frameMs]);

  const isGlitching = display !== text;

  return (
    <span
      className={className}
      style={{
        ...style,
        fontVariantNumeric: "tabular-nums",
        textShadow: isGlitching
          ? `0 0 ${6 + cfg.glow * 10}px rgba(34,197,94,${cfg.glow}), 0 0 2px rgba(194,36,47,${cfg.glow * 0.7})`
          : undefined,
        color: isGlitching
          ? `rgba(74, 222, 128, ${cfg.green})`
          : style.color,
        transition: "color 0.12s ease",
      }}
    >
      {display}
    </span>
  );
}

/**
 * Schedule / Rituals timeline
 * Inspired by the corridor + locked-suite atmosphere of Hokum (2026):
 * a single vertical "hallway" with events materialising from either side,
 * like doors opening along a haunted inn corridor.
 * Each time/date gets a 0.5s matrix glitch as it slides in.
 */
export default function Schedule() {
  return (
    <section id="rituals" className="hx-section">
      <SectionLabel num="02" title="Rituals · The Schedule" icon={Moon} />
      <Reveal>
        <GlitchTitle
          text="28 Hours, One Night"
          style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 16, color: "var(--bone)" }}
        />
      </Reveal>
      <Reveal delay={0.1}>
        <p
          style={{
            textAlign: "center",
            color: "var(--bone-dim)",
            fontStyle: "italic",
            fontSize: 15,
            maxWidth: 480,
            margin: "0 auto 56px",
            lineHeight: 1.6,
          }}
        >
          Check in. The corridor only goes one way.
        </p>
      </Reveal>

      {/* Corridor timeline */}
      <div
        style={{
          position: "relative",
          maxWidth: 920,
          margin: "0 auto",
          padding: "12px 0 40px",
        }}
      >
        {/* Central hallway line */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 2,
            transform: "translateX(-50%)",
            background:
              "linear-gradient(to bottom, transparent 0%, var(--blood-bright) 8%, var(--blood-bright) 92%, transparent 100%)",
            opacity: 0.85,
            boxShadow: "0 0 18px rgba(194,36,47,0.35)",
          }}
        />

        {/* Subtle vertical "door frame" ticks along the line */}
        {RITUALS.map((_, i) => (
          <div
            key={`tick-${i}`}
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: `calc(${(i / (RITUALS.length - 1 || 1)) * 100}% )`,
              width: 14,
              height: 2,
              transform: "translate(-50%, -50%)",
              background: "var(--bone-dim)",
              opacity: 0.35,
            }}
          />
        ))}

        {RITUALS.map((r, i) => {
          const fromLeft = i % 2 === 0;
          return (
            <TimelineRow key={r.title} item={r} index={i} fromLeft={fromLeft} />
          );
        })}
      </div>
    </section>
  );
}

function TimelineRow({ item, index, fromLeft }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        x: fromLeft ? -72 : 72,
        filter: "blur(4px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.75,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 48px 1fr",
        alignItems: "center",
        marginBottom: 36,
        position: "relative",
      }}
    >
      {/* LEFT CARD */}
      <div
        style={{
          gridColumn: 1,
          justifySelf: fromLeft ? "end" : "start",
          width: "100%",
          maxWidth: 380,
          opacity: fromLeft ? 1 : 0,
          pointerEvents: fromLeft ? "auto" : "none",
        }}
      >
        {fromLeft && <EventCard item={item} side="left" glitchActive={inView} />}
      </div>

      {/* CENTER NODE — locked-suite style seal */}
      <div
        style={{
          gridColumn: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.07 + 0.15, type: "spring", stiffness: 260, damping: 18 }}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--void)",
            border: "2px solid var(--blood-bright)",
            boxShadow: "0 0 0 4px rgba(10,8,7,0.9), 0 0 16px rgba(194,36,47,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <item.icon size={15} color="var(--amber)" />
        </motion.div>
      </div>

      {/* RIGHT CARD */}
      <div
        style={{
          gridColumn: 3,
          justifySelf: fromLeft ? "end" : "start",
          width: "100%",
          maxWidth: 380,
          opacity: fromLeft ? 0 : 1,
          pointerEvents: fromLeft ? "none" : "auto",
        }}
      >
        {!fromLeft && <EventCard item={item} side="right" glitchActive={inView} />}
      </div>
    </motion.div>
  );
}

function EventCard({ item, side, glitchActive }) {
  return (
    <div
      className="hx-card"
      style={{
        padding: "20px 22px",
        textAlign: side === "left" ? "right" : "left",
        position: "relative",
        borderLeft: side === "right" ? "3px solid rgba(194,36,47,0.55)" : undefined,
        borderRight: side === "left" ? "3px solid rgba(194,36,47,0.55)" : undefined,
        background:
          "linear-gradient(135deg, rgba(28,25,23,0.95) 0%, rgba(18,16,15,0.98) 100%)",
      }}
    >
      <div
        className="hx-mono"
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          marginBottom: 6,
          minHeight: "1.2em",
        }}
      >
        <MatrixGlitchText
          text={item.time.toUpperCase()}
          active={glitchActive}
          style={{ color: "var(--amber)" }}
        />
      </div>
      <div
        className="hx-display"
        style={{
          fontSize: 19,
          color: "var(--bone)",
          marginBottom: 8,
          lineHeight: 1.25,
        }}
      >
        {item.title}
      </div>
      <div
        style={{
          color: "var(--bone-dim)",
          fontSize: 14,
          lineHeight: 1.55,
        }}
      >
        {item.desc}
      </div>

      {/* tiny suite number / occult mark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 10,
          [side === "left" ? "left" : "right"]: 10,
          fontSize: 9,
          letterSpacing: "0.15em",
          color: "var(--blood-bright)",
          opacity: 0.5,
          fontFamily: "monospace",
        }}
      >
        {side === "left" ? "◀ SUITE" : "SUITE ▶"}
      </div>
    </div>
  );
}