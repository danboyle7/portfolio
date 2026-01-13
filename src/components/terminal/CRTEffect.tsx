'use client';

import React from 'react';

/**
 * CRT screen effects - scanlines, vignette, and subtle flicker
 * Uses absolute positioning to be contained within parent element
 */
export function CRTEffect() {
  return (
    <>
      {/* Scanlines - visible horizontal lines */}
      <div
        className="pointer-events-none absolute inset-0 z-50"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.25) 50%)',
          backgroundSize: '100% 4px',
        }}
        aria-hidden="true"
      />

      {/* Horizontal scan line that moves down the screen */}
      <div
        className="pointer-events-none absolute left-0 right-0 h-[3px] z-50 crt-scanline"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, rgba(0, 255, 65, 0.15) 20%, rgba(0, 255, 65, 0.3) 50%, rgba(0, 255, 65, 0.15) 80%, transparent 95%)',
          boxShadow: '0 0 10px rgba(0, 255, 65, 0.5)',
        }}
        aria-hidden="true"
      />

      {/* Vignette - subtle darkening at edges only */}
      {/* TODO: Make this better  */}
      {/* <div
        className="pointer-events-none absolute inset-0 z-40"
        style={{
          boxShadow: 'inset 0 0 150px 60px rgba(0, 0, 0, 0.5)',
        }}
        aria-hidden="true"
      /> */}

      {/* Screen flicker overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-30 crt-flicker"
        style={{
          background: 'transparent',
        }}
        aria-hidden="true"
      />

      {/* Green glow behind everything */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 255, 65, 0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
    </>
  );
}

/**
 * Glitch effect overlay (triggered on demand)
 * Uses absolute positioning to be contained within parent element
 */
export function GlitchEffect({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-100 crt-glitch"
      style={{
        background: 'repeating-linear-gradient(90deg, rgba(255, 0, 0, 0.15) 0px, rgba(0, 255, 0, 0.15) 1px, rgba(0, 0, 255, 0.15) 2px)',
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
}
