"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { getContentData } from "@/lib/terminal/file-system";

interface EducationSectionProps {
  onExit: () => void;
  onBack?: () => void;
}

interface Education {
  institution: string;
  degree: string;
  field?: string;
  period: string;
  location?: string;
  gpa?: string;
  highlights?: string[];
}

export function EducationSection({ onExit, onBack }: EducationSectionProps) {
  const [schools, setSchools] = useState<Education[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use requestAnimationFrame to batch state update and avoid React Compiler warning
    const frame = requestAnimationFrame(() => {
      const data = getContentData("education") as
        | { schools?: Education[] }
        | Education[];
      if (Array.isArray(data)) {
        setSchools(data);
      } else if (data?.schools) {
        setSchools(data.schools);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, [schools]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "q":
          e.preventDefault();
          onExit();
          break;
        case "b":
        case "Backspace":
          if (onBack) {
            e.preventDefault();
            onBack();
          }
          break;
      }
    },
    [onExit, onBack],
  );

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="terminal-text flex h-full flex-col bg-black font-mono outline-none"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-green-800 px-2 py-1">
        <div className="flex items-center gap-2">
          <span className="text-green-500">┌─</span>
          <span className="font-bold text-green-400">EDUCATION</span>
          <span className="text-green-500">─┐</span>
        </div>
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="cursor-pointer text-gray-500 hover:text-green-400"
            >
              [b] back
            </button>
          )}
          <button
            onClick={onExit}
            className="cursor-pointer text-gray-500 hover:text-green-400"
          >
            [q] exit
          </button>
        </div>
      </div>

      {/* Education timeline */}
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-2">
          {schools.map((edu, index) => (
            <div
              key={index}
              className="relative border-l border-green-800 pl-3"
            >
              {/* Timeline dot */}
              <div className="absolute top-1 -left-[3px] h-1.5 w-1.5 rounded-full bg-green-500" />

              {/* Card */}
              <div className="border border-green-900 p-2">
                {/* Degree & Field */}
                <div className="text-xs font-bold text-green-400">
                  {edu.degree}
                </div>
                {edu.field && (
                  <div className="text-xs text-green-300">{edu.field}</div>
                )}

                {/* Institution */}
                <div className="mt-0.5 text-xs text-gray-400">
                  {edu.institution}
                </div>

                {/* Period & Location */}
                <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-gray-600">
                  <span>{edu.period}</span>
                  {edu.location && <span>• {edu.location}</span>}
                  {edu.gpa && (
                    <span className="text-green-600">• GPA: {edu.gpa}</span>
                  )}
                </div>

                {/* Highlights */}
                {edu.highlights && edu.highlights.length > 0 && (
                  <div className="mt-1.5 space-y-0">
                    {edu.highlights.map((highlight, hIndex) => (
                      <div
                        key={hIndex}
                        className="flex gap-1 text-xs text-gray-500"
                      >
                        <span className="text-green-700">▹</span>
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 flex-wrap gap-x-3 border-t border-green-800 px-2 py-1 text-gray-600">
        {onBack && (
          <span>
            <span className="text-green-700">[b]</span> back
          </span>
        )}
        <span>
          <span className="text-green-700">[q]</span> exit
        </span>
      </div>
    </div>
  );
}
