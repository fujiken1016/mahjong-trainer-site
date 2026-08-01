"use strict";
/* ================================================================
   麻雀エンジン共通部（何切るドリル / 実戦モード共用）
   牌ID: 0-8=萬1-9, 9-17=筒1-9, 18-26=索1-9, 27-33=東南西北白發中
   ================================================================ */
const HONORS = "東南西北白發中";
const SUITKANJI = ["萬","筒","索"];
const KANJI_NUM = ["一","二","三","四","五","六","七","八","九"];
const YAOCHU = [0,8,9,17,18,26,27,28,29,30,31,32,33];

function tileText(i){
  if (i < 27) return (i%9+1) + "mps"[Math.floor(i/9)];
  return HONORS[i-27];
}
function tileJp(i){
  if (i < 27) return (i%9+1) + SUITKANJI[Math.floor(i/9)];
  return HONORS[i-27];
}

/* ---------------- 牌面SVG描画 ---------------- */
const RED = "#c1272d", GREEN = "#2f7d32", BLUE = "#14418c", BLACK = "#1f1f1f";
const COL = { R: RED, G: GREEN, B: BLUE };
const SERIF = "'Hiragino Mincho ProN','Yu Mincho','Noto Serif JP',serif";

function pinCircle(cx, cy, r, color){
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${(r*0.62).toFixed(1)}"/>` +
         `<circle cx="${cx}" cy="${cy}" r="${(r*0.33).toFixed(1)}" fill="${color}"/>`;
}
const PIN = {
  2:{r:11,pts:[[30,23,"G"],[30,61,"B"]]},
  3:{r:10,pts:[[15,18,"B"],[30,42,"R"],[45,66,"G"]]},
  4:{r:9.5,pts:[[17,23,"B"],[43,23,"G"],[17,61,"G"],[43,61,"B"]]},
  5:{r:8.5,pts:[[16,20,"B"],[44,20,"G"],[30,42,"R"],[16,64,"G"],[44,64,"B"]]},
  6:{r:8,pts:[[18,18,"G"],[42,18,"G"],[18,42,"R"],[42,42,"R"],[18,66,"R"],[42,66,"R"]]},
  7:{r:7.5,pts:[[13,14,"G"],[30,18,"G"],[47,22,"G"],[18,46,"R"],[42,46,"R"],[18,68,"R"],[42,68,"R"]]},
  8:{r:7.5,pts:[[18,13,"B"],[42,13,"B"],[18,32,"B"],[42,32,"B"],[18,51,"B"],[42,51,"B"],[18,70,"B"],[42,70,"B"]]},
  9:{r:7.5,pts:[[15,18,"G"],[30,18,"G"],[45,18,"G"],[15,42,"R"],[30,42,"R"],[45,42,"R"],[15,66,"B"],[30,66,"B"],[45,66,"B"]]},
};
function stick(cx, cy, len, color){
  const x = cx - 4, y = cy - len/2;
  return `<rect x="${x}" y="${y}" width="8" height="${len}" rx="4" fill="${color}"/>` +
         `<line x1="${x}" y1="${(cy-len/6).toFixed(1)}" x2="${x+8}" y2="${(cy-len/6).toFixed(1)}" stroke="#fffdf4" stroke-width="1.8"/>` +
         `<line x1="${x}" y1="${(cy+len/6).toFixed(1)}" x2="${x+8}" y2="${(cy+len/6).toFixed(1)}" stroke="#fffdf4" stroke-width="1.8"/>`;
}
const SOU = {
  2:{len:32,pts:[[30,23,"B"],[30,61,"G"]]},
  3:{len:30,pts:[[30,20,"B"],[18,61,"G"],[42,61,"G"]]},
  4:{len:32,pts:[[18,23,"B"],[42,23,"G"],[18,61,"G"],[42,61,"B"]]},
  5:{len:30,pts:[[15,20,"G"],[45,20,"B"],[30,42,"R"],[15,64,"B"],[45,64,"G"]]},
  6:{len:32,pts:[[14,23,"G"],[30,23,"G"],[46,23,"G"],[14,61,"G"],[30,61,"G"],[46,61,"G"]]},
  7:{len:21,pts:[[30,14,"R"],[14,44,"G"],[30,44,"G"],[46,44,"G"],[14,69,"G"],[30,69,"G"],[46,69,"G"]]},
  8:{len:32,pts:[[13,23,"G"],[24.3,23,"G"],[35.7,23,"G"],[47,23,"G"],[13,61,"G"],[24.3,61,"G"],[35.7,61,"G"],[47,61,"G"]]},
  9:{len:21,pts:[[15,17,"G"],[30,17,"G"],[45,17,"G"],[15,42,"R"],[30,42,"R"],[45,42,"R"],[15,67,"G"],[30,67,"G"],[45,67,"G"]]},
};
function birdFace(){
  return `<g>
    <path d="M20 56 Q10 68 12 76" fill="none" stroke="${GREEN}" stroke-width="3" stroke-linecap="round"/>
    <path d="M24 58 Q18 70 22 78" fill="none" stroke="${GREEN}" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="28" cy="42" rx="11" ry="16" fill="${GREEN}"/>
    <ellipse cx="24" cy="42" rx="5.5" ry="11" fill="${RED}"/>
    <path d="M28 28 Q30 18 37 17" fill="none" stroke="${GREEN}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="38" cy="18" r="7" fill="${GREEN}"/>
    <path d="M44 15 L54 17 L44 21 Z" fill="${RED}"/>
    <circle cx="38.5" cy="16.5" r="1.6" fill="#fffdf4"/>
    <line x1="30" y1="57" x2="30" y2="72" stroke="${RED}" stroke-width="2.6" stroke-linecap="round"/>
    <line x1="35" y1="56" x2="38" y2="71" stroke="${RED}" stroke-width="2.6" stroke-linecap="round"/>
  </g>`;
}
function face(id, red){
  if (id < 9){
    const numColor = red ? RED : BLACK;
    return `<text x="30" y="24" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-weight="900" font-size="33" fill="${numColor}">${KANJI_NUM[id]}</text>` +
           `<text x="30" y="62" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-weight="900" font-size="33" fill="${RED}">萬</text>`;
  }
  if (id < 18){
    const n = id - 9 + 1;
    if (n === 1){
      return `<circle cx="30" cy="42" r="26" fill="none" stroke="${BLUE}" stroke-width="2.4" stroke-dasharray="4.5 3.4"/>` + pinCircle(30,42,17,RED);
    }
    const L = PIN[n];
    return L.pts.map(([x,y,c]) => pinCircle(x,y,L.r, red ? RED : COL[c])).join("");
  }
  if (id < 27){
    const n = id - 18 + 1;
    if (n === 1) return birdFace();
    if (n === 8){
      // 実物の8索: 上段が∧∧、下段が∨∨のアーチ型
      const c8 = red ? RED : GREEN;
      const st = (cx,cy,ang) => `<g transform="rotate(${ang} ${cx} ${cy})">${stick(cx,cy,27,c8)}</g>`;
      return st(13,23,15)+st(25,23,-15)+st(35,23,15)+st(47,23,-15)
           + st(13,61,-15)+st(25,61,15)+st(35,61,-15)+st(47,61,15);
    }
    const L = SOU[n];
    return L.pts.map(([x,y,c]) => stick(x,y,L.len, red ? RED : COL[c])).join("");
  }
  const ch = HONORS[id-27];
  if (ch === "白") return `<rect x="11" y="13" width="38" height="58" rx="4" fill="none" stroke="${BLUE}" stroke-width="4"/>`;
  const color = ch === "發" ? GREEN : ch === "中" ? RED : BLACK;
  return `<text x="30" y="43" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-weight="800" font-size="46" fill="${color}">${ch}</text>`;
}
function faceSvg(id, red){ return `<svg viewBox="0 0 60 84" xmlns="http://www.w3.org/2000/svg">${face(id, red)}</svg>`; }

