# 麻雀トレーナー（毎日ラボ）

一打ごとに統計ベースの総合EV（受け入れ×打点期待×放銃リスク）でフィードバックする麻雀トレーニングアプリ。

- 公開サイト: https://mahjong.mainichi-lab.com （移行中）
- 旧URL: https://fujiken1016.github.io/mahjong-trainer/

## 構成
- `game.html` / `engine.js` / `index.html` … ソース（実戦モード・評価エンジン・何切るドリル）
- `site/` … **公開ディレクトリ（Cloudflare Pagesのビルド出力先に指定）**。`dev/build_site.sh` で生成＋法的ページ
- `site/rules/` … 初心者向け学習コンテンツ「麻雀のいろは」
- `dev/` … テスト・ビルドスクリプト・戦術知識ベース

## 開発
- テスト: `node dev/game_test2.js` ほか（dev/内）
- サイト生成: `sh dev/build_site.sh`
