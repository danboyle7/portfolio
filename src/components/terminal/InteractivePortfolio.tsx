'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getContentData } from '@/lib/terminal/file-system';

type PortfolioSection = 'skills' | 'experience' | 'education' | 'projects';

interface InteractivePortfolioProps {
  section: PortfolioSection;
  onExit: () => void;
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
  items?: string[]; // fallback
}

interface Experience {
  company: string;
  role: string;
  position?: string; // alias for role
  period: string;
  location?: string;
  description: string;
  highlights?: string[];
  achievements?: string[]; // alias for highlights
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
  highlights?: string[];
}

export function InteractivePortfolio({ section, onExit }: InteractivePortfolioProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load data
  useEffect(() => {
    const content = getContentData(section);
    setData(content);
  }, [section]);

  // Focus container for keyboard events
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = getItems();

    switch (e.key) {
      case 'ArrowUp':
      case 'k':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowDown':
      case 'j':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(items.length - 1, prev + 1));
        break;
      case 'Escape':
      case 'q':
        e.preventDefault();
        onExit();
        break;
    }
  }, [onExit]);

  const getItems = (): unknown[] => {
    if (!data) return [];

    // Data is usually an array directly, or has nested structure
    if (Array.isArray(data)) {
      return data;
    }

    // Handle nested structures if needed
    switch (section) {
      case 'skills':
        return (data as { categories?: SkillCategory[] })?.categories || (data as unknown[]) || [];
      case 'experience':
        return (data as { positions?: Experience[] })?.positions || (data as unknown[]) || [];
      case 'education':
        return (data as { schools?: Education[] })?.schools || (data as unknown[]) || [];
      case 'projects':
        return (data as { items?: Project[] })?.items || (data as unknown[]) || [];
      default:
        return [];
    }
  };

  const items = getItems();
  const selectedItem = items[selectedIndex];

  const getSectionTitle = () => {
    switch (section) {
      case 'skills': return 'TECHNICAL SKILLS';
      case 'experience': return 'WORK EXPERIENCE';
      case 'education': return 'EDUCATION';
      case 'projects': return 'PROJECTS';
    }
  };

  const getSectionIcon = () => {
    switch (section) {
      case 'skills': return '⚡';
      case 'experience': return '💼';
      case 'education': return '🎓';
      case 'projects': return '🚀';
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="h-full flex flex-col outline-none bg-black/95"
    >
      {/* Header */}
      <div className="border-b border-green-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getSectionIcon()}</span>
          <h1 className="text-xl font-bold text-green-400">{getSectionTitle()}</h1>
        </div>
        <button
          onClick={onExit}
          className="px-3 py-1 text-sm border border-green-700 text-green-500 hover:bg-green-900/50 hover:text-green-300 transition-colors rounded"
        >
          ESC to Exit
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - list */}
        <div className="w-72 border-r border-green-800 overflow-y-auto">
          <div className="p-2">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(index)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`
                  px-3 py-2 cursor-pointer rounded transition-all
                  ${selectedIndex === index
                    ? 'bg-green-900/60 text-green-300 border-l-2 border-green-400'
                    : 'text-gray-400 hover:bg-green-900/30 hover:text-green-400 border-l-2 border-transparent'
                  }
                `}
              >
                {renderListItem(section, item, index)}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel - details */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedItem && renderDetails(section, selectedItem)}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-green-800 px-4 py-2 text-xs text-gray-500 flex justify-between">
        <span>↑↓ or j/k to navigate • Click to select</span>
        <span>ESC or q to exit</span>
      </div>
    </div>
  );
}

function renderListItem(section: PortfolioSection, item: unknown, index: number): React.ReactNode {
  switch (section) {
    case 'skills': {
      const skill = item as SkillCategory;
      return (
        <div>
          <div className="font-medium">{skill.icon} {skill.name}</div>
          <div className="text-xs opacity-60">{skill.skills?.length || skill.items?.length || 0} skills</div>
        </div>
      );
    }
    case 'experience': {
      const exp = item as Experience;
      return (
        <div>
          <div className="font-medium truncate">{exp.role || exp.position}</div>
          <div className="text-xs opacity-60 truncate">{exp.company}</div>
        </div>
      );
    }
    case 'education': {
      const edu = item as Education;
      return (
        <div>
          <div className="font-medium truncate">{edu.degree}</div>
          <div className="text-xs opacity-60 truncate">{edu.institution}</div>
        </div>
      );
    }
    case 'projects': {
      const proj = item as Project;
      return (
        <div>
          <div className="font-medium truncate">{proj.name}</div>
          <div className="text-xs opacity-60 truncate">{proj.technologies?.slice(0, 3).join(', ')}</div>
        </div>
      );
    }
  }
}

