'use client';

import React from 'react';

/**
 * CRT screen effects - scanlines, vignette, and subtle flicker
 * Visible effects for authentic retro terminal feel
 */
export function CRTEffect() {
  return (
    <>
      {/* Scanlines - visible horizontal lines */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
        }}
        aria-hidden="true"
      />

      {/* Horizontal scan line that moves down the screen */}
      <div
        className="pointer-events-none fixed left-0 right-0 h-[3px] z-50"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, rgba(0, 255, 65, 0.15) 20%, rgba(0, 255, 65, 0.3) 50%, rgba(0, 255, 65, 0.15) 80%, transparent 95%)',
          animation: 'scanMove 6s linear infinite',
          boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
        }}
        aria-hidden="true"
      />

      {/* Vignette - subtle darkening at edges only */}
      {/* <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          boxShadow: 'inset 0 0 150px 60px rgba(0, 0, 0, 0.5)',
        }}
        aria-hidden="true"
      /> */}

      {/* Screen flicker overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-30"
        style={{
          animation: 'flicker 4s infinite',
          background: 'transparent',
        }}
        aria-hidden="true"
      />

      {/* Green glow behind everything */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 255, 65, 0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* CSS animations */}
      <style jsx global>{`
        @keyframes scanMove {
          0% {
            top: -10px;
          }
          100% {
            top: 100vh;
          }
        }

        @keyframes flicker {
          0%, 100% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          93% {
            opacity: 0.9;
          }
          94% {
            opacity: 1;
          }
          97% {
            opacity: 0.95;
          }
          98% {
            opacity: 1;
          }
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
            filter: hue-rotate(0deg);
          }
          10% {
            transform: translate(-2px, 2px);
            filter: hue-rotate(90deg);
          }
          20% {
            transform: translate(2px, -2px);
            filter: hue-rotate(180deg);
          }
          30% {
            transform: translate(-2px, 0);
            filter: hue-rotate(270deg);
          }
          40% {
            transform: translate(2px, 0);
            filter: hue-rotate(0deg);
          }
          50% {
            transform: translate(0, 2px);
          }
          60% {
            transform: translate(0, -2px);
          }
          70% {
            transform: translate(-2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          90% {
            transform: translate(-2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }
      `}</style>
    </>
  );
}

/**
 * Glitch effect overlay (triggered on demand)
 */
export function GlitchEffect({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-100"
      style={{
        background: 'repeating-linear-gradient(90deg, rgba(255, 0, 0, 0.15) 0px, rgba(0, 255, 0, 0.15) 1px, rgba(0, 0, 255, 0.15) 2px)',
        mixBlendMode: 'screen',
        animation: 'glitch 0.15s infinite',
      }}
      aria-hidden="true"
    />
  );
}
