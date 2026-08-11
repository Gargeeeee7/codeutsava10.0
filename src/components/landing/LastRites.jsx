import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skull, ChevronDown, ChevronUp } from "lucide-react";
import { Reveal, SectionLabel, GlitchTitle } from "./shared";
import { FAQS } from "../../data/landingData";

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

export default function LastRites() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <section className="hx-section" id="faqs">
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