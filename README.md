# 麻雀トレーナー（毎日ラボ）

一打ごとに統計ベースの総合EV（受け入れ×打点期待×放銃リスク）でフィードバックする麻雀トレーニングアプリ。

- 公開サイト: https://mahjong.mainichi-lab.com （移行中）
- 旧URL: https://fujiken1016.github.io/mahjong-trainer/

## 構成

**ソース（リポジトリ直下。ここだけを編集する）**
- `game.html` … 実戦モード → `site/index.html`
- `index.html` … 何切るドリル → `site/drill.html`
- `engine.js` … 評価エンジン → `site/engine.js`
- `mahjong_trainer.html` … 初心者向け学習コンテンツ「麻雀のいろは」→ `site/rules/index.html`
- `dev/` … テスト・ビルドスクリプト・戦術知識ベース

**生成物**
- `site/` … **公開ディレクトリ（Cloudflare Pagesのビルド出力先に指定）**。`dev/build_site.sh` が上記ソースから生成する
- 法的ページ（`site/about.html` `privacy.html` `disclaimer.html` `contact.html` `404.html` `articles/` `shop.js` `sitemap.xml` `robots.txt`）はビルド対象外の静的ファイルで、`site/` 配下が正本

## ⚠️ `site/` を直接編集しない

`site/index.html` / `site/drill.html` / `site/engine.js` / `site/rules/index.html` の4つは `dev/build_site.sh` の生成物。
直接編集しても次回ビルドで上書きされて消える（GA4タグとSEOメタが過去に2回これで消失）。必ずリポジトリ直下のソースを編集してからビルドする。

ソースは公開対象外（Pagesの出力先が `site/` なので、リポジトリ直下のHTMLは配信されない）。**ソースを `site/` 配下に置かないこと。**

## 開発
- テスト: `node dev/game_test2.js` ほか（dev/内）
- サイト生成: `sh dev/build_site.sh` → commit → push（Cloudflare Pagesが自動デプロイ、約1分）
