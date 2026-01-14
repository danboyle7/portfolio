'use client';

import { useEffect, useState } from 'react';
import type { About } from '@/lib/terminal/types';

interface HeroSectionProps {
  about: About;
  onScrollDown: () => void;
}

export function HeroSection({ about, onScrollDown }: HeroSectionProps) {
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
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Subtle animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Greeting */}
        <div
          className={`transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-blue-300 bg-blue-500/10 rounded-full border border-blue-500/20 mb-8 backdrop-blur-sm">
            Available for opportunities
          </span>
        </div>

        {/* Name */}
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {about.name}
          </span>
        </h1>

        {/* Title */}
        <h2
          className={`text-xl sm:text-2xl md:text-3xl font-light text-slate-400 mb-8 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {about.title}
        </h2>

        {/* Tagline with typing effect */}
        <p
          className={`text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-12 h-8 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-slate-400">{about.tagline.slice(0, titleIndex)}</span>
          <span className="inline-block w-0.5 h-5 bg-blue-400 ml-1 animate-pulse" />
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={onScrollDown}
            className="group px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            View My Work
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </button>

          <a
            href={about.resumeUrl ?? '#'}
            className="px-8 py-3.5 border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-white font-medium rounded-xl transition-all duration-300 hover:bg-blue-500/5"
          >
            Download Resume
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={onScrollDown}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-700 cursor-pointer ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        aria-label="Scroll down"
      >
        <div className="flex flex-col items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg
            className="w-5 h-5 animate-bounce"
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
