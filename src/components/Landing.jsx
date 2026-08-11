import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Skull,
  Ghost,
  Flame,
  Moon,
  Radio,
  Trophy,
  Github,
  Instagram,
  Twitter,
  Mail,
  ChevronDown,
  ChevronUp,
  Code2,
  Bug,
  Gamepad2,
  ShieldAlert,
  Quote,
  Volume2,
  VolumeX,
} from "lucide-react";

function useCountdown(target) {
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

function GlitchTitle({ text, style = {} }) {
  return (
    <motion.h2 data-text={text} className="hx-glitch hx-display" style={style}>
      {text}
    </motion.h2>
  );
}

function Reveal({ children, delay = 0, y = 36 }) {
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

function SectionLabel({ icon: Icon, num, title }) {
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

// A small dagger flanked by fading lines — recurring divider motif
// between major sections, echoing the dagger from the Transition sequence.
function DaggerDivider() {
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

// A soft blood-red glow that trails the cursor across the landing page.
// Pure atmosphere — pointer-events: none, so it never interferes with clicks.
function CursorGlow() {
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

const RITUALS = [
  { time: "Night I · 6:00 PM", title: "The Summoning", desc: "Opening ceremony, team formation, and the reading of the rules none of you will fully obey.", icon: Ghost },
  { time: "Night I · 11:59 PM", title: "The Hunt Begins", desc: "Hackathon kicks off. Problem statements drop. There is no going back into the woods now.", icon: Flame },
  { time: "Night II · 2:00 PM", title: "The Witching Hour", desc: "Mentor rounds and workshops. Ask for help before something asks for yours.", icon: Moon },
  { time: "Night II · 11:00 PM", title: "Trial by Fire", desc: "Surprise bug-bounty & CTF round. The lights will flicker. That's just for effect. Probably.", icon: Bug },
  { time: "Night III · 4:00 PM", title: "The Reckoning", desc: "Final submissions close. Push your last commit before the clock finishes counting down.", icon: Radio },
  { time: "Night III · 7:00 PM", title: "Judgment", desc: "Live demos, judging, and the crowning of whoever survives the pitch round unscathed.", icon: Trophy },
];

const TRIALS = [
  { icon: Code2, title: "Haunted Web", desc: "Build interfaces so smooth they shouldn't exist. Full-stack, front-end, your choice of poison.", bounty: "₹25,000" },
  { icon: ShieldAlert, title: "The Breach", desc: "Cybersecurity & CTF. Find the crack in the wall before something crawls out of it.", bounty: "₹20,000" },
  { icon: Ghost, title: "Possessed Machines", desc: "AI/ML track. Teach a model to think — then hope it doesn't think for itself.", bounty: "₹25,000" },
  { icon: Gamepad2, title: "Afterlife Arcade", desc: "Game dev track. Build something playable, replayable, and just unsettling enough.", bounty: "₹15,000" },
];

const COVEN = [
  { name: "Aarav Mehta", role: "Keeper of Chaos · Lead Organizer" },
  { name: "Ishita Rao", role: "Warden of Code · Tech Lead" },
  { name: "Devansh Kulkarni", role: "Ritual Master · Design Lead" },
  { name: "Sana Qureshi", role: "Keeper of the Purse · Sponsorships" },
  { name: "Rohan Verma", role: "Herald · Marketing Lead" },
  { name: "Meher Kapoor", role: "Gatekeeper · Logistics Lead" },
];

const SPONSORS = [
  { tier: "Platinum Patron", name: "YOUR LOGO HERE" },
  { tier: "Gold Patron", name: "YOUR LOGO HERE" },
  { tier: "Gold Patron", name: "YOUR LOGO HERE" },
  { tier: "Silver Patron", name: "YOUR LOGO HERE" },
];

const STATS = [
  { value: "1,200+", label: "Have Dared to Enter" },
  { value: "48", label: "Hours in the Dark" },
  { value: "23", label: "Screams Recorded" },
  { value: "3", label: "Who Never Came Back*" },
];

const TESTIMONIALS = [
  { quote: "I came for the free t-shirt. I left with a top-3 finish and a permanent flinch at flickering lights.", name: "Priya M.", role: "Haunted Web Track, '25" },
  { quote: "The 2 AM jump scare cost me a semicolon and about a year of my life. Worth it.", name: "Arjun T.", role: "The Breach Track, '25" },
  { quote: "Best 48 hours of my degree. Also the only 48 hours I've spent afraid of my own laptop.", name: "Neha S.", role: "Afterlife Arcade Track, '25" },
];

const RULES = [
  "Teams of up to 4. No solo summoning unless pre-approved by the Coven.",
  "All code must be written during the event. Pre-written curses will be disqualified on sight.",
  "Thou shalt not plagiarize thy code, lest thy pull request be cursed for all eternity.",
  "Be excellent to your fellow coders. The Coven is always watching.",
  "If the WiFi dies, do not panic. Continue by candlelight — or hotspot, whichever is closer.",
];

const FAQS = [
  { q: "Who can participate?", a: "Any student team, first year through final year, from any college. Outsiders are welcome to the ritual." },
  { q: "Is there a registration fee?", a: "None. Entry is free. Your sanity is the only currency required here." },
  { q: "What should I bring?", a: "Laptop, charger, a valid ID, and a reasonable tolerance for jump scares." },
  { q: "Can I register solo?", a: "Yes — solo entries are matched into a team during The Summoning on Night I." },
];

function StatsBand() {
  return (
    <section className="hx-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
      <Reveal>
        <div
          className="hx-card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 0,
            padding: "36px 20px",
            textAlign: "center",
          }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} style={{ borderLeft: i === 0 ? "none" : "1px solid var(--hair)" }}>
              <div className="hx-display" style={{ fontSize: "clamp(26px, 4vw, 40px)", color: "var(--blood-bright)" }}>
                {s.value}
              </div>
              <div className="hx-mono" style={{ fontSize: 11, letterSpacing: "0.08em", color: "var(--bone-dim)", marginTop: 6 }}>
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
        <p className="hx-mono" style={{ fontSize: 10, color: "var(--bone-dim)", opacity: 0.5, textAlign: "center", marginTop: 12 }}>
          *ALLEGEDLY. THE COVEN DOES NOT CONFIRM OR DENY.
        </p>
      </Reveal>
    </section>
  );
}

// Inline "leave a confession" interactivity — a lighter echo of the One
// Wish Willow easter egg on the Intro screen, tied to The Curse section.
function ConfessionWall() {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSent(true);
  };

  return (
    <Reveal delay={0.35}>
      <div className="hx-card" style={{ maxWidth: 520, margin: "36px auto 0", padding: "28px 26px", textAlign: "center" }}>
        <div className="hx-mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: "var(--amber)", marginBottom: 10 }}>
          THE CONFESSION WALL
        </div>
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.p
              key="thanks"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: "var(--bone-dim)", fontStyle: "italic" }}
            >
              Your fear has been filed. The Coven will do nothing with it, but it felt good to say, didn't it?
            </motion.p>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}
            >
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={120}
                placeholder="What are you afraid of, really?"
                style={{
                  flex: "1 1 260px",
                  background: "var(--void-2)",
                  border: "1px solid var(--hair)",
                  color: "var(--bone)",
                  padding: "11px 14px",
                  fontFamily: "'EB Garamond', serif",
                  fontStyle: "italic",
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button type="submit" className="hx-btn" style={{ padding: "11px 20px", fontSize: 11 }}>
                Confess
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

function PhotoBreak() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "48vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        overflow: "hidden",
        margin: "20px 0",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/images/intro-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          backgroundAttachment: "fixed",
          filter: "saturate(1.05) contrast(1.05) brightness(0.75)",
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(10,8,7,0.75), rgba(10,8,7,0.35) 45%, rgba(10,8,7,0.85))",
        }}
        aria-hidden="true"
      />
      <Reveal>
        <div style={{ position: "relative", zIndex: 1, padding: "0 24px" }}>
          <p className="hx-eyebrow" style={{ marginBottom: 14 }}>
            Whispers From the Woods
          </p>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontStyle: "italic",
              fontSize: "clamp(18px, 2.6vw, 26px)",
              color: "var(--bone)",
              maxWidth: 620,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Somewhere past the treeline, the arch is still glowing. It has been glowing since 9.0.
            Nobody has asked why. Nobody plans to.
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="hx-section">
      <SectionLabel num="05" title="Survivor Testimonies" icon={Quote} />
      <Reveal>
        <GlitchTitle text="What They Whispered" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 56, color: "var(--bone)" }} />
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div className="hx-card" style={{ padding: "30px 26px", height: "100%" }}>
              <Quote size={20} color="var(--blood-bright)" style={{ marginBottom: 14, opacity: 0.7 }} />
              <p style={{ color: "var(--bone)", fontStyle: "italic", lineHeight: 1.6, marginBottom: 20, fontSize: 15 }}>
                "{t.quote}"
              </p>
              <div className="hx-mono" style={{ fontSize: 11.5, color: "var(--amber)" }}>{t.name.toUpperCase()}</div>
              <div className="hx-mono" style={{ fontSize: 10.5, color: "var(--bone-dim)", marginTop: 2 }}>{t.role}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function RulesSection() {
  return (
    <section className="hx-section">
      <SectionLabel num="03" title="Rules of the Ritual" icon={ShieldAlert} />
      <Reveal>
        <GlitchTitle text="Read Before You Bleed" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 44, color: "var(--bone)" }} />
      </Reveal>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {RULES.map((rule, i) => (
          <Reveal key={rule} delay={i * 0.05}>
            <div style={{ display: "flex", gap: 18, padding: "16px 0", borderBottom: i < RULES.length - 1 ? "1px solid var(--hair)" : "none" }}>
              <span className="hx-display" style={{ color: "var(--blood-bright)", fontSize: 20, minWidth: 28 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ color: "var(--bone-dim)", lineHeight: 1.6 }}>{rule}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="hx-card" style={{ padding: "20px 24px", marginBottom: 14 }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          color: "var(--bone)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "'Cinzel', serif",
          fontSize: 16,
          padding: 0,
        }}
      >
        {item.q}
        {isOpen ? <ChevronUp size={18} color="var(--amber)" /> : <ChevronDown size={18} color="var(--amber)" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ color: "var(--bone-dim)", lineHeight: 1.6, marginTop: 14 }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LastRites() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="hx-section">
      <SectionLabel num="07" title="Last Rites" icon={Skull} />
      <Reveal>
        <GlitchTitle text="Questions From the Damned" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 44, color: "var(--bone)" }} />
      </Reveal>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {FAQS.map((item, i) => (
          <Reveal key={item.q} delay={i * 0.05}>
            <FAQItem item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Landing({ onReturnToIntro }) {
  const t = useCountdown(new Date("2026-10-31T00:00:00"));
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const fogY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);

  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  // Ambient loop, continuing the audio experience from Intro/Game.
  // Reuses intro-ambient.mp3 — swap in a dedicated public/audio/landing-ambient.mp3
  // if you'd rather it sound distinct from the intro screen.
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

      {/* Mute — fixed bottom right, matching the Intro screen's toggle */}
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

      {/* Last Year — stats band */}
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

      <DaggerDivider />

      {/* ---------------- PATRONS (sponsors) ---------------- */}
      <section className="hx-section">
        <SectionLabel num="01" title="Patrons of the Dark" icon={Trophy} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
          {SPONSORS.map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="hx-card" style={{ padding: "34px 20px", textAlign: "center", display: "flex", flexDirection: "column", gap: 10 }}>
                <span className="hx-mono" style={{ fontSize: 10, letterSpacing: "0.15em", color: "var(--blood-bright)" }}>{s.tier.toUpperCase()}</span>
                <span style={{ color: "var(--bone-dim)", fontStyle: "italic" }}>{s.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <DaggerDivider />

      {/* ---------------- RITUALS (timeline) ---------------- */}
      <section id="rituals" className="hx-section">
        <SectionLabel num="02" title="Rituals · The Schedule" icon={Moon} />
        <Reveal>
          <GlitchTitle text="Three Nights, Six Rites" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 56, color: "var(--bone)" }} />
        </Reveal>
        <div style={{ position: "relative", paddingLeft: 30 }}>
          <div style={{ position: "absolute", left: 5, top: 8, bottom: 8, width: 1, background: "linear-gradient(to bottom, var(--blood-bright), var(--hair))" }} />
          {RITUALS.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <div style={{ position: "relative", paddingBottom: 44, display: "flex", gap: 22 }}>
                <div style={{ position: "absolute", left: -30, top: 4, width: 11, height: 11, borderRadius: "50%", background: "var(--void)", border: "2px solid var(--blood-bright)" }} />
                <r.icon size={18} color="var(--amber)" style={{ flexShrink: 0, marginTop: 3 }} />
                <div>
                  <div className="hx-mono" style={{ fontSize: 11.5, color: "var(--amber)", letterSpacing: "0.1em", marginBottom: 4 }}>
                    {r.time.toUpperCase()}
                  </div>
                  <div className="hx-display" style={{ fontSize: 22, color: "var(--bone)", marginBottom: 6 }}>{r.title}</div>
                  <div style={{ color: "var(--bone-dim)", maxWidth: 520, lineHeight: 1.6 }}>{r.desc}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <RulesSection />

      <DaggerDivider />

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

      <DaggerDivider />

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
        <div style={{ display: "flex", justifyContent: "center", gap: 26, marginTop: 60, paddingTop: 30, borderTop: "1px solid var(--hair)" }}>
          <a href="#" aria-label="GitHub"><Github size={18} color="var(--bone-dim)" /></a>
          <a href="#" aria-label="Instagram"><Instagram size={18} color="var(--bone-dim)" /></a>
          <a href="#" aria-label="Twitter"><Twitter size={18} color="var(--bone-dim)" /></a>
          <a href="#" aria-label="Email"><Mail size={18} color="var(--bone-dim)" /></a>
        </div>
        <p className="hx-mono" style={{ fontSize: 10.5, color: "var(--bone-dim)", opacity: 0.5, marginTop: 24, letterSpacing: "0.1em" }}>
          © 2026 CODEUTSAVA X — TURING CLUB OF PROGRAMMERS. ALL CURSES RESERVED.
        </p>
      </section>
    </motion.div>
  );
}