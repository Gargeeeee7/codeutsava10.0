import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Code2,
  Bug,
  Gamepad2,
  ShieldAlert,
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

export default function Landing() {
  const t = useCountdown(new Date("2026-10-31T00:00:00"));
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const fogY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.15]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
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
          padding: "22px 32px",
          backdropFilter: "blur(6px)",
          background: "linear-gradient(to bottom, rgba(10,8,7,0.85), transparent)",
        }}
      >
        <span className="hx-mono" style={{ letterSpacing: "0.15em", fontSize: 14, color: "var(--bone)" }}>
          CODE<span style={{ color: "var(--blood-bright)" }}>UTSAVA</span>
        </span>
        <div className="hx-mono" style={{ display: "flex", gap: 28, fontSize: 12, letterSpacing: "0.08em", color: "var(--bone-dim)" }}>
          <a href="#rituals" style={{ textDecoration: "none" }}>Rituals</a>
          <a href="#trials" style={{ textDecoration: "none" }}>Trials</a>
          <a href="#coven" style={{ textDecoration: "none" }}>The Coven</a>
          <a href="#pact" style={{ textDecoration: "none" }}>Sign the Pact</a>
        </div>
      </nav>

      {/* ---------------- HERO ---------------- */}
      <section
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
            data-text="CODEUTSAVA"
            className="hx-glitch hx-display"
            style={{ fontSize: "clamp(48px, 12vw, 140px)", margin: "18px 0 4px", color: "var(--bone)" }}
          >
            CODEUTSAVA
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
            A festival to die for — an ode to every horror film you watched this year, now compiled into code.
          </motion.p>

          <p className="hx-mono" style={{ fontSize: 12.5, letterSpacing: "0.2em", color: "var(--amber)", marginTop: 14 }}>
            31 OCT — 02 NOV · WHEN THE VEIL THINS, WE HACK
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

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "absolute", bottom: 34 }}
        >
          <ChevronDown size={20} color="var(--bone-dim)" />
        </motion.div>
      </section>

      {/* ---------------- THE CURSE (about) ---------------- */}
      <section className="hx-section" style={{ textAlign: "center" }}>
        <SectionLabel num="00" title="The Curse" icon={Skull} />
        <Reveal delay={0.1}>
          <p style={{ fontSize: "clamp(19px, 2.6vw, 26px)", lineHeight: 1.6, color: "var(--bone)", maxWidth: 780, margin: "0 auto", fontStyle: "italic" }}>
            Every October, a hundred haunted houses open their doors, a hundred killers rise from
            streaming queues, and somewhere on campus, a hundred students summon something far more
            dangerous: a 48-hour hackathon.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <p style={{ marginTop: 22, color: "var(--bone-dim)", maxWidth: 640, margin: "22px auto 0", lineHeight: 1.7 }}>
            Codeutsava is our tribute to a year drowning in horror — every jump-scare, every
            slow-motion sprint, every "don't go in there" decision — distilled into three nights of
            code, chaos, and the occasional scream.
          </p>
        </Reveal>
      </section>

      {/* ---------------- RITUALS (timeline) ---------------- */}
      <section id="rituals" className="hx-section">
        <SectionLabel num="01" title="Rituals · The Schedule" icon={Moon} />
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

      {/* ---------------- TRIALS (tracks) ---------------- */}
      <section id="trials" className="hx-section">
        <SectionLabel num="02" title="Trials · The Tracks" icon={Flame} />
        <Reveal>
          <GlitchTitle text="Choose Your Poison" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 56, color: "var(--bone)" }} />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {TRIALS.map((tr, i) => (
            <Reveal key={tr.title} delay={i * 0.08}>
              <div className="hx-card" style={{ padding: "32px 26px", height: "100%" }}>
                <tr.icon size={26} color="var(--blood-bright)" />
                <div className="hx-display" style={{ fontSize: 21, margin: "18px 0 10px", color: "var(--bone)" }}>{tr.title}</div>
                <p style={{ color: "var(--bone-dim)", fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>{tr.desc}</p>
                <div className="hx-mono" style={{ fontSize: 12, color: "var(--amber)", letterSpacing: "0.05em" }}>BOUNTY · {tr.bounty}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- THE COVEN (team) ---------------- */}
      <section id="coven" className="hx-section">
        <SectionLabel num="03" title="The Coven · Our Team" icon={Ghost} />
        <Reveal>
          <GlitchTitle text="Keepers of the Code" style={{ fontSize: "clamp(30px, 4.5vw, 48px)", marginBottom: 56, color: "var(--bone)" }} />
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 18 }}>
          {COVEN.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <div className="hx-card" style={{ padding: "26px 20px", textAlign: "center" }}>
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

      {/* ---------------- PATRONS (sponsors) ---------------- */}
      <section className="hx-section">
        <SectionLabel num="04" title="Patrons of the Dark" icon={Trophy} />
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
          © 2026 CODEUTSAVA — TURING CLUB OF PROGRAMMERS. ALL CURSES RESERVED.
        </p>
      </section>
    </motion.div>
  );
}
