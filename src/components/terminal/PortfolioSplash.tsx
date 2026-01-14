"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface PortfolioSplashProps {
  onSelectTerminal: () => void;
  onSelectModern: () => void;
}

// Toggle this to enable/disable character mutation (characters randomly change while in place)
const ENABLE_CHARACTER_MUTATION = true;
const MUTATION_CHANCE = 0.02; // 2% chance per frame for a character to change

// Matrix characters - mix of katakana, latin, numbers, symbols
const MATRIX_CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}|~^+=";

interface MatrixStream {
  x: number;
  y: number; // Current head position
  speed: number;
  length: number; // Trail length
  chars: string[];
  maxY: number; // Where this stream stops
  opacity: number;
}

const getRandomChar = () =>
  MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]!;

export function PortfolioSplash({
  onSelectTerminal,
  onSelectModern,
}: PortfolioSplashProps) {
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const [streams, setStreams] = useState<MatrixStream[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize streams
  const createStream = useCallback((x?: number): MatrixStream => {
    const length = Math.floor(Math.random() * 20) + 10; // Trail length 10-30 chars
    return {
      x: x ?? Math.random() * 100,
      y: 0, // Start at top
      speed: Math.random() * 1.2 + 0.4, // Varying speeds
      length,
      chars: Array.from({ length: length + 10 }, () => getRandomChar()),
      maxY: 55 + Math.floor(Math.random() * 10), // Go past the bottom (55-65)
      opacity: Math.random() * 0.4 + 0.6, // 0.6-1.0 opacity
    };
  }, []);

  // Initialize matrix
  useEffect(() => {
    const initialStreams: MatrixStream[] = [];
    const numStreams = 60; // Denser rain

    for (let i = 0; i < numStreams; i++) {
      const stream = createStream();
      // Stagger initial positions so rain is already falling when page loads
      stream.y = Math.random() * 70; // Spread across the screen
      initialStreams.push(stream);
    }
    setStreams(initialStreams);
  }, [createStream]);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams((prevStreams) => {
        return prevStreams.map((stream) => {
          let newY = stream.y + stream.speed;
          let newChars = stream.chars;

          // Mutate characters randomly if enabled
          if (ENABLE_CHARACTER_MUTATION) {
            newChars = stream.chars.map((char) =>
              Math.random() < MUTATION_CHANCE ? getRandomChar() : char,
            );
          }

          // Reset stream when the entire trail has gone off screen
          if (newY - stream.length > 60) {
            // Create new stream at similar x position with some variance
            const newStream = createStream();
            newStream.x = stream.x + (Math.random() - 0.5) * 8;
            // Keep x in bounds
            if (newStream.x < 0) newStream.x = Math.random() * 20;
            if (newStream.x > 100) newStream.x = 80 + Math.random() * 20;
            newStream.y = -newStream.length; // Start above screen
            return newStream;
          }

          return {
            ...stream,
            y: newY,
            chars: newChars,
          };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [createStream]);

  // Render a single stream
  const renderStream = (stream: MatrixStream) => {
    const cells: React.ReactNode[] = [];
    const headPosition = Math.floor(stream.y); // The head is at this row position

    // Render each character in the trail
    for (let i = 0; i < stream.length; i++) {
      const rowPosition = headPosition - i; // Head at bottom, trail goes up

      // Only render if visible on screen (0-50 range roughly maps to 0-100%)
      if (rowPosition >= 0 && rowPosition < 55) {
        const char = stream.chars[i % stream.chars.length];
        const distanceFromHead = i; // 0 = head (bottom), increases going up

        // Head (bottom) is brightest white, fades to darker green going UP
        let color: string;
        let textShadow: string;

        if (distanceFromHead === 0) {
          // The head - brightest white at the BOTTOM
          color = "#ffffff";
          textShadow = "0 0 10px #fff, 0 0 20px #00ff00, 0 0 30px #00ff00";
        } else if (distanceFromHead === 1) {
          color = "#ccffcc";
          textShadow = "0 0 8px #00ff00";
        } else if (distanceFromHead < 4) {
          color = "#00ff41";
          textShadow = "0 0 5px #00ff00";
        } else if (distanceFromHead < 8) {
          color = "#00cc33";
          textShadow = "none";
        } else if (distanceFromHead < 12) {
          color = "#009922";
          textShadow = "none";
        } else {
          color = "#005511";
          textShadow = "none";
        }

        cells.push(
          <div
            key={i}
            className="absolute font-mono text-xs"
            style={{
              top: `${rowPosition * 2}%`,
              color,
              textShadow,
              opacity:
                stream.opacity *
                Math.max(0.3, 1 - (distanceFromHead / stream.length) * 0.7),
            }}
          >
            {char}
          </div>,
        );
      }
    }

    return (
      <div
        key={stream.x}
        className="absolute top-0 h-full"
        style={{ left: `${stream.x}%` }}
      >
        {cells}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex">
      {/* Header with name - always visible */}
      <div className="absolute top-0 right-0 left-0 z-40 flex justify-center pt-6">
        <div className="text-center">
          <h1 className="mb-1 text-2xl font-light tracking-widest text-white/90 sm:text-3xl md:text-4xl">
            DANIEL BOYLE
          </h1>
          <div className="text-xs tracking-wider text-white/50 sm:text-sm">
            Software Developer
          </div>
        </div>
      </div>

      {/* Left side - Terminal Portfolio */}
      <button
        className={`group relative h-full cursor-pointer overflow-hidden transition-all duration-500 ${
          hoveredSide === "left"
            ? "w-[55%]"
            : hoveredSide === "right"
              ? "w-[45%]"
              : "w-1/2"
        }`}
        onMouseEnter={() => setHoveredSide("left")}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={onSelectTerminal}
      >
        {/* Terminal background */}
        <div className="absolute inset-0 bg-black">
          {/* Matrix rain effect - proper matrix style where chars stay in place */}
          <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden opacity-70 transition-opacity duration-500 group-hover:opacity-100"
          >
            {streams.map((stream, i) => (
              <React.Fragment key={`${i}-${stream.x}`}>
                {renderStream(stream)}
              </React.Fragment>
            ))}
          </div>

          {/* CRT scanlines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)",
            }}
          />

          {/* Vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 pt-24">
          {/* ASCII Art Header */}
          <pre className="mb-6 font-mono text-[8px] leading-tight text-green-500 transition-colors select-none group-hover:text-green-400 sm:text-[10px] md:text-xs">
            {`
 ████████╗███████╗██████╗ ███╗   ███╗
 ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
    ██║   █████╗  ██████╔╝██╔████╔██║
    ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║
    ██║   ███████╗██║  ██║██║ ╚═╝ ██║
    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
`}
          </pre>

          <div className="space-y-3 text-center font-mono text-green-500">
            <div className="text-lg font-bold tracking-wider transition-colors group-hover:text-green-400 sm:text-xl md:text-2xl">
              TERMINAL PORTFOLIO
            </div>
            <div className="max-w-xs text-xs text-green-700 sm:text-sm">
              Interactive command-line portfolio with retro aesthetics
            </div>
          </div>

          {/* Terminal prompt preview */}
          <div className="mt-8 font-mono text-sm">
            <span className="text-green-700">guest@portfolio</span>
            <span className="text-gray-600">:</span>
            <span className="text-blue-500">~</span>
            <span className="text-gray-600">$ </span>
            <span className="text-green-500 opacity-70 group-hover:opacity-100">
              enter
            </span>
            <span className="animate-pulse text-green-500">_</span>
          </div>

          {/* Features list */}
          <div className="mt-6 space-y-1 text-left font-mono text-[10px] text-green-800 sm:text-xs">
            <div>• Full terminal emulation</div>
            <div>• Hidden content & easter eggs</div>
            <div>• CRT effects & visual aesthetics</div>
            <div>• Interactive commands</div>
          </div>

          {/* Hover instruction */}
          <div
            className={`mt-8 font-mono text-sm text-green-500 transition-opacity duration-300 ${
              hoveredSide === "left" ? "opacity-100" : "opacity-0"
            }`}
          >
            [ CLICK TO ENTER ]
          </div>
        </div>

        {/* Border glow on hover - this is the only divider now */}
        <div
          className={`absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-green-500/0 via-green-500 to-green-500/0 transition-opacity duration-500 ${
            hoveredSide === "left" ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>

      {/* Right side - Modern Portfolio */}
      <button
        className={`group relative h-full cursor-pointer overflow-hidden transition-all duration-500 ${
          hoveredSide === "right"
            ? "w-[55%]"
            : hoveredSide === "left"
              ? "w-[45%]"
              : "w-1/2"
        }`}
        onMouseEnter={() => setHoveredSide("right")}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={onSelectModern}
      >
        {/* Modern gradient background - matches modern portfolio */}
        <div className="absolute inset-0 bg-slate-950">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02] transition-opacity duration-500 group-hover:opacity-[0.05]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Floating orbs - same colors as modern portfolio */}
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl transition-colors duration-700 group-hover:bg-blue-600/30" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-indigo-600/15 blur-3xl transition-colors duration-700 group-hover:bg-indigo-600/25" />
          <div className="absolute top-1/2 right-1/3 h-32 w-32 rounded-full bg-cyan-600/10 blur-2xl transition-colors duration-700 group-hover:bg-cyan-600/20" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-blue-950/20 via-transparent to-indigo-950/20" />
        </div>

        {/* Content - using modern portfolio font */}
        <div
          className="relative z-10 flex h-full flex-col items-center justify-center p-8 pt-24"
          style={{
            fontFamily:
              "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {/* Modern icon/logo */}
          <div className="relative mb-6">
            <div className="flex h-16 w-16 transform items-center justify-center rounded-2xl border-2 border-slate-700/50 bg-slate-900/50 transition-colors duration-300 group-hover:scale-105 group-hover:border-blue-500/40 sm:h-20 sm:w-20">
              <svg
                className="h-8 w-8 text-blue-400/70 transition-colors duration-300 group-hover:text-blue-400 sm:h-10 sm:w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                />
              </svg>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-2 rounded-2xl bg-blue-500/10 blur-xl transition-colors duration-500 group-hover:bg-blue-500/20" />
          </div>

          <div className="space-y-3 text-center">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
              <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text font-thin tracking-wide text-transparent">
                Modern Portfolio
              </span>
            </h2>
            <p className="max-w-xs text-xs text-slate-400 sm:text-sm">
              Clean, modern design with smooth animations and easy navigation
            </p>
          </div>

          {/* Features pills */}
          <div className="mt-8 flex max-w-xs flex-wrap justify-center gap-2">
            {[
              "Clean Design",
              "Fast Loading",
              "Easy Navigation",
              "Mobile First",
            ].map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-slate-700/50 px-3 py-1 text-[10px] text-slate-400 transition-colors duration-300 group-hover:border-blue-500/30 group-hover:text-slate-300 sm:text-xs"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Hover instruction */}
          <div
            className={`mt-8 text-sm font-medium text-blue-400 transition-opacity duration-300 ${
              hoveredSide === "right" ? "opacity-100" : "opacity-0"
            }`}
          >
            Click to enter →
          </div>
        </div>

        {/* Border glow on hover - this is the only divider now */}
        <div
          className={`absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-white/0 via-white/70 to-white/0 transition-opacity duration-500 ${
            hoveredSide === "right" ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>

      {/* Bottom instruction */}
      <div className="absolute right-0 bottom-6 left-0 z-40 flex justify-center">
        <div className="text-xs tracking-wider text-white/30">
          Choose your experience
        </div>
      </div>
    </div>
  );
}
