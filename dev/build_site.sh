#!/bin/sh
# site/ を生成（Cloudflare Pages の公開ディレクトリ）。法的ページは site/ に静的に置き、ここでは触らない
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$DIR/site"
mkdir -p "$OUT/rules"
cp "$DIR/engine.js" "$OUT/engine.js"
sed 's|href="index.html">← ドリルモードへ|href="drill.html">← ドリルモードへ|' "$DIR/game.html" > "$OUT/index.html"
sed 's|href="game.html"|href="index.html"|' "$DIR/index.html" > "$OUT/drill.html"
{ printf '<!DOCTYPE html>\n<html lang="ja">\n'; cat "$DIR/mahjong_trainer.html"; printf '\n</html>\n'; } > "$OUT/rules/index.html"
echo "site/ built"
