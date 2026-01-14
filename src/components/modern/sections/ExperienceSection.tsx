'use client';

import { useEffect, useRef, useState } from 'react';
import type { Experience } from '@/lib/terminal/types';

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
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
          <span className="text-emerald-400 font-mono text-sm tracking-wider uppercase">
            Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mt-2">
            Where I&apos;ve
            <span className="text-emerald-400"> made an impact</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-zinc-800" />

          {/* Experience items */}
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative pl-8 md:pl-20 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-8 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-zinc-950" />

                {/* Card */}
                <div
                  className={`group bg-zinc-900/50 rounded-xl border transition-all duration-300 cursor-pointer ${
                    expandedIndex === index
                      ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  {/* Header - always visible */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                        {exp.role}
                      </h3>
                      <span className="text-sm text-zinc-500 font-mono">
                        {exp.period}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-zinc-400">
                      <span className="font-medium">{exp.company}</span>
                      <span className="hidden sm:inline text-zinc-600">|</span>
                      <span className="text-sm text-zinc-500">{exp.location}</span>
                    </div>

                    {/* Description preview */}
                    <p className="mt-4 text-zinc-400 text-sm line-clamp-2">
                      {exp.description}
                    </p>

                    {/* Expand indicator */}
                    <div className="flex items-center gap-2 mt-4 text-sm text-zinc-500">
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
                          expandedIndex === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>{expandedIndex === index ? 'Show less' : 'Show more'}</span>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedIndex === index ? 'max-h-[600px]' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-6 space-y-4 border-t border-zinc-800 pt-4">
                      {/* Highlights */}
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-300 mb-3">Key Achievements</h4>
                        <ul className="space-y-2">
                          {exp.highlights.map((highlight, hIndex) => (
                            <li key={hIndex} className="flex items-start gap-3 text-zinc-400 text-sm">
                              <svg
                                className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                              </svg>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-300 mb-3">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, tIndex) => (
                            <span
                              key={tIndex}
                              className="px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
