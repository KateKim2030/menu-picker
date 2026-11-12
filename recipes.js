// 레시피 내용만 모아 둔 파일. 화면 코드(index.html)와 따로라서 여기만 고치면 요리가 늘어난다.
//
// ── 요리 추가하는 법 ──────────────────────────────────────────────
// 아래 RECIPES 목록에 한 덩어리를 복사해 붙이고 내용을 바꾼다.
//   id          : 영어 소문자·숫자·줄표만, 다른 요리와 겹치면 안 됨
//   name        : 요리 이름
//   tags        : 들어가는 주재료. 첫 번째가 대표 재료. (INGREDIENTS 의 id 중에서)
//   kind        : 종류. (KINDS 의 id 중에서: steam 찜 / soup 국물 / stirfry 볶음 / bowl 한 그릇 / fresh 샐러드·무침 / pan 구이·전)
//   meals       : 홈 화면의 어느 칸에 나올지. 여러 개 가능. 첫 번째로 적은 칸에서는 목록 위쪽에 나온다.
//                 (MEALS 의 id 중에서: breakfast 아침 / lunch 점심 / dinner 저녁 / healthy 건강식 / camping 캠핑요리)
//   delivery    : 배달앱에서 찾을 때 쓸 검색어 (배달로 먹기 어려운 메뉴는 빼면 됨)
//   time        : 조리 시간(분)
//   kcal/protein: 1인분 대략 값. 재료 양으로 어림한 추정치(공식 수치 아님)
//   ingredients : { name: 재료, amount: 양 }  — 없어도 되는 재료는 opt: true 를 붙인다.
//                 재료 이름이 PANTRY(우리 집 재료)에 있으면 "있음/없음"을 따지고, 없으면 양념으로 본다.
//   steps       : 만드는 순서, 한 문장씩
//   tip         : 한 줄 도움말 (없어도 됨)
//   art         : 그림. dish = pan(팬) / plate(접시) / bowl(그릇)
//                 bowl 은 base = rice(밥) / broth(국물) / custard(계란찜) / salad / porridge(죽), steam: true 면 김
//                 on  = 위에 흩어 놓을 재료 그림, big = 가운데 크게 놓을 그림 (이름은 art.js 참고)
// 새 주재료(닭가슴살, 버섯 …)는 INGREDIENTS 에 한 줄 추가하면 버튼이 생긴다.
// 고친 뒤에는  node tools/test.js  로 빠진 것이 없는지 확인한다.
// ────────────────────────────────────────────────────────────────
(function (root) {
  "use strict";

  const INGREDIENTS = [
    { id: "meat", name: "고기" },
    { id: "seafood", name: "해물" },
    { id: "noodle", name: "면·떡" },
    { id: "rice", name: "밥" },
    { id: "kimchi", name: "김치" },
    { id: "tofu", name: "두부" },
    { id: "egg", name: "계란" },
    { id: "cabbage", name: "양배추" },
    { id: "mushroom", name: "버섯" },
  ];

  // 홈 화면의 다섯 칸
  const MEALS = [
    { id: "breakfast", name: "아침", desc: "가볍고 빨리 되는 메뉴" },
    { id: "lunch", name: "점심", desc: "한 그릇으로 든든한 메뉴" },
    { id: "dinner", name: "저녁", desc: "국물·찜·구이로 차리는 메뉴" },
    { id: "healthy", name: "건강식", desc: "채소·두부·계란·닭가슴살 중심의 가벼운 메뉴" },
    { id: "camping", name: "캠핑요리", desc: "팬이나 냄비 하나로 되는 메뉴" },
  ];

  const KINDS = [
    { id: "steam", name: "찜" },
    { id: "soup", name: "국물" },
    { id: "stirfry", name: "볶음" },
    { id: "bowl", name: "한 그릇" },
    { id: "fresh", name: "샐러드·무침" },
    { id: "pan", name: "구이·전" },
  ];

  // 우리 집 재료 화면에 나오는 것들. names 는 레시피의 재료 이름 중 이 재료로 치는 것.
  // 여기 없는 재료(간장·소금·기름·된장 …)는 양념으로 보고 있음/없음을 따지지 않는다.
  const PANTRY = [
    { id: "cabbage", name: "양배추", group: "채소", names: ["양배추"] },
    { id: "napa", name: "배추", group: "채소", names: ["배추"] },
    { id: "mushroom", name: "버섯", group: "채소", names: ["버섯"] },
    { id: "sprouts", name: "숙주", group: "채소", names: ["숙주"] },
    { id: "onion", name: "양파", group: "채소", names: ["양파"] },
    { id: "scallion", name: "대파", group: "채소", names: ["대파"] },
    { id: "carrot", name: "당근", group: "채소", names: ["당근"] },
    { id: "zucchini", name: "애호박", group: "채소", names: ["애호박"] },
    { id: "cucumber", name: "오이", group: "채소", names: ["오이"] },
    { id: "tomato", name: "토마토", group: "채소", names: ["토마토", "방울토마토"] },
    { id: "greens", name: "샐러드 채소", group: "채소", names: ["샐러드 채소"] },
    { id: "perilla", name: "깻잎", group: "채소", names: ["깻잎"] },
    { id: "paprika", name: "파프리카", group: "채소", names: ["파프리카"] },
    { id: "garlic", name: "통마늘", group: "채소", names: ["통마늘"] },
    { id: "potato", name: "감자", group: "채소", names: ["감자"] },
    { id: "radish", name: "무", group: "채소", names: ["무"] },
    { id: "beansprouts", name: "콩나물", group: "채소", names: ["콩나물"] },
    { id: "lettuce", name: "상추", group: "채소", names: ["상추"] },
    { id: "bokchoy", name: "청경채", group: "채소", names: ["청경채"] },
    { id: "chives", name: "쪽파", group: "채소", names: ["쪽파"] },
    { id: "egg", name: "계란", group: "단백질", names: ["계란"] },
    { id: "tofu", name: "두부", group: "단백질", names: ["두부"] },
    { id: "softtofu", name: "순두부", group: "단백질", names: ["순두부"] },
    { id: "chicken", name: "닭가슴살", group: "단백질", names: ["닭가슴살", "익힌 닭가슴살"] },
    { id: "beef", name: "얇게 썬 소고기", group: "단백질", names: ["샤브샤브용 소고기", "얇게 썬 소고기"] },
    { id: "pork", name: "얇게 썬 돼지고기", group: "단백질", names: ["얇게 썬 돼지고기"] },
    { id: "porkneck", name: "돼지 목살", group: "단백질", names: ["돼지 목살"] },
    { id: "sausage", name: "소시지", group: "단백질", names: ["비엔나 소시지"] },
    { id: "shrimp", name: "새우", group: "단백질", names: ["새우"] },
    { id: "fishcake", name: "어묵", group: "단백질", names: ["어묵"] },
    { id: "tuna", name: "참치캔", group: "단백질", names: ["참치캔"] },
    { id: "porkbelly", name: "삼겹살", group: "단백질", names: ["삼겹살"] },
    { id: "porkloin", name: "돼지 등심", group: "단백질", names: ["돼지 등심"] },
    { id: "groundpork", name: "다진 돼지고기", group: "단백질", names: ["다진 돼지고기"] },
    { id: "chickenthigh", name: "닭다리살", group: "단백질", names: ["닭다리살"] },
    { id: "steakbeef", name: "스테이크용 소고기", group: "단백질", names: ["스테이크용 소고기"] },
    { id: "soupbeef", name: "국거리 소고기", group: "단백질", names: ["국거리 소고기"] },
    { id: "ham", name: "햄", group: "단백질", names: ["햄"] },
    { id: "bacon", name: "베이컨", group: "단백질", names: ["베이컨"] },
    { id: "dumpling", name: "냉동 만두", group: "단백질", names: ["만두"] },
    { id: "salmon", name: "연어", group: "단백질", names: ["연어"] },
    { id: "mackerel", name: "고등어", group: "단백질", names: ["고등어"] },
    { id: "clam", name: "바지락", group: "단백질", names: ["바지락"] },
    { id: "seafoodmix", name: "냉동 해물 믹스", group: "단백질", names: ["해물 믹스"] },
    { id: "pollack", name: "북어채", group: "단백질", names: ["북어채"] },
    { id: "milk", name: "우유", group: "단백질", names: ["우유"] },
    { id: "cheese", name: "슬라이스 치즈", group: "단백질", names: ["슬라이스 치즈"] },
    { id: "somyeon", name: "소면", group: "면·떡", names: ["소면"] },
    { id: "spaghetti", name: "스파게티 면", group: "면·떡", names: ["스파게티 면"] },
    { id: "udon", name: "우동면", group: "면·떡", names: ["우동면"] },
    { id: "ramen", name: "라면", group: "면·떡", names: ["라면"] },
    { id: "ricenoodle", name: "쌀국수 면", group: "면·떡", names: ["쌀국수 면"] },
    { id: "kalguksu", name: "칼국수 면", group: "면·떡", names: ["칼국수 면"] },
    { id: "chinesenoodle", name: "중화면", group: "면·떡", names: ["중화면"] },
    { id: "tteokbokki", name: "떡볶이 떡", group: "면·떡", names: ["떡볶이 떡"] },
    { id: "tteokguk", name: "떡국 떡", group: "면·떡", names: ["떡국 떡"] },
    { id: "rice", name: "밥", group: "밥·빵·기타", names: ["밥"] },
    { id: "bread", name: "식빵", group: "밥·빵·기타", names: ["식빵"] },
    { id: "oatmeal", name: "오트밀", group: "밥·빵·기타", names: ["오트밀"] },
    { id: "kimchi", name: "김치", group: "밥·빵·기타", names: ["김치"] },
    { id: "yogurt", name: "플레인 요거트", group: "밥·빵·기타", names: ["플레인 요거트"] },
    { id: "flour", name: "부침가루", group: "밥·빵·기타", names: ["부침가루"] },
    { id: "gim", name: "김밥용 김", group: "밥·빵·기타", names: ["김밥용 김"] },
    { id: "danmuji", name: "단무지", group: "밥·빵·기타", names: ["단무지"] },
    { id: "miyeok", name: "마른 미역", group: "밥·빵·기타", names: ["마른 미역"] },
    { id: "ricepaper", name: "라이스페이퍼", group: "밥·빵·기타", names: ["라이스페이퍼"] },
    { id: "breadcrumbs", name: "빵가루", group: "소스·가루", names: ["빵가루"] },
    { id: "frymix", name: "튀김가루", group: "소스·가루", names: ["튀김가루"] },
    { id: "curry", name: "카레 가루", group: "소스·가루", names: ["카레 가루"] },
    { id: "chunjang", name: "춘장", group: "소스·가루", names: ["춘장"] },
    { id: "mala", name: "마라 소스", group: "소스·가루", names: ["마라 소스"] },
    { id: "tomatosauce", name: "토마토 파스타 소스", group: "소스·가루", names: ["토마토 소스"] },
  ];

  const RECIPES = [
    // ───────── 찌개·국·탕 ─────────
    {
      id: "pork-kimchi-stew", name: "돼지고기 김치찌개", tags: ["kimchi", "meat", "tofu"], kind: "soup", meals: ["dinner", "lunch", "camping"], delivery: "김치찌개", time: 25, kcal: 380, protein: 26,
      ingredients: [
        { name: "김치", amount: "150g (한 컵 조금 안 되게)" }, { name: "얇게 썬 돼지고기", amount: "100g (앞다리·찌개용)" }, { name: "두부", amount: "100g (1/3모)" },
        { name: "양파", amount: "1/4개" }, { name: "대파", amount: "조금", opt: true }, { name: "고춧가루", amount: "1작은술" },
        { name: "다진 마늘", amount: "1/2작은술" }, { name: "김치 국물", amount: "3큰술" }, { name: "물", amount: "350ml (종이컵 2컵)" },
      ],
      steps: [
        "김치와 양파는 한입 크기로, 두부는 도톰하게 썰어요.",
        "냄비에 돼지고기와 김치를 넣고 중불에서 3분 볶아요. 고기 기름으로 볶으면 돼요.",
        "물, 김치 국물, 고춧가루, 마늘, 양파를 넣고 끓여요.",
        "끓으면 중약불로 줄여 12분 끓여요.",
        "두부와 대파를 넣고 3분 더 끓여요.",
      ],
      tip: "김치가 덜 익었으면 식초를 몇 방울, 너무 시면 설탕을 조금 넣어요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#e58a6a", steam: true, on: ["kimchi", "pork", "tofu", "scallion"] },
    },
    {
      id: "doenjang-stew", name: "된장찌개", tags: ["tofu"], kind: "soup", meals: ["dinner", "breakfast", "camping"], delivery: "된장찌개", time: 20, kcal: 210, protein: 15,
      ingredients: [
        { name: "두부", amount: "100g (1/3모)" }, { name: "애호박", amount: "1/4개" }, { name: "양파", amount: "1/4개" },
        { name: "감자", amount: "1/2개", opt: true }, { name: "버섯", amount: "한 줌", opt: true }, { name: "대파", amount: "조금", opt: true },
        { name: "된장", amount: "1큰술 반" }, { name: "고춧가루", amount: "1/2작은술" }, { name: "다진 마늘", amount: "1/2작은술" }, { name: "물", amount: "400ml (종이컵 2컵 넉넉히)" },
      ],
      steps: [
        "감자, 애호박, 양파, 두부를 비슷한 크기로 깍둑 썰어요.",
        "냄비에 물을 붓고 된장을 풀어 끓여요.",
        "끓으면 감자와 양파를 먼저 넣고 5분 끓여요.",
        "애호박, 버섯, 두부, 마늘, 고춧가루를 넣고 5분 더 끓여요.",
        "대파를 올리고 불을 꺼요.",
      ],
      tip: "쌀뜨물로 끓이면 국물이 더 구수해요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#d9b27a", steam: true, on: ["tofu", "zucchini", "potato", "scallion"] },
    },
    {
      id: "sprout-hangover-soup", name: "콩나물 해장국", tags: ["rice", "egg"], kind: "soup", meals: ["breakfast", "lunch"], delivery: "콩나물국밥", time: 15, kcal: 330, protein: 16,
      ingredients: [
        { name: "콩나물", amount: "150g (반 봉지)" }, { name: "밥", amount: "반 공기" }, { name: "계란", amount: "1개" },
        { name: "대파", amount: "조금", opt: true }, { name: "김치", amount: "조금", opt: true }, { name: "새우젓", amount: "1작은술 (없으면 소금)" },
        { name: "다진 마늘", amount: "1/2작은술" }, { name: "국간장", amount: "1작은술" }, { name: "물", amount: "500ml (종이컵 3컵 조금 안 되게)" },
      ],
      steps: [
        "냄비에 물과 씻은 콩나물을 넣고 뚜껑을 연 채로 끓여요.",
        "끓기 시작하면 5분 더 끓이고 마늘, 국간장, 새우젓으로 간을 해요.",
        "밥을 넣고 2분 끓여요.",
        "계란을 깨 넣고 대파를 올려요. 계란은 젓지 않아야 국물이 맑아요.",
      ],
      tip: "뚜껑은 처음부터 끝까지 열거나, 끝까지 닫아야 콩나물 비린내가 안 나요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#f3e8c6", steam: true, on: ["sprouts", "scramble", "sprouts", "scallion"] },
    },
    {
      id: "dried-pollack-soup", name: "북엇국", tags: ["seafood", "egg", "tofu"], kind: "soup", meals: ["breakfast", "dinner"], delivery: "북엇국", time: 15, kcal: 200, protein: 24,
      ingredients: [
        { name: "북어채", amount: "20g (한 줌)" }, { name: "계란", amount: "1개" }, { name: "두부", amount: "80g (1/4모)", opt: true },
        { name: "대파", amount: "조금", opt: true }, { name: "참기름", amount: "1작은술" }, { name: "국간장", amount: "1작은술" },
        { name: "다진 마늘", amount: "1/2작은술" }, { name: "소금", amount: "조금" }, { name: "물", amount: "500ml (종이컵 3컵 조금 안 되게)" },
      ],
      steps: [
        "북어채를 물에 살짝 적셔 한입 크기로 자르고 물기를 짜요.",
        "냄비에 참기름을 두르고 북어채를 약불에서 1분 볶아요.",
        "물을 붓고 마늘, 국간장을 넣어 7분 끓여요. 국물이 뽀얗게 돼요.",
        "두부를 넣고, 푼 계란을 가늘게 돌려 부어요.",
        "대파를 넣고 소금으로 간을 맞춰요.",
      ],
      tip: "북어채를 오래 불리면 맛이 빠져요. 적시기만 해요.",
      art: { dish: "bowl", base: "broth", color: "#f6efd6", steam: true, on: ["fishcake", "scramble", "tofu", "scallion"] },
    },
    {
      id: "miyeok-soup", name: "소고기 미역국", tags: ["meat"], kind: "soup", meals: ["breakfast", "dinner"], delivery: "미역국", time: 30, kcal: 180, protein: 17,
      ingredients: [
        { name: "마른 미역", amount: "5g (한 줌이 안 되게)" }, { name: "국거리 소고기", amount: "70g" }, { name: "참기름", amount: "1작은술" },
        { name: "국간장", amount: "1큰술" }, { name: "다진 마늘", amount: "1/2작은술" }, { name: "소금", amount: "조금" }, { name: "물", amount: "500ml (종이컵 3컵 조금 안 되게)" },
      ],
      steps: [
        "미역을 찬물에 10분 불려 헹군 뒤 물기를 짜고 먹기 좋게 잘라요.",
        "냄비에 참기름을 두르고 소고기를 중불에서 볶아요.",
        "고기 겉이 익으면 미역과 국간장을 넣고 2분 더 볶아요.",
        "물과 마늘을 넣고 끓으면 약불로 줄여 15분 끓여요.",
        "싱거우면 소금으로 간을 맞춰요.",
      ],
      tip: "마른 미역은 불리면 10배쯤 늘어나요. 조금만 꺼내요.",
      art: { dish: "bowl", base: "broth", color: "#dfe3c0", steam: true, on: ["miyeok", "beef", "miyeok"] },
    },
    {
      id: "beef-radish-soup", name: "소고기뭇국", tags: ["meat"], kind: "soup", meals: ["dinner", "breakfast"], time: 30, kcal: 190, protein: 18,
      ingredients: [
        { name: "국거리 소고기", amount: "80g" }, { name: "무", amount: "150g (3cm 한 토막)" }, { name: "대파", amount: "조금", opt: true },
        { name: "참기름", amount: "1작은술" }, { name: "국간장", amount: "1큰술" }, { name: "다진 마늘", amount: "1/2작은술" },
        { name: "소금", amount: "조금" }, { name: "물", amount: "500ml (종이컵 3컵 조금 안 되게)" },
      ],
      steps: [
        "무를 얇고 네모나게 썰어요.",
        "냄비에 참기름을 두르고 소고기를 볶다가, 무를 넣어 2분 더 볶아요.",
        "물, 국간장, 마늘을 넣고 끓여요. 떠오르는 거품은 걷어 내요.",
        "약불로 줄여 15분, 무가 투명해질 때까지 끓여요.",
        "대파를 넣고 소금으로 간을 맞춰요.",
      ],
      tip: "무를 얇게 썰수록 빨리 익고 국물이 시원해져요.",
      art: { dish: "bowl", base: "broth", color: "#f3e8c6", steam: true, on: ["tofu", "beef", "tofu", "scallion"] },
    },
    {
      id: "budae-stew", name: "부대찌개", tags: ["meat", "kimchi", "noodle"], kind: "soup", meals: ["camping", "dinner"], delivery: "부대찌개", time: 20, kcal: 560, protein: 24,
      ingredients: [
        { name: "햄", amount: "80g (통조림 햄 1/3캔)" }, { name: "비엔나 소시지", amount: "5개" }, { name: "김치", amount: "80g (반 컵)" },
        { name: "두부", amount: "80g (1/4모)", opt: true }, { name: "양파", amount: "1/4개" }, { name: "대파", amount: "조금", opt: true },
        { name: "라면", amount: "면만 반 개", opt: true }, { name: "슬라이스 치즈", amount: "1장", opt: true },
        { name: "고춧가루", amount: "1큰술" }, { name: "고추장", amount: "1/2큰술" }, { name: "간장", amount: "1큰술" }, { name: "다진 마늘", amount: "1작은술" },
        { name: "물", amount: "450ml (종이컵 2컵 반)" },
      ],
      steps: [
        "햄, 소시지, 김치, 양파, 두부를 먹기 좋게 썰어 넓은 냄비에 돌려 담아요.",
        "고춧가루, 고추장, 간장, 마늘을 섞어 가운데에 올려요.",
        "물을 붓고 센 불에서 끓이다가, 끓으면 중불로 5분 끓여요.",
        "라면 사리를 넣고 3분 더 끓여요.",
        "대파와 치즈를 올리면 끝.",
      ],
      tip: "햄과 김치가 짜서 간은 마지막에 봐요. 물 대신 사골 육수를 쓰면 더 진해요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#e58a6a", steam: true, on: ["sausage", "kimchi", "noodle", "tofu", "scallion"] },
    },
    {
      id: "dakbokkeumtang", name: "닭볶음탕", tags: ["meat"], kind: "soup", meals: ["dinner", "camping"], delivery: "닭볶음탕", time: 40, kcal: 480, protein: 34,
      ingredients: [
        { name: "닭다리살", amount: "200g (뼈 있는 닭이면 300g)" }, { name: "감자", amount: "1개" }, { name: "양파", amount: "1/2개" },
        { name: "당근", amount: "1/4개", opt: true }, { name: "대파", amount: "조금", opt: true }, { name: "고추장", amount: "1큰술" },
        { name: "고춧가루", amount: "1큰술" }, { name: "간장", amount: "2큰술" }, { name: "설탕", amount: "1/2큰술" }, { name: "다진 마늘", amount: "1작은술" },
        { name: "물", amount: "300ml (종이컵 1컵 반 넉넉히)" },
      ],
      steps: [
        "닭은 한입 크기로 자르고, 감자와 양파, 당근은 큼직하게 썰어요.",
        "고추장, 고춧가루, 간장, 설탕, 마늘을 섞어 양념을 만들어요.",
        "냄비에 닭, 감자, 당근, 양념, 물을 넣고 센 불에서 끓여요.",
        "끓으면 뚜껑을 덮고 중불에서 20분 끓여요. 중간에 두세 번 뒤적여요.",
        "양파와 대파를 넣고 뚜껑을 연 채로 5분 더 졸여요.",
      ],
      tip: "젓가락으로 감자를 찔러 쑥 들어가면 다 된 거예요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#e07f5c", steam: true, on: ["chicken", "potato", "carrot", "chicken", "scallion"] },
    },
    {
      id: "maratang", name: "마라탕", tags: ["meat", "noodle", "mushroom"], kind: "soup", meals: ["dinner", "lunch"], delivery: "마라탕", time: 20, kcal: 520, protein: 30,
      ingredients: [
        { name: "마라 소스", amount: "2큰술 (시판 마라탕 소스, 봉지에 적힌 양대로)" }, { name: "얇게 썬 소고기", amount: "100g" }, { name: "청경채", amount: "2포기" },
        { name: "숙주", amount: "100g (두 줌)" }, { name: "버섯", amount: "50g (한 줌)" }, { name: "두부", amount: "80g (1/4모)", opt: true },
        { name: "어묵", amount: "1장", opt: true }, { name: "쌀국수 면", amount: "50g (넓은 당면도 좋아요)", opt: true }, { name: "땅콩버터", amount: "1큰술 (빼도 돼요)" },
        { name: "물", amount: "500ml (사골 육수면 더 좋아요)" },
      ],
      steps: [
        "면은 봉지에 적힌 시간만큼 찬물에 불려 둬요.",
        "청경채는 반으로 가르고, 버섯·두부·어묵은 한입 크기로 썰어요.",
        "냄비에 물, 마라 소스, 땅콩버터를 넣고 풀어 끓여요.",
        "버섯, 두부, 어묵, 면을 넣고 4분 끓여요.",
        "청경채, 숙주, 소고기를 넣고 2분 더 끓여요.",
      ],
      tip: "매운 정도는 소스 양으로 조절해요. 처음엔 절반만 넣고 맛을 봐요.",
      art: { dish: "bowl", base: "broth", color: "#d9634a", steam: true, on: ["beef", "greens", "noodle", "mushroom", "sprouts"] },
    },

    // ───────── 고기 ─────────
    {
      id: "dakgalbi", name: "닭갈비", tags: ["meat", "cabbage"], kind: "stirfry", meals: ["camping", "dinner"], delivery: "닭갈비", time: 30, kcal: 520, protein: 36,
      ingredients: [
        { name: "닭다리살", amount: "200g" }, { name: "양배추", amount: "150g (두 줌)" }, { name: "양파", amount: "1/4개" },
        { name: "떡볶이 떡", amount: "한 줌", opt: true }, { name: "깻잎", amount: "5장", opt: true }, { name: "대파", amount: "조금", opt: true },
        { name: "고추장", amount: "1큰술 반" }, { name: "고춧가루", amount: "1큰술" }, { name: "간장", amount: "1큰술" },
        { name: "설탕", amount: "1큰술" }, { name: "다진 마늘", amount: "1작은술" }, { name: "식용유", amount: "1큰술" },
      ],
      steps: [
        "닭다리살을 한입 크기로 잘라요.",
        "고추장, 고춧가루, 간장, 설탕, 마늘을 섞어 닭에 버무리고 15분 둬요.",
        "양배추와 양파는 큼직하게 썰어요.",
        "넓은 팬에 기름을 두르고 닭을 중불에서 5분 볶아요.",
        "양배추, 양파, 떡을 넣고 6~7분 더 볶아요. 눌어붙으면 물을 두세 숟갈 넣어요.",
        "닭이 속까지 익으면 깻잎과 대파를 넣고 한 번 섞어요.",
      ],
      tip: "다 먹고 남은 양념에 밥과 김가루를 넣어 볶으면 볶음밥이 돼요. 집에서 양념에 재워 가면 캠핑장에서 편해요.",
      art: { dish: "pan", on: ["chicken", "cabbage", "kimchi", "tteok", "chicken", "greens"] },
    },
    {
      id: "jeyuk", name: "제육볶음", tags: ["meat"], kind: "stirfry", meals: ["dinner", "lunch", "camping"], delivery: "제육볶음", time: 20, kcal: 450, protein: 28,
      ingredients: [
        { name: "얇게 썬 돼지고기", amount: "150g (앞다리·불고기용)" }, { name: "양파", amount: "1/2개" }, { name: "대파", amount: "조금", opt: true },
        { name: "양배추", amount: "한 줌", opt: true }, { name: "고추장", amount: "1큰술" }, { name: "고춧가루", amount: "1큰술" },
        { name: "간장", amount: "1큰술" }, { name: "설탕", amount: "1/2큰술" }, { name: "다진 마늘", amount: "1작은술" }, { name: "식용유", amount: "1작은술" },
      ],
      steps: [
        "고추장, 고춧가루, 간장, 설탕, 마늘을 섞어 돼지고기에 버무려요.",
        "양파는 굵게 채 썰어요.",
        "달군 팬에 기름을 두르고 고기를 센 불에서 4분 볶아요.",
        "양파와 양배추를 넣고 3분 더 볶아요.",
        "대파를 넣고 한 번 섞으면 끝.",
      ],
      tip: "상추에 싸 먹거나 밥 위에 올리면 제육덮밥이 돼요.",
      art: { dish: "pan", on: ["pork", "kimchi", "pork", "scallion", "cabbage"] },
    },
    {
      id: "bulgogi", name: "소불고기", tags: ["meat", "mushroom"], kind: "stirfry", meals: ["dinner", "lunch", "camping"], delivery: "불고기", time: 25, kcal: 400, protein: 30,
      ingredients: [
        { name: "얇게 썬 소고기", amount: "150g (불고기용)" }, { name: "양파", amount: "1/4개" }, { name: "버섯", amount: "50g (한 줌)" },
        { name: "당근", amount: "조금", opt: true }, { name: "대파", amount: "조금", opt: true }, { name: "간장", amount: "2큰술" },
        { name: "설탕", amount: "1큰술" }, { name: "다진 마늘", amount: "1작은술" }, { name: "참기름", amount: "1작은술" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "소고기는 키친타월로 핏물을 눌러 닦아요.",
        "간장, 설탕, 마늘, 참기름, 후추를 섞어 고기에 버무리고 10분 둬요.",
        "양파와 당근은 채 썰고, 버섯은 찢어요.",
        "달군 팬에 고기를 펼쳐 센 불에서 3분 볶아요.",
        "채소를 넣고 3분 더 볶아요.",
      ],
      tip: "국물이 있는 게 좋으면 물 3큰술을 넣고 끓이듯 익혀요.",
      art: { dish: "pan", on: ["beef", "mushroom", "beef", "carrot", "scallion"] },
    },
    {
      id: "samgyeopsal", name: "삼겹살 구이", tags: ["meat"], kind: "pan", meals: ["camping", "dinner"], delivery: "삼겹살", time: 20, kcal: 680, protein: 28,
      ingredients: [
        { name: "삼겹살", amount: "180g (구이용 3~4줄)" }, { name: "상추", amount: "10장" }, { name: "통마늘", amount: "5쪽", opt: true },
        { name: "김치", amount: "한 줌", opt: true }, { name: "버섯", amount: "한 줌", opt: true }, { name: "쌈장", amount: "1큰술" },
        { name: "소금", amount: "두 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "달군 팬이나 그릴에 삼겹살을 올리고 소금, 후추를 뿌려요.",
        "중불에서 한쪽을 4분, 노릇해질 때까지 굽고 뒤집어 3분 더 구워요.",
        "가위로 한입 크기로 자르고, 자른 면도 굴려 가며 익혀요.",
        "나온 기름에 마늘, 김치, 버섯을 구워요.",
        "상추에 고기, 마늘, 쌈장을 올려 싸 먹어요.",
      ],
      tip: "기름이 많이 나와요. 키친타월로 닦아 가며 구우면 덜 튀어요.",
      art: { dish: "plate", on: ["belly", "greens", "belly", "garlic", "belly", "kimchi"] },
    },
    {
      id: "steak", name: "스테이크", tags: ["meat"], kind: "pan", meals: ["dinner", "camping"], delivery: "스테이크", time: 20, kcal: 520, protein: 40,
      ingredients: [
        { name: "스테이크용 소고기", amount: "200g (등심·채끝, 2cm 두께)" }, { name: "통마늘", amount: "3쪽", opt: true }, { name: "버섯", amount: "한 줌", opt: true },
        { name: "식용유", amount: "1큰술" }, { name: "버터", amount: "1큰술" }, { name: "소금", amount: "1/2작은술" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "고기를 굽기 30분 전에 꺼내 물기를 닦고, 앞뒤로 소금과 후추를 뿌려요.",
        "팬을 연기가 살짝 날 때까지 달구고 기름을 둘러요.",
        "고기를 올려 건드리지 말고 2분, 뒤집어서 2분 구워요.",
        "불을 줄이고 버터와 마늘을 넣어, 녹은 버터를 숟가락으로 고기에 1분 끼얹어요.",
        "접시에 옮겨 5분 그대로 둔 뒤 썰어요.",
      ],
      tip: "2cm 두께 기준으로 속이 분홍빛인 굽기예요. 더 익히려면 한쪽에 1분씩 더 구워요.",
      art: { dish: "plate", big: "beefsteak", on: ["mushroom", "garlic"] },
    },
    {
      id: "donkatsu", name: "돈까스", tags: ["meat"], kind: "pan", meals: ["lunch", "dinner"], delivery: "돈까스", time: 30, kcal: 620, protein: 32,
      ingredients: [
        { name: "돼지 등심", amount: "150g (돈까스용 1장)" }, { name: "계란", amount: "1개" }, { name: "빵가루", amount: "종이컵 1컵" },
        { name: "밀가루", amount: "2큰술" }, { name: "양배추", amount: "한 줌", opt: true }, { name: "식용유", amount: "종이컵 1컵 (팬 바닥에서 1cm)" },
        { name: "돈까스 소스", amount: "2큰술" }, { name: "소금", amount: "두 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "등심을 칼등으로 두드려 1cm 두께로 펴고 소금, 후추를 뿌려요.",
        "밀가루, 푼 계란, 빵가루 순서로 옷을 입혀요. 빵가루는 손으로 꾹꾹 눌러요.",
        "팬에 기름을 1cm 높이로 붓고 중불로 달궈요. 빵가루를 떨어뜨려 바로 떠오르면 됐어요.",
        "고기를 넣고 앞뒤로 3분씩 노릇하게 튀겨요.",
        "키친타월 위에 2분 세워 기름을 빼고 썰어요. 채 썬 양배추와 소스를 곁들여요.",
      ],
      tip: "기름에 물이 들어가면 크게 튀어요. 고기 물기를 꼭 닦고, 아이는 멀리 있게 해요.",
      art: { dish: "plate", big: "cutlet", on: ["cabbage"] },
    },
    {
      id: "tangsuyuk", name: "탕수육", tags: ["meat"], kind: "pan", meals: ["dinner"], delivery: "탕수육", time: 40, kcal: 650, protein: 30,
      ingredients: [
        { name: "돼지 등심", amount: "150g" }, { name: "전분", amount: "종이컵 반 컵" }, { name: "계란", amount: "흰자 1개" },
        { name: "양파", amount: "1/4개" }, { name: "당근", amount: "조금", opt: true }, { name: "오이", amount: "조금", opt: true },
        { name: "식용유", amount: "종이컵 1컵 반 (작은 냄비에 2cm)" }, { name: "설탕", amount: "3큰술" }, { name: "식초", amount: "2큰술" },
        { name: "간장", amount: "1큰술" }, { name: "소금", amount: "한 꼬집" }, { name: "물", amount: "100ml + 전분물 2큰술" },
      ],
      steps: [
        "등심을 손가락 굵기로 길게 썰어 소금을 뿌려요.",
        "전분에 물 4큰술과 흰자를 넣어 되직한 반죽을 만들고 고기에 버무려요.",
        "작은 냄비에 기름을 달구고 고기를 하나씩 넣어 3분 튀겨요. 건졌다가 1분 더 튀기면 바삭해요.",
        "다른 팬에 물 100ml, 설탕, 식초, 간장과 얇게 썬 채소를 넣고 끓여요.",
        "끓으면 전분물(전분 1큰술 + 물 1큰술)을 넣고 저어 걸쭉하게 만들어요.",
        "소스를 붓거나 찍어 먹어요.",
      ],
      tip: "뜨거운 기름을 쓰는 요리예요. 냄비는 깊은 것으로, 불 옆을 떠나지 말아요.",
      art: { dish: "plate", on: ["fried", "carrot", "fried", "cucumber", "fried"] },
    },
    {
      id: "fried-chicken", name: "순살 치킨", tags: ["meat"], kind: "pan", meals: ["dinner"], delivery: "치킨", time: 40, kcal: 640, protein: 38,
      ingredients: [
        { name: "닭다리살", amount: "250g" }, { name: "튀김가루", amount: "종이컵 반 컵" }, { name: "우유", amount: "종이컵 반 컵 (잡내 빼기용, 빼도 돼요)", opt: true },
        { name: "식용유", amount: "종이컵 1컵 반 (작은 냄비에 2cm)" }, { name: "소금", amount: "1/2작은술" }, { name: "후추", amount: "조금" }, { name: "다진 마늘", amount: "1/2작은술" },
      ],
      steps: [
        "닭다리살을 한입 크기로 잘라 우유에 15분 담갔다가 물기를 닦아요.",
        "소금, 후추, 마늘로 밑간을 해요.",
        "튀김가루 2큰술에 물 3큰술을 섞어 닭에 버무리고, 남은 마른 튀김가루를 한 번 더 묻혀요.",
        "기름을 달궈 닭을 넣고 중불에서 5분 튀겨요.",
        "건져서 2분 식혔다가 센 불에서 1분 더 튀기면 바삭해요.",
      ],
      tip: "에어프라이어가 있으면 기름을 살짝 뿌려 180도에서 15분, 뒤집어 5분 구워도 돼요.",
      art: { dish: "plate", on: ["fried"] },
    },
    {
      id: "chicken-skewers", name: "닭꼬치", tags: ["meat"], kind: "pan", meals: ["camping", "dinner"], delivery: "닭꼬치", time: 30, kcal: 380, protein: 34,
      ingredients: [
        { name: "닭다리살", amount: "200g" }, { name: "대파", amount: "1대" }, { name: "간장", amount: "2큰술" },
        { name: "설탕", amount: "1큰술" }, { name: "맛술", amount: "1큰술 (없으면 물)" }, { name: "다진 마늘", amount: "1/2작은술" }, { name: "식용유", amount: "1작은술" },
      ],
      steps: [
        "닭다리살과 대파를 한입 크기로 잘라 꼬치에 번갈아 꽂아요.",
        "간장, 설탕, 맛술, 마늘을 섞어 소스를 만들어요.",
        "달군 팬이나 그릴에 기름을 바르고 꼬치를 중불에서 앞뒤로 4분씩 구워요.",
        "소스를 발라 가며 2분 더 구워요. 소스는 금방 타니 마지막에 발라요.",
      ],
      tip: "나무 꼬치는 물에 10분 담갔다 쓰면 불에 타지 않아요. 집에서 꽂아 가면 편해요.",
      art: { dish: "plate", big: "skewer" },
    },
    {
      id: "chicken-breast-steak", name: "닭가슴살 스테이크", tags: ["meat"], kind: "pan", meals: ["healthy", "dinner", "lunch"], time: 20, kcal: 250, protein: 36,
      ingredients: [
        { name: "닭가슴살", amount: "150g (생것 1쪽)" }, { name: "샐러드 채소", amount: "한 줌", opt: true }, { name: "방울토마토", amount: "5개", opt: true },
        { name: "올리브유", amount: "2작은술" }, { name: "소금", amount: "두 꼬집" }, { name: "후추", amount: "조금" }, { name: "다진 마늘", amount: "1/2작은술" },
      ],
      steps: [
        "닭가슴살의 두꺼운 쪽을 칼로 저며 펼쳐 두께를 고르게 해요.",
        "소금, 후추, 마늘, 올리브유 절반을 발라 10분 둬요.",
        "달군 팬에 남은 올리브유를 두르고 중불에서 4분 구워요.",
        "뒤집어서 뚜껑을 덮고 약불에서 4분 더 익혀요.",
        "3분 그대로 두었다가 썰어서 채소와 담아요.",
      ],
      tip: "두께를 고르게 펴야 퍽퍽하지 않게 익어요.",
      art: { dish: "plate", big: "chop", on: ["greens", "tomato"] },
    },

    // ───────── 면·떡 ─────────
    {
      id: "jjajangmyeon", name: "짜장면", tags: ["noodle", "meat"], kind: "bowl", meals: ["lunch", "dinner"], delivery: "짜장면", time: 30, kcal: 680, protein: 24,
      ingredients: [
        { name: "중화면", amount: "1인분 (생면, 우동면·칼국수 면도 돼요)" }, { name: "다진 돼지고기", amount: "80g" }, { name: "춘장", amount: "2큰술" },
        { name: "양파", amount: "1개" }, { name: "양배추", amount: "한 줌", opt: true }, { name: "감자", amount: "1/2개", opt: true }, { name: "오이", amount: "조금", opt: true },
        { name: "식용유", amount: "3큰술" }, { name: "설탕", amount: "1큰술" }, { name: "물", amount: "150ml + 전분물 2큰술" },
      ],
      steps: [
        "양파, 양배추, 감자를 손톱 크기로 깍둑 썰어요.",
        "팬에 기름과 춘장을 넣고 약불에서 2분 볶아 그릇에 덜어 둬요. 볶아야 쓴맛이 없어져요.",
        "같은 팬에 돼지고기를 볶다가 감자, 양파, 양배추를 넣고 4분 볶아요.",
        "볶은 춘장과 설탕을 넣어 섞고, 물을 부어 5분 끓여요.",
        "전분물(전분 1큰술 + 물 1큰술)을 넣어 걸쭉하게 만들어요.",
        "삶은 면 위에 소스를 붓고 채 썬 오이를 올려요.",
      ],
      tip: "면 대신 밥에 부으면 짜장밥이에요. 소스는 넉넉히 만들어 냉동해 둬도 좋아요.",
      art: { dish: "bowl", base: "broth", color: "#4a3226", on: ["noodle", "noodle", "cucumber", "noodle", "noodle", "tofu", "noodle", "noodle"] },
    },
    {
      id: "beef-pho", name: "소고기 쌀국수", tags: ["noodle", "meat"], kind: "soup", meals: ["lunch", "dinner"], delivery: "쌀국수", time: 25, kcal: 430, protein: 26,
      ingredients: [
        { name: "쌀국수 면", amount: "80g (1인분)" }, { name: "얇게 썬 소고기", amount: "100g (샤브샤브용)" }, { name: "숙주", amount: "100g (두 줌)" },
        { name: "양파", amount: "1/4개" }, { name: "대파", amount: "조금", opt: true }, { name: "액젓", amount: "1큰술 (멸치·까나리 아무거나)" },
        { name: "국간장", amount: "1작은술" }, { name: "다진 마늘", amount: "1/2작은술" }, { name: "후추", amount: "넉넉히" }, { name: "물", amount: "600ml (사골 육수면 더 좋아요)" },
        { name: "레몬즙", amount: "조금 (빼도 돼요)" },
      ],
      steps: [
        "쌀국수 면을 찬물에 20분 불려요.",
        "양파는 얇게 썰어 찬물에 담가 매운맛을 빼요.",
        "냄비에 물, 마늘, 액젓, 국간장, 대파를 넣고 5분 끓여 국물을 만들어요.",
        "끓는 국물에 불린 면을 넣고 1분 익혀 면만 그릇에 담아요.",
        "국물에 소고기를 넣어 색이 변하면 바로 불을 꺼요.",
        "면 위에 숙주와 양파를 올리고 뜨거운 국물과 고기를 부어요. 후추와 레몬즙을 뿌려요.",
      ],
      tip: "숙주는 익히지 않고 뜨거운 국물로만 숨을 죽여야 아삭해요.",
      art: { dish: "bowl", base: "broth", color: "#f1e2bd", steam: true, on: ["noodle", "beef", "sprouts", "noodle", "scallion", "beef"] },
    },
    {
      id: "janchi-guksu", name: "잔치국수", tags: ["noodle", "egg"], kind: "soup", meals: ["lunch", "dinner"], delivery: "잔치국수", time: 20, kcal: 420, protein: 16,
      ingredients: [
        { name: "소면", amount: "100g (500원 동전 굵기 한 줌)" }, { name: "계란", amount: "1개" }, { name: "애호박", amount: "1/4개" },
        { name: "당근", amount: "조금", opt: true }, { name: "김가루", amount: "조금", opt: true }, { name: "국물용 멸치", amount: "7마리 (멸치 육수 팩 1개)" },
        { name: "국간장", amount: "1큰술" }, { name: "소금", amount: "조금" }, { name: "물", amount: "600ml (종이컵 3컵 넉넉히)" },
      ],
      steps: [
        "냄비에 물과 멸치를 넣고 10분 끓인 뒤 멸치를 건져요.",
        "국물에 채 썬 애호박과 당근, 국간장을 넣고 2분 끓여요.",
        "푼 계란을 가늘게 돌려 붓고 소금으로 간을 맞춰요.",
        "다른 냄비에 소면을 3분 삶아요. 끓어오르면 찬물 반 컵을 한 번 부어요.",
        "면을 찬물에 비벼 씻어 그릇에 담고, 뜨거운 국물을 부어요. 김가루를 올려요.",
      ],
      tip: "소면은 찬물에 빨래하듯 헹궈야 쫄깃해요.",
      art: { dish: "bowl", base: "broth", color: "#f3e8c6", steam: true, on: ["noodle", "scramble", "zucchini", "noodle", "seaweed", "carrot"] },
    },
    {
      id: "bibim-guksu", name: "비빔국수", tags: ["noodle", "kimchi"], kind: "bowl", meals: ["lunch"], delivery: "비빔국수", time: 15, kcal: 460, protein: 14,
      ingredients: [
        { name: "소면", amount: "100g (500원 동전 굵기 한 줌)" }, { name: "김치", amount: "한 줌", opt: true }, { name: "오이", amount: "1/4개", opt: true },
        { name: "계란", amount: "삶은 것 반 개", opt: true }, { name: "고추장", amount: "1큰술 반" }, { name: "식초", amount: "1큰술" },
        { name: "설탕", amount: "1큰술" }, { name: "간장", amount: "1작은술" }, { name: "참기름", amount: "1큰술" }, { name: "깨", amount: "조금" },
      ],
      steps: [
        "고추장, 식초, 설탕, 간장, 참기름을 섞어 양념장을 만들어요.",
        "김치는 잘게, 오이는 채 썰어요.",
        "소면을 3분 삶아 찬물에 여러 번 비벼 씻고 물기를 꼭 빼요.",
        "면에 양념장과 김치를 넣고 비벼요.",
        "오이, 삶은 계란, 깨를 올려요.",
      ],
      tip: "물기를 꼭 빼야 양념이 싱거워지지 않아요.",
      art: { dish: "plate", big: "nest", color: "#e58a6a", top: ["cucumber", "kimchi", "cucumber"] },
    },
    {
      id: "kalguksu", name: "바지락 칼국수", tags: ["noodle", "seafood"], kind: "soup", meals: ["lunch", "dinner"], delivery: "칼국수", time: 25, kcal: 480, protein: 22,
      ingredients: [
        { name: "칼국수 면", amount: "1인분 (생면 150g)" }, { name: "바지락", amount: "200g (해감된 것 한 봉지)" }, { name: "애호박", amount: "1/4개" },
        { name: "감자", amount: "1/2개", opt: true }, { name: "대파", amount: "조금", opt: true }, { name: "다진 마늘", amount: "1/2작은술" },
        { name: "국간장", amount: "1작은술" }, { name: "소금", amount: "조금" }, { name: "물", amount: "700ml (종이컵 4컵 조금 안 되게)" },
      ],
      steps: [
        "바지락을 찬물에 비벼 씻어요.",
        "냄비에 물과 얇게 썬 감자를 넣고 끓여요.",
        "끓으면 바지락을 넣고, 입이 벌어지면 거품을 걷어 내요.",
        "면에 묻은 밀가루를 털어 넣고, 채 썬 애호박과 마늘을 넣어 5분 끓여요.",
        "국간장과 소금으로 간을 하고 대파를 올려요.",
      ],
      tip: "면의 덧가루를 털지 않으면 국물이 너무 걸쭉해져요.",
      art: { dish: "bowl", base: "broth", color: "#f3ecd4", steam: true, on: ["noodle", "garlic", "zucchini", "noodle", "garlic", "scallion"] },
    },
    {
      id: "fishcake-udon", name: "어묵 우동", tags: ["noodle", "seafood"], kind: "soup", meals: ["lunch", "camping", "dinner"], delivery: "우동", time: 15, kcal: 430, protein: 17,
      ingredients: [
        { name: "우동면", amount: "1봉 (200g)" }, { name: "어묵", amount: "2장" }, { name: "대파", amount: "조금", opt: true },
        { name: "계란", amount: "1개", opt: true }, { name: "간장", amount: "2큰술 (쯔유가 있으면 3큰술)" }, { name: "설탕", amount: "1/2작은술" },
        { name: "국물용 멸치", amount: "5마리 (멸치 육수 팩 1개)" }, { name: "물", amount: "500ml (종이컵 3컵 조금 안 되게)" },
      ],
      steps: [
        "냄비에 물과 멸치를 넣고 7분 끓인 뒤 멸치를 건져요.",
        "간장, 설탕을 넣고 한입 크기로 썬 어묵을 넣어 3분 끓여요.",
        "우동면을 넣고 젓가락으로 살살 풀며 2분 끓여요.",
        "계란을 깨 넣고 대파를 올려요.",
      ],
      tip: "우동면에 든 스프가 있으면 간장 대신 그걸 써도 돼요.",
      art: { dish: "bowl", base: "broth", color: "#e9d3a0", steam: true, on: ["noodle", "fishcake", "noodle", "scallion", "noodle"] },
    },
    {
      id: "yaki-udon", name: "볶음우동", tags: ["noodle", "cabbage", "meat"], kind: "stirfry", meals: ["lunch", "camping", "dinner"], delivery: "볶음우동", time: 15, kcal: 520, protein: 20,
      ingredients: [
        { name: "우동면", amount: "1봉 (200g)" }, { name: "양배추", amount: "100g (한 줌 넉넉히)" }, { name: "베이컨", amount: "2줄 (얇게 썬 돼지고기도 좋아요)" },
        { name: "양파", amount: "1/4개" }, { name: "대파", amount: "조금", opt: true }, { name: "굴소스", amount: "1큰술" },
        { name: "간장", amount: "1큰술" }, { name: "설탕", amount: "1/2작은술" }, { name: "식용유", amount: "1작은술" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "우동면을 끓는 물에 1분 데쳐 풀고 물기를 빼요.",
        "양배추, 양파, 베이컨을 한입 크기로 썰어요.",
        "달군 팬에 기름을 두르고 베이컨과 양파를 2분 볶아요.",
        "양배추를 넣고 센 불에서 1분 볶아요.",
        "면, 굴소스, 간장, 설탕을 넣고 2분 볶아요. 후추와 대파를 뿌려요.",
      ],
      tip: "가쓰오부시가 있으면 마지막에 올려요.",
      art: { dish: "pan", on: ["noodle", "cabbage", "pork", "noodle", "scallion", "noodle"] },
    },
    {
      id: "ramen", name: "계란 파 라면", tags: ["noodle", "egg"], kind: "soup", meals: ["camping", "lunch"], time: 10, kcal: 590, protein: 17,
      ingredients: [
        { name: "라면", amount: "1봉" }, { name: "계란", amount: "1개" }, { name: "대파", amount: "반 대" },
        { name: "슬라이스 치즈", amount: "1장", opt: true }, { name: "콩나물", amount: "한 줌", opt: true }, { name: "물", amount: "500ml (봉지에 적힌 양보다 조금 적게)" },
      ],
      steps: [
        "냄비에 물을 끓이고 스프를 먼저 넣어요.",
        "면과 콩나물을 넣고 3분 끓여요. 면을 들었다 놨다 하면 더 쫄깃해요.",
        "계란을 깨 넣고 송송 썬 대파를 넉넉히 올려요.",
        "30초 뒤 불을 끄고 치즈를 올려요.",
      ],
      tip: "덜 짜게 먹으려면 스프를 2/3만 넣어요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#e9895f", steam: true, on: ["noodle", "scramble", "noodle", "scallion", "noodle", "scallion"] },
    },
    {
      id: "tomato-pasta", name: "토마토 파스타", tags: ["noodle"], kind: "bowl", meals: ["lunch", "dinner"], delivery: "토마토 파스타", time: 20, kcal: 540, protein: 18,
      ingredients: [
        { name: "스파게티 면", amount: "100g (500원 동전 굵기 한 줌)" }, { name: "토마토 소스", amount: "종이컵 1컵 (시판 파스타 소스 200g)" }, { name: "양파", amount: "1/4개" },
        { name: "베이컨", amount: "2줄", opt: true }, { name: "방울토마토", amount: "5개", opt: true }, { name: "버섯", amount: "한 줌", opt: true },
        { name: "올리브유", amount: "1큰술" }, { name: "다진 마늘", amount: "1작은술" }, { name: "소금", amount: "면 삶는 물에 1큰술" },
      ],
      steps: [
        "끓는 물 1리터에 소금 1큰술을 넣고 면을 봉지에 적힌 시간보다 1분 짧게 삶아요.",
        "면 삶은 물을 반 컵 따로 떠 둬요.",
        "팬에 올리브유, 마늘, 양파, 베이컨을 넣고 중불에서 3분 볶아요.",
        "토마토 소스와 방울토마토를 넣고 2분 끓여요.",
        "면과 면 삶은 물 3큰술을 넣고 1분 섞으며 볶아요.",
      ],
      tip: "면 삶은 물이 소스를 면에 착 붙게 해 줘요.",
      art: { dish: "plate", big: "nest", color: "#f0a078", top: ["tomato", "greens", "tomato"] },
    },
    {
      id: "aglio-olio", name: "알리오 올리오", tags: ["noodle"], kind: "bowl", meals: ["lunch", "dinner", "camping"], delivery: "알리오 올리오", time: 20, kcal: 520, protein: 14,
      ingredients: [
        { name: "스파게티 면", amount: "100g (500원 동전 굵기 한 줌)" }, { name: "통마늘", amount: "6쪽" }, { name: "새우", amount: "5마리", opt: true },
        { name: "올리브유", amount: "3큰술" }, { name: "페페론치노", amount: "3개 (청양고추 반 개도 돼요)" }, { name: "소금", amount: "면 삶는 물에 1큰술" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "끓는 물 1리터에 소금 1큰술을 넣고 면을 봉지 시간보다 1분 짧게 삶아요. 면 삶은 물을 반 컵 떠 둬요.",
        "마늘을 얇게 썰어요.",
        "차가운 팬에 올리브유와 마늘을 넣고 약불에서 3분, 노릇해질 때까지 익혀요.",
        "페페론치노와 새우를 넣고 1분 볶아요.",
        "면과 면 삶은 물 4큰술을 넣고 센 불에서 1분, 팬을 흔들며 섞어요.",
      ],
      tip: "마늘이 갈색이 되면 써요. 연한 금빛일 때 다음 재료를 넣어요.",
      art: { dish: "plate", big: "nest", color: "#f6e3a8", top: ["garlic", "shrimp", "garlic"] },
    },
    {
      id: "cream-pasta", name: "베이컨 크림 파스타", tags: ["noodle", "meat", "mushroom"], kind: "bowl", meals: ["dinner", "lunch"], delivery: "크림 파스타", time: 20, kcal: 680, protein: 24,
      ingredients: [
        { name: "스파게티 면", amount: "100g (500원 동전 굵기 한 줌)" }, { name: "베이컨", amount: "3줄" }, { name: "우유", amount: "200ml (종이컵 1컵 넉넉히)" },
        { name: "슬라이스 치즈", amount: "2장" }, { name: "버섯", amount: "한 줌", opt: true }, { name: "양파", amount: "1/4개" },
        { name: "버터", amount: "1큰술 (식용유도 돼요)" }, { name: "다진 마늘", amount: "1작은술" }, { name: "소금", amount: "조금" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "소금 넣은 끓는 물에 면을 봉지 시간보다 1분 짧게 삶아요.",
        "팬에 버터를 녹이고 마늘, 양파, 베이컨, 버섯을 3분 볶아요.",
        "우유를 붓고 끓어오르면 치즈를 넣어 녹여요.",
        "면을 넣고 약불에서 2분, 소스가 걸쭉해질 때까지 저어요.",
        "소금으로 간을 맞추고 후추를 뿌려요.",
      ],
      tip: "생크림 없이 우유와 치즈로 만들어서 덜 느끼해요.",
      art: { dish: "plate", big: "nest", color: "#fbf1d4", top: ["pork", "mushroom", "pork"] },
    },
    {
      id: "tteokbokki", name: "떡볶이", tags: ["noodle", "seafood"], kind: "stirfry", meals: ["lunch", "camping", "dinner"], delivery: "떡볶이", time: 20, kcal: 520, protein: 14,
      ingredients: [
        { name: "떡볶이 떡", amount: "200g (두 줌)" }, { name: "어묵", amount: "2장" }, { name: "대파", amount: "반 대" },
        { name: "양배추", amount: "한 줌", opt: true }, { name: "계란", amount: "삶은 것 1개", opt: true }, { name: "고추장", amount: "1큰술 반" },
        { name: "고춧가루", amount: "1/2큰술" }, { name: "설탕", amount: "1큰술 반" }, { name: "간장", amount: "1큰술" }, { name: "물", amount: "300ml (종이컵 1컵 반 넉넉히)" },
      ],
      steps: [
        "떡이 딱딱하면 물에 10분 담가 둬요. 어묵은 세모나게 썰어요.",
        "팬에 물, 고추장, 고춧가루, 설탕, 간장을 넣고 풀어 끓여요.",
        "끓으면 떡을 넣고 중불에서 5분 끓여요.",
        "어묵, 양배추, 대파를 넣고 국물이 걸쭉해질 때까지 4분 더 끓여요.",
        "삶은 계란을 넣어 국물에 굴려요.",
      ],
      tip: "바닥에 잘 눌어붙어요. 떡을 넣은 뒤로는 계속 저어 줘요.",
      art: { dish: "pan", on: ["tteok", "fishcake", "tteok", "scallion", "tteok"] },
    },
    {
      id: "tteokguk", name: "떡국", tags: ["noodle", "egg", "meat"], kind: "soup", meals: ["breakfast", "lunch", "dinner"], delivery: "떡국", time: 20, kcal: 450, protein: 20,
      ingredients: [
        { name: "떡국 떡", amount: "150g (두 줌)" }, { name: "국거리 소고기", amount: "50g", opt: true }, { name: "계란", amount: "1개" },
        { name: "대파", amount: "조금", opt: true }, { name: "김가루", amount: "조금", opt: true }, { name: "참기름", amount: "1작은술" },
        { name: "국간장", amount: "1큰술" }, { name: "다진 마늘", amount: "1/2작은술" }, { name: "소금", amount: "조금" }, { name: "물", amount: "500ml (사골 육수면 더 좋아요)" },
      ],
      steps: [
        "떡은 찬물에 10분 담가 둬요.",
        "냄비에 참기름을 두르고 소고기를 볶다가 물을 붓고 5분 끓여요.",
        "떡, 국간장, 마늘을 넣고 떡이 떠오를 때까지 4분 끓여요.",
        "푼 계란을 돌려 붓고 대파를 넣어요.",
        "소금으로 간을 맞추고 김가루를 올려요.",
      ],
      tip: "떡이 떠오르면 다 익은 거예요. 더 끓이면 퍼져요.",
      art: { dish: "bowl", base: "broth", color: "#f6efd6", steam: true, on: ["tteok", "scramble", "tteok", "seaweed", "tteok", "scallion"] },
    },
    {
      id: "mandu-soup", name: "만둣국", tags: ["meat", "egg"], kind: "soup", meals: ["lunch", "breakfast", "dinner"], delivery: "만둣국", time: 15, kcal: 400, protein: 18,
      ingredients: [
        { name: "만두", amount: "6개 (냉동 만두)" }, { name: "계란", amount: "1개" }, { name: "대파", amount: "조금", opt: true },
        { name: "김가루", amount: "조금", opt: true }, { name: "국간장", amount: "1큰술" }, { name: "다진 마늘", amount: "1/2작은술" },
        { name: "소금", amount: "조금" }, { name: "후추", amount: "조금" }, { name: "물", amount: "500ml (사골 육수면 더 좋아요)" },
      ],
      steps: [
        "냄비에 물, 국간장, 마늘을 넣고 끓여요.",
        "끓으면 냉동 만두를 그대로 넣고 5분 끓여요.",
        "만두가 떠오르면 푼 계란을 돌려 부어요.",
        "대파, 후추를 넣고 소금으로 간을 맞춘 뒤 김가루를 올려요.",
      ],
      tip: "만두를 넣고 처음 1분은 젓지 말아요. 피가 터져요.",
      art: { dish: "bowl", base: "broth", color: "#f6efd6", steam: true, on: ["dumpling", "scramble", "dumpling", "scallion", "dumpling"] },
    },

    // ───────── 밥 ─────────
    {
      id: "kimchi-fried-rice", name: "김치볶음밥", tags: ["kimchi", "rice", "egg"], kind: "bowl", meals: ["lunch", "breakfast", "camping"], delivery: "김치볶음밥", time: 15, kcal: 560, protein: 18,
      ingredients: [
        { name: "밥", amount: "1공기 (찬밥이 좋아요)" }, { name: "김치", amount: "100g (반 컵)" }, { name: "계란", amount: "1개" },
        { name: "햄", amount: "50g (참치캔·베이컨도 좋아요)", opt: true }, { name: "대파", amount: "조금", opt: true }, { name: "식용유", amount: "1큰술" },
        { name: "간장", amount: "1작은술" }, { name: "설탕", amount: "1/2작은술" }, { name: "참기름", amount: "1작은술" }, { name: "김가루", amount: "조금", opt: true },
      ],
      steps: [
        "김치와 햄을 잘게 썰어요.",
        "달군 팬에 기름과 대파를 넣어 30초 볶고, 김치·햄·설탕을 넣어 3분 볶아요.",
        "밥을 넣고 주걱을 세워 자르듯이 섞으며 3분 볶아요.",
        "간장을 팬 가장자리에 둘러 섞고 참기름을 넣어요.",
        "계란 프라이를 올리고 김가루를 뿌려요.",
      ],
      tip: "김치를 충분히 볶은 다음 밥을 넣어야 질척이지 않아요.",
      art: { dish: "bowl", base: "rice", color: "#f0b08c", big: "friedegg", on: ["kimchi", "seaweed"] },
    },
    {
      id: "egg-fried-rice", name: "계란 볶음밥", tags: ["rice", "egg"], kind: "bowl", meals: ["breakfast", "lunch", "camping"], delivery: "볶음밥", time: 10, kcal: 480, protein: 16,
      ingredients: [
        { name: "밥", amount: "1공기 (찬밥이 좋아요)" }, { name: "계란", amount: "2개" }, { name: "대파", amount: "반 대" },
        { name: "당근", amount: "조금", opt: true }, { name: "식용유", amount: "1큰술" }, { name: "간장", amount: "1작은술" },
        { name: "굴소스", amount: "1작은술 (빼도 돼요)" }, { name: "소금", amount: "한 꼬집" },
      ],
      steps: [
        "대파는 송송, 당근은 잘게 썰어요.",
        "달군 팬에 기름과 대파를 넣고 30초 볶아 파기름을 내요.",
        "계란을 깨 넣고 젓가락으로 휘저어 반쯤 익혀요.",
        "밥과 당근을 넣고 센 불에서 2분, 밥알이 흩어지게 볶아요.",
        "간장과 굴소스를 가장자리에 둘러 섞고 소금으로 간을 맞춰요.",
      ],
      tip: "갓 지은 밥은 한 김 식혀서 써요. 뜨거운 밥은 떡이 져요.",
      art: { dish: "bowl", base: "rice", color: "#f6e6b4", on: ["scramble", "scallion", "carrot", "scramble"] },
    },
    {
      id: "shrimp-fried-rice", name: "새우 볶음밥", tags: ["rice", "seafood", "egg"], kind: "bowl", meals: ["lunch", "dinner"], delivery: "새우볶음밥", time: 15, kcal: 510, protein: 26,
      ingredients: [
        { name: "밥", amount: "1공기" }, { name: "새우", amount: "8마리 (손질 냉동 새우)" }, { name: "계란", amount: "1개" },
        { name: "대파", amount: "반 대" }, { name: "당근", amount: "조금", opt: true }, { name: "식용유", amount: "1큰술" },
        { name: "굴소스", amount: "1작은술" }, { name: "간장", amount: "1작은술" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "새우는 해동해 물기를 닦고, 대파와 당근은 잘게 썰어요.",
        "달군 팬에 기름과 대파를 넣어 30초 볶고, 새우를 넣어 2분 볶아요.",
        "새우를 한쪽으로 밀고 계란을 깨 넣어 휘저어 익혀요.",
        "밥과 당근을 넣고 센 불에서 2분 볶아요.",
        "굴소스, 간장, 후추를 넣어 섞어요.",
      ],
      tip: "새우는 색이 분홍으로 변하면 다 익은 거예요.",
      art: { dish: "bowl", base: "rice", color: "#f6e6b4", on: ["shrimp", "scramble", "scallion", "shrimp"] },
    },
    {
      id: "omurice", name: "오므라이스", tags: ["rice", "egg"], kind: "bowl", meals: ["lunch", "dinner"], delivery: "오므라이스", time: 20, kcal: 590, protein: 20,
      ingredients: [
        { name: "밥", amount: "1공기" }, { name: "계란", amount: "2개" }, { name: "양파", amount: "1/4개" },
        { name: "햄", amount: "50g (비엔나 소시지도 좋아요)", opt: true }, { name: "당근", amount: "조금", opt: true }, { name: "케첩", amount: "2큰술 + 뿌릴 것" },
        { name: "식용유", amount: "1큰술" }, { name: "소금", amount: "두 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "양파, 햄, 당근을 잘게 다져요.",
        "팬에 기름 절반을 두르고 다진 재료를 2분 볶아요.",
        "밥, 케첩 2큰술, 소금 한 꼬집, 후추를 넣고 2분 볶아 그릇에 봉긋하게 담아요.",
        "계란에 소금 한 꼬집을 넣어 풀고, 약불 팬에 남은 기름을 둘러 넓게 부쳐요.",
        "윗면이 촉촉할 때 밥 위에 덮고 케첩을 뿌려요.",
      ],
      tip: "계란은 다 익기 전에 불을 꺼야 부드러워요.",
      art: { dish: "plate", big: "omurice", on: ["greens"] },
    },
    {
      id: "curry-rice", name: "카레라이스", tags: ["rice", "meat"], kind: "bowl", meals: ["lunch", "dinner", "camping"], delivery: "카레", time: 30, kcal: 580, protein: 22,
      ingredients: [
        { name: "카레 가루", amount: "2큰술 반 (고형 카레면 1조각)" }, { name: "밥", amount: "1공기" }, { name: "얇게 썬 돼지고기", amount: "80g (닭고기·소고기도 좋아요)" },
        { name: "감자", amount: "1/2개" }, { name: "양파", amount: "1/2개" }, { name: "당근", amount: "1/4개", opt: true },
        { name: "식용유", amount: "1작은술" }, { name: "물", amount: "300ml (종이컵 1컵 반 넉넉히)" },
      ],
      steps: [
        "감자, 양파, 당근을 한입 크기로 깍둑 썰어요.",
        "냄비에 기름을 두르고 고기와 양파를 3분 볶아요.",
        "감자, 당근을 넣어 1분 볶고 물을 부어요.",
        "끓으면 중불로 줄여 10분, 감자가 익을 때까지 끓여요.",
        "불을 약하게 하고 카레 가루를 풀어 3분 저으며 끓여요.",
        "밥 옆에 부어요.",
      ],
      tip: "하루 지난 카레가 더 맛있어요. 넉넉히 끓여 냉장고에 두세요.",
      art: { dish: "bowl", base: "broth", color: "#d9a441", steam: true, on: ["potato", "carrot", "pork", "tofu", "potato"] },
    },
    {
      id: "bibimbap", name: "비빔밥", tags: ["rice", "egg"], kind: "bowl", meals: ["lunch", "healthy", "dinner"], delivery: "비빔밥", time: 20, kcal: 520, protein: 19,
      ingredients: [
        { name: "밥", amount: "1공기" }, { name: "계란", amount: "1개" }, { name: "콩나물", amount: "한 줌 (숙주도 좋아요)" },
        { name: "애호박", amount: "1/4개" }, { name: "당근", amount: "1/4개" }, { name: "버섯", amount: "한 줌", opt: true },
        { name: "고추장", amount: "1큰술" }, { name: "참기름", amount: "1큰술" }, { name: "식용유", amount: "1작은술" }, { name: "소금", amount: "조금" },
      ],
      steps: [
        "콩나물을 끓는 물에 3분 데쳐 소금, 참기름 조금으로 무쳐요.",
        "애호박과 당근은 채 썰고 버섯은 찢어요.",
        "팬에 기름을 조금 두르고 당근, 애호박, 버섯을 따로따로 1분씩 소금 한 꼬집을 넣어 볶아요.",
        "계란 프라이를 반숙으로 부쳐요.",
        "밥 위에 나물을 돌려 담고 계란, 고추장, 참기름을 올려 비벼요.",
      ],
      tip: "냉장고에 남은 나물 반찬이 있으면 그걸로 충분해요.",
      art: { dish: "bowl", base: "rice", big: "friedegg", on: ["sprouts", "carrot", "zucchini", "mushroom"] },
    },
    {
      id: "sprouts-rice", name: "콩나물밥", tags: ["rice"], kind: "bowl", meals: ["healthy", "dinner", "lunch"], time: 25, kcal: 400, protein: 14,
      ingredients: [
        { name: "콩나물", amount: "150g (반 봉지)" }, { name: "밥", amount: "1공기" }, { name: "다진 돼지고기", amount: "50g", opt: true },
        { name: "대파", amount: "조금", opt: true }, { name: "간장", amount: "2큰술" }, { name: "고춧가루", amount: "1작은술" },
        { name: "참기름", amount: "1작은술" }, { name: "깨", amount: "조금" }, { name: "물", amount: "3큰술" },
      ],
      steps: [
        "냄비에 씻은 콩나물과 물 3큰술을 넣고 뚜껑을 덮어 중불에서 5분 쪄요.",
        "다진 고기가 있으면 팬에 볶아 간장 조금으로 간을 해요.",
        "간장, 고춧가루, 참기름, 깨, 다진 대파를 섞어 양념장을 만들어요.",
        "따뜻한 밥에 콩나물과 고기를 올려요.",
        "양념장을 조금씩 넣어 가며 비벼요.",
      ],
      tip: "쌀을 안칠 때 콩나물을 위에 올려 같이 밥을 지어도 돼요. 그때는 밥물을 조금 적게 잡아요.",
      art: { dish: "bowl", base: "rice", on: ["sprouts", "sprouts", "scallion", "sprouts"] },
    },
    {
      id: "gimbap", name: "김밥", tags: ["rice", "egg"], kind: "bowl", meals: ["lunch", "camping", "breakfast"], delivery: "김밥", time: 30, kcal: 480, protein: 16,
      ingredients: [
        { name: "김밥용 김", amount: "2장" }, { name: "밥", amount: "1공기 반" }, { name: "계란", amount: "2개" },
        { name: "단무지", amount: "2줄" }, { name: "당근", amount: "1/3개" }, { name: "햄", amount: "2줄 (어묵·참치도 좋아요)", opt: true },
        { name: "오이", amount: "1/4개", opt: true }, { name: "참기름", amount: "1큰술" }, { name: "소금", amount: "조금" }, { name: "식용유", amount: "1작은술" },
      ],
      steps: [
        "따뜻한 밥에 참기름과 소금 두 꼬집을 넣어 섞고 식혀요.",
        "계란은 도톰하게 부쳐 길게 썰고, 당근은 채 썰어 소금을 넣고 볶아요. 햄도 살짝 구워요.",
        "김의 거친 면을 위로 놓고 밥을 2/3만큼 얇게 펴요.",
        "밥 가운데에 재료를 나란히 올리고, 재료를 손가락으로 누르며 돌돌 말아요.",
        "이음매를 아래로 두고 2분 두었다가, 칼에 참기름을 묻혀 썰어요.",
      ],
      tip: "2줄 분량이에요. 밥을 얇게 펴야 터지지 않아요.",
      art: { dish: "plate", big: "gimbap" },
    },
    {
      id: "tuna-mayo-rice", name: "참치마요 덮밥", tags: ["rice", "seafood", "egg"], kind: "bowl", meals: ["lunch", "breakfast", "camping"], delivery: "참치마요", time: 10, kcal: 560, protein: 27,
      ingredients: [
        { name: "밥", amount: "1공기" }, { name: "참치캔", amount: "작은 것 1개 (100g)" }, { name: "계란", amount: "1개" },
        { name: "마요네즈", amount: "1큰술 반" }, { name: "간장", amount: "1큰술" }, { name: "설탕", amount: "1/2작은술" },
        { name: "김가루", amount: "넉넉히", opt: true }, { name: "식용유", amount: "1작은술" },
      ],
      steps: [
        "참치는 체에 받쳐 기름을 빼요.",
        "계란을 풀어 팬에 붓고 젓가락으로 저어 스크램블을 만들어요.",
        "간장과 설탕을 섞어 밥 위에 뿌려요.",
        "밥 위에 계란, 참치, 김가루를 올리고 마요네즈를 뿌려요.",
      ],
      tip: "불은 계란 익힐 때만 써요. 계란을 빼면 불 없이도 돼요.",
      art: { dish: "bowl", base: "rice", on: ["tuna", "scramble", "seaweed", "tuna", "scramble"] },
    },
    {
      id: "rice-balls", name: "참치 주먹밥", tags: ["rice", "seafood"], kind: "bowl", meals: ["breakfast", "camping", "lunch"], delivery: "주먹밥", time: 10, kcal: 450, protein: 20,
      ingredients: [
        { name: "밥", amount: "1공기" }, { name: "참치캔", amount: "작은 것 1개 (100g)" }, { name: "김가루", amount: "종이컵 반 컵" },
        { name: "마요네즈", amount: "1큰술" }, { name: "참기름", amount: "1작은술" }, { name: "소금", amount: "한 꼬집" }, { name: "깨", amount: "조금", opt: true },
      ],
      steps: [
        "참치는 기름을 꼭 짜서 마요네즈와 섞어요.",
        "따뜻한 밥에 참기름, 소금, 깨를 넣어 섞어요.",
        "밥을 손바닥에 펴고 가운데에 참치를 한 숟갈 올려 동그랗게 뭉쳐요.",
        "김가루에 굴려요.",
      ],
      tip: "손에 물을 살짝 묻히거나 비닐장갑을 끼면 밥이 달라붙지 않아요.",
      art: { dish: "plate", big: "patty", on: ["seaweed"] },
    },
    {
      id: "chicken-porridge", name: "닭죽", tags: ["rice", "meat"], kind: "bowl", meals: ["breakfast", "healthy", "dinner"], delivery: "닭죽", time: 25, kcal: 320, protein: 26,
      ingredients: [
        { name: "밥", amount: "반 공기 넉넉히" }, { name: "익힌 닭가슴살", amount: "100g (1팩)" }, { name: "당근", amount: "조금", opt: true },
        { name: "대파", amount: "조금", opt: true }, { name: "다진 마늘", amount: "1/2작은술" }, { name: "참기름", amount: "1작은술" },
        { name: "소금", amount: "조금" }, { name: "후추", amount: "조금" }, { name: "물", amount: "500ml (종이컵 3컵 조금 안 되게)" },
      ],
      steps: [
        "닭가슴살은 결대로 잘게 찢고, 당근은 잘게 다져요.",
        "냄비에 물, 밥, 마늘, 당근을 넣고 끓여요.",
        "끓으면 약불로 줄여 밥알이 퍼질 때까지 12분, 가끔 저으며 끓여요.",
        "닭가슴살을 넣고 3분 더 끓여요.",
        "소금으로 간을 하고 참기름, 대파, 후추를 올려요.",
      ],
      tip: "바닥에 눌어붙기 쉬워요. 뒤로 갈수록 자주 저어요.",
      art: { dish: "bowl", base: "porridge", steam: true, on: ["chicken", "carrot", "scallion", "chicken"] },
    },
    {
      id: "salmon-poke", name: "연어 포케", tags: ["seafood", "rice"], kind: "bowl", meals: ["healthy", "lunch"], delivery: "포케", time: 15, kcal: 480, protein: 27,
      ingredients: [
        { name: "연어", amount: "100g (횟감용)" }, { name: "밥", amount: "반 공기 넉넉히" }, { name: "샐러드 채소", amount: "한 줌" },
        { name: "오이", amount: "1/4개", opt: true }, { name: "양파", amount: "조금", opt: true }, { name: "간장", amount: "1큰술" },
        { name: "참기름", amount: "1작은술" }, { name: "식초", amount: "1작은술" }, { name: "깨", amount: "조금" }, { name: "고추냉이", amount: "조금 (빼도 돼요)" },
      ],
      steps: [
        "연어를 깍둑 썰어요.",
        "간장, 참기름, 식초, 고추냉이를 섞어 연어에 버무리고 5분 둬요.",
        "오이는 얇게, 양파는 채 썰어 찬물에 담갔다 건져요.",
        "그릇에 밥과 채소를 나란히 담고 연어를 올려요.",
        "남은 양념을 뿌리고 깨를 올려요.",
      ],
      tip: "꼭 '횟감용'이라고 적힌 연어를 사서 그날 먹어요.",
      art: { dish: "bowl", base: "rice", on: ["salmon", "greens", "cucumber", "salmon", "greens"] },
    },

    // ───────── 구이·전·샐러드·빵 ─────────
    {
      id: "chicken-salad", name: "닭가슴살 샐러드", tags: ["meat"], kind: "fresh", meals: ["healthy", "lunch", "dinner"], delivery: "샐러드", time: 10, kcal: 280, protein: 28,
      ingredients: [
        { name: "익힌 닭가슴살", amount: "100g (1팩)" }, { name: "샐러드 채소", amount: "80g (두 줌)" }, { name: "방울토마토", amount: "5개" },
        { name: "오이", amount: "1/4개", opt: true }, { name: "계란", amount: "삶은 것 1개", opt: true }, { name: "올리브유", amount: "1큰술" },
        { name: "식초", amount: "1큰술 (레몬즙·발사믹도 좋아요)" }, { name: "꿀", amount: "1작은술 (올리고당도 돼요)" }, { name: "소금", amount: "두 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "채소를 씻어 물기를 털고 한입 크기로 뜯어요.",
        "닭가슴살은 도톰하게 썰고, 방울토마토는 반으로 잘라요.",
        "올리브유, 식초, 꿀, 소금, 후추를 섞어 드레싱을 만들어요.",
        "접시에 채소를 깔고 닭가슴살, 토마토, 오이, 계란을 올려요.",
        "먹기 직전에 드레싱을 뿌려요.",
      ],
      tip: "채소 물기를 잘 털어야 드레싱이 싱거워지지 않아요.",
      art: { dish: "bowl", base: "salad", on: ["chicken", "greens", "tomato", "chicken", "cucumber", "greens"] },
    },
    {
      id: "rice-paper-rolls", name: "월남쌈", tags: ["seafood", "meat"], kind: "fresh", meals: ["healthy", "dinner", "lunch"], delivery: "월남쌈", time: 25, kcal: 350, protein: 26,
      ingredients: [
        { name: "라이스페이퍼", amount: "8장" }, { name: "새우", amount: "8마리 (익힌 닭가슴살도 좋아요)" }, { name: "파프리카", amount: "1/2개" },
        { name: "오이", amount: "1/2개" }, { name: "당근", amount: "1/4개", opt: true }, { name: "깻잎", amount: "8장", opt: true },
        { name: "양배추", amount: "한 줌", opt: true }, { name: "스위트 칠리소스", amount: "2큰술 (땅콩소스도 좋아요)" },
      ],
      steps: [
        "새우는 끓는 물에 2분 삶아 반으로 갈라요.",
        "파프리카, 오이, 당근, 양배추를 가늘게 채 썰어요.",
        "넓은 그릇에 따뜻한 물을 담아요.",
        "라이스페이퍼를 물에 5초 담갔다 꺼내 접시에 펴요.",
        "깻잎, 채소, 새우를 올리고 양옆을 접은 뒤 돌돌 말아요. 소스에 찍어 먹어요.",
      ],
      tip: "라이스페이퍼는 오래 담그면 찢어져요. 덜 풀린 듯할 때 꺼내요.",
      art: { dish: "plate", big: "roll", on: ["shrimp", "greens"] },
    },
    {
      id: "grilled-mackerel", name: "고등어 구이", tags: ["seafood"], kind: "pan", meals: ["dinner", "healthy", "breakfast"], delivery: "고등어구이", time: 15, kcal: 330, protein: 30,
      ingredients: [
        { name: "고등어", amount: "반 마리 (손질된 순살 1쪽)" }, { name: "식용유", amount: "1작은술" }, { name: "밀가루", amount: "1작은술 (빼도 돼요)" },
        { name: "소금", amount: "조금 (간고등어면 빼요)" }, { name: "레몬즙", amount: "조금 (빼도 돼요)" },
      ],
      steps: [
        "고등어를 키친타월로 눌러 물기를 꼼꼼히 닦아요.",
        "껍질 쪽에 칼집을 두세 번 넣고 밀가루를 얇게 묻혀요.",
        "달군 팬에 기름을 두르고 껍질 쪽부터 중불에서 4분 구워요.",
        "뒤집어서 3분 더 구워요.",
        "레몬즙을 뿌려요.",
      ],
      tip: "뚜껑 대신 종이 포일을 덮으면 기름이 덜 튀고 냄새도 덜 나요.",
      art: { dish: "plate", big: "fish", on: ["greens"] },
    },
    {
      id: "kimchi-jeon", name: "김치전", tags: ["kimchi"], kind: "pan", meals: ["lunch", "dinner", "camping"], delivery: "김치전", time: 15, kcal: 420, protein: 9,
      ingredients: [
        { name: "김치", amount: "150g (한 컵 조금 안 되게)" }, { name: "부침가루", amount: "종이컵 1컵" }, { name: "김치 국물", amount: "3큰술" },
        { name: "양파", amount: "1/4개", opt: true }, { name: "참치캔", amount: "반 캔", opt: true }, { name: "물", amount: "종이컵 2/3컵 (찬물)" }, { name: "식용유", amount: "2큰술" },
      ],
      steps: [
        "김치와 양파를 잘게 썰어요.",
        "그릇에 부침가루, 찬물, 김치 국물을 넣고 섞은 뒤 김치와 양파를 넣어요.",
        "달군 팬에 기름을 넉넉히 두르고 반죽을 얇게 펴요.",
        "중불에서 3분, 가장자리가 바삭해지면 뒤집어 3분 더 구워요.",
      ],
      tip: "찬물로 반죽하고 얇게 부쳐야 바삭해요.",
      art: { dish: "plate", big: "jeon", color: "#f0a078", on: ["kimchi"] },
    },
    {
      id: "seafood-pajeon", name: "해물파전", tags: ["seafood", "egg"], kind: "pan", meals: ["dinner", "camping", "lunch"], delivery: "해물파전", time: 20, kcal: 480, protein: 22,
      ingredients: [
        { name: "쪽파", amount: "한 줌 (대파 2대도 돼요)" }, { name: "해물 믹스", amount: "100g (냉동, 새우·오징어)" }, { name: "부침가루", amount: "종이컵 1컵" },
        { name: "계란", amount: "1개" }, { name: "물", amount: "종이컵 1컵 조금 안 되게 (찬물)" }, { name: "식용유", amount: "2큰술" },
        { name: "간장", amount: "1큰술 (찍어 먹을 것)" }, { name: "식초", amount: "1작은술" },
      ],
      steps: [
        "해물은 해동해서 물기를 꼭 닦고, 쪽파는 팬 길이에 맞춰 잘라요.",
        "부침가루와 찬물을 섞어 묽은 반죽을 만들어요.",
        "달군 팬에 기름을 두르고 쪽파를 나란히 깔아요. 그 위에 반죽을 고루 부어요.",
        "해물을 올리고, 푼 계란을 위에 둘러 부어요.",
        "중불에서 4분 굽고 뒤집어 3분 더 구워요. 간장과 식초를 섞어 찍어 먹어요.",
      ],
      tip: "해물에 물기가 남으면 기름이 튀고 전이 질어져요.",
      art: { dish: "plate", big: "jeon", top: ["shrimp", "scallion", "shrimp"] },
    },
    {
      id: "egg-sandwich", name: "계란 샌드위치", tags: ["egg"], kind: "bowl", meals: ["breakfast", "lunch", "camping"], delivery: "샌드위치", time: 20, kcal: 430, protein: 18,
      ingredients: [
        { name: "식빵", amount: "2장" }, { name: "계란", amount: "2개" }, { name: "마요네즈", amount: "1큰술 반" },
        { name: "오이", amount: "조금", opt: true }, { name: "설탕", amount: "한 꼬집" }, { name: "소금", amount: "한 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "계란을 끓는 물에 12분 삶아 찬물에 식혀 껍질을 까요.",
        "그릇에 계란을 넣고 포크로 굵게 으깨요.",
        "마요네즈, 설탕, 소금, 후추를 넣어 섞어요.",
        "식빵 한 장에 두툼하게 펴 바르고 얇게 썬 오이를 올려요.",
        "다른 식빵을 덮고 반으로 잘라요.",
      ],
      tip: "전날 계란을 삶아 두면 아침에 5분이면 돼요.",
      art: { dish: "plate", big: "toast" },
    },
    {
      id: "french-toast", name: "프렌치토스트", tags: ["egg"], kind: "pan", meals: ["breakfast", "camping"], delivery: "프렌치토스트", time: 10, kcal: 400, protein: 15,
      ingredients: [
        { name: "식빵", amount: "2장" }, { name: "계란", amount: "1개" }, { name: "우유", amount: "4큰술" },
        { name: "버터", amount: "1작은술 (식용유도 돼요)" }, { name: "설탕", amount: "1작은술" }, { name: "꿀", amount: "조금 (메이플 시럽·올리고당도 돼요)" },
      ],
      steps: [
        "넓은 그릇에 계란, 우유, 설탕을 넣고 잘 풀어요.",
        "식빵을 반으로 잘라 계란물에 앞뒤로 10초씩 적셔요.",
        "약불 팬에 버터를 녹이고 식빵을 올려 2분 구워요.",
        "뒤집어 2분 더 굽고 꿀을 뿌려요.",
      ],
      tip: "불이 세면 겉만 타고 속이 축축해요. 약불로 천천히.",
      art: { dish: "plate", big: "ftoast" },
    },

    // ───────── 양배추 ─────────
    {
      id: "cabbage-egg-stirfry", name: "양배추 계란 볶음", tags: ["cabbage", "egg"], kind: "stirfry", meals: ["breakfast", "lunch", "healthy"], time: 10, kcal: 230, protein: 14,
      ingredients: [
        { name: "양배추", amount: "150g (두 줌)" }, { name: "계란", amount: "2개" }, { name: "식용유", amount: "1작은술" },
        { name: "간장", amount: "1작은술" }, { name: "소금", amount: "한 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "양배추는 손가락 굵기로 썰고, 계란은 그릇에 풀어 소금을 넣어요.",
        "달군 팬에 기름을 두르고 양배추를 센 불에서 2분 볶아요.",
        "양배추를 한쪽으로 밀고, 빈자리에 계란을 부어 젓가락으로 저어 익혀요.",
        "다 같이 섞고 간장을 팬 가장자리에 둘러 30초 더 볶아요. 후추를 뿌리면 끝.",
      ],
      tip: "양배추 숨이 살짝 죽었을 때 불을 꺼야 아삭해요.",
      art: { dish: "pan", on: ["cabbage", "scramble"] },
    },
    {
      id: "cabbage-tuna-rice", name: "양배추 참치 덮밥", tags: ["cabbage"], kind: "bowl", meals: ["lunch", "healthy"], time: 15, kcal: 370, protein: 23,
      ingredients: [
        { name: "양배추", amount: "120g (한 줌 반)" }, { name: "참치캔", amount: "작은 것 1개 (100g)" }, { name: "밥", amount: "반 공기" },
        { name: "간장", amount: "1큰술" }, { name: "참기름", amount: "1작은술" }, { name: "물", amount: "2큰술" }, { name: "대파", amount: "조금", opt: true },
      ],
      steps: [
        "양배추는 한입 크기로 썰고, 참치는 체에 받쳐 기름을 빼요.",
        "팬에 양배추와 물 2큰술을 넣고 뚜껑을 덮어 중불에서 3분 익혀요.",
        "참치와 간장을 넣어 1분 볶고, 불을 끈 뒤 참기름을 둘러요.",
        "밥 위에 올리고 송송 썬 대파를 뿌려요.",
      ],
      tip: "기름 대신 물로 익혀서 가벼워요. 매콤하게 먹으려면 고춧가루를 조금 뿌려요.",
      art: { dish: "bowl", base: "rice", on: ["cabbage", "tuna", "scallion"] },
    },
    {
      id: "cabbage-steam-tofu-ssam", name: "양배추 찜과 두부 쌈장", tags: ["cabbage", "tofu"], kind: "steam", meals: ["dinner", "healthy"], time: 15, kcal: 220, protein: 14,
      ingredients: [
        { name: "양배추", amount: "200g (큰 잎 4~5장)" }, { name: "두부", amount: "100g (1/3모)" }, { name: "된장", amount: "1큰술" },
        { name: "참기름", amount: "1작은술" }, { name: "깨", amount: "1작은술", opt: true }, { name: "다진 마늘", amount: "조금" },
      ],
      steps: [
        "양배추 잎을 씻어 물기가 있는 채로 접시에 담고, 뚜껑을 덮어 전자레인지에 4분 돌려요.",
        "두부는 키친타월로 물기를 누른 뒤 숟가락으로 으깨요.",
        "으깬 두부에 된장, 참기름, 깨, 다진 마늘을 넣고 섞어요.",
        "한 김 식힌 양배추에 두부 쌈장을 올려 싸 먹어요.",
      ],
      tip: "뚜껑을 열 때 뜨거운 김이 올라와요. 몸 반대쪽부터 열어요.",
      art: { dish: "plate", big: "wrap" },
    },
    {
      id: "cabbage-jeon", name: "양배추 전", tags: ["cabbage", "egg"], kind: "pan", meals: ["lunch", "dinner", "healthy"], time: 15, kcal: 340, protein: 11,
      ingredients: [
        { name: "양배추", amount: "150g (두 줌)" }, { name: "계란", amount: "1개" }, { name: "부침가루", amount: "3큰술" },
        { name: "물", amount: "2큰술" }, { name: "식용유", amount: "1큰술" }, { name: "소금", amount: "한 꼬집" },
      ],
      steps: [
        "양배추를 가늘게 채 썰어요.",
        "그릇에 양배추, 계란, 부침가루, 물, 소금을 넣고 젓가락으로 섞어요.",
        "달군 팬에 기름을 두르고 반죽을 넓게 펴서 중불에서 3분 구워요.",
        "뒤집은 다음 뚜껑을 덮고 3분 더 구워요.",
      ],
      tip: "반죽이 뻑뻑해 보여도 괜찮아요. 굽는 동안 양배추에서 물이 나와요.",
      art: { dish: "plate", big: "jeon" },
    },
    {
      id: "cabbage-yogurt-slaw", name: "요거트 코울슬로", tags: ["cabbage"], kind: "fresh", meals: ["breakfast", "lunch", "healthy"], time: 10, kcal: 120, protein: 4,
      ingredients: [
        { name: "양배추", amount: "150g (두 줌)" }, { name: "당근", amount: "30g (엄지만큼)" }, { name: "플레인 요거트", amount: "3큰술" },
        { name: "마요네즈", amount: "1작은술" }, { name: "식초", amount: "1작은술" }, { name: "설탕", amount: "1/2작은술" }, { name: "소금", amount: "두 꼬집" },
      ],
      steps: [
        "양배추와 당근을 가늘게 채 썰어요.",
        "소금 두 꼬집을 뿌려 5분 두었다가 물기를 꼭 짜요.",
        "요거트, 마요네즈, 식초, 설탕을 넣고 버무려요.",
      ],
      tip: "냉장고에 30분 두면 맛이 더 어울려요. 이틀 안에 드세요.",
      art: { dish: "bowl", base: "salad", on: ["cabbage", "carrot", "cabbage"] },
    },
    {
      id: "cabbage-tofu-doenjang-soup", name: "양배추 두부 된장국", tags: ["cabbage", "tofu"], kind: "soup", meals: ["breakfast", "dinner", "healthy"], time: 15, kcal: 150, protein: 12,
      ingredients: [
        { name: "양배추", amount: "100g (한 줌 넉넉히)" }, { name: "두부", amount: "100g (1/3모)" }, { name: "된장", amount: "1큰술" },
        { name: "다진 마늘", amount: "1/2작은술" }, { name: "대파", amount: "조금", opt: true }, { name: "물", amount: "400ml (종이컵 2컵 넉넉히)" },
      ],
      steps: [
        "양배추는 한입 크기로, 두부는 깍둑 썰어요.",
        "냄비에 물을 붓고 된장을 풀어 끓여요.",
        "끓으면 양배추와 마늘을 넣고 중불에서 5분 끓여요.",
        "두부와 대파를 넣고 2분 더 끓이면 끝.",
      ],
      tip: "된장마다 짠 정도가 달라요. 싱거우면 조금씩 더 풀어요.",
      art: { dish: "bowl", base: "broth", color: "#e6c591", steam: true, on: ["cabbage", "tofu", "scallion"] },
    },
    {
      id: "cabbage-chicken-stirfry", name: "양배추 닭가슴살 볶음", tags: ["cabbage", "meat"], kind: "stirfry", meals: ["lunch", "dinner", "healthy"], time: 15, kcal: 210, protein: 25,
      ingredients: [
        { name: "양배추", amount: "150g (두 줌)" }, { name: "익힌 닭가슴살", amount: "100g (1팩)" }, { name: "굴소스", amount: "1작은술" },
        { name: "식용유", amount: "1작은술" }, { name: "다진 마늘", amount: "1/2작은술" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "양배추는 한입 크기로 썰고, 닭가슴살은 결대로 찢어요.",
        "달군 팬에 기름과 마늘을 넣고 10초 볶아 향을 내요.",
        "양배추를 넣고 센 불에서 2분 볶아요.",
        "닭가슴살과 굴소스를 넣어 1분 더 볶고 후추를 뿌려요.",
      ],
      tip: "굴소스가 없으면 간장 1작은술로 바꿔도 돼요.",
      art: { dish: "pan", on: ["cabbage", "chicken", "cabbage"] },
    },
    {
      id: "cabbage-egg-toast", name: "양배추 계란 토스트", tags: ["cabbage", "egg"], kind: "bowl", meals: ["breakfast", "lunch", "healthy", "camping"], delivery: "토스트", time: 10, kcal: 330, protein: 13,
      ingredients: [
        { name: "식빵", amount: "2장" }, { name: "양배추", amount: "60g (한 줌)" }, { name: "계란", amount: "1개" },
        { name: "식용유", amount: "1작은술" }, { name: "케첩", amount: "1작은술" }, { name: "소금", amount: "한 꼬집" },
      ],
      steps: [
        "양배추를 가늘게 채 썰어 계란, 소금과 섞어요.",
        "팬에 기름을 두르고 계란 반죽을 식빵 크기로 네모나게 부쳐요. 앞뒤로 2분씩.",
        "기름 없는 팬이나 토스터에 식빵을 노릇하게 구워요.",
        "식빵 사이에 계란 부침을 넣고 케첩을 발라요.",
      ],
      tip: "버터와 설탕을 빼서 길거리 토스트보다 가벼워요.",
      art: { dish: "plate", big: "toast" },
    },

    // ───────── 두부 ─────────
    {
      id: "tofu-panfry", name: "두부 부침과 양념장", tags: ["tofu"], kind: "pan", meals: ["dinner", "healthy"], time: 15, kcal: 240, protein: 14,
      ingredients: [
        { name: "두부", amount: "150g (반 모)" }, { name: "식용유", amount: "2작은술" }, { name: "간장", amount: "1큰술" },
        { name: "고춧가루", amount: "1/2작은술" }, { name: "참기름", amount: "1/2작은술" }, { name: "대파", amount: "조금", opt: true }, { name: "소금", amount: "한 꼬집" },
      ],
      steps: [
        "두부를 1cm 두께로 썰어 키친타월로 물기를 닦고 소금을 살짝 뿌려요.",
        "달군 팬에 기름을 두르고 중불에서 앞뒤로 3분씩 노릇하게 구워요.",
        "간장, 고춧가루, 참기름, 다진 대파를 섞어 양념장을 만들어요.",
        "구운 두부 위에 양념장을 조금씩 올려요.",
      ],
      tip: "물기를 잘 닦아야 기름이 튀지 않아요.",
      art: { dish: "plate", big: "slab" },
    },
    {
      id: "tofu-scramble", name: "두부 스크램블", tags: ["tofu", "egg"], kind: "stirfry", meals: ["breakfast", "healthy"], time: 10, kcal: 250, protein: 19,
      ingredients: [
        { name: "두부", amount: "150g (반 모)" }, { name: "계란", amount: "1개" }, { name: "방울토마토", amount: "5개" },
        { name: "올리브유", amount: "1작은술" }, { name: "대파", amount: "조금", opt: true }, { name: "소금", amount: "두 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "두부는 키친타월로 물기를 누르고, 방울토마토는 반으로 잘라요.",
        "달군 팬에 올리브유를 두르고 두부를 손으로 으깨 넣어요. 중불에서 3분 볶아 물기를 날려요.",
        "계란을 풀어 넣고 저으면서 1분 익혀요.",
        "방울토마토, 대파, 소금, 후추를 넣고 30초만 더 볶아요.",
      ],
      tip: "빵 위에 올려 먹어도 좋아요.",
      art: { dish: "pan", on: ["crumb", "scramble", "tomato", "crumb", "scallion"] },
    },
    {
      id: "soft-tofu-egg-steam", name: "순두부 계란찜", tags: ["tofu", "egg"], kind: "steam", meals: ["breakfast", "healthy"], time: 10, kcal: 250, protein: 20,
      ingredients: [
        { name: "순두부", amount: "반 봉 (175g)" }, { name: "계란", amount: "2개" }, { name: "물", amount: "3큰술" },
        { name: "소금", amount: "두 꼬집" }, { name: "대파", amount: "조금", opt: true }, { name: "참기름", amount: "1/2작은술" },
      ],
      steps: [
        "전자레인지용 그릇에 계란, 물, 소금을 넣고 잘 풀어요.",
        "순두부를 숟가락으로 큼직하게 떠 넣어요.",
        "접시를 살짝 걸쳐 덮고 전자레인지에 3분 돌려요.",
        "가운데가 덜 익었으면 30초씩 더 돌리고, 대파와 참기름을 올려요.",
      ],
      tip: "부풀어 넘칠 수 있어요. 그릇은 계란물 높이의 두 배쯤 되는 것으로.",
      art: { dish: "bowl", base: "custard", steam: true, on: ["crumb", "scallion", "crumb"] },
    },
    {
      id: "tofu-kimchi", name: "두부김치", tags: ["tofu", "kimchi", "meat"], kind: "stirfry", meals: ["dinner", "healthy", "camping"], delivery: "두부김치", time: 15, kcal: 230, protein: 15,
      ingredients: [
        { name: "두부", amount: "150g (반 모)" }, { name: "김치", amount: "100g (반 컵)" }, { name: "양파", amount: "1/4개" },
        { name: "얇게 썬 돼지고기", amount: "80g", opt: true }, { name: "식용유", amount: "1작은술" }, { name: "설탕", amount: "1/2작은술" }, { name: "참기름", amount: "1/2작은술" },
      ],
      steps: [
        "두부는 도톰하게 썰고, 김치와 양파는 한입 크기로 썰어요.",
        "달군 팬에 기름을 두르고 양파와 김치를 중불에서 3분 볶아요. 돼지고기를 넣을 때는 고기를 먼저 2분 볶아요.",
        "설탕을 넣고 1분 더 볶아 신맛을 줄여요.",
        "두부를 넣어 부서지지 않게 살살 섞으며 2분 데우고, 참기름을 둘러요.",
      ],
      tip: "김치가 많이 시면 설탕을 조금 더 넣어요. 두부를 따로 데워 볶은 김치를 곁들여도 돼요.",
      art: { dish: "pan", on: ["tofu", "kimchi"] },
    },
    {
      id: "tofu-soy-rice", name: "간장 두부 덮밥", tags: ["tofu"], kind: "bowl", meals: ["lunch", "healthy"], time: 15, kcal: 350, protein: 17,
      ingredients: [
        { name: "두부", amount: "150g (반 모)" }, { name: "밥", amount: "반 공기" }, { name: "간장", amount: "1큰술" },
        { name: "올리고당", amount: "1작은술" }, { name: "물", amount: "3큰술" }, { name: "식용유", amount: "1작은술" }, { name: "대파", amount: "조금", opt: true },
      ],
      steps: [
        "두부는 깍둑 썰어 키친타월로 물기를 닦아요.",
        "달군 팬에 기름을 두르고 두부를 굴려 가며 4분 노릇하게 구워요.",
        "간장, 올리고당, 물을 넣고 약불에서 2분 졸여요.",
        "밥 위에 올리고 대파를 뿌려요.",
      ],
      tip: "올리고당이 없으면 설탕 1/2작은술을 넣어요.",
      art: { dish: "bowl", base: "rice", on: ["tofuGold", "tofuGold", "scallion"] },
    },
    {
      id: "tofu-salad", name: "두부 샐러드", tags: ["tofu"], kind: "fresh", meals: ["lunch", "healthy"], delivery: "샐러드", time: 10, kcal: 220, protein: 16,
      ingredients: [
        { name: "두부", amount: "150g (반 모)" }, { name: "샐러드 채소", amount: "한 줌 (50g)" }, { name: "방울토마토", amount: "5개" },
        { name: "간장", amount: "1큰술" }, { name: "식초", amount: "1큰술" }, { name: "참기름", amount: "1작은술" }, { name: "깨", amount: "1작은술", opt: true },
      ],
      steps: [
        "두부는 깍둑 썰어 키친타월 위에 5분 올려 물기를 빼요.",
        "채소는 씻어 물기를 털고, 방울토마토는 반으로 잘라요.",
        "간장, 식초, 참기름, 깨를 섞어 드레싱을 만들어요.",
        "접시에 채소, 두부, 토마토를 담고 드레싱을 뿌려요.",
      ],
      tip: "따뜻하게 먹고 싶으면 두부만 전자레인지에 1분 데워요.",
      art: { dish: "plate", on: ["greens", "tofu", "tomato"] },
    },
    {
      id: "tofu-mushroom-soup", name: "두부 버섯 맑은국", tags: ["tofu", "mushroom"], kind: "soup", meals: ["breakfast", "dinner", "healthy"], time: 15, kcal: 150, protein: 15,
      ingredients: [
        { name: "두부", amount: "150g (반 모)" }, { name: "버섯", amount: "50g (한 줌, 아무 버섯)" }, { name: "국간장", amount: "1작은술" },
        { name: "다진 마늘", amount: "1/2작은술" }, { name: "대파", amount: "조금", opt: true }, { name: "소금", amount: "조금" }, { name: "물", amount: "400ml (종이컵 2컵 넉넉히)" },
      ],
      steps: [
        "두부는 깍둑 썰고, 버섯은 먹기 좋게 찢거나 썰어요.",
        "냄비에 물을 끓이고 버섯과 마늘을 넣어 3분 끓여요.",
        "두부와 국간장을 넣고 3분 더 끓여요.",
        "대파를 넣고, 싱거우면 소금으로 간을 맞춰요.",
      ],
      tip: "국간장이 없으면 소금만으로 간을 해도 맑고 깔끔해요.",
      art: { dish: "bowl", base: "broth", color: "#f3e8c6", steam: true, on: ["tofu", "mushroom", "scallion"] },
    },
    {
      id: "tofu-egg-patty", name: "두부 계란 동그랑땡", tags: ["tofu", "egg"], kind: "pan", meals: ["dinner", "healthy"], time: 20, kcal: 360, protein: 19,
      ingredients: [
        { name: "두부", amount: "150g (반 모)" }, { name: "계란", amount: "1개" }, { name: "당근", amount: "20g (조금)" },
        { name: "대파", amount: "조금", opt: true }, { name: "전분", amount: "1큰술" }, { name: "식용유", amount: "1큰술" }, { name: "소금", amount: "두 꼬집" },
      ],
      steps: [
        "두부를 키친타월로 감싸 꼭 짜서 물기를 빼고 으깨요.",
        "당근과 대파를 잘게 다져 두부, 계란, 전분, 소금과 섞어요.",
        "달군 팬에 기름을 두르고 반죽을 숟가락으로 떠서 동글납작하게 올려요.",
        "중약불에서 앞뒤로 3분씩 노릇하게 구워요.",
      ],
      tip: "반죽이 질어서 퍼지면 전분을 조금 더 넣어요.",
      art: { dish: "plate", big: "patty" },
    },

    // ───────── 계란 ─────────
    {
      id: "egg-steam-microwave", name: "전자레인지 계란찜", tags: ["egg"], kind: "steam", meals: ["breakfast", "healthy"], time: 10, kcal: 150, protein: 12,
      ingredients: [
        { name: "계란", amount: "2개" }, { name: "물", amount: "100ml (종이컵 반 컵 넉넉히)" }, { name: "소금", amount: "두 꼬집" },
        { name: "대파", amount: "조금", opt: true }, { name: "참기름", amount: "몇 방울" },
      ],
      steps: [
        "전자레인지용 그릇에 계란, 물, 소금을 넣고 포크로 잘 풀어요.",
        "접시를 살짝 걸쳐 덮고 전자레인지에 2분 돌려요.",
        "꺼내서 한 번 젓고 1분 더 돌려요.",
        "대파와 참기름을 올려요.",
      ],
      tip: "중간에 한 번 저어 주면 속까지 고르게 익어요.",
      art: { dish: "bowl", base: "custard", steam: true, on: ["scallion"] },
    },
    {
      id: "egg-tomato-stirfry", name: "토마토 계란 볶음", tags: ["egg"], kind: "stirfry", meals: ["breakfast", "lunch", "healthy"], time: 10, kcal: 260, protein: 13,
      ingredients: [
        { name: "계란", amount: "2개" }, { name: "토마토", amount: "1개" }, { name: "대파", amount: "조금", opt: true },
        { name: "식용유", amount: "2작은술" }, { name: "설탕", amount: "1/2작은술" }, { name: "소금", amount: "두 꼬집" },
      ],
      steps: [
        "토마토는 한입 크기로 썰고, 계란은 소금 한 꼬집을 넣어 풀어요.",
        "달군 팬에 기름 절반을 두르고 계란을 부어 크게 저어요. 반쯤 익으면 그릇에 덜어 둬요.",
        "같은 팬에 남은 기름, 대파, 토마토를 넣고 2분 볶아요.",
        "설탕과 남은 소금을 넣고, 계란을 다시 넣어 30초 섞어요.",
      ],
      tip: "계란을 먼저 덜어 두면 질겨지지 않고 부드러워요.",
      art: { dish: "pan", on: ["scramble", "tomato", "scramble", "tomato", "scallion"] },
    },
    {
      id: "egg-soy-rice", name: "간장 계란밥", tags: ["egg"], kind: "bowl", meals: ["breakfast", "lunch", "healthy"], time: 10, kcal: 390, protein: 15,
      ingredients: [
        { name: "밥", amount: "반 공기" }, { name: "계란", amount: "2개" }, { name: "식용유", amount: "1작은술" },
        { name: "간장", amount: "1작은술" }, { name: "참기름", amount: "1작은술" }, { name: "김가루", amount: "조금", opt: true },
      ],
      steps: [
        "달군 팬에 기름을 두르고 계란 2개를 깨 넣어 반숙으로 부쳐요.",
        "따뜻한 밥 위에 계란을 올려요.",
        "간장과 참기름을 두르고 김가루를 뿌려요.",
        "노른자를 터뜨려 비벼 먹어요.",
      ],
      tip: "밥을 줄인 대신 계란을 2개 올려 든든해요.",
      art: { dish: "bowl", base: "rice", big: "friedegg", on: ["seaweed"] },
    },
    {
      id: "egg-soft-boiled-salad", name: "반숙란 샐러드", tags: ["egg"], kind: "fresh", meals: ["breakfast", "lunch", "healthy"], delivery: "샐러드", time: 15, kcal: 210, protein: 13,
      ingredients: [
        { name: "계란", amount: "2개" }, { name: "샐러드 채소", amount: "60g (한 줌)" }, { name: "방울토마토", amount: "5개" },
        { name: "올리브유", amount: "1작은술" }, { name: "식초", amount: "1작은술" }, { name: "소금", amount: "두 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "끓는 물에 계란을 국자로 살살 넣고 7분 삶아요.",
        "찬물에 3분 담갔다가 껍질을 까서 반으로 잘라요.",
        "채소와 반으로 자른 방울토마토를 접시에 담아요.",
        "계란을 올리고 올리브유, 식초, 소금, 후추를 뿌려요.",
      ],
      tip: "7분이면 노른자가 촉촉한 반숙, 10분이면 완숙이에요.",
      art: { dish: "plate", big: "halfegg", on: ["greens", "tomato"] },
    },
    {
      id: "egg-veggie-roll", name: "채소 계란말이", tags: ["egg"], kind: "pan", meals: ["breakfast", "dinner", "healthy"], delivery: "계란말이", time: 15, kcal: 260, protein: 18,
      ingredients: [
        { name: "계란", amount: "3개" }, { name: "당근", amount: "20g (조금)" }, { name: "대파", amount: "조금", opt: true },
        { name: "식용유", amount: "1작은술" }, { name: "소금", amount: "두 꼬집" },
      ],
      steps: [
        "당근과 대파를 잘게 다져 계란, 소금과 섞어요.",
        "약불로 달군 팬에 기름을 키친타월로 얇게 펴 발라요.",
        "계란물을 절반 붓고, 윗면이 덜 익었을 때 한쪽부터 돌돌 말아요.",
        "만 계란을 한쪽으로 밀고, 남은 계란물을 부어 이어서 말아요.",
        "한 김 식힌 뒤 썰어요.",
      ],
      tip: "불이 세면 금방 타요. 처음부터 끝까지 약불로.",
      art: { dish: "plate", big: "roll" },
    },
    {
      id: "egg-soup", name: "계란국", tags: ["egg"], kind: "soup", meals: ["breakfast", "dinner", "healthy"], time: 10, kcal: 160, protein: 12,
      ingredients: [
        { name: "계란", amount: "2개" }, { name: "물", amount: "400ml (종이컵 2컵 넉넉히)" }, { name: "국간장", amount: "1작은술" },
        { name: "다진 마늘", amount: "1/2작은술" }, { name: "대파", amount: "조금", opt: true }, { name: "소금", amount: "조금" }, { name: "참기름", amount: "몇 방울" },
      ],
      steps: [
        "계란을 그릇에 풀어 둬요.",
        "냄비에 물, 국간장, 마늘을 넣고 끓여요.",
        "팔팔 끓으면 계란을 가늘게 돌려 붓고, 10초 동안 젓지 말고 둬요.",
        "대파를 넣고 소금으로 간을 맞춘 뒤 참기름을 떨어뜨려요.",
      ],
      tip: "계란을 붓자마자 저으면 국물이 탁해져요.",
      art: { dish: "bowl", base: "broth", color: "#f6e6b4", steam: true, on: ["scramble", "scallion", "scramble"] },
    },
    {
      id: "egg-oatmeal-porridge", name: "계란 오트밀 죽", tags: ["egg"], kind: "bowl", meals: ["breakfast", "healthy"], delivery: "죽", time: 10, kcal: 210, protein: 10,
      ingredients: [
        { name: "오트밀", amount: "30g (4큰술)" }, { name: "계란", amount: "1개" }, { name: "물", amount: "250ml (종이컵 1컵 반)" },
        { name: "간장", amount: "1/2작은술" }, { name: "대파", amount: "조금", opt: true }, { name: "참기름", amount: "1/2작은술" },
      ],
      steps: [
        "냄비에 오트밀과 물을 넣고 중불에서 저으며 3분 끓여요.",
        "걸쭉해지면 계란을 풀어 넣고 1분 저어요.",
        "간장으로 간을 하고 대파와 참기름을 올려요.",
      ],
      tip: "속이 불편한 날이나 아침에 좋아요.",
      art: { dish: "bowl", base: "porridge", steam: true, on: ["scramble", "scallion"] },
    },
    {
      id: "egg-zucchini-stirfry", name: "애호박 계란 볶음", tags: ["egg"], kind: "stirfry", meals: ["lunch", "dinner", "healthy"], time: 10, kcal: 200, protein: 13,
      ingredients: [
        { name: "계란", amount: "2개" }, { name: "애호박", amount: "1/3개 (100g)" }, { name: "식용유", amount: "1작은술" },
        { name: "소금", amount: "두 꼬집" }, { name: "대파", amount: "조금", opt: true },
      ],
      steps: [
        "애호박은 반달 모양으로 얇게 썰고, 계란은 소금 한 꼬집을 넣어 풀어요.",
        "달군 팬에 기름을 두르고 애호박과 남은 소금을 넣어 중불에서 2분 볶아요.",
        "계란을 붓고 10초 기다렸다가 크게 저어 익혀요.",
        "대파를 뿌려요.",
      ],
      tip: "애호박은 얇게 썰수록 빨리 익어요.",
      art: { dish: "pan", on: ["zucchini", "scramble"] },
    },

    // ───────── 샤브샤브·찜·버섯·고기 ─────────
    {
      id: "beef-mushroom-shabu", name: "버섯 소고기 샤브샤브", tags: ["meat", "mushroom"], kind: "soup", meals: ["dinner", "healthy", "camping"], delivery: "샤브샤브", time: 20, kcal: 320, protein: 31,
      ingredients: [
        { name: "샤브샤브용 소고기", amount: "120g" }, { name: "버섯", amount: "100g (두 줌)" }, { name: "배추", amount: "150g (잎 3~4장)" },
        { name: "숙주", amount: "100g (두 줌)", opt: true }, { name: "물", amount: "600ml (종이컵 3컵 넉넉히)" }, { name: "국간장", amount: "1큰술" },
        { name: "다시마", amount: "손바닥만 한 것 1장 (없으면 빼요)" }, { name: "찍어 먹는 간장", amount: "1큰술" }, { name: "식초", amount: "1큰술" },
      ],
      steps: [
        "냄비에 물과 다시마를 넣고 끓여요. 끓기 시작하면 다시마를 건지고 국간장을 넣어요.",
        "배추와 버섯을 한입 크기로 썰어요.",
        "끓는 국물에 배추와 버섯을 넣고 3분 익혀요.",
        "숙주와 소고기를 넣어요. 고기는 색이 변하면 바로 건져요.",
        "간장과 식초를 섞은 소스에 찍어 먹어요.",
      ],
      tip: "남은 국물에 밥 반 공기와 계란을 넣으면 죽으로 마무리할 수 있어요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#f3e8c6", steam: true, on: ["beef", "mushroom", "napa", "beef", "sprouts"] },
    },
    {
      id: "cabbage-pork-steam", name: "양배추 돼지고기 찜", tags: ["cabbage", "meat"], kind: "steam", meals: ["dinner", "healthy", "camping"], time: 20, kcal: 290, protein: 24,
      ingredients: [
        { name: "양배추", amount: "200g (큰 잎 4~5장)" }, { name: "얇게 썬 돼지고기", amount: "100g (앞다리·샤브샤브용)" }, { name: "숙주", amount: "100g (두 줌)", opt: true },
        { name: "물", amount: "3큰술" }, { name: "소금", amount: "한 꼬집" }, { name: "후추", amount: "조금" },
        { name: "간장", amount: "1큰술" }, { name: "식초", amount: "1큰술" }, { name: "참기름", amount: "1/2작은술" },
      ],
      steps: [
        "양배추를 큼직하게 썰어 넓은 팬이나 냄비에 깔아요.",
        "그 위에 숙주와 돼지고기를 펼쳐 올리고 소금, 후추를 뿌려요.",
        "물 3큰술을 넣고 뚜껑을 덮어 중불에서 8분 쪄요.",
        "고기에 분홍빛이 남아 있으면 2분 더 쪄요.",
        "간장, 식초, 참기름을 섞어 찍어 먹어요.",
      ],
      tip: "기름을 쓰지 않는 찜이라 담백해요.",
      art: { dish: "plate", on: ["cabbage", "pork", "sprouts"] },
    },
    {
      id: "tofu-mushroom-hotpot", name: "두부 버섯 전골", tags: ["tofu", "mushroom"], kind: "soup", meals: ["dinner", "healthy", "camping"], delivery: "버섯전골", time: 20, kcal: 180, protein: 18,
      ingredients: [
        { name: "두부", amount: "150g (반 모)" }, { name: "버섯", amount: "100g (두 줌)" }, { name: "배추", amount: "100g (잎 2~3장)" },
        { name: "대파", amount: "조금", opt: true }, { name: "물", amount: "500ml (종이컵 3컵 조금 안 되게)" }, { name: "국간장", amount: "1큰술" },
        { name: "다진 마늘", amount: "1/2작은술" }, { name: "고춧가루", amount: "1작은술 (빼도 돼요)" },
      ],
      steps: [
        "두부는 도톰하게, 배추와 버섯은 한입 크기로 썰어요.",
        "냄비에 배추, 버섯, 두부를 돌려 담아요.",
        "물, 국간장, 마늘, 고춧가루를 넣고 끓여요.",
        "끓으면 중불로 줄여 7분 더 끓이고 대파를 올려요.",
      ],
      tip: "고춧가루를 빼면 맑고 순한 맛이 돼요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#eecfa6", steam: true, on: ["tofu", "mushroom", "napa", "scallion"] },
    },
    {
      id: "mushroom-egg-rice", name: "버섯 계란 덮밥", tags: ["mushroom", "egg"], kind: "bowl", meals: ["lunch", "healthy"], time: 15, kcal: 370, protein: 19,
      ingredients: [
        { name: "버섯", amount: "100g (두 줌)" }, { name: "계란", amount: "2개" }, { name: "밥", amount: "반 공기" },
        { name: "양파", amount: "1/4개" }, { name: "간장", amount: "1큰술" }, { name: "올리고당", amount: "1작은술" }, { name: "물", amount: "4큰술" },
      ],
      steps: [
        "버섯은 찢거나 썰고, 양파는 채 썰어요. 계란은 가볍게 풀어요.",
        "팬에 물, 간장, 올리고당, 양파, 버섯을 넣고 중불에서 4분 끓여요.",
        "계란을 빙 둘러 붓고 뚜껑을 덮어 1분 익혀요.",
        "밥 위에 국물째 올려요.",
      ],
      tip: "계란이 촉촉할 때 불을 꺼야 부드러워요.",
      art: { dish: "bowl", base: "rice", on: ["mushroom", "scramble", "mushroom"] },
    },
    {
      id: "mushroom-garlic-stirfry", name: "버섯 마늘 볶음", tags: ["mushroom"], kind: "stirfry", meals: ["dinner", "healthy", "camping"], time: 10, kcal: 130, protein: 6,
      ingredients: [
        { name: "버섯", amount: "200g (네 줌)" }, { name: "다진 마늘", amount: "1작은술" }, { name: "올리브유", amount: "2작은술" },
        { name: "간장", amount: "1작은술" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "버섯을 먹기 좋게 찢거나 도톰하게 썰어요.",
        "달군 팬에 기름 없이 버섯을 올려 센 불에서 2분 구워 물기를 날려요.",
        "올리브유와 마늘을 넣고 1분 볶아요.",
        "간장을 두르고 후추를 뿌려요.",
      ],
      tip: "버섯은 씻지 말고 키친타월로 닦아야 질척이지 않아요.",
      art: { dish: "pan", on: ["mushroom"] },
    },
    {
      id: "chicken-cabbage-steam", name: "닭가슴살 양배추 찜", tags: ["meat", "cabbage"], kind: "steam", meals: ["lunch", "dinner", "healthy"], time: 15, kcal: 200, protein: 30,
      ingredients: [
        { name: "닭가슴살", amount: "120g (생것 1쪽)" }, { name: "양배추", amount: "100g (한 줌 넉넉히)" }, { name: "버섯", amount: "50g (한 줌)", opt: true },
        { name: "물", amount: "2큰술" }, { name: "소금", amount: "한 꼬집" }, { name: "후추", amount: "조금" },
        { name: "간장", amount: "1큰술" }, { name: "식초", amount: "1큰술" }, { name: "참기름", amount: "1/2작은술" },
      ],
      steps: [
        "닭가슴살을 0.5cm 두께로 얇게 저며 소금, 후추를 뿌려요.",
        "전자레인지용 그릇에 양배추와 버섯을 깔고, 닭가슴살을 겹치지 않게 올려요.",
        "물 2큰술을 뿌리고 접시를 걸쳐 덮어 전자레인지에 4분 돌려요.",
        "고기 속까지 하얗게 익었는지 확인해요. 덜 익었으면 1분 더 돌려요.",
        "간장, 식초, 참기름을 섞어 뿌려요.",
      ],
      tip: "얇게 저밀수록 빨리, 고르게 익어요.",
      art: { dish: "plate", on: ["cabbage", "chicken", "mushroom"] },
    },
    {
      id: "chicken-cucumber-salad", name: "닭가슴살 오이 냉채", tags: ["meat"], kind: "fresh", meals: ["lunch", "healthy"], time: 10, kcal: 180, protein: 24,
      ingredients: [
        { name: "익힌 닭가슴살", amount: "100g (1팩)" }, { name: "오이", amount: "1/2개" }, { name: "양파", amount: "1/4개", opt: true },
        { name: "간장", amount: "1큰술" }, { name: "식초", amount: "1큰술" }, { name: "설탕", amount: "1/2작은술" },
        { name: "다진 마늘", amount: "조금" }, { name: "참기름", amount: "1/2작은술" },
      ],
      steps: [
        "닭가슴살은 결대로 찢고, 오이는 채 썰어요.",
        "양파는 얇게 썰어 찬물에 3분 담가 매운맛을 빼요.",
        "간장, 식초, 설탕, 마늘, 참기름을 섞어요.",
        "재료를 모두 넣고 버무려요.",
      ],
      tip: "불을 쓰지 않아서 더운 날에 좋아요.",
      art: { dish: "plate", on: ["chicken", "cucumber"] },
    },
    {
      id: "soft-tofu-stew", name: "순두부찌개", tags: ["tofu", "egg"], kind: "soup", meals: ["dinner", "healthy", "camping"], delivery: "순두부찌개", time: 15, kcal: 330, protein: 24,
      ingredients: [
        { name: "순두부", amount: "1봉 (350g)" }, { name: "계란", amount: "1개" }, { name: "양파", amount: "1/4개" },
        { name: "대파", amount: "조금", opt: true }, { name: "고춧가루", amount: "1큰술" }, { name: "간장", amount: "1큰술" },
        { name: "참기름", amount: "1작은술" }, { name: "다진 마늘", amount: "1/2작은술" }, { name: "물", amount: "200ml (종이컵 1컵 넉넉히)" },
      ],
      steps: [
        "양파를 잘게 썰어요.",
        "냄비에 참기름, 양파, 마늘, 고춧가루를 넣고 약불에서 1분 볶아요.",
        "물과 간장을 넣고 끓여요.",
        "끓으면 순두부를 큼직하게 떠 넣고 3분 끓여요.",
        "계란을 깨 넣고 대파를 올려 1분 더 끓여요.",
      ],
      tip: "고춧가루는 금방 타요. 꼭 약불에서 볶아요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#eba585", steam: true, on: ["crumb", "scramble", "crumb", "scallion"] },
    },
    {
      id: "beef-sprouts-stirfry", name: "소고기 숙주 볶음", tags: ["meat"], kind: "stirfry", meals: ["lunch", "dinner", "healthy", "camping"], time: 10, kcal: 270, protein: 25,
      ingredients: [
        { name: "얇게 썬 소고기", amount: "100g (샤브샤브·불고기용)" }, { name: "숙주", amount: "200g (한 봉지 가까이)" }, { name: "대파", amount: "조금", opt: true },
        { name: "간장", amount: "1큰술" }, { name: "식용유", amount: "1작은술" }, { name: "다진 마늘", amount: "1/2작은술" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "숙주를 씻어 물기를 털어요.",
        "달군 팬에 기름과 마늘을 넣고 소고기를 센 불에서 1분 볶아요.",
        "고기 색이 변하면 숙주와 간장을 넣고 1분만 더 볶아요.",
        "대파와 후추를 뿌려요.",
      ],
      tip: "숙주는 오래 볶으면 물이 나와요. 1분이면 충분해요.",
      art: { dish: "pan", on: ["beef", "sprouts", "sprouts"] },
    },
    {
      id: "cabbage-steak-egg", name: "양배추 구이와 계란 프라이", tags: ["cabbage", "egg"], kind: "pan", meals: ["dinner", "healthy", "camping"], time: 15, kcal: 210, protein: 9,
      ingredients: [
        { name: "양배추", amount: "200g (1/8통, 심이 붙은 채로)" }, { name: "계란", amount: "1개" }, { name: "올리브유", amount: "2작은술" },
        { name: "소금", amount: "두 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "양배추를 심이 붙은 채로 3cm 두께로 썰어요. 심이 있어야 흩어지지 않아요.",
        "달군 팬에 올리브유를 두르고 양배추를 올려 소금을 뿌려요.",
        "뚜껑을 덮고 중불에서 앞뒤로 4분씩 구워요.",
        "팬 빈자리에 계란 프라이를 해서 양배추 위에 올리고 후추를 뿌려요.",
      ],
      tip: "가장자리가 갈색으로 눌어야 단맛이 나요.",
      art: { dish: "plate", big: "steak" },
    },

    // ───────── 캠핑요리 ─────────
    {
      id: "millefeuille-nabe", name: "밀푀유나베", tags: ["meat"], kind: "soup", meals: ["camping", "dinner", "healthy"], delivery: "밀푀유나베", time: 25, kcal: 300, protein: 29,
      ingredients: [
        { name: "샤브샤브용 소고기", amount: "120g" }, { name: "배추", amount: "200g (잎 5~6장)" }, { name: "깻잎", amount: "10장" },
        { name: "버섯", amount: "50g (한 줌)", opt: true }, { name: "물", amount: "400ml (종이컵 2컵 넉넉히)" }, { name: "국간장", amount: "1큰술" },
        { name: "찍어 먹는 간장", amount: "1큰술" }, { name: "식초", amount: "1큰술" },
      ],
      steps: [
        "배추 한 장 위에 깻잎, 소고기를 차례로 올려요. 이것을 3~4번 겹쳐 쌓아요.",
        "쌓은 것을 4~5cm 폭으로 썰어요.",
        "냄비 가장자리부터 자른 면이 위로 보이게 빙 둘러 세워 담고, 가운데에 버섯을 넣어요.",
        "물과 국간장을 붓고 뚜껑을 덮어 중불에서 10분 끓여요.",
        "간장과 식초를 섞은 소스에 찍어 먹어요.",
      ],
      tip: "집에서 미리 겹쳐 썰어 통에 담아 가면, 캠핑장에서는 끓이기만 하면 돼요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#f3e8c6", steam: true, on: ["napa", "beef", "greens", "napa", "beef"] },
    },
    {
      id: "fishcake-soup", name: "어묵탕", tags: ["seafood"], kind: "soup", meals: ["camping", "dinner"], delivery: "어묵탕", time: 15, kcal: 230, protein: 16,
      ingredients: [
        { name: "어묵", amount: "150g (사각 어묵 3~4장)" }, { name: "대파", amount: "조금", opt: true }, { name: "물", amount: "500ml (종이컵 3컵 조금 안 되게)" },
        { name: "국간장", amount: "1큰술" }, { name: "다진 마늘", amount: "1/2작은술" }, { name: "청양고추", amount: "1개 (빼도 돼요)" },
      ],
      steps: [
        "어묵을 한입 크기로 썰거나, 길게 접어 꼬치에 꽂아요.",
        "냄비에 물, 국간장, 마늘을 넣고 끓여요.",
        "끓으면 어묵을 넣고 중불에서 5분 끓여요.",
        "대파와 고추를 넣고 1분 더 끓여요.",
      ],
      tip: "어묵을 뜨거운 물에 한 번 헹구면 기름기가 빠져 국물이 깔끔해요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#f1dfb4", steam: true, on: ["fishcake", "scallion", "fishcake"] },
    },
    {
      id: "gambas", name: "감바스", tags: ["seafood"], kind: "stirfry", meals: ["camping", "dinner"], time: 15, kcal: 420, protein: 29,
      ingredients: [
        { name: "새우", amount: "150g (손질 냉동 새우 10~12마리)" }, { name: "통마늘", amount: "6쪽" }, { name: "방울토마토", amount: "5개", opt: true },
        { name: "올리브유", amount: "4큰술" }, { name: "소금", amount: "두 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "새우는 해동해서 키친타월로 물기를 닦고 소금, 후추를 뿌려요. 마늘은 얇게 썰어요.",
        "작은 팬에 올리브유와 마늘을 넣고, 약불에서 마늘이 노릇해질 때까지 3분 끓여요.",
        "새우를 넣고 앞뒤로 2분씩 익혀요.",
        "방울토마토를 넣고 1분 더 끓인 뒤 소금으로 간을 맞춰요.",
      ],
      tip: "칼로리는 기름을 절반쯤 먹는다고 보고 어림했어요. 빵을 찍어 먹으면 더 늘어요.",
      art: { dish: "pan", on: ["shrimp", "garlic", "tomato", "shrimp", "garlic"] },
    },
    {
      id: "sausage-veggie-stirfry", name: "소시지 채소 볶음", tags: ["meat"], kind: "stirfry", meals: ["camping", "lunch"], time: 15, kcal: 430, protein: 14,
      ingredients: [
        { name: "비엔나 소시지", amount: "100g (10~12개)" }, { name: "양파", amount: "1/2개" }, { name: "파프리카", amount: "1/2개" },
        { name: "케첩", amount: "2큰술" }, { name: "간장", amount: "1작은술" }, { name: "올리고당", amount: "1작은술" }, { name: "식용유", amount: "1작은술" },
      ],
      steps: [
        "소시지에 칼집을 2~3번 넣고, 양파와 파프리카는 한입 크기로 썰어요.",
        "달군 팬에 기름을 두르고 소시지를 중불에서 2분 볶아요.",
        "양파와 파프리카를 넣고 2분 더 볶아요.",
        "케첩, 간장, 올리고당을 넣고 1분 볶아 윤기를 내요.",
      ],
      tip: "소시지를 끓는 물에 30초 데치면 짠맛과 기름이 줄어요.",
      art: { dish: "pan", on: ["sausage", "pepper", "sausage", "scallion"] },
    },
    {
      id: "tuna-kimchi-stew", name: "참치 김치찌개", tags: ["kimchi", "seafood", "tofu"], kind: "soup", meals: ["camping", "dinner"], delivery: "김치찌개", time: 20, kcal: 280, protein: 30,
      ingredients: [
        { name: "김치", amount: "150g (한 컵 조금 안 되게)" }, { name: "참치캔", amount: "작은 것 1개 (100g)" }, { name: "두부", amount: "100g (1/3모)" },
        { name: "양파", amount: "1/4개" }, { name: "대파", amount: "조금", opt: true }, { name: "고춧가루", amount: "1작은술" },
        { name: "설탕", amount: "1/2작은술" }, { name: "물", amount: "300ml (종이컵 1컵 반 넉넉히)" },
      ],
      steps: [
        "김치와 양파는 한입 크기로, 두부는 도톰하게 썰어요.",
        "냄비에 김치, 양파, 고춧가루, 설탕, 물을 넣고 끓여요.",
        "끓으면 중불로 줄여 8분 끓여요.",
        "기름을 뺀 참치와 두부를 넣고 3분 더 끓인 뒤 대파를 올려요.",
      ],
      tip: "참치캔 기름을 한 숟갈 넣으면 국물이 더 진해져요.",
      art: { dish: "bowl", pot: true, base: "broth", color: "#eba585", steam: true, on: ["kimchi", "tofu", "tuna", "scallion"] },
    },
    {
      id: "pork-neck-grill", name: "목살 구이와 구운 채소", tags: ["meat", "mushroom"], kind: "pan", meals: ["camping", "dinner"], time: 20, kcal: 400, protein: 30,
      ingredients: [
        { name: "돼지 목살", amount: "150g (구이용 1장)" }, { name: "버섯", amount: "100g (두 줌)" }, { name: "양파", amount: "1/2개" },
        { name: "애호박", amount: "1/3개", opt: true }, { name: "소금", amount: "두 꼬집" }, { name: "후추", amount: "조금" },
      ],
      steps: [
        "목살은 굽기 20분 전에 꺼내 소금, 후추를 뿌려요.",
        "양파와 애호박은 1cm 두께로 썰고, 버섯은 통째로 준비해요.",
        "달군 팬이나 그릴에 목살을 올려 센 불에서 앞뒤로 3분씩 구워요.",
        "불을 줄이고 채소를 고기 옆에 올려, 고기 기름에 4분 구워요.",
        "고기를 한입 크기로 잘라 속까지 익었는지 확인해요.",
      ],
      tip: "자주 뒤집지 않아야 겉이 노릇하게 익어요.",
      art: { dish: "plate", big: "chop", on: ["mushroom", "zucchini"] },
    },
  ];

  const DATA = { MEALS: MEALS, INGREDIENTS: INGREDIENTS, KINDS: KINDS, PANTRY: PANTRY, RECIPES: RECIPES };
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
  else root.RECIPE_DATA = DATA;
})(typeof self !== "undefined" ? self : this);
