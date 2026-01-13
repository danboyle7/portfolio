'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PortfolioSplashProps {
  onSelectTerminal: () => void;
  onSelectModern: () => void;
}

// Toggle this to enable/disable character mutation (characters randomly change while in place)
const ENABLE_CHARACTER_MUTATION = true;
const MUTATION_CHANCE = 0.02; // 2% chance per frame for a character to change

// Matrix characters - mix of katakana, latin, numbers, symbols
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}|~^+=';

interface MatrixStream {
  x: number;
  y: number; // Current head position
  speed: number;
  length: number; // Trail length
  chars: string[];
  maxY: number; // Where this stream stops
  opacity: number;
}

const getRandomChar = () => MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]!;

export function PortfolioSplash({ onSelectTerminal, onSelectModern }: PortfolioSplashProps) {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);
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
      setStreams(prevStreams => {
        return prevStreams.map(stream => {
          let newY = stream.y + stream.speed;
          let newChars = stream.chars;

          // Mutate characters randomly if enabled
          if (ENABLE_CHARACTER_MUTATION) {
            newChars = stream.chars.map(char =>
              Math.random() < MUTATION_CHANCE ? getRandomChar() : char
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
          color = '#ffffff';
          textShadow = '0 0 10px #fff, 0 0 20px #00ff00, 0 0 30px #00ff00';
        } else if (distanceFromHead === 1) {
          color = '#ccffcc';
          textShadow = '0 0 8px #00ff00';
        } else if (distanceFromHead < 4) {
          color = '#00ff41';
          textShadow = '0 0 5px #00ff00';
        } else if (distanceFromHead < 8) {
          color = '#00cc33';
          textShadow = 'none';
        } else if (distanceFromHead < 12) {
          color = '#009922';
          textShadow = 'none';
        } else {
          color = '#005511';
          textShadow = 'none';
        }

        cells.push(
          <div
            key={i}
            className="absolute font-mono text-xs"
            style={{
              top: `${rowPosition * 2}%`,
              color,
              textShadow,
              opacity: stream.opacity * Math.max(0.3, 1 - distanceFromHead / stream.length * 0.7),
            }}
          >
            {char}
          </div>
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
      <div className="absolute top-0 left-0 right-0 z-40 flex justify-center pt-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-widest text-white/90 mb-1">
            DANIEL BOYLE
          </h1>
          <div className="text-xs sm:text-sm text-white/50 tracking-wider">
            Software Developer
          </div>
        </div>
      </div>

      {/* Left side - Terminal Portfolio */}
      <button
        className={`relative h-full overflow-hidden transition-all duration-500 cursor-pointer group ${
          hoveredSide === 'left' ? 'w-[55%]' : hoveredSide === 'right' ? 'w-[45%]' : 'w-1/2'
        }`}
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={onSelectTerminal}
      >
        {/* Terminal background */}
        <div className="absolute inset-0 bg-black">
          {/* Matrix rain effect - proper matrix style where chars stay in place */}
          <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden group-hover:opacity-100 opacity-70 transition-opacity duration-500"
          >
            {streams.map((stream, i) => (
              <React.Fragment key={`${i}-${stream.x}`}>
                {renderStream(stream)}
              </React.Fragment>
            ))}
          </div>

          {/* CRT scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 pt-24">
          {/* ASCII Art Header */}
          <pre className="text-green-500 font-mono text-[8px] sm:text-[10px] md:text-xs leading-tight mb-6 group-hover:text-green-400 transition-colors select-none">
{`
 ████████╗███████╗██████╗ ███╗   ███╗
 ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║
    ██║   █████╗  ██████╔╝██╔████╔██║
    ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║
    ██║   ███████╗██║  ██║██║ ╚═╝ ██║
    ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝
`}
          </pre>

          <div className="text-green-500 font-mono text-center space-y-3">
            <div className="text-lg sm:text-xl md:text-2xl font-bold tracking-wider group-hover:text-green-400 transition-colors">
              TERMINAL PORTFOLIO
            </div>
            <div className="text-green-700 text-xs sm:text-sm max-w-xs">
              Interactive command-line experience with retro aesthetics
            </div>
          </div>

          {/* Terminal prompt preview */}
          <div className="mt-8 font-mono text-sm">
            <span className="text-green-700">guest@portfolio</span>
            <span className="text-gray-600">:</span>
            <span className="text-blue-500">~</span>
            <span className="text-gray-600">$ </span>
            <span className="text-green-500 group-hover:opacity-100 opacity-70">enter</span>
            <span className="text-green-500 animate-pulse">_</span>
          </div>

          {/* Features list */}
          <div className="mt-6 text-green-800 text-[10px] sm:text-xs font-mono space-y-1 text-left">
            <div>• Full terminal emulation</div>
            <div>• Hidden easter eggs</div>
            <div>• CRT effects & matrix rain</div>
            <div>• Interactive commands</div>
          </div>

          {/* Hover instruction */}
          <div className={`mt-8 text-green-500 font-mono text-sm transition-opacity duration-300 ${
            hoveredSide === 'left' ? 'opacity-100' : 'opacity-0'
          }`}>
            [ CLICK TO ENTER ]
          </div>
        </div>

        {/* Border glow on hover - this is the only divider now */}
        <div className={`absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-green-500/0 via-green-500 to-green-500/0 transition-opacity duration-500 ${
          hoveredSide === 'left' ? 'opacity-100' : 'opacity-0'
        }`} />
      </button>

      {/* Right side - Modern Portfolio */}
      <button
        className={`relative h-full overflow-hidden transition-all duration-500 cursor-pointer group ${
          hoveredSide === 'right' ? 'w-[55%]' : hoveredSide === 'left' ? 'w-[45%]' : 'w-1/2'
        }`}
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
        onClick={onSelectModern}
      >
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors duration-700" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors duration-700" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition-colors duration-700" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 pt-24">
          {/* Modern icon/logo */}
          <div className="mb-6 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-white/20 rounded-2xl flex items-center justify-center group-hover:border-white/40 transition-colors duration-300 group-hover:scale-105 transform">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white/70 group-hover:text-white transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 bg-white/5 rounded-2xl blur-xl group-hover:bg-white/10 transition-colors duration-500" />
          </div>

          <div className="text-center space-y-3">
            <div className="text-white/90 text-lg sm:text-xl md:text-2xl font-light tracking-wide group-hover:text-white transition-colors">
              Modern Portfolio
            </div>
            <div className="text-white/40 text-xs sm:text-sm max-w-xs font-light">
              Clean, minimal design for easy navigation and quick overview
            </div>
          </div>

          {/* Features pills */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center max-w-xs">
            {['Clean Design', 'Fast Loading', 'Easy Navigation', 'Mobile First'].map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 text-[10px] sm:text-xs text-white/50 border border-white/10 rounded-full group-hover:border-white/20 group-hover:text-white/70 transition-colors duration-300"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Hover instruction */}
          <div className={`mt-8 text-white/70 text-sm font-light transition-opacity duration-300 ${
            hoveredSide === 'right' ? 'opacity-100' : 'opacity-0'
          }`}>
            Click to enter →
          </div>
        </div>

        {/* Border glow on hover - this is the only divider now */}
        <div className={`absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-white/0 via-white/70 to-white/0 transition-opacity duration-500 ${
          hoveredSide === 'right' ? 'opacity-100' : 'opacity-0'
        }`} />
      </button>

      {/* Bottom instruction */}
      <div className="absolute bottom-6 left-0 right-0 z-40 flex justify-center">
        <div className="text-white/30 text-xs tracking-wider">
          Choose your experience
        </div>
      </div>
    </div>
  );
}

