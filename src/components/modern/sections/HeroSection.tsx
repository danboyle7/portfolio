"use client";

import { useEffect, useState } from "react";
import type { About, ContactInfo } from "@/lib/terminal/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeroSectionProps {
  about: About;
  contact: ContactInfo;
  onScrollDown: () => void;
}

export function HeroSection({
  about,
  contact,
  onScrollDown,
}: HeroSectionProps) {
  const [titleIndex, setTitleIndex] = useState(0);

  // Typing animation for tagline
  useEffect(() => {
    if (titleIndex < about.tagline.length) {
      const timeout = setTimeout(() => {
        setTitleIndex(titleIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [titleIndex, about.tagline.length]);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Focused glow behind the name */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[760px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-blue-500/10 blur-[110px]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:max-w-5xl">
        {/* Status badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/20 bg-cyan-500/[0.07] px-4 py-2 shadow-[0_0_20px_-6px_rgba(34,211,238,0.4)] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
            </span>
            <span className="font-mono text-xs font-medium tracking-wider text-cyan-300 sm:text-sm">
              {contact.availability}
            </span>
          </div>
        </div>

        {/* Name */}
        <h1 className="mb-4 text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
          <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {about.name}
          </span>
        </h1>

        {/* Title flanked by rule lines */}
        <div className="mb-6 flex items-center justify-center gap-4">
          <span className="hidden h-px w-16 bg-linear-to-r from-transparent to-slate-600 sm:block" />
          <h2 className="text-xl text-slate-300 sm:text-2xl md:text-3xl lg:text-4xl">
            {about.title}
          </h2>
          <span className="hidden h-px w-16 bg-linear-to-l from-transparent to-slate-600 sm:block" />
        </div>

        {/* Tagline with terminal-style typing effect */}
        <p className="mx-auto mb-10 min-h-8 max-w-2xl font-mono text-sm sm:text-base md:text-lg">
          <span className="text-cyan-500/70">~ $&nbsp;</span>
          <span className="text-slate-400">
            {about.tagline.slice(0, titleIndex)}
          </span>
          <span className="animate-cursor-blink ml-1 inline-block h-4 w-2 bg-cyan-400/80 align-middle md:h-5" />
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button onClick={onScrollDown} size="lg" className="group">
            View My Work
            <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Button>

          {/* Split button for resume */}
          <div className="flex">
            {/* Main button - opens condensed by default */}
            <Button
              variant="outline"
              size="lg"
              className="rounded-r-none border-r-0"
              asChild
            >
              <a
                href="/resume/dboyle-resume-condensed.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            </Button>
            {/* Dropdown toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-l-none border-l-slate-700 px-2"
                  aria-label="More resume options"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a
                    href="/resume/dboyle-resume-condensed.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    One-page
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href="/resume/dboyle-resume-full.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Full
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
        aria-label="Scroll down"
      >
        <div className="flex flex-col items-center gap-2 text-slate-500 transition-colors hover:text-cyan-400">
          <span className="font-mono text-xs tracking-widest uppercase">
            Scroll
          </span>
          <svg
            className="h-5 w-5 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </button>
    </section>
  );
}
