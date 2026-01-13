'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getContentData } from '@/lib/terminal/file-system';

type PortfolioSection = 'skills' | 'experience' | 'education' | 'projects' | 'hobbies';

interface InteractivePortfolioProps {
  section: PortfolioSection;
  onExit: () => void;
  onBack?: () => void;
}

interface Hobby {
  name: string;
  description: string;
  icon?: string;
  level?: string;
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
  items?: string[];
}

interface Experience {
  company: string;
  role: string;
  position?: string;
  period: string;
  location?: string;
  description: string;
  highlights?: string[];
  achievements?: string[];
  technologies?: string[];
}

interface Education {
  institution: string;
  degree: string;
  field?: string;
  period: string;
  gpa?: string;
  achievements?: string[];
}

interface Project {
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
  github?: string;
  live?: string;
  highlights?: string[];
}

export function InteractivePortfolio({ section, onExit, onBack }: InteractivePortfolioProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState<unknown>(null);
  const [reversed, setReversed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = getContentData(section);
    setData(content);
  }, [section]);

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, [data]);

  // Scroll detail panel to top when selection changes
  useEffect(() => {
    if (detailRef.current) {
      detailRef.current.scrollTop = 0;
    }
  }, [selectedIndex]);

  const getItems = useCallback((): unknown[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    switch (section) {
      case 'skills':
        return (data as { categories?: SkillCategory[] })?.categories || [];
      case 'experience':
        return (data as { positions?: Experience[] })?.positions || [];
      case 'education':
        return (data as { schools?: Education[] })?.schools || [];
      case 'projects':
        return (data as { items?: Project[] })?.items || [];
      case 'hobbies':
        return (data as { items?: Hobby[] })?.items || [];
      default:
        return [];
    }
  }, [data, section]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = getItems();

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(items.length - 1, prev + 1));
        break;
      case 'q':
        e.preventDefault();
        onExit();
        break;
      case 'Backspace':
      case 'b':
        if (onBack) {
          e.preventDefault();
          onBack();
        }
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        setReversed(prev => !prev);
        setSelectedIndex(0);
        break;
    }
  }, [getItems, onExit, onBack]);

  const rawItems = getItems();
  const items = reversed ? [...rawItems].reverse() : rawItems;
  const selectedItem = items[selectedIndex];

  const getSectionTitle = () => {
    switch (section) {
      case 'skills': return 'SKILLS';
      case 'experience': return 'EXPERIENCE';
      case 'education': return 'EDUCATION';
      case 'projects': return 'PROJECTS';
      case 'hobbies': return 'HOBBIES';
    }
  };

  const getItemName = (item: unknown): string => {
    switch (section) {
      case 'skills':
        return (item as SkillCategory).name;
      case 'experience':
        return (item as Experience).role || (item as Experience).position || '';
      case 'education':
        return (item as Education).degree;
      case 'projects':
        return (item as Project).name;
      case 'hobbies':
        return (item as Hobby).name;
      default:
        return '';
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 terminal-text font-mono">
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="h-full flex flex-col outline-none bg-black terminal-text font-mono"
    >
      {/* TUI Header */}
      <div className="shrink-0 px-2 py-1 flex items-center justify-between border-b border-green-800">
        <div className="flex items-center gap-2">
          <span className="text-green-500">┌─</span>
          <span className="text-green-400 font-bold">{getSectionTitle()}</span>
          <span className="text-green-500">─┐</span>
          <span className="text-gray-600 text-xs">({items.length} items)</span>
          <button
            onClick={() => { setReversed(r => !r); setSelectedIndex(0); }}
            className={`text-xs cursor-pointer transition-colors ${reversed ? 'text-green-400' : 'text-gray-600 hover:text-green-400'}`}
            title="Reverse order"
          >
            [r] {reversed ? '↑' : '↓'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-green-400 cursor-pointer"
            >
              [b] back
            </button>
          )}
          <button
            onClick={onExit}
            className="text-gray-500 hover:text-green-400 cursor-pointer"
          >
            [q] exit
          </button>
        </div>
      </div>

      {/* Main TUI content */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left: Item list - auto width */}
        <div className="shrink-0 border-b md:border-b-0 md:border-r border-green-900 overflow-auto">
          <div className="py-1">
            {items.map((item, index) => {
              const isSelected = index === selectedIndex;
              const name = getItemName(item);
              return (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`
                    px-2 py-1 cursor-pointer flex items-center gap-2 transition-colors whitespace-nowrap
                    ${isSelected
                      ? 'bg-green-900/50 text-green-300'
                      : 'text-gray-500 hover:text-green-400 hover:bg-green-900/20'
                    }
                  `}
                >
                  <span className={isSelected ? 'text-green-400' : 'text-gray-700'}>
                    {isSelected ? '▸' : '│'}
                  </span>
                  <span>{name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detail view */}
        <div ref={detailRef} className="flex-1 overflow-auto p-3 md:p-4">
          {selectedItem !== undefined && selectedItem !== null && (
            <DetailView section={section} item={selectedItem} />
          )}
        </div>
      </div>

      {/* TUI Footer */}
      <div className="shrink-0 px-2 py-1 border-t border-green-800 text-gray-600 flex flex-wrap gap-x-3">
        <span><span className="text-green-700">[↑↓]</span> nav</span>
        {onBack && <span><span className="text-green-700">[b]</span> back</span>}
        <span><span className="text-green-700">[q]</span> exit</span>
      </div>
    </div>
  );
}

function DetailView({ section, item }: { section: PortfolioSection; item: unknown }): React.ReactNode {
  switch (section) {
    case 'skills':
      return <SkillsView skill={item as SkillCategory} />;
    case 'experience':
      return <ExperienceView exp={item as Experience} />;
    case 'education':
      return <EducationView edu={item as Education} />;
    case 'projects':
      return <ProjectView project={item as Project} />;
    case 'hobbies':
      return <HobbiesView hobby={item as Hobby} />;
    default:
      return null;
  }
}

function SkillsView({ skill }: { skill: SkillCategory }) {
  const skills = skill.skills || [];

  return (
    <div className="space-y-4">
      <div className="text-green-400 border-b border-green-900 pb-1">
        ── {skill.name} ──
      </div>

      <div className="space-y-2">
        {skills.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-gray-300 w-32 truncate">{s.name}</span>
            <div className="flex-1 flex items-center gap-1">
              <span className="text-green-700">[</span>
              <div className="flex-1 h-2 bg-gray-900 relative">
                <div
                  className={`h-full ${
                    s.level >= 80 ? 'bg-green-500' :
                    s.level >= 60 ? 'bg-green-600' :
                    s.level >= 40 ? 'bg-yellow-600' :
                    'bg-red-600'
                  }`}
                  style={{ width: `${s.level}%` }}
                />
              </div>
              <span className="text-green-700">]</span>
              <span className="text-gray-500 w-8 text-right">{s.level}%</span>
            </div>
            {s.years && (
              <span className="text-gray-600 text-xs">{s.years}y</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceView({ exp }: { exp: Experience }) {
  const achievements = exp.highlights || exp.achievements || [];

  return (
    <div className="space-y-3">
      <div>
        <div className="text-green-400">{exp.role || exp.position}</div>
        <div className="text-cyan-500">{exp.company}</div>
        <div className="text-gray-600 text-xs">
          {exp.period} {exp.location && `• ${exp.location}`}
        </div>
      </div>

      <div className="text-gray-400 border-l-2 border-green-900 pl-2">
        {exp.description}
      </div>

      {achievements.length > 0 && (
        <div>
          <div className="text-green-600 text-xs uppercase mb-1">Achievements</div>
          <div className="space-y-1">
            {achievements.map((a, i) => (
              <div key={i} className="flex gap-2 text-gray-400">
                <span className="text-green-700">▹</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {exp.technologies && exp.technologies.length > 0 && (
        <div>
          <div className="text-green-600 text-xs uppercase mb-1">Tech</div>
          <div className="flex flex-wrap gap-1">
            {exp.technologies.map((tech, i) => (
              <span key={i} className="text-gray-500 border border-gray-800 px-1 text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EducationView({ edu }: { edu: Education }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-green-400">{edu.degree}</div>
        {edu.field && <div className="text-cyan-500">{edu.field}</div>}
        <div className="text-gray-400">{edu.institution}</div>
        <div className="text-gray-600 text-xs">{edu.period}</div>
      </div>

      {edu.gpa && (
        <div className="text-gray-400">
          GPA: <span className="text-green-400">{edu.gpa}</span>
        </div>
      )}

      {edu.achievements && edu.achievements.length > 0 && (
        <div>
          <div className="text-green-600 text-xs uppercase mb-1">Highlights</div>
          <div className="space-y-1">
            {edu.achievements.map((a, i) => (
              <div key={i} className="flex gap-2 text-gray-400">
                <span className="text-green-700">▹</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectView({ project }: { project: Project }) {
  const liveUrl = project.url || project.live;

  return (
    <div className="space-y-3">
      <div>
        <div className="text-green-400">{project.name}</div>
      </div>

      <div className="text-gray-400 border-l-2 border-green-900 pl-2">
        {project.description}
      </div>

      {(liveUrl || project.github) && (
        <div className="flex gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400 underline"
            >
              [view live ↗]
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-400 underline"
            >
              [source ↗]
            </a>
          )}
        </div>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <div>
          <div className="text-green-600 text-xs uppercase mb-1">Highlights</div>
          <div className="space-y-1">
            {project.highlights.map((h, i) => (
              <div key={i} className="flex gap-2 text-gray-400">
                <span className="text-green-700">▹</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {project.technologies && project.technologies.length > 0 && (
        <div>
          <div className="text-green-600 text-xs uppercase mb-1">Tech Stack</div>
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech, i) => (
              <span key={i} className="text-green-600 border border-green-900 px-1 text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HobbiesView({ hobby }: { hobby: Hobby }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-green-400 flex items-center gap-2">
          {hobby.icon && <span>{hobby.icon}</span>}
          {hobby.name}
        </div>
        {hobby.level && (
          <div className="text-gray-600 text-xs mt-1">{hobby.level}</div>
        )}
      </div>

      <div className="text-gray-400 border-l-2 border-green-900 pl-2">
        {hobby.description}
      </div>
    </div>
  );
}
