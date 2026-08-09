import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Background from "./components/Background.jsx";
import Intro from "./components/Intro.jsx";
import Game from "./components/Game.jsx";
import Landing from "./components/Landing.jsx";

export default function App() {
  const [stage, setStage] = useState("intro"); // "intro" -> "game" -> "landing"

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* ambient fog + embers, shared across intro and landing */}
      <Background />

      {/* persistent film-grain / vignette / scanline overlay */}
      <div className="hx-grain" />
      <div className="hx-scanline" />
      <div className="hx-vignette" />

      <AnimatePresence mode="wait">
        {stage === "intro" && <Intro key="intro" onEnter={() => setStage("game")} />}
        {stage === "game" && <Game key="game" onComplete={() => setStage("landing")} />}
        {stage === "landing" && <Landing key="landing" />}
      </AnimatePresence>
    </div>
  );
}