function renderDetails(section: PortfolioSection, item: unknown): React.ReactNode {
  switch (section) {
    case 'skills':
      return <SkillsDetail skill={item as SkillCategory} />;
    case 'experience':
      return <ExperienceDetail exp={item as Experience} />;
    case 'education':
      return <EducationDetail edu={item as Education} />;
    case 'projects':
      return <ProjectDetail project={item as Project} />;
  }
}

function SkillsDetail({ skill }: { skill: SkillCategory }) {
  const skills = skill.skills || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-400">
        {skill.icon} {skill.name}
      </h2>

      <div className="space-y-4">
        {skills.map((s, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-200 font-medium">{s.name}</span>
              <div className="flex items-center gap-3">
                {s.years && (
                  <span className="text-xs text-gray-500">{s.years} yrs</span>
                )}
                <span className="text-sm text-green-400 font-mono">{s.level}%</span>
              </div>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  s.level >= 90 ? 'bg-green-500' :
                  s.level >= 70 ? 'bg-green-600' :
                  s.level >= 50 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${s.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fallback for simple string arrays */}
      {skill.items && skill.items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {skill.items.map((item, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-green-900/40 border border-green-700 text-green-300 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ExperienceDetail({ exp }: { exp: Experience }) {
  const achievements = exp.highlights || exp.achievements || [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-green-400">{exp.role || exp.position}</h2>
        <div className="text-lg text-cyan-400">{exp.company}</div>
        <div className="text-sm text-gray-400 flex items-center gap-3 mt-1">
          <span>{exp.period}</span>
          {exp.location && (
            <>
              <span className="text-gray-600">•</span>
              <span>{exp.location}</span>
            </>
          )}
        </div>
      </div>

      <p className="text-gray-300 leading-relaxed">{exp.description}</p>

      {achievements.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wide mb-2">Key Achievements</h3>
          <ul className="space-y-2">
            {achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-500 mt-1">▸</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {exp.technologies && exp.technologies.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wide mb-2">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {exp.technologies.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-800 border border-gray-700 text-gray-300 rounded text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EducationDetail({ edu }: { edu: Education }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-green-400">{edu.degree}</h2>
        {edu.field && <div className="text-lg text-cyan-400">{edu.field}</div>}
        <div className="text-lg text-gray-300">{edu.institution}</div>
        <div className="text-sm text-gray-400 mt-1">{edu.period}</div>
      </div>

      {edu.gpa && (
        <div className="inline-block px-3 py-1 bg-green-900/40 border border-green-700 rounded">
          <span className="text-gray-400 text-sm">GPA: </span>
          <span className="text-green-300 font-semibold">{edu.gpa}</span>
        </div>
      )}

      {edu.achievements && edu.achievements.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wide mb-2">Highlights</h3>
          <ul className="space-y-2">
            {edu.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-500 mt-1">▸</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ProjectDetail({ project }: { project: Project }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-green-400">{project.name}</h2>
      </div>

      <p className="text-gray-300 leading-relaxed">{project.description}</p>

      {(project.url || project.github) && (
        <div className="flex gap-4">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-800/50 hover:bg-green-700/50 border border-green-600 rounded text-green-300 transition-colors"
            >
              <span>🔗</span>
              <span>Live Demo</span>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 rounded text-gray-300 transition-colors"
            >
              <span>📂</span>
              <span>Source Code</span>
            </a>
          )}
        </div>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wide mb-2">Highlights</h3>
          <ul className="space-y-2">
            {project.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-500 mt-1">▸</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.technologies && project.technologies.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-green-500 uppercase tracking-wide mb-2">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-green-900/40 border border-green-700 text-green-300 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

