import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Game
 * A top-down exploration mini-game across a to-scale NIT Raipur campus:
 * entrance -> parking spur -> architecture building -> roundabout ->
 * central garden -> academic building (east edge) -> canteen / CCC lab
 * (the goal) -> sports ground. Roads are a distinct paved layer with
 * curb boundaries, separate from open grass. Random jump scares (fog,
 * flash, glitch, static) chip away at a "sanity" meter as you explore.
 * Reaching CCC Lab, or clicking "Skip Game", both call onComplete.
 */

const TILE = 32;
const COLS = 34;
const ROWS = 48;

function buildCampus() {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  const road = Array.from({ length: ROWS }, () => Array(COLS).fill(false));

  const rect = (r0, c0, r1, c1, val) => {
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (grid[r]) grid[r][c] = val;
      }
    }
  };
  const roadRect = (r0, c0, r1, c1) => {
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (grid[r]) {
          grid[r][c] = 0;
          road[r][c] = true;
        }
      }
    }
  };
  const roadCircle = (cr, cc, radius) => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.hypot(r - cr, c - cc) <= radius) {
          grid[r][c] = 0;
          road[r][c] = true;
        }
      }
    }
  };

  // outer boundary
  rect(0, 0, ROWS - 1, 0, 1);
  rect(0, COLS - 1, ROWS - 1, COLS - 1, 1);
  rect(0, 0, 0, COLS - 1, 1);
  rect(ROWS - 1, 0, ROWS - 1, COLS - 1, 1);

  // entrance gate pillars, road runs through the opening
  rect(1, 14, 3, 14, 1);
  rect(1, 19, 3, 19, 1);
  roadRect(1, 15, 16, 18); // entrance road, straight down to the roundabout

  // parking (small lot, west of entrance road)
  rect(5, 2, 11, 6, 1);

  // architecture building (large block, matches the sketch's biggest shape)
  rect(2, 21, 11, 30, 1);

  // roundabout — circular plaza at the heart of campus
  roadCircle(18, 16.5, 3.2);

  // connector: roundabout up to architecture building's south edge, then east
  roadRect(11, 16, 13, 29);

  // central garden (east of the roundabout)
  rect(14, 21, 25, 26, 1);

  // east road, runs the full north-south length beside academic building
  roadRect(11, 27, 40, 29);

  // academic building (tall strip along the east edge)
  rect(11, 30, 40, 32, 1);

  // south connector from the roundabout down toward canteen / CCC
  roadRect(18, 15, 41, 19);

  // loop road linking the south and east roads below the garden
  roadRect(32, 15, 34, 29);

  // canteen
  rect(36, 9, 40, 14, 1);

  // CCC lab — the goal. Door faces the road on its west side.
  rect(36, 20, 40, 26, 1);
  grid[38][20] = 2;

  // sports ground stays open (large lawn, no walls — just a drawn boundary)
  return { grid, road };
}

const { grid: MAP, road: ROAD } = buildCampus();
const ROUNDABOUT_CENTER = { r: 18, c: 16.5 };
const SPORTS_GROUND = { r0: 41, c0: 2, r1: 46, c1: 31 };

// Deterministic scattering of decorative trees across open, non-road,
// non-building ground — computed once at module load, not per frame.
const TREES = (() => {
  const trees = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let r = 1; r < ROWS - 1; r++) {
    for (let c = 1; c < COLS - 1; c++) {
      if (MAP[r][c] === 0 && !ROAD[r][c] && rand() < 0.05) {
        trees.push({ r: r + (rand() - 0.5) * 0.5, c: c + (rand() - 0.5) * 0.5, s: 4 + rand() * 3 });
      }
    }
  }
  return trees;
})();

const LABELS = [
  { text: "ENTRANCE", r: 0.3, c: 16.5, color: "#c98a3e" },
  { text: "PARKING", r: 8, c: 4, color: "#a89a86", vertical: true },
  { text: "ARCHITECTURE", r: 6, c: 25.5, color: "#a89a86" },
  { text: "BUILDING", r: 7.2, c: 25.5, color: "#a89a86" },
  { text: "CENTRAL GARDEN", r: 19.5, c: 23.5, color: "#a89a86", vertical: true },
  { text: "ACADEMIC BUILDING", r: 25.5, c: 31, color: "#a89a86", vertical: true },
  { text: "CANTEEN", r: 38, c: 11.5, color: "#a89a86" },
  { text: "CCC LAB", r: 38, c: 23, color: "#c98a3e" },
  { text: "SPORTS GROUND", r: 43.5, c: 16.5, color: "#a89a86" },
];

