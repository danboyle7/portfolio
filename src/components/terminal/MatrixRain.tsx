'use client';

import React, { useEffect, useRef, useMemo } from 'react';

interface MatrixRainProps {
  opacity?: number;
  speed?: number;
  density?: number;
}

/**
 * Matrix-style digital rain background effect
 */
export function MatrixRain({ opacity = 0.05, speed = 1, density = 1 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const characters = useMemo(() => {
    // Mix of katakana, numbers, and symbols
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '@#$%^&*()_+-=[]{}|;:,.<>?';
    return (katakana + latin + numbers + symbols).split('');
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let drops: number[] = [];

    const resize = () => {
      // Use parent container size if available, otherwise fall back to window
      const parent = canvas.parentElement;
      const width = parent?.clientWidth ?? window.innerWidth;
      const height = parent?.clientHeight ?? window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize) * density;
      drops = Array(Math.floor(columns)).fill(1).map(() => Math.random() * -100);
    };

    resize();
    window.addEventListener('resize', resize);

    const fontSize = 14;

    const draw = () => {
      // Fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = `rgba(0, 255, 65, ${opacity * 3})`;
      ctx.font = `${fontSize}px "Fira Code", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = characters[Math.floor(Math.random() * characters.length)];
        const x = i * (fontSize / density);
        const y = drops[i]! * fontSize;

        // Brighter head of the column
        if (Math.random() > 0.98) {
          ctx.fillStyle = `rgba(180, 255, 180, ${opacity * 5})`;
        } else {
          ctx.fillStyle = `rgba(0, 255, 65, ${opacity * 3})`;
        }

        ctx.fillText(char!, x, y);

        // Reset when off screen
        if (y > canvas.height && Math.random() > 0.99) {
          drops[i] = 0;
        }

        drops[i] = drops[i]! + speed * 0.5;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [characters, opacity, speed, density]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}

/**
 * Static matrix background (CSS-based, lighter weight)
 */
export function MatrixBackground() {
  const columns = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      left: `${(i / 30) * 100}%`,
      chars: Array.from({ length: 50 }).map(() =>
        String.fromCharCode(0x30a0 + Math.random() * 96)
      ),
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.03]">
      {columns.map((col) => (
        <div
          key={col.id}
          className="absolute top-0 text-[10px] leading-3 text-green-500 whitespace-pre"
          style={{
            left: col.left,
            animation: `matrix-fall ${col.duration}s linear infinite`,
            animationDelay: `${col.delay}s`,
          }}
        >
          {col.chars.map((char, i) => (
            <div key={i} className="opacity-80">
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

