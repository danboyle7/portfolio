/**
 * Generates skill icons for the portfolio.
 *
 * For each skill in content/skills.yaml this script resolves an icon from one
 * of three tiers, in order:
 *   1. `devicon` — real, full-color brand logos (Python, PostgreSQL, React…).
 *   2. `simple-icons` — single-color brand marks for brands that are inherently
 *      monochrome or whose devicon logo is pure black (Vercel, Next.js, Claude,
 *      Ollama…). Dark marks are lightened so they read on the dark cards.
 *   3. `lucide-static` — clean fallback glyphs for concepts and brands with no
 *      trademarked icon (SQL, JTAG, the AI specializations…).
 *
 * Output:
 *   - public/skills/*.svg               (the icon files, referenced via <img>)
 *   - src/lib/skill-icons.generated.ts  (name -> { src, color, brand } map)
 *
 * Run with: pnpm run generate-skill-icons
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import * as simpleIcons from "simple-icons";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SKILLS_YAML = path.join(ROOT, "content", "skills.yaml");
const OUT_DIR = path.join(ROOT, "public", "skills");
const LUCIDE_DIR = path.join(ROOT, "node_modules", "lucide-static", "icons");
const DEVICON_DIR = path.join(ROOT, "node_modules", "devicon", "icons");
const LOBEHUB_DIR = path.join(
  ROOT,
  "node_modules",
  "@lobehub",
  "icons-static-svg",
  "icons",
);
const MAP_OUT = path.join(ROOT, "src", "lib", "skill-icons.generated.ts");

const ACCENT = "#38BDF8"; // sky-400, default tint for fallback icons
const LIGHT = "#E8EAED"; // used when a brand color is too dark for a dark card

// Tier 1 — full-color devicon logos. Value is the icon file's base name; the
// folder is derived from it (everything before "-original"/"-plain").
const DEVICON: Record<string, string> = {
  Python: "python-original",
  "C++": "cplusplus-original",
  C: "c-original",
  TypeScript: "typescript-original",
  Java: "java-original",
  "C#": "csharp-original",
  Bash: "bash-original",
  Matlab: "matlab-original",
  PyTorch: "pytorch-original",
  "TensorFlow/Keras": "tensorflow-original",
  NumPy: "numpy-original",
  Pandas: "pandas-original",
  "Scikit-learn": "scikitlearn-original",
  React: "react-original",
  "Vue.js": "vuejs-original",
  FastAPI: "fastapi-original",
  Vite: "vitejs-original",
  TailwindCSS: "tailwindcss-original",
  "Spring Boot": "spring-original",
  "Git/GitLab/GitHub": "git-original",
  Docker: "docker-original",
  Jenkins: "jenkins-original",
  Jira: "jira-original",
  "CI/CD Pipelines": "githubactions-original",
  Sentry: "sentry-original",
  PostgreSQL: "postgresql-original",
  SQLite: "sqlite-original",
  SQLAlchemy: "sqlalchemy-original",
  Redis: "redis-original",
  "Cloudflare R2": "cloudflare-original",
  Linux: "linux-original",
  Windows: "windows11-original",
  AWS: "amazonwebservices-original-wordmark",
};

// Tier 2 — single-color simple-icons brand marks (dark ones auto-lightened).
const BRAND: Record<string, string> = {
  Rust: "rust",
  Ada: "ada",
  LaTeX: "latex",
  SciPy: "scipy",
  Ray: "ray",
  MLFlow: "mlflow",
  LangChain: "langchain",
  "Next.js": "nextdotjs",
  Flask: "flask",
  "React Three Fiber": "threedotjs",
  "Three.js": "threedotjs",
  "GDB/PDB": "gnu",
  Vercel: "vercel",
  Drizzle: "drizzle",
  Convex: "convex",
  MCP: "modelcontextprotocol",
  "Claude Code": "claude",
  Cursor: "cursor",
  OpenCode: "opencode",
  Ollama: "ollama",
  vLLM: "vllm",
  macOS: "apple",
};

// Tier 2b — lobehub AI-brand logos (for marks the other libraries dropped).
// `recolor` fills a monochrome (currentColor) mark with `color`.
const LOBEHUB: Record<
  string,
  { file: string; color: string; recolor?: boolean }
> = {
  Codex: { file: "openai.svg", color: "#10A37F", recolor: true },
};

// Tier 3 — lucide fallbacks for concepts and brands with no logo.
const FALLBACK: Record<string, { icon: string; color?: string }> = {
  SQL: { icon: "database" },
  Valgrind: { icon: "bug" },
  "AWS S3": { icon: "hard-drive", color: "#FF9900" },
  JTAG: { icon: "cpu" },
  Alembic: { icon: "layers" },
  Augment: { icon: "orbit", color: "#22C55E" }, // nods to their "Cosmos" agent platform
  "Green Hills Integrity": { icon: "shield-check", color: "#2E7D32" }, // safety-critical RTOS, in Green Hills green
  VxWorks: { icon: "wind", color: "#0093D0" }, // by Wind River, in their brand blue
  "Deep Reinforcement Learning": { icon: "brain" },
  "Natural Language Processing": { icon: "languages" },
  "Time Series Forecasting": { icon: "trending-up" },
  "Representation Learning": { icon: "network" },
  "LLM Integration": { icon: "plug" },
  "Prompt Engineering": { icon: "terminal" },
};

interface SkillIconEntry {
  src: string;
  color: string;
  brand: boolean;
}

// Build a slug -> icon lookup from all simple-icons exports.
const iconsBySlug: Record<string, { path: string; hex: string }> = {};
for (const key of Object.keys(simpleIcons)) {
  const icon = (simpleIcons as Record<string, unknown>)[key] as
    | { slug?: string; path?: string; hex?: string }
    | undefined;
  if (icon?.slug && icon.path && icon.hex) {
    iconsBySlug[icon.slug] = { path: icon.path, hex: icon.hex };
  }
}

function rgb(hex: string): [number, number, number] {
  const h =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
  const [r, g, b] = rgb(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** Pick the most saturated, mid-toned color in an SVG for use as an accent. */
