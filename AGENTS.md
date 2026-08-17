# AGENTS.md

This file provides guidance to AI coding agents working in this repository.

## Do not commit automatically

You should never commit automatically.

## Build commands

```
./scripts/build-hugo.sh    # Build patched Hugo into bin/ (clones upstream v0.165.0 + scripts/cjkfriendly.patch, and goldmark v1.8.5 + scripts/goldmark-cjkfriendly.patch; re-run after Hugo/goldmark upgrades)
npm install                # Install build-time Shiki dependencies
./bin/hugo server          # Start dev server (client-side Shiki fallback)
npm run build              # Hugo + Shiki pre-render into public/ (used by GitHub Actions)
```

The site uses a **patched Hugo binary** (`bin/hugo`): the stock parser follows
CommonMark flanking rules that fail on CJK typography — e.g.
`**第六列（...）**表示...` renders the `**` literally when the closing delimiters
sit between full-width punctuation and a CJK letter (gohugoio/hugo#14114,
PR #14115 unmerged as of 0.165.0). The patch wires tats-u/goldmark-cjk-friendly
behind `[markup.goldmark.extensions.cjkFriendly] emphasis = true` in
`hugo.toml`. Use `./bin/hugo` for everything — never the system hugo. When
upstream merges #14115, delete `scripts/cjkfriendly.patch` and go back to
official Hugo binaries; the config key stays the same.

A second patch (`scripts/goldmark-cjkfriendly.patch`) is applied to a local
fork of goldmark v1.8.5 (`.hugo-build/goldmark`, wired in via a `replace`
directive in the hugo patch). It makes `parseInline` trigger inline parsers
right after a multi-byte (CJK) character, so bare URLs following Chinese
text/full-width punctuation (`中文：https://...。`) are linkified while trailing
CJK punctuation stays outside the link (the goldmark linkify URL regexp is
ASCII-only). `linkify = true` is set explicitly in `hugo.toml` (already the
Hugo default). The trigger change is inert when linkify is disabled.

## Architecture

This is a [Hugo](https://gohugo.io) personal notes site (Chinese-language) using the
[hugo-book](https://github.com/alex-shpak/hugo-book) theme (pinned as a submodule in
`themes/hugo-book`). Content lives under `content/` in 10 project directories
(`agent_diary/`, `ai_readings/`, `cmd/`, `frontend/`, `gopl/`, `how_to/`, `leetcode/`,
`missing_2020/`, `modern_js/`, `rust_book/`). Each project directory contains `.md`
files — these are the notes.

**Config**: `hugo.toml` enables the Goldmark passthrough extension for `$...$` /
`$$...$$` math, footnotes, and `cjkFriendly.emphasis = true` (CJK-friendly
emphasis, provided by the patched binary — see Build commands above). Hugo is
pinned to 0.165.0 in GitHub Actions (built from source with the patch, then
deployed to GitHub Pages via `.github/workflows/deploy.yml`).

**Theme**: `themes/hugo-book/` (a git submodule) carries all site customizations
**directly in-tree** — the theme is a local fork of upstream, not a clean submodule
with external overrides. Upstream updates are merged/rebased onto these local
changes. The customizations are:
- `layouts/_partials/docs/inject/head.html` — loads MathJax for `$...$` / `$$...$$`, loads fonts per `theme.toml` `[params]` (`BookFontsGoogle` / `BookFontFamily`, overridable in `hugo.toml`), and overrides the dark theme-color
- `layouts/_markup/render-codeblock.html` — emits raw code blocks for Shiki (build-time + client fallback)
- `scripts/shiki.mjs` — pre-renders Shiki light/dark themes into `public/`
- `layouts/_markup/render-passthrough.html` — wraps math delimiters for MathJax
- `layouts/_markup/render-link.html` — rewrites internal `.md` links to Hugo page URLs (replaces the theme's `BookPortableLinks` mechanism)
- `layouts/_markup/render-image.html` — rewrites relative image paths to their built Hugo URLs (replaces `BookPortableLinks`)
- `layouts/_shortcodes/admonition.html` — supports the migrated `:::tip/info/warning/details` containers
- `layouts/_partials/docs/toc.html` — strips inline code/emphasis styling from TOC entries
- `assets/styles/custom.css` — admonition/math styling, CJK spacing, grayscale dark mode (replaces the theme's Nord palette), Shiki dark variables, mobile drawer styles
- `layouts/baseof.html` — the mobile drawer mechanism is de-hacked: the theme's hidden-checkbox inputs and `:checked` sibling selectors are replaced by `body.menu-open` / `body.toc-open` classes toggled from `assets/js/topbar.js`; the overlay label becomes a plain div (`#menu-overlay`), and the drawers get ids (`#menu-drawer`, `#toc-drawer`) for the toggle buttons' `aria-controls`
- `layouts/_partials/docs/header.html` — the mobile top bar: real `<button>` toggles (`#menu-toggle`, `#toc-toggle`, with `aria-expanded`) instead of the theme's label/checkbox pair
- `layouts/_partials/docs/inject/body.html` — enables medium-zoom, a client-side Shiki fallback for `hugo server`, and the mobile top bar (`assets/js/topbar.js` + fixed-bar/drawer styles in `assets/styles/custom.css` under the ≤56rem breakpoint)
- `layouts/single.html` and `layouts/list.html` — render the article body; the heading comes from the content H1
- `layouts/_partials/docs/title.html` — derives menu/header/browser titles from the first H1 in content
- `layouts/_partials/opengraph.html`, `layouts/_partials/schema.html`, and `layouts/_default/rss.xml` — keep social/RSS metadata titles in sync with the H1-derived title
- `layouts/_partials/docs/html-head.html`, `html-head-title.html`, `html-head-favicon.html`, `meta-description.html` — meta description via the shared partial, home-title without separator, light/dark favicons via media queries
- `assets/js/topbar.js`, `assets/js/shiki.js` — mobile top bar + client-side Shiki fallback
- each section `_index.md` sets `bookCollapseSection: true` so the sidebar stays compact

There are no project-level layout/style overrides left: the project's `layouts/` and
`assets/` directories are empty and everything lives inside the theme.

The old VitePress config, stats generator, custom minimal-book theme, `meta.json`
files and npm build scripts have been removed.

**Comment style**: keep code comments short and minimal — a brief single line when
needed, nothing more. Drop comments that merely restate the code.

**Frontmatter conventions**: page titles come from the first H1 in each document, so
do not put `title` in frontmatter. `weight` controls order within a section (converted
from the old `order` field); `date` is shown on single pages; `origin` metadata is
retained but not rendered.
