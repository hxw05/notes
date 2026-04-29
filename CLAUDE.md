---
hidden: true
---
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build commands

```
npm run docs:dev      # Start dev server
npm run docs:build    # Build for production
npm run docs:preview  # Preview production build locally
```

## Architecture

This is a [VitePress](https://vitepress.dev) personal notes site. Content lives in 7 project directories at the repo root (`gopl/`, `rust_book/`, `modern_js/`, `missing_semester/`, `anthropic_blogs/`, `anthropic_engineering/`, `mind_dumps/`). Each project directory contains `.md` files — these are the notes.

**Config**: `.vitepress/config.mts` wires up markdown-it plugins (CJK-friendly, MathJax, footnotes, overview stats) and auto-generates the sidebar via `vitepress-sidebar` from the project directories.

**Theme**: `.vitepress/theme/` overrides the default VitePress theme:
- `Layout.vue` — wraps DefaultTheme to add medium-zoom for images and display frontmatter `date` / `origin.title` fields above content
- `custom.css` — brand colors and minor style overrides
- `components/OverviewCards.vue` — dashboard card component for `index.md`

**Overview stats system** (`.vitepress/plugins/overview-stats.ts`):
- At build time, scans all `.md` files in project directories to compute per-project stats: Chinese character count, note count, last updated time (from git), image count
- Stats are consumed two ways:
  1. **Markdown-it plugin** — replaces `<!-- overview-rows -->` in `index.md` with per-project table rows
  2. **Vite virtual module** (`virtual:overview-stats`) — imported by `OverviewCards.vue` to render aggregate cards (total Chinese chars, total notes, latest update)
- `computeAllStats()` is the shared function; it uses synchronous `fs` / `execSync` because markdown-it core rules are synchronous

**Sidebar**: `vitepress-sidebar` auto-generates the sidebar from folder structure. Pages with frontmatter `hidden: true` are excluded. `sortMenusByFrontmatterOrder: true` means pages can define their sort order via frontmatter.

**Frontmatter conventions**: `hidden: true` excludes a page from the sidebar; `date` is rendered above the page content by `Layout.vue`; `origin.title` renders as a pre-title heading.