/* ---------------- 向聴数計算 ---------------- */
const MEMO = new Map();
function paretoAdd(list, m, t){
  for (let i=0;i<list.length;i++){ if (list[i][0]>=m && list[i][1]>=t) return; }
  for (let i=list.length-1;i>=0;i--){ if (m>=list[i][0] && t>=list[i][1]) list.splice(i,1); }
  list.push([m,t]);
}
function suitRec(a, i){
  while (i<9 && a[i]===0) i++;
  if (i>=9) return [[0,0]];
  const key = i + "|" + a.join("");
  const hit = MEMO.get(key);
  if (hit) return hit;
  const out = [];
  const merge = (sub, dm, dt) => { for (const [m,t] of sub) paretoAdd(out, Math.min(4,m+dm), Math.min(4,t+dt)); };
  if (a[i]>=3){ a[i]-=3; merge(suitRec(a,i),1,0); a[i]+=3; }
  if (i<7 && a[i+1]>0 && a[i+2]>0){ a[i]--;a[i+1]--;a[i+2]--; merge(suitRec(a,i),1,0); a[i]++;a[i+1]++;a[i+2]++; }
  if (a[i]>=2){ a[i]-=2; merge(suitRec(a,i),0,1); a[i]+=2; }
  if (i<8 && a[i+1]>0){ a[i]--;a[i+1]--; merge(suitRec(a,i),0,1); a[i]++;a[i+1]++; }
  if (i<7 && a[i+2]>0){ a[i]--;a[i+2]--; merge(suitRec(a,i),0,1); a[i]++;a[i+2]++; }
  a[i]--; merge(suitRec(a,i),0,0); a[i]++;
  MEMO.set(key, out);
  return out;
}
function maxV(c, cap){
  if (cap == null) cap = 4;
  const lm = suitRec(c.slice(0,9),0), lp = suitRec(c.slice(9,18),0), ls = suitRec(c.slice(18,27),0);
  let hm=0, ht=0;
  for (let i=27;i<34;i++){ if (c[i]>=3) hm++; else if (c[i]===2) ht++; }
  let best = 0;
  for (const [m1,t1] of lm) for (const [m2,t2] of lp) for (const [m3,t3] of ls){
    const m = Math.min(cap, m1+m2+m3+hm);
    const t = t1+t2+t3+ht;
    const v = 2*m + Math.min(t, cap-m);
    if (v > best) best = v;
  }
  return best;
}
// fixed = 副露（ポン・チー）の数。副露分は確定面子として計算
function regularSh(c, fixed){
  fixed = fixed || 0;
  const cap = 4 - fixed;
  let best = 8 - 2*fixed - maxV(c, cap);
  for (let j=0;j<34;j++) if (c[j]>=2){
    c[j]-=2;
    const s = 7 - 2*fixed - maxV(c, cap);
    if (s < best) best = s;
    c[j]+=2;
  }
  return best;
}
function chiitoiSh(c){
  let pairs=0, kinds=0;
  for (const x of c){ if (x>0) kinds++; if (x>=2) pairs++; }
  return 6 - pairs + Math.max(0, 7-kinds);
}
function kokushiSh(c){
  let kinds=0, pair=0;
  for (const i of YAOCHU){ if (c[i]>0) kinds++; if (c[i]>=2) pair=1; }
  return 13 - kinds - pair;
}
function shanten(c, fixed){
  if (fixed) return regularSh(c, fixed); // 副露あり=七対子・国士は不可
  return Math.min(regularSh(c, 0), chiitoiSh(c), kokushiSh(c));
}

