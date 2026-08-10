import React from "react";

/**
 * SpookyBackground
 * A thin drifting-fog texture that sits over the intro photo. The stage
 * itself is transparent — it's meant to layer on top of a real
 * background image (see Intro.jsx), not draw its own scene.
 *
 * Render this as a child of a relatively/absolutely positioned
 * container (e.g. the Intro screen), after the background image. It
 * fills its parent via position: absolute; inset: 0 and sits at
 * z-index: 0 — everything else in that container should come after it
 * in the DOM (or use zIndex: 1) so it renders on top.
 */
export default function SpookyBackground() {
  return (
    <div className="sb-stage" aria-hidden="true">
      <div className="sb-fog" />

      <style>{`
        .sb-stage {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        .sb-fog {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E");
          opacity: 0.4;
          animation: sbFogMove 35s linear infinite;
        }

        @keyframes sbFogMove {
          0% { transform: scale(1.1) translate(0, 0); }
          100% { transform: scale(1.2) translate(-5%, -3%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sb-fog {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}