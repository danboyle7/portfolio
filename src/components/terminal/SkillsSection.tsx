"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { getContentData } from "@/lib/terminal/file-system";

interface SkillsSectionProps {
  onExit: () => void;
  onBack?: () => void;
}

interface Skill {
  name: string;
  years?: number;
}

interface SkillCategory {
  name: string;
  icon?: string;
  skills: Skill[];
}

export function SkillsSection({ onExit, onBack }: SkillsSectionProps) {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use requestAnimationFrame to batch state update and avoid React Compiler warning
    const frame = requestAnimationFrame(() => {
      const data = getContentData("skills") as
        | { categories?: SkillCategory[] }
        | SkillCategory[];
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data?.categories) {
        setCategories(data.categories);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, [categories]);

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
        case "Escape":
          e.preventDefault();
          setSelectedCategory(null);
          break;
        case "o":
        case "O":
          e.preventDefault();
          setSortOrder((s) =>
            s === "none" ? "desc" : s === "desc" ? "asc" : "none",
          );
          break;
      }
    },
    [onExit, onBack],
  );

  // Get all skills or filtered by category, then sort
  const displayedSkills = useMemo(() => {
    let skills = selectedCategory
      ? (categories.find((c) => c.name === selectedCategory)?.skills ?? [])
      : categories.flatMap((c) =>
          c.skills.map((s) => ({ ...s, category: c.name })),
        );

    if (sortOrder === "asc") {
      skills = [...skills].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      skills = [...skills].sort((a, b) => b.name.localeCompare(a.name));
    }

    return skills;
  }, [categories, selectedCategory, sortOrder]);

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
          <span className="font-bold text-green-400">SKILLS</span>
          <span className="text-green-500">─┐</span>
          <span className="text-xs text-gray-600">
            ({displayedSkills.length})
          </span>
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

      {/* Filter bar */}
      <div className="flex shrink-0 flex-wrap items-center gap-1 bg-green-950/20 px-2 py-1">
        <span className="mr-1 text-[10px] text-gray-600">Filter:</span>
        <button
          onClick={() => setSelectedCategory(null)}
          className={`cursor-pointer border px-1.5 py-px text-[10px] transition-colors ${
            selectedCategory === null
              ? "border-green-500 bg-green-900/50 text-green-300"
              : "border-green-900 text-gray-500 hover:border-green-700 hover:text-green-400"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() =>
              setSelectedCategory(
                cat.name === selectedCategory ? null : cat.name,
              )
            }
            className={`cursor-pointer border px-1.5 py-px text-[10px] transition-colors ${
              selectedCategory === cat.name
                ? "border-green-500 bg-green-900/50 text-green-300"
                : "border-green-900 text-gray-500 hover:border-green-700 hover:text-green-400"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sort button */}
      <div className="flex shrink-0 items-center gap-2 bg-green-950/10 px-2 py-1">
        <span className="text-[10px] text-gray-600">Sort:</span>
        <button
          onClick={() =>
            setSortOrder((s) =>
              s === "none" ? "desc" : s === "desc" ? "asc" : "none",
            )
          }
          className={`cursor-pointer border px-1.5 py-px text-[10px] transition-colors ${
            sortOrder !== "none"
              ? "border-green-500 bg-green-900/50 text-green-300"
              : "border-green-900 text-gray-500 hover:border-green-700 hover:text-green-400"
          }`}
        >
          {sortOrder === "none"
            ? "None"
            : sortOrder === "desc"
              ? "↓ Z to A"
              : "↑ A to Z"}
        </button>
        <span className="text-[10px] text-gray-600">[o]</span>
      </div>

      {/* Separator */}
      <div className="border-b border-green-900" />

      {/* Skills grid - max 4 columns */}
      <div className="flex-1 overflow-auto p-2">
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4">
          {displayedSkills.map((skill, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-1 border border-green-900 p-1.5 transition-colors hover:border-green-700 hover:bg-green-950/20"
            >
              <span className="truncate text-xs text-green-400">
                <span className="text-green-700">›</span> {skill.name}
              </span>
              {skill.years && (
                <span className="shrink-0 text-[9px] text-gray-600">
                  {skill.years}y
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 flex-wrap gap-x-3 border-t border-green-800 px-2 py-1 text-gray-600">
        <span>
          <span className="text-green-700">[esc]</span> clear
        </span>
        <span>
          <span className="text-green-700">[o]</span> sort
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
