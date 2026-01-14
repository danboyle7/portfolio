'use client';

import { useEffect, useState } from 'react';
import type { About, ContactInfo } from '@/lib/terminal/types';

interface HeroSectionProps {
  about: About;
  contact: ContactInfo;
  onScrollDown: () => void;
}

export function HeroSection({ about, contact, onScrollDown }: HeroSectionProps) {
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
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Status badge */}
        <div
          className={`transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-blue-500/10 rounded-full border border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-300 text-xs font-medium tracking-wide">
              {contact.availability}
            </span>
          </div>
        </div>

        {/* Name */}
        <h1
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 transition-all duration-500 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {about.name}
          </span>
        </h1>

        {/* Title */}
        <h2
          className={`text-lg sm:text-xl md:text-2xl text-slate-400 mb-5 sm:mb-6 transition-all duration-500 delay-150 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {about.title}
        </h2>

        {/* Tagline with typing effect */}
        <p
          className={`text-sm sm:text-base text-slate-500 max-w-xl mx-auto mb-8 sm:mb-10 min-h-6 transition-all duration-500 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="text-slate-400">{about.tagline.slice(0, titleIndex)}</span>
          <span className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 animate-pulse align-text-bottom translate-y-0.5" />
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 transition-all duration-500 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={onScrollDown}
            className="group px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
          >
            View My Work
            <span className="inline-block ml-1.5 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>

          <a
            href={about.resumeUrl ?? '#'}
            className="px-6 py-2.5 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-sm font-medium rounded-lg transition-all duration-200"
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
