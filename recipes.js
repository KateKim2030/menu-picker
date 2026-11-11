// 레시피 내용만 모아 둔 파일. 화면 코드(index.html)와 따로라서 여기만 고치면 요리가 늘어난다.
//
// ── 요리 추가하는 법 ──────────────────────────────────────────────
// 아래 RECIPES 목록에 한 덩어리를 복사해 붙이고 내용을 바꾼다.
//   id          : 영어 소문자·숫자·줄표만, 다른 요리와 겹치면 안 됨
//   name        : 요리 이름
//   tags        : 들어가는 주재료. 첫 번째가 대표 재료. (INGREDIENTS 의 id 중에서)
//   kind        : 종류. (KINDS 의 id 중에서: steam 찜 / soup 국물 / stirfry 볶음 / bowl 한 그릇 / fresh 샐러드·무침 / pan 구이·전)
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
    { id: "cabbage", name: "양배추" },
    { id: "tofu", name: "두부" },
    { id: "egg", name: "계란" },
    { id: "mushroom", name: "버섯" },
    { id: "meat", name: "고기" },
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
    { id: "egg", name: "계란", group: "단백질", names: ["계란"] },
    { id: "tofu", name: "두부", group: "단백질", names: ["두부"] },
    { id: "softtofu", name: "순두부", group: "단백질", names: ["순두부"] },
    { id: "chicken", name: "닭가슴살", group: "단백질", names: ["닭가슴살", "익힌 닭가슴살"] },
    { id: "beef", name: "얇게 썬 소고기", group: "단백질", names: ["샤브샤브용 소고기", "얇게 썬 소고기"] },
    { id: "pork", name: "얇게 썬 돼지고기", group: "단백질", names: ["얇게 썬 돼지고기"] },
    { id: "tuna", name: "참치캔", group: "단백질", names: ["참치캔"] },
    { id: "rice", name: "밥", group: "밥·빵·기타", names: ["밥"] },
    { id: "bread", name: "식빵", group: "밥·빵·기타", names: ["식빵"] },
    { id: "oatmeal", name: "오트밀", group: "밥·빵·기타", names: ["오트밀"] },
    { id: "kimchi", name: "김치", group: "밥·빵·기타", names: ["김치"] },
    { id: "yogurt", name: "플레인 요거트", group: "밥·빵·기타", names: ["플레인 요거트"] },
    { id: "flour", name: "부침가루", group: "밥·빵·기타", names: ["부침가루"] },
  ];

  const RECIPES = [
    // ───────── 양배추 ─────────
    {
      id: "cabbage-egg-stirfry", name: "양배추 계란 볶음", tags: ["cabbage", "egg"], kind: "stirfry", time: 10, kcal: 230, protein: 14,
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
      id: "cabbage-tuna-rice", name: "양배추 참치 덮밥", tags: ["cabbage"], kind: "bowl", time: 15, kcal: 370, protein: 23,
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
      id: "cabbage-steam-tofu-ssam", name: "양배추 찜과 두부 쌈장", tags: ["cabbage", "tofu"], kind: "steam", time: 15, kcal: 220, protein: 14,
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
      id: "cabbage-jeon", name: "양배추 전", tags: ["cabbage", "egg"], kind: "pan", time: 15, kcal: 340, protein: 11,
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
      id: "cabbage-yogurt-slaw", name: "요거트 코울슬로", tags: ["cabbage"], kind: "fresh", time: 10, kcal: 120, protein: 4,
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
      id: "cabbage-tofu-doenjang-soup", name: "양배추 두부 된장국", tags: ["cabbage", "tofu"], kind: "soup", time: 15, kcal: 150, protein: 12,
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
      id: "cabbage-chicken-stirfry", name: "양배추 닭가슴살 볶음", tags: ["cabbage", "meat"], kind: "stirfry", time: 15, kcal: 210, protein: 25,
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
      id: "cabbage-egg-toast", name: "양배추 계란 토스트", tags: ["cabbage", "egg"], kind: "bowl", delivery: "토스트", time: 10, kcal: 330, protein: 13,
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
      id: "tofu-panfry", name: "두부 부침과 양념장", tags: ["tofu"], kind: "pan", time: 15, kcal: 240, protein: 14,
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
      id: "tofu-scramble", name: "두부 스크램블", tags: ["tofu", "egg"], kind: "stirfry", time: 10, kcal: 250, protein: 19,
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
      id: "soft-tofu-egg-steam", name: "순두부 계란찜", tags: ["tofu", "egg"], kind: "steam", time: 10, kcal: 250, protein: 20,
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
      id: "tofu-kimchi", name: "두부 김치 볶음", tags: ["tofu"], kind: "stirfry", delivery: "두부김치", time: 15, kcal: 230, protein: 15,
      ingredients: [
        { name: "두부", amount: "150g (반 모)" }, { name: "김치", amount: "100g (반 컵)" }, { name: "양파", amount: "1/4개" },
        { name: "식용유", amount: "1작은술" }, { name: "설탕", amount: "1/2작은술" }, { name: "참기름", amount: "1/2작은술" },
      ],
      steps: [
        "두부는 도톰하게 썰고, 김치와 양파는 한입 크기로 썰어요.",
        "달군 팬에 기름을 두르고 양파와 김치를 중불에서 3분 볶아요.",
        "설탕을 넣고 1분 더 볶아 신맛을 줄여요.",
        "두부를 넣어 부서지지 않게 살살 섞으며 2분 데우고, 참기름을 둘러요.",
      ],
      tip: "김치가 많이 시면 설탕을 조금 더 넣어요.",
      art: { dish: "pan", on: ["tofu", "kimchi"] },
    },
    {
      id: "tofu-soy-rice", name: "간장 두부 덮밥", tags: ["tofu"], kind: "bowl", time: 15, kcal: 350, protein: 17,
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
      id: "tofu-salad", name: "두부 샐러드", tags: ["tofu"], kind: "fresh", delivery: "샐러드", time: 10, kcal: 220, protein: 16,
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
      id: "tofu-mushroom-soup", name: "두부 버섯 맑은국", tags: ["tofu", "mushroom"], kind: "soup", time: 15, kcal: 150, protein: 15,
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
      id: "tofu-egg-patty", name: "두부 계란 동그랑땡", tags: ["tofu", "egg"], kind: "pan", time: 20, kcal: 360, protein: 19,
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
      id: "egg-steam-microwave", name: "전자레인지 계란찜", tags: ["egg"], kind: "steam", time: 10, kcal: 150, protein: 12,
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
      id: "egg-tomato-stirfry", name: "토마토 계란 볶음", tags: ["egg"], kind: "stirfry", time: 10, kcal: 260, protein: 13,
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
      id: "egg-soy-rice", name: "간장 계란밥", tags: ["egg"], kind: "bowl", time: 10, kcal: 390, protein: 15,
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
      id: "egg-soft-boiled-salad", name: "반숙란 샐러드", tags: ["egg"], kind: "fresh", delivery: "샐러드", time: 15, kcal: 210, protein: 13,
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
      id: "egg-veggie-roll", name: "채소 계란말이", tags: ["egg"], kind: "pan", delivery: "계란말이", time: 15, kcal: 260, protein: 18,
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
      id: "egg-soup", name: "계란국", tags: ["egg"], kind: "soup", time: 10, kcal: 160, protein: 12,
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
      id: "egg-oatmeal-porridge", name: "계란 오트밀 죽", tags: ["egg"], kind: "bowl", delivery: "죽", time: 10, kcal: 210, protein: 10,
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
      id: "egg-zucchini-stirfry", name: "애호박 계란 볶음", tags: ["egg"], kind: "stirfry", time: 10, kcal: 200, protein: 13,
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
      id: "beef-mushroom-shabu", name: "버섯 소고기 샤브샤브", tags: ["meat", "mushroom"], kind: "soup", delivery: "샤브샤브", time: 20, kcal: 320, protein: 31,
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
      id: "cabbage-pork-steam", name: "양배추 돼지고기 찜", tags: ["cabbage", "meat"], kind: "steam", time: 20, kcal: 290, protein: 24,
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
      id: "tofu-mushroom-hotpot", name: "두부 버섯 전골", tags: ["tofu", "mushroom"], kind: "soup", delivery: "버섯전골", time: 20, kcal: 180, protein: 18,
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
      id: "mushroom-egg-rice", name: "버섯 계란 덮밥", tags: ["mushroom", "egg"], kind: "bowl", time: 15, kcal: 370, protein: 19,
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
      id: "mushroom-garlic-stirfry", name: "버섯 마늘 볶음", tags: ["mushroom"], kind: "stirfry", time: 10, kcal: 130, protein: 6,
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
      id: "chicken-cabbage-steam", name: "닭가슴살 양배추 찜", tags: ["meat", "cabbage"], kind: "steam", time: 15, kcal: 200, protein: 30,
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
      id: "chicken-cucumber-salad", name: "닭가슴살 오이 냉채", tags: ["meat"], kind: "fresh", time: 10, kcal: 180, protein: 24,
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
      id: "soft-tofu-stew", name: "순두부찌개", tags: ["tofu", "egg"], kind: "soup", delivery: "순두부찌개", time: 15, kcal: 330, protein: 24,
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
      id: "beef-sprouts-stirfry", name: "소고기 숙주 볶음", tags: ["meat"], kind: "stirfry", time: 10, kcal: 270, protein: 25,
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
      id: "cabbage-steak-egg", name: "양배추 구이와 계란 프라이", tags: ["cabbage", "egg"], kind: "pan", time: 15, kcal: 210, protein: 9,
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
  ];

  const DATA = { INGREDIENTS: INGREDIENTS, KINDS: KINDS, PANTRY: PANTRY, RECIPES: RECIPES };
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
  else root.RECIPE_DATA = DATA;
})(typeof self !== "undefined" ? self : this);
