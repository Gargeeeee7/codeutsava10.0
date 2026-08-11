/**
 * Button click SFX — trimmed cinematic whoosh
 * (mixkit-cinematic-whoosh-deep-impact, silence stripped: ~0.2s–1.52s)
 *
 * Respects window.__hxMuted (synced with the landing mute toggle).
 */

const SFX_URL = "/audio/btn-whoosh.mp3";
const SFX_VOLUME = 0.45; // 0–1, keep below ambient so it doesn't overpower

let pool = [];
const POOL_SIZE = 4; // allow rapid clicks without cutting previous plays
let ready = false;

function makeAudio() {
  const a = new Audio(SFX_URL);
  a.preload = "auto";
  a.volume = SFX_VOLUME;
  return a;
}

function ensurePool() {
  if (ready) return;
  for (let i = 0; i < POOL_SIZE; i++) {
    pool.push(makeAudio());
  }
  ready = true;
}

/**
 * Play the whoosh button effect.
 * @param {"soft"|"hard"|"glitch"} [_variant] kept for API compat; all use the same clip
 */
export function playClick(_variant = "soft") {
  if (typeof window === "undefined") return;
  if (window.__hxMuted) return;

  ensurePool();

  // find a free instance, or reuse the oldest
  let audio = pool.find((a) => a.paused || a.ended);
  if (!audio) {
    audio = pool[0];
  }

  try {
    audio.currentTime = 0;
    audio.volume = SFX_VOLUME;
    const p = audio.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  } catch {
    // ignore autoplay / decode errors
  }
}

/**
 * Attach a delegated click listener so matching elements play the SFX.
 * Returns a cleanup function.
 */
export function attachClickSounds(root = document, selectors = ".hx-btn, button.hx-btn, a.hx-btn") {
  ensurePool();
  const handler = (e) => {
    const target = e.target.closest(selectors);
    if (!target) return;
    playClick("soft");
  };
  root.addEventListener("click", handler);
  return () => root.removeEventListener("click", handler);
}