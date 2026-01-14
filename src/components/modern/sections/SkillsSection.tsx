'use client';

import { useEffect, useRef, useState } from 'react';
import type { SkillCategory } from '@/lib/terminal/types';

interface SkillsSectionProps {
  skills: SkillCategory[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
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
      id="skills"
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
            Skills
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
            Technical
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> expertise</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Category tabs - vertical on desktop */}
          <div
            className={`lg:col-span-1 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
              {skills.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    activeCategory === index
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/5'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skills display */}
          <div
            className={`lg:col-span-2 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="bg-slate-900/30 rounded-2xl border border-slate-800/50 p-6 sm:p-8 backdrop-blur-sm">
              <div className="grid gap-5">
                {skills[activeCategory]?.skills.map((skill, index) => (
                  <div key={skill.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-200 font-medium">{skill.name}</span>
                        {skill.years && (
                          <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
                            {skill.years}+ yrs
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: isVisible ? `${skill.level}%` : '0%',
                          transitionDelay: `${index * 50 + 300}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category summary */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                <span>90-100%: Expert</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500/70 to-cyan-500/70" />
                <span>80-89%: Advanced</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500/50 to-cyan-500/50" />
                <span>70-79%: Proficient</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
