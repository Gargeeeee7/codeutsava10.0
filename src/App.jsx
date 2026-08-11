import React, { useEffect, useState, Component } from "react";
import { AnimatePresence } from "framer-motion";

import Background from "./components/Background.jsx";
import GlassSmudge from "./components/GlassSmudge.jsx";
import SigilFlash from "./components/SigilFlash.jsx";
import Intro from "./components/Intro.jsx";
import Game from "./components/Game.jsx";
import Transition from "./components/Transition.jsx";
import Landing from "./components/landing/Landing.jsx";
import { attachClickSounds } from "./components/landing/clickSound.js";
import ThingCursor from "./components/ThingCursor.jsx";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("App crash:", error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#1a1010",
            color: "#f5e6e6",
            padding: 32,
            fontFamily: "ui-monospace, monospace",
            whiteSpace: "pre-wrap",
          }}
        >
          <h1 style={{ color: "#e11d48", marginTop: 0 }}>Something crashed</h1>
          <pre
            style={{
              background: "#0a0807",
              padding: 16,
              borderRadius: 8,
              border: "1px solid #7a1420",
              overflow: "auto",
            }}
          >
            {String(this.state.error?.stack || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [stage, setStage] = useState("intro"); // ← must be "intro"

  useEffect(() => {
    try {
      return attachClickSounds(document, ".hx-btn, a.hx-btn, button.hx-btn, [data-sfx]");
    } catch (e) {
      console.warn("click SFX attach failed", e);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#0a0807",
          color: "#e7e5e4",
        }}
      >
        <Background />

        {/* persistent atmosphere */}
        <div className="hx-grain" />
        <div className="hx-scanline" />
        <div className="hx-vignette" />
        <GlassSmudge />
        <SigilFlash />
        <ThingCursor />

        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <Intro key="intro" onEnter={() => setStage("game")} />
          )}
          {stage === "game" && (
            <Game
              key="game"
              onComplete={() => setStage("transition")}
              onSkip={() => setStage("landing")}
            />
          )}
          {stage === "transition" && (
            <Transition key="transition" onComplete={() => setStage("landing")} />
          )}
          {stage === "landing" && (
            <Landing key="landing" onReturnToIntro={() => setStage("intro")} />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}