"use client";

import { useEffect, useRef, useState } from "react";
import type { Education } from "@/lib/terminal/types";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "../SectionHeading";

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
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="education" ref={sectionRef} className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section Header */}
        <SectionHeading
          index="05"
          label="Education"
          isVisible={isVisible}
          className="mb-16"
          title={
            <>
              Academic
              <span className="text-gradient"> background</span>
            </>
          }
        />

        {/* Education cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {education.map((edu, index) => (
            <Card
              key={index}
              className={`${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Degree icon */}
              <div className="mb-4 text-blue-400">
                <svg
                  className="h-8 w-8"
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
              <h3 className="mb-1 text-lg font-semibold text-white">
                {edu.degree}
              </h3>
              <p className="mb-2 text-sm font-medium text-blue-400">
                {edu.field}
              </p>
              <p className="mb-4 text-sm text-slate-400">{edu.institution}</p>

              {/* Period and GPA */}
              <div className="mb-4 flex items-center justify-between border-b border-slate-800/50 pb-4 text-sm">
                <span className="text-slate-500">{edu.period}</span>
                {edu.gpa && (
                  <span className="font-semibold text-blue-400">
                    GPA: {edu.gpa}
                  </span>
                )}
              </div>

              {/* Highlights */}
              {edu.highlights && edu.highlights.length > 0 && (
                <ul className="space-y-2">
                  {edu.highlights.slice(0, 2).map((highlight, hIndex) => (
                    <li
                      key={hIndex}
                      className="flex items-start gap-2 text-sm text-slate-500"
                    >
                      <svg
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-500/50"
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
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
