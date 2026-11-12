// Food drawings — flat fills with royal-blue outlines, built from a few parts so every dish gets its own picture
// without a photo: a vessel (pan / plate / bowl), small pieces scattered on it (T), and optional big centre pieces (BIG).
(function (root) {
  "use strict";
  const K = { ink: "#162660", soft: "#4b5785", paper: "#fbf6ee", sky: "#D0E6FD", line: "#dccab0", gold: "#f3c766", goldD: "#c99c3c",
    coral: "#ef8a62", green: "#a9d18e", greenL: "#d3e8c0", greenD: "#7fb86a", toast: "#f3d08a" };
  const ST = ' stroke="' + K.ink + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"';
  const ROT = [-18, 22, 8, -40, 35, -8, 50, -28, 14, -55, 30];
  const g = (x, y, rot, inner, sc) => '<g transform="translate(' + x + " " + y + ") rotate(" + rot + ")" + (sc ? " scale(" + sc + ")" : "") + '">' + inner + "</g>";
  const tube = (d, color, w) => '<path d="' + d + '" fill="none" stroke="' + K.ink + '" stroke-width="' + (w + 4) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  const line = (d, color, w) => '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round"/>';
  const dot = (x, y, r, c) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '"/>';
  const BLOB = "M-8 0q0-7 7-6q8-1 8 5q0 7-8 6q-7 1-7-5z";
  const LEAF = "M-11 0q2-10 11-9q10 1 10 9q-3 9-11 8q-9 0-10-8z";
  const blob = (c) => '<path d="' + BLOB + '" fill="' + c + '"' + ST + "/>";
  const box = (c) => '<rect x="-7" y="-7" width="14" height="14" rx="3" fill="' + c + '"' + ST + "/>";

  // small pieces, drawn around (0,0); i lets a piece alternate its look
  const T = {
    cabbage: (i) => tube("M-10 2q5-9 10-2t10-2", i % 2 ? K.greenL : K.green, 5),
    napa: () => '<path d="' + LEAF + '" fill="#eef4dc"' + ST + "/>" + line("M-6 2q6-4 12-2", K.greenD, 2),
    greens: () => '<path d="' + LEAF + '" fill="' + K.green + '"' + ST + "/>" + line("M-6 2q6-4 12-2", K.greenD, 2),
    tofu: () => box(K.paper),
    tofuGold: () => box(K.toast),
    crumb: () => blob(K.paper),
    scramble: () => blob(K.gold),
    tuna: () => blob("#eec3a4"),
    tomato: () => '<circle r="6.5" fill="' + K.coral + '"' + ST + "/>" + line("M-3-2q2-2 4-1", K.paper, 1.8),
    scallion: () => '<circle r="3.6" fill="none" stroke="' + K.greenD + '" stroke-width="3"/>',
    chicken: () => '<rect x="-10" y="-5" width="20" height="10" rx="5" fill="#f6dcc0"' + ST + "/>",
    kimchi: () => tube("M-9-2q4 7 9 1t9 1", "#e0694a", 6),
    beef: () => tube("M-10 0q5-6 10 0t10 0", "#d98f7d", 6),
    pork: () => tube("M-10 0q5-6 10 0t10 0", "#f4c3b3", 6),
    sprouts: () => tube("M-10 3q6-9 12-3q4 3 7-1", K.paper, 2.5) + '<circle cx="9" cy="1" r="3" fill="' + K.gold + '"' + ST + "/>",
    mushroom: () => '<rect x="-3" y="-1" width="6" height="9" rx="2.5" fill="' + K.paper + '"' + ST + "/>" + '<path d="M-9 0a9 8 0 0 1 18 0z" fill="#cdb48f"' + ST + "/>",
    carrot: () => '<rect x="-9" y="-2.5" width="18" height="5" rx="2.5" fill="#f0a04b"' + ST + "/>",
    zucchini: () => '<path d="M-9 4a9 9 0 0 1 18 0z" fill="#e6f0c6"' + ST + "/>" + line("M-5 1a5 5 0 0 1 10 0", K.greenD, 2),
    cucumber: () => '<circle r="6.5" fill="#e6f0c6"' + ST + "/>" + '<circle r="3" fill="none" stroke="' + K.greenD + '" stroke-width="1.8"/>',
    seaweed: () => line("M-5 0h10", K.ink, 3.5),
    shrimp: () => tube("M-7 5a8 8 0 1 1 9-9", K.coral, 5),
    garlic: () => '<ellipse rx="6" ry="4.5" fill="#fbf1d4"' + ST + "/>",
    sausage: () => '<rect x="-10" y="-4.5" width="20" height="9" rx="4.5" fill="#d9775f"' + ST + "/>" + line("M-3-3l-2 6M3-3l-2 6", "#a8553f", 1.6),
    pepper: (i) => tube("M-8 3q8-9 16 0", i % 2 ? K.gold : "#e0694a", 5),
    fishcake: () => tube("M-11 0q4-7 7 0t7 0t7 0", "#e9c48e", 6),
    noodle: () => tube("M-12 0q4-7 8 0t8 0t8 0", "#f6e3b0", 3.5),
    tteok: () => '<rect x="-10" y="-4.5" width="20" height="9" rx="4.5" fill="#fffdf6"' + ST + "/>",
    potato: () => blob("#f0d98c"),
    fried: () => blob("#dfa24f") + dot(-2, -1, 1.3, "#b9813c") + dot(3, 2, 1.3, "#b9813c"),
    belly: () => '<rect x="-11" y="-5.5" width="22" height="11" rx="3" fill="#f4c3b3"' + ST + "/>" + line("M-8-1.5h16", K.paper, 2) + line("M-8 2h16", "#d98f7d", 2),
    dumpling: () => '<path d="M-10 4a10 10 0 0 1 20 0z" fill="#fbf1d4"' + ST + "/>" + line("M-5-1q5-4 10 0", "#d9b06f", 1.8),
    miyeok: () => tube("M-10 2q5-8 10-2t10-2", "#4f7d5c", 5),
    salmon: () => box("#f4a27c") + line("M-4-2q4 3 8 0", K.paper, 1.8),
  };

  const egg = (yolkX, yolkY) => '<path d="M-20 0q-2-15 12-15q8-6 16 2q12 4 8 16q-2 12-16 11q-18 4-20-14z" fill="' + K.paper + '"' + ST + "/>" +
    '<circle cx="' + yolkX + '" cy="' + yolkY + '" r="8" fill="' + K.gold + '"' + ST + "/>" + line("M" + (yolkX - 4) + " " + (yolkY - 2) + "q2-3 5-2", K.paper, 2);
  const flecks = (pts) => pts.map((p, i) => dot(p[0], p[1], 1.8, i % 2 ? K.greenD : K.coral)).join("");

  // big centre pieces, drawn around (0,0)
  const BIG = {
    friedegg: () => egg(1, 0),
    halfegg: () => [[-21, -12, -20], [17, -15, 25], [-9, 15, 10], [24, 12, -30]].map((p) =>
      g(p[0], p[1], p[2], '<ellipse rx="9.5" ry="12.5" fill="' + K.paper + '"' + ST + '/><circle cy="1.5" r="5.5" fill="' + K.gold + '" stroke="' + K.goldD + '" stroke-width="1.5"/>')).join(""),
    jeon: (s) => '<circle r="34" fill="' + ((s && s.color) || K.toast) + '"' + ST + "/>" + '<ellipse cx="-12" cy="-10" rx="9" ry="6" fill="#e6bd6c"/><ellipse cx="13" cy="9" rx="10" ry="6" fill="#e6bd6c"/><ellipse cx="-8" cy="17" rx="6" ry="4" fill="#e6bd6c"/>' +
      [[-18, 4], [2, -18], [18, -8], [4, 2], [-4, 24], [22, 20], [-24, -18]].map((p, i) => g(p[0], p[1], ROT[i], line("M-5 0q3-4 5 0t5 0", K.greenD, 3))).join(""),
    roll: () => [-33, -11, 11, 33].map((x, i) => g(x, i % 2 ? 2 : -2, i % 2 ? 5 : -5,
      '<rect x="-10" y="-15" width="20" height="30" rx="8" fill="' + K.gold + '"' + ST + "/>" + line("M0-8a6 7 0 1 1-5 9", K.goldD, 2) + flecks([[4, 5], [-3, -3], [-4, 9]]))).join(""),
    toast: () => g(0, 0, -8,
      '<rect x="-20" y="-16" width="52" height="48" rx="9" fill="#f6dcae"' + ST + "/>" +
      tube("M-22 27q6 7 12 0t12 0t12 0t12 0", K.green, 5) +
      '<rect x="-25" y="-21" width="54" height="46" rx="8" fill="' + K.gold + '"' + ST + "/>" +
      '<rect x="-28" y="-26" width="52" height="48" rx="9" fill="#f6dcae"' + ST + "/>" +
      '<rect x="-22" y="-20" width="40" height="36" rx="5" fill="#fbecca" stroke="#d9b06f" stroke-width="2"/>'),
    slab: () => [-26, 0, 26].map((x, i) => g(x, 0, [-6, 3, -3][i],
      '<rect x="-11" y="-17" width="22" height="34" rx="5" fill="' + K.paper + '"' + ST + "/>" + '<rect x="-7" y="-13" width="14" height="26" rx="3" fill="' + K.toast + '"/>' +
      flecks([[-2, -5], [1, -9], [3, 3], [-3, 7]]))).join(""),
    patty: () => [[-25, -10], [2, -21], [27, -6], [-11, 14], [15, 17]].map((p, i) => g(p[0], p[1], ROT[i],
      '<circle r="12" fill="' + K.toast + '"' + ST + "/>" + flecks([[-4, -3], [3, -5], [4, 4], [-3, 5]]))).join(""),
    wrap: () => [[-20, -12, -20], [-14, 12, 15], [2, -4, 40]].map((p) => g(p[0], p[1], p[2], T.greens(), 2)).join("") +
      '<circle cx="27" cy="13" r="13" fill="' + K.sky + '"' + ST + '/><circle cx="27" cy="13" r="8" fill="#c98d5a" stroke="' + K.ink + '" stroke-width="2"/>',
    chop: () => '<path d="M-34 2q-2-22 22-24q30-2 32 20q2 22-28 22q-24 0-26-18z" fill="#dba48c"' + ST + "/>" +
      line("M-22-10l14 22M-8-16l16 26M8-17l14 22", "#a8674f", 3) + '<path d="M18-14q10 4 10 14" fill="none" stroke="' + K.paper + '" stroke-width="4" stroke-linecap="round"/>',
    fish: () => g(0, 0, -12, '<path d="M-40 0Q-20-20 14-16Q34-12 40 0Q34 12 14 16Q-20 20-40 0Z" fill="#8fa3c4"' + ST + "/>" +
      '<path d="M-36 2Q-16 14 14 12Q32 9 38 1Q20 6-36 2Z" fill="#e9edf3"/>' + line("M-20-12l6 10M-6-15l6 11M8-15l6 11M22-12l5 9", K.ink, 2.2) + line("M-30 2l-8 9M-28-4l-9-8", "#b08a4a", 2.5)),
    ftoast: () => [[-17, -6, -14], [17, 8, 12]].map((p) => g(p[0], p[1], p[2], '<path d="M-22 16L-22-12Q-22-18-16-18L22-18Z" fill="' + K.gold + '"' + ST + "/>" +
      '<path d="M-17 4L-17-10Q-17-13-14-13L8-13Z" fill="#e6a94e"/>')).join("") + dot(-2, -18, 2, K.paper) + dot(8, 22, 2, K.paper) + dot(-26, 18, 2, K.paper),
    nest: (s) => '<circle r="31" fill="' + ((s && s.color) || "#f6e3b0") + '"' + ST + "/>" +
      ["M-22-6q10-16 26-8t16 14", "M-20 8q8-12 20-6t18 10", "M-14 20q12-10 24-4", "M-8-20q10-6 20 2", "M-24 2q4 10 12 14"].map((d) => line(d, "rgba(22,38,96,.3)", 2.2)).join(""),
    cutlet: () => g(0, 0, -10, '<rect x="-36" y="-21" width="72" height="42" rx="17" fill="#d9a25a"' + ST + "/>" +
      [[-26, -8], [-8, 10], [6, -10], [24, 8], [-18, 12], [20, -10], [-2, -2]].map((p) => dot(p[0], p[1], 1.8, "#b9813c")).join("") +
      line("M-17-20l3 40M-1-20l3 40M15-20l3 40", K.ink, 2)),
    beefsteak: () => '<path d="M-34 2q-2-22 22-24q30-2 32 20q2 22-28 22q-24 0-26-18z" fill="#9a5f4a"' + ST + "/>" +
      line("M-22-10l14 22M-8-16l16 26M8-17l14 22", "#6b3d2e", 3) + '<rect x="-6" y="-8" width="13" height="11" rx="2.5" fill="' + K.gold + '"' + ST + "/>",
    omurice: () => '<ellipse rx="38" ry="23" fill="' + K.gold + '"' + ST + "/>" + line("M-22-9q10-8 22-7", K.paper, 3) + line("M-18 3q4-8 8 0t8 0t8 0t8 0", "#e0694a", 4.5),
    gimbap: () => [[-24, -12], [6, -18], [28, 6], [-6, 12]].map((p, i) => g(p[0], p[1], ROT[i],
      '<circle r="14" fill="' + K.ink + '"/><circle r="10.5" fill="' + K.paper + '"/>' + dot(-3, -3, 3, K.gold) + dot(3, -2, 2.6, "#f0a04b") + dot(-2, 3, 2.6, K.greenD) + dot(3, 3, 2.4, K.coral))).join(""),
    skewer: () => [-20, 0, 20].map((y, i) => g(i % 2 ? 4 : -4, y, -6, line("M-42 0h84", "#b08a4a", 3) +
      [-22, -6, 10, 26].map((x, j) => '<rect x="' + (x - 7) + '" y="-6" width="14" height="12" rx="3.5" fill="' + (j % 2 ? K.green : "#d9a25a") + '"' + ST + "/>").join(""))).join(""),
    steak: () => '<path d="M-36 16Q-34-26 2-26Q36-24 36 16Z" fill="' + K.green + '"' + ST + "/>" +
      line("M-24 14Q-22-14 2-15Q24-14 25 14", K.greenD, 2.5) + line("M-12 14Q-10-4 2-5Q12-4 13 14", K.greenD, 2.5) +
      line("M-28-4l8-8", "#b08a4a", 3) + line("M20-12l8 8", "#b08a4a", 3) + g(4, 8, 0, egg(1, 0), 0.72),
  };

  const ring = (r, n, off) => Array.from({ length: n }, (_, i) => { const a = (off + i * 360 / n) * Math.PI / 180; return [Math.round(r * Math.cos(a)), Math.round(r * Math.sin(a))]; });
  const TOP = ring(27, 7, 10).concat(ring(13, 3, 30), [[0, 0]]); // outer pieces first, so the middle sits on top of the pile
  const scatter = (cx, cy, slots, kinds, sc) => (kinds && kinds.length ? slots.map((p, i) => g(cx + p[0], cy + p[1], ROT[i % ROT.length], T[kinds[i % kinds.length]](i), sc)).join("") : "");

  const OVER = [[-12, -8], [12, -5], [0, 10], [-14, 9], [14, 11]]; // "top" pieces sit on the big piece
  function top(spec, cx, cy) {
    return scatter(cx, cy, TOP, spec.on) + (spec.big ? g(cx, cy, 0, BIG[spec.big](spec)) : "") + scatter(cx, cy, OVER, spec.top);
  }
  const DISH = {
    plate: (s) => '<circle cx="80" cy="60" r="52" fill="' + K.paper + '" stroke="' + K.ink + '" stroke-width="3"/><circle cx="80" cy="60" r="40" fill="none" stroke="' + K.line + '" stroke-width="2"/>' + top(s, 80, 60),
    pan: (s) => '<rect x="104" y="52" width="54" height="16" rx="8" fill="' + K.ink + '"/>' +
      '<circle cx="64" cy="60" r="50" fill="' + K.soft + '" stroke="' + K.ink + '" stroke-width="3"/><circle cx="64" cy="60" r="42" fill="#2b3a78"/>' + top(s, 64, 60),
    bowl: (s) => {
      const B = BASES[s.base], h = B.h, id = "ab" + (uid++);
      const body = s.pot
        ? '<rect x="6" y="56" width="22" height="11" rx="5.5" fill="' + K.ink + '"/><rect x="132" y="56" width="22" height="11" rx="5.5" fill="' + K.ink + '"/>' +
          '<path d="M22 48L28 96Q30 108 44 108H116Q130 108 132 96L138 48Z" fill="' + K.soft + '" stroke="' + K.ink + '" stroke-width="3" stroke-linejoin="round"/>'
        : '<path d="M22 48Q26 108 80 108Q134 108 138 48Z" fill="' + K.sky + '" stroke="' + K.ink + '" stroke-width="3" stroke-linejoin="round"/>' +
          line("M38 70Q44 92 62 98", K.paper, 3);
      let out = body + '<ellipse cx="80" cy="48" rx="58" ry="15" fill="' + (h ? K.paper : (s.color || B.color)) + '" stroke="' + K.ink + '" stroke-width="3"/>';
      if (h) {
        out += '<path d="M27 48Q80 ' + (48 - 2 * h) + " 133 48Q80 62 27 48Z" + '" fill="' + (s.color || B.color) + '"' + ST + "/>";
        const cy = 48 - Math.round(h * 0.55);
        const slots = [[-36, 9], [36, 8], [-22, 2], [22, 0], [-9, 9], [13, 10], [0, -6]].slice(h < 25 ? 2 : 0);
        out += s.big ? scatter(80, cy, [[-34, 8], [34, 6], [-22, -2], [24, -4]], s.on) + g(80, cy - 2, 0, BIG[s.big](s), 0.85) : scatter(80, cy, slots, s.on, 0.9);
      } else {
        out += '<clipPath id="' + id + '"><ellipse cx="80" cy="48" rx="55" ry="12.5"/></clipPath><g clip-path="url(#' + id + ')">' +
          scatter(80, 48, [[-34, -1], [-15, -5], [4, -1], [23, -5], [38, 1], [-23, 6], [-3, 7], [17, 6]], s.on, 0.8) + "</g>";
      }
      if (s.steam) { const y = h ? 48 - h - 9 : 27; out += [62, 80, 98].map((x, i) => line("M" + x + " " + (y - (i % 2) * 3) + "q-5-5 0-9t0-9", "#8a91ab", 3)).join(""); }
      return out;
    },
  };
  const BASES = { rice: { h: 34, color: K.paper }, salad: { h: 28, color: "#dcebc6" }, custard: { h: 17, color: "#f6d77e" }, porridge: { h: 0, color: "#f4ead2" }, broth: { h: 0, color: "#f3e8c6" } };
  let uid = 0;

  function check(spec) {
    const e = [];
    if (!spec || !DISH[spec.dish]) return ["그림: 모르는 그릇 " + (spec && spec.dish)];
    if (spec.dish === "bowl" && !BASES[spec.base]) e.push("그림: bowl 은 base 가 필요 (" + Object.keys(BASES).join("/") + ")");
    if (spec.big && !BIG[spec.big]) e.push("그림: 모르는 big " + spec.big);
    (spec.on || []).forEach((k) => { if (!T[k]) e.push("그림: 모르는 재료 그림 " + k); });
    (spec.top || []).forEach((k) => { if (!T[k]) e.push("그림: 모르는 재료 그림 " + k); });
    if (!spec.big && !(spec.on && spec.on.length)) e.push("그림: on 이나 big 중 하나는 있어야 함");
    return e;
  }
  const svg = (w, h, inner, cls) => '<svg class="' + (cls || "art") + '" viewBox="0 0 ' + w + " " + h + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + "</svg>";
  const dish = (spec) => svg(160, 120, check(spec).length ? DISH.plate({}) : DISH[spec.dish](spec));

  // icons for the five boxes on the home screen (64 x 64)
  const sun = (cx, cy, r) => [0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const t = a * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
    return line("M" + (cx + c * (r + 5)).toFixed(1) + " " + (cy + s * (r + 5)).toFixed(1) + "L" + (cx + c * (r + 11)).toFixed(1) + " " + (cy + s * (r + 11)).toFixed(1), K.ink, 3); }).join("") +
    '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + K.gold + '" stroke="' + K.ink + '" stroke-width="3"/>';
  const ICON = {
    breakfast: '<clipPath id="icb"><rect x="0" y="0" width="64" height="44"/></clipPath><g clip-path="url(#icb)">' + sun(32, 44, 14) + "</g>" +
      line("M6 45h52", K.ink, 3) + line("M18 54h28", K.ink, 3),
    lunch: sun(32, 32, 13),
    dinner: '<path d="M44 40a19 19 0 1 1-19-27a15 15 0 0 0 19 27z" fill="' + K.sky + '" stroke="' + K.ink + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M46 12l2 5l5 2l-5 2l-2 5l-2-5l-5-2l5-2z" fill="' + K.gold + '" stroke="' + K.ink + '" stroke-width="2" stroke-linejoin="round"/>',
    healthy: '<path d="M32 56Q8 44 12 16Q36 12 44 30Q50 44 32 56Z" fill="' + K.green + '" stroke="' + K.ink + '" stroke-width="3" stroke-linejoin="round"/>' +
      line("M17 21Q30 32 32 54", K.greenD, 2.5) + line("M24 30l8-3M27 40l9-4", K.greenD, 2.5) +
      '<path d="M40 22Q48 8 58 12Q58 24 46 28Z" fill="' + K.greenL + '" stroke="' + K.ink + '" stroke-width="3" stroke-linejoin="round"/>',
    camping: '<path d="M6 50L30 12L54 50Z" fill="' + K.coral + '" stroke="' + K.ink + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M30 50L30 30L42 50Z" fill="' + K.ink + '"/>' + line("M30 12l-4-6M30 12l4-6", K.ink, 3) + line("M2 50h60", K.ink, 3) +
      '<path d="M52 50q-4-7 1-12q5 5 1 12z" fill="' + K.gold + '" stroke="' + K.ink + '" stroke-width="2" stroke-linejoin="round"/>',
    fav: '<path d="M32 54s-20-12-25-25C3 19 8 10 18 10c6 0 10 3 14 8c4-5 8-8 14-8c10 0 15 9 11 19c-5 13-25 25-25 25z" fill="' + K.coral + '" stroke="' + K.ink + '" stroke-width="3" stroke-linejoin="round"/>',
  };
  const icon = (id) => svg(64, 64, ICON[id] || ICON.healthy, "ico");
  const icons = Object.keys(ICON);

  const API = { dish: dish, icon: icon, icons: icons, check: check, pieces: Object.keys(T), bigs: Object.keys(BIG) };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.ART = API;
})(typeof self !== "undefined" ? self : this);
