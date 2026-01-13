'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getContentData } from '@/lib/terminal/file-system';

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
    const data = getContentData('education') as { schools?: Education[] } | Education[];
    if (Array.isArray(data)) {
      setSchools(data);
    } else if (data?.schools) {
      setSchools(data.schools);
    }
  }, []);

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, [schools]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'q':
        e.preventDefault();
        onExit();
        break;
      case 'b':
      case 'Backspace':
        if (onBack) {
          e.preventDefault();
          onBack();
        }
        break;
    }
  }, [onExit, onBack]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="h-full flex flex-col outline-none bg-black terminal-text font-mono"
    >
      {/* Header */}
      <div className="shrink-0 px-2 py-1 flex items-center justify-between border-b border-green-800">
        <div className="flex items-center gap-2">
          <span className="text-green-500">┌─</span>
          <span className="text-green-400 font-bold">EDUCATION</span>
          <span className="text-green-500">─┐</span>
        </div>
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="text-gray-500 hover:text-green-400 cursor-pointer">
              [b] back
            </button>
          )}
          <button onClick={onExit} className="text-gray-500 hover:text-green-400 cursor-pointer">
            [q] exit
          </button>
        </div>
      </div>

      {/* Education timeline */}
      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-2">
          {schools.map((edu, index) => (
            <div key={index} className="relative pl-3 border-l border-green-800">
              {/* Timeline dot */}
              <div className="absolute -left-[3px] top-1 w-1.5 h-1.5 bg-green-500 rounded-full" />

              {/* Card */}
              <div className="border border-green-900 p-2">
                {/* Degree & Field */}
                <div className="text-green-400 font-bold text-xs">{edu.degree}</div>
                {edu.field && (
                  <div className="text-green-300 text-xs">{edu.field}</div>
                )}

                {/* Institution */}
                <div className="text-gray-400 text-xs mt-0.5">{edu.institution}</div>

                {/* Period & Location */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-0.5">
                  <span>{edu.period}</span>
                  {edu.location && <span>• {edu.location}</span>}
                  {edu.gpa && <span className="text-green-600">• GPA: {edu.gpa}</span>}
                </div>

                {/* Highlights */}
                {edu.highlights && edu.highlights.length > 0 && (
                  <div className="mt-1.5 space-y-0">
                    {edu.highlights.map((highlight, hIndex) => (
                      <div key={hIndex} className="text-gray-500 text-xs flex gap-1">
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
      <div className="shrink-0 px-2 py-1 border-t border-green-800 text-gray-600 flex flex-wrap gap-x-3">
        {onBack && <span><span className="text-green-700">[b]</span> back</span>}
        <span><span className="text-green-700">[q]</span> exit</span>
      </div>
    </div>
  );
}

