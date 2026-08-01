#!/bin/sh
# 雀トレをGitHub Pagesへデプロイ（固定URL: https://fujiken1016.github.io/mahjong-trainer/）
# 使い方: sh dev/deploy_pages.sh  （game.html/engine.jsの変更を反映）
set -e
DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$DIR/deploy"
# 完全なHTML（DOCTYPE・viewportメタ入り）をそのまま配信する。
# ※Artifact用の凝縮版(build_artifact.js)はheadを削るためモバイル表示が壊れる。Pagesには使わない
cp "$DIR/engine.js" engine.js
sed 's|href="index.html">← ドリルモードへ|href="drill.html">← ドリルモードへ|' "$DIR/game.html" > index.html
sed 's|href="game.html"|href="index.html"|' "$DIR/index.html" > drill.html
TOKEN=$(python3 -c "import json;print(json.load(open('/Users/fujiken/Desktop/claude/.gh-config/token.json'))['access_token'])")
git add -A && git commit -m "update $(date +%Y-%m-%d_%H%M)" || { echo "変更なし"; exit 0; }
git push "https://x-access-token:${TOKEN}@github.com/fujiken1016/mahjong-trainer.git" main
# Pagesのビルドを明示トリガー（push だけでは再ビルドされないことがある）
curl -s -X POST -H "Authorization: Bearer ${TOKEN}" -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/fujiken1016/mahjong-trainer/pages/builds > /dev/null
echo "deployed: https://fujiken1016.github.io/mahjong-trainer/ (反映まで〜1分)"
