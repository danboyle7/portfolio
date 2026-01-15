// Central version constant - reads from package.json (single source of truth)
// Updated automatically by standard-version when running `pnpm release`
import packageJson from "../../package.json" with { type: "json" };

export const VERSION = packageJson.version;
