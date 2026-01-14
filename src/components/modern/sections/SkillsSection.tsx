"use client";

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import type { SkillCategory } from "@/lib/terminal/types";

interface SkillsSectionProps {
  skills: SkillCategory[];
}

function SkillIcon({ name }: { name: string }): JSX.Element {
  const iconMap: Record<string, JSX.Element> = {
    code: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
    cpu: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 7h10a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2z"
        />
      </svg>
    ),
    layers: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
    wrench: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    monitor: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    brain: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  };

  return (
    iconMap[name] ?? (
      <span className="flex h-5 w-5 items-center justify-center text-xs">
        {name}
      </span>
    )
  );
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
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <div
          className={`mb-16 transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
            Skills
          </span>
          <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Technical
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              expertise
            </span>
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Category tabs - vertical on desktop */}
          <div
            className={`transition-all delay-100 duration-700 lg:col-span-1 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex flex-wrap gap-2 pb-4 lg:flex-col lg:pb-0">
              {skills.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(index)}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-all duration-300 sm:gap-3 sm:px-4 sm:py-3 sm:text-base ${
                    activeCategory === index
                      ? "border border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/5"
                      : "border border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <SkillIcon name={category.icon} />
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skills display */}
          <div
            className={`transition-all delay-200 duration-700 lg:col-span-2 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-4 backdrop-blur-sm sm:p-6 md:p-8">
              <div className="grid gap-4 sm:gap-5">
                {skills[activeCategory]?.skills.map((skill, index) => (
                  <div key={skill.name} className="group">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                        <span className="truncate text-sm font-medium text-slate-200 sm:text-base">
                          {skill.name}
                        </span>
                        {skill.years && (
                          <span className="flex-shrink-0 rounded bg-slate-800/50 px-1.5 py-0.5 text-[10px] text-slate-500 sm:px-2 sm:text-xs">
                            {skill.years}+ yrs
                          </span>
                        )}
                      </div>
                      <span className="flex-shrink-0 text-xs text-slate-500 sm:text-sm">
                        {skill.level}%
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-2 overflow-hidden rounded-full bg-slate-800/50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-1000 ease-out"
                        style={{
                          width: isVisible ? `${skill.level}%` : "0%",
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
                <span className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                <span>90-100%: Expert</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500/70 to-cyan-500/70" />
                <span>80-89%: Advanced</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500/50 to-cyan-500/50" />
                <span>70-79%: Proficient</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
