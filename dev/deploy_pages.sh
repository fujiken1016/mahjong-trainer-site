#!/bin/sh
# 雀トレをGitHub Pagesへデプロイ（固定URL: https://fujiken1016.github.io/mahjong-trainer/）
# 使い方: sh dev/deploy_pages.sh          # dry-run（差分を見せるだけ・pushしない）
#         sh dev/deploy_pages.sh --execute # 実際に commit → push → Pagesビルド → 反映を実測
#
# 2026-09-03 安全化（memory/script_safety_audit_2026-09-03.md）
#  - `git add -A` をやめ、**このスクリプトが生成した3ファイルだけ** をaddする
#    （旧版は deploy/ に紛れ込んだ他セッションの編集や作業ファイルを巻き込んで公開しえた）
#  - push しただけで「完了」と言わない。**本番URLに curl して反映を実測**する
#  - 既定を dry-run に変更（公開物の書き換えなので、意図しない実行を止める）
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
SITE="https://fujiken1016.github.io/mahjong-trainer/"
EXECUTE=0
[ "$1" = "--execute" ] && EXECUTE=1

# --- 生成物を作る（ここまでは副作用がローカルのみなので dry-run でも実行する）---
cd "$DIR/deploy"
# 完全なHTML（DOCTYPE・viewportメタ入り）をそのまま配信する。
# ※Artifact用の凝縮版(build_artifact.js)はheadを削るためモバイル表示が壊れる。Pagesには使わない
cp "$DIR/engine.js" engine.js
sed 's|href="index.html">← ドリルモードへ|href="drill.html">← ドリルモードへ|' "$DIR/game.html" > index.html
sed 's|href="game.html"|href="index.html"|' "$DIR/index.html" > drill.html

# --- 生成物の健全性チェック（空ファイル・sed失敗で本番を壊さない）---
for f in engine.js index.html drill.html; do
  [ -s "$f" ] || { echo "❌ $f が空です。中止"; exit 1; }
done
grep -q "<!DOCTYPE" index.html || { echo "❌ index.html に DOCTYPE がありません（凝縮版を掴んでいる可能性）。中止"; exit 1; }
grep -q "viewport" index.html   || { echo "❌ index.html に viewport がありません。中止"; exit 1; }

# --- 追跡外・想定外の変更が紛れていないか（他セッションの作業を巻き込まない）---
OTHERS=$(git status --porcelain -- . | grep -v -E ' (engine\.js|index\.html|drill\.html)$' || true)
if [ -n "$OTHERS" ]; then
  echo "⚠️ このスクリプトが生成した3ファイル以外に変更があります（addしません）:"
  echo "$OTHERS"
fi

git --no-pager diff --stat -- engine.js index.html drill.html || true

if [ "$EXECUTE" -ne 1 ]; then
  echo "============================================================"
  echo "[DRY-RUN] push していません。--execute を付けたときだけデプロイします。"
  echo "  デプロイ先: $SITE"
  echo "============================================================"
  exit 0
fi

TOKEN=$(python3 -c "import json;print(json.load(open('/Users/fujiken/Desktop/claude/.gh-config/token.json'))['access_token'])")
git add engine.js index.html drill.html
git commit -m "update $(date +%Y-%m-%d_%H%M)" || { echo "変更なし"; exit 0; }
git push "https://x-access-token:${TOKEN}@github.com/fujiken1016/mahjong-trainer.git" main
# Pagesのビルドを明示トリガー（push だけでは再ビルドされないことがある）
curl -s -X POST -H "Authorization: Bearer ${TOKEN}" -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/fujiken1016/mahjong-trainer/pages/builds > /dev/null

# --- 反映の実測（push＝反映ではない。ここを通るまで完了と言わない）---
LOCAL_LEN=$(wc -c < index.html | tr -d ' ')
for i in 1 2 3 4 5 6 7 8 9 10; do
  REMOTE=$(curl -sL "$SITE" || true)
  REMOTE_LEN=$(printf '%s' "$REMOTE" | wc -c | tr -d ' ')
  if [ "$REMOTE_LEN" -gt 0 ] && [ "$REMOTE_LEN" -eq "$LOCAL_LEN" ]; then
    echo "✔ 反映を実測で確認: $SITE (${REMOTE_LEN}バイト)"
    exit 0
  fi
  echo "  ($i/10) 未反映: remote=${REMOTE_LEN} local=${LOCAL_LEN}"
  sleep 15
done
echo "❌ 2分半待っても本番に反映されていません: $SITE"
echo "   （push自体は成功している。Pagesのビルド状況を確認すること）"
exit 1