function dominantColor(svg: string): string {
  const matches = svg.match(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/g) ?? [];
  let best = "";
  let bestScore = -1;
  for (const raw of matches) {
    const hex = raw.slice(1);
    const [r, g, b] = rgb(hex);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const lum = luminance(hex);
    if (lum < 0.12 || lum > 0.9) continue; // skip near-black / near-white
    const score = sat * 2 + (1 - Math.abs(lum - 0.5));
    if (score > bestScore) {
      bestScore = score;
      best = `#${hex}`;
    }
  }
  return best || ACCENT;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function brandSvg(iconPath: string, color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}"><path d="${iconPath}"/></svg>`;
}

function fallbackSvg(lucideName: string, color: string): string {
  const raw = fs.readFileSync(
    path.join(LUCIDE_DIR, `${lucideName}.svg`),
    "utf8",
  );
  return raw
    .replace(/<!--[\s\S]*?-->\s*/g, "")
    .replace(/stroke="currentColor"/g, `stroke="${color}"`)
    .replace(/\s*class="[^"]*"/g, "")
    .trim();
}

function main(): void {
  const doc = yaml.load(fs.readFileSync(SKILLS_YAML, "utf8")) as {
    skills: { skills: { name: string }[] }[];
  };

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const map: Record<string, SkillIconEntry> = {};
  const counts = { devicon: 0, brand: 0, fallback: 0 };
  const warnings: string[] = [];

  const writeLobehub = (name: string): void => {
    const { file, color, recolor } = LOBEHUB[name]!;
    let svg = fs.readFileSync(path.join(LOBEHUB_DIR, file), "utf8");
    if (recolor) svg = svg.replace(/fill="currentColor"/g, `fill="${color}"`);
    const out = `${slugify(name)}.svg`;
    fs.writeFileSync(path.join(OUT_DIR, out), svg);
    map[name] = { src: `/skills/${out}`, color, brand: true };
    counts.brand++;
  };

  for (const category of doc.skills) {
    for (const skill of category.skills) {
      const name = skill.name;
      if (map[name]) continue; // dedupe shared names

      const deviconName = DEVICON[name];
      const slug = BRAND[name];

      if (LOBEHUB[name]) {
        writeLobehub(name);
      } else if (deviconName) {
        const folder = deviconName.replace(/-(original|plain).*$/, "");
        const svg = fs.readFileSync(
          path.join(DEVICON_DIR, folder, `${deviconName}.svg`),
          "utf8",
        );
        const file = `${deviconName}.svg`;
        fs.writeFileSync(path.join(OUT_DIR, file), svg);
        map[name] = {
          src: `/skills/${file}`,
          color: dominantColor(svg),
          brand: true,
        };
        counts.devicon++;
      } else if (slug && iconsBySlug[slug]) {
        const { path: iconPath, hex } = iconsBySlug[slug];
        const dark = luminance(hex) < 0.3;
        const display = dark ? LIGHT : `#${hex}`;
        const file = `${slug}.svg`;
        fs.writeFileSync(path.join(OUT_DIR, file), brandSvg(iconPath, display));
        map[name] = { src: `/skills/${file}`, color: display, brand: true };
        counts.brand++;
      } else {
        const fb = FALLBACK[name];
        const lucideName = fb?.icon ?? "box";
        const color = fb?.color ?? ACCENT;
        if (!fb) warnings.push(name);
        const file = `${slugify(name)}.svg`;
        fs.writeFileSync(
          path.join(OUT_DIR, file),
          fallbackSvg(lucideName, color),
        );
        map[name] = { src: `/skills/${file}`, color, brand: false };
        counts.fallback++;
      }
    }
  }

  const header = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 *
 * Generated by scripts/generate-skill-icons.ts from content/skills.yaml.
 * To update, edit the mappings in that script and run:
 *   pnpm run generate-skill-icons
 */

export interface SkillIcon {
  /** Path to the icon under /public. */
  src: string;
  /** Representative color of the icon (used for subtle hover accents). */
  color: string;
  /** Whether this is a real brand icon (true) or a generic fallback (false). */
  brand: boolean;
}

export const skillIcons: Record<string, SkillIcon> = ${JSON.stringify(
    map,
    null,
    2,
  )};

/** Resolve a skill's icon by name, with a safe default. */
export function getSkillIcon(name: string): SkillIcon {
  return (
    skillIcons[name] ?? { src: "/skills/box.svg", color: "${ACCENT}", brand: false }
  );
}
`;

  fs.writeFileSync(MAP_OUT, header);
  fs.writeFileSync(path.join(OUT_DIR, "box.svg"), fallbackSvg("box", ACCENT));

  console.log(
    `Generated ${counts.devicon + counts.brand + counts.fallback} skill icons ` +
      `(${counts.devicon} full-color, ${counts.brand} brand mark, ${counts.fallback} fallback) -> public/skills/`,
  );
  if (warnings.length) {
    console.warn(`  No mapping for: ${warnings.join(", ")} (used default)`);
  }
}

main();
