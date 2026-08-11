import React, { useEffect, useState } from "react";

/**
 * ThingCursor — uses the stitched hand PNG as a custom pointer.
 * Hotspot is tuned toward the index fingertip.
 */
export default function ThingCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const prev = document.body.style.cursor;
    document.body.style.cursor = "none";
    document.documentElement.style.cursor = "none";

    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const down = () => setClicking(true);
    const up = () => setClicking(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      document.body.style.cursor = prev;
      document.documentElement.style.cursor = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <div
      className={`hx-thing-cursor ${clicking ? "is-click" : ""}`}
      aria-hidden="true"
      style={{
        left: pos.x,
        top: pos.y,
        opacity: visible ? 1 : 0,
      }}
    >
      <img
        src="/images/thing-hand.png"
        alt=""
        width={48}
        height={48}
        draggable={false}
        style={{
          display: "block",
          width: 48,
          height: "auto",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}