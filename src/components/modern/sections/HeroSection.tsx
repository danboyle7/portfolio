"use client";

import { useEffect, useState } from "react";
import type { About, ContactInfo } from "@/lib/terminal/types";

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
  const [isVisible, setIsVisible] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        {/* Status badge */}
        <div
          className={`transition-all duration-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            <span className="text-xs font-medium tracking-wide text-blue-300">
              {contact.availability}
            </span>
          </div>
        </div>

        {/* Name */}
        <h1
          className={`mb-3 text-4xl font-bold transition-all delay-100 duration-500 sm:mb-4 sm:text-5xl md:text-6xl lg:text-7xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {about.name}
          </span>
        </h1>

        {/* Title */}
        <h2
          className={`mb-5 text-lg text-slate-400 transition-all delay-150 duration-500 sm:mb-6 sm:text-xl md:text-2xl ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          {about.title}
        </h2>

        {/* Tagline with typing effect */}
        <p
          className={`mx-auto mb-8 min-h-6 max-w-xl text-sm text-slate-500 transition-all delay-200 duration-500 sm:mb-10 sm:text-base ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <span className="text-slate-400">
            {about.tagline.slice(0, titleIndex)}
          </span>
          <span className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 animate-pulse bg-blue-400 align-text-bottom" />
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col items-center justify-center gap-3 transition-all delay-300 duration-500 sm:flex-row ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <button
            onClick={onScrollDown}
            className="group rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/25"
          >
            View My Work
            <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>

          <a
            href={about.resumeUrl ?? "#"}
            className="rounded-lg border border-slate-700 px-6 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:border-slate-600 hover:text-white"
          >
            Download Resume
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onScrollDown}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer transition-all delay-700 duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        aria-label="Scroll down"
      >
        <div className="flex flex-col items-center gap-2 text-slate-500 transition-colors hover:text-blue-400">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
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
