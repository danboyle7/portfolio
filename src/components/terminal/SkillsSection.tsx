'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { getContentData } from '@/lib/terminal/file-system';

interface SkillsSectionProps {
  onExit: () => void;
  onBack?: () => void;
}

interface Skill {
  name: string;
  level: number;
  years?: number;
}

interface SkillCategory {
  name: string;
  icon?: string;
  skills: Skill[];
}

// Feature flag for color coding
const ENABLE_COLOR_CODING = true;

export function SkillsSection({ onExit, onBack }: SkillsSectionProps) {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showColors, setShowColors] = useState(ENABLE_COLOR_CODING);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = getContentData('skills') as { categories?: SkillCategory[] } | SkillCategory[];
    if (Array.isArray(data)) {
      setCategories(data);
    } else if (data?.categories) {
      setCategories(data.categories);
    }
  }, []);

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, [categories]);

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
      case 'Escape':
        e.preventDefault();
        setSelectedCategory(null);
        break;
      case 'c':
      case 'C':
        e.preventDefault();
        setShowColors(c => !c);
        break;
      case 'o':
      case 'O':
        e.preventDefault();
        setSortOrder(s => s === 'none' ? 'desc' : s === 'desc' ? 'asc' : 'none');
        break;
    }
  }, [onExit, onBack]);

  // Get all skills or filtered by category, then sort
  const displayedSkills = useMemo(() => {
    let skills = selectedCategory
      ? categories.find(c => c.name === selectedCategory)?.skills || []
      : categories.flatMap(c => c.skills.map(s => ({ ...s, category: c.name })));

    if (sortOrder === 'asc') {
      skills = [...skills].sort((a, b) => a.level - b.level);
    } else if (sortOrder === 'desc') {
      skills = [...skills].sort((a, b) => b.level - a.level);
    }

    return skills;
  }, [categories, selectedCategory, sortOrder]);

  const getColorClass = (level: number) => {
    if (!showColors) return 'border-green-900 hover:border-green-700';
    if (level >= 90) return 'border-green-400 bg-green-950/40';
    if (level >= 75) return 'border-green-600 bg-green-950/30';
    if (level >= 50) return 'border-yellow-600 bg-yellow-950/20';
    return 'border-gray-600 bg-gray-950/20';
  };

  const getBarColor = (level: number) => {
    if (!showColors) return 'text-green-500';
    if (level >= 90) return 'text-green-400';
    if (level >= 75) return 'text-green-500';
    if (level >= 50) return 'text-yellow-500';
    return 'text-gray-400';
  };

  const getTextColor = (level: number) => {
    if (!showColors) return 'text-green-400';
    if (level >= 90) return 'text-green-300';
    if (level >= 75) return 'text-green-400';
    if (level >= 50) return 'text-yellow-400';
    return 'text-gray-300';
  };

  const getSecondaryTextColor = (level: number) => {
    if (!showColors) return 'text-gray-500';
    if (level >= 90) return 'text-green-500';
    if (level >= 75) return 'text-green-600';
    if (level >= 50) return 'text-yellow-600';
    return 'text-gray-400';
  };

  const renderBar = (level: number) => {
    const filled = Math.round(level / 10);
    return (
      <span className="text-[9px] tracking-tighter">
        <span className={getBarColor(level)}>{'█'.repeat(filled)}</span>
        <span className="text-gray-800">{'█'.repeat(10 - filled)}</span>
      </span>
    );
  };

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
          <span className="text-green-400 font-bold">SKILLS</span>
          <span className="text-green-500">─┐</span>
          <span className="text-gray-600 text-xs">({displayedSkills.length})</span>
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

      {/* Filter bar */}
      <div className="shrink-0 px-2 py-1 bg-green-950/20 flex flex-wrap gap-1 items-center">
        <span className="text-gray-600 text-[10px] mr-1">Filter:</span>
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-1.5 py-px text-[10px] border cursor-pointer transition-colors ${
            selectedCategory === null
              ? 'border-green-500 bg-green-900/50 text-green-300'
              : 'border-green-900 text-gray-500 hover:border-green-700 hover:text-green-400'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
            className={`px-1.5 py-px text-[10px] border cursor-pointer transition-colors ${
              selectedCategory === cat.name
                ? 'border-green-500 bg-green-900/50 text-green-300'
                : 'border-green-900 text-gray-500 hover:border-green-700 hover:text-green-400'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort button */}
      <div className="shrink-0 px-2 py-1 bg-green-950/10 flex items-center gap-2">
        <span className="text-gray-600 text-[10px]">Sort:</span>
        <button
          onClick={() => setSortOrder(s => s === 'none' ? 'desc' : s === 'desc' ? 'asc' : 'none')}
          className={`px-1.5 py-px text-[10px] border cursor-pointer transition-colors ${
            sortOrder !== 'none'
              ? 'border-green-500 bg-green-900/50 text-green-300'
              : 'border-green-900 text-gray-500 hover:border-green-700 hover:text-green-400'
          }`}
        >
          {sortOrder === 'none' ? 'None' : sortOrder === 'desc' ? '↓ High to Low' : '↑ Low to High'}
        </button>
        <span className="text-gray-600 text-[10px]">[o]</span>
      </div>

      {/* Separator */}
      <div className="border-b border-green-900" />

      {/* Skills grid - max 4 columns */}
      <div className="flex-1 overflow-auto p-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
          {displayedSkills.map((skill, index) => (
            <div
              key={index}
              className={`border p-1.5 transition-colors ${getColorClass(skill.level)}`}
            >
              <div className={`text-xs truncate ${getTextColor(skill.level)}`}>{skill.name}</div>
              <div className="mt-1 flex items-center gap-1">
                {renderBar(skill.level)}
                <span className={`text-[10px] ${getSecondaryTextColor(skill.level)}`}>{skill.level}%</span>
              </div>
              {skill.years && (
                <div className={`text-[9px] mt-0.5 ${getSecondaryTextColor(skill.level)}`}>{skill.years} years</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-2 py-1 border-t border-green-800 text-gray-600 flex flex-wrap gap-x-3">
        <span><span className="text-green-700">[esc]</span> clear</span>
        <span>
          <span className="text-green-700">[c]</span> colors
          <span className={showColors ? 'text-green-500' : 'text-gray-600'}> {showColors ? 'on' : 'off'}</span>
        </span>
        {onBack && <span><span className="text-green-700">[b]</span> back</span>}
        <span><span className="text-green-700">[q]</span> exit</span>
      </div>
    </div>
  );
}
