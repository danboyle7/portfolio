'use client';

import { useEffect, useRef, useState } from 'react';
import type { Education } from '@/lib/terminal/types';

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
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
      id="education"
      ref={sectionRef}
      className="py-24 sm:py-32 bg-zinc-900/50"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-emerald-400 font-mono text-sm tracking-wider uppercase">
            Education
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100 mt-2">
            Academic
            <span className="text-emerald-400"> background</span>
          </h2>
        </div>

        {/* Education cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {education.map((edu, index) => (
            <div
              key={index}
              className={`group bg-zinc-800/30 rounded-xl border border-zinc-700/50 p-6 transition-all duration-500 hover:border-emerald-500/30 hover:bg-zinc-800/50 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Degree icon */}
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>

              {/* Degree info */}
              <h3 className="text-lg font-semibold text-zinc-100 mb-1 group-hover:text-emerald-400 transition-colors">
                {edu.degree}
              </h3>
              <p className="text-emerald-400 text-sm font-medium mb-2">{edu.field}</p>
              <p className="text-zinc-400 text-sm mb-4">{edu.institution}</p>

              {/* Period and GPA */}
              <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-zinc-700/50">
                <span className="text-zinc-500 font-mono">{edu.period}</span>
                {edu.gpa && (
                  <span className="text-emerald-400 font-semibold">
                    GPA: {edu.gpa}
                  </span>
                )}
              </div>

              {/* Highlights */}
              {edu.highlights && edu.highlights.length > 0 && (
                <ul className="space-y-2">
                  {edu.highlights.slice(0, 2).map((highlight, hIndex) => (
                    <li key={hIndex} className="flex items-start gap-2 text-zinc-500 text-sm">
                      <svg
                        className="w-4 h-4 text-emerald-500/50 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span className="line-clamp-2">{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
