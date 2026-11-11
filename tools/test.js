// node tools/test.js — checks the recipe data and the app's rules.
"use strict";
const assert = require("assert");
const path = require("path");
const D = require(path.join(__dirname, "..", "recipes.js"));
const M = require(path.join(__dirname, "..", "logic.js"));
const ART = require(path.join(__dirname, "..", "art.js"));
const R = D.RECIPES, P = D.PANTRY;
let n = 0;
const test = (name, fn) => { fn(); n++; console.log("  ok  " + name); };
const seeded = (s) => () => (s = (s * 16807) % 2147483647) / 2147483647;
const rec = (id) => R.find((r) => r.id === id);

test("모든 요리에 이름·재료·순서·시간·칼로리·그림이 있다", () => {
  const errs = M.validate(D, ART.check);
  assert.deepStrictEqual(errs, [], errs.join("\n"));
});
test("검사기가 빠진 내용을 잡아낸다", () => {
  const bad = { id: "Bad Id", name: "", tags: ["nope"], kind: "x", time: 90, ingredients: [{ name: "두부" }], steps: [""], art: { dish: "cup" } };
  const errs = M.validate(Object.assign({}, D, { RECIPES: [bad, R[0], R[0]] }), ART.check);
  ["id 는", "이름 없음", "모르는 주재료", "모르는 종류", "조리 시간", "칼로리", "단백질", "재료가 2개 미만", "순서가 2개 미만", "모르는 그릇", "id 겹침"]
    .forEach((w) => assert(errs.some((e) => e.includes(w)), "못 잡음: " + w));
});
test("요리는 30개 이상, 양배추·두부·계란은 대표 메뉴가 8개 이상", () => {
  assert(R.length >= 30);
  ["cabbage", "tofu", "egg"].forEach((t) => assert(R.filter((r) => r.tags[0] === t).length >= 8, t));
  D.INGREDIENTS.forEach((t) => assert(M.filter(R, t.id).length >= 4, t.id));
  D.KINDS.forEach((k) => assert(M.filter(R, "all", k.id).length >= 3, k.id));
});
test("모든 그림이 그려진다", () => {
  R.forEach((r) => assert(ART.dish(r.art).length > 300, r.id));
  D.INGREDIENTS.forEach((t) => assert(ART.icon(t.id) !== ART.icon("all"), "아이콘 없음: " + t.id));
});
test("우리 집 재료는 모두 어떤 요리에 쓰이고, 주재료는 양념으로 새지 않는다", () => {
  const used = new Set();
  R.forEach((r) => r.ingredients.forEach((g) => { const it = M.itemOf(g.name, P); if (it) used.add(it); }));
  P.forEach((p) => assert(used.has(p.id), "안 쓰이는 재료: " + p.name));
  // every dish must depend on at least one tracked ingredient, or "집에 있는 재료로 돼요" would be meaningless
  R.forEach((r) => assert(r.ingredients.some((g) => M.itemOf(g.name, P) && !g.opt), "따질 재료가 없음: " + r.name));
});

