'use strict';
(function () {
  var CW = window.CW = window.CW || {};
  CW.seed = CW.seed || {};

  // 7업종 × 5단계 = 35칸 전수. 빈 조합이 구조적으로 없도록 전부 채운다.
  CW.seed.rooms = [
    // 필라테스
    { id: 's-r-pil-item',    cat: '필라테스', stage: '아이템 정하기', desc: '어떤 수업으로 시작할지 고르는 사람들', members: 18 },
    { id: 's-r-pil-money',   cat: '필라테스', stage: '자금 계획',     desc: '기구 살 돈, 대출로 할지 자기자금으로 할지 재는 사람들', members: 27 },
    { id: 's-r-pil-form',    cat: '필라테스', stage: '형태 정하기',   desc: '1인으로 갈지, 사람을 둘지 정하는 중인 사람들', members: 34 },
    { id: 's-r-pil-place',   cat: '필라테스', stage: '자리 찾기',     desc: '동네에서 자리 하나 골라보는 사람들', members: 22 },
    { id: 's-r-pil-permit',  cat: '필라테스', stage: '인허가·등록',   desc: '사업자 등록이랑 필요한 신고, 순서 맞춰보는 사람들', members: 11 },

    // 카페
    { id: 's-r-cafe-item',   cat: '카페', stage: '아이템 정하기', desc: '어떤 메뉴로 승부 볼지 정하는 사람들', members: 41 },
    { id: 's-r-cafe-money',  cat: '카페', stage: '자금 계획',     desc: '보증금이랑 초기 비용, 대출 낄지 고민하는 사람들', members: 37 },
    { id: 's-r-cafe-form',   cat: '카페', stage: '형태 정하기',   desc: '혼자 할지 같이 할지 정하는 사람들', members: 19 },
    { id: 's-r-cafe-place',  cat: '카페', stage: '자리 찾기',     desc: '동네 자리 하나 놓고 재보는 사람들', members: 53 },
    { id: 's-r-cafe-permit', cat: '카페', stage: '인허가·등록',   desc: '위생 신고, 사업자 등록 순서 맞춰보는 사람들', members: 14 },

    // 온라인 쇼핑몰
    { id: 's-r-shop-item',   cat: '온라인 쇼핑몰', stage: '아이템 정하기', desc: '뭘 팔지 아직 정하는 중인 사람들', members: 29 },
    { id: 's-r-shop-money',  cat: '온라인 쇼핑몰', stage: '자금 계획',     desc: '초기 재고비, 어디서 끌어올지 정하는 사람들', members: 44 },
    { id: 's-r-shop-form',   cat: '온라인 쇼핑몰', stage: '형태 정하기',   desc: '개인사업자로 갈지 법인으로 갈지 정하는 사람들', members: 16 },
    { id: 's-r-shop-place',  cat: '온라인 쇼핑몰', stage: '자리 찾기',     desc: '물류랑 창고 자리, 어디로 할지 보는 사람들', members: 8 },
    { id: 's-r-shop-permit', cat: '온라인 쇼핑몰', stage: '인허가·등록',   desc: '통신판매업 신고, 순서 확인하는 사람들', members: 23 },

    // 뷰티
    { id: 's-r-beauty-item',   cat: '뷰티', stage: '아이템 정하기', desc: '어떤 시술, 어떤 손님으로 갈지 정하는 사람들', members: 12 },
    { id: 's-r-beauty-money',  cat: '뷰티', stage: '자금 계획',     desc: '장비값이랑 월세, 자금 나눠 계산하는 사람들', members: 31 },
    { id: 's-r-beauty-form',   cat: '뷰티', stage: '형태 정하기',   desc: '혼자 할지 같이 할지 정하는 사람들', members: 17 },
    { id: 's-r-beauty-place',  cat: '뷰티', stage: '자리 찾기',     desc: '동네 자리 하나 놓고 재보는 사람들', members: 26 },
    { id: 's-r-beauty-permit', cat: '뷰티', stage: '인허가·등록',   desc: '면허랑 신고, 뭐부터 해야 하는지 맞춰보는 사람들', members: 39 },

    // 교육
    { id: 's-r-edu-item',   cat: '교육', stage: '아이템 정하기', desc: '어떤 과목, 어떤 나이대로 갈지 정하는 사람들', members: 21 },
    { id: 's-r-edu-money',  cat: '교육', stage: '자금 계획',     desc: '교재비, 대관료 계산 중인 사람들', members: 15 },
    { id: 's-r-edu-form',   cat: '교육', stage: '형태 정하기',   desc: '1인 강사로 갈지 사람을 둘지 정하는 사람들', members: 33 },
    { id: 's-r-edu-place',  cat: '교육', stage: '자리 찾기',     desc: '학원 자리, 동네 어디로 할지 보는 사람들', members: 9 },
    { id: 's-r-edu-permit', cat: '교육', stage: '인허가·등록',   desc: '교습소 등록, 순서 맞춰보는 사람들', members: 24 },

    // 앱·SaaS
    { id: 's-r-saas-item',   cat: '앱·SaaS', stage: '아이템 정하기', desc: '어떤 문제부터 풀지 정하는 사람들', members: 46 },
    { id: 's-r-saas-money',  cat: '앱·SaaS', stage: '자금 계획',     desc: '초기 개발비, 자기자금으로 버틸지 정하는 사람들', members: 13 },
    { id: 's-r-saas-form',   cat: '앱·SaaS', stage: '형태 정하기',   desc: '공동창업자를 둘지 혼자 갈지 정하는 사람들', members: 28 },
    { id: 's-r-saas-place',  cat: '앱·SaaS', stage: '자리 찾기',     desc: '사무실 없이 갈지, 자리 하나 잡을지 보는 사람들', members: 6 },
    { id: 's-r-saas-permit', cat: '앱·SaaS', stage: '인허가·등록',   desc: '법인 등록, 순서 맞춰보는 사람들', members: 55 },

    // 콘텐츠
    { id: 's-r-content-item',   cat: '콘텐츠', stage: '아이템 정하기', desc: '어떤 주제로 갈지 정하는 사람들', members: 7 },
    { id: 's-r-content-money',  cat: '콘텐츠', stage: '자금 계획',     desc: '장비값이랑 생활비, 자금 나눠보는 사람들', members: 35 },
    { id: 's-r-content-form',   cat: '콘텐츠', stage: '형태 정하기',   desc: '혼자 할지 팀을 꾸릴지 정하는 사람들', members: 25 },
    { id: 's-r-content-place',  cat: '콘텐츠', stage: '자리 찾기',     desc: '촬영 공간, 어디로 할지 보는 사람들', members: 32 },
    { id: 's-r-content-permit', cat: '콘텐츠', stage: '인허가·등록',   desc: '사업자 등록 시점, 맞춰보는 사람들', members: 42 }
  ];

  CW.seed.questions = CW.seed.questions || [];
  CW.seed.answers   = CW.seed.answers   || [];
})();
