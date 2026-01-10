'use client';

import React, { useEffect, useRef, useCallback } from 'react';

type PortfolioSection = 'skills' | 'experience' | 'education' | 'projects';

interface PortfolioHubProps {
  onSelect: (section: PortfolioSection) => void;
  onExit: () => void;
}

const sections: { id: PortfolioSection; title: string; description: string; shortcut: string }[] = [
  {
    id: 'experience',
    title: 'Work Experience',
    description: 'Professional history, roles, achievements, and technologies used',
    shortcut: '1',
  },
  {
    id: 'skills',
    title: 'Technical Skills',
    description: 'Programming languages, frameworks, tools, and proficiency levels',
    shortcut: '2',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Portfolio of personal and professional projects',
    shortcut: '3',
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Academic background, degrees, and certifications',
    shortcut: '4',
  },
];

export function PortfolioHub({ onSelect, onExit }: PortfolioHubProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case '1':
        onSelect('experience');
        break;
      case '2':
        onSelect('skills');
        break;
      case '3':
        onSelect('projects');
        break;
      case '4':
        onSelect('education');
        break;
      case 'Escape':
      case 'q':
        e.preventDefault();
        onExit();
        break;
    }
  }, [onSelect, onExit]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="h-full flex flex-col outline-none bg-black"
    >
      {/* Header */}
      <div className="border border-green-700 mx-4 mt-4 px-6 py-4 bg-green-950/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-green-400 tracking-wide">Portfolio</h1>
            <p className="text-gray-500 text-sm mt-1">Select a section to explore</p>
          </div>
          <button
            onClick={onExit}
            className="px-3 py-1 text-sm border border-green-700 text-green-500 hover:bg-green-900/50 hover:text-green-300 transition-colors"
          >
            × Close
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 border-x border-green-700 mx-4 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSelect(section.id)}
              className="group text-left p-5 border border-green-800 bg-black hover:bg-green-950/40 hover:border-green-600 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-lg text-green-400 group-hover:text-green-300">
                  {section.title}
                </h2>
                <span className="text-xs text-gray-600 border border-gray-700 px-1.5 py-0.5 font-mono">
                  {section.shortcut}
                </span>
              </div>
              <p className="text-sm text-gray-500 group-hover:text-gray-400">
                {section.description}
              </p>
              <div className="mt-3 text-xs text-green-600 group-hover:text-green-500">
                Press {section.shortcut} or click to open →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border border-green-700 mx-4 mb-4 px-4 py-2 text-xs text-gray-500 flex justify-between bg-green-950/30">
        <span>Press 1-4 to select section • Click to open</span>
        <span>ESC or q to close</span>
      </div>
    </div>
  );
}

