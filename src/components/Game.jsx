import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";

/**
 * Game — Backrooms-themed top-down escape
 * Yellow mono-yellow corridors, damp carpet, buzzing fluorescents.
 * Reach the EXIT door (or Skip). Random scares drain sanity.
 */

const TILE = 32;
const COLS = 52;
const ROWS = 58;

// 0 = open floor, 1 = wall, 2 = exit
function buildBackrooms() {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(1));

  const carve = (r0, c0, r1, c1) => {
    for (let r = Math.max(1, r0); r <= Math.min(ROWS - 2, r1); r++) {
      for (let c = Math.max(1, c0); c <= Math.min(COLS - 2, c1); c++) {
        grid[r][c] = 0;
      }
    }
  };

  // Dense east-west corridors
  for (let r = 3; r < ROWS - 3; r += 5) {
    carve(r, 2, r + 1, COLS - 3);
  }

  // Dense north-south corridors
  for (let c = 3; c < COLS - 3; c += 5) {
    carve(2, c, ROWS - 3, c + 1);
  }

  // Cross-links that break the perfect grid
  carve(8, 8, 9, 18);
  carve(8, 28, 9, 40);
  carve(18, 15, 19, 30);
  carve(28, 6, 29, 22);
  carve(28, 30, 29, 45);
  carve(38, 10, 39, 25);
  carve(38, 32, 39, 48);
  carve(48, 8, 49, 20);
  carve(48, 28, 49, 42);

  // Nested rooms
  const rooms = [
    [5, 6, 7, 10], [5, 16, 7, 20], [5, 26, 7, 30], [5, 36, 7, 42],
    [12, 6, 15, 10], [12, 16, 15, 20], [12, 26, 15, 30], [12, 36, 15, 42],
    [22, 6, 25, 10], [22, 16, 25, 20], [22, 26, 25, 30], [22, 36, 25, 42],
    [32, 6, 35, 10], [32, 16, 35, 20], [32, 26, 35, 30], [32, 36, 35, 42],
    [42, 6, 45, 10], [42, 16, 45, 20], [42, 26, 45, 30], [42, 36, 45, 42],
  ];
  rooms.forEach(([r0, c0, r1, c1]) => carve(r0, c0, r1, c1));

  // Blind corridors (dead ends)
  carve(6, 44, 6, 49);
  carve(16, 1, 16, 4);
  carve(26, 46, 26, 50);
  carve(36, 1, 36, 5);
  carve(46, 44, 46, 50);
  carve(14, 48, 20, 48);
  carve(30, 2, 36, 2);
  carve(40, 48, 48, 48);

  // False “almost exit” chambers
  carve(20, 44, 24, 49);
  carve(50, 6, 54, 12);

  // Choke points & pillars — force longer routes
  const blocks = [
    [8, 13], [8, 14], [8, 23], [8, 24], [8, 33], [8, 34],
    [13, 8], [13, 9], [13, 18], [13, 19], [13, 28], [13, 29], [13, 38], [13, 39],
    [18, 13], [18, 14], [18, 33], [18, 34],
    [23, 8], [23, 9], [23, 18], [23, 19], [23, 28], [23, 29],
    [28, 13], [28, 14], [28, 23], [28, 24], [28, 38], [28, 39],
    [33, 8], [33, 9], [33, 18], [33, 19], [33, 28], [33, 29],
    [38, 13], [38, 14], [38, 23], [38, 24], [38, 33], [38, 34],
    [43, 8], [43, 9], [43, 18], [43, 19], [43, 28], [43, 29], [43, 38], [43, 39],
    [48, 13], [48, 14], [48, 23], [48, 24],
    [6, 8], [6, 18], [6, 28], [6, 38],
    [14, 8], [14, 18], [14, 28], [14, 38],
    [24, 8], [24, 18], [24, 28], [24, 38],
    [34, 8], [34, 18], [34, 28], [34, 38],
    [44, 8], [44, 18], [44, 28], [44, 38],
  ];
  blocks.forEach(([r, c]) => {
    if (grid[r] && grid[r][c] === 0) grid[r][c] = 1;
  });

  // Start lobby (north-center)
  carve(2, 22, 6, 30);

  // Real exit — deep south, long approach
  carve(50, 20, 55, 32);
  carve(53, 24, 56, 28);
  grid[55][26] = 2;

  return grid;
}