/* ---------------- 受け入れ・待ち ---------------- */
// c13: 手牌(副露除く), known: 見えている全牌カウント, fixed: 副露数
function ukeire(c13, known, fixed){
  const s = shanten(c13, fixed);
  const tiles = []; let total = 0;
  for (let k=0;k<34;k++){
    const rem = 4 - known[k];
    if (rem <= 0 || c13[k] >= 4) continue;
    c13[k]++;
    if (shanten(c13, fixed) < s) { tiles.push([k, rem]); total += rem; }
    c13[k]--;
  }
  return { shanten: s, kinds: tiles.length, count: total, tiles };
}
function evaluateAll(c14, knownExtra, fixed){
  const known = knownExtra || c14.slice();
  const res = [];
  for (let d=0;d<34;d++){
    if (c14[d]===0) continue;
    c14[d]--;
    const u = ukeire(c14, known, fixed);
    c14[d]++;
    res.push({ d, ...u });
  }
  res.sort((a,b)=> a.shanten-b.shanten || b.count-a.count || b.kinds-a.kinds);
  return res;
}
// 聴牌時の待ち牌リスト（残枚数は考慮しない、和了牌かどうかのみ）
function waitTiles(c13, fixed){
  const w = [];
  if (shanten(c13, fixed) !== 0) return w;
  for (let k=0;k<34;k++){
    if (c13[k] >= 4) continue;
    c13[k]++;
    if (shanten(c13, fixed) === -1) w.push(k);
    c13[k]--;
  }
  return w;
}

