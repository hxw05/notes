# AGENTS.md

This file provides guidance to AI coding agents working in this repository.

## Build commands

```
npm install            # Install build-time Shiki dependencies
hugo server            # Start dev server (client-side Shiki fallback)
npm run build          # Hugo + Shiki pre-render into public/ (used by GitHub Actions)
```

## Architecture

This is a [Hugo](https://gohugo.io) personal notes site (Chinese-language) using the
[hugo-book](https://github.com/alex-shpak/hugo-book) theme (pinned as a submodule in
`themes/hugo-book`). Content lives under `content/` in 10 project directories
(`agent_diary/`, `ai_readings/`, `cmd/`, `frontend/`, `gopl/`, `how_to/`, `leetcode/`,
`missing_2020/`, `modern_js/`, `rust_book/`). Each project directory contains `.md`
files — these are the notes.

**Config**: `hugo.toml` enables the Goldmark passthrough extension for `$...$` /
`$$...$$` math and footnotes. Hugo is pinned to 0.165.0 in GitHub Actions.

**Theme**: `themes/hugo-book/` is used with these project-level overrides:
- `layouts/partials/docs/inject/head.html` — loads MathJax for `$...$` / `$$...$$`
- `layouts/_markup/render-codeblock.html` — emits raw code blocks for build-time Shiki
- `scripts/shiki.mjs` — pre-renders Shiki light/dark themes into `public/`
- `layouts/_markup/render-passthrough.html` — wraps math delimiters for MathJax
- `layouts/_markup/render-link.html` — rewrites internal `.md` links to Hugo page URLs
- `layouts/_markup/render-image.html` — rewrites relative image paths to their built Hugo URLs
- `layouts/_shortcodes/admonition.html` — supports the migrated `:::tip/info/warning/details` containers
- `layouts/partials/docs/toc.html` — strips inline code/emphasis styling from TOC entries
- `assets/styles/custom.css` — minimal styling for admonitions and math blocks
- `layouts/partials/docs/inject/body.html` — enables medium-zoom and a client-side Shiki fallback for `hugo server`
- `layouts/single.html` and `layouts/list.html` — render the article body; the heading comes from the content H1
- `layouts/partials/docs/title.html` — derives menu/header/browser titles from the first H1 in content
- `layouts/partials/opengraph.html`, `layouts/partials/schema.html`, and `layouts/_default/rss.xml` — keep social/RSS metadata titles in sync with the H1-derived title
- each section `_index.md` sets `bookCollapseSection: true` so the sidebar stays compact

The old VitePress config, stats generator, custom minimal-book theme, `meta.json`
files and npm build scripts have been removed.

**Frontmatter conventions**: page titles come from the first H1 in each document, so
do not put `title` in frontmatter. `weight` controls order within a section (converted
from the old `order` field); `date` is shown on single pages; `origin` metadata is
retained but not rendered.
