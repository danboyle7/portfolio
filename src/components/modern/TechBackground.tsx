"use client";

import { useEffect, useRef } from "react";

// Grid cell size in px — the CSS grid layer and the canvas pulses share this
// so the data pulses travel exactly along the visible grid lines.
const GRID = 44;
const HEAD_ALPHA = 0.55;

const PULSE_COLORS = [
  "56, 189, 248", // sky-400
  "34, 211, 238", // cyan-400
  "96, 165, 250", // blue-400
  "129, 140, 248", // indigo-400
];

interface Point {
  x: number;
  y: number;
}

interface Pulse {
  head: Point;
  dir: Point;
  speed: number;
  trail: number;
  maxTrail: number;
  color: string;
  points: Point[];
  distToNode: number;
  ttl: number;
  dying: boolean;
}

interface Marker {
  x: number;
  y: number;
  phase: number;
}

function spawnPulse(width: number, height: number): Pulse {
  const cols = Math.max(3, Math.floor(width / GRID));
  const rows = Math.max(3, Math.floor(height / GRID));
  const x = (1 + Math.floor(Math.random() * (cols - 1))) * GRID;
  const y = (1 + Math.floor(Math.random() * (rows - 1))) * GRID;
  const dirs: Point[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ];
  const dir = dirs[Math.floor(Math.random() * dirs.length)] ?? { x: 1, y: 0 };
  const trail = 90 + Math.random() * 140;
  return {
    head: { x, y },
    dir,
    speed: 45 + Math.random() * 75,
    trail,
    maxTrail: trail,
    color:
      PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)] ??
      "56, 189, 248",
    points: [{ x, y }],
    distToNode: GRID,
    ttl: 6 + Math.random() * 10,
    dying: false,
  };
}

function advancePulse(pulse: Pulse, dist: number): void {
  let remaining = dist;
  while (remaining > 0) {
    const step = Math.min(remaining, pulse.distToNode);
    pulse.head.x += pulse.dir.x * step;
    pulse.head.y += pulse.dir.y * step;
    pulse.distToNode -= step;
    remaining -= step;
    if (pulse.distToNode <= 0.001) {
      // Snap to the intersection to avoid float drift off the grid lines
      pulse.head.x = Math.round(pulse.head.x);
      pulse.head.y = Math.round(pulse.head.y);
      pulse.distToNode = GRID;
      if (Math.random() < 0.45) {
        pulse.points.push({ x: pulse.head.x, y: pulse.head.y });
        pulse.dir =
          pulse.dir.x !== 0
            ? { x: 0, y: Math.random() < 0.5 ? 1 : -1 }
            : { x: Math.random() < 0.5 ? 1 : -1, y: 0 };
      }
    }
  }
}

function trimTrail(pulse: Pulse): void {
  let acc = 0;
  let prev = pulse.head;
  for (let i = pulse.points.length - 1; i >= 0; i--) {
    const pt = pulse.points[i];
    if (!pt) break;
    acc += Math.abs(pt.x - prev.x) + Math.abs(pt.y - prev.y);
    if (acc >= pulse.maxTrail) {
      if (i > 0) pulse.points.splice(0, i);
      break;
    }
    prev = pt;
  }
}

