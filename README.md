# whxnotes

Personal notes site built with [Hugo](https://gohugo.io) and the
[hugo-book](https://github.com/alex-shpak/hugo-book) theme (pinned as a
submodule in `themes/hugo-book`). Content is Chinese-language study notes
under `content/`, one directory per project.

## Building

The site needs a patched Hugo binary: the stock parser follows CommonMark
flanking rules that fail on CJK typography (e.g. `**第六列（...）**表示...`
renders the `**` literally when the closing delimiters sit between full-width
punctuation and a CJK letter). The fix is wired via
[goldmark-cjk-friendly](https://github.com/tats-u/goldmark-cjk-friendly);
upstream Hugo tracks it in
[gohugoio/hugo#14114](https://github.com/gohugoio/hugo/issues/14114) (PR
[#14115](https://github.com/gohugoio/hugo/pull/14115) unmerged as of 0.165.0),
so this repo carries the patch itself.

First build the binary (clones upstream Hugo at the pinned tag, applies
`scripts/cjkfriendly.patch`, outputs `bin/hugo`; the clone is cached in
`.hugo-build/`):

```sh
./scripts/build-hugo.sh
```

Then use the patched binary for everything:

```sh
./bin/hugo server        # dev server
./bin/hugo --minify      # production build into public/
```

The `cjkFriendly` config lives in `hugo.toml`
(`[markup.goldmark.extensions.cjkFriendly] emphasis = true`). When upstream
merges #14115, delete `scripts/cjkfriendly.patch` and go back to official
Hugo binaries — the config key stays the same.

GitHub Actions (`.github/workflows/deploy.yml`) builds the patched binary in
CI and deploys to GitHub Pages.