function parseHand(str){
  const c = new Array(34).fill(0);
  let nums = [];
  for (const ch of str){
    if (/\d/.test(ch)) nums.push(Number(ch));
    else if ("mpsz".includes(ch)){
      const base = {m:0,p:9,s:18,z:27}[ch];
      for (const n of nums) c[base + n - 1]++;
      nums = [];
    }
  }
  return c;
}

/* ---------------- ドラ ---------------- */
function nextDora(ind){
  if (ind < 27){
    const suit = Math.floor(ind/9), n = ind%9;
    return suit*9 + (n+1)%9;
  }
  if (ind <= 30) return 27 + (ind-27+1)%4; // 東南西北
  return 31 + (ind-31+1)%3;                // 白發中
}

/* ---------------- 和了分解・役・点数 ----------------
   ※門前限定の簡易実装。対応役: 立直/一発/門前ツモ/平和/断么九/
     役牌(三元牌・自風・場風)/七対子/混一色/清一色/国士無双/ドラ/裏ドラ
--------------------------------------------------------- */
function decomposeWin(c){
  const res = [];
  for (let p=0;p<34;p++){
    if (c[p] < 2) continue;
    c[p] -= 2;
    const sets = [];
    (function rec(i){
      while (i<34 && c[i]===0) i++;
      if (i>=34){ res.push({ pair:p, sets: sets.slice() }); return; }
      if (c[i]>=3){ c[i]-=3; sets.push({t:i,run:false}); rec(i); sets.pop(); c[i]+=3; }
      if (i<27 && i%9<7 && c[i+1]>0 && c[i+2]>0){
        c[i]--;c[i+1]--;c[i+2]--; sets.push({t:i,run:true}); rec(i); sets.pop(); c[i]++;c[i+1]++;c[i+2]++;
      }
    })(0);
    c[p] += 2;
  }
  return res;
}
// o: {hand14(副露除く手牌+和了牌), melds:[{t,run}], winTile, tsumo, riichi, ippatsu,
//     seatWind, roundWind, doraInd:[], uraInd:[], dealer, aka, wriichi, kiriage, kuitan}
// 戻り値: null=役なし(和了不可) / {yaku:[[名,翻]], han, fu, pts, label}
function scoreWin(o){
  const c = o.hand14;
  const melds = o.melds || [];
  const fixed = melds.length;
  const menzen = o.menzen != null ? o.menzen : fixed === 0; // 暗槓は門前扱い
  if (shanten(c, fixed) !== -1) return null;
  // 副露牌も含めた全使用牌リスト（カンは4枚＝ドラも4枚分乗る）
  const meldTiles = [];
  for (const m of melds){
    if (m.run) meldTiles.push(m.t, m.t+1, m.t+2);
    else if (m.kan) meldTiles.push(m.t, m.t, m.t, m.t);
    else meldTiles.push(m.t, m.t, m.t);
  }
  const doraTiles = (o.doraInd||[]).map(nextDora);
  const uraTiles = (o.riichi && o.uraInd) ? o.uraInd.map(nextDora) : [];
  let doraCnt = 0, uraCnt = 0;
  for (let i=0;i<34;i++){
    for (const d of doraTiles) if (d===i) doraCnt += c[i];
    for (const u of uraTiles) if (u===i) uraCnt += c[i];
  }
  for (const t of meldTiles){
    for (const d of doraTiles) if (d===t) doraCnt++;
    for (const u of uraTiles) if (u===t) uraCnt++;
  }
  const commonYaku = [];
  if (o.riichi && menzen) commonYaku.push(o.wriichi ? ["ダブル立直",2] : ["立直",1]);
  if (o.ippatsu && menzen) commonYaku.push(["一発",1]);
  if (o.tsumo && menzen) commonYaku.push(["門前清自摸和",1]);
  const allSimple = YAOCHU.every(i=>c[i]===0) && meldTiles.every(t => !YAOCHU.includes(t));
  if (allSimple && (menzen || o.kuitan !== false)) commonYaku.push(["断么九",1]);
  const suitsUsed = [0,1,2].filter(s =>
    c.slice(s*9,s*9+9).some(x=>x>0) || meldTiles.some(t => t>=s*9 && t<s*9+9));
  const hasHonor = c.slice(27).some(x=>x>0) || meldTiles.some(t=>t>=27);
  if (suitsUsed.length===1) commonYaku.push(hasHonor ? ["混一色", menzen?3:2] : ["清一色", menzen?6:5]);

  // 国士無双（門前のみ）
  if (menzen && kokushiSh(c) === -1){
    const pts = calcPoints(13, 30, o.dealer, o.tsumo);
    return { yaku:[["国士無双","役満"]], han:13, fu:30, pts, label:"役満" };
  }

  const candidates = [];
  // 七対子（門前のみ）
  if (menzen){
    let pairs7 = 0;
    for (const x of c) if (x===2) pairs7++;
    if (pairs7 === 7) candidates.push({ yaku:[["七対子",2], ...commonYaku], fu:25 });
  }
  // 通常形
  const meldSets = melds.map(m => ({ t: m.t, run: !!m.run }));
  for (const dec of decomposeWin(c)){
    const yaku = [];
    const allSets = [...dec.sets, ...meldSets];
    for (const s of allSets){
      if (s.run) continue;
      if (s.t >= 31) yaku.push([["白","發","中"][s.t-31], 1]);
      if (s.t === o.seatWind) yaku.push(["自風 " + HONORS[s.t-27], 1]);
      if (s.t === o.roundWind) yaku.push(["場風 " + HONORS[s.t-27], 1]);
    }
    if (allSets.length === 4 && allSets.every(s=>!s.run)) yaku.push(["対々和",2]);
    // 平和（門前かつ副露・カンなしのみ）
    let pinfu = false;
    const pairYakuhai = dec.pair >= 31 || dec.pair === o.seatWind || dec.pair === o.roundWind;
    if (menzen && fixed === 0 && !pairYakuhai && dec.sets.every(s=>s.run) && o.winTile != null && o.winTile !== dec.pair){
      for (const s of dec.sets){
        if (o.winTile === s.t && (s.t+1)%9 !== 7) { pinfu = true; break; }
        if (o.winTile === s.t+2 && s.t%9 !== 0) { pinfu = true; break; }
      }
    }
    if (pinfu) yaku.push(["平和",1]);
    candidates.push({ yaku:[...yaku, ...commonYaku], fu: pinfu ? (o.tsumo?20:30) : 30 });
  }
  if (!candidates.length) return null;

  let best = null;
  for (const cand of candidates){
    let han = cand.yaku.reduce((a,[,h])=>a+h, 0);
    if (han === 0) continue; // 役なし
    const yaku = cand.yaku.slice();
    if (doraCnt){ yaku.push(["ドラ",doraCnt]); han += doraCnt; }
    if (o.aka){ yaku.push(["赤ドラ",o.aka]); han += o.aka; }
    if (uraCnt){ yaku.push(["裏ドラ",uraCnt]); han += uraCnt; }
    if (!best || han > best.han || (han===best.han && cand.fu > best.fu)){
      best = { yaku, han, fu: cand.fu };
    }
  }
  if (!best) return null;
  best.pts = calcPoints(best.han, best.fu, o.dealer, o.tsumo, o.kiriage);
  best.label = hanLabel(best.han, best.fu, o.kiriage);
  return best;
}
function hanLabel(han, fu, kiriage){
  if (han >= 13) return "役満";
  if (han >= 11) return "三倍満";
  if (han >= 8) return "倍満";
  if (han >= 6) return "跳満";
  const raw = fu * (1<<(2+han));
  if (han >= 5 || raw > 2000 || (kiriage && raw === 1920)) return "満貫";
  return "";
}
// 戻り値: tsumo → {each} (親) / {dealerPay, otherPay} (子)、ron → {total}
function calcPoints(han, fu, dealer, tsumo, kiriage){
  let base;
  if (han >= 13) base = 8000;
  else if (han >= 11) base = 6000;
  else if (han >= 8) base = 4000;
  else if (han >= 6) base = 3000;
  else if (han >= 5) base = 2000;
  else {
    base = fu * (1 << (2+han));
    if (kiriage && base === 1920) base = 2000; // 切り上げ満貫(30符4翻/60符3翻)
    if (base > 2000) base = 2000;
  }
  const c100 = x => Math.ceil(x/100)*100;
  if (tsumo){
    if (dealer){ const e = c100(base*2); return { tsumo:true, each:e, total:e*3 }; }
    const d = c100(base*2), oth = c100(base);
    return { tsumo:true, dealerPay:d, otherPay:oth, total: d + oth*2 };
  }
  return { tsumo:false, total: c100(base * (dealer?6:4)) };
}

