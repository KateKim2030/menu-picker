// 사진이 있는 요리 목록. 직접 고치지 말고  python tools/photos.py  로 다시 만든다.
(function (root) {
  const P = ["pork-kimchi-stew", "doenjang-stew", "sprout-hangover-soup", "dried-pollack-soup", "miyeok-soup", "beef-radish-soup", "budae-stew", "dakbokkeumtang", "maratang", "dakgalbi", "jeyuk", "bulgogi", "samgyeopsal", "steak", "donkatsu", "tangsuyuk", "fried-chicken", "chicken-skewers", "chicken-breast-steak", "jjajangmyeon", "beef-pho", "janchi-guksu", "bibim-guksu", "kalguksu", "fishcake-udon", "yaki-udon", "ramen", "tomato-pasta", "aglio-olio", "cream-pasta", "tteokbokki", "tteokguk", "mandu-soup", "kimchi-fried-rice", "egg-fried-rice", "shrimp-fried-rice", "omurice", "curry-rice", "bibimbap", "sprouts-rice", "gimbap", "tuna-mayo-rice", "rice-balls", "chicken-porridge", "salmon-poke", "chicken-salad", "rice-paper-rolls", "grilled-mackerel", "kimchi-jeon"];
  if (typeof module !== "undefined" && module.exports) module.exports = P; else root.PHOTOS = P;
})(typeof self !== "undefined" ? self : this);
