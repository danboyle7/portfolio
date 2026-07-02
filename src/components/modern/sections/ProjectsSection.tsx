"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "../SectionHeading";

type RepoSource = "github" | "gitlab" | "bitbucket";

interface Project {
  name: string;
  description: string;
  technologies: string[];
  status: string;
  repo?: string;
  repo_source?: RepoSource;
  live?: string;
  stars?: number;
  start_date?: string; // Format: YYYY-MM
  end_date?: string; // Format: YYYY-MM, omit for ongoing (shows "Present")
}

// Format date string (YYYY-MM) to readable format (e.g., "Jan 2024")
const formatProjectDate = (dateStr: string): string => {
  const [year, month] = dateStr.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = parseInt(month ?? "1", 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
};

// Calculate duration between two dates
const calculateDuration = (startDate: string, endDate?: string): string => {
  const [startYear, startMonth] = startDate.split("-").map(Number);
  const end = endDate
    ? endDate.split("-").map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1];
  const [endYear, endMonth] = end;

  if (!startYear || !startMonth || !endYear || !endMonth) return "";

  let months = (endYear - startYear) * 12 + (endMonth - startMonth);
  // Add 1 to include both start and end months
  months = Math.max(1, months + 1);

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} mo${remainingMonths !== 1 ? "s" : ""}`;
  } else if (remainingMonths === 0) {
    return `${years} yr${years !== 1 ? "s" : ""}`;
  } else {
    return `${years} yr${years !== 1 ? "s" : ""} ${remainingMonths} mo${remainingMonths !== 1 ? "s" : ""}`;
  }
};

// SVG icons for different repo sources
const RepoIcon = ({
  source,
  className,
}: {
  source?: RepoSource;
  className?: string;
}) => {
  switch (source) {
    case "gitlab":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 014.82 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0118.6 2a.43.43 0 01.58 0 .42.42 0 01.11.18l2.44 7.51L23 13.45a.84.84 0 01-.35.94z" />
        </svg>
      );
    case "bitbucket":
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z" />
        </svg>
      );
    case "github":
    default:
      return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
};

const getRepoLabel = (source?: RepoSource) => {
  switch (source) {
    case "gitlab":
      return "GitLab";
    case "bitbucket":
      return "Bitbucket";
    case "github":
    default:
      return "GitHub";
  }
};

const getRepoHoverColor = (source?: RepoSource) => {
  switch (source) {
    case "gitlab":
      return "hover:text-orange-400";
    case "bitbucket":
      return "hover:text-blue-500";
    case "github":
    default:
      return "hover:text-blue-400";
  }
};

interface ProjectsSectionProps {
  projects: Project[];
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "production":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "beta":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "development":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        variant="modal"
        size="none"
        rounded="lg"
        className="animate-in fade-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - fixed */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-800 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <svg
                className="h-6 w-6 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                {project.name}
              </h3>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs capitalize ${getStatusColor(project.status)}`}
              >
                {project.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Description */}
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-300">
              Description
            </h4>
            <div className="prose prose-sm prose-invert prose-headings:text-slate-300 prose-p:text-slate-400 prose-a:text-blue-400 prose-strong:text-slate-300 prose-code:rounded prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:text-blue-300 prose-pre:bg-slate-800 prose-li:text-slate-400 max-w-none text-slate-400">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.description}
              </ReactMarkdown>
            </div>
          </div>

          {/* Timeline */}
          {project.start_date && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-300">
                Timeline
              </h4>
              <div className="flex items-center gap-3 text-slate-400">
                <svg
                  className="h-5 w-5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {formatProjectDate(project.start_date)} -{" "}
                  {project.end_date
                    ? formatProjectDate(project.end_date)
                    : "Present"}
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  {calculateDuration(project.start_date, project.end_date)}
                </span>
              </div>
            </div>
          )}

          {/* Technologies */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-300">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          {project.stars !== undefined ? (
            <div className="flex items-center gap-6 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2 text-slate-400">
                <svg
                  className="h-5 w-5 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>{project.stars} stars</span>
              </div>
            </div>
          ) : !project.repo ? (
            <div className="flex items-center gap-6 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-2 text-slate-400">
                <svg
                  className="h-5 w-5 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Private Repository</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer - fixed, only show if there are links to display */}
        {(project.repo ?? project.live) && (
          <div className="flex shrink-0 items-center gap-3 border-t border-slate-800 bg-slate-900/50 p-6">
            {project.repo && (
              <a
                href={`https://${project.repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-white transition-colors hover:bg-slate-700"
              >
                <RepoIcon source={project.repo_source} className="h-5 w-5" />
                View on {getRepoLabel(project.repo_source)}
              </a>
            )}
            {project.live && (
              <a
                href={`https://${project.live}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-500"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Visit Live Site
              </a>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "production":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "beta":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "development":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <>
      <section id="projects" ref={sectionRef} className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          {/* Section Header */}
          <SectionHeading
            label="Projects"
            isVisible={isVisible}
            className="mb-16"
            title={
              <>
                Things I&apos;ve
                <span className="text-accent"> built</span>
              </>
            }
          />

          {/* Projects grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <Card
                key={index}
                variant="interactive"
                className={`group relative flex h-full cursor-pointer flex-col text-left ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => handleProjectClick(project)}
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Folder icon */}
                    <svg
                      className="h-10 w-10 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3">
                    {/* Repo icon based on source */}
                    {project.repo ? (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://${project.repo}`, "_blank");
                        }}
                        className={`text-slate-500 transition-colors ${getRepoHoverColor(project.repo_source)}`}
                      >
                        <RepoIcon
                          source={project.repo_source}
                          className="h-5 w-5"
                        />
                      </span>
                    ) : null}
                    {project.live && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://${project.live}`, "_blank");
                        }}
                        className="text-slate-500 transition-colors hover:text-blue-400"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>

                {/* Project name */}
                <h3 className="mb-2 text-xl font-semibold text-white transition-colors group-hover:text-blue-400">
                  {project.name}
                </h3>

                {/* Description */}
                <p className="mb-2 line-clamp-2 text-sm text-slate-400">
                  {project.description}
                </p>

                {/* Date & Duration */}
                {project.start_date && (
                  <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {formatProjectDate(project.start_date)} -{" "}
                      {project.end_date
                        ? formatProjectDate(project.end_date)
                        : "Present"}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">
                      {calculateDuration(project.start_date, project.end_date)}
                    </span>
                  </div>
                )}

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between border-t border-slate-800/50 pt-4">
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech, tIndex) => (
                      <span key={tIndex} className="text-xs text-slate-500">
                        {tech}
                        {tIndex <
                          Math.min(project.technologies.length, 3) - 1 && (
                          <span className="ml-2 text-slate-700">&bull;</span>
                        )}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-slate-600">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stars/Private & Status */}
                  <div className="flex items-center gap-3">
                    {project.stars !== undefined ? (
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {project.stars}
                      </div>
                    ) : !project.repo ? (
                      <span className="rounded-full border border-slate-600/30 bg-slate-600/10 px-2 py-0.5 text-xs text-slate-400">
                        Private
                      </span>
                    ) : null}
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs capitalize ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* View more link -- Commented out, but may add back in the future when I make more repos public on github */}
          {/* <div
            className={`mt-12 text-center transition-all delay-500 duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <a
              href="https://github.com/danboyle7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-blue-400"
            >
              <span>View more</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div> */}
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </>
  );
}
