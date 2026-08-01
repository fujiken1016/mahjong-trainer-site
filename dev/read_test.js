const fs = require('fs');
function makeEl(){
  const el = { innerHTML:"", textContent:"", style:{}, dataset:{}, onclick:null,
    classList:{ add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    children: [], querySelectorAll(){ return []; },
    appendChild(x){ this.children.push(x); }, prepend(x){ this.children.unshift(x); },
    remove(){}, setAttribute(){}, addEventListener(){}, scrollTop: 0 };
  Object.defineProperty(el, 'lastChild', { get(){ return this.children[this.children.length-1] || { remove(){} }; } });
  return el;
}
const els = {};
global.document = { getElementById(id){ return els[id] || (els[id] = makeEl()); },
  querySelectorAll(){ return []; }, createElement(){ return makeEl(); }, body: makeEl() };
global.localStorage = { getItem(){ return null; }, setItem(){} };
global.window = global; global.confirm = () => true; global.location = { reload(){} };
global.addEventListener = () => {};
const engine = fs.readFileSync('/Users/fujiken/Desktop/claude/mahjong_trainer/engine.js','utf8');
const html = fs.readFileSync('/Users/fujiken/Desktop/claude/mahjong_trainer/game.html','utf8');
const m = html.match(/<script src="engine\.js"><\/script>\s*<script>([\s\S]*?)<\/script>/);
const harness = `
const t = (name, got, exp) => ({ name, got: JSON.stringify(got), exp: JSON.stringify(exp), pass: JSON.stringify(got) === JSON.stringify(exp) });
const out = [];
const mk = (riverTiles, melds) => ({ river: riverTiles.map(x=>({t:x})), melds: melds||[] });
// 索子染め疑い: 萬・筒・字ばかり切って索子ゼロ
let rd = readRiver(mk([0,4,8,10,13,16,27,31], []));
out.push(t("索子染め検出", rd ? [rd.type, rd.suit] : null, ["honitsu", 2]));
// 通常の河（3色バラけて切っている）→ 読みなし
rd = readRiver(mk([0,4,10,13,19,22,27,31], []));
out.push(t("通常河は誤検出しない", rd, null));
// 序盤すぎ(4枚) → 読みなし
rd = readRiver(mk([0,4,10,27], []));
out.push(t("序盤は判定保留", rd, null));
// 国士疑い: 中張牌のみ連打
rd = readRiver(mk([4,5,12,13,21,22], []));
out.push(t("国士疑い検出", rd ? rd.type : null, "kokushi"));
// 危険度倍率: 染め読み → その色と字牌は上がり、他色は下がる
const som = { type:"honitsu", suit:2, level:3, name:"索子" };
out.push(t("染め: 索子は危険UP", readDangerMul(som, 22) > 2, true));
out.push(t("染め: 字牌も危険UP", readDangerMul(som, 31) > 2, true));
out.push(t("染め: 他色は安全寄り", readDangerMul(som, 4) < 1, true));
const kok = { type:"kokushi", level:2 };
out.push(t("国士: 字牌危険UP", readDangerMul(kok, 33) > 2, true));
out.push(t("国士: 中張牌は安全寄り", readDangerMul(kok, 13) < 1, true));
// 点数状況ヘルパ
out.push(t("逆転条件(3000点差)", overtakeHint(3000), "3900直撃 or 満貫ツモ級で逆転"));
const fails = out.filter(x=>!x.pass);
console.log(fails.length === 0 ? "ALL PASS (" + out.length + ")" : JSON.stringify(fails, null, 1));
process.exit(0);
`;
eval(engine.replace(/^"use strict";/,'') + "\n" + m[1].replace(/^\s*"use strict";/,'') + "\n" + harness);
