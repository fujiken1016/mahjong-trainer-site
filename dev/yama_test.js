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
const out = [];
const t = (name, got, exp) => out.push({ name, got: JSON.stringify(got), exp: JSON.stringify(exp), pass: JSON.stringify(got) === JSON.stringify(exp) });
// 疑似セットアップ
const mkP = (river) => ({ river: (river||[]).map(x=>({t:x})), c: new Array(34).fill(0), melds: [], safe: new Set() });
const me = mkP([]);
G.players = [me, mkP([20]), mkP([19]), mkP([])]; // 2人が序盤に3索(20)・2索(19)を切っている
G.junme = 5;
let visible = new Array(34).fill(0);
visible[20] = 1; visible[19] = 1;
let w = wallReadMuls(me, visible, new Map());
t("序盤周辺切り2人→1索は山に濃い", w.mul[18] > 1.15 && w.why.has(18), true);
t("補正は他色に波及しない", w.mul[0] === 1, true);
// 終盤まで見えない中張牌
G.players = [me, mkP([]), mkP([]), mkP([])];
G.junme = 9;
visible = new Array(34).fill(0);
w = wallReadMuls(me, visible, new Map());
t("終盤まで見えない5筒は他家の手読み", w.mul[13] < 0.85 && w.why.has(13), true);
// 壁の外側: 4筒が3枚見え → 3筒は山に残りやすい(3筒自体は1枚見えで中張牌読み回避)
G.junme = 5;
visible = new Array(34).fill(0); visible[12] = 3; visible[11] = 1;
w = wallReadMuls(me, visible, new Map());
t("壁(4筒3枚見え)の外側3筒は山寄り", w.mul[11] > 1.05, true);
// 字牌対子読み: 7巡目まで誰も東を切らない
G.junme = 7;
visible = new Array(34).fill(0);
w = wallReadMuls(me, visible, new Map());
t("誰も切らない東は対子持ち読み", w.mul[27] < 0.8 && w.why.has(27), true);
const fails = out.filter(x=>!x.pass);
console.log(fails.length === 0 ? "ALL PASS (" + out.length + ")" : JSON.stringify(fails, null, 1));
process.exit(0);
`;
eval(engine.replace(/^"use strict";/,'') + "\n" + m[1].replace(/^\s*"use strict";/,'') + "\n" + harness);
