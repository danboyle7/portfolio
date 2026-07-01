"use client";

import { useEffect, useRef, useState } from "react";
import type { Experience } from "@/lib/terminal/types";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "../SectionHeading";

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
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <SectionHeading
          index="02"
          label="Experience"
          isVisible={isVisible}
          className="mb-16"
          title={
            <>
              Where I&apos;ve
              <span className="text-gradient"> made an impact</span>
            </>
          }
        />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute top-0 bottom-0 left-0 w-px bg-linear-to-b from-blue-500/50 via-slate-700 to-transparent md:left-8" />

          {/* Experience items */}
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`relative pl-8 transition-all duration-700 md:pl-20 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 h-3 w-3 -translate-x-1/2 rounded-full ring-4 ring-slate-950 transition-colors md:left-8 ${
                    expandedIndex === index ? "bg-blue-400" : "bg-slate-600"
                  }`}
                />

                {/* Card */}
                <Card
                  size="none"
                  className={`group cursor-pointer transition-all duration-300 ${
                    expandedIndex === index
                      ? "border-blue-500/30 bg-slate-900/50 shadow-lg shadow-blue-500/5"
                      : "hover:border-slate-700 hover:bg-slate-900/40"
                  }`}
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                >
                  {/* Header - always visible */}
                  <div className="p-6">
                    <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <h3
                        className={`text-xl font-semibold transition-colors ${
                          expandedIndex === index
                            ? "text-blue-400"
                            : "text-white group-hover:text-blue-400"
                        }`}
                      >
                        {exp.role}
                      </h3>
                      <span className="text-sm text-slate-500">
                        {exp.period}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2 text-slate-400 sm:flex-row sm:items-center">
                      <span className="font-medium">{exp.company}</span>
                      <span className="hidden text-slate-700 sm:inline">|</span>
                      <span className="text-sm text-slate-500">
                        {exp.location}
                      </span>
                    </div>

                    {/* Description preview */}
                    <p className="mt-4 line-clamp-2 text-sm text-slate-400">
                      {exp.description}
                    </p>

                    {/* Expand indicator */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                      <svg
                        className={`h-4 w-4 transition-transform duration-300 ${
                          expandedIndex === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      <span>
                        {expandedIndex === index ? "Show less" : "Show more"}
                      </span>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedIndex === index ? "max-h-[600px]" : "max-h-0"
                    }`}
                  >
                    <div className="space-y-4 border-t border-slate-800/50 px-6 pt-4 pb-6">
                      {/* Highlights */}
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-slate-300">
                          Key Achievements
                        </h4>
                        <ul className="space-y-2">
                          {exp.highlights.map((highlight, hIndex) => (
                            <li
                              key={hIndex}
                              className="flex items-start gap-3 text-sm text-slate-400"
                            >
                              <svg
                                className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4"
                                />
                              </svg>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Technologies */}
                      <div>
                        <h4 className="mb-3 text-sm font-semibold text-slate-300">
                          Technologies
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, tIndex) => (
                            <span
                              key={tIndex}
                              className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
