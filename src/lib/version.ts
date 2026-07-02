// Central version constant - reads from package.json (single source of truth)
// Updated automatically by semantic-release in GitHub Actions.
import packageJson from "../../package.json" with { type: "json" };

export const VERSION = packageJson.version;
