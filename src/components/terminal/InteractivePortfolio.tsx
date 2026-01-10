'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getContentData } from '@/lib/terminal/file-system';

type PortfolioSection = 'skills' | 'experience' | 'education' | 'projects';

interface InteractivePortfolioProps {
  section: PortfolioSection;
  onExit: () => void;
  onBack?: () => void; // Back to hub
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Load data
  useEffect(() => {
    const content = getContentData(section);
    setData(content);
  }, [section]);

  // Focus container for keyboard events
  useEffect(() => {
    containerRef.current?.focus();
  }, [data]);

  const getItems = useCallback((): unknown[] => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data;
    }

    switch (section) {
      case 'skills':
        return (data as { categories?: SkillCategory[] })?.categories || [];
      case 'experience':
        return (data as { positions?: Experience[] })?.positions || [];
      case 'education':
        return (data as { schools?: Education[] })?.schools || [];
      case 'projects':
        return (data as { items?: Project[] })?.items || [];
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
      case 'Escape':
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
    }
  }, [getItems, onExit, onBack]);

  const items = getItems();
  const selectedItem = items[selectedIndex];

  const getSectionTitle = () => {
    switch (section) {
      case 'skills': return 'Technical Skills';
      case 'experience': return 'Work Experience';
      case 'education': return 'Education';
      case 'projects': return 'Projects';
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
      className="h-full flex flex-col outline-none bg-black"
    >
      {/* Header */}
      <div className="border border-green-700 mx-4 mt-4 px-4 py-3 flex items-center justify-between bg-green-950/30">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="px-3 py-1 text-sm border border-green-700 text-green-500 hover:bg-green-900/50 hover:text-green-300 transition-colors"
            >
              ← Back
            </button>
          )}
          <h1 className="text-lg text-green-400 tracking-wide">{getSectionTitle()}</h1>
        </div>
        <button
          onClick={onExit}
          className="px-3 py-1 text-sm border border-green-700 text-green-500 hover:bg-green-900/50 hover:text-green-300 transition-colors"
        >
          × Close
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden mx-4 border-x border-green-700">
        {/* Left sidebar - list */}
        <div className="w-72 border-r border-green-700 overflow-y-auto bg-black/50">
          <div className="p-2">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`
                  px-3 py-2 cursor-pointer transition-all border-l-2
                  ${selectedIndex === index
                    ? 'bg-green-900/50 text-green-300 border-green-400'
                    : 'text-gray-400 hover:bg-green-900/20 hover:text-green-400 border-transparent'
                  }
                `}
              >
                <ListItem section={section} item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Right panel - details */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/30">
          {selectedItem !== undefined && selectedItem !== null && (
            <DetailPanel section={section} item={selectedItem} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border border-green-700 mx-4 mb-4 px-4 py-2 text-xs text-gray-500 flex justify-between bg-green-950/30">
        <span>↑↓ or w/s to navigate • Click to select{onBack ? ' • b to go back' : ''}</span>
        <span>ESC or q to close</span>
      </div>
    </div>
  );
}

function ListItem({ section, item }: { section: PortfolioSection; item: unknown }) {
  switch (section) {
    case 'skills': {
      const skill = item as SkillCategory;
      return (
        <div>
          <div className="font-medium">{skill.name}</div>
          <div className="text-xs opacity-60">{skill.skills?.length || 0} skills</div>
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

function DetailPanel({ section, item }: { section: PortfolioSection; item: unknown }): React.ReactNode {
  switch (section) {
    case 'skills':
      return <SkillsDetail skill={item as SkillCategory} />;
    case 'experience':
      return <ExperienceDetail exp={item as Experience} />;
    case 'education':
      return <EducationDetail edu={item as Education} />;
    case 'projects':
      return <ProjectDetail project={item as Project} />;
    default:
      return null;
  }
}

function SkillsDetail({ skill }: { skill: SkillCategory }) {
  const skills = skill.skills || [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl text-green-400 border-b border-green-800 pb-2">
        {skill.name}
      </h2>

      <div className="space-y-4">
        {skills.map((s, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-200">{s.name}</span>
              <div className="flex items-center gap-3">
                {s.years && (
                  <span className="text-xs text-gray-500">{s.years} yrs</span>
                )}
                <span className="text-sm text-green-400 font-mono w-10 text-right">{s.level}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
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
    </div>
  );
}

function ExperienceDetail({ exp }: { exp: Experience }) {
  const achievements = exp.highlights || exp.achievements || [];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl text-green-400">{exp.role || exp.position}</h2>
        <div className="text-cyan-400">{exp.company}</div>
        <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
          <span>{exp.period}</span>
          {exp.location && (
            <>
              <span className="text-gray-700">|</span>
              <span>{exp.location}</span>
            </>
          )}
        </div>
      </div>

      <p className="text-gray-300 leading-relaxed">{exp.description}</p>

      {achievements.length > 0 && (
        <div>
          <h3 className="text-sm text-green-500 uppercase tracking-wider mb-2">Key Achievements</h3>
          <ul className="space-y-2">
            {achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-600 mt-0.5">▹</span>
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {exp.technologies && exp.technologies.length > 0 && (
        <div>
          <h3 className="text-sm text-green-500 uppercase tracking-wider mb-2">Technologies</h3>
          <div className="flex flex-wrap gap-2">
            {exp.technologies.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-gray-900 border border-gray-700 text-gray-400 text-xs"
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
    <div className="space-y-5">
      <div>
        <h2 className="text-xl text-green-400">{edu.degree}</h2>
        {edu.field && <div className="text-cyan-400">{edu.field}</div>}
        <div className="text-gray-300">{edu.institution}</div>
        <div className="text-sm text-gray-500 mt-1">{edu.period}</div>
      </div>

      {edu.gpa && (
        <div className="inline-block px-3 py-1 bg-green-900/30 border border-green-800">
          <span className="text-gray-400 text-sm">GPA: </span>
          <span className="text-green-300">{edu.gpa}</span>
        </div>
      )}

      {edu.achievements && edu.achievements.length > 0 && (
        <div>
          <h3 className="text-sm text-green-500 uppercase tracking-wider mb-2">Highlights</h3>
          <ul className="space-y-2">
            {edu.achievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-600 mt-0.5">▹</span>
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
  const liveUrl = project.url || project.live;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl text-green-400">{project.name}</h2>
      </div>

      <p className="text-gray-300 leading-relaxed">{project.description}</p>

      {(liveUrl || project.github) && (
        <div className="flex gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-green-700 text-green-400 hover:bg-green-900/30 transition-colors text-sm"
            >
              <span>View Live</span>
              <span className="text-xs">↗</span>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-700 text-gray-400 hover:bg-gray-900/30 hover:text-gray-300 transition-colors text-sm"
            >
              <span>Source</span>
              <span className="text-xs">↗</span>
            </a>
          )}
        </div>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <div>
          <h3 className="text-sm text-green-500 uppercase tracking-wider mb-2">Highlights</h3>
          <ul className="space-y-2">
            {project.highlights.map((highlight, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-600 mt-0.5">▹</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.technologies && project.technologies.length > 0 && (
        <div>
          <h3 className="text-sm text-green-500 uppercase tracking-wider mb-2">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-green-900/30 border border-green-800 text-green-300 text-xs"
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