/* ---------------- 対リーチ放銃率（統計ベース） ----------------
   「残り筋メソッド」: 無筋456=140 / 無筋37=100 / 無筋28=90 / 無筋19・片筋456=80 を
   残り筋本数で割って%とする近似（『科学する麻雀』『統計学』のマージャン戦術系）。
   壁（ワンチャンス/ノーチャンス）補正・字牌の見え枚数補正つき。 */
function remainingSujiCount(safeSet){
  let cleared = 0;
  for (let s=0;s<3;s++){
    for (let a=0;a<6;a++){ // 1-4, 2-5, ... 6-9 の18本
      if (safeSet.has(s*9+a) || safeSet.has(s*9+a+3)) cleared++;
    }
  }
  return 18 - cleared;
}
// 壁: 両面待ちを構成する中間牌が4枚見え=その側は死に、3枚見え=ワンチャンス
function wallFactor(t, visible){
  if (t >= 27) return 1;
  const n = t % 9, suit = Math.floor(t/9)*9;
  const cnt = k => (k<0 || k>8) ? 4 : visible[suit+k];
  const lowDead  = n < 2 || cnt(n-1) >= 4 || cnt(n-2) >= 4;
  const highDead = n > 6 || cnt(n+1) >= 4 || cnt(n+2) >= 4;
  if (lowDead && highDead) return 0.25; // ノーチャンス（両面では当たらない）
  const lowThin  = lowDead  || cnt(n-1) >= 3 || cnt(n-2) >= 3;
  const highThin = highDead || cnt(n+1) >= 3 || cnt(n+2) >= 3;
  if (lowThin && highThin) return 0.55; // ワンチャンス級
  return 1;
}
// 推定放銃率（%）。threatSafe: そのリーチ者に通る牌Set / visible: 見えている全牌カウント
function dangerRate(t, safeSet, visible){
  if (safeSet.has(t)) return 0;
  if (t >= 27){
    const unseen = 4 - visible[t];
    if (unseen <= 0) return 0;
    if (unseen === 1) return 0.3;  // 2枚切れ字牌
    if (unseen === 2) return 0.9;  // 1枚切れ字牌
    return 1.7;                    // 生牌字牌
  }
  const n = t%9 + 1, base = t - (n-1);
  const safe = x => safeSet.has(base + x - 1);
  let sujiSafe;
  if (n <= 3) sujiSafe = safe(n+3);
  else if (n >= 7) sujiSafe = safe(n-3);
  else sujiSafe = safe(n-3) && safe(n+3);
  let rate;
  if (sujiSafe){
    rate = (n===1||n===9) ? 0.9 : (n===2||n===8) ? 1.7 : 2.2; // 筋でも愚形には当たる
  } else {
    const remaining = Math.max(4, remainingSujiCount(safeSet));
    const half456 = (n>=4 && n<=6) && (safe(n-3) || safe(n+3));
    const V = (n>=4&&n<=6) ? (half456 ? 80 : 140) : (n===3||n===7) ? 100 : (n===2||n===8) ? 90 : 80;
    rate = 0.75 * V / remaining; // 残り18本のとき無筋456≒5.8%
  }
  return rate * wallFactor(t, visible);
}
/* ---------------- 1向聴の形の質（2段階受け入れ） ----------------
   受け入れ各牌でテンパイした時の最終待ち枚数を計算し、良形テンパイ率と平均待ちを返す */
