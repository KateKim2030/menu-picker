// Rules of the menu app, kept apart from the screen so node can test them (tools/test.js).
(function (root) {
  "use strict";
  const KEY = "menu-app-v1";

  // ---------- data check ----------
  function validate(data, artCheck) {
    const errs = [], seen = {};
    const tagIds = data.INGREDIENTS.map((x) => x.id), kindIds = data.KINDS.map((x) => x.id), mealIds = data.MEALS.map((x) => x.id);
    const dup = (list, what) => list.forEach((x, i) => { if (list.indexOf(x) !== i) errs.push(what + " 겹침: " + x); });
    dup(tagIds, "주재료 id"); dup(kindIds, "종류 id"); dup(data.PANTRY.map((p) => p.id), "우리 집 재료 id");
    dup([].concat.apply([], data.PANTRY.map((p) => p.names)), "우리 집 재료 이름");
    data.RECIPES.forEach((r, i) => {
      const at = (r && (r.name || r.id)) || "요리 #" + (i + 1), bad = (m) => errs.push(at + ": " + m);
      if (!r.id || !/^[a-z0-9-]+$/.test(r.id)) bad("id 는 영어 소문자·숫자·줄표");
      else if (seen[r.id]) bad("id 겹침 " + r.id);
      seen[r.id] = true;
      if (!r.name || !String(r.name).trim()) bad("이름 없음");
      if (!Array.isArray(r.tags) || !r.tags.length) bad("tags 없음");
      else r.tags.forEach((t) => { if (tagIds.indexOf(t) < 0) bad("모르는 주재료 " + t); });
      if (kindIds.indexOf(r.kind) < 0) bad("모르는 종류 " + r.kind);
      if (!Array.isArray(r.meals) || !r.meals.length) bad("meals 없음 (홈 화면 어느 칸에도 안 나옴)");
      else r.meals.forEach((m) => { if (mealIds.indexOf(m) < 0) bad("모르는 칸 " + m); });
      if (!(r.time >= 1 && r.time <= 90)) bad("조리 시간은 1~90분");
      if (!(r.kcal > 0)) bad("칼로리 없음");
      if (!(r.protein > 0)) bad("단백질 없음");
      if (!Array.isArray(r.ingredients) || r.ingredients.length < 2) bad("재료가 2개 미만");
      else r.ingredients.forEach((g) => { if (!g || !g.name || !g.amount) bad("재료 이름이나 양이 빠짐"); });
      if (!Array.isArray(r.steps) || r.steps.length < 2) bad("순서가 2개 미만");
      else r.steps.forEach((s) => { if (typeof s !== "string" || !s.trim()) bad("빈 순서"); });
      if (r.delivery != null && !String(r.delivery).trim()) bad("빈 배달 검색어");
      if (artCheck) artCheck(r.art).forEach(bad);
    });
    return errs;
  }

  // ---------- browsing ----------
  // Dishes of one home-screen box, optionally narrowed to a main ingredient (dishes led by that ingredient come first).
  function list(recipes, meal, tag) {
    const hit = recipes.filter((r) => r.meals.indexOf(meal) >= 0 && (!tag || tag === "all" || r.tags.indexOf(tag) >= 0));
    const out = hit.filter((r) => r.meals[0] === meal).concat(hit.filter((r) => r.meals[0] !== meal)); // dishes made for this box first
    if (!tag || tag === "all") return out;
    return out.filter((r) => r.tags[0] === tag).concat(out.filter((r) => r.tags[0] !== tag));
  }
  // Main ingredients that actually occur in a list, in the order of INGREDIENTS — the filter chips worth showing.
  const tagsIn = (recipes, ingredients) => ingredients.filter((t) => recipes.some((r) => r.tags.indexOf(t.id) >= 0));
  function pinFavs(recipes, favs) {
    return { favs: favs.map((id) => recipes.find((r) => r.id === id)).filter(Boolean), rest: recipes.filter((r) => favs.indexOf(r.id) < 0) };
  }
  const toggle = (list, id) => (list.indexOf(id) >= 0 ? list.filter((x) => x !== id) : [id].concat(list));

  // ---------- what's at home ----------
  function itemOf(name, pantry) {
    const p = pantry.find((x) => x.names.indexOf(name) >= 0);
    return p ? p.id : null;
  }
  // have: at home / need: must buy / opt: missing but fine without / season: seasoning and basics, not tracked
  function split(recipe, have, pantry) {
    const out = { have: [], need: [], opt: [], season: [] };
    recipe.ingredients.forEach((g) => {
      const item = itemOf(g.name, pantry);
      if (!item) out.season.push(g);
      else if (have.indexOf(item) >= 0) out.have.push(g);
      else if (g.opt) out.opt.push(g);
      else out.need.push(g);
    });
    return out;
  }
  // Dishes that use something at home and lack at most one thing; fewest missing first.
  function cookable(recipes, have, pantry, max) {
    return recipes.map((r) => ({ r: r, s: split(r, have, pantry) }))
      .filter((x) => x.s.have.length >= 1 && x.s.need.length <= 1)
      .sort((a, b) => a.s.need.length - b.s.need.length || b.s.have.length - a.s.have.length || a.r.time - b.r.time)
      .slice(0, max || 4);
  }

  // ---------- saved state ----------
  const fresh = () => ({ favs: [], have: [] });
  function clean(raw, data) {
    const s = fresh(), ids = data.RECIPES.map((r) => r.id), items = data.PANTRY.map((p) => p.id);
    const uniq = (v, ok) => (Array.isArray(v) ? v.filter((x, i) => ok.indexOf(x) >= 0 && v.indexOf(x) === i) : []);
    if (raw && typeof raw === "object") {
      s.favs = uniq(raw.favs, ids); s.have = uniq(raw.have, items);
    }
    return s;
  }
  function load(storage, data) { try { return clean(JSON.parse(storage.getItem(KEY)), data); } catch (e) { return fresh(); } }
  function save(storage, s) { try { storage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  const mealNow = (hour) => (hour < 10 ? "breakfast" : hour < 15 ? "lunch" : "dinner");

  const API = { KEY: KEY, validate: validate, list: list, tagsIn: tagsIn, pinFavs: pinFavs, toggle: toggle,
    itemOf: itemOf, split: split, cookable: cookable, fresh: fresh, clean: clean, load: load, save: save, mealNow: mealNow };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.MENU = API;
})(typeof self !== "undefined" ? self : this);