const MAP = buildBackrooms();

// Fluorescent light positions
const LIGHTS = (() => {
  const list = [];
  for (let r = 3; r < ROWS - 2; r += 3) {
    for (let c = 4; c < COLS - 2; c += 3) {
      if (MAP[r] && MAP[r][c] === 0) list.push({ r: r + 0.5, c: c + 0.5 });
    }
  }
  return list;
})();

const LABELS = [
  { text: "LEVEL 0", r: 4, c: 26, color: "rgba(168,154,134,0.7)" },
  { text: "NO EXIT", r: 7, c: 8, color: "rgba(194,36,47,0.45)" },
  { text: "KEEP WALKING", r: 14, c: 18, color: "rgba(168,154,134,0.45)" },
  { text: "THE HUM NEVER STOPS", r: 16, c: 38, color: "rgba(194,36,47,0.4)" },
  { text: "DON'T LOOK BACK", r: 26, c: 12, color: "rgba(168,154,134,0.45)" },
  { text: "WRONG WAY", r: 22, c: 46, color: "rgba(194,36,47,0.5)" },
  { text: "ALMOST...", r: 52, c: 9, color: "rgba(201,138,62,0.55)" },
  { text: "EXIT?", r: 53, c: 26, color: "rgba(194,36,47,0.85)" },
];

// Regions washed in blood-red light (matches site --blood)
const RED_ZONES = [
  { r0: 12, c0: 34, r1: 28, c1: 50 }, // east wing
  { r0: 30, c0: 2, r1: 48, c1: 16 },  // southwest
  { r0: 40, c0: 30, r1: 52, c1: 48 }, // near false paths south-east
];

function inRedZone(r, c) {
  return RED_ZONES.some((z) => r >= z.r0 && r <= z.r1 && c >= z.c0 && c <= z.c1);
}

