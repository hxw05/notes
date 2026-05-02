---
hidden: true
---
# CLAUDE.md

Note: The frontmatter is required since everything of markdown format under the project root is considered a concrete part of the website. Its sole use is to exclude this file from the website with no any other intention.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build commands

```
npm run gen-stats      # Rebuild stats JSON files from Go source (runs before dev/build)
npm run docs:dev       # Start dev server
npm run docs:build     # Build for production
npm run docs:preview   # Preview production build locally
```

## Architecture

This is a [VitePress](https://vitepress.dev) personal notes site (Chinese-language, `lang: 'zh'`). Content lives in 7 project directories at the repo root (`gopl/`, `rust_book/`, `modern_js/`, `missing_semester/`, `anthropic_blogs/`, `anthropic_engineering/`, `mind_dumps/`). Each project directory contains `.md` files — these are the notes.

**Config**: `.vitepress/config.mts` wires up markdown-it plugins (CJK-friendly spacing, MathJax3 with Tex macros, footnotes) and auto-generates the sidebar via `vitepress-sidebar` from the project directories.

**Theme**: `.vitepress/theme/` overrides the default VitePress theme:
- `index.ts` — registers two global Vue components (`OverviewCards`, `ProjectTable`) and sets `Layout.vue` as the custom layout
- `Layout.vue` — wraps DefaultTheme to add medium-zoom for images and display frontmatter `date` / `origin.title` fields above content via the `#doc-before` slot
- `custom.css` — brand colors (teal-based), dark mode variants, code block borders in custom blocks, active sidebar link underline

**Overview stats system** (`.vitepress/stats_gen/`):
- A **Go program** that scans all `.md` files in project directories and computes per-project stats: Chinese character count, word count, note count, image count, last commit time (from `git log`)
- Outputs two JSON files to `.vitepress/theme/`: `project_stats.json` (per-project array) and `overall_stats.json` (aggregate totals)
- The pre-compiled binary `whxnotes_stats_gen` is checked into the repo; run `npm run gen-stats` to rebuild both the binary and the JSON
- Stats are consumed by Vue components (`OverviewCards.vue`, `ProjectTable.vue`) that directly import the JSON files — these components are used in `index.md`

**Sidebar**: `vitepress-sidebar` auto-generates the sidebar from folder structure. Pages with frontmatter `hidden: true` are excluded. `sortMenusByFrontmatterOrder: true` means pages can define their sort order via frontmatter. `useTitleFromFileHeading: true` extracts sidebar link text from the first heading in each file. Sidebar sections are collapsed by default.

**Frontmatter conventions**: `hidden: true` excludes a page from the sidebar; `date` is rendered above the page content by `Layout.vue`; `origin.title` renders as a pre-title heading.
