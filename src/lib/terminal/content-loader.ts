/**
 * Content Loader
 *
 * Loads content from the generated content file.
 * The generated content comes from YAML files in /content directory.
 *
 * YAML files are the SINGLE SOURCE OF TRUTH for all content.
 * Edit YAML files to update content, then run: pnpm run generate-content
 */

import { generatedContent } from './generated-content';
import { setContentCache } from './file-system';

/**
 * Initialize content from generated content file
 *
 * This loads the pre-generated content from YAML files into the content cache.
 * The content is generated at build time by scripts/generate-content.ts
 */
export function initializeContent(): void {
  setContentCache(generatedContent);
}

/**
 * Get the raw generated content (for debugging/testing)
 */
export function getGeneratedContent(): Record<string, unknown> {
  return generatedContent;
}
