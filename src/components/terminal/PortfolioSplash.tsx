"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { LayoutDashboard } from "lucide-react";
import { TechBackground } from "@/components/modern/TechBackground";

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
    // Use requestAnimationFrame to batch state update and avoid React Compiler warning
    const frame = requestAnimationFrame(() => {
      const initialStreams: MatrixStream[] = [];
      const numStreams = 60; // Denser rain

      for (let i = 0; i < numStreams; i++) {
        const stream = createStream();
        // Stagger initial positions so rain is already falling when page loads
        stream.y = Math.random() * 70; // Spread across the screen
        initialStreams.push(stream);
      }
      setStreams(initialStreams);
    });
    return () => cancelAnimationFrame(frame);
  }, [createStream]);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams((prevStreams) => {
        return prevStreams.map((stream) => {
          const newY = stream.y + stream.speed;
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
    <div className="fixed inset-0 flex flex-col sm:flex-row">
      {/* Header with name - always visible */}
      <div className="absolute top-0 right-0 left-0 z-40 flex justify-center pt-4 sm:pt-10">
        <div className="text-center">
          <h1 className="mb-1 text-xl font-light tracking-widest text-white/90 sm:text-3xl md:text-4xl">
            DANIEL BOYLE
          </h1>
          <div className="text-[10px] tracking-wider text-white/50 sm:text-sm">
            Software Developer
          </div>
        </div>
      </div>

      {/* Top/Left side - Terminal Portfolio */}
      <button
        className={`group relative cursor-pointer overflow-hidden transition-all duration-500 ${
          hoveredSide === "left"
            ? "h-[55%] w-full sm:h-full sm:w-[55%]"
            : hoveredSide === "right"
              ? "h-[45%] w-full sm:h-full sm:w-[45%]"
              : "h-1/2 w-full sm:h-full sm:w-1/2"
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
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 pt-16 sm:p-8 sm:pt-24">
          {/* ASCII Art Header - hidden on mobile */}
          <pre className="mb-4 hidden font-mono text-[8px] leading-tight text-green-500 transition-colors select-none group-hover:text-green-400 sm:mb-6 sm:block sm:text-[10px] md:text-xs">
            {`
 ████████╗███████╗██████╗ ███╗   ███╗
 ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
    ██║   █████╗  ██████╔╝██╔████╔██║
    ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║
    ██║   ███████╗██║  ██║██║ ╚═╝ ██║
    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
`}
          </pre>

          <div className="space-y-2 text-center font-mono text-green-500 sm:space-y-3">
            <div className="text-base font-bold tracking-wider transition-colors group-hover:text-green-400 sm:text-xl md:text-2xl">
              TERMINAL PORTFOLIO
            </div>
            <div className="max-w-xs text-[10px] text-green-700 sm:text-sm">
              Interactive command-line portfolio with retro aesthetics
            </div>
          </div>

          {/* Terminal prompt preview */}
          <div className="mt-4 font-mono text-xs sm:mt-8 sm:text-sm">
            <span className="text-green-700">guest@portfolio</span>
            <span className="text-gray-600">:</span>
            <span className="text-blue-500">~</span>
            <span className="text-gray-600">$ </span>
            <span className="text-green-500 opacity-70 group-hover:opacity-100">
              enter
            </span>
            <span className="animate-pulse text-green-500">_</span>
          </div>

          {/* Features list - hidden on mobile */}
          <div className="mt-4 hidden space-y-1 text-left font-mono text-[10px] text-green-800 sm:mt-6 sm:block sm:text-xs">
            <div>• Full terminal emulation</div>
            <div>• Hidden content & easter eggs</div>
            <div>• CRT effects & visual aesthetics</div>
            <div>• Interactive commands</div>
          </div>

          {/* Hover/tap instruction */}
          <div
            className={`mt-4 font-mono text-xs text-green-500 transition-opacity duration-300 sm:mt-8 sm:text-sm ${
              hoveredSide === "left" ? "opacity-100" : "sm:opacity-0"
            }`}
          >
            [ TAP TO ENTER ]
          </div>
        </div>

        {/* Border glow on hover - horizontal on mobile, vertical on desktop */}
        <div
          className={`absolute inset-x-0 bottom-0 h-[2px] bg-linear-to-r from-green-500/0 via-green-500 to-green-500/0 transition-opacity duration-500 sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:h-auto sm:w-[2px] sm:bg-linear-to-b ${
            hoveredSide === "left" ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>

      {/* Bottom/Right side - Modern Portfolio */}
      <button
        className={`group relative cursor-pointer overflow-hidden transition-all duration-500 ${
          hoveredSide === "right"
            ? "h-[55%] w-full sm:h-full sm:w-[55%]"
            : hoveredSide === "left"
              ? "h-[45%] w-full sm:h-full sm:w-[45%]"
              : "h-1/2 w-full sm:h-full sm:w-1/2"
        }`}
        onMouseEnter={() => setHoveredSide("right")}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={onSelectModern}
      >
        {/* Same circuit background as the modern portfolio */}
        <div className="absolute inset-0 opacity-80 transition-opacity duration-500 group-hover:opacity-100">
          <TechBackground position="absolute" fade={false} />
        </div>

        {/* Content - using modern portfolio font */}
        <div
          className="modern-portfolio relative z-10 flex h-full flex-col items-center justify-center bg-transparent p-4 sm:p-8 sm:pt-24"
          style={{
            fontFamily:
              "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {/* Minimal layout icon */}
          <LayoutDashboard
            strokeWidth={1}
            className="mb-4 h-10 w-10 text-slate-300 transition-colors duration-300 group-hover:text-white sm:mb-10 sm:h-24 sm:w-24"
          />

          <div className="space-y-2 text-center sm:space-y-4">
            <h2 className="text-xl font-bold tracking-tight sm:text-3xl md:text-5xl lg:text-6xl">
              <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Modern Portfolio
              </span>
            </h2>
            <p className="max-w-xs text-[10px] text-slate-400 sm:max-w-md sm:text-base">
              Clean, modern design with smooth animations and easy navigation
            </p>
          </div>

          {/* Features pills - hidden on mobile */}
          <div className="mt-4 hidden max-w-md flex-wrap justify-center gap-2.5 sm:mt-10 sm:flex">
            {[
              "Clean Design",
              "Smooth Animations",
              "Easy Navigation",
              "Fast Loading",
            ].map((feature) => (
              <span
                key={feature}
                className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/40 px-3.5 py-1.5 text-[10px] text-slate-400 backdrop-blur-sm transition-colors duration-300 group-hover:border-cyan-400/30 group-hover:text-slate-300 sm:text-sm"
              >
                <span className="h-1 w-1 rounded-full bg-cyan-400/70" />
                {feature}
              </span>
            ))}
          </div>

          {/* Hover/tap instruction */}
          <div
            className={`mt-4 text-xs font-medium text-cyan-300 transition-opacity duration-300 sm:mt-10 sm:text-base ${
              hoveredSide === "right" ? "opacity-100" : "sm:opacity-0"
            }`}
          >
            Tap to enter →
          </div>
        </div>

        {/* Border glow on hover - horizontal on mobile, vertical on desktop */}
        <div
          className={`absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-cyan-400/0 via-cyan-400/70 to-cyan-400/0 transition-opacity duration-500 sm:inset-x-auto sm:inset-y-0 sm:left-0 sm:h-auto sm:w-[2px] sm:bg-linear-to-b ${
            hoveredSide === "right" ? "opacity-100" : "opacity-0"
          }`}
        />
      </button>

      {/* Bottom instruction - hidden on mobile */}
      <div className="absolute right-0 bottom-6 left-0 z-40 hidden justify-center sm:flex">
        <div className="text-xs tracking-wider text-white/50">
          Choose your experience
        </div>
      </div>
    </div>
  );
}
