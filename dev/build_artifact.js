const fs = require('fs');
const html = fs.readFileSync('/Users/fujiken/Desktop/claude/mahjong_trainer/game.html','utf8');
const engine = fs.readFileSync('/Users/fujiken/Desktop/claude/mahjong_trainer/engine.js','utf8');
// <title> と <style> と <body>内コンテンツを抽出
const title = html.match(/<title>[\s\S]*?<\/title>/)[0];
const style = html.match(/<style>[\s\S]*?<\/style>/)[0];
let body = html.match(/<body>([\s\S]*?)<\/body>/)[1];
// engine.js をインライン化
body = body.replace('<script src="engine.js"></script>', '<script>\n' + engine + '\n</script>');
// ローカル専用のドリルモードリンクを除去
body = body.replace(/<p style="margin-top:14px"><a href="index\.html">← ドリルモードへ<\/a><\/p>/, '');
const out = title + '\n' + style + '\n' + body;
fs.writeFileSync('jantore-jissen.html', out);
console.log('bundle written:', out.length, 'chars; engine inlined:', out.includes('function dangerRate'), '; no drill link:', !out.includes('index.html'));