export default function Game({ onComplete, onSkip }) {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const [sanity, setSanity] = useState(100);
  const [status, setStatus] = useState("The fluorescents hum above you...");
  const [won, setWon] = useState(false);
  const [muted, setMuted] = useState(false);

  // Background ambient — place file at public/audio/backrooms-ambient.mp3
  useEffect(() => {
    const audio = new Audio("/audio/backrooms-ambient.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play().catch(() => {
        // browsers block autoplay until a gesture — first click/key will unlock
      });
    };

    tryPlay();
    const unlock = () => {
      tryPlay();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = muted;
    if (!muted) {
      audio.play().catch(() => {});
    }
  }, [muted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const player = { x: 26, y: 4, speed: 0.105 };
    const keys = {};
    const scare = { active: false, type: null, timer: 0 };
    let gameState = "playing";
    let flickerPhase = 0;
    let time = 0;

    // Wallpaper — bone / void stripes (site palette), not pure yellow
    const wallpaper = document.createElement("canvas");
    wallpaper.width = TILE;
    wallpaper.height = TILE;
    {
      const w = wallpaper.getContext("2d");
      w.fillStyle = "#2a221c";
      w.fillRect(0, 0, TILE, TILE);
      for (let i = 0; i < TILE; i += 4) {
        w.fillStyle = i % 8 === 0 ? "#1f1814" : "#2e2620";
        w.fillRect(i, 0, 2, TILE);
      }
      // faint blood stain streaks
      w.fillStyle = "rgba(122,20,32,0.12)";
      w.fillRect(0, 8, TILE, 2);
      w.fillRect(0, 22, TILE, 3);
    }

    // Carpet — dark damp floor matching --void-2 / bone-dim
    const carpet = document.createElement("canvas");
    carpet.width = TILE;
    carpet.height = TILE;
    {
      const c = carpet.getContext("2d");
      c.fillStyle = "#1b1414";
      c.fillRect(0, 0, TILE, TILE);
      for (let i = 0; i < 20; i++) {
        const x = (i * 7) % TILE;
        const y = (i * 11) % TILE;
        c.fillStyle = `rgba(80,40,40,${0.06 + (i % 3) * 0.04})`;
        c.fillRect(x, y, 3 + (i % 4), 2 + (i % 3));
      }
      c.strokeStyle = "rgba(168,154,134,0.08)";
      c.lineWidth = 1;
      c.strokeRect(0.5, 0.5, TILE - 1, TILE - 1);
    }

    const handleKeyDown = (e) => {
      keys[e.key.toLowerCase()] = true;
      // prevent page scroll on arrows
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
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
        // slight collision radius
        const r = 0.28;
        if (!isWall(player.x + dx + Math.sign(dx) * r, player.y) &&
            !isWall(player.x + dx + Math.sign(dx) * r, player.y - r) &&
            !isWall(player.x + dx + Math.sign(dx) * r, player.y + r)) {
          player.x += dx;
        }
        if (!isWall(player.x, player.y + dy + Math.sign(dy) * r) &&
            !isWall(player.x - r, player.y + dy + Math.sign(dy) * r) &&
            !isWall(player.x + r, player.y + dy + Math.sign(dy) * r)) {
          player.y += dy;
        }
      }

      const px = Math.floor(player.x);
      const py = Math.floor(player.y);
      if (MAP[py] && MAP[py][px] === 2 && gameState === "playing") {
        gameState = "won";
        setWon(true);
        setStatus("You found a way out...");
      }
    }

    function tryJumpScare() {
      if (scare.active || gameState !== "playing") return;
      if (Math.random() < 0.0022) {
        const types = ["flicker", "entity", "hum", "static", "blackout"];
        scare.type = types[Math.floor(Math.random() * types.length)];
        scare.active = true;
        scare.timer = 0;
        setSanity((prev) => {
          const next = Math.max(0, prev - (1.5 + Math.random() * 3));
          if (next < 60) setStatus("Something is wrong with the lights...");
          if (next < 35) setStatus("You are not alone in here.");
          if (next < 15) setStatus("THE HUM IS INSIDE YOUR HEAD");
          return next;
        });
      }
    }

    function updateScare() {
      if (!scare.active) return;
      scare.timer++;
      const max =
        scare.type === "hum" ? 90 :
        scare.type === "blackout" ? 55 :
        scare.type === "entity" ? 40 : 50;
      if (scare.timer > max) {
        scare.active = false;
        scare.type = null;
      }
    }

    function drawPlayer(x, y) {
      ctx.fillStyle = "rgba(10,8,7,0.45)";
      ctx.beginPath();
      ctx.ellipse(x, y + 12, 9, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // coat — dark, site-aligned
      ctx.fillStyle = "#3c3441";
      ctx.fillRect(x - 7, y - 2, 14, 15);
      ctx.fillStyle = "rgba(122,20,32,0.25)";
      ctx.fillRect(x - 1, y - 2, 2, 15);

      ctx.fillStyle = "#ece3d2";
      ctx.beginPath();
      ctx.arc(x, y - 10, 7.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1c1917";
      ctx.beginPath();
      ctx.arc(x, y - 13, 7, Math.PI, 0);
      ctx.fill();

      ctx.fillStyle = "#0a0807";
      ctx.fillRect(x - 4, y - 11, 2.5, 2.5);
      ctx.fillRect(x + 1.5, y - 11, 2.5, 2.5);

      ctx.fillStyle = "#241a1a";
      ctx.fillRect(x - 6, y + 13, 5, 9);
      ctx.fillRect(x + 1, y + 13, 5, 9);
    }

    function draw() {
      time++;
      flickerPhase = Math.sin(time * 0.08) * 0.5 + 0.5;

      // base void (site --void)
      ctx.fillStyle = "#0a0807";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const camX = player.x * TILE - canvas.width / 2;
      const camY = player.y * TILE - canvas.height / 2;

      const c0 = Math.max(0, Math.floor(camX / TILE) - 1);
      const c1 = Math.min(COLS - 1, Math.ceil((camX + canvas.width) / TILE) + 1);
      const r0 = Math.max(0, Math.floor(camY / TILE) - 1);
      const r1 = Math.min(ROWS - 1, Math.ceil((camY + canvas.height) / TILE) + 1);

      // --- tiles ---
      for (let y = r0; y <= r1; y++) {
        for (let x = c0; x <= c1; x++) {
          const sx = x * TILE - camX;
          const sy = y * TILE - camY;
          const cell = MAP[y][x];

          if (cell === 1) {
            // wallpaper wall
            ctx.drawImage(wallpaper, sx, sy);
            // outer edge shade
            const openN = MAP[y - 1] && MAP[y - 1][x] !== 1;
            const openS = MAP[y + 1] && MAP[y + 1][x] !== 1;
            const openW = MAP[y][x - 1] !== 1;
            const openE = MAP[y][x + 1] !== 1;
            if (openN || openS || openW || openE) {
              ctx.fillStyle = "rgba(10,8,7,0.35)";
              if (openN) ctx.fillRect(sx, sy, TILE, 3);
              if (openS) ctx.fillRect(sx, sy + TILE - 3, TILE, 3);
              if (openW) ctx.fillRect(sx, sy, 3, TILE);
              if (openE) ctx.fillRect(sx + TILE - 3, sy, 3, TILE);
              if (openS) {
                ctx.fillStyle = "#3a2a28";
                ctx.fillRect(sx, sy + TILE - 5, TILE, 5);
              }
            }
          } else if (cell === 2) {
            // EXIT — blood-amber glow (site palette)
            ctx.fillStyle = "#130f0e";
            ctx.fillRect(sx, sy, TILE, TILE);
            const pulse = 0.5 + Math.sin(time * 0.12) * 0.3;
            ctx.fillStyle = `rgba(194,36,47,${pulse})`;
            ctx.fillRect(sx + 6, sy + 4, TILE - 12, TILE - 8);
            ctx.strokeStyle = "#c98a3e";
            ctx.lineWidth = 2;
            ctx.strokeRect(sx + 6, sy + 4, TILE - 12, TILE - 8);
            ctx.fillStyle = "#ece3d2";
            ctx.font = "bold 9px 'JetBrains Mono', monospace";
            ctx.textAlign = "center";
            ctx.fillText("EXIT", sx + TILE / 2, sy + TILE / 2 + 3);
          } else {
            ctx.drawImage(carpet, sx, sy);
          }
        }
      }

      // --- ceiling lights: amber in safe zones, blood-red in RED_ZONES ---
      LIGHTS.forEach((L) => {
        const lx = L.c * TILE - camX;
        const ly = L.r * TILE - camY;
        if (lx < -80 || lx > canvas.width + 80 || ly < -80 || ly > canvas.height + 80) return;

        const red = inRedZone(L.r, L.c);
        let intensity = 0.2 + flickerPhase * 0.08;
        if (scare.active && (scare.type === "flicker" || scare.type === "blackout")) {
          intensity = scare.type === "blackout"
            ? (scare.timer % 8 < 3 ? 0.02 : 0.08)
            : (Math.random() > 0.4 ? 0.05 : 0.32);
        }

        const g = ctx.createRadialGradient(lx, ly, 2, lx, ly, red ? 85 : 70);
        if (red) {
          g.addColorStop(0, `rgba(194,36,47,${intensity * 1.15})`);
          g.addColorStop(0.35, `rgba(122,20,32,${intensity * 0.45})`);
          g.addColorStop(1, "rgba(80,10,15,0)");
        } else {
          g.addColorStop(0, `rgba(201,138,62,${intensity * 0.9})`);
          g.addColorStop(0.4, `rgba(168,154,134,${intensity * 0.25})`);
          g.addColorStop(1, "rgba(40,30,20,0)");
        }
        ctx.fillStyle = g;
        ctx.fillRect(lx - 85, ly - 85, 170, 170);

        // fixture
        if (red) {
          ctx.fillStyle = `rgba(194,36,47,${0.45 + intensity})`;
          ctx.fillRect(lx - 14, ly - 3, 28, 6);
          ctx.fillStyle = "rgba(80,10,15,0.5)";
        } else {
          ctx.fillStyle = `rgba(236,227,210,${0.35 + intensity * 0.5})`;
          ctx.fillRect(lx - 14, ly - 3, 28, 6);
          ctx.fillStyle = "rgba(40,30,20,0.45)";
        }
        ctx.fillRect(lx - 15, ly - 4, 30, 1);
      });

      // --- labels on walls ---
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      LABELS.forEach((l) => {
        const sx = l.c * TILE - camX;
        const sy = l.r * TILE - camY;
        if (sx < -40 || sx > canvas.width + 40) return;
        ctx.fillStyle = l.color;
        ctx.fillText(l.text, sx, sy);
      });

      // player
      const px = player.x * TILE - camX;
      const py = player.y * TILE - camY;
      drawPlayer(px, py);

      // --- scare overlays ---
      if (scare.active) {
        if (scare.type === "entity") {
          const ang = (scare.timer * 0.05) % (Math.PI * 2);
          const dist = 140 + Math.sin(scare.timer * 0.1) * 20;
          const ex = canvas.width / 2 + Math.cos(ang) * dist;
          const ey = canvas.height / 2 + Math.sin(ang) * dist * 0.6;
          ctx.fillStyle = "rgba(10,8,7,0.9)";
          ctx.beginPath();
          ctx.ellipse(ex, ey - 10, 10, 22, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(ex, ey - 28, 8, 0, Math.PI * 2);
          ctx.fill();
          // blood-bright eyes
          ctx.fillStyle = "rgba(194,36,47,0.95)";
          ctx.fillRect(ex - 4, ey - 30, 2.5, 2.5);
          ctx.fillRect(ex + 1.5, ey - 30, 2.5, 2.5);
        }

        if (scare.type === "hum") {
          ctx.fillStyle = `rgba(194,36,47,${0.07 + Math.sin(scare.timer * 0.3) * 0.05})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (scare.type === "static") {
          for (let i = 0; i < 120; i++) {
            ctx.fillStyle = `rgba(236,227,210,${Math.random() * 0.15})`;
            ctx.fillRect(
              Math.random() * canvas.width,
              Math.random() * canvas.height,
              1 + Math.random() * 2,
              1
            );
          }
        }

        if (scare.type === "blackout") {
          ctx.fillStyle = `rgba(10,8,7,${0.78 + Math.sin(scare.timer * 0.4) * 0.12})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        if (scare.type === "flicker") {
          if (scare.timer % 5 < 2) {
            ctx.fillStyle = "rgba(194,36,47,0.1)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      }

      // vignette — void black
      let fogR = 280;
      let fogD = 0.9;
      if (scare.active && scare.type === "blackout") {
        fogR = 90;
        fogD = 0.97;
      }
      const fog = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 30,
        canvas.width / 2, canvas.height / 2, fogR
      );
      fog.addColorStop(0, "rgba(10,8,7,0)");
      fog.addColorStop(0.45, `rgba(10,8,7,${fogD * 0.4})`);
      fog.addColorStop(1, `rgba(10,8,7,${fogD})`);
      ctx.fillStyle = fog;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // site color grade — slight blood wash
      ctx.fillStyle = "rgba(122,20,32,0.04)";
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
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <button
          className="hx-btn"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute sound" : "Mute sound"}
          title={muted ? "Unmute" : "Mute"}
          style={{
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
        <button
          className="hx-btn"
          onClick={onSkip}
          style={{
            padding: "9px 16px",
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          Skip Game <ArrowRight size={13} />
        </button>
      </div>

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
          textShadow: "0 0 10px rgba(0,0,0,0.9)",
        }}
      >
        <div>
          OBJECTIVE: FIND THE <span style={{ color: "var(--blood-bright)" }}>EXIT</span>
        </div>
        <div>
          SANITY:{" "}
          <span style={{ color: sanity < 30 ? "var(--blood-bright)" : sanity < 60 ? "var(--amber)" : "var(--bone)" }}>
            {Math.floor(sanity)}%
          </span>
        </div>
        <div style={{ color: "var(--bone-dim)", maxWidth: 280 }}>{status.toUpperCase()}</div>
      </div>

      <canvas
        ref={canvasRef}
        width={960}
        height={640}
        style={{
          display: "block",
          background: "var(--void)",
          boxShadow: "0 0 80px rgba(122,20,32,0.35), 0 0 40px rgba(0,0,0,0.6)",
          width: "100%",
          maxWidth: 960,
          height: "auto",
          border: "1px solid rgba(194,36,47,0.18)",
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
          letterSpacing: "0.12em",
        }}
      >
        WASD / ARROWS — IF THE LIGHTS GO OUT, KEEP MOVING
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
            background: "rgba(10,8,7,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 24,
          }}
        >
          <h2
            data-text="YOU FOUND THE EXIT"
            className="hx-glitch hx-display"
            style={{ fontSize: "clamp(28px, 5vw, 52px)", marginBottom: 12, color: "var(--bone)" }}
          >
            YOU FOUND THE EXIT
          </h2>
          <p style={{ color: "var(--bone-dim)", fontStyle: "italic", marginBottom: 30, maxWidth: 420 }}>
            The red lights die. The hum stops. For a moment, the corridors let you go.
          </p>
          <button className="hx-btn" onClick={onComplete}>
            Continue to Site
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}