'use client';

import { useEffect, useRef, useState } from 'react';
import type { About } from '@/lib/terminal/types';

interface AboutSectionProps {
  about: About;
}

export function AboutSection({ about }: AboutSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'Years Experience', value: '6+' },
    { label: 'Companies Worked', value: '4' },
    { label: 'Technologies', value: '30+' },
    { label: 'Degrees', value: '3' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 sm:py-32"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Passionate about building
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> exceptional software</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Bio Content */}
          <div className="lg:col-span-3 space-y-6">
            {about.bio.map((paragraph, index) => (
              <p
                key={index}
                className={`text-slate-400 text-lg leading-relaxed transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${(index + 1) * 100}ms` }}
              >
                {paragraph}
              </p>
            ))}

            {/* Quick highlights */}
            <div
              className={`pt-6 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h3 className="text-slate-200 font-semibold mb-4">What I bring to the table:</h3>
              <ul className="space-y-3">
                {[
                  'Deep expertise in AI/ML, from research to production deployment',
                  'Strong foundation in systems programming (C/C++, embedded systems)',
                  'Full-stack development with modern frameworks and best practices',
                  'Experience with defense & aerospace mission-critical systems',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-400">
                    <svg
                      className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats Card */}
          <div
            className={`lg:col-span-2 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800/50 backdrop-blur-sm">
              <h3 className="text-slate-200 font-semibold mb-6">Quick Facts</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Location & Status */}
              <div className="mt-8 pt-6 border-t border-slate-800/50 space-y-3">
                <div className="flex items-center gap-3 text-slate-400">
                  <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Colorado Springs, CO / Remote</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  <span>Open to opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
