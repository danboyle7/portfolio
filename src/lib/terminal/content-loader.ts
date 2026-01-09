// Content loader for YAML files
// This module loads content from YAML files in the /content directory

import { setContentCache } from './file-system';

// Content types
interface ContentMap {
  about: unknown;
  experience: unknown;
  skills: unknown;
  education: unknown;
  hobbies: unknown;
  contact: unknown;
  blog: unknown;
  projects: unknown;
}

// Static imports of YAML content
// In production, these would be loaded from the file system
// For client-side, we embed them at build time

const defaultContent: ContentMap = {
  about: {
    name: "Daniel Boyle",
    title: "Full-Stack Developer",
    tagline: "Building the future, one commit at a time",
    bio: [
      "Passionate software engineer with 6+ years of experience building web applications and scalable systems.",
      "I love creating elegant solutions to complex problems, contributing to open source, and mentoring other developers.",
      "When I'm not coding, you'll find me exploring new technologies, hiking in the mountains, or working on side projects.",
    ],
  },
  experience: [
    {
      company: "Tech Innovations Inc.",
      role: "Senior Full-Stack Developer",
      period: "2022 - Present",
      location: "San Francisco, CA",
      description: "Leading development of cloud-native applications and mentoring junior developers.",
      highlights: [
        "Architected microservices handling 1M+ requests/day",
        "Reduced deployment time by 60% with CI/CD improvements",
        "Led team of 5 developers on flagship product rewrite",
      ],
      technologies: ["TypeScript", "React", "Node.js", "AWS", "PostgreSQL"],
    },
    {
      company: "StartupXYZ",
      role: "Full-Stack Developer",
      period: "2020 - 2022",
      location: "Remote",
      description: "Built and scaled a SaaS platform from 0 to 50,000 users.",
      highlights: [
        "Implemented real-time collaboration features",
        "Built payment integration handling $500K+ MRR",
        "Optimized database queries reducing load times by 40%",
      ],
      technologies: ["JavaScript", "Vue.js", "Python", "Django", "MongoDB"],
    },
    {
      company: "Digital Agency Co.",
      role: "Frontend Developer",
      period: "2018 - 2020",
      location: "New York, NY",
      description: "Developed responsive web applications for enterprise clients.",
      highlights: [
        "Delivered 20+ client projects on time and within budget",
        "Introduced component library reducing dev time by 30%",
        "Mentored 3 junior developers",
      ],
      technologies: ["React", "TypeScript", "CSS", "Node.js"],
    },
  ],
  skills: [
    {
      name: "Languages",
      icon: "💻",
      skills: [
        { name: "TypeScript", level: 95 },
        { name: "JavaScript", level: 95 },
        { name: "Python", level: 85 },
        { name: "Rust", level: 70 },
        { name: "Go", level: 65 },
        { name: "SQL", level: 85 },
      ],
    },
    {
      name: "Frameworks",
      icon: "🚀",
      skills: [
        { name: "React", level: 95 },
        { name: "Next.js", level: 95 },
        { name: "Node.js", level: 90 },
        { name: "Express", level: 85 },
        { name: "FastAPI", level: 75 },
        { name: "Tailwind CSS", level: 90 },
      ],
    },
    {
      name: "Tools & DevOps",
      icon: "🔧",
      skills: [
        { name: "Git", level: 95 },
        { name: "Docker", level: 85 },
        { name: "Kubernetes", level: 70 },
        { name: "AWS", level: 80 },
        { name: "CI/CD", level: 85 },
        { name: "Linux", level: 85 },
      ],
    },
    {
      name: "Databases",
      icon: "🗄️",
      skills: [
        { name: "PostgreSQL", level: 90 },
        { name: "MongoDB", level: 80 },
        { name: "Redis", level: 75 },
        { name: "SQLite", level: 85 },
      ],
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      period: "2014 - 2018",
      location: "San Francisco, CA",
      gpa: "3.8",
      highlights: [
        "Dean's List all semesters",
        "Senior capstone: Distributed systems project",
        "Teaching assistant for Data Structures course",
      ],
    },
    {
      institution: "Professional Certifications",
      degree: "Industry Certifications",
      field: "Cloud & DevOps",
      period: "2018 - Present",
      location: "Online",
      highlights: [
        "AWS Solutions Architect Associate",
        "Google Cloud Professional Developer",
        "Kubernetes Administrator (CKA)",
      ],
    },
  ],
  hobbies: [
    { name: "Open Source", icon: "🌐", description: "Contributing to open source projects" },
    { name: "Gaming", icon: "🎮", description: "Strategy and puzzle games" },
    { name: "Reading", icon: "📚", description: "Tech books and sci-fi novels" },
    { name: "Hiking", icon: "🥾", description: "Exploring nature and mountains" },
  ],
  contact: {
    email: "hello@danielboyle.dev",
    github: "github.com/danielboyle",
    linkedin: "linkedin.com/in/danielboyle",
    twitter: "twitter.com/danielboyle",
    website: "danielboyle.dev",
    location: "San Francisco, CA",
    availability: "Open to opportunities",
  },
  blog: [
    {
      slug: "building-terminal-portfolio",
      title: "Building a Terminal-Style Portfolio with Next.js",
      date: "2024-01-15",
      excerpt: "How I created this unique terminal-inspired portfolio website.",
      tags: ["Next.js", "TypeScript", "Portfolio"],
      content: "Full article content...",
      readTime: "8 min read",
    },
    {
      slug: "typescript-best-practices",
      title: "TypeScript Best Practices for 2024",
      date: "2024-01-10",
      excerpt: "A comprehensive guide to writing clean TypeScript code.",
      tags: ["TypeScript", "Best Practices"],
      content: "Full article content...",
      readTime: "12 min read",
    },
  ],
  projects: [
    {
      name: "terminal-portfolio",
      description: "This terminal-style portfolio you're viewing right now!",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      status: "production",
      github: "github.com/danielboyle/terminal-portfolio",
      live: "danielboyle.dev",
      stars: 42,
    },
    {
      name: "cloud-sync",
      description: "Real-time file synchronization service",
      technologies: ["Rust", "gRPC", "PostgreSQL"],
      status: "production",
      github: "github.com/danielboyle/cloud-sync",
      stars: 128,
    },
    {
      name: "api-gateway",
      description: "High-performance API gateway with rate limiting",
      technologies: ["Go", "Redis", "Kubernetes"],
      status: "production",
      github: "github.com/danielboyle/api-gateway",
      stars: 256,
    },
  ],
};

/**
 * Initialize content from YAML files
 * In production with Decap CMS, this would read from the filesystem
 * For now, we use embedded default content
 */
export function initializeContent(): void {
  setContentCache(defaultContent as unknown as Record<string, unknown>);
}

/**
 * Load content from YAML file (server-side only)
 * This is used during build time to load content from files
 */
export async function loadYamlContent(): Promise<ContentMap> {
  // In a server context with file system access, this would:
  // 1. Read YAML files from /content directory
  // 2. Parse them with a YAML library
  // 3. Return the parsed content
  
  // For now, return default content
  return defaultContent;
}

export { defaultContent };