test("필터: 재료와 종류가 둘 다 맞는 것만, 대표 재료가 먼저", () => {
  const tofuSoup = M.filter(R, "tofu", "soup");
  assert(tofuSoup.length >= 3);
  tofuSoup.forEach((r) => assert(r.tags.includes("tofu") && r.kind === "soup"));
  const egg = M.filter(R, "egg", "all"), firstOther = egg.findIndex((r) => r.tags[0] !== "egg");
  assert(firstOther > 0 && egg.slice(firstOther).every((r) => r.tags[0] !== "egg"));
  assert.strictEqual(M.filter(R, "all", "all").length, R.length);
  assert.strictEqual(M.filter(R, "mushroom", "fresh").length, 0);
});
test("찜: 켜고 끄기, 찜한 것이 위로", () => {
  let f = M.toggle([], "egg-soup"); f = M.toggle(f, "tofu-salad");
  assert.deepStrictEqual(f, ["tofu-salad", "egg-soup"]);
  const p = M.pinFavs(M.filter(R, "egg"), f);
  assert.deepStrictEqual(p.favs.map((r) => r.id), ["egg-soup"]); // tofu-salad has no egg, so the egg filter leaves it out
  assert(!p.rest.some((r) => r.id === "egg-soup"));
  assert.strictEqual(p.favs.length + p.rest.length, M.filter(R, "egg").length);
  assert.deepStrictEqual(M.toggle(f, "egg-soup"), ["tofu-salad"]);
});
test("오늘의 추천: 3개가 서로 다른 종류, 다시 뽑으면 다른 메뉴", () => {
  for (let s = 1; s <= 200; s++) {
    const a = M.suggest(R, 3, seeded(s));
    assert.strictEqual(new Set(a.map((r) => r.id)).size, 3);
    assert.strictEqual(new Set(a.map((r) => r.kind)).size, 3, "종류 겹침 seed " + s);
    assert.strictEqual(new Set(a.map((r) => r.tags[0])).size, 3, "대표 재료 겹침 seed " + s);
    const b = M.suggest(R, 3, seeded(s + 1000), a.map((r) => r.id));
    b.forEach((r) => assert(!a.includes(r)));
  }
  assert.strictEqual(M.suggest(R.slice(0, 2), 3, seeded(1)).length, 2);
});
test("재료 나누기: 있음 / 살 것 / 없어도 됨 / 양념", () => {
  const s = M.split(rec("tofu-mushroom-hotpot"), ["tofu", "napa"], P);
  assert.deepStrictEqual(s.have.map((g) => g.name), ["두부", "배추"]);
  assert.deepStrictEqual(s.need.map((g) => g.name), ["버섯"]);
  assert.deepStrictEqual(s.opt.map((g) => g.name), ["대파"]);
  assert(s.season.some((g) => g.name === "국간장"));
  assert.strictEqual(s.have.length + s.need.length + s.opt.length + s.season.length, rec("tofu-mushroom-hotpot").ingredients.length);
  assert.strictEqual(M.itemOf("방울토마토", P), "tomato");
  assert.strictEqual(M.itemOf("간장", P), null);
});
test("우리 집 재료로: 살 것이 1개 이하인 메뉴만, 적은 순서로", () => {
  assert.deepStrictEqual(M.cookable(R, [], P, 4), []);
  const list = M.cookable(R, ["egg", "cabbage"], P, 50);
  assert(list.length >= 3);
  list.forEach((x) => assert(x.s.have.length >= 1 && x.s.need.length <= 1));
  for (let i = 1; i < list.length; i++) assert(list[i - 1].s.need.length <= list[i].s.need.length);
  assert.strictEqual(list[0].s.need.length, 0);
  assert(list.some((x) => x.r.id === "cabbage-egg-stirfry" && x.s.need.length === 0));
  assert.strictEqual(M.cookable(R, ["egg", "cabbage"], P, 2).length, 2);
});
test("후보: 3개까지, 겹쳐 담기지 않음, 대신 고르기는 살 것이 적고 빠른 것", () => {
  let c = [];
  ["egg-soup", "tofu-salad", "egg-soup", "cabbage-jeon"].forEach((id) => { c = M.addCand(c, id).cands; });
  assert.deepStrictEqual(c, ["egg-soup", "tofu-salad", "cabbage-jeon"]);
  const full = M.addCand(c, "tofu-kimchi");
  assert(!full.ok && full.cands.length === 3);
  const three = ["beef-mushroom-shabu", "egg-soup", "egg-veggie-roll"].map(rec);
  assert.strictEqual(M.pick(three, ["egg", "carrot"], P).id, "egg-soup"); // both egg dishes need nothing; the soup is quicker
  assert.strictEqual(M.pick(three, ["beef", "mushroom", "napa"], P).id, "beef-mushroom-shabu");
  assert.strictEqual(M.pick([], [], P), null);
});
test("저장: 되돌려 읽기, 없어진 요리·이상한 값은 버림", () => {
  const mem = { v: {}, getItem(k) { return k in this.v ? this.v[k] : null; }, setItem(k, x) { this.v[k] = String(x); } };
  assert.deepStrictEqual(M.load(mem, D), M.fresh());
  M.save(mem, { favs: ["egg-soup"], have: ["egg"], cands: ["tofu-salad"] });
  assert.deepStrictEqual(M.load(mem, D), { favs: ["egg-soup"], have: ["egg"], cands: ["tofu-salad"] });
  mem.v[M.KEY] = JSON.stringify({ favs: ["gone", "egg-soup", "egg-soup"], have: "x", cands: R.slice(0, 5).map((r) => r.id) });
  assert.deepStrictEqual(M.load(mem, D), { favs: ["egg-soup"], have: [], cands: R.slice(0, 3).map((r) => r.id) });
  mem.v[M.KEY] = "{broken";
  assert.deepStrictEqual(M.load(mem, D), M.fresh());
});
test("끼니 이름", () => {
  assert.deepStrictEqual([7, 12, 19].map(M.meal), ["아침", "점심", "저녁"]);
});
console.log("\n" + n + "개 시험 통과 · 요리 " + R.length + "개");
