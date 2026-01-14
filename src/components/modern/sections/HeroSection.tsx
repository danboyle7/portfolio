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
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Greeting */}
        <div
          className={`transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-300 text-sm font-medium">
                {contact.availability}
              </span>
            </div>
          </div>
        </div>

        {/* Name - consistent scaling */}
        <h1
          className={`text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent drop-shadow-sm tracking-wide">
            {about.name}
          </span>
        </h1>

        {/* Title - proportional to name */}
        <h2
          className={`text-xl sm:text-xl md:text-2xl lg:text-3xl tracking-tight text-slate-400 mb-6 sm:mb-8 transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {about.title}
        </h2>

        {/* Tagline with typing effect - proportional sizing */}
        <p
          className={`text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-10 sm:mb-12 min-h-7 sm:min-h-8 transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-slate-400 tracking-wide">{about.tagline.slice(0, titleIndex)}</span>
          <span className="inline-block w-0.5 h-4 sm:h-5 bg-blue-400 ml-1 animate-pulse align-text-bottom translate-y-0.5" />
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <button
            onClick={onScrollDown}
            className="group px-6 sm:px-8 py-3 sm:py-3.5 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm sm:text-base font-semibold tracking-wide rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
          >
            View My Work
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </button>

          <a
            href={about.resumeUrl ?? '#'}
            className="px-6 sm:px-8 py-3 sm:py-3.5 border border-slate-700 hover:border-blue-500/50 text-slate-300 hover:text-white text-sm sm:text-base font-medium tracking-wide rounded-xl transition-all duration-300 hover:bg-blue-500/5"
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
