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
const rec = (id) => R.find((r) => r.id === id);

test("모든 요리에 이름·재료·순서·시간·칼로리·그림·칸이 있다", () => {
  const errs = M.validate(D, ART.check);
  assert.deepStrictEqual(errs, [], errs.join("\n"));
});
test("검사기가 빠진 내용을 잡아낸다", () => {
  const bad = { id: "Bad Id", name: "", tags: ["nope"], kind: "x", meals: ["brunch"], time: 90, ingredients: [{ name: "두부" }], steps: [""], art: { dish: "cup" } };
  const errs = M.validate(Object.assign({}, D, { RECIPES: [bad, R[0], R[0], Object.assign({}, R[1], { meals: [] })] }), ART.check);
  ["id 는", "이름 없음", "모르는 주재료", "모르는 종류", "모르는 칸", "meals 없음", "조리 시간", "칼로리", "단백질", "재료가 2개 미만", "순서가 2개 미만", "모르는 그릇", "id 겹침"]
    .forEach((w) => assert(errs.some((e) => e.includes(w)), "못 잡음: " + w));
});
test("홈 화면 다섯 칸: 아침·점심·저녁·건강식·캠핑요리, 칸마다 메뉴 10개 이상", () => {
  assert.deepStrictEqual(D.MEALS.map((m) => m.name), ["아침", "점심", "저녁", "건강식", "캠핑요리"]);
  D.MEALS.forEach((m) => {
    const list = M.list(R, m.id);
    assert(list.length >= 10, m.name + " " + list.length);
    list.forEach((r) => assert(r.meals.includes(m.id)));
    assert(m.desc && ART.icons.includes(m.id), "설명이나 아이콘 없음: " + m.name);
  });
  assert.strictEqual(M.list(R, "brunch").length, 0);
  // dishes written for a box (it is their first meal) lead that box's list
  const camp = M.list(R, "camping"), own = camp.filter((r) => r.meals[0] === "camping").length;
  assert(own >= 6 && camp.slice(0, own).every((r) => r.meals[0] === "camping"));
});
test("양배추·두부·계란은 대표 메뉴가 8개 이상", () => {
  ["cabbage", "tofu", "egg"].forEach((t) => assert(R.filter((r) => r.tags[0] === t).length >= 8, t));
});
test("모든 그림이 그려진다", () => {
  R.forEach((r) => assert(ART.dish(r.art).length > 300, r.id));
});
test("우리 집 재료는 모두 어떤 요리에 쓰이고, 요리마다 따질 재료가 있다", () => {
  const used = new Set();
  R.forEach((r) => r.ingredients.forEach((g) => { const it = M.itemOf(g.name, P); if (it) used.add(it); }));
  P.forEach((p) => assert(used.has(p.id), "안 쓰이는 재료: " + p.name));
  R.forEach((r) => assert(r.ingredients.some((g) => M.itemOf(g.name, P) && !g.opt), "따질 재료가 없음: " + r.name));
});

test("칸 안에서 재료로 좁히기: 그 칸의 그 재료만, 대표 재료가 먼저", () => {
  const eggs = M.list(R, "breakfast", "egg");
  assert(eggs.length >= 5);
  eggs.forEach((r) => assert(r.meals.includes("breakfast") && r.tags.includes("egg")));
  const firstOther = eggs.findIndex((r) => r.tags[0] !== "egg");
  assert(firstOther > 0 && eggs.slice(firstOther).every((r) => r.tags[0] !== "egg"));
  assert.strictEqual(M.list(R, "breakfast", "all").length, M.list(R, "breakfast").length);
});
test("재료 버튼은 그 칸에 실제로 있는 재료만", () => {
  D.MEALS.forEach((m) => {
    const all = M.list(R, m.id), tags = M.tagsIn(all, D.INGREDIENTS);
    assert(tags.length >= 2, m.name);
    tags.forEach((t) => assert(M.list(R, m.id, t.id).length >= 1, m.name + " " + t.name));
    D.INGREDIENTS.filter((t) => !tags.includes(t)).forEach((t) => assert.strictEqual(M.list(R, m.id, t.id).length, 0));
  });
  assert(!M.tagsIn(M.list(R, "breakfast"), D.INGREDIENTS).some((t) => t.id === "seafood")); // no seafood breakfasts yet
  assert(M.tagsIn(M.list(R, "camping"), D.INGREDIENTS).some((t) => t.id === "seafood"));
});
test("찜: 켜고 끄기, 찜한 것이 위로", () => {
  let f = M.toggle([], "egg-soup"); f = M.toggle(f, "gambas");
  assert.deepStrictEqual(f, ["gambas", "egg-soup"]);
  const list = M.list(R, "breakfast"), p = M.pinFavs(list, f);
  assert.deepStrictEqual(p.favs.map((r) => r.id), ["egg-soup"]); // gambas is not a breakfast, so it stays out of this box
  assert(!p.rest.some((r) => r.id === "egg-soup"));
  assert.strictEqual(p.favs.length + p.rest.length, list.length);
  assert.deepStrictEqual(M.toggle(f, "egg-soup"), ["gambas"]);
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
test("지금 재료로 되는 메뉴: 살 것이 1개 이하인 것만, 적은 순서로", () => {
  assert.deepStrictEqual(M.cookable(R, [], P, 4), []);
  const list = M.cookable(R, ["egg", "cabbage"], P, 50);
  assert(list.length >= 3);
  list.forEach((x) => assert(x.s.have.length >= 1 && x.s.need.length <= 1));
  for (let i = 1; i < list.length; i++) assert(list[i - 1].s.need.length <= list[i].s.need.length);
  assert(list.some((x) => x.r.id === "cabbage-egg-stirfry" && x.s.need.length === 0));
  assert.strictEqual(M.cookable(R, ["egg", "cabbage"], P, 2).length, 2);
});
test("저장: 되돌려 읽기, 없어진 요리·이상한 값은 버림", () => {
  const mem = { v: {}, getItem(k) { return k in this.v ? this.v[k] : null; }, setItem(k, x) { this.v[k] = String(x); } };
  assert.deepStrictEqual(M.load(mem, D), M.fresh());
  M.save(mem, { favs: ["egg-soup"], have: ["egg"] });
  assert.deepStrictEqual(M.load(mem, D), { favs: ["egg-soup"], have: ["egg"] });
  mem.v[M.KEY] = JSON.stringify({ favs: ["gone", "egg-soup", "egg-soup"], have: "x", cands: ["egg-soup"] });
  assert.deepStrictEqual(M.load(mem, D), { favs: ["egg-soup"], have: [] }); // "cands" is from the first version and is dropped
  mem.v[M.KEY] = "{broken";
  assert.deepStrictEqual(M.load(mem, D), M.fresh());
});
test("지금 끼니", () => {
  assert.deepStrictEqual([7, 12, 19].map(M.mealNow), ["breakfast", "lunch", "dinner"]);
});
console.log("\n" + n + "개 시험 통과 · 요리 " + R.length + "개");
