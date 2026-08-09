import React, { useEffect, useMemo, useState } from "react";

/**
 * SpookyBackground
 * Ambient night scene (fog, distant treeline, a lonely road with a car
 * passing) that sits behind the intro content. A few seconds after
 * mounting, a flock of bats bursts outward from the center as a jump
 * scare, accompanied by a flash and a burst of static, then the bats
 * scatter off into the dark and the scene settles back to calm.
 *
 * Render this as the FIRST child of a relatively/absolutely positioned
 * container (e.g. the Intro screen). It fills its parent via
 * position: absolute; inset: 0 and sits at z-index: 0 — everything else
 * in that container should come after it in the DOM (or use zIndex: 1)
 * so it renders on top.
 */

const BAT_COUNT = 22;

export default function SpookyBackground() {
  const [scareActive, setScareActive] = useState(false);
  const [postScare, setPostScare] = useState(false);

  const bats = useMemo(
    () =>
      Array.from({ length: BAT_COUNT }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / BAT_COUNT + (Math.random() * 0.6 - 0.3);
        const distance = 260 + Math.random() * 340;
        const size = 18 + Math.random() * 14;
        const dur = 0.9 + Math.random() * 0.6;
        const delay = Math.random() * 0.25;
        return {
          id: i,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance * 0.7 - 40,
          rot: (angle * 180) / Math.PI,
          size,
          dur,
          delay,
        };
      }),
    []
  );

  useEffect(() => {
    // Auto-trigger the bat-flock jump scare a few seconds after landing
    // on the intro screen.
    const timer = setTimeout(() => {
      setScareActive(true);
      const settle = setTimeout(() => {
        setScareActive(false);
        setPostScare(true);
      }, 2800);
      return () => clearTimeout(settle);
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="sb-stage" aria-hidden="true">
      <div className="sb-fog" />
      <div className="sb-trees" />

      <div className="sb-road">
        <div className="sb-road-line" />
        <div className="sb-car" />
      </div>

      <div
        className={`sb-scare-layer ${scareActive ? "sb-scare-active" : ""} ${
          postScare ? "sb-post-scare" : ""
        }`}
      >
        <div className="sb-flash" />
        <div className="sb-static-heavy" />

        {bats.map((b) => (
          <div
            key={b.id}
            className="sb-bat"
            style={{
              "--tx": `${b.tx}px`,
              "--ty": `${b.ty}px`,
              "--rot": `${b.rot}deg`,
              "--dur": `${b.dur}s`,
              "--delay": `${b.delay}s`,
              width: b.size,
              height: b.size * 0.42,
              marginLeft: -(b.size / 2),
              marginTop: -(b.size * 0.21),
            }}
          >
            <svg viewBox="0 0 60 24" className="sb-bat-wing">
              <path d="M30 12 C24 2,14 0,0 6 C10 8,16 10,22 12 C16 14,10 16,0 18 C14 24,24 22,30 12 C36 22,46 24,60 18 C50 16,44 14,38 12 C44 10,50 8,60 6 C46 0,36 2,30 12 Z" />
            </svg>
          </div>
        ))}
      </div>

      <style>{`
        .sb-stage {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: radial-gradient(ellipse at center, #1a0808 0%, #000 75%);
          z-index: 0;
        }

        .sb-fog {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E");
          opacity: 0.5;
          animation: sbFogMove 35s linear infinite;
        }

        @keyframes sbFogMove {
          0% { transform: scale(1.1) translate(0, 0); }
          100% { transform: scale(1.2) translate(-5%, -3%); }
        }

        .sb-trees {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 60%;
          background: repeating-linear-gradient(
            90deg,
            transparent 0,
            transparent 70px,
            #0a0505 70px,
            #0a0505 95px
          );
          mask-image: linear-gradient(to top, black 25%, transparent 85%);
          -webkit-mask-image: linear-gradient(to top, black 25%, transparent 85%);
          opacity: 0.65;
        }

        .sb-road {
          position: absolute;
          bottom: 18%;
          left: 0;
          width: 100%;
          height: 8px;
          background: #1a1a1a;
          opacity: 0.45;
          transform: perspective(400px) rotateX(55deg);
          transform-origin: center bottom;
        }

        .sb-road-line {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            #444 0,
            #444 30px,
            transparent 30px,
            transparent 55px
          );
          transform: translateY(-50%);
        }

        .sb-car {
          position: absolute;
          bottom: 2px;
          left: -60px;
          width: 42px;
          height: 16px;
          background: #111;
          border-radius: 3px 6px 2px 2px;
          animation: sbCarDrive 22s linear infinite;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
        }

        .sb-car::before {
          content: "";
          position: absolute;
          top: -7px;
          left: 8px;
          width: 22px;
          height: 9px;
          background: #1a1a1a;
          border-radius: 3px 4px 0 0;
        }

        .sb-car::after {
          content: "";
          position: absolute;
          bottom: -3px;
          left: 4px;
          width: 8px;
          height: 8px;
          background: #222;
          border-radius: 50%;
          box-shadow: 26px 0 0 #222;
        }

        @keyframes sbCarDrive {
          0% { left: -60px; }
          100% { left: 110%; }
        }

        .sb-scare-layer {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          opacity: 1;
        }

        .sb-flash {
          position: absolute;
          inset: 0;
          background: #ece3d2;
          opacity: 0;
        }

        .sb-scare-active .sb-flash {
          animation: sbFlashBang 0.9s ease-out forwards;
        }

        .sb-static-heavy {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 1px,
            rgba(255, 255, 255, 0.05) 1px,
            rgba(255, 255, 255, 0.05) 2px
          );
          opacity: 0;
        }

        .sb-scare-active .sb-static-heavy {
          animation: sbStaticPulse 1.5s ease-out forwards;
        }

        @keyframes sbFlashBang {
          0% { opacity: 0; }
          8% { opacity: 0.9; }
          25% { opacity: 0.25; }
          40% { opacity: 0.6; }
          100% { opacity: 0; }
        }

        @keyframes sbStaticPulse {
          0% { opacity: 0; }
          20% { opacity: 0.6; }
          100% { opacity: 0.12; }
        }

        .sb-bat {
          position: absolute;
          top: 50%;
          left: 50%;
          opacity: 0;
          transform: translate(0, 0) scale(0.3) rotate(var(--rot, 0deg));
          transition: transform var(--dur, 1.1s) cubic-bezier(0.15, 0.7, 0.3, 1) var(--delay, 0s),
            opacity 0.35s ease var(--delay, 0s);
        }

        .sb-scare-active .sb-bat {
          opacity: 1;
          transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot, 0deg));
        }

        .sb-post-scare .sb-bat {
          opacity: 0;
          transform: translate(calc(var(--tx) * 1.6), calc(var(--ty) * 1.6 - 60px)) scale(0.7)
            rotate(var(--rot, 0deg));
          transition: transform 1.8s ease, opacity 1.8s ease;
        }

        .sb-bat-wing {
          width: 100%;
          height: 100%;
          display: block;
          animation: sbFlap 0.14s steps(2) infinite;
          transform-origin: center;
        }

        .sb-bat-wing path {
          fill: #050403;
        }

        @keyframes sbFlap {
          0% { transform: scaleY(1); }
          50% { transform: scaleY(0.45); }
          100% { transform: scaleY(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sb-fog,
          .sb-car,
          .sb-bat-wing {
            animation: none !important;
          }
          .sb-bat,
          .sb-flash,
          .sb-static-heavy {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}