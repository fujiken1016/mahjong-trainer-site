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
global.document = { getElementById(id){ return els[id] || (els[id] = makeEl()); },
  querySelectorAll(){ return []; }, createElement(){ return makeEl(); }, body: makeEl() };
global.localStorage = { getItem(){ return null; }, setItem(){} };
global.window = global; global.confirm = () => true; global.location = { reload(){} };
global.addEventListener = () => {}; global.__els = els;
const engine = fs.readFileSync('/Users/fujiken/Desktop/claude/mahjong_trainer/engine.js','utf8');
const html = fs.readFileSync('/Users/fujiken/Desktop/claude/mahjong_trainer/game.html','utf8');
const m = html.match(/<script src="engine\.js"><\/script>\s*<script>([\s\S]*?)<\/script>/);
const harness = `
window.AUTOPILOT = false; window.FAST = true; window.FAST_NORENDER = true;
(async () => {
  G.mode = "ikkyoku";
  const waitAwaiting = async () => { for(let i=0;i<600 && !UI.awaiting;i++) await new Promise(r=>setTimeout(r,10)); return !!UI.awaiting; };
  __els["start-btn"].onclick();
  if (!await waitAwaiting()) { console.log(JSON.stringify({ok:false, why:"no first prompt"})); process.exit(0); }
  const state1 = { wall: G.wall.length, hand: G.players[0].c.join(""), drawn: G.players[0].drawn, junme: G.junme, events: G.events.length };
  // 1打目を切る
  const t1 = G.players[0].c.findIndex(x=>x>0);
  UI.awaiting.resolve(t1, false);
  giveFeedbackDone: ;
  if (!await waitAwaiting()) { console.log(JSON.stringify({ok:false, why:"no second prompt (win/ryuukyoku happened - retry needed)"})); process.exit(0); }
  const state2 = { wall: G.wall.length, undoLen: G.undoStack.length, events: G.events.length };
  // 待った実行
  __els["undo-btn"].onclick();
  if (!await waitAwaiting()) { console.log(JSON.stringify({ok:false, why:"no prompt after undo"})); process.exit(0); }
  const state3 = { wall: G.wall.length, hand: G.players[0].c.join(""), drawn: G.players[0].drawn, junme: G.junme, events: G.events.length };
  console.log(JSON.stringify({
    ok: state3.wall === state1.wall && state3.hand === state1.hand && state3.drawn === state1.drawn && state3.events === state1.events,
    state1, state2, state3
  }, null, 1));
  process.exit(0);
})().catch(e => { console.error("FATAL", e && e.stack || e); process.exit(1); });
`;
eval(engine.replace(/^"use strict";/,'') + "\n" + m[1].replace(/^\s*"use strict";/,'') + "\n" + harness);