function drawPulse(ctx: CanvasRenderingContext2D, pulse: Pulse): void {
  let budget = pulse.trail;
  let distSoFar = 0;
  let prev = pulse.head;
  ctx.lineWidth = 1;

  for (let i = pulse.points.length - 1; i >= 0 && budget > 0; i--) {
    const pt = pulse.points[i];
    if (!pt) break;
    const segLen = Math.abs(pt.x - prev.x) + Math.abs(pt.y - prev.y);
    if (segLen === 0) {
      prev = pt;
      continue;
    }
    const drawLen = Math.min(segLen, budget);
    const ux = Math.sign(pt.x - prev.x);
    const uy = Math.sign(pt.y - prev.y);
    const ex = prev.x + ux * drawLen;
    const ey = prev.y + uy * drawLen;
    const aNear = Math.max(0, HEAD_ALPHA * (1 - distSoFar / pulse.trail));
    const aFar = Math.max(
      0,
      HEAD_ALPHA * (1 - (distSoFar + drawLen) / pulse.trail),
    );
    const grad = ctx.createLinearGradient(prev.x, prev.y, ex, ey);
    grad.addColorStop(0, `rgba(${pulse.color}, ${aNear.toFixed(3)})`);
    grad.addColorStop(1, `rgba(${pulse.color}, ${aFar.toFixed(3)})`);
    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    budget -= drawLen;
    distSoFar += drawLen;
    prev = pt;
  }

  // Glowing head
  ctx.save();
  ctx.shadowColor = `rgba(${pulse.color}, 0.9)`;
  ctx.shadowBlur = 10;
  ctx.fillStyle = `rgba(${pulse.color}, 0.95)`;
  ctx.beginPath();
  ctx.arc(pulse.head.x, pulse.head.y, 1.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Deterministic per-cell hash so markers stay put across resizes —
// the container animates its width on the splash page, and random
// regeneration would make the whole field visibly reshuffle.
function markerHash(cx: number, cy: number): number {
  const s = Math.sin(cx * 127.1 + cy * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function buildMarkers(width: number, height: number): Marker[] {
  const markers: Marker[] = [];
  const cols = Math.floor(width / GRID);
  const rows = Math.floor(height / GRID);
  for (let cx = 1; cx < cols; cx++) {
    for (let cy = 1; cy < rows; cy++) {
      const hash = markerHash(cx, cy);
      if (hash < 0.055) {
        markers.push({
          x: cx * GRID,
          y: cy * GRID,
          phase: (hash / 0.055) * Math.PI * 2,
        });
      }
    }
  }
  return markers;
}

function drawMarkers(
  ctx: CanvasRenderingContext2D,
  markers: Marker[],
  time: number,
): void {
  ctx.lineWidth = 1;
  for (const marker of markers) {
    const alpha =
      0.06 + 0.06 * (0.5 + 0.5 * Math.sin(time * 0.0012 + marker.phase));
    ctx.strokeStyle = `rgba(148, 163, 184, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(marker.x - 4, marker.y);
    ctx.lineTo(marker.x + 4, marker.y);
    ctx.moveTo(marker.x, marker.y - 4);
    ctx.lineTo(marker.x, marker.y + 4);
    ctx.stroke();
  }
}

const GRID_MASK =
  "radial-gradient(ellipse 110% 90% at 50% 15%, black 25%, transparent 78%)";

const NOISE_TEXTURE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

interface TechBackgroundProps {
  /** "fixed" fills the viewport (default); "absolute" fills the nearest positioned ancestor */
  position?: "fixed" | "absolute";
  /** Fade the grid/pulses out toward the edges (default true) */
  fade?: boolean;
}

export function TechBackground({
  position = "fixed",
  fade = true,
}: TechBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let targetCount = 0;
    let lastTime = 0;
    const pulses: Pulse[] = [];
    let markers: Marker[] = [];
    let raf = 0;

    const drawScene = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      drawMarkers(ctx, markers, now);
      for (const pulse of pulses) drawPulse(ctx, pulse);
    };

    const resize = () => {
      width = wrapper.clientWidth;
      height = wrapper.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      markers = buildMarkers(width, height);

      targetCount = reducedMotion
        ? 0
        : Math.min(20, Math.max(8, Math.round((width * height) / 90000)));
      // Only top up here; excess pulses retire gracefully in the loop.
      while (pulses.length < targetCount)
        pulses.push(spawnPulse(width, height));

      // Redraw synchronously — reallocating the backing store blanks the
      // canvas, and waiting for the next rAF makes pulses flicker while the
      // container animates its size.
      drawScene(lastTime);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapper);

    // Mouse-reactive glow (skipped for touch-only / reduced motion)
    const onPointerMove = (e: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      wrapper.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      wrapper.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    if (!reducedMotion) {
      window.addEventListener("pointermove", onPointerMove);
    }

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      lastTime = now;

      let dyingCount = 0;
      for (const pulse of pulses) {
        if (pulse.dying) dyingCount++;
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        if (!pulse) continue;

        if (pulse.dying) {
          // Retract the trail instead of vanishing abruptly
          pulse.trail -= 180 * dt;
          if (pulse.trail <= 0) {
            if (pulses.length > targetCount) {
              pulses.splice(i, 1);
            } else {
              pulses[i] = spawnPulse(width, height);
            }
            continue;
          }
        } else {
          pulse.ttl -= dt;
          if (pulse.ttl <= 0) {
            pulse.dying = true;
          } else if (pulses.length - dyingCount > targetCount) {
            // Retire only the excess after the container shrank
            pulse.dying = true;
            dyingCount++;
          }
          advancePulse(pulse, pulse.speed * dt);
          trimTrail(pulse);
        }

        const margin = pulse.maxTrail + GRID;
        if (
          pulse.head.x < -margin ||
          pulse.head.x > width + margin ||
          pulse.head.y < -margin ||
          pulse.head.y > height + margin
        ) {
          if (pulses.length > targetCount) {
            pulses.splice(i, 1);
          } else {
            pulses[i] = spawnPulse(width, height);
          }
        }
      }

      drawScene(now);
      raf = requestAnimationFrame(loop);
    };

    if (!reducedMotion) {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className={`pointer-events-none ${position} inset-0 overflow-hidden bg-[#020617]`}
    >
      {/* Aurora glow along the top edge */}
      <div className="absolute -top-44 left-1/2 h-[520px] w-[1100px] max-w-none -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(59,130,246,0.18),rgba(34,211,238,0.06)_55%,transparent)] blur-2xl" />

      {/* Soft side accents for depth */}
      <div className="absolute top-1/3 -left-48 h-[460px] w-[460px] rounded-full bg-cyan-500/[0.05] blur-[110px]" />
      <div className="absolute -right-48 bottom-1/4 h-[460px] w-[460px] rounded-full bg-indigo-500/[0.07] blur-[110px]" />

      {/* Blueprint grid — same cell size as the canvas pulses */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(148,163,184,0.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148,163,184,0.055) 1px, transparent 1px)`,
          backgroundSize: `${GRID}px ${GRID}px`,
          ...(fade && { maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }),
        }}
      />

      {/* Circuit pulses */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={
          fade ? { maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK } : undefined
        }
      />

      {/* Mouse-reactive glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(560px circle at var(--mx, 50%) var(--my, 30%), rgba(56,189,248,0.07), transparent 70%)",
        }}
      />

      {/* Film grain to kill gradient banding */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: NOISE_TEXTURE }}
      />

      {/* Vignette to focus content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(2,6,23,0.7))]" />
    </div>
  );
}
