const conventionalCommitTypes = [
  { type: "feat", section: "Features" },
  { type: "fix", section: "Bug Fixes" },
  { type: "perf", section: "Performance" },
  { type: "refactor", section: "Refactoring" },
  { type: "docs", section: "Documentation" },
  { type: "style", section: "Styling" },
  { type: "chore", hidden: true },
  { type: "test", hidden: true },
  { type: "build", hidden: true },
  { type: "ci", hidden: true },
];

const releaseRules = [
  { type: "feat", release: "minor" },
  { type: "fix", release: "patch" },
  { type: "perf", release: "patch" },
  { type: "refactor", release: "patch" },
  { type: "docs", release: "patch" },
  { type: "style", release: "patch" },
  { type: "chore", release: false },
  { type: "test", release: false },
  { type: "build", release: false },
  { type: "ci", release: false },
];

const parserOpts = {
  noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"],
};

const presetConfig = {
  types: conventionalCommitTypes,
};

const releaseConfig = {
  branches: ["master"],
  repositoryUrl: "https://github.com/danboyle7/portfolio.git",
  tagFormat: "v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        parserOpts,
        presetConfig,
        releaseRules,
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        parserOpts,
        presetConfig,
      },
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
        changelogTitle:
          "# Changelog\n\nAll notable changes to this project will be documented in this file. See [semantic-release](https://github.com/semantic-release/semantic-release) for commit guidelines.",
      },
    ],
    [
      "@semantic-release/npm",
      {
        npmPublish: false,
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};

export default releaseConfig;