function shapeQuality(c13, known, fixed){
  const u = ukeire(c13, known, fixed);
  if (u.shanten !== 1 || !u.tiles.length) return null;
  let tot = 0, good = 0, wsum = 0;
  for (const [t, cnt] of u.tiles){
    c13[t]++;
    const ev = evaluateAll(c13, known, fixed);
    c13[t]--;
    const w = ev[0].count;
    tot += cnt; wsum += cnt * w;
    if (w >= 6) good += cnt;
  }
  return { goodRate: good / tot, avgWait: wsum / tot };
}
/* ---------------- 簡易打点期待値 ----------------
   13枚の手牌から「リーチして和了した場合」の概算打点（子基準）を見積もる。
   ドラ・赤・タンヤオ・役牌・染め手気配などを翻数に換算。あくまでヒューリスティック。 */
function estimateHandValue(c13, aka, doraTiles, seatW, roundW, open, kuitanOk){
  let han = open ? 0.4 : 1.8; // 門前=リーチ+一発/裏/ツモの平均期待、副露=その分なし
  let dora = 0;
  for (let i=0;i<34;i++) if (c13[i]) for (const d of doraTiles) if (d===i) dora += c13[i];
  han += dora + (aka||0);
  // ドラそば孤立牌: ドラ引きのくっつき期待
  for (const d of doraTiles){
    if (d >= 27) continue;
    const s9 = Math.floor(d/9)*9, dn = d%9;
    if ((dn > 0 && c13[s9+dn-1] > 0) || (dn < 8 && c13[s9+dn+1] > 0)){ han += 0.25; break; }
  }
  if (YAOCHU.every(i=>c13[i]===0) && (!open || kuitanOk !== false)) han += 0.9; // タンヤオ濃厚
  const yakuhai = new Set([31,32,33]);
  if (seatW!=null) yakuhai.add(seatW);
  if (roundW!=null) yakuhai.add(roundW);
  for (const t of yakuhai){
    if (c13[t]>=3) han += 1; else if (c13[t]===2) han += 0.5;
  }
  const suits = [0,1,2].filter(s=>c13.slice(s*9,s*9+9).some(x=>x>0));
  if (suits.length===1){
    const honors = c13.slice(27).reduce((a,b)=>a+b,0);
    han += honors>0 ? 1.5 : 2.5;                             // 混一/清一気配
  }
  let pairs=0; for(const x of c13) if(x>=2) pairs++;
  if (pairs>=5) han += 0.5;                                  // 七対子気配
  // 三色同順の気配: 同じ数字帯の順子パーツが2色以上に
  let sanshoku = 0;
  for (let n=0;n<7;n++){
    const done = [0,1,2].filter(s => [n,n+1,n+2].filter(k => c13[s*9+k] > 0).length === 3).length;
    const partial = [0,1,2].filter(s => [n,n+1,n+2].filter(k => c13[s*9+k] > 0).length >= 2).length;
    if (done >= 2 && partial === 3) sanshoku = Math.max(sanshoku, 1.2);
    else if (done >= 1 && partial === 3) sanshoku = Math.max(sanshoku, 0.5);
    else if (partial === 3) sanshoku = Math.max(sanshoku, 0.25);
  }
  han += sanshoku;
  // 一気通貫の気配: 1色で123/456/789の各ブロックに2枚以上
  for (let s=0;s<3;s++){
    const blocks = [0,1,2].map(b => [0,1,2].filter(k => c13[s*9+b*3+k] > 0).length);
    if (blocks.every(x => x === 3)){ han += 1.2; break; }
    if (blocks.every(x => x >= 2)){ han += 0.45; break; }
  }
  const h = Math.min(13, Math.max(1, Math.round(han)));
  return { hanEst: h, value: calcPoints(h, 30, false, false).total };
}
/* ---------------- 和了率推定（統計ベース） ----------------
   軸: 鳳凰卓統計「先制両面リーチの和了率 ≒ 9巡目53%、1巡ごとに±4%」
   （みーにん・麻雀数理研究会のデータに基づく近似式）*/
