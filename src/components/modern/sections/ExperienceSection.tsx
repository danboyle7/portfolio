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
          <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">
            Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Where I&apos;ve
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> made an impact</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-slate-700 to-transparent" />

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
                <div className={`absolute left-0 md:left-8 -translate-x-1/2 w-3 h-3 rounded-full ring-4 ring-slate-950 transition-colors ${
                  expandedIndex === index ? 'bg-blue-400' : 'bg-slate-600'
                }`} />

                {/* Card */}
                <div
                  className={`group bg-slate-900/30 rounded-xl border transition-all duration-300 cursor-pointer ${
                    expandedIndex === index
                      ? 'border-blue-500/30 shadow-lg shadow-blue-500/5 bg-slate-900/50'
                      : 'border-slate-800/50 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  {/* Header - always visible */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className={`text-xl font-semibold transition-colors ${
                        expandedIndex === index ? 'text-blue-400' : 'text-white group-hover:text-blue-400'
                      }`}>
                        {exp.role}
                      </h3>
                      <span className="text-sm text-slate-500">
                        {exp.period}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-slate-400">
                      <span className="font-medium">{exp.company}</span>
                      <span className="hidden sm:inline text-slate-700">|</span>
                      <span className="text-sm text-slate-500">{exp.location}</span>
                    </div>

                    {/* Description preview */}
                    <p className="mt-4 text-slate-400 text-sm line-clamp-2">
                      {exp.description}
                    </p>

                    {/* Expand indicator */}
                    <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
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
                    <div className="px-6 pb-6 space-y-4 border-t border-slate-800/50 pt-4">
                      {/* Highlights */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-3">Key Achievements</h4>
                        <ul className="space-y-2">
                          {exp.highlights.map((highlight, hIndex) => (
                            <li key={hIndex} className="flex items-start gap-3 text-slate-400 text-sm">
                              <svg
                                className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0"
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
                        <h4 className="text-sm font-semibold text-slate-300 mb-3">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, tIndex) => (
                            <span
                              key={tIndex}
                              className="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-500/10 rounded-full border border-blue-500/20"
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
