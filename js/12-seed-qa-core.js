'use strict';
(function () {
  var CW = window.CW = window.CW || {};
  CW.seed = CW.seed || {};
  CW.seed.questions = CW.seed.questions || [];
  CW.seed.answers   = CW.seed.answers   || [];

  // ============================================================
  // 티어 A — 시연 경로: 필라테스 × 형태 정하기 (s-r-pil-form)
  // 질문 4개, 답변 5개씩 = 20
  // ============================================================

  CW.seed.questions.push(
    {
      id: 's-q-pil-form-1',
      roomId: 's-r-pil-form',
      title: '1인으로 갈지, 사람 두고 갈지',
      body: '재활 트레이너 10년차예요. 필라테스 열려고 하는데 처음부터 사람을 둘지, 저 혼자 할지 고민이에요.',
      options: [
        { key: 'solo', label: '1인으로 시작' },
        { key: 'hire', label: '사람 두고 시작' },
        { key: 'half', label: '반반으로' }
      ],
      author: { nick: '조용한 목요일', avatar: 2 },
      agoMin: 150,
      src: 'seed'
    },
    {
      id: 's-q-pil-form-2',
      roomId: 's-r-pil-form',
      title: '개인사업자로 할지 법인으로 할지',
      body: '매출이 크지 않은데 법인까지 필요할까요.',
      options: [
        { key: 'individual', label: '개인사업자' },
        { key: 'corp', label: '법인' },
        { key: 'undecided', label: '아직 안 정함' }
      ],
      author: { nick: '첫 번째 손님', avatar: 5 },
      agoMin: 620,
      src: 'seed'
    },
    {
      id: 's-q-pil-form-3',
      roomId: 's-r-pil-form',
      title: '기구를 새 걸로 살지 중고로 살지',
      body: '필라테스 리포머가 비싸서 중고도 알아보고 있어요.',
      options: [
        { key: 'new', label: '새 걸로' },
        { key: 'used', label: '중고로' },
        { key: 'lease', label: '렌탈로' }
      ],
      author: { nick: '월요일 아침', avatar: 3 },
      agoMin: 2200,
      src: 'seed'
    },
    {
      id: 's-q-pil-form-4',
      roomId: 's-r-pil-form',
      title: '강사 자격증 몇 개나 갖추고 시작했나요',
      body: '자격증을 많이 따고 시작하는 게 맞을지 궁금해요.',
      options: [
        { key: 'one', label: '하나만' },
        { key: 'several', label: '여러 개' },
        { key: 'ongoing', label: '운영하며 계속 취득' }
      ],
      author: { nick: '조용한 시작', avatar: 6 },
      agoMin: 3600,
      src: 'seed'
    }
  );

  CW.seed.answers.push(
    // s-q-pil-form-1 — 시연 스레드 (정확히 5개, quit 2개, 태그 조건 2개)
    { id: 's-a-pil-form-1-1', questionId: 's-q-pil-form-1', pickKey: 'solo', pickText: '혼자 다 하는 중',
      why: '반년 고민하다 1인으로 갔어요. 사람 쓰면 월 고정비가 무서워서요.',
      tags: ['자기자금', '서울'], quit: false, author: { nick: '창가 자리', avatar: 4 }, agoMin: 45, src: 'seed' },
    { id: 's-a-pil-form-1-2', questionId: 's-q-pil-form-1', pickKey: 'solo', pickText: '결국 접었어요',
      why: '6개월 하다 접었어요. 혼자 하니까 몸이 못 버티더라고요.',
      tags: ['10년차', '1인'], quit: true, author: { nick: '반지하 작업실', avatar: 1 }, agoMin: 112, src: 'seed' },
    { id: 's-a-pil-form-1-3', questionId: 's-q-pil-form-1', pickKey: 'hire', pickText: '강사 한 명 먼저',
      why: '직장 다니면서 준비했어요. 처음부터 강사 한 명은 뒀어요. 혼자는 못 채울 것 같아서요.',
      tags: ['직장 경험 있음', '경기'], quit: false, author: { nick: '늦은 저녁', avatar: 6 }, agoMin: 18, src: 'seed' },
    { id: 's-a-pil-form-1-4', questionId: 's-q-pil-form-1', pickKey: 'hire', pickText: '인건비 감당 못함',
      why: '사람 두고 시작했는데 인건비를 못 맞춰서 접었어요. 회원이 예상보다 적었어요.',
      tags: ['창업은 처음', '지방'], quit: true, author: { nick: '조용한 골목', avatar: 0 }, agoMin: 167, src: 'seed' },
    { id: 's-a-pil-form-1-5', questionId: 's-q-pil-form-1', pickKey: 'half', pickText: '가족이랑 반반',
      why: '배우자랑 반반으로 했어요. 저는 수업, 배우자는 데스크 봐요.',
      tags: ['가족과 함께', '경기'], quit: false, author: { nick: '낮은 목소리', avatar: 3 }, agoMin: 8, src: 'seed' },

    // s-q-pil-form-2
    { id: 's-a-pil-form-2-1', questionId: 's-q-pil-form-2', pickKey: 'individual', pickText: '개인사업자로 시작',
      why: '매출이 크지 않아서 개인사업자로 시작했어요. 나중에 바꾸면 된다고 하더라고요.',
      tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '두 번째 시도', avatar: 7 }, agoMin: 300, src: 'seed' },
    { id: 's-a-pil-form-2-2', questionId: 's-q-pil-form-2', pickKey: 'individual', pickText: '결국 정리했어요',
      why: '개인사업자로 시작했는데 세금 정리가 힘들어서 6개월 만에 접었어요.',
      tags: ['1인', '지방'], quit: true, author: { nick: '동네 산책', avatar: 2 }, agoMin: 980, src: 'seed' },
    { id: 's-a-pil-form-2-3', questionId: 's-q-pil-form-2', pickKey: 'corp', pickText: '법인으로 시작',
      why: '지원사업 받으려고 법인으로 시작했어요. 서류가 많긴 했어요.',
      tags: ['대출', '서울'], quit: false, author: { nick: '작은 간판', avatar: 4 }, agoMin: 75, src: 'seed' },
    { id: 's-a-pil-form-2-4', questionId: 's-q-pil-form-2', pickKey: 'undecided', pickText: '아직 고민 중',
      why: '아직 정하기 전이에요. 일단 개인으로 열고 더 알아보는 중이에요.',
      tags: ['직장 경험 있음', '경기'], quit: false, author: { nick: '오후 세시', avatar: 1 }, agoMin: 33, src: 'seed' },
    { id: 's-a-pil-form-2-5', questionId: 's-q-pil-form-2', pickKey: 'corp', pickText: '공동대표랑 갈렸어요',
      why: '법인까지 만들었는데 공동대표랑 의견이 안 맞아서 접었어요.',
      tags: ['지원금', '10년차'], quit: true, author: { nick: '구석 자리', avatar: 6 }, agoMin: 1450, src: 'seed' },

    // s-q-pil-form-3
    { id: 's-a-pil-form-3-1', questionId: 's-q-pil-form-3', pickKey: 'new', pickText: '새 기구로만',
      why: '새 기구로만 채웠어요. AS 걱정 없이 가고 싶었어요.',
      tags: ['자기자금', '서울'], quit: false, author: { nick: '조용한 주말', avatar: 5 }, agoMin: 410, src: 'seed' },
    { id: 's-a-pil-form-3-2', questionId: 's-q-pil-form-3', pickKey: 'used', pickText: '중고 반, 새 것 반',
      why: '중고로 반 넘게 채우고 나머지는 새 걸로 샀어요.',
      tags: ['대출', '경기'], quit: false, author: { nick: '서두르지 않는', avatar: 0 }, agoMin: 59, src: 'seed' },
    { id: 's-a-pil-form-3-3', questionId: 's-q-pil-form-3', pickKey: 'lease', pickText: '렌탈로 시작',
      why: '렌탈로 시작했는데 월 고정비가 부담돼서 접었어요.',
      tags: ['창업은 처음', '지방'], quit: true, author: { nick: '작은 화분', avatar: 2 }, agoMin: 3100, src: 'seed' },
    { id: 's-a-pil-form-3-4', questionId: 's-q-pil-form-3', pickKey: 'new', pickText: '지원금으로 채움',
      why: '지원금으로 새 기구 몇 대 채우고 시작했어요.',
      tags: ['지원금', '1인'], quit: false, author: { nick: '뒷골목 사장', avatar: 7 }, agoMin: 24, src: 'seed' },
    { id: 's-a-pil-form-3-5', questionId: 's-q-pil-form-3', pickKey: 'used', pickText: '고장 잦아 정리',
      why: '중고로 샀는데 고장이 잦아서 결국 정리했어요.',
      tags: ['10년차', '1인'], quit: true, author: { nick: '창밖 풍경', avatar: 4 }, agoMin: 1800, src: 'seed' },

    // s-q-pil-form-4
    { id: 's-a-pil-form-4-1', questionId: 's-q-pil-form-4', pickKey: 'one', pickText: '기본 하나만',
      why: '기본 자격증 하나만 따고 바로 시작했어요. 나머지는 하면서 배웠어요.',
      tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '느린 오후', avatar: 1 }, agoMin: 530, src: 'seed' },
    { id: 's-a-pil-form-4-2', questionId: 's-q-pil-form-4', pickKey: 'several', pickText: '미리 여러 개',
      why: '여러 자격증을 미리 따뒀어요. 회원들한테 신뢰를 주는 데 도움됐어요.',
      tags: ['10년차', '서울'], quit: false, author: { nick: '세 번째 창업', avatar: 3 }, agoMin: 88, src: 'seed' },
    { id: 's-a-pil-form-4-3', questionId: 's-q-pil-form-4', pickKey: 'ongoing', pickText: '운영하며 계속',
      why: '운영하면서 필요한 자격증을 계속 늘려가고 있어요.',
      tags: ['직장 경험 있음', '경기'], quit: false, author: { nick: '동네 단골', avatar: 5 }, agoMin: 14, src: 'seed' },
    { id: 's-a-pil-form-4-4', questionId: 's-q-pil-form-4', pickKey: 'one', pickText: '전문성 부족 지적',
      why: '자격증 하나로 시작했는데 전문성 부족하단 얘기 듣고 접었어요.',
      tags: ['1인', '지방'], quit: true, author: { nick: '작은 발걸음', avatar: 0 }, agoMin: 2600, src: 'seed' },
    { id: 's-a-pil-form-4-5', questionId: 's-q-pil-form-4', pickKey: 'several', pickText: '운영자금이 없어짐',
      why: '자격증 여러 개 따느라 돈을 다 쓰고 정작 운영자금이 없어서 접었어요.',
      tags: ['대출', '지방'], quit: true, author: { nick: '이른 아침', avatar: 2 }, agoMin: 4000, src: 'seed' }
  );

  // ============================================================
  // 티어 B — 두터운 곳. 5개 방, 질문 3개 · 답변 4개씩
  // ============================================================

  // --- 카페 × 자금 계획 (s-r-cafe-money) ---
  CW.seed.questions.push(
    {
      id: 's-q-cafe-money-1',
      roomId: 's-r-cafe-money',
      title: '보증금 얼마짜리 자리로 시작했나요',
      body: '권리금 없는 자리 찾다가 보증금 기준을 어디에 맞춰야 할지 모르겠어요.',
      options: [
        { key: 'low', label: '5천 안쪽' },
        { key: 'mid', label: '5천~1억' },
        { key: 'high', label: '1억 이상' }
      ],
      author: { nick: '조심스런 시작', avatar: 4 },
      agoMin: 95,
      src: 'seed'
    },
    {
      id: 's-q-cafe-money-2',
      roomId: 's-r-cafe-money',
      title: '초기비용이랑 월 운영비 어떻게 나눴나요',
      body: '장비값이랑 월세를 따로 계산해야 한다는데 감이 안 잡혀요.',
      options: [
        { key: 'split', label: '따로 계산' },
        { key: 'lump', label: '뭉뚱그려 계산' },
        { key: 'expert', label: '맡겨서 계산' }
      ],
      author: { nick: '옆 동네', avatar: 0 },
      agoMin: 1600,
      src: 'seed'
    },
    {
      id: 's-q-cafe-money-3',
      roomId: 's-r-cafe-money',
      title: '자기자금·대출·지원금 중 뭘로 시작했나요',
      body: '다 조금씩 섞어야 하나, 하나로 몰아야 하나 고민이에요.',
      options: [
        { key: 'own', label: '자기자금만' },
        { key: 'loan', label: '대출 위주' },
        { key: 'grant', label: '지원금 위주' },
        { key: 'mix', label: '섞어서' }
      ],
      author: { nick: '조용한 목요일', avatar: 1 },
      agoMin: 48,
      src: 'seed'
    }
  );

  CW.seed.answers.push(
    { id: 's-a-cafe-money-1-1', questionId: 's-q-cafe-money-1', pickKey: 'low', pickText: '5천 안쪽으로',
      why: '퇴사금으로 보증금 5천 안쪽 자리 잡았어요. 권리금 없는 자리라 마음이 편했어요.',
      tags: ['자기자금', '1인'], quit: false, author: { nick: '늦은 밤', avatar: 6 }, agoMin: 22, src: 'seed' },
    { id: 's-a-cafe-money-1-2', questionId: 's-q-cafe-money-1', pickKey: 'low', pickText: '결국 접었어요',
      why: '보증금 낮춰서 시작했는데 월세를 못 맞춰서 접었어요. 자리가 너무 안쪽이었어요.',
      tags: ['대출', '창업은 처음'], quit: true, author: { nick: '작은 손님', avatar: 1 }, agoMin: 780, src: 'seed' },
    { id: 's-a-cafe-money-1-3', questionId: 's-q-cafe-money-1', pickKey: 'mid', pickText: '대출 껴서 넓은 자리',
      why: '대출 좀 받아서 상권 좋은 자리로 갔어요. 손님이 확실히 더 오더라고요.',
      tags: ['대출', '서울'], quit: false, author: { nick: '조용한 결심', avatar: 3 }, agoMin: 11, src: 'seed' },
    { id: 's-a-cafe-money-1-4', questionId: 's-q-cafe-money-1', pickKey: 'high', pickText: '지원금 보태서',
      why: '지원금 받은 거 보태서 큰 자리로 시작했어요. 초기 부담은 있었어요.',
      tags: ['지원금', '경기'], quit: false, author: { nick: '나무 그늘', avatar: 5 }, agoMin: 340, src: 'seed' },

    { id: 's-a-cafe-money-2-1', questionId: 's-q-cafe-money-2', pickKey: 'split', pickText: '나눠서 정리',
      why: '초기비용이랑 월 운영비를 처음부터 나눠 적었어요. 안 그러면 나중에 헷갈리더라고요.',
      tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '늦은 오후', avatar: 2 }, agoMin: 66, src: 'seed' },
    { id: 's-a-cafe-money-2-2', questionId: 's-q-cafe-money-2', pickKey: 'lump', pickText: '결국 못 버텼어요',
      why: '뭉뚱그려 계산했다가 월세 낼 돈이 모자라서 3개월 만에 접었어요.',
      tags: ['대출', '지방'], quit: true, author: { nick: '작은 마당', avatar: 7 }, agoMin: 2900, src: 'seed' },
    { id: 's-a-cafe-money-2-3', questionId: 's-q-cafe-money-2', pickKey: 'split', pickText: '엑셀로 정리',
      why: '회사 다닐 때 엑셀 쓰던 습관으로 나눠서 정리했어요. 도움 많이 됐어요.',
      tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '조용한 걸음', avatar: 4 }, agoMin: 5, src: 'seed' },
    { id: 's-a-cafe-money-2-4', questionId: 's-q-cafe-money-2', pickKey: 'expert', pickText: '초반만 맡김',
      why: '세무사한테 초반만 맡겼어요. 혼자 하다 실수할까 봐요.',
      tags: ['지원금', '1인'], quit: false, author: { nick: '첫 봄', avatar: 6 }, agoMin: 210, src: 'seed' },

    { id: 's-a-cafe-money-3-1', questionId: 's-q-cafe-money-3', pickKey: 'own', pickText: '빚 없이 작게',
      why: '빚 지기 싫어서 자기자금만으로 시작했어요. 대신 자리를 작게 잡았어요.',
      tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '조용한 목요일', avatar: 3 }, agoMin: 15, src: 'seed' },
    { id: 's-a-cafe-money-3-2', questionId: 's-q-cafe-money-3', pickKey: 'loan', pickText: '대출로 넓게',
      why: '대출 위주로 받아서 자리를 넓게 잡았어요. 이자는 매달 부담이에요.',
      tags: ['대출', '서울'], quit: false, author: { nick: '반지하 작업실', avatar: 5 }, agoMin: 3, src: 'seed' },
    { id: 's-a-cafe-money-3-3', questionId: 's-q-cafe-money-3', pickKey: 'mix', pickText: '서류에 지쳤어요',
      why: '지원금이랑 대출 섞어서 시작했는데 서류 준비하다 지쳐서 접었어요.',
      tags: ['지원금', '지방'], quit: true, author: { nick: '늦은 저녁', avatar: 0 }, agoMin: 1250, src: 'seed' },
    { id: 's-a-cafe-money-3-4', questionId: 's-q-cafe-money-3', pickKey: 'grant', pickText: '가족한테 조금 빌림',
      why: '지원금 위주로 받고 나머지는 가족한테 빌렸어요. 부담이 덜했어요.',
      tags: ['지원금', '가족과 함께'], quit: false, author: { nick: '조용한 골목', avatar: 2 }, agoMin: 900, src: 'seed' }
  );

  // --- 앱·SaaS × 형태 정하기 (s-r-saas-form) ---
  CW.seed.questions.push(
    {
      id: 's-q-saas-form-1',
      roomId: 's-r-saas-form',
      title: '공동창업자 지분 어떻게 나눴나요',
      body: '개발은 같이 하는데 지분을 어떻게 나눠야 할지 감이 안 와요.',
      options: [
        { key: 'equal', label: '반반' },
        { key: 'lead', label: '대표가 더 많이' },
        { key: 'vest', label: '베스팅으로' }
      ],
      author: { nick: '낮은 목소리', avatar: 4 },
      agoMin: 520,
      src: 'seed'
    },
    {
      id: 's-q-saas-form-2',
      roomId: 's-r-saas-form',
      title: '법인을 언제 세웠나요',
      body: '출시 전에 세울지, 매출 나오고 세울지 고민이에요.',
      options: [
        { key: 'early', label: '출시 전에' },
        { key: 'later', label: '매출 나오고' },
        { key: 'never', label: '아직 안 세움' }
      ],
      author: { nick: '오후 세시', avatar: 0 },
      agoMin: 2500,
      src: 'seed'
    },
    {
      id: 's-q-saas-form-3',
      roomId: 's-r-saas-form',
      title: '혼자 갈지 공동창업자를 둘지',
      body: '기술은 자신 있는데 혼자 다 하기엔 벅찬 것 같아요.',
      options: [
        { key: 'solo', label: '혼자' },
        { key: 'cofounder', label: '공동창업자' },
        { key: 'contract', label: '외주로' }
      ],
      author: { nick: '작은 화분', avatar: 1 },
      agoMin: 640,
      src: 'seed'
    }
  );

  CW.seed.answers.push(
    { id: 's-a-saas-form-1-1', questionId: 's-q-saas-form-1', pickKey: 'equal', pickText: '일단 반반',
      why: '처음이라 그냥 반반으로 나눴어요. 나중에 후회할 수도 있다는 얘기는 들었어요.',
      tags: ['창업은 처음', '서울'], quit: false, author: { nick: '첫 번째 손님', avatar: 6 }, agoMin: 41, src: 'seed' },
    { id: 's-a-saas-form-1-2', questionId: 's-q-saas-form-1', pickKey: 'vest', pickText: '4년 베스팅',
      why: '베스팅 걸어서 4년에 나눠 받기로 했어요. 중간에 나가면 지분 정리가 쉬워요.',
      tags: ['직장 경험 있음', '경기'], quit: false, author: { nick: '두 번째 시도', avatar: 1 }, agoMin: 9, src: 'seed' },
    { id: 's-a-saas-form-1-3', questionId: 's-q-saas-form-1', pickKey: 'lead', pickText: '사이가 틀어졌어요',
      why: '대표가 더 갖기로 했는데 그것 때문에 사이가 틀어져서 접었어요.',
      tags: ['대출', '지방'], quit: true, author: { nick: '동네 산책', avatar: 3 }, agoMin: 1900, src: 'seed' },
    { id: 's-a-saas-form-1-4', questionId: 's-q-saas-form-1', pickKey: 'equal', pickText: '역할을 문서로',
      why: '반반으로 하고 대신 역할을 문서로 정리해 뒀어요.',
      tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '작은 간판', avatar: 5 }, agoMin: 130, src: 'seed' },

    { id: 's-a-saas-form-2-1', questionId: 's-q-saas-form-2', pickKey: 'early', pickText: '투자 얘기 나와서',
      why: '투자 얘기가 오가서 출시 전에 법인부터 세웠어요.',
      tags: ['자기자금', '서울'], quit: false, author: { nick: '구석 자리', avatar: 2 }, agoMin: 19, src: 'seed' },
    { id: 's-a-saas-form-2-2', questionId: 's-q-saas-form-2', pickKey: 'later', pickText: '매출 보고 결정',
      why: '매출 나오는 거 보고 세웠어요. 그전엔 개인으로 충분했어요.',
      tags: ['직장 경험 있음', '1인'], quit: false, author: { nick: '월요일 아침', avatar: 6 }, agoMin: 57, src: 'seed' },
    { id: 's-a-saas-form-2-3', questionId: 's-q-saas-form-2', pickKey: 'never', pickText: '준비하다 지쳤어요',
      why: '법인 준비하다 지쳐서 서비스 자체를 접었어요.',
      tags: ['창업은 처음', '경기'], quit: true, author: { nick: '조용한 주말', avatar: 4 }, agoMin: 3400, src: 'seed' },
    { id: 's-a-saas-form-2-4', questionId: 's-q-saas-form-2', pickKey: 'early', pickText: '지원사업 때문에',
      why: '지원사업 신청하려면 법인이 필요해서 서둘러 세웠어요.',
      tags: ['지원금', '서울'], quit: false, author: { nick: '서두르지 않는', avatar: 7 }, agoMin: 270, src: 'seed' },

    { id: 's-a-saas-form-3-1', questionId: 's-q-saas-form-3', pickKey: 'cofounder', pickText: '동료랑 시작',
      why: '같이 다니던 동료랑 시작했어요. 기획이랑 개발을 나눠 맡아요.',
      tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '뒷골목 사장', avatar: 3 }, agoMin: 27, src: 'seed' },
    { id: 's-a-saas-form-3-2', questionId: 's-q-saas-form-3', pickKey: 'solo', pickText: '번아웃 왔어요',
      why: '혼자 다 하다가 번아웃 와서 반년 만에 접었어요.',
      tags: ['1인', '지방'], quit: true, author: { nick: '창밖 풍경', avatar: 5 }, agoMin: 2100, src: 'seed' },
    { id: 's-a-saas-form-3-3', questionId: 's-q-saas-form-3', pickKey: 'contract', pickText: '개발은 외주로',
      why: '저는 기획만 하고 개발은 외주 줬어요. 속도는 느렸어요.',
      tags: ['자기자금', '1인'], quit: false, author: { nick: '조용한 시작', avatar: 0 }, agoMin: 73, src: 'seed' },
    { id: 's-a-saas-form-3-4', questionId: 's-q-saas-form-3', pickKey: 'cofounder', pickText: '서로 배워가는 중',
      why: '둘 다 처음이라 서로 배워가면서 하고 있어요.',
      tags: ['창업은 처음', '경기'], quit: false, author: { nick: '느린 오후', avatar: 2 }, agoMin: 6, src: 'seed' }
  );

  // --- 필라테스 × 자리 찾기 (s-r-pil-place) ---
  CW.seed.questions.push(
    {
      id: 's-q-pil-place-1',
      roomId: 's-r-pil-place',
      title: '1층으로 갈지 2층 이상으로 갈지',
      body: '1층은 월세가 비싸고 2층은 사람들이 잘 안 올라올까 걱정이에요.',
      options: [
        { key: 'first', label: '1층' },
        { key: 'upper', label: '2층 이상' },
        { key: 'basement', label: '지하' }
      ],
      author: { nick: '세 번째 창업', avatar: 4 },
      agoMin: 380,
      src: 'seed'
    },
    {
      id: 's-q-pil-place-2',
      roomId: 's-r-pil-place',
      title: '권리금 있는 자리 vs 없는 자리',
      body: '권리금 주더라도 목 좋은 데로 갈지 고민이에요.',
      options: [
        { key: 'premium', label: '권리금 주고' },
        { key: 'none', label: '권리금 없는 곳' },
        { key: 'unsure', label: '아직 못 정함' }
      ],
      author: { nick: '늦은 밤', avatar: 0 },
      agoMin: 960,
      src: 'seed'
    },
    {
      id: 's-q-pil-place-3',
      roomId: 's-r-pil-place',
      title: '동네 상권 조사 어떻게 했나요',
      body: '그냥 걸어 다니면서 보는 걸로 충분할까요.',
      options: [
        { key: 'walk', label: '직접 돌아봄' },
        { key: 'data', label: '자료 찾아봄' },
        { key: 'ask', label: '동네 사람한테 물어봄' }
      ],
      author: { nick: '늦은 오후', avatar: 1 },
      agoMin: 70,
      src: 'seed'
    }
  );

  CW.seed.answers.push(
    { id: 's-a-pil-place-1-1', questionId: 's-q-pil-place-1', pickKey: 'upper', pickText: '2층으로 갔어요',
      why: '2층으로 갔어요. 월세 아낀 만큼 간판을 크게 달았더니 괜찮았어요.',
      tags: ['자기자금', '1인'], quit: false, author: { nick: '동네 단골', avatar: 6 }, agoMin: 31, src: 'seed' },
    { id: 's-a-pil-place-1-2', questionId: 's-q-pil-place-1', pickKey: 'first', pickText: '대출 껴서 1층',
      why: '1층 아니면 안 온다는 말 듣고 대출 껴서 1층 잡았어요.',
      tags: ['대출', '서울'], quit: false, author: { nick: '작은 발걸음', avatar: 1 }, agoMin: 12, src: 'seed' },
    { id: 's-a-pil-place-1-3', questionId: 's-q-pil-place-1', pickKey: 'basement', pickText: '습기 문제로 접음',
      why: '지하로 갔다가 습기랑 접근성 문제로 반년 만에 접었어요.',
      tags: ['지방', '창업은 처음'], quit: true, author: { nick: '이른 아침', avatar: 3 }, agoMin: 2050, src: 'seed' },
    { id: 's-a-pil-place-1-4', questionId: 's-q-pil-place-1', pickKey: 'upper', pickText: '엘리베이터가 없어서',
      why: '2층인데 엘리베이터가 없어서 회원이 안 늘어 접었어요.',
      tags: ['10년차', '경기'], quit: true, author: { nick: '조심스런 시작', avatar: 5 }, agoMin: 3200, src: 'seed' },

    { id: 's-a-pil-place-2-1', questionId: 's-q-pil-place-2', pickKey: 'none', pickText: '권리금 아낀 만큼 기구',
      why: '권리금 없는 자리로 가고 그 돈으로 기구를 더 샀어요.',
      tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '작은 손님', avatar: 2 }, agoMin: 44, src: 'seed' },
    { id: 's-a-pil-place-2-2', questionId: 's-q-pil-place-2', pickKey: 'premium', pickText: '유동인구 많은 곳',
      why: '권리금 주고 유동인구 많은 자리로 갔어요. 회수는 됐어요.',
      tags: ['대출', '서울'], quit: false, author: { nick: '조용한 결심', avatar: 6 }, agoMin: 17, src: 'seed' },
    { id: 's-a-pil-place-2-3', questionId: 's-q-pil-place-2', pickKey: 'none', pickText: '자리가 너무 외졌어요',
      why: '권리금 아꼈는데 자리가 너무 외져서 결국 접었어요.',
      tags: ['1인', '지방'], quit: true, author: { nick: '나무 그늘', avatar: 4 }, agoMin: 2750, src: 'seed' },
    { id: 's-a-pil-place-2-4', questionId: 's-q-pil-place-2', pickKey: 'premium', pickText: '지원금으로 메꿈',
      why: '권리금은 지원금으로 메꿨어요. 다행히 자리가 좋았어요.',
      tags: ['지원금', '경기'], quit: false, author: { nick: '옆 동네', avatar: 7 }, agoMin: 520, src: 'seed' },

    { id: 's-a-pil-place-3-1', questionId: 's-q-pil-place-3', pickKey: 'walk', pickText: '몇 주간 돌아봄',
      why: '몇 주 동안 아침저녁으로 걸어 다니면서 유동인구를 봤어요.',
      tags: ['자기자금', '서울'], quit: false, author: { nick: '작은 마당', avatar: 3 }, agoMin: 29, src: 'seed' },
    { id: 's-a-pil-place-3-2', questionId: 's-q-pil-place-3', pickKey: 'ask', pickText: '부동산에 물어봄',
      why: '근처 부동산이랑 동네 사람들한테 계속 물어봤어요. 감이 오더라고요.',
      tags: ['10년차', '경기'], quit: false, author: { nick: '조용한 걸음', avatar: 5 }, agoMin: 4, src: 'seed' },
    { id: 's-a-pil-place-3-3', questionId: 's-q-pil-place-3', pickKey: 'data', pickText: '자료만 믿었어요',
      why: '자료만 믿고 들어갔다가 실제랑 달라서 접었어요.',
      tags: ['창업은 처음', '지방'], quit: true, author: { nick: '첫 봄', avatar: 0 }, agoMin: 1600, src: 'seed' },
    { id: 's-a-pil-place-3-4', questionId: 's-q-pil-place-3', pickKey: 'walk', pickText: '퇴근 후 저녁마다',
      why: '퇴근하고 저녁마다 돌아보면서 시간대별로 체크했어요.',
      tags: ['직장 경험 있음', '1인'], quit: false, author: { nick: '조용한 목요일', avatar: 2 }, agoMin: 200, src: 'seed' }
  );

  // --- 뷰티 × 인허가·등록 (s-r-beauty-permit) ---
  CW.seed.questions.push(
    {
      id: 's-q-beauty-permit-1',
      roomId: 's-r-beauty-permit',
      title: '면허부터 따고 시작했나요',
      body: '면허 없이 시작할 수 있는 부분도 있다고 들었는데 헷갈려요.',
      options: [
        { key: 'license', label: '면허 먼저' },
        { key: 'partner', label: '면허 있는 사람과' },
        { key: 'skip', label: '필요 없는 시술만' }
      ],
      author: { nick: '창가 자리', avatar: 4 },
      agoMin: 1100,
      src: 'seed'
    },
    {
      id: 's-q-beauty-permit-2',
      roomId: 's-r-beauty-permit',
      title: '신고랑 사업자 등록 순서',
      body: '영업신고를 먼저 해야 하는지, 사업자 등록이 먼저인지 헷갈려요.',
      options: [
        { key: 'report_first', label: '영업신고 먼저' },
        { key: 'biz_first', label: '사업자 등록 먼저' },
        { key: 'together', label: '같이 처리' }
      ],
      author: { nick: '첫 번째 손님', avatar: 0 },
      agoMin: 180,
      src: 'seed'
    },
    {
      id: 's-q-beauty-permit-3',
      roomId: 's-r-beauty-permit',
      title: '위생 교육 언제 받았나요',
      body: '미리 받아야 하는지 등록하면서 받아도 되는지 모르겠어요.',
      options: [
        { key: 'before', label: '등록 전에' },
        { key: 'after', label: '등록하면서' },
        { key: 'unsure', label: '모르고 진행' }
      ],
      author: { nick: '구석 자리', avatar: 3 },
      agoMin: 2900,
      src: 'seed'
    }
  );

  CW.seed.answers.push(
    { id: 's-a-beauty-permit-1-1', questionId: 's-q-beauty-permit-1', pickKey: 'license', pickText: '면허부터 땄어요',
      why: '면허부터 따고 시작했어요. 시간은 걸렸지만 마음이 편했어요.',
      tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '반지하 작업실', avatar: 6 }, agoMin: 38, src: 'seed' },
    { id: 's-a-beauty-permit-1-2', questionId: 's-q-beauty-permit-1', pickKey: 'partner', pickText: '면허자와 동업',
      why: '면허 있는 분이랑 같이 시작했어요. 저는 운영을 맡았어요.',
      tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '늦은 저녁', avatar: 1 }, agoMin: 10, src: 'seed' },
    { id: 's-a-beauty-permit-1-3', questionId: 's-q-beauty-permit-1', pickKey: 'skip', pickText: '손님이 안 늘었어요',
      why: '면허 필요 없는 시술만 하다가 손님이 안 늘어서 접었어요.',
      tags: ['1인', '지방'], quit: true, author: { nick: '조용한 골목', avatar: 3 }, agoMin: 2400, src: 'seed' },
    { id: 's-a-beauty-permit-1-4', questionId: 's-q-beauty-permit-1', pickKey: 'license', pickText: '대출로 학원비',
      why: '대출로 학원비 마련해서 면허부터 땄어요.',
      tags: ['대출', '경기'], quit: false, author: { nick: '낮은 목소리', avatar: 5 }, agoMin: 650, src: 'seed' },

    { id: 's-a-beauty-permit-2-1', questionId: 's-q-beauty-permit-2', pickKey: 'report_first', pickText: '신고부터 했어요',
      why: '영업신고부터 하고 그 다음에 사업자 등록했어요. 순서가 그게 맞더라고요.',
      tags: ['창업은 처음', '서울'], quit: false, author: { nick: '두 번째 시도', avatar: 2 }, agoMin: 52, src: 'seed' },
    { id: 's-a-beauty-permit-2-2', questionId: 's-q-beauty-permit-2', pickKey: 'together', pickText: '한 번에 처리',
      why: '구청 가서 한 번에 물어보고 같이 처리했어요.',
      tags: ['자기자금', '1인'], quit: false, author: { nick: '동네 산책', avatar: 4 }, agoMin: 7, src: 'seed' },
    { id: 's-a-beauty-permit-2-3', questionId: 's-q-beauty-permit-2', pickKey: 'biz_first', pickText: '서류를 다시 준비',
      why: '순서를 잘못 알아서 다시 서류 준비하다 지쳐서 접었어요.',
      tags: ['대출', '지방'], quit: true, author: { nick: '작은 간판', avatar: 6 }, agoMin: 3050, src: 'seed' },
    { id: 's-a-beauty-permit-2-4', questionId: 's-q-beauty-permit-2', pickKey: 'report_first', pickText: '담당자가 알려줌',
      why: '지원사업 담당자가 순서를 알려줘서 그대로 따라 했어요.',
      tags: ['지원금', '경기'], quit: false, author: { nick: '오후 세시', avatar: 1 }, agoMin: 410, src: 'seed' },

    { id: 's-a-beauty-permit-3-1', questionId: 's-q-beauty-permit-3', pickKey: 'before', pickText: '미리 받아뒀어요',
      why: '등록 전에 미리 위생 교육부터 받아뒀어요.',
      tags: ['창업은 처음', '서울'], quit: false, author: { nick: '월요일 아침', avatar: 5 }, agoMin: 63, src: 'seed' },
    { id: 's-a-beauty-permit-3-2', questionId: 's-q-beauty-permit-3', pickKey: 'after', pickText: '등록하며 같이 신청',
      why: '등록 절차 밟으면서 같이 신청했어요. 순서는 크게 안 중요했어요.',
      tags: ['직장 경험 있음', '경기'], quit: false, author: { nick: '조용한 주말', avatar: 0 }, agoMin: 16, src: 'seed' },
    { id: 's-a-beauty-permit-3-3', questionId: 's-q-beauty-permit-3', pickKey: 'before', pickText: '계약이 틀어졌어요',
      why: '교육까지 다 받았는데 자리 계약이 틀어져서 접었어요.',
      tags: ['1인', '지방'], quit: true, author: { nick: '서두르지 않는', avatar: 2 }, agoMin: 1800, src: 'seed' },
    { id: 's-a-beauty-permit-3-4', questionId: 's-q-beauty-permit-3', pickKey: 'after', pickText: '가족이 먼저 해봄',
      why: '가족이 먼저 해본 거라 등록하면서 같이 처리했어요.',
      tags: ['자기자금', '가족과 함께'], quit: false, author: { nick: '작은 화분', avatar: 4 }, agoMin: 290, src: 'seed' }
  );

  // --- 교육 × 아이템 정하기 (s-r-edu-item) ---
  CW.seed.questions.push(
    {
      id: 's-q-edu-item-1',
      roomId: 's-r-edu-item',
      title: '어떤 과목으로 시작했나요',
      body: '잘 하는 거랑 잘 팔리는 거 사이에서 고민이에요.',
      options: [
        { key: 'strength', label: '제일 잘하는 것' },
        { key: 'demand', label: '수요 많은 것' },
        { key: 'niche', label: '틈새 과목' }
      ],
      author: { nick: '뒷골목 사장', avatar: 6 },
      agoMin: 530,
      src: 'seed'
    },
    {
      id: 's-q-edu-item-2',
      roomId: 's-r-edu-item',
      title: '어떤 나이대를 대상으로 정했나요',
      body: '초등이냐 중고등이냐에 따라 준비가 많이 다르다고 해서요.',
      options: [
        { key: 'elementary', label: '초등' },
        { key: 'secondary', label: '중고등' },
        { key: 'adult', label: '성인' }
      ],
      author: { nick: '동네 단골', avatar: 2 },
      agoMin: 1450,
      src: 'seed'
    },
    {
      id: 's-q-edu-item-3',
      roomId: 's-r-edu-item',
      title: '그룹으로 할지 1:1로 할지',
      body: '1:1은 단가가 좋은데 인원을 못 늘리겠어요.',
      options: [
        { key: 'group', label: '그룹 수업' },
        { key: 'private', label: '1:1 수업' },
        { key: 'both', label: '둘 다' }
      ],
      author: { nick: '작은 손님', avatar: 5 },
      agoMin: 80,
      src: 'seed'
    }
  );

  CW.seed.answers.push(
    { id: 's-a-edu-item-1-1', questionId: 's-q-edu-item-1', pickKey: 'strength', pickText: '자신 있는 과목으로',
      why: '제일 자신 있는 과목으로 시작했어요. 설명할 때 흔들리지 않아서 좋았어요.',
      tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '창밖 풍경', avatar: 1 }, agoMin: 20, src: 'seed' },
    { id: 's-a-edu-item-1-2', questionId: 's-q-edu-item-1', pickKey: 'demand', pickText: '경쟁이 셌어요',
      why: '수요 많은 과목으로 갔어요. 대신 경쟁도 셌어요.',
      tags: ['자기자금', '경기'], quit: false, author: { nick: '조용한 시작', avatar: 3 }, agoMin: 9, src: 'seed' },
    { id: 's-a-edu-item-1-3', questionId: 's-q-edu-item-1', pickKey: 'niche', pickText: '학생 수가 너무 적음',
      why: '틈새 과목으로 갔는데 학생 수가 너무 적어서 접었어요.',
      tags: ['창업은 처음', '지방'], quit: true, author: { nick: '느린 오후', avatar: 5 }, agoMin: 2200, src: 'seed' },
    { id: 's-a-edu-item-1-4', questionId: 's-q-edu-item-1', pickKey: 'demand', pickText: '대출로 교재 갖춤',
      why: '대출 받아서 인기 과목 교재부터 갖췄어요.',
      tags: ['대출', '1인'], quit: false, author: { nick: '세 번째 창업', avatar: 0 }, agoMin: 340, src: 'seed' },

    { id: 's-a-edu-item-2-1', questionId: 's-q-edu-item-2', pickKey: 'elementary', pickText: '초등 대상으로',
      why: '초등 대상으로 정했어요. 부모님 상담이 더 많다는 건 몰랐어요.',
      tags: ['자기자금', '서울'], quit: false, author: { nick: '작은 발걸음', avatar: 4 }, agoMin: 47, src: 'seed' },
    { id: 's-a-edu-item-2-2', questionId: 's-q-edu-item-2', pickKey: 'secondary', pickText: '입시 일정에 맞춤',
      why: '중고등으로 갔어요. 입시 일정에 맞춰 준비했어요.',
      tags: ['직장 경험 있음', '경기'], quit: false, author: { nick: '이른 아침', avatar: 6 }, agoMin: 13, src: 'seed' },
    { id: 's-a-edu-item-2-3', questionId: 's-q-edu-item-2', pickKey: 'adult', pickText: '주말에만 사람이 옴',
      why: '성인반으로 시작했는데 주말에만 사람이 와서 접었어요.',
      tags: ['1인', '지방'], quit: true, author: { nick: '조심스런 시작', avatar: 1 }, agoMin: 3300, src: 'seed' },
    { id: 's-a-edu-item-2-4', questionId: 's-q-edu-item-2', pickKey: 'elementary', pickText: '가족이 픽업 도와줌',
      why: '초등 대상으로 하고 가족이 픽업 도와줘서 버텼어요.',
      tags: ['지원금', '가족과 함께'], quit: false, author: { nick: '늦은 밤', avatar: 3 }, agoMin: 610, src: 'seed' },

    { id: 's-a-edu-item-3-1', questionId: 's-q-edu-item-3', pickKey: 'group', pickText: '그룹으로 시작',
      why: '그룹 수업으로 시작해서 인원을 빨리 늘렸어요.',
      tags: ['창업은 처음', '서울'], quit: false, author: { nick: '조용한 결심', avatar: 0 }, agoMin: 36, src: 'seed' },
    { id: 's-a-edu-item-3-2', questionId: 's-q-edu-item-3', pickKey: 'private', pickText: '단가 높게 받음',
      why: '1:1로 시작해서 단가는 높게 받았어요. 대신 시간이 빡빡했어요.',
      tags: ['10년차', '경기'], quit: false, author: { nick: '나무 그늘', avatar: 2 }, agoMin: 5, src: 'seed' },
    { id: 's-a-edu-item-3-3', questionId: 's-q-edu-item-3', pickKey: 'both', pickText: '시간표가 꼬였어요',
      why: '둘 다 하려다 시간표가 꼬여서 정리하고 접었어요.',
      tags: ['자기자금', '지방'], quit: true, author: { nick: '옆 동네', avatar: 4 }, agoMin: 1950, src: 'seed' },
    { id: 's-a-edu-item-3-4', questionId: 's-q-edu-item-3', pickKey: 'group', pickText: '주말만 운영',
      why: '주말에만 그룹 수업으로 운영하고 있어요.',
      tags: ['직장 경험 있음', '주말만'], quit: false, author: { nick: '늦은 오후', avatar: 6 }, agoMin: 250, src: 'seed' }
  );
})();
