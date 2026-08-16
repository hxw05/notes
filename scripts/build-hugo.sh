#!/usr/bin/env bash
# Build the patched Hugo binary into bin/hugo.
#
# The patch (scripts/cjkfriendly.patch) wires tats-u/goldmark-cjk-friendly
# behind [markup.goldmark.extensions.cjkFriendly] emphasis = true, so that
# emphasis/strikethrough adjacent to CJK punctuation parses correctly
# (e.g. **第六列（...）**表示...). Upstream: gohugoio/hugo#14114, PR #14115
# unmerged as of Hugo 0.165.0.
#
# Usage: ./scripts/build-hugo.sh
# Then:  ./bin/hugo server   (or hugo, --minify, etc.)
set -euo pipefail

HUGOVER=v0.165.0
HUGO_REPO=https://github.com/gohugoio/hugo.git
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PATCH="$ROOT/scripts/cjkfriendly.patch"
SRC="$ROOT/.hugo-build/hugo"

mkdir -p "$ROOT/.hugo-build" "$ROOT/bin"

if [ ! -d "$SRC/.git" ]; then
  echo "==> cloning hugo $HUGOVER"
  git clone --quiet --depth 1 --branch "$HUGOVER" "$HUGO_REPO" "$SRC"
else
  echo "==> updating hugo $HUGOVER"
  git -C "$SRC" fetch --quiet --depth 1 origin tag "$HUGOVER"
  git -C "$SRC" checkout --quiet --force --detach "$HUGOVER"
fi

cd "$SRC"
# Apply the patch idempotently (reverse it first if already applied).
if git apply --reverse --check "$PATCH" 2>/dev/null; then
  git apply --reverse "$PATCH"
fi
git apply "$PATCH"

echo "==> building"
go build -o "$ROOT/bin/hugo" .
"$ROOT/bin/hugo" version
echo "==> done: $ROOT/bin/hugo"
