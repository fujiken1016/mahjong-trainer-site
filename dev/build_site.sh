#!/bin/sh
# site/ を生成（Cloudflare Pages の公開ディレクトリ）。法的ページは site/ に静的に置き、ここでは触らない
#
# 🔴 MUST_KEEP: 生成物は「ソースの内容で丸ごと上書き」されるので、ソースに無いものは毎回消える。
#    過去に GA4 タグと /oc.js（外部リンク計測）がこれで2回消失した（2026-09-03に mahjong_score 側で
#    同型を修正したが、こちらの build_site.sh には入っておらず 2026-09-03 に再発を検出）。
#    → 生成後に必ず全生成物へ MUST_KEEP が入っているか照合し、欠けていたらビルドを失敗させる。
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$DIR/site"
mkdir -p "$OUT/rules"
cp "$DIR/engine.js" "$OUT/engine.js"
sed 's|href="index.html">← ドリルモードへ|href="drill.html">← ドリルモードへ|' "$DIR/game.html" > "$OUT/index.html"
sed 's|href="game.html"|href="index.html"|' "$DIR/index.html" > "$OUT/drill.html"
{ printf '<!DOCTYPE html>\n<html lang="ja">\n'; cat "$DIR/mahjong_trainer.html"; printf '\n</html>\n'; } > "$OUT/rules/index.html"

# ---- MUST_KEEP 照合（1つでも欠けたら異常終了）----
fail=0
for f in "$OUT/index.html" "$OUT/drill.html" "$OUT/rules/index.html"; do
  for keep in 'G-XRJ40EFR6C' '/oc.js'; do
    if ! grep -q -- "$keep" "$f"; then
      echo "MUST_KEEP 欠落: $f に $keep がありません（ソース側に足してから再ビルドしてください）" >&2
      fail=1
    fi
  done
done
[ "$fail" = 0 ] || { echo "build failed" >&2; exit 1; }

# 日付証跡（JSON-LD datePublished/dateModified・可視<time>・sitemap lastmod）を
# git 履歴から再生成する。site/ は生成物なので、ビルドのたびにここで入れ直さないと消える。
python3 "$HOME/Desktop/claude/tools/stamp_dates.py" --site mahjong >/dev/null || \
  echo "warn: stamp_dates.py が走らなかった（日付証跡は未更新）" >&2

echo "site/ built（MUST_KEEP: GA4 / oc.js を全生成物で確認・日付証跡も再生成）"
