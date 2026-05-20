#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

echo "Building whxnotes_stats_gen..."

GOOS=darwin GOARCH=arm64 go build -o whxnotes_stats_gen_darwin .
echo "  -> whxnotes_stats_gen_darwin (darwin/arm64)"

GOOS=linux GOARCH=amd64 go build -o whxnotes_stats_gen_linux .
echo "  -> whxnotes_stats_gen_linux (linux/amd64)"

echo "Done."
