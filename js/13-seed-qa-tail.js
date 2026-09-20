'use strict';
(function () {
  var CW = window.CW = window.CW || {};
  CW.seed = CW.seed || {};
  CW.seed.questions = CW.seed.questions || [];
  CW.seed.answers = CW.seed.answers || [];

  // 티어 C 긴 꼬리 — 29개 방(각 1질문 3답변). U1(방)이 만든 s-r-* id를 그대로 참조한다.
  var questions = [
    // 필라테스
    {
      id: 's-q-pil-item-1', roomId: 's-r-pil-item',
      title: '1:1 개인레슨이랑 그룹 수업, 뭐부터 여셨어요?',
      body: '둘 다 하기엔 처음엔 벅차서요.',
      options: [
        { key: 'private', label: '개인레슨만' },
        { key: 'group', label: '그룹 수업만' },
        { key: 'mix', label: '둘 다 조금씩' }
      ],
      author: { nick: '조용한 목요일', avatar: 0 }, agoMin: 45, src: 'seed'
    },
    {
      id: 's-q-pil-money-1', roomId: 's-r-pil-money',
      title: '기구값이랑 임대 보증금 중에 뭘 먼저 줄였어요?',
      body: '',
      options: [
        { key: 'equip', label: '기구값 줄이기' },
        { key: 'deposit', label: '보증금 줄이기' },
        { key: 'both', label: '둘 다 최소로' }
      ],
      author: { nick: '늦은 저녁', avatar: 4 }, agoMin: 1200, src: 'seed'
    },
    {
      id: 's-q-pil-permit-1', roomId: 's-r-pil-permit',
      title: '체육시설업 신고, 오픈 며칠 전에 끝내셨어요?',
      body: '',
      options: [
        { key: 'early', label: '2주 전에' },
        { key: 'right_before', label: '오픈 직전에' },
        { key: 'after_open', label: '오픈하고 나중에' }
      ],
      author: { nick: '첫 손님', avatar: 0 }, agoMin: 2000, src: 'seed'
    },

    // 카페
    {
      id: 's-q-cafe-item-1', roomId: 's-r-cafe-item',
      title: '원두 직접 로스팅까지 하시는 분 있나요?',
      body: '',
      options: [
        { key: 'roast', label: '직접 로스팅' },
        { key: 'buy', label: '로스터리에서 받아서' },
        { key: 'mix', label: '일부만 직접' }
      ],
      author: { nick: '셋째 줄 자리', avatar: 4 }, agoMin: 1500, src: 'seed'
    },
    {
      id: 's-q-cafe-form-1', roomId: 's-r-cafe-form',
      title: '개인사업자로 열었다가 법인으로 바꾸신 분 있어요?',
      body: '',
      options: [
        { key: 'solo', label: '개인사업자 유지' },
        { key: 'corp', label: '법인으로 전환' },
        { key: 'start_corp', label: '처음부터 법인' }
      ],
      author: { nick: '오래된 단골', avatar: 0 }, agoMin: 3000, src: 'seed'
    },
    {
      id: 's-q-cafe-place-1', roomId: 's-r-cafe-place',
      title: '1층 아니고 2층에서 카페 여신 분 계세요?',
      body: '',
      options: [
        { key: 'first', label: '1층' },
        { key: 'second', label: '2층' },
        { key: 'semi', label: '반지하' }
      ],
      author: { nick: '두 평 남짓', avatar: 4 }, agoMin: 4200, src: 'seed'
    },
    {
      id: 's-q-cafe-permit-1', roomId: 's-r-cafe-permit',
      title: '영업신고 전에 인테리어 들어가도 되나요?',
      body: '',
      options: [
        { key: 'before', label: '신고 전에 인테리어' },
        { key: 'after', label: '신고부터 하고' },
        { key: 'same', label: '거의 동시에' }
      ],
      author: { nick: '조용한 골목', avatar: 0 }, agoMin: 58, src: 'seed'
    },

    // 온라인 쇼핑몰
    {
      id: 's-q-shop-item-1', roomId: 's-r-shop-item',
      title: '제조하시나요, 소싱해서 파시나요?',
      body: '',
      options: [
        { key: 'make', label: '직접 제조' },
        { key: 'source', label: '소싱' },
        { key: 'both', label: '둘 다' }
      ],
      author: { nick: '뒷자리 손님', avatar: 4 }, agoMin: 2200, src: 'seed'
    },
    {
      id: 's-q-shop-money-1', roomId: 's-r-shop-money',
      title: '재고를 얼마나 쟁여두고 시작하셨어요?',
      body: '',
      options: [
        { key: 'little', label: '적게 시작' },
        { key: 'much', label: '넉넉하게' },
        { key: 'preorder', label: '선주문 받고' }
      ],
      author: { nick: '반지하 작업실', avatar: 0 }, agoMin: 22, src: 'seed'
    },
    {
      id: 's-q-shop-form-1', roomId: 's-r-shop-form',
      title: '통신판매업 신고할 때 개인이랑 법인 중 뭐로 하셨어요?',
      body: '',
      options: [
        { key: 'personal', label: '개인으로' },
        { key: 'corp', label: '법인으로' },
        { key: 'later', label: '개인 후 법인 전환' }
      ],
      author: { nick: '동네 산책', avatar: 4 }, agoMin: 3200, src: 'seed'
    },
    {
      id: 's-q-shop-place-1', roomId: 's-r-shop-place',
      title: '물류 창고, 집에서 하다가 언제 따로 얻으셨어요?',
      body: '',
      options: [
        { key: 'home', label: '계속 집에서' },
        { key: 'early', label: '초반에 바로' },
        { key: 'later', label: '매출 늘고 나서' }
      ],
      author: { nick: '야근 없는 삶', avatar: 0 }, agoMin: 4000, src: 'seed'
    },
    {
      id: 's-q-shop-permit-1', roomId: 's-r-shop-permit',
      title: '통신판매업 신고, 사업자등록이랑 같이 하셨어요?',
      body: '',
      options: [
        { key: 'same', label: '같이' },
        { key: 'after', label: '사업자등록 먼저' },
        { key: 'before', label: '통신판매업 먼저' }
      ],
      author: { nick: '구석 자리', avatar: 4 }, agoMin: 5000, src: 'seed'
    },

    // 뷰티
    {
      id: 's-q-beauty-item-1', roomId: 's-r-beauty-item',
      title: '네일이랑 속눈썹, 하나로 시작하신 분 있어요?',
      body: '',
      options: [
        { key: 'nail', label: '네일만' },
        { key: 'lash', label: '속눈썹만' },
        { key: 'both', label: '둘 다' }
      ],
      author: { nick: '조용한 새벽', avatar: 0 }, agoMin: 2600, src: 'seed'
    },
    {
      id: 's-q-beauty-money-1', roomId: 's-r-beauty-money',
      title: '장비랑 재료비, 중고로 채우신 분 계세요?',
      body: '',
      options: [
        { key: 'used', label: '중고 위주' },
        { key: 'mix', label: '섞어서' },
        { key: 'new', label: '새 것 위주' }
      ],
      author: { nick: '다음 정류장', avatar: 4 }, agoMin: 3400, src: 'seed'
    },
    {
      id: 's-q-beauty-form-1', roomId: 's-r-beauty-form',
      title: '혼자 하다가 직원 쓰신 시점 언제였어요?',
      body: '',
      options: [
        { key: 'solo', label: '계속 혼자' },
        { key: 'early', label: '오픈하자마자' },
        { key: 'later', label: '예약 밀리고 나서' }
      ],
      author: { nick: '오래 걸은 하루', avatar: 0 }, agoMin: 4500, src: 'seed'
    },
    {
      id: 's-q-beauty-place-1', roomId: 's-r-beauty-place',
      title: '상가 1층 말고 오피스텔 안에서 하신 분 있나요?',
      body: '',
      options: [
        { key: 'shop', label: '상가' },
        { key: 'office', label: '오피스텔' },
        { key: 'home', label: '출장·자택' }
      ],
      author: { nick: '조용한 목요일', avatar: 4 }, agoMin: 35, src: 'seed'
    },

    // 교육
    {
      id: 's-q-edu-money-1', roomId: 's-r-edu-money',
      title: '교습소 등록비 말고 초기에 뭐가 제일 크게 들었어요?',
      body: '',
      options: [
        { key: 'rent', label: '임대료' },
        { key: 'ad', label: '홍보비' },
        { key: 'material', label: '교재·기자재' }
      ],
      author: { nick: '늦은 저녁', avatar: 0 }, agoMin: 3800, src: 'seed'
    },
    {
      id: 's-q-edu-form-1', roomId: 's-r-edu-form',
      title: '개인과외에서 교습소로 넘어가신 분, 언제가 맞다고 보세요?',
      body: '',
      options: [
        { key: 'keep', label: '과외 계속' },
        { key: 'open', label: '학생 늘면 바로' },
        { key: 'wait', label: '1년 지켜보고' }
      ],
      author: { nick: '첫 손님', avatar: 4 }, agoMin: 4600, src: 'seed'
    },
    {
      id: 's-q-edu-place-1', roomId: 's-r-edu-place',
      title: '아파트 단지 안이랑 학원가, 어디로 가셨어요?',
      body: '',
      options: [
        { key: 'apt', label: '아파트 단지 안' },
        { key: 'street', label: '학원가' },
        { key: 'both', label: '둘 다 알아보고' }
      ],
      author: { nick: '셋째 줄 자리', avatar: 0 }, agoMin: 5200, src: 'seed'
    },
    {
      id: 's-q-edu-permit-1', roomId: 's-r-edu-permit',
      title: '교습소 신고, 소방 점검 때문에 늦어지신 분 있나요?',
      body: '',
      options: [
        { key: 'fire', label: '소방 때문에 늦어짐' },
        { key: 'smooth', label: '수월하게 끝남' },
        { key: 'redo', label: '서류 다시 냄' }
      ],
      author: { nick: '오래된 단골', avatar: 4 }, agoMin: 6000, src: 'seed'
    },

    // 앱·SaaS
    {
      id: 's-q-saas-item-1', roomId: 's-r-saas-item',
      title: '기능부터 만드셨어요, 랜딩페이지로 반응부터 보셨어요?',
      body: '',
      options: [
        { key: 'build', label: '기능부터' },
        { key: 'landing', label: '랜딩페이지부터' },
        { key: 'both', label: '같이' }
      ],
      author: { nick: '두 평 남짓', avatar: 0 }, agoMin: 2900, src: 'seed'
    },
    {
      id: 's-q-saas-money-1', roomId: 's-r-saas-money',
      title: '서버비 아끼려고 초반에 어떻게 하셨어요?',
      body: '',
      options: [
        { key: 'free_tier', label: '무료 티어로 버팀' },
        { key: 'small', label: '최소 사양으로' },
        { key: 'invest', label: '처음부터 넉넉하게' }
      ],
      author: { nick: '조용한 골목', avatar: 4 }, agoMin: 3600, src: 'seed'
    },
    {
      id: 's-q-saas-place-1', roomId: 's-r-saas-place',
      title: '사무실 없이 재택으로 계속 가신 분 있어요?',
      body: '',
      options: [
        { key: 'remote', label: '계속 재택' },
        { key: 'office', label: '공유오피스로' },
        { key: 'mix', label: '가끔 카페' }
      ],
      author: { nick: '뒷자리 손님', avatar: 0 }, agoMin: 4700, src: 'seed'
    },
    {
      id: 's-q-saas-permit-1', roomId: 's-r-saas-permit',
      title: '통신판매업 신고, SaaS도 필요하던가요?',
      body: '',
      options: [
        { key: 'needed', label: '필요했음' },
        { key: 'not_needed', label: '필요 없었음' },
        { key: 'confused', label: '헷갈려서 그냥 냄' }
      ],
      author: { nick: '반지하 작업실', avatar: 4 }, agoMin: 15, src: 'seed'
    },

    // 콘텐츠
    {
      id: 's-q-content-item-1', roomId: 's-r-content-item',
      title: '유튜브랑 뉴스레터, 뭐부터 시작하셨어요?',
      body: '',
      options: [
        { key: 'yt', label: '유튜브부터' },
        { key: 'news', label: '뉴스레터부터' },
        { key: 'both', label: '둘 다 같이' }
      ],
      author: { nick: '동네 산책', avatar: 0 }, agoMin: 3100, src: 'seed'
    },
    {
      id: 's-q-content-money-1', roomId: 's-r-content-money',
      title: '장비 욕심, 어디까지 내셨어요?',
      body: '',
      options: [
        { key: 'min', label: '최소 장비' },
        { key: 'mid', label: '중간급' },
        { key: 'high', label: '풀세트' }
      ],
      author: { nick: '야근 없는 삶', avatar: 4 }, agoMin: 3900, src: 'seed'
    },
    {
      id: 's-q-content-form-1', roomId: 's-r-content-form',
      title: '혼자 하다가 편집자 붙이신 분 있나요?',
      body: '',
      options: [
        { key: 'solo', label: '계속 혼자' },
        { key: 'hire', label: '편집자 붙임' },
        { key: 'outsource', label: '외주로만' }
      ],
      author: { nick: '구석 자리', avatar: 0 }, agoMin: 50, src: 'seed'
    },
    {
      id: 's-q-content-place-1', roomId: 's-r-content-place',
      title: '촬영 공간, 집이랑 스튜디오 대여 중에 뭘 쓰세요?',
      body: '',
      options: [
        { key: 'home', label: '집에서' },
        { key: 'rent', label: '스튜디오 대여' },
        { key: 'mix', label: '섞어서' }
      ],
      author: { nick: '조용한 새벽', avatar: 4 }, agoMin: 4300, src: 'seed'
    },
    {
      id: 's-q-content-permit-1', roomId: 's-r-content-permit',
      title: '사업자등록, 수익 나기 전에 미리 하셨어요?',
      body: '',
      options: [
        { key: 'early', label: '미리 등록' },
        { key: 'after', label: '수익 나고 등록' },
        { key: 'still', label: '아직 안 함' }
      ],
      author: { nick: '다음 정류장', avatar: 0 }, agoMin: 5000, src: 'seed'
    }
  ];

  var answers = [
    // pil-item
    { id: 's-a-pil-item-1-1', questionId: 's-q-pil-item-1', pickKey: 'private', pickText: '', why: '단가가 높아서 인원 적어도 됐어요.', tags: ['자기자금', '10년차', '서울'], quit: false, author: { nick: '창가 자리', avatar: 1 }, agoMin: 20, src: 'seed' },
    { id: 's-a-pil-item-1-2', questionId: 's-q-pil-item-1', pickKey: 'group', pickText: '', why: '그룹으로 시작해야 손익분기가 빨리 왔어요.', tags: ['대출', '창업은 처음'], quit: false, author: { nick: '반지하 작업실', avatar: 2 }, agoMin: 30, src: 'seed' },
    { id: 's-a-pil-item-1-3', questionId: 's-q-pil-item-1', pickKey: 'mix', pickText: '', why: '반반 하다가 체력이 안 따라줘서 접었어요.', tags: ['1인', '지방'], quit: true, author: { nick: '골목 안쪽', avatar: 3 }, agoMin: 40, src: 'seed' },

    // pil-money
    { id: 's-a-pil-money-1-1', questionId: 's-q-pil-money-1', pickKey: 'equip', pickText: '', why: '중고 기구로 채우고 임대는 넉넉하게 잡았어요.', tags: ['자기자금', '서울'], quit: false, author: { nick: '두 번째 시도', avatar: 5 }, agoMin: 300, src: 'seed' },
    { id: 's-a-pil-money-1-2', questionId: 's-q-pil-money-1', pickKey: 'deposit', pickText: '', why: '변두리로 가서 보증금부터 낮췄어요.', tags: ['대출', '지방'], quit: false, author: { nick: '동네 산책', avatar: 6 }, agoMin: 500, src: 'seed' },
    { id: 's-a-pil-money-1-3', questionId: 's-q-pil-money-1', pickKey: 'both', pickText: '', why: '둘 다 아끼려다 오픈이 반년 밀려서 접었어요.', tags: ['창업은 처음', '1인'], quit: true, author: { nick: '조용한 오후', avatar: 7 }, agoMin: 900, src: 'seed' },

    // pil-permit
    { id: 's-a-pil-permit-1-1', questionId: 's-q-pil-permit-1', pickKey: 'early', pickText: '', why: '서류 반려될까봐 여유 있게 냈어요.', tags: ['서울', '직장 경험 있음'], quit: false, author: { nick: '주말 카페인', avatar: 1 }, agoMin: 600, src: 'seed' },
    { id: 's-a-pil-permit-1-2', questionId: 's-q-pil-permit-1', pickKey: 'right_before', pickText: '', why: '인테리어 끝나자마자 바로 신청했어요.', tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '야근 없는 삶', avatar: 2 }, agoMin: 1000, src: 'seed' },
    { id: 's-a-pil-permit-1-3', questionId: 's-q-pil-permit-1', pickKey: 'after_open', pickText: '', why: '신고를 미루다가 결국 문 못 열고 접었어요.', tags: ['지방', '1인'], quit: true, author: { nick: '작은 간판', avatar: 3 }, agoMin: 1800, src: 'seed' },

    // cafe-item
    { id: 's-a-cafe-item-1-1', questionId: 's-q-cafe-item-1', pickKey: 'buy', pickText: '', why: '로스팅은 배우는데 시간이 너무 걸려서 받아 썼어요.', tags: ['창업은 처음', '서울'], quit: false, author: { nick: '늦잠 없는 아침', avatar: 5 }, agoMin: 400, src: 'seed' },
    { id: 's-a-cafe-item-1-2', questionId: 's-q-cafe-item-1', pickKey: 'roast', pickText: '', why: '맛을 제 손으로 잡고 싶어서 기계부터 들였어요.', tags: ['10년차', '자기자금'], quit: false, author: { nick: '구석 자리', avatar: 6 }, agoMin: 700, src: 'seed' },
    { id: 's-a-cafe-item-1-3', questionId: 's-q-cafe-item-1', pickKey: 'mix', pickText: '', why: '반만 직접 하다가 퀄리티가 안 잡혀서 접었어요.', tags: ['1인', '지방'], quit: true, author: { nick: '낡은 노트북', avatar: 7 }, agoMin: 1300, src: 'seed' },

    // cafe-form
    { id: 's-a-cafe-form-1-1', questionId: 's-q-cafe-form-1', pickKey: 'solo', pickText: '', why: '매장 하나뿐이라 굳이 바꿀 이유가 없었어요.', tags: ['자기자금', '1인'], quit: false, author: { nick: '서랍 속 영수증', avatar: 1 }, agoMin: 800, src: 'seed' },
    { id: 's-a-cafe-form-1-2', questionId: 's-q-cafe-form-1', pickKey: 'corp', pickText: '', why: '2호점 준비하면서 법인으로 바꿨어요.', tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '조용한 새벽', avatar: 2 }, agoMin: 1200, src: 'seed' },
    { id: 's-a-cafe-form-1-3', questionId: 's-q-cafe-form-1', pickKey: 'start_corp', pickText: '', why: '동업이라 처음부터 법인으로 갔다가 지분 문제로 접었어요.', tags: ['가족과 함께', '창업은 처음'], quit: true, author: { nick: '접이식 의자', avatar: 3 }, agoMin: 2500, src: 'seed' },

    // cafe-place
    { id: 's-a-cafe-place-1-1', questionId: 's-q-cafe-place-1', pickKey: 'first', pickText: '', why: '유동인구 보고 무조건 1층으로 갔어요.', tags: ['서울', '대출'], quit: false, author: { nick: '창밖 풍경', avatar: 5 }, agoMin: 1000, src: 'seed' },
    { id: 's-a-cafe-place-1-2', questionId: 's-q-cafe-place-1', pickKey: 'second', pickText: '', why: '임대료 아끼려고 2층 갔는데 손님이 꾸준히 왔어요.', tags: ['자기자금', '경기'], quit: false, author: { nick: '다음 정류장', avatar: 6 }, agoMin: 1600, src: 'seed' },
    { id: 's-a-cafe-place-1-3', questionId: 's-q-cafe-place-1', pickKey: 'semi', pickText: '', why: '반지하가 저렴해서 갔다가 습기 때문에 접었어요.', tags: ['지방', '1인'], quit: true, author: { nick: '흐린 창문', avatar: 7 }, agoMin: 3800, src: 'seed' },

    // cafe-permit
    { id: 's-a-cafe-permit-1-1', questionId: 's-q-cafe-permit-1', pickKey: 'before', pickText: '', why: '미리 공사 시작했다가 소방 기준 안 맞아서 다시 뜯었어요.', tags: ['창업은 처음', '서울'], quit: false, author: { nick: '마감 세일', avatar: 1 }, agoMin: 10, src: 'seed' },
    { id: 's-a-cafe-permit-1-2', questionId: 's-q-cafe-permit-1', pickKey: 'after', pickText: '', why: '신고 먼저 받고 공사 들어가서 안전했어요.', tags: ['직장 경험 있음', '경기'], quit: false, author: { nick: '오래 걸은 하루', avatar: 2 }, agoMin: 25, src: 'seed' },
    { id: 's-a-cafe-permit-1-3', questionId: 's-q-cafe-permit-1', pickKey: 'same', pickText: '', why: '구청이랑 인테리어 업체 일정 맞추다가 지쳐서 접었어요.', tags: ['1인', '지방'], quit: true, author: { nick: '낮은 조도', avatar: 3 }, agoMin: 50, src: 'seed' },

    // shop-item
    { id: 's-a-shop-item-1-1', questionId: 's-q-shop-item-1', pickKey: 'source', pickText: '', why: '처음엔 소싱으로 시장 반응부터 봤어요.', tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '늦게 켠 불', avatar: 5 }, agoMin: 500, src: 'seed' },
    { id: 's-a-shop-item-1-2', questionId: 's-q-shop-item-1', pickKey: 'make', pickText: '', why: '직접 만들어야 마진이 남길래 제조로 갔어요.', tags: ['10년차', '지방'], quit: false, author: { nick: '조용한 목요일', avatar: 6 }, agoMin: 900, src: 'seed' },
    { id: 's-a-shop-item-1-3', questionId: 's-q-shop-item-1', pickKey: 'both', pickText: '', why: '제조랑 소싱 둘 다 벌이다가 재고 관리가 안 돼서 접었어요.', tags: ['1인', '서울'], quit: true, author: { nick: '창가 자리', avatar: 7 }, agoMin: 2000, src: 'seed' },

    // shop-money
    { id: 's-a-shop-money-1-1', questionId: 's-q-shop-money-1', pickKey: 'little', pickText: '', why: '첫 달에 30만원어치만 떼와서 반응 보고 늘렸어요.', tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '골목 안쪽', avatar: 1 }, agoMin: 8, src: 'seed' },
    { id: 's-a-shop-money-1-2', questionId: 's-q-shop-money-1', pickKey: 'much', pickText: '', why: '대량으로 받아야 단가가 맞아서 처음부터 크게 갔어요.', tags: ['대출', '10년차'], quit: false, author: { nick: '늦은 저녁', avatar: 2 }, agoMin: 15, src: 'seed' },
    { id: 's-a-shop-money-1-3', questionId: 's-q-shop-money-1', pickKey: 'preorder', pickText: '', why: '선주문만 받다가 물량이 안 늘어서 접었어요.', tags: ['1인', '지방'], quit: true, author: { nick: '두 번째 시도', avatar: 3 }, agoMin: 20, src: 'seed' },

    // shop-form
    { id: 's-a-shop-form-1-1', questionId: 's-q-shop-form-1', pickKey: 'personal', pickText: '', why: '혼자 하니까 개인으로 충분했어요.', tags: ['1인', '자기자금'], quit: false, author: { nick: '조용한 오후', avatar: 5 }, agoMin: 700, src: 'seed' },
    { id: 's-a-shop-form-1-2', questionId: 's-q-shop-form-1', pickKey: 'later', pickText: '', why: '매출 늘고 나서 법인으로 바꿨어요.', tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '첫 손님', avatar: 6 }, agoMin: 1400, src: 'seed' },
    { id: 's-a-shop-form-1-3', questionId: 's-q-shop-form-1', pickKey: 'corp', pickText: '', why: '처음부터 법인으로 했다가 세무 비용만 늘어서 접었어요.', tags: ['창업은 처음', '경기'], quit: true, author: { nick: '주말 카페인', avatar: 7 }, agoMin: 2800, src: 'seed' },

    // shop-place
    { id: 's-a-shop-place-1-1', questionId: 's-q-shop-place-1', pickKey: 'home', pickText: '', why: '택배 물량이 적어서 아직도 집에서 해요.', tags: ['1인', '주말만'], quit: false, author: { nick: '야근 없는 삶', avatar: 0 }, agoMin: 900, src: 'seed' },
    { id: 's-a-shop-place-1-2', questionId: 's-q-shop-place-1', pickKey: 'later', pickText: '', why: '베란다가 감당 안 될 때 창고를 얻었어요.', tags: ['자기자금', '경기'], quit: false, author: { nick: '작은 간판', avatar: 1 }, agoMin: 1700, src: 'seed' },
    { id: 's-a-shop-place-1-3', questionId: 's-q-shop-place-1', pickKey: 'early', pickText: '', why: '창고부터 크게 얻었다가 임대료에 눌려서 접었어요.', tags: ['대출', '지방'], quit: true, author: { nick: '셋째 줄 자리', avatar: 2 }, agoMin: 3600, src: 'seed' },

    // shop-permit
    { id: 's-a-shop-permit-1-1', questionId: 's-q-shop-permit-1', pickKey: 'same', pickText: '', why: '서류 한 번에 준비하니까 편했어요.', tags: ['서울', '창업은 처음'], quit: false, author: { nick: '늦잠 없는 아침', avatar: 3 }, agoMin: 1200, src: 'seed' },
    { id: 's-a-shop-permit-1-2', questionId: 's-q-shop-permit-1', pickKey: 'after', pickText: '', why: '사업자등록만 하고 몇 달 미루다 통신판매업을 나중에 냈어요.', tags: ['직장 경험 있음', '경기'], quit: false, author: { nick: '오래된 단골', avatar: 6 }, agoMin: 2200, src: 'seed' },
    { id: 's-a-shop-permit-1-3', questionId: 's-q-shop-permit-1', pickKey: 'before', pickText: '', why: '순서를 반대로 했다가 계좌 개설이 꼬여서 접었어요.', tags: ['1인', '지방'], quit: true, author: { nick: '서랍 속 영수증', avatar: 7 }, agoMin: 4500, src: 'seed' },

    // beauty-item
    { id: 's-a-beauty-item-1-1', questionId: 's-q-beauty-item-1', pickKey: 'nail', pickText: '', why: '제일 자신있는 것부터 시작했어요.', tags: ['10년차', '서울'], quit: false, author: { nick: '접이식 의자', avatar: 1 }, agoMin: 600, src: 'seed' },
    { id: 's-a-beauty-item-1-2', questionId: 's-q-beauty-item-1', pickKey: 'both', pickText: '', why: '손님이 두 가지 다 찾아서 같이 배웠어요.', tags: ['자기자금', '경기'], quit: false, author: { nick: '두 평 남짓', avatar: 2 }, agoMin: 1200, src: 'seed' },
    { id: 's-a-beauty-item-1-3', questionId: 's-q-beauty-item-1', pickKey: 'lash', pickText: '', why: '속눈썹만 하다가 수요가 좁아서 접었어요.', tags: ['창업은 처음', '1인'], quit: true, author: { nick: '창밖 풍경', avatar: 3 }, agoMin: 2400, src: 'seed' },

    // beauty-money
    { id: 's-a-beauty-money-1-1', questionId: 's-q-beauty-money-1', pickKey: 'used', pickText: '', why: '장비는 중고로 사고 재료만 새 걸로 썼어요.', tags: ['자기자금', '지방'], quit: false, author: { nick: '흐린 창문', avatar: 5 }, agoMin: 800, src: 'seed' },
    { id: 's-a-beauty-money-1-2', questionId: 's-q-beauty-money-1', pickKey: 'mix', pickText: '', why: '큰 장비만 새로, 작은 건 중고로 맞췄는데 그래도 자금이 부족해서 접었어요.', tags: ['대출', '서울'], quit: true, author: { nick: '조용한 골목', avatar: 6 }, agoMin: 1500, src: 'seed' },
    { id: 's-a-beauty-money-1-3', questionId: 's-q-beauty-money-1', pickKey: 'new', pickText: '', why: '전부 새 걸로 갖췄다가 초기비용에 눌려서 접었어요.', tags: ['창업은 처음', '1인'], quit: true, author: { nick: '마감 세일', avatar: 7 }, agoMin: 3000, src: 'seed' },

    // beauty-form
    { id: 's-a-beauty-form-1-1', questionId: 's-q-beauty-form-1', pickKey: 'solo', pickText: '', why: '예약제로만 받으니까 혼자로도 충분했어요.', tags: ['1인', '주말만'], quit: false, author: { nick: '낮은 조도', avatar: 1 }, agoMin: 1000, src: 'seed' },
    { id: 's-a-beauty-form-1-2', questionId: 's-q-beauty-form-1', pickKey: 'later', pickText: '', why: '예약이 두 달치 밀리고 나서 한 명 뒀어요.', tags: ['10년차', '서울'], quit: false, author: { nick: '뒷자리 손님', avatar: 2 }, agoMin: 2000, src: 'seed' },
    { id: 's-a-beauty-form-1-3', questionId: 's-q-beauty-form-1', pickKey: 'early', pickText: '', why: '처음부터 직원 뒀다가 매출이 안 따라줘서 접었어요.', tags: ['대출', '경기'], quit: true, author: { nick: '늦게 켠 불', avatar: 3 }, agoMin: 4200, src: 'seed' },

    // beauty-place
    { id: 's-a-beauty-place-1-1', questionId: 's-q-beauty-place-1', pickKey: 'office', pickText: '', why: '월세가 싸서 오피스텔로 갔는데 간판이 안 보여 손님이 안 늘었어요.', tags: ['자기자금', '서울'], quit: false, author: { nick: '창가 자리', avatar: 5 }, agoMin: 12, src: 'seed' },
    { id: 's-a-beauty-place-1-2', questionId: 's-q-beauty-place-1', pickKey: 'home', pickText: '', why: '자택 샵으로 시작해서 임대료 부담이 없었어요.', tags: ['1인', '지방'], quit: false, author: { nick: '반지하 작업실', avatar: 6 }, agoMin: 20, src: 'seed' },
    { id: 's-a-beauty-place-1-3', questionId: 's-q-beauty-place-1', pickKey: 'shop', pickText: '', why: '상가 1층 뒀다가 권리금이 부담돼서 접었어요.', tags: ['대출', '창업은 처음'], quit: true, author: { nick: '골목 안쪽', avatar: 7 }, agoMin: 33, src: 'seed' },

    // edu-money
    { id: 's-a-edu-money-1-1', questionId: 's-q-edu-money-1', pickKey: 'rent', pickText: '', why: '임대료가 절반 넘게 나갔어요.', tags: ['서울', '대출'], quit: false, author: { nick: '두 번째 시도', avatar: 1 }, agoMin: 900, src: 'seed' },
    { id: 's-a-edu-money-1-2', questionId: 's-q-edu-money-1', pickKey: 'material', pickText: '', why: '교재랑 기자재 맞추는 데 생각보다 많이 썼어요.', tags: ['자기자금', '10년차'], quit: false, author: { nick: '동네 산책', avatar: 2 }, agoMin: 1600, src: 'seed' },
    { id: 's-a-edu-money-1-3', questionId: 's-q-edu-money-1', pickKey: 'ad', pickText: '', why: '홍보비를 너무 많이 써서 정작 운영비가 부족해 접었어요.', tags: ['창업은 처음', '지방'], quit: true, author: { nick: '조용한 오후', avatar: 3 }, agoMin: 3500, src: 'seed' },

    // edu-form
    { id: 's-a-edu-form-1-1', questionId: 's-q-edu-form-1', pickKey: 'wait', pickText: '', why: '1년은 과외로 버티면서 수요를 확인했어요.', tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '주말 카페인', avatar: 5 }, agoMin: 1000, src: 'seed' },
    { id: 's-a-edu-form-1-2', questionId: 's-q-edu-form-1', pickKey: 'keep', pickText: '', why: '교습소 낼 학생 수가 안 나와서 계속 과외로 해요.', tags: ['1인', '주말만'], quit: false, author: { nick: '야근 없는 삶', avatar: 6 }, agoMin: 2200, src: 'seed' },
    { id: 's-a-edu-form-1-3', questionId: 's-q-edu-form-1', pickKey: 'open', pickText: '', why: '너무 빨리 넘어갔다가 고정비에 밀려서 접었어요.', tags: ['대출', '경기'], quit: true, author: { nick: '작은 간판', avatar: 7 }, agoMin: 4300, src: 'seed' },

    // edu-place
    { id: 's-a-edu-place-1-1', questionId: 's-q-edu-place-1', pickKey: 'apt', pickText: '', why: '단지 안이 임대료도 싸고 픽업도 편해서 갔어요.', tags: ['경기', '자기자금'], quit: false, author: { nick: '늦잠 없는 아침', avatar: 1 }, agoMin: 1100, src: 'seed' },
    { id: 's-a-edu-place-1-2', questionId: 's-q-edu-place-1', pickKey: 'street', pickText: '', why: '학원가라야 학부모가 믿고 보낸다고 해서 갔어요.', tags: ['서울', '10년차'], quit: false, author: { nick: '구석 자리', avatar: 2 }, agoMin: 2400, src: 'seed' },
    { id: 's-a-edu-place-1-3', questionId: 's-q-edu-place-1', pickKey: 'both', pickText: '', why: '두 곳 다 계약 직전까지 갔다가 결정을 못해서 접었어요.', tags: ['창업은 처음', '1인'], quit: true, author: { nick: '낡은 노트북', avatar: 3 }, agoMin: 5000, src: 'seed' },

    // edu-permit
    { id: 's-a-edu-permit-1-1', questionId: 's-q-edu-permit-1', pickKey: 'fire', pickText: '', why: '소화기 위치 하나 때문에 두 번 다시 갔어요.', tags: ['서울', '직장 경험 있음'], quit: false, author: { nick: '오래된 단골', avatar: 5 }, agoMin: 1500, src: 'seed' },
    { id: 's-a-edu-permit-1-2', questionId: 's-q-edu-permit-1', pickKey: 'smooth', pickText: '', why: '미리 기준표 보고 준비해서 한 번에 통과했어요.', tags: ['자기자금', '경기'], quit: false, author: { nick: '조용한 새벽', avatar: 6 }, agoMin: 2800, src: 'seed' },
    { id: 's-a-edu-permit-1-3', questionId: 's-q-edu-permit-1', pickKey: 'redo', pickText: '', why: '서류를 세 번 반려당하다 시기를 놓쳐서 접었어요.', tags: ['창업은 처음', '지방'], quit: true, author: { nick: '접이식 의자', avatar: 7 }, agoMin: 5700, src: 'seed' },

    // saas-item
    { id: 's-a-saas-item-1-1', questionId: 's-q-saas-item-1', pickKey: 'landing', pickText: '', why: '랜딩 하나 올려놓고 신청 몇 명 오나 봤어요.', tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '창밖 풍경', avatar: 1 }, agoMin: 600, src: 'seed' },
    { id: 's-a-saas-item-1-2', questionId: 's-q-saas-item-1', pickKey: 'build', pickText: '', why: '핵심 기능 하나만 빨리 만들어서 써보게 했어요.', tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '다음 정류장', avatar: 2 }, agoMin: 1300, src: 'seed' },
    { id: 's-a-saas-item-1-3', questionId: 's-q-saas-item-1', pickKey: 'both', pickText: '', why: '둘 다 벌이다가 어느 쪽도 제대로 못 끝내고 접었어요.', tags: ['1인', '경기'], quit: true, author: { nick: '흐린 창문', avatar: 3 }, agoMin: 2700, src: 'seed' },

    // saas-money
    { id: 's-a-saas-money-1-1', questionId: 's-q-saas-money-1', pickKey: 'free_tier', pickText: '', why: '무료 티어 끝까지 쓰다가 유료로 넘어갔어요.', tags: ['자기자금', '1인'], quit: false, author: { nick: '마감 세일', avatar: 5 }, agoMin: 800, src: 'seed' },
    { id: 's-a-saas-money-1-2', questionId: 's-q-saas-money-1', pickKey: 'small', pickText: '', why: '제일 싼 사양으로 시작해서 늘려갔어요.', tags: ['창업은 처음', '서울'], quit: false, author: { nick: '오래 걸은 하루', avatar: 6 }, agoMin: 1600, src: 'seed' },
    { id: 's-a-saas-money-1-3', questionId: 's-q-saas-money-1', pickKey: 'invest', pickText: '', why: '트래픽 대비한다고 서버부터 키웠다가 돈만 쓰고 접었어요.', tags: ['대출', '경기'], quit: true, author: { nick: '낮은 조도', avatar: 7 }, agoMin: 3400, src: 'seed' },

    // saas-place
    { id: 's-a-saas-place-1-1', questionId: 's-q-saas-place-1', pickKey: 'remote', pickText: '', why: '인원이 둘뿐이라 사무실이 아직도 필요 없어요.', tags: ['1인', '자기자금'], quit: false, author: { nick: '늦게 켠 불', avatar: 1 }, agoMin: 1100, src: 'seed' },
    { id: 's-a-saas-place-1-2', questionId: 's-q-saas-place-1', pickKey: 'office', pickText: '', why: '미팅 잡을 곳이 필요해서 공유오피스로 옮겼어요.', tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '조용한 목요일', avatar: 2 }, agoMin: 2100, src: 'seed' },
    { id: 's-a-saas-place-1-3', questionId: 's-q-saas-place-1', pickKey: 'mix', pickText: '', why: '카페를 사무실처럼 쓰다가 집중이 안 돼서 접었어요.', tags: ['창업은 처음', '지방'], quit: true, author: { nick: '창가 자리', avatar: 3 }, agoMin: 4500, src: 'seed' },

    // saas-permit
    { id: 's-a-saas-permit-1-1', questionId: 's-q-saas-permit-1', pickKey: 'not_needed', pickText: '', why: '구독 결제만 있어서 세무사한테 물어보니 안 해도 됐어요.', tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '골목 안쪽', avatar: 5 }, agoMin: 5, src: 'seed' },
    { id: 's-a-saas-permit-1-2', questionId: 's-q-saas-permit-1', pickKey: 'needed', pickText: '', why: '결제대행 붙이면서 통신판매업까지 같이 냈어요.', tags: ['자기자금', '창업은 처음'], quit: false, author: { nick: '늦은 저녁', avatar: 6 }, agoMin: 9, src: 'seed' },
    { id: 's-a-saas-permit-1-3', questionId: 's-q-saas-permit-1', pickKey: 'confused', pickText: '', why: '애매해서 그냥 냈다가 정작 서비스는 접었어요.', tags: ['1인', '경기'], quit: true, author: { nick: '두 번째 시도', avatar: 7 }, agoMin: 14, src: 'seed' },

    // content-item
    { id: 's-a-content-item-1-1', questionId: 's-q-content-item-1', pickKey: 'news', pickText: '', why: '편집이 가벼워서 뉴스레터로 먼저 시작했어요.', tags: ['1인', '주말만'], quit: false, author: { nick: '조용한 오후', avatar: 1 }, agoMin: 700, src: 'seed' },
    { id: 's-a-content-item-1-2', questionId: 's-q-content-item-1', pickKey: 'yt', pickText: '', why: '영상이 더 잘 퍼질 것 같아서 유튜브로 갔어요.', tags: ['창업은 처음', '서울'], quit: false, author: { nick: '첫 손님', avatar: 2 }, agoMin: 1400, src: 'seed' },
    { id: 's-a-content-item-1-3', questionId: 's-q-content-item-1', pickKey: 'both', pickText: '', why: '둘 다 하다가 체력이 안 따라줘서 접었어요.', tags: ['직장 경험 있음', '경기'], quit: true, author: { nick: '주말 카페인', avatar: 3 }, agoMin: 2900, src: 'seed' },

    // content-money
    { id: 's-a-content-money-1-1', questionId: 's-q-content-money-1', pickKey: 'min', pickText: '', why: '휴대폰이랑 마이크 하나로 시작했어요.', tags: ['자기자금', '1인'], quit: false, author: { nick: '작은 간판', avatar: 5 }, agoMin: 900, src: 'seed' },
    { id: 's-a-content-money-1-2', questionId: 's-q-content-money-1', pickKey: 'mid', pickText: '', why: '카메라만 중고로 좋은 거 사고 나머진 최소로 갔어요.', tags: ['10년차', '서울'], quit: false, author: { nick: '셋째 줄 자리', avatar: 6 }, agoMin: 1700, src: 'seed' },
    { id: 's-a-content-money-1-3', questionId: 's-q-content-money-1', pickKey: 'high', pickText: '', why: '장비부터 풀세트로 맞췄다가 콘텐츠 못 내고 접었어요.', tags: ['대출', '창업은 처음'], quit: true, author: { nick: '늦잠 없는 아침', avatar: 7 }, agoMin: 3600, src: 'seed' },

    // content-form
    { id: 's-a-content-form-1-1', questionId: 's-q-content-form-1', pickKey: 'solo', pickText: '', why: '주 1회 업로드라 아직 혼자로 돼요.', tags: ['1인', '주말만'], quit: false, author: { nick: '낡은 노트북', avatar: 1 }, agoMin: 18, src: 'seed' },
    { id: 's-a-content-form-1-2', questionId: 's-q-content-form-1', pickKey: 'outsource', pickText: '', why: '바쁠 때만 건별로 외주를 맡겨요.', tags: ['자기자금', '서울'], quit: false, author: { nick: '오래된 단골', avatar: 2 }, agoMin: 28, src: 'seed' },
    { id: 's-a-content-form-1-3', questionId: 's-q-content-form-1', pickKey: 'hire', pickText: '', why: '편집자 월급 주다가 수익이 안 따라와서 접었어요.', tags: ['창업은 처음', '경기'], quit: true, author: { nick: '서랍 속 영수증', avatar: 3 }, agoMin: 45, src: 'seed' },

    // content-place
    { id: 's-a-content-place-1-1', questionId: 's-q-content-place-1', pickKey: 'home', pickText: '', why: '방 하나 정리해서 세트처럼 써요.', tags: ['1인', '지방'], quit: false, author: { nick: '접이식 의자', avatar: 5 }, agoMin: 1000, src: 'seed' },
    { id: 's-a-content-place-1-2', questionId: 's-q-content-place-1', pickKey: 'mix', pickText: '', why: '평소엔 집, 중요한 촬영만 대여 스튜디오로 가요.', tags: ['자기자금', '서울'], quit: false, author: { nick: '두 평 남짓', avatar: 6 }, agoMin: 1900, src: 'seed' },
    { id: 's-a-content-place-1-3', questionId: 's-q-content-place-1', pickKey: 'rent', pickText: '', why: '매번 대여하다 보니 비용이 쌓여서 접었어요.', tags: ['창업은 처음', '경기'], quit: true, author: { nick: '창밖 풍경', avatar: 7 }, agoMin: 4000, src: 'seed' },

    // content-permit
    { id: 's-a-content-permit-1-1', questionId: 's-q-content-permit-1', pickKey: 'after', pickText: '', why: '애드센스 승인 나고 나서 등록했어요.', tags: ['1인', '창업은 처음'], quit: false, author: { nick: '흐린 창문', avatar: 1 }, agoMin: 1200, src: 'seed' },
    { id: 's-a-content-permit-1-2', questionId: 's-q-content-permit-1', pickKey: 'early', pickText: '', why: '세금계산서 받으려고 미리 사업자를 냈어요.', tags: ['직장 경험 있음', '서울'], quit: false, author: { nick: '조용한 골목', avatar: 2 }, agoMin: 2300, src: 'seed' },
    { id: 's-a-content-permit-1-3', questionId: 's-q-content-permit-1', pickKey: 'still', pickText: '', why: '등록을 미루다가 세금 문제로 정리하고 접었어요.', tags: ['지방', '1인'], quit: true, author: { nick: '마감 세일', avatar: 3 }, agoMin: 4800, src: 'seed' }
  ];

  CW.seed.questions.push.apply(CW.seed.questions, questions);
  CW.seed.answers.push.apply(CW.seed.answers, answers);
})();
