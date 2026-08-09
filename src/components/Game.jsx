import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Game
 * A top-down exploration mini-game modeled on the actual NIT Raipur campus
 * layout (entrance -> parking spur -> roundabout -> architecture building ->
 * road east/south past the academic building -> central garden -> canteen +
 * CCC lab -> sports ground). Random jump scares (fog, flash, glitch, static)
 * chip away at a "sanity" meter as you explore. Reaching the CCC lab door,
 * or clicking "Skip Game", both call onComplete to hand off to the landing
 * page.
 */

const TILE = 32;

// tile types
const GRASS = 0;
const WALL = 1;
const EXIT = 2;
const ROAD = 3;
const GARDEN = 4;
const ISLAND = 5;

const ROWS = 52;
const COLS = 42;

function makeGrid(rows, cols, fill) {
  return Array.from({ length: rows }, () => Array(cols).fill(fill));
}

function fillRect(grid, x0, y0, x1, y1, val) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (grid[y] && grid[y][x] !== undefined) grid[y][x] = val;
    }
  }
}

function buildMap() {
  const g = makeGrid(ROWS, COLS, GRASS);

  // outer boundary
  fillRect(g, 0, 0, COLS - 1, 0, WALL);
  fillRect(g, 0, ROWS - 1, COLS - 1, ROWS - 1, WALL);
  fillRect(g, 0, 0, 0, ROWS - 1, WALL);
  fillRect(g, COLS - 1, 0, COLS - 1, ROWS - 1, WALL);

  // roads
  fillRect(g, 17, 1, 21, 11, ROAD); // entrance road
  fillRect(g, 7, 9, 17, 11, ROAD); // parking spur
  fillRect(g, 12, 10, 27, 18, ROAD); // roundabout plaza
  fillRect(g, 24, 15, 38, 18, ROAD); // road past architecture building
  fillRect(g, 33, 15, 37, 35, ROAD); // corridor beside academic building
  fillRect(g, 10, 17, 13, 35, ROAD); // road west of garden
  fillRect(g, 10, 33, 37, 36, ROAD); // road connecting to canteen/CCC
  fillRect(g, 24, 33, 25, 44, ROAD); // spur between canteen and CCC

  // garden
  fillRect(g, 15, 19, 25, 31, GARDEN);

  // buildings, sized roughly to scale against each other
  fillRect(g, 2, 5, 7, 15, WALL); // parking
  fillRect(g, 24, 2, 39, 14, WALL); // architecture building (large)
  fillRect(g, 38, 15, 40, 36, WALL); // academic building (tall, narrow)
  fillRect(g, 13, 37, 23, 43, WALL); // canteen
  fillRect(g, 26, 37, 35, 43, WALL); // CCC lab

  // roundabout island in the middle of the plaza
  const rCx = 19;
  const rCy = 14;
  const rR = 3;
  for (let y = rCy - rR; y <= rCy + rR; y++) {
    for (let x = rCx - rR; x <= rCx + rR; x++) {
      if (g[y] && g[y][x] === ROAD && Math.hypot(x - rCx, y - rCy) <= rR) {
        g[y][x] = ISLAND;
      }
    }
  }

  // door into the CCC lab, facing the road spur
  g[40][26] = EXIT;

  return g;
}

const MAP = buildMap();
const ROUNDABOUT_CENTER = { x: 19, y: 14 };

function isRoadLike(t) {
  return t === ROAD || t === ISLAND;
}

function isGarden(t) {
  return t === GARDEN;
}

