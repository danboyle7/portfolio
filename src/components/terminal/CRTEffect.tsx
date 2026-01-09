'use client';

import React from 'react';

/**
 * CRT screen effects - scanlines, vignette, and subtle flicker
 */
export function CRTEffect() {
  return (
    <>
      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.03) 2px, rgba(0, 255, 65, 0.03) 4px)',
        }}
        aria-hidden="true"
      />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.5) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Subtle screen glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0, 255, 65, 0.1) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
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
      className="pointer-events-none fixed inset-0 z-[100] animate-glitch"
      style={{
        background: 'repeating-linear-gradient(90deg, rgba(255, 0, 0, 0.1) 0px, rgba(0, 255, 0, 0.1) 1px, rgba(0, 0, 255, 0.1) 2px)',
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
}

