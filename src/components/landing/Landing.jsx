import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Skull,
  Ghost,
  Flame,
  Trophy,
  Github,
  Instagram,
  Twitter,
  Mail,
  Linkedin,
  Facebook,
  ChevronDown,
  Volume2,
  VolumeX,
} from "lucide-react";

import {
  useCountdown,
  GlitchTitle,
  Reveal,
  SectionLabel,
  CursorGlow,
} from "./shared";

import StatsBand from "./StatsBand";
import ConfessionWall from "./ConfessionWall";
import PhotoBreak from "./PhotoBreak";
import CaseFiles from "./CaseFiles";
import Schedule from "./Schedule";
import Testimonials from "./Testimonials";
import RulesSection from "./RulesSection";
import LastRites from "./LastRites";

import {
  TRIALS,
  COVEN,
  SPONSORS,
} from "../../data/landingData";

export default function Landing({ onReturnToIntro }) {
  const t = useCountdown(new Date("2026-10-31T00:00:00"));
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const fogY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);

  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/audio/intro-ambient.mp3");
    audio.loop = true;
    audio.volume = 0.22;
    audioRef.current = audio;
    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();
    const unlock = () => {
      tryPlay();
      window.removeEventListener("pointerdown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    return () => {
      audio.pause();
      audio.src = "";
      window.removeEventListener("pointerdown", unlock);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <CursorGlow />

      {/* ---------------- NAV ---------------- */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 70,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "28px 44px",
          backdropFilter: "blur(6px)",
          background: "linear-gradient(to bottom, rgba(10,8,7,0.85), transparent)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <button
            onClick={onReturnToIntro}
            title="Back to the threshold"
            style={{
              display: "flex",
              alignItems: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <img
              src="/images/codeutsava-logo.png"
              alt="Codeutsava X"
              style={{ height: 34, width: "auto", flexShrink: 0 }}
            />
          </button>
          <a href="#" className="hx-btn" style={{ padding: "9px 18px", fontSize: 11 }}>
            Feedback
          </a>
        </div>

        <div className="hx-mono" style={{ display: "flex", gap: 26, fontSize: 13, letterSpacing: "0.08em", color: "var(--bone-dim)", alignItems: "center" }}>
          <a href="#hero" style={{ textDecoration: "none" }}>Home</a>
          <a href="#about" style={{ textDecoration: "none" }}>About Us</a>
          <a href="#rituals" style={{ textDecoration: "none" }}>The Corridor</a>
          <a href="#faqs" style={{ textDecoration: "none" }}>FAQ</a>
          <a href="#pact" style={{ textDecoration: "none" }}>Contact Us</a>
          <a href="#coven" style={{ textDecoration: "none" }}>Team</a>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a href="#" className="hx-btn" style={{ padding: "9px 18px", fontSize: 11 }}>
            Brochure
          </a>
          <button
            onClick={onReturnToIntro}
            title="Back to the threshold"
            style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <img
              src="/images/tcp-logo.png"
              alt="Turing Club of Programmers"
              style={{ height: 46, width: 46, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          </button>
        </div>
      </nav>

      {/* Mute */}
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Unmute ambient sound" : "Mute ambient sound"}
        title={muted ? "Unmute" : "Mute"}
        className="hx-btn"
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 70,
          padding: "9px 12px",
          fontSize: 11,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        {muted ? "Sound Off" : "Sound On"}
      </button>

      {/* ---------------- HERO ---------------- */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 20px 60px",
          position: "relative",
        }}
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(122,20,32,0.18), transparent 70%)",
            y: fogY,
          }}
        />
        <motion.div style={{ opacity: heroOpacity, position: "relative", zIndex: 2 }}>
          <motion.p className="hx-eyebrow hx-flicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}>
            Turing Club of Programmers presents
          </motion.p>

          <h1
            data-text="CODEUTSAVA X"
            className="hx-glitch hx-display"
            style={{ fontSize: "clamp(48px, 12vw, 140px)", margin: "18px 0 4px", color: "var(--bone)" }}
          >
            CODEUTSAVA X
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(16px, 2.4vw, 22px)",
              color: "var(--bone-dim)",
              maxWidth: 620,
              margin: "10px auto 6px",
            }}
          >
            Compile. Debug. Don't look behind you.
          </motion.p>

          <p className="hx-mono" style={{ fontSize: 12.5, letterSpacing: "0.2em", color: "var(--amber)", marginTop: 14 }}>
            31 OCT — 01 NOV · HACK THE HALLOWEB
          </p>

          <div style={{ display: "flex", gap: 18, justifyContent: "center", margin: "40px 0 36px", flexWrap: "wrap" }}>
            {[["Days", t.d], ["Hrs", t.h], ["Min", t.m], ["Sec", t.s]].map(([label, val]) => (
              <div key={label} style={{ minWidth: 68 }}>
                <div className="hx-display" style={{ fontSize: 34, color: "var(--bone)" }}>
                  {String(val).padStart(2, "0")}
                </div>
                <div className="hx-mono" style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--bone-dim)" }}>
                  {label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>

          <motion.button className="hx-btn" whileTap={{ scale: 0.96 }}>
            Register Your Team
          </motion.button>
        </motion.div>

        <motion.button
          type="button"
          onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}
          aria-label="Scroll down"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.2 }}
          style={{
            position: "absolute",
            bottom: 34,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 8,
            display: "flex",
          }}
        >
          <ChevronDown size={20} color="var(--bone-dim)" />
        </motion.button>
      </section>

      {/* Order preserved exactly */}
      <StatsBand />

      <PhotoBreak />

      {/* ---------------- THE CURSE (about) ---------------- */}
      <section id="about" className="hx-section" style={{ textAlign: "center" }}>
        <SectionLabel num="00" title="The Curse · About Us" icon={Skull} />
        <Reveal delay={0.1}>
          <p style={{ fontSize: "clamp(19px, 2.6vw, 26px)", lineHeight: 1.6, color: "var(--bone)", maxWidth: 780, margin: "0 auto", fontStyle: "italic" }}>
            Every October, a hundred haunted houses open their doors, a hundred killers rise from
            streaming queues, and somewhere on campus, a hundred students summon something far more
            dangerous: a 28-hour hackathon.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ marginTop: 22, color: "var(--bone-dim)", maxWidth: 680, margin: "22px auto 0", lineHeight: 1.7 }}>
            Codeutsava is the Turing Club of Programmers' annual gathering — coders from across the
            country converge for workshops, hackathons, gaming battles, and MIC sessions, all under
            one roof, one deadline, and one ever-thinning veil. This year we're bleeding it into a
            proper horror ritual: same event, same stakes, considerably more screaming.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <p style={{ marginTop: 18, color: "var(--bone-dim)", maxWidth: 680, margin: "18px auto 0", lineHeight: 1.7 }}>
            At the center of it all is the <strong style={{ color: "var(--bone)" }}>28-hour hackathon</strong> —
            no sleep, no mercy, just you, your team, and whatever you can ship before dawn. This
            edition carries a <strong style={{ color: "var(--amber)" }}>₹33L+ prize pool</strong>, including{" "}
            <strong style={{ color: "var(--amber)" }}>₹1.5–2L in cash</strong> waiting for whoever
            survives the judging round.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div
            style={{
              maxWidth: 640,
              margin: "36px auto 0",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              textAlign: "left",
            }}
          >
            {[
              "28-hour overnight hackathon",
              "Workshops, MIC sessions & mentorship",
              "Gaming battles & community showcases",
              "₹33L+ prize pool & industry partners",
            ].map((line) => (
              <div key={line} className="hx-card" style={{ padding: "16px 18px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Skull size={16} color="var(--blood-bright)" style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ color: "var(--bone-dim)", fontSize: 14.5, lineHeight: 1.5 }}>{line}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <ConfessionWall />
      </section>

      <PhotoBreak silent />

      <CaseFiles />

      <PhotoBreak silent />

      {/* ---------------- PATRONS (sponsors) — slow R→L marquee ---------------- */}
      <section id="sponsors" className="hx-section">
        <SectionLabel num="01" title="Patrons of the Dark" icon={Trophy} />
        <Reveal>
          <div
            style={{
              overflow: "hidden",
              maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "max-content",
                animation: "hx-marquee-rtl 28s linear infinite",
              }}
            >
              {/* duplicate list so the loop is seamless */}
              {[...SPONSORS, ...SPONSORS, ...SPONSORS].map((s, i) => (
                <div
                  key={`${s.tier}-${i}`}
                  className="hx-card"
                  style={{
                    flex: "0 0 auto",
                    width: 220,
                    marginRight: 18,
                    padding: "34px 20px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <span className="hx-mono" style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--blood-bright)" }}>
                    {s.tier.toUpperCase()}
                  </span>
                  <span style={{ color: "var(--bone-dim)", fontStyle: "italic" }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        {/* keyframes injected once */}
        <style>{`
          @keyframes hx-marquee-rtl {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
        `}</style>
      </section>

      <PhotoBreak silent />

      {/* ---------------- RITUALS (timeline) — Hokum corridor style ---------------- */}
      <Schedule />

      <RulesSection />

      <PhotoBreak silent />

      {/* ---------------- TRIALS (tracks / prizes) ---------------- */}
      <section id="trials" className="hx-section">
        <SectionLabel num="04" title="Trials · The Tracks" icon={Flame} />
        <Reveal>
          <GlitchTitle text="Choose Your Poison" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 56, color: "var(--bone)" }} />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {TRIALS.map((tr, i) => (
            <Reveal key={tr.title} delay={i * 0.08}>
              <div className="hx-card hx-card--glitchy" style={{ padding: "32px 26px", height: "100%" }}>
                <tr.icon size={26} color="var(--blood-bright)" />
                <div className="hx-display" style={{ fontSize: 21, margin: "18px 0 10px", color: "var(--bone)" }}>{tr.title}</div>
                <p style={{ color: "var(--bone-dim)", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>{tr.desc}</p>
                <div className="hx-mono" style={{ fontSize: 12, color: "var(--amber)", letterSpacing: "0.05em" }}>BOUNTY · {tr.bounty}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Testimonials />

      <PhotoBreak silent />

      {/* ---------------- THE COVEN (team) ---------------- */}
      <section id="coven" className="hx-section">
        <SectionLabel num="06" title="The Coven · Our Team" icon={Ghost} />
        <Reveal>
          <GlitchTitle text="Keepers of the Code" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 56, color: "var(--bone)" }} />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
          {COVEN.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <div className="hx-card hx-card--glitchy" style={{ padding: "26px 20px", textAlign: "center" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 16px", border: "1px solid var(--hair)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--void-2)" }}>
                  <Skull size={22} color="var(--bone-dim)" />
                </div>
                <div className="hx-display" style={{ fontSize: 16, color: "var(--bone)", marginBottom: 6 }}>{m.name}</div>
                <div className="hx-mono" style={{ fontSize: 10.5, color: "var(--amber)", letterSpacing: "0.05em" }}>{m.role.toUpperCase()}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <LastRites />

      {/* ---------------- SIGN THE PACT (footer CTA) ---------------- */}
      <section id="pact" className="hx-section" style={{ textAlign: "center", paddingBottom: 60 }}>
        <Reveal>
          <GlitchTitle text="Sign the Pact" style={{ fontSize: "clamp(36px, 6vw, 64px)", color: "var(--bone)" }} />
        </Reveal>
        <Reveal delay={0.15}>
          <p style={{ color: "var(--bone-dim)", maxWidth: 480, margin: "18px auto 32px", lineHeight: 1.7 }}>
            Registration closes when the veil closes. There is no waitlist for the damned.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <button className="hx-btn">Register Your Team</button>
        </Reveal>
        <div style={{ display: "flex", justifyContent: "center", gap: 26, marginTop: 60, paddingTop: 30, borderTop: "1px solid var(--hair)", flexWrap: "wrap" }}>
          <a href="https://github.com/TCP-Tech" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
            <Github size={18} color="var(--bone-dim)" />
          </a>
          <a href="https://www.instagram.com/codeutsavanitrr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
            <Instagram size={18} color="var(--bone-dim)" />
          </a>
          <a href="https://x.com/codeutsavanitrr" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" title="X">
            <Twitter size={18} color="var(--bone-dim)" />
          </a>
          <a href="https://www.facebook.com/codeutsava/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
            <Facebook size={18} color="var(--bone-dim)" />
          </a>
          <a href="https://www.linkedin.com/company/codeutsava/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
            <Linkedin size={18} color="var(--bone-dim)" />
          </a>
          <a href="mailto:codeutsava@nitrr.ac.in" aria-label="Email" title="Email">
            <Mail size={18} color="var(--bone-dim)" />
          </a>
        </div>
        <p className="hx-mono" style={{ fontSize: 10.5, color: "var(--bone-dim)", opacity: 0.5, marginTop: 24, letterSpacing: "0.1em" }}>
          © 2026 CODEUTSAVA X — TURING CLUB OF PROGRAMMERS. ALL CURSES RESERVED.
        </p>
      </section>
    </motion.div>
  );
}