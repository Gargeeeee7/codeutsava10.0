import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./shared";

export default function ConfessionWall() {
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