function winProbEst(sh, ukeCount, junme, waitsLeft){
  if (sh <= 0){
    let base = 0.53 + 0.04 * (9 - junme);
    const w = waitsLeft != null ? waitsLeft : ukeCount;
    if (w <= 1) base -= 0.26;        // 枯れかけ待ち
    else if (w <= 2) base -= 0.20;   // 残り2枚の愚形
    else if (w <= 4) base -= 0.15;   // 愚形（データ: 5巡目 両面68% vs 愚形53%）
    else if (w >= 8) base += 0.03;   // 広い良形
    return Math.min(0.92, Math.max(0.04, base));
  }
  if (sh === 1) return Math.min(0.55, Math.max(0.02, 0.46 - 0.028*(junme-1) + 0.003*Math.min(ukeCount,40)));
  if (sh === 2) return Math.min(0.38, Math.max(0.01, 0.34 - 0.024*(junme-1) + 0.0012*Math.min(ukeCount,60)));
  // 3向聴以上: 配牌時点の局和了率≒25%前後から巡目・向聴で減衰
  return Math.max(0.005, 0.27 - 0.04*(sh-3) - 0.022*(junme-1));
}
function dangerLabel(rate){
  if (rate === 0) return "現物";
  if (rate < 1) return "ほぼ安全";
  if (rate < 2.5) return "筋・字牌級";
  if (rate < 5) return "やや危険";
  if (rate < 8) return "危険";
  return "超危険";
}
