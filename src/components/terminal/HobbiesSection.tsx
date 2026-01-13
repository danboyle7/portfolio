'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getContentData } from '@/lib/terminal/file-system';

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
    const data = getContentData('hobbies') as { items?: Hobby[] } | Hobby[];
    if (Array.isArray(data)) {
      setHobbies(data);
    } else if (data?.items) {
      setHobbies(data.items);
    }
  }, []);

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, [hobbies]);

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
          <span className="text-green-400 font-bold">HOBBIES</span>
          <span className="text-green-500">─┐</span>
          <span className="text-gray-600 text-xs">things I enjoy</span>
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

      {/* Hobbies grid */}
      <div className="flex-1 overflow-auto p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
          {hobbies.map((hobby, index) => (
            <div
              key={index}
              className="border border-green-900 p-1.5 hover:border-green-700 transition-colors"
            >
              <div className="flex items-center gap-1">
                {hobby.icon && <span>{hobby.icon}</span>}
                <span className="text-green-400 font-bold text-xs">{hobby.name}</span>
              </div>
              {hobby.level && (
                <div className="text-green-700 text-xs">{hobby.level}</div>
              )}
              <div className="text-gray-500 text-xs mt-1">{hobby.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-2 py-1 border-t border-green-800 text-gray-600 text-xs flex flex-wrap gap-x-3">
        {onBack && <span><span className="text-green-700">[b]</span> back</span>}
        <span><span className="text-green-700">[q]</span> exit</span>
      </div>
    </div>
  );
}