export default function Game({ onComplete, onSkip }) {
  const canvasRef = useRef(null);
  const [sanity, setSanity] = useState(100);
  const [status, setStatus] = useState("The corridors feel wrong...");
  const [won, setWon] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const player = { x: 16.5, y: 2.5, speed: 0.095 };
    const keys = {};
    const scare = { active: false, type: null, timer: 0 };
    let gameState = "playing";

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
      return MAP[r][c] === 1;
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
      if (MAP[py][px] === 2 && gameState === "playing") {
        gameState = "won";
        setWon(true);
      }
    }

    function tryJumpScare() {
      if (scare.active || gameState !== "playing") return;
      if (Math.random() < 0.0018) {
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

    function draw() {
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const camX = player.x * TILE - canvas.width / 2;
      const camY = player.y * TILE - canvas.height / 2;

      const c0 = Math.max(0, Math.floor(camX / TILE) - 1);
      const c1 = Math.min(COLS - 1, Math.ceil((camX + canvas.width) / TILE) + 1);
      const r0 = Math.max(0, Math.floor(camY / TILE) - 1);
      const r1 = Math.min(ROWS - 1, Math.ceil((camY + canvas.height) / TILE) + 1);

      for (let y = r0; y <= r1; y++) {
        for (let x = c0; x <= c1; x++) {
          const sx = x * TILE - camX;
          const sy = y * TILE - camY;
          const isSportsGround =
            x >= SPORTS_GROUND.c0 && x <= SPORTS_GROUND.c1 && y >= SPORTS_GROUND.r0 && y <= SPORTS_GROUND.r1;

          if (MAP[y][x] === 1) {
            const isParking = y >= 5 && y <= 11 && x >= 2 && x <= 6;
            ctx.fillStyle = isParking ? "#2f2a26" : "#2b2118";
            ctx.fillRect(sx, sy, TILE, TILE);
            ctx.strokeStyle = "#171310";
            ctx.lineWidth = 1;
            ctx.strokeRect(sx, sy, TILE, TILE);

            if (isParking) {
              ctx.strokeStyle = "rgba(236,227,210,0.35)";
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(sx + TILE / 2, sy + 3);
              ctx.lineTo(sx + TILE / 2, sy + TILE - 3);
              ctx.stroke();
            } else {
              const hasOpenNeighbor =
                (MAP[y - 1] && MAP[y - 1][x] !== 1) ||
                (MAP[y + 1] && MAP[y + 1][x] !== 1) ||
                MAP[y][x - 1] !== 1 ||
                MAP[y][x + 1] !== 1;
              if (hasOpenNeighbor) {
                ctx.fillStyle = "rgba(201,138,62,0.22)";
                ctx.fillRect(sx + 7, sy + 8, 8, 8);
                ctx.fillRect(sx + 18, sy + 8, 8, 8);
              }
            }
          } else if (MAP[y][x] === 2) {
            ctx.fillStyle = "#c98a3e";
            ctx.fillRect(sx, sy, TILE, TILE);
            ctx.fillStyle = "rgba(10,8,7,0.4)";
            ctx.fillRect(sx + TILE / 2 - 2, sy + 4, 4, TILE - 8);
          } else if (ROAD[y][x]) {
            ctx.fillStyle = "#332e28";
            ctx.fillRect(sx, sy, TILE, TILE);
            if ((x + y) % 2 === 0) {
              ctx.fillStyle = "rgba(236,227,210,0.15)";
              ctx.fillRect(sx + TILE / 2 - 1, sy + TILE / 2 - 6, 2, 12);
            }
            ctx.strokeStyle = "rgba(0,0,0,0.4)";
            ctx.lineWidth = 2;
            if (!ROAD[y - 1] || !ROAD[y - 1][x]) {
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx + TILE, sy);
              ctx.stroke();
            }
            if (!ROAD[y + 1] || !ROAD[y + 1][x]) {
              ctx.beginPath();
              ctx.moveTo(sx, sy + TILE);
              ctx.lineTo(sx + TILE, sy + TILE);
              ctx.stroke();
            }
            if (!ROAD[y][x - 1]) {
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx, sy + TILE);
              ctx.stroke();
            }
            if (!ROAD[y][x + 1]) {
              ctx.beginPath();
              ctx.moveTo(sx + TILE, sy);
              ctx.lineTo(sx + TILE, sy + TILE);
              ctx.stroke();
            }
          } else {
            ctx.fillStyle = isSportsGround ? "#161c13" : "#171310";
            ctx.fillRect(sx, sy, TILE, TILE);
          }
        }
      }

      // sports ground boundary line
      ctx.strokeStyle = "rgba(168,154,134,0.35)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.strokeRect(
        SPORTS_GROUND.c0 * TILE - camX,
        SPORTS_GROUND.r0 * TILE - camY,
        (SPORTS_GROUND.c1 - SPORTS_GROUND.c0 + 1) * TILE,
        (SPORTS_GROUND.r1 - SPORTS_GROUND.r0 + 1) * TILE
      );
      ctx.setLineDash([]);

      // scattered trees
      TREES.forEach((t) => {
        const sx = t.c * TILE - camX;
        const sy = t.r * TILE - camY;
        if (sx < -20 || sx > canvas.width + 20 || sy < -20 || sy > canvas.height + 20) return;
        ctx.fillStyle = "#243018";
        ctx.beginPath();
        ctx.arc(sx, sy, t.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#3a2a1a";
        ctx.fillRect(sx - 1, sy + t.s - 1, 2, 4);
      });

      // roundabout centerpiece
      {
        const rx = ROUNDABOUT_CENTER.c * TILE - camX;
        const ry = ROUNDABOUT_CENTER.r * TILE - camY;
        ctx.fillStyle = "#1f2a15";
        ctx.beginPath();
        ctx.arc(rx, ry, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#2f4020";
        ctx.beginPath();
        ctx.arc(rx, ry, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4a3320";
        ctx.fillRect(rx - 2, ry + 4, 4, 8);
      }

      // labels
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      LABELS.forEach((l) => {
        ctx.fillStyle = l.color;
        ctx.save();
        const sx = l.c * TILE - camX;
        const sy = l.r * TILE - camY;
        if (l.vertical) {
          ctx.translate(sx, sy);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(l.text, 0, 0);
        } else {
          ctx.fillText(l.text, sx, sy);
        }
        ctx.restore();
      });

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
        onClick={onSkip}
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