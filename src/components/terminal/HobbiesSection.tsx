"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { getContentData } from "@/lib/terminal/file-system";

interface HobbiesSectionProps {
  onExit: () => void;
  onBack?: () => void;
}

interface Hobby {
  name: string;
  description: string;
  icon?: string;
  level?: string;
}

export function HobbiesSection({ onExit, onBack }: HobbiesSectionProps) {
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = getContentData("hobbies") as { items?: Hobby[] } | Hobby[];
    if (Array.isArray(data)) {
      setHobbies(data);
    } else if (data?.items) {
      setHobbies(data.items);
    }
  }, []);

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, [hobbies]);

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
          <span className="font-bold text-green-400">HOBBIES</span>
          <span className="text-green-500">─┐</span>
          <span className="text-xs text-gray-600">things I enjoy</span>
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

      {/* Hobbies grid */}
      <div className="flex-1 overflow-auto p-2">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
          {hobbies.map((hobby, index) => (
            <div
              key={index}
              className="border border-green-900 p-1.5 transition-colors hover:border-green-700"
            >
              <div className="flex items-center gap-1">
                {hobby.icon && <span>{hobby.icon}</span>}
                <span className="text-xs font-bold text-green-400">
                  {hobby.name}
                </span>
              </div>
              {hobby.level && (
                <div className="text-xs text-green-700">{hobby.level}</div>
              )}
              <div className="mt-1 text-xs text-gray-500">
                {hobby.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 flex-wrap gap-x-3 border-t border-green-800 px-2 py-1 text-xs text-gray-600">
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
