// Terminal types and interfaces

export interface TerminalLine {
  id: string;
  type:
    | "input"
    | "output"
    | "error"
    | "system"
    | "ascii"
    | "success"
    | "warning";
  content: string;
  timestamp: Date;
  isHtml?: boolean;
  delay?: number;
  className?: string;
}

export interface AnimatedLine {
  line: TerminalLine;
  delay: number; // Delay before showing this line (in ms)
}

export interface InteractiveMode {
  type:
    | "blog"
    | "search"
    | "snake"
    | "echo"
    | "portfolio"
    | "hub"
    | "contact"
    | "sl"
    | "vim"
    | null;
  data?: unknown;
  section?: "skills" | "experience" | "education" | "projects" | "hobbies";
}

export interface CommandResult {
  output: TerminalLine[];
  clearScreen?: boolean;
  changeDirectory?: string;
  triggerEffect?:
    | "matrix"
    | "glitch"
    | "reboot"
    | "hacker"
    | "destroy"
    | "cowsay"
    | "exit";
  animatedOutput?: AnimatedLine[]; // For step-by-step animation
  enterInteractiveMode?: InteractiveMode; // Enter an interactive TUI mode
  openUrl?: string; // Open a URL in a new tab
  clearHistory?: boolean; // Clear command history
  resetTerminal?: boolean; // Full reset (history + files + screen)
}

export interface Command {
  name: string;
  description: string;
  usage: string;
  aliases?: string[];
  hidden?: boolean;
  execute: (
    args: string[],
    context: CommandContext,
  ) => Promise<CommandResult> | CommandResult;
}

export interface CommandContext {
  currentPath: string;
  fileSystem: FileSystemNode;
  history: string[];
  env: Record<string, string>;
  user: string;
  hostname: string;
}

export interface FileSystemNode {
  name: string;
  type: "directory" | "file" | "executable" | "symlink";
  permissions: string;
  owner: string;
  size: string;
  modified: string;
  content?: string | ContentData;
  children?: Record<string, FileSystemNode>;
  target?: string; // For symlinks
}

export interface ContentData {
  type:
    | "experience"
    | "skills"
    | "education"
    | "hobbies"
    | "blog"
    | "contact"
    | "about"
    | "projects";
  data: unknown;
}

// Experience types
export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
  logo?: string;
}

// Skills types
export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  years?: number;
  icon?: string;
}

// Education types
export interface Education {
  institution: string;
  degree: string;
  field: string;
  period: string;
  location: string;
  gpa?: string;
  highlights?: string[];
  logo?: string;
}

// Blog types
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  readTime: string;
  image?: string; // Hero image for modern blog view
  author?: string; // Author name
}

// Contact types
export interface ContactInfo {
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
  website?: string;
  locations: string[];
  availability: string;
}

// Hobby types
export interface Hobby {
  name: string;
  icon: string;
  description: string;
  level?: string;
}

// About types
export interface About {
  name: string;
  title: string;
  tagline: string;
  bio: string[];
  avatar?: string;
  resumeUrl?: string;
}

// Terminal state
export interface TerminalState {
  lines: TerminalLine[];
  currentPath: string;
  commandHistory: string[];
  historyIndex: number;
  isBooting: boolean;
  currentEffect: string | null;
  inputEnabled: boolean;
}

// Boot sequence step
export interface BootStep {
  text: string;
  delay: number;
  type: "info" | "success" | "warning" | "loading" | "complete" | "ascii";
  progress?: number;
}

// Vim mode data passed to VimEditor
export interface VimModeData {
  filePath: string;
  initialContent: string;
  isReadOnly?: boolean;
  isNewFile?: boolean;
  showSplash?: boolean;
}
