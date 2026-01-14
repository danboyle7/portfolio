"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { getContentData } from "@/lib/terminal/file-system";

type PortfolioSection =
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "hobbies";

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

export function InteractivePortfolio({
  section,
  onExit,
  onBack,
}: InteractivePortfolioProps) {
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
      case "skills":
        return (data as { categories?: SkillCategory[] })?.categories || [];
      case "experience":
        return (data as { positions?: Experience[] })?.positions || [];
      case "education":
        return (data as { schools?: Education[] })?.schools || [];
      case "projects":
        return (data as { items?: Project[] })?.items || [];
      case "hobbies":
        return (data as { items?: Hobby[] })?.items || [];
      default:
        return [];
    }
  }, [data, section]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = getItems();

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(0, prev - 1));
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(items.length - 1, prev + 1));
          break;
        case "q":
          e.preventDefault();
          onExit();
          break;
        case "Backspace":
        case "b":
          if (onBack) {
            e.preventDefault();
            onBack();
          }
          break;
        case "r":
        case "R":
          e.preventDefault();
          setReversed((prev) => !prev);
          setSelectedIndex(0);
          break;
      }
    },
    [getItems, onExit, onBack],
  );

  const rawItems = getItems();
  const items = reversed ? [...rawItems].reverse() : rawItems;
  const selectedItem = items[selectedIndex];

  const getSectionTitle = () => {
    switch (section) {
      case "skills":
        return "SKILLS";
      case "experience":
        return "EXPERIENCE";
      case "education":
        return "EDUCATION";
      case "projects":
        return "PROJECTS";
      case "hobbies":
        return "HOBBIES";
    }
  };

  const getItemName = (item: unknown): string => {
    switch (section) {
      case "skills":
        return (item as SkillCategory).name;
      case "experience":
        return (item as Experience).role || (item as Experience).position || "";
      case "education":
        return (item as Education).degree;
      case "projects":
        return (item as Project).name;
      case "hobbies":
        return (item as Hobby).name;
      default:
        return "";
    }
  };

  if (!data) {
    return (
      <div className="terminal-text flex h-full items-center justify-center font-mono text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="terminal-text flex h-full flex-col bg-black font-mono outline-none"
    >
      {/* TUI Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-green-800 px-2 py-1">
        <div className="flex items-center gap-2">
          <span className="text-green-500">┌─</span>
          <span className="font-bold text-green-400">{getSectionTitle()}</span>
          <span className="text-green-500">─┐</span>
          <span className="text-xs text-gray-600">({items.length} items)</span>
          <button
            onClick={() => {
              setReversed((r) => !r);
              setSelectedIndex(0);
            }}
            className={`cursor-pointer text-xs transition-colors ${reversed ? "text-green-400" : "text-gray-600 hover:text-green-400"}`}
            title="Reverse order"
          >
            [r] {reversed ? "↑" : "↓"}
          </button>
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

      {/* Main TUI content */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        {/* Left: Item list - auto width */}
        <div className="shrink-0 overflow-auto border-b border-green-900 md:border-r md:border-b-0">
          <div className="py-1">
            {items.map((item, index) => {
              const isSelected = index === selectedIndex;
              const name = getItemName(item);
              return (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`flex cursor-pointer items-center gap-2 px-2 py-1 whitespace-nowrap transition-colors ${
                    isSelected
                      ? "bg-green-900/50 text-green-300"
                      : "text-gray-500 hover:bg-green-900/20 hover:text-green-400"
                  } `}
                >
                  <span
                    className={isSelected ? "text-green-400" : "text-gray-700"}
                  >
                    {isSelected ? "▸" : "│"}
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
      <div className="flex shrink-0 flex-wrap gap-x-3 border-t border-green-800 px-2 py-1 text-gray-600">
        <span>
          <span className="text-green-700">[↑↓]</span> nav
        </span>
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

function DetailView({
  section,
  item,
}: {
  section: PortfolioSection;
  item: unknown;
}): React.ReactNode {
  switch (section) {
    case "skills":
      return <SkillsView skill={item as SkillCategory} />;
    case "experience":
      return <ExperienceView exp={item as Experience} />;
    case "education":
      return <EducationView edu={item as Education} />;
    case "projects":
      return <ProjectView project={item as Project} />;
    case "hobbies":
      return <HobbiesView hobby={item as Hobby} />;
    default:
      return null;
  }
}

function SkillsView({ skill }: { skill: SkillCategory }) {
  const skills = skill.skills || [];

  return (
    <div className="space-y-4">
      <div className="border-b border-green-900 pb-1 text-green-400">
        ── {skill.name} ──
      </div>

      <div className="space-y-2">
        {skills.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-32 truncate text-gray-300">{s.name}</span>
            <div className="flex flex-1 items-center gap-1">
              <span className="text-green-700">[</span>
              <div className="relative h-2 flex-1 bg-gray-900">
                <div
                  className={`h-full ${
                    s.level >= 80
                      ? "bg-green-500"
                      : s.level >= 60
                        ? "bg-green-600"
                        : s.level >= 40
                          ? "bg-yellow-600"
                          : "bg-red-600"
                  }`}
                  style={{ width: `${s.level}%` }}
                />
              </div>
              <span className="text-green-700">]</span>
              <span className="w-8 text-right text-gray-500">{s.level}%</span>
            </div>
            {s.years && (
              <span className="text-xs text-gray-600">{s.years}y</span>
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
        <div className="text-xs text-gray-600">
          {exp.period} {exp.location && `• ${exp.location}`}
        </div>
      </div>

      <div className="border-l-2 border-green-900 pl-2 text-gray-400">
        {exp.description}
      </div>

      {achievements.length > 0 && (
        <div>
          <div className="mb-1 text-xs text-green-600 uppercase">
            Achievements
          </div>
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
          <div className="mb-1 text-xs text-green-600 uppercase">Tech</div>
          <div className="flex flex-wrap gap-1">
            {exp.technologies.map((tech, i) => (
              <span
                key={i}
                className="border border-gray-800 px-1 text-xs text-gray-500"
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

function EducationView({ edu }: { edu: Education }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-green-400">{edu.degree}</div>
        {edu.field && <div className="text-cyan-500">{edu.field}</div>}
        <div className="text-gray-400">{edu.institution}</div>
        <div className="text-xs text-gray-600">{edu.period}</div>
      </div>

      {edu.gpa && (
        <div className="text-gray-400">
          GPA: <span className="text-green-400">{edu.gpa}</span>
        </div>
      )}

      {edu.achievements && edu.achievements.length > 0 && (
        <div>
          <div className="mb-1 text-xs text-green-600 uppercase">
            Highlights
          </div>
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

      <div className="border-l-2 border-green-900 pl-2 text-gray-400">
        {project.description}
      </div>

      {(liveUrl || project.github) && (
        <div className="flex gap-3">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 underline hover:text-green-400"
            >
              [view live ↗]
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 underline hover:text-gray-400"
            >
              [source ↗]
            </a>
          )}
        </div>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <div>
          <div className="mb-1 text-xs text-green-600 uppercase">
            Highlights
          </div>
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
          <div className="mb-1 text-xs text-green-600 uppercase">
            Tech Stack
          </div>
          <div className="flex flex-wrap gap-1">
            {project.technologies.map((tech, i) => (
              <span
                key={i}
                className="border border-green-900 px-1 text-xs text-green-600"
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

function HobbiesView({ hobby }: { hobby: Hobby }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-2 text-green-400">
          {hobby.icon && <span>{hobby.icon}</span>}
          {hobby.name}
        </div>
        {hobby.level && (
          <div className="mt-1 text-xs text-gray-600">{hobby.level}</div>
        )}
      </div>

      <div className="border-l-2 border-green-900 pl-2 text-gray-400">
        {hobby.description}
      </div>
    </div>
  );
}
