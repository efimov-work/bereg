#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE="$(git remote get-url origin)"
SLUG="$(printf '%s' "$REMOTE" | sed -E 's#^.*github\.com[:/]+##; s#\.git$##')"
OWNER="${PAGES_OWNER:-${SLUG%%/*}}"
REPO="${SLUG##*/}"
BASE="/$REPO"
if [[ "$REPO" == *.github.io ]]; then BASE=""; fi
ORIGIN="https://$(printf '%s' "$OWNER" | tr '[:upper:]' '[:lower:]').github.io"
NEXT_PUBLIC_BASE_PATH="$BASE" NEXT_PUBLIC_SITE_URL="$ORIGIN" npm run export
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -a out/. "$TMP/"
git -C "$TMP" init -q -b gh-pages
git -C "$TMP" add -A
git -C "$TMP" -c user.name="$(git config user.name)" -c user.email="$(git config user.email)" commit -q -m "Статическая сборка Bereg для GitHub Pages"
git -C "$TMP" push -q -f "$REMOTE" gh-pages
printf 'Опубликовано: %s%s/\n' "$ORIGIN" "$BASE"
