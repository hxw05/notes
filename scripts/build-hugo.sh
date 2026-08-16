#!/usr/bin/env bash
# Build the patched Hugo binary into bin/hugo.
#
# Two patches are applied:
# - scripts/cjkfriendly.patch on hugo: wires tats-u/goldmark-cjk-friendly
#   behind [markup.goldmark.extensions.cjkFriendly] emphasis = true, so that
#   emphasis/strikethrough adjacent to CJK punctuation parses correctly
#   (e.g. **第六列（...）**表示...). Upstream: gohugoio/hugo#14114, PR #14115
#   unmerged as of Hugo 0.165.0. Also adds a go.mod replace pinning goldmark
#   to the local fork in .hugo-build/goldmark.
# - scripts/goldmark-cjkfriendly.patch on goldmark v1.8.5: makes parseInline
#   trigger inline parsers right after a multi-byte (CJK) character, so bare
#   URLs following Chinese text/full-width punctuation get linkified while
#   trailing CJK punctuation (。，etc.) stays outside the link (the linkify
#   URL regexp is ASCII-only).
#
# Usage: ./scripts/build-hugo.sh
# Then:  ./bin/hugo server   (or hugo, --minify, etc.)
set -euo pipefail

HUGOVER=v0.165.0
HUGO_REPO=https://github.com/gohugoio/hugo.git
GOLDOVER=v1.8.5
GOLD_REPO=https://github.com/yuin/goldmark.git
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PATCH="$ROOT/scripts/cjkfriendly.patch"
GPATCH="$ROOT/scripts/goldmark-cjkfriendly.patch"
SRC="$ROOT/.hugo-build/hugo"
GSRC="$ROOT/.hugo-build/goldmark"

mkdir -p "$ROOT/.hugo-build" "$ROOT/bin"

if [ ! -d "$SRC/.git" ]; then
  echo "==> cloning hugo $HUGOVER"
  git clone --quiet --depth 1 --branch "$HUGOVER" "$HUGO_REPO" "$SRC"
else
  echo "==> updating hugo $HUGOVER"
  git -C "$SRC" fetch --quiet --depth 1 origin tag "$HUGOVER"
  git -C "$SRC" checkout --quiet --force --detach "$HUGOVER"
fi

if [ ! -d "$GSRC/.git" ]; then
  echo "==> cloning goldmark $GOLDOVER"
  git clone --quiet --depth 1 --branch "$GOLDOVER" "$GOLD_REPO" "$GSRC"
else
  echo "==> updating goldmark $GOLDOVER"
  git -C "$GSRC" fetch --quiet --depth 1 origin tag "$GOLDOVER"
  git -C "$GSRC" checkout --quiet --force --detach "$GOLDOVER"
fi

# Apply both patches idempotently (reverse first if already applied).
cd "$SRC"
if git apply --reverse --check "$PATCH" 2>/dev/null; then
  git apply --reverse "$PATCH"
fi
git apply "$PATCH"

cd "$GSRC"
if git apply --reverse --check "$GPATCH" 2>/dev/null; then
  git apply --reverse "$GPATCH"
fi
git apply "$GPATCH"

echo "==> building"
cd "$SRC"
go build -o "$ROOT/bin/hugo" .
"$ROOT/bin/hugo" version
echo "==> done: $ROOT/bin/hugo"
