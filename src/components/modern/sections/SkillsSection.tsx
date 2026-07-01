"use client";

import type { CSSProperties, JSX } from "react";
import { useEffect, useRef, useState } from "react";
import type { SkillCategory } from "@/lib/terminal/types";
import { getSkillIcon } from "@/lib/skill-icons.generated";

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
    sparkles: (
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
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-6.857 2.286L12 21l-2.286-6.857L3 12l6.857-2.286L12 3z"
        />
      </svg>
    ),
    database: (
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
          d="M4 7c0 1.657 3.582 3 8 3s8-1.343 8-3-3.582-3-8-3-8 1.343-8 3zm16 0v10c0 1.657-3.582 3-8 3s-8-1.343-8-3V7m16 5c0 1.657-3.582 3-8 3s-8-1.343-8-3"
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
            <div className="rounded-2xl border border-slate-800/50 bg-slate-900/20 p-4 backdrop-blur-sm sm:p-5">
              <div className="modern-scrollbar max-h-[60vh] overflow-y-auto px-1 py-2 lg:max-h-[520px]">
                <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
                  {(skills[activeCategory]?.skills ?? []).map(
                    (skill, index) => {
                      const icon = getSkillIcon(skill.name);
                      return (
                        <div
                          key={skill.name}
                          className="skill-item group flex flex-col items-center gap-3 text-center"
                          style={
                            {
                              "--skill-color": icon.color,
                              transitionDelay: isVisible
                                ? `${index * 35 + 200}ms`
                                : "0ms",
                            } as CSSProperties
                          }
                        >
                          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-800/70 bg-slate-900/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--skill-color)] group-hover:bg-slate-800/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={icon.src}
                              alt=""
                              aria-hidden="true"
                              loading="lazy"
                              className="h-10 w-10 object-contain"
                            />
                          </span>
                          <div className="w-full">
                            <div className="text-sm leading-tight font-semibold text-balance text-slate-100">
                              {skill.name}
                            </div>
                            {skill.years && (
                              <div className="mt-1 text-[11px] text-slate-500">
                                {skill.years}+ yrs
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