function hash2(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export default function Game({ onComplete }) {
  const canvasRef = useRef(null);
  const [sanity, setSanity] = useState(100);
  const [status, setStatus] = useState("The corridors feel wrong...");
  const [won, setWon] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const player = { x: 19.5, y: 3.5, speed: 0.1 };
    const keys = {};
    const scare = { active: false, type: null, timer: 0 };
    let gameState = "playing";
    let time = 0;

    const handleKeyDown = (e) => {
      keys[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e) => {
      keys[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function isWall(x, y) {
      const c = Math.floor(x);
      const r = Math.floor(y);
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return true;
      const t = MAP[r][c];
      return t === WALL || t === GARDEN || t === ISLAND;
    }

    function movePlayer() {
      if (gameState !== "playing") return;
      let dx = 0;
      let dy = 0;
      if (keys["w"] || keys["arrowup"]) dy = -1;
      if (keys["s"] || keys["arrowdown"]) dy = 1;
      if (keys["a"] || keys["arrowleft"]) dx = -1;
      if (keys["d"] || keys["arrowright"]) dx = 1;

      if (dx || dy) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / len) * player.speed;
        dy = (dy / len) * player.speed;
        if (!isWall(player.x + dx, player.y)) player.x += dx;
        if (!isWall(player.x, player.y + dy)) player.y += dy;
      }

      const px = Math.floor(player.x);
      const py = Math.floor(player.y);
      if (MAP[py][px] === EXIT && gameState === "playing") {
        gameState = "won";
        setWon(true);
      }
    }

    function tryJumpScare() {
      if (scare.active || gameState !== "playing") return;
      if (Math.random() < 0.0016) {
        const types = ["fog", "glitch", "flash", "static"];
        scare.type = types[Math.floor(Math.random() * 4)];
        scare.active = true;
        scare.timer = 0;
        setSanity((prev) => {
          const next = Math.max(0, prev - (1.2 + Math.random() * 2));
          if (next < 45) setStatus("The walls are watching...");
          return next;
        });
      }
    }

    function updateScare() {
      if (!scare.active) return;
      scare.timer++;
      if (scare.timer > (scare.type === "fog" ? 100 : 48)) {
        scare.active = false;
        scare.type = null;
      }
    }

    function drawExplorer(x, y) {
      ctx.fillStyle = "#3c3441";
      ctx.fillRect(x - 6, y - 1, 12, 14);
      ctx.fillStyle = "#d9c9b0";
      ctx.beginPath();
      ctx.arc(x, y - 9, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1c1917";
      ctx.beginPath();
      ctx.arc(x, y - 12, 6.5, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = "#111";
      ctx.fillRect(x - 3.5, y - 11, 2.2, 2.2);
      ctx.fillRect(x + 1.3, y - 11, 2.2, 2.2);
      ctx.fillStyle = "#241a1a";
      ctx.fillRect(x - 5, y + 13, 4, 8);
      ctx.fillRect(x + 1, y + 13, 4, 8);
    }

    function drawLabel(text, tileX, tileY, camX, camY, opts = {}) {
      const { rotate = false, color = "#a89a86", lines = null } = opts;
      const x = tileX * TILE - camX;
      const y = tileY * TILE - camY;
      ctx.save();
      ctx.translate(x, y);
      if (rotate) ctx.rotate(-Math.PI / 2);
      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      if (lines) {
        lines.forEach((line, i) => ctx.fillText(line, 0, i * 14));
      } else {
        ctx.fillText(text, 0, 0);
      }
      ctx.restore();
    }

    function draw() {
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const camX = player.x * TILE - canvas.width / 2;
      const camY = player.y * TILE - canvas.height / 2;

      const startCol = Math.max(0, Math.floor(camX / TILE) - 1);
      const endCol = Math.min(COLS - 1, Math.ceil((camX + canvas.width) / TILE) + 1);
      const startRow = Math.max(0, Math.floor(camY / TILE) - 1);
      const endRow = Math.min(ROWS - 1, Math.ceil((camY + canvas.height) / TILE) + 1);

      for (let y = startRow; y <= endRow; y++) {
        for (let x = startCol; x <= endCol; x++) {
          const t = MAP[y][x];
          const sx = x * TILE - camX;
          const sy = y * TILE - camY;

          if (t === WALL) {
            ctx.fillStyle = "#2b2118";
            ctx.fillRect(sx, sy, TILE, TILE);
            ctx.strokeStyle = "#1b140e";
            ctx.strokeRect(sx, sy, TILE, TILE);
            ctx.strokeStyle = "rgba(236,227,210,0.08)";
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + TILE, sy);
            ctx.stroke();
          } else if (t === ROAD || t === ISLAND) {
            ctx.fillStyle = t === ISLAND ? "#232a16" : "#221f1c";
            ctx.fillRect(sx, sy, TILE, TILE);
            if (t === ROAD) {
              const up = y > 0 ? MAP[y - 1][x] : WALL;
              const down = y < ROWS - 1 ? MAP[y + 1][x] : WALL;
              const left = x > 0 ? MAP[y][x - 1] : WALL;
              const right = x < COLS - 1 ? MAP[y][x + 1] : WALL;
              ctx.strokeStyle = "rgba(168,154,134,0.45)";
              ctx.lineWidth = 2;
              ctx.beginPath();
              if (!isRoadLike(up)) {
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + TILE, sy);
              }
              if (!isRoadLike(down)) {
                ctx.moveTo(sx, sy + TILE);
                ctx.lineTo(sx + TILE, sy + TILE);
              }
              if (!isRoadLike(left)) {
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx, sy + TILE);
              }
              if (!isRoadLike(right)) {
                ctx.moveTo(sx + TILE, sy);
                ctx.lineTo(sx + TILE, sy + TILE);
              }
              ctx.stroke();
              ctx.lineWidth = 1;
              if ((x + y) % 2 === 0) {
                ctx.fillStyle = "rgba(201,138,62,0.22)";
                ctx.fillRect(sx + TILE / 2 - 2, sy + TILE / 2 - 6, 4, 12);
              }
            }
          } else if (t === GARDEN) {
            ctx.fillStyle = "#212a17";
            ctx.fillRect(sx, sy, TILE, TILE);
            const up = y > 0 ? MAP[y - 1][x] : WALL;
            const down = y < ROWS - 1 ? MAP[y + 1][x] : WALL;
            const left = x > 0 ? MAP[y][x - 1] : WALL;
            const right = x < COLS - 1 ? MAP[y][x + 1] : WALL;
            ctx.strokeStyle = "rgba(92,122,74,0.55)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (!isGarden(up)) {
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx + TILE, sy);
            }
            if (!isGarden(down)) {
              ctx.moveTo(sx, sy + TILE);
              ctx.lineTo(sx + TILE, sy + TILE);
            }
            if (!isGarden(left)) {
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx, sy + TILE);
            }
            if (!isGarden(right)) {
              ctx.moveTo(sx + TILE, sy);
              ctx.lineTo(sx + TILE, sy + TILE);
            }
            ctx.stroke();
            ctx.lineWidth = 1;
            if (hash2(x, y) < 0.35) {
              ctx.fillStyle = "rgba(92,122,74,0.6)";
              ctx.beginPath();
              ctx.arc(sx + 8 + hash2(x, y + 2) * 16, sy + 8 + hash2(x + 2, y) * 16, 3 + hash2(x, y) * 2, 0, Math.PI * 2);
              ctx.fill();
            }
          } else if (t === EXIT) {
            const pulse = 0.55 + 0.35 * Math.sin(time * 0.06);
            ctx.fillStyle = `rgba(201,138,62,${pulse})`;
            ctx.fillRect(sx, sy, TILE, TILE);
          } else {
            ctx.fillStyle = "#171310";
            ctx.fillRect(sx, sy, TILE, TILE);
            if (hash2(x, y) < 0.2) {
              ctx.strokeStyle = "rgba(92,122,74,0.35)";
              ctx.lineWidth = 1;
              const tx = sx + 8 + hash2(x + 1, y) * 16;
              const ty = sy + 10 + hash2(x, y + 1) * 14;
              ctx.beginPath();
              ctx.moveTo(tx, ty + 6);
              ctx.lineTo(tx, ty);
              ctx.moveTo(tx + 3, ty + 6);
              ctx.lineTo(tx + 3, ty + 1);
              ctx.stroke();
            }
          }
        }
      }

      // roundabout tree
      const treeX = ROUNDABOUT_CENTER.x * TILE + TILE / 2 - camX;
      const treeY = ROUNDABOUT_CENTER.y * TILE + TILE / 2 - camY;
      ctx.fillStyle = "#3f2e1a";
      ctx.fillRect(treeX - 3, treeY - 2, 6, 14);
      ctx.fillStyle = "#4a5f34";
      ctx.beginPath();
      ctx.arc(treeX, treeY - 8, 13, 0, Math.PI * 2);
      ctx.fill();

      drawLabel(null, 19, 0.7, camX, camY, { lines: ["ENTRANCE"] });
      drawLabel("PARKING", 4.5, 10, camX, camY, { rotate: true });
      drawLabel(null, 31.5, 7, camX, camY, { lines: ["ARCHITECTURE", "BUILDING"] });
      drawLabel("ACADEMIC BUILDING", 39, 25.5, camX, camY, { rotate: true });
      drawLabel("CENTRAL GARDEN", 20, 25, camX, camY, { rotate: true, color: "rgba(168,154,134,0.85)" });
      drawLabel("CANTEEN", 18, 40, camX, camY, {});
      drawLabel("CCC LAB", 30.5, 40, camX, camY, { color: "#c98a3e" });
      drawLabel("SPORTS GROUND", 20, 48, camX, camY, {});

      const px = player.x * TILE - camX;
      const py = player.y * TILE - camY;
      drawExplorer(px, py);

      let fogR = 300;
      let fogD = 0.86;
      if (scare.active) {
        if (scare.type === "fog") {
          fogR = 80 + Math.sin(scare.timer * 0.14) * 30;
          fogD = 0.96;
        }
        if (scare.type === "flash") {
          ctx.fillStyle = `rgba(122,20,32,${0.38 * (1 - scare.timer / 48)})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        if (scare.type === "glitch") {
          for (let i = 0; i < 10; i++) {
            const gy = Math.random() * canvas.height;
            ctx.fillStyle = `rgba(194,36,47,${0.1 + Math.random() * 0.2})`;
            ctx.fillRect(0, gy, canvas.width, 2 + Math.random() * 5);
          }
          ctx.fillStyle = "rgba(92,122,74,0.06)";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        if (scare.type === "static") {
          for (let i = 0; i < 160; i++) {
            ctx.fillStyle = `rgba(200,200,200,${Math.random() * 0.2})`;
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 2, 1);
          }
        }
      }

      const g = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 20, canvas.width / 2, canvas.height / 2, fogR);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(0.5, `rgba(0,0,0,${fogD * 0.4})`);
      g.addColorStop(1, `rgba(0,0,0,${fogD})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    let raf;
    function loop() {
      time++;
      movePlayer();
      tryJumpScare();
      updateScare();
      draw();
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!won) return;
    const t = setTimeout(onComplete, 4500);
    return () => clearTimeout(t);
  }, [won, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 85,
        background: "var(--void)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <button
        className="hx-btn"
        onClick={onComplete}
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          zIndex: 30,
          padding: "9px 16px",
          fontSize: 11,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        Skip Game <ArrowRight size={13} />
      </button>

      <div
        className="hx-mono"
        style={{
          position: "absolute",
          top: 18,
          left: 20,
          zIndex: 20,
          fontSize: 13,
          lineHeight: 1.7,
          color: "var(--bone)",
          textShadow: "0 0 8px rgba(0,0,0,0.8)",
        }}
      >
        <div>
          OBJECTIVE: REACH <span style={{ color: "var(--amber)" }}>CCC LAB</span>
        </div>
        <div>
          SANITY: <span>{Math.floor(sanity)}</span>%
        </div>
        <div style={{ color: "var(--bone-dim)" }}>{status.toUpperCase()}</div>
      </div>

      <canvas
        ref={canvasRef}
        width={960}
        height={640}
        style={{
          display: "block",
          background: "#111",
          boxShadow: "0 0 60px rgba(122,20,32,0.3)",
          width: "100%",
          maxWidth: 960,
          height: "auto",
        }}
      />

      <div
        className="hx-mono"
        style={{
          position: "absolute",
          bottom: 18,
          width: "100%",
          textAlign: "center",
          fontSize: 12,
          color: "var(--bone-dim)",
          letterSpacing: "0.1em",
        }}
      >
        WASD / ARROW KEYS TO MOVE
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 40,
            background: "rgba(10,8,7,0.88)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 24,
          }}
        >
          <h2
            data-text="YOU ESCAPED"
            className="hx-glitch hx-display"
            style={{ fontSize: "clamp(32px, 6vw, 56px)", marginBottom: 12 }}
          >
            YOU ESCAPED
          </h2>
          <p style={{ color: "var(--bone-dim)", fontStyle: "italic", marginBottom: 30, maxWidth: 420 }}>
            You reached the CCC Lab... barely. The rest of the festival awaits.
          </p>
          <button className="hx-btn" onClick={onComplete}>
            Continue to Site
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}