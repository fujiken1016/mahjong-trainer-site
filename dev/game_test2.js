const fs = require('fs');
function makeEl(){
  const el = {
    innerHTML:"", textContent:"", style:{}, dataset:{}, onclick:null,
    classList:{ add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    children: [],
    querySelectorAll(){ return []; },
    appendChild(x){ this.children.push(x); },
    prepend(x){ this.children.unshift(x); },
    remove(){},
    setAttribute(){}, addEventListener(){},
    scrollTop: 0,
  };
  Object.defineProperty(el, 'lastChild', { get(){ return this.children[this.children.length-1] || { remove(){} }; } });
  return el;
}
const els = {};
global.document = {
  getElementById(id){ return els[id] || (els[id] = makeEl()); },
  querySelectorAll(){ return []; },
  createElement(){ return makeEl(); },
  body: makeEl(),
};
global.localStorage = { getItem(){ return null; }, setItem(){}, removeItem(){} };
global.window = global;
global.confirm = () => true;
global.location = { reload(){} };
global.addEventListener = () => {};
global.__els = els;

const engine = fs.readFileSync('/Users/fujiken/Desktop/claude/mahjong_trainer/engine.js','utf8');
const html = fs.readFileSync('/Users/fujiken/Desktop/claude/mahjong_trainer/game.html','utf8');
const m = html.match(/<script src="engine\.js"><\/script>\s*<script>([\s\S]*?)<\/script>/);
const harness = `
window.AUTOPILOT = true; window.FAST = true; window.FAST_NORENDER = true;
(async () => {
  const configs = [
    { mode:'tonpuu', rules:{ naki:true, kuitan:true } },
    { mode:'tonnan', rules:{ naki:true, atamahane:false, sudden:true } },
    { mode:'ikkyoku', rules:{ naki:true, aka:0, ippatsuUra:false } },
    { mode:'tonpuu', rules:{ naki:false, kiriage:true, notenbappu:false, renchanTenpai:false } },
    { mode:'tonnan', rules:{ naki:true, kuitan:false, startScore:30000, tobi:false } },
  ];
  const results = [];
  for (const cfg of configs){
    G.mode = cfg.mode;
    G.rules = Object.assign({ aka:3, ippatsuUra:true, startScore:25000, tobi:true, uma:"10-20", oka:true, kiriage:false,
      haitei:true, wriichi:true, kyuushu:true, atamahane:true, notenbappu:true, renchanTenpai:true, sudden:false }, cfg.rules);
    window.FINAL = null;
    __els["start-btn"].onclick();
    for (let i=0;i<1200 && !window.FINAL;i++) await new Promise(r=>setTimeout(r,50));
    if (!window.FINAL){ results.push({ mode:cfg.mode, error:"TIMEOUT", kyoku: kyokuLabel(), wall: G.wall.length }); continue; }
    const sum = window.FINAL.scores.reduce((a,b)=>a+b,0);
    results.push({ mode:cfg.mode, scores:window.FINAL.scores, sumOk: sum + G.kyotaku*1000 === G.rules.startScore*4, events: window.FINAL.events });
  }
  const withThreat = G.events.filter(e=>e.detail && e.detail.threats); const nonBest = G.events.filter(e=>e.detail && e.grade!=="best"); const meldCounts = G.players.map(p=>p.melds.length); const samples = [...G.events.filter(e=>e.detail).slice(0,2), ...withThreat.slice(0,3), ...nonBest.slice(0,3)].map(e=>({grade:e.grade, text:e.text.slice(0,130)}));
  console.log(JSON.stringify({ results, lastGameMelds: meldCounts, samples: samples.slice(0,4) }, null, 1));
})().catch(e => { console.error("FATAL", e && e.stack || e); process.exit(1); });
`;
const src = engine.replace(/^"use strict";/,'') + "\n" + m[1].replace(/^\s*"use strict";/,'') + "\n" + harness;
eval(src);
