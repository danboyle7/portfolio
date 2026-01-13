'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';

type PortfolioSection = 'skills' | 'experience' | 'education' | 'projects' | 'hobbies';

interface PortfolioHubProps {
  onSelect: (section: PortfolioSection) => void;
  onExit: () => void;
}

const sections: { id: PortfolioSection; title: string; description: string; shortcut: string }[] = [
  {
    id: 'experience',
    title: 'Experience',
    description: 'Work history & roles',
    shortcut: '1',
  },
  {
    id: 'skills',
    title: 'Skills',
    description: 'Languages & tools',
    shortcut: '2',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Portfolio work',
    shortcut: '3',
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Academic background',
    shortcut: '4',
  },
  {
    id: 'hobbies',
    title: 'Hobbies',
    description: 'Interests & passions',
    shortcut: '5',
  },
];

export function PortfolioHub({ onSelect, onExit }: PortfolioHubProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
      case '5':
        onSelect('hobbies');
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        setSelectedIndex(i => (i - 1 + sections.length) % sections.length);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        setSelectedIndex(i => (i + 1) % sections.length);
        break;
      case 'Enter':
        e.preventDefault();
        onSelect(sections[selectedIndex]!.id);
        break;
      case 'q':
        e.preventDefault();
        onExit();
        break;
    }
  }, [onSelect, onExit, selectedIndex]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="h-full flex flex-col outline-none bg-black terminal-text font-mono"
    >
      {/* Header with ASCII art */}
      <div className="px-3 py-3 border-b border-green-800">
        <div className="flex items-start justify-between">
          <div>
            <pre className="text-green-500 leading-none text-xs md:text-sm">
{`██████╗  █████╗ ███╗   ██╗██╗███████╗██╗
██╔══██╗██╔══██╗████╗  ██║██║██╔════╝██║
██║  ██║███████║██╔██╗ ██║██║█████╗  ██║
██║  ██║██╔══██║██║╚██╗██║██║██╔══╝  ██║
██████╔╝██║  ██║██║ ╚████║██║███████╗███████╗
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝╚══════╝╚══════╝`}
            </pre>
            <div className="mt-2 text-gray-500">
              Software Developer • Problem Solver
            </div>
          </div>
          <button
            onClick={onExit}
            className="text-gray-500 hover:text-green-400 transition-colors shrink-0 ml-4 cursor-pointer"
          >
            [q] exit
          </button>
        </div>
      </div>

      {/* Menu list - simple terminal style */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <div className="text-gray-500 mb-2">
          Select a section:
        </div>

        <div className="space-y-0">
          {sections.map((section, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={section.id}
                onClick={() => onSelect(section.id)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-2 py-1.5 transition-colors flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-green-900/40 text-green-300'
                    : 'text-gray-400 hover:text-green-400'
                }`}
              >
                <span className={`${isSelected ? 'text-green-400' : 'text-gray-600'}`}>
                  {isSelected ? '▸' : ' '}
                </span>
                <span className={`${isSelected ? 'text-green-500' : 'text-gray-600'}`}>
                  [{section.shortcut}]
                </span>
                <span className="flex-1">{section.title}</span>
                <span className={`text-xs ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                  {section.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer with controls */}
      <div className="px-3 py-2 border-t border-green-800 text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
        <span><span className="text-green-600">[1-5]</span> select</span>
        <span><span className="text-green-600">[↑↓]</span> navigate</span>
        <span><span className="text-green-600">[enter]</span> open</span>
        <span><span className="text-green-600">[q]</span> exit</span>
      </div>
    </div>
  );
}
