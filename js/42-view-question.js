'use strict';
(function () {
  // #/q/:id — 질문 상세. 조건별 정리(집계) + 내 조건 필터 + 답변 목록 + 답 남기기 폼.
  // 이 화면이 제품 명제 전부를 보여준다: 같은 선택 안에서도 접은 사람이 섞여 있다는 것,
  // 그리고 방금 쓴 답이 그 자리에서 집계에 반영된다는 것.
  //
  // v2 — 시연용 타임드 리빌: 처음 들어온 질문은 답변이 채팅처럼 한 번에 하나씩
  // 등장한다(질문 버블 → 타이핑 인디케이터 → 답변들 → 조건별 정리 카드 →
  // 답 남기기 폼 → 입장 알림). 같은 세션에서 같은 질문을 다시 열면, 또는
  // 사용자가 폼을 만지거나 필터를 건드리면 즉시 전체를 그린다. 애니메이션은
  // transform/opacity만 쓰고, reduced-motion이면 아예 재생하지 않는다.

  var util = CW.util;

  var rootEl = null;
  var currentParams = null;
  var questionId = null;

  // Transient UI state — resets whenever params.id changes (plan 4.2 / view contract).
  var mineFilterOn = false;
  var formPick = null;      // selected option key in the answer form
  var formTags = [];        // selected condition tags, max 3
  var formError = '';       // inline validation message next to submit button
  var draftPickText = '';   // preserved input across re-renders triggered by chip clicks
  var draftWhy = '';
  var draftQuit = false;

  // ---- reveal-once bookkeeping (module-local — lives for the whole tab session) ----
  var playedIds = new Set();   // question ids that have already played their reveal once
  var runId = 0;               // bumped on every render()/renderFull()/replay — invalidates in-flight timers
  var timers = [];             // every pending setTimeout id from the current reveal/pills chain

  function clearTimers() {
    for (var i = 0; i < timers.length; i++) {
      window.clearTimeout(timers[i]);
    }
    timers = [];
  }

  // Schedules fn, tagged with the runId that was active when the reveal started.
  // Every callback re-checks runId itself — a timer already sitting in the task
  // queue when runId moves on cannot be cancelled by clearTimeout alone, so the
  // check inside fn is load-bearing, not decorative.
  function schedule(fn, delay) {
    var id = window.setTimeout(fn, delay);
    timers.push(id);
    return id;
  }

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  }

  // ---- helpers ----

  function resetFormState() {
    formPick = null;
    formError = '';
    draftPickText = '';
    draftWhy = '';
    draftQuit = false;
    formTags = CW.match.myTags().slice(0, 3);
  }

  function syncDraftFromDom() {
    var pickTextInput = util.$('.answer-form__picktext', rootEl);
    var whyInput = util.$('.answer-form__why', rootEl);
    var quitInput = util.$('.answer-form__quit', rootEl);
    if (pickTextInput) draftPickText = pickTextInput.value;
    if (whyInput) draftWhy = whyInput.value;
    if (quitInput) draftQuit = quitInput.checked;
  }

  function optionLabel(question, key) {
    var opts = (question && Array.isArray(question.options)) ? question.options : [];
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].key === key) return opts[i].label;
    }
    return '';
  }

  // ---- region: 방 헤더 (아바타 + 이름 + 라이브 줄 + 다시 재생) ----

  function buildChatHeader(q, room) {
    var header = util.el('header', 'chat-header');
    var top = util.el('div', 'chat-header__top');

    var avatar = util.el('span', 'avatar chat-header__avatar');
    var symbolId = (room && CW.icons && CW.icons.cat) ? CW.icons.cat[room.cat] : null;
    var icon = (symbolId && CW.icons && typeof CW.icons.use === 'function') ? CW.icons.use(symbolId) : null;
    if (icon) avatar.appendChild(icon);
    top.appendChild(avatar);

    var nameWrap = util.el('div', 'chat-header__name-wrap');
    var name = room ? (room.cat + ' · ' + room.stage + ' 방') : '동네 방';
    nameWrap.appendChild(util.el('p', 'chat-header__name', name));

    var liveLine = util.el('p', 'chat-header__live');
    liveLine.appendChild(util.el('span', 'live-dot is-live'));
    var members = (room && typeof room.members === 'number') ? room.members : 0;
    // "지금 대화 중"인 인원은 방 전체 인원에서 파생한 값이다 — 임의의 숫자를
    // 새로 지어내지 않는다(PRD 4.5/11 정직성 원칙). 대략 1/3 수준으로 잡되
    // 최소 2명은 되게 해서 방이 죽어 보이지 않게만 한다.
    var activeNow = members > 0 ? Math.max(2, Math.round(members / 3)) : 0;
    liveLine.appendChild(document.createTextNode(members + '명 · 지금 ' + activeNow + '명 대화 중 '));
    liveLine.appendChild(util.el('span', 'badge-example', '예시'));
    nameWrap.appendChild(liveLine);
    top.appendChild(nameWrap);

    var replayBtn = util.el('button', 'btn btn--ghost btn--text chat-header__replay', '다시 재생');
    replayBtn.type = 'button';
    replayBtn.setAttribute('data-act', 'replay');
    top.appendChild(replayBtn);

    header.appendChild(top);
    return header;
  }

  // ---- region: 내 질문 버블 (다크, 오른쪽 정렬, "나") ----

  function buildQuestionBubble(q) {
    var bubble = util.el('div', 'chat-bubble');
    var meta = util.el('div', 'chat-bubble__meta');
    meta.appendChild(util.el('span', 'chat-bubble__author', '나'));
    meta.appendChild(util.el('span', 'chat-bubble__time', util.ago(q.agoMin)));
    bubble.appendChild(meta);
    bubble.appendChild(util.el('p', 'chat-bubble__text', q.title));
    if (q.body) {
      bubble.appendChild(util.el('p', 'chat-bubble__text chat-bubble__text--sub', q.body));
    }
    return bubble;
  }

  // ---- region: 타이핑 인디케이터 / 입장 알림 pill ----

  function buildTypingIndicator() {
    var wrap = util.el('div', 'chat-typing');
    wrap.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < 3; i++) {
      wrap.appendChild(util.el('span', 'chat-typing__dot'));
    }
    return wrap;
  }

  function buildSystemPill(text) {
    var pill = util.el('p', 'chat-pill', text);
    pill.classList.add('chat-fade-revealed');
    return pill;
  }

  // ---- region: 조건별 정리 ----

  function buildTally(q, answers) {
    var wrap = util.el('section', 'tally');
    wrap.appendChild(util.el('h3', 'tally__heading', '조건별 정리'));

    var rows = CW.match.tally(q, answers);
    var list = util.el('ul', 'tally-list');

    rows.forEach(function (row) {
      var li = util.tpl('tpl-tally-row');
      util.setText(li, 'label', row.label);

      var countText = row.count + '명';
      if (row.quitCount > 0) countText += ' (그중 접은 사람 ' + row.quitCount + '명)';
      util.setText(li, 'count', countText);

      var bar = util.slot(li, 'bar');
      if (bar) bar.style.width = row.pct + '%';

      list.appendChild(li);
    });

    wrap.appendChild(list);
    return wrap;
  }

  // ---- region: 필터 줄 ----

  function buildFilterRow() {
    var myTags = CW.match.myTags();
    var row = util.el('div', 'filter-row');

    var toggleBtn = util.el('button', 'filter-toggle', '내 조건과 같은 답만');
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('data-act', 'toggle-mine');
    if (myTags.length === 0) {
      toggleBtn.classList.add('is-disabled');
    } else if (mineFilterOn) {
      toggleBtn.classList.add('is-active');
    }
    row.appendChild(toggleBtn);

    if (myTags.length === 0) {
      var hint = util.el('a', 'filter-row__hint', '내 조건을 먼저 정해 주세요');
      hint.setAttribute('href', '#/me');
      row.appendChild(hint);
    } else {
      row.appendChild(util.el('span', 'filter-row__tags', myTags.join(' · ') + ' 기준'));
    }

    return row;
  }

  // ---- region: 답변 버블 ----

  function fillPickLine(card, q, a) {
    var slot = util.slot(card, 'pick');
    if (!slot) return;
    slot.textContent = '';
    var pickLabel = a.pickText || optionLabel(q, a.pickKey);
    if (!pickLabel) return;
    slot.appendChild(document.createTextNode('그때 고른 것 → '));
    var strong = document.createElement('strong');
    strong.className = 'chat-pick-value';
    strong.textContent = pickLabel;
    slot.appendChild(strong);
  }

  function buildAnswerCard(a, q) {
    var card = util.tpl('tpl-answer-card');
    card.setAttribute('data-id', a.id);

    fillPickLine(card, q, a);
    util.setText(card, 'why', a.why);

    var tagsWrap = util.slot(card, 'tags');
    if (tagsWrap) {
      var myTags = CW.match.myTags();
      (a.tags || []).forEach(function (tag) {
        var chip = util.tpl('tpl-tag-chip');
        util.setText(chip, 'label', tag);
        if (myTags.indexOf(tag) !== -1) chip.classList.add('is-match');
        tagsWrap.appendChild(chip);
      });
    }

    var avatarEl = util.slot(card, 'avatar');
    if (avatarEl) {
      avatarEl.textContent = a.author.nick ? a.author.nick.charAt(0) : '';
      avatarEl.setAttribute('data-avatar', String(a.author.avatar));
      var answerAvatarIll = (CW.icons && CW.icons.avatar) ? CW.icons.avatar(a.author.avatar) : null;
      if (answerAvatarIll) {
        avatarEl.textContent = '';
        answerAvatarIll.setAttribute('aria-hidden', 'true');
        avatarEl.appendChild(answerAvatarIll);
      }
    }
    util.setText(card, 'nick', a.author.nick);
    util.setText(card, 'time', util.ago(a.agoMin));

    // quit 답변도 성공 답변과 정확히 같은 크기·배경·목록 위치를 쓴다 — 접은
    // 사람도 동등하게 남는다는 게 이 화면의 핵심 명제(PRD 4.4)이므로, 여기서
    // opacity를 낮추거나 회색으로 바꾸거나 줄이는 짓은 하지 않는다. 라벨 하나만
    // 붙인다.
    if (a.quit) {
      var quitTag = card.querySelector('.tag-quit');
      if (quitTag) quitTag.classList.remove('is-hidden');
    }

    var matchCount = CW.match.matchCount(a);
    if (matchCount > 0) {
      util.setText(card, 'count', '조건 ' + matchCount + '개 같음');
      var badge = util.slot(card, 'count');
      if (badge) badge.classList.remove('is-hidden');
    }

    // 본인이 방금 쓴 답은 "나" 버블처럼 다크 배경 + 오른쪽 정렬로 보인다
    // (영상 참조 프레임의 구분 방식). 시각만 css/motion-chat.css에서 처리.
    if (a.src === 'user') card.classList.add('is-mine');

    return card;
  }

  // ---- region: 채팅 스트림(질문 버블 + 답변 목록 또는 빈 상태) ----

  function displayAnswers(answers) {
    var effectiveFilter = mineFilterOn && CW.match.myTags().length > 0;
    return effectiveFilter ? answers.filter(function (a) { return CW.match.isMatch(a); }) : answers;
  }

  function buildStream(q, answers) {
    var stream = util.el('div', 'chat-stream');
    stream.appendChild(buildQuestionBubble(q));

    if (answers.length === 0) {
      var empty = util.tpl('tpl-empty');
      util.setText(empty, 'label', '아직 답이 없어요. 먼저 해보셨다면 한 줄 남겨 주세요.');
      stream.appendChild(empty);
      return stream;
    }

    var display = displayAnswers(answers);

    if (display.length === 0) {
      var empty2 = util.tpl('tpl-empty');
      util.setText(empty2, 'label', '조건이 겹치는 답이 아직 없어요. 필터를 꺼 보세요.');
      stream.appendChild(empty2);
      return stream;
    }

    var ul = util.el('ul', 'answer-list');
    display.forEach(function (a) {
      ul.appendChild(buildAnswerCard(a, q));
    });
    stream.appendChild(ul);
    return stream;
  }

  // ---- region: 답 남기기 폼 ----

  function buildAnswerForm(q) {
    var wrap = util.el('section', 'answer-form chat-form');
    wrap.appendChild(util.el('h3', 'answer-form__heading', '답 남기기'));

    var hasOptions = Array.isArray(q.options) && q.options.length > 0;

    if (hasOptions) {
      wrap.appendChild(util.el('p', 'answer-form__label', '그때 고른 것'));
      var pickRow = util.el('div', 'chip-row');
      q.options.forEach(function (opt) {
        var chip = util.tpl('tpl-chip');
        chip.setAttribute('data-act', 'pick-select');
        chip.setAttribute('data-val', opt.key);
        util.setText(chip, 'label', opt.label);
        if (formPick === opt.key) chip.classList.add('is-active');
        pickRow.appendChild(chip);
      });
      wrap.appendChild(pickRow);
    }

    var pickTextLabel = util.el('label', 'answer-form__label', '한 줄 덧붙이기');
    var pickTextInput = document.createElement('input');
    pickTextInput.type = 'text';
    pickTextInput.className = 'answer-form__picktext';
    pickTextInput.maxLength = 24;
    pickTextInput.placeholder = '고른 걸 한 줄로 적어 주세요. 비워 두셔도 됩니다.';
    pickTextInput.value = draftPickText;
    pickTextLabel.appendChild(pickTextInput);
    wrap.appendChild(pickTextLabel);

    var whyLabel = util.el('label', 'answer-form__label', '왜 그렇게 정했는지');
    var whyInput = document.createElement('textarea');
    whyInput.className = 'answer-form__why';
    whyInput.rows = 3;
    whyInput.maxLength = 150;
    whyInput.placeholder = '왜 그렇게 정했는지 한 줄로.';
    whyInput.value = draftWhy;
    whyLabel.appendChild(whyInput);
    wrap.appendChild(whyLabel);

    var myTags = CW.match.myTags();
    if (myTags.length > 0) {
      wrap.appendChild(util.el('p', 'answer-form__label', '내 조건'));
      var tagRow = util.el('div', 'chip-row');
      myTags.forEach(function (tag) {
        var chip = util.tpl('tpl-chip');
        chip.setAttribute('data-act', 'ans-tag');
        chip.setAttribute('data-val', tag);
        util.setText(chip, 'label', tag);
        if (formTags.indexOf(tag) !== -1) chip.classList.add('is-active');
        tagRow.appendChild(chip);
      });
      wrap.appendChild(tagRow);
    }

    var quitLabel = util.el('label', 'answer-form__quit-label');
    var quitInput = document.createElement('input');
    quitInput.type = 'checkbox';
    quitInput.className = 'answer-form__quit';
    quitInput.checked = draftQuit;
    quitLabel.appendChild(quitInput);
    quitLabel.appendChild(document.createTextNode('이건 접었어요'));
    wrap.appendChild(quitLabel);

    if (formError) {
      wrap.appendChild(util.el('p', 'answer-form__error', formError));
    }

    var submitBtn = util.el('button', 'btn btn--primary', '답 남기기');
    submitBtn.type = 'button';
    submitBtn.setAttribute('data-act', 'answer-submit');
    wrap.appendChild(submitBtn);

    return wrap;
  }

  // ---- 입장 알림 pill (리빌 끝난 뒤에만 돈다) ----

  function startSystemPills(q, answers, myRunId, streamEl) {
    var nicks = [];
    answers.forEach(function (a) {
      var nick = a && a.author && a.author.nick;
      if (nick && nicks.indexOf(nick) === -1) nicks.push(nick);
    });
    if (nicks.length === 0) return;

    var shown = 0;

    function tick() {
      if (runId !== myRunId) return;               // 다른 질문/재생으로 넘어갔다 — 멈춘다
      if (!streamEl || !document.body.contains(streamEl)) return; // 라우트가 바뀌어 DOM에서 빠졌다
      if (shown >= 3) return;
      var nick = nicks[shown % nicks.length];
      streamEl.appendChild(buildSystemPill(nick + '님이 들어왔어요'));
      shown++;
      if (shown < 3) schedule(tick, 7000);
    }

    schedule(tick, 7000);
  }

  // ---- 즉시 렌더(재방문 / 필터 조작 / 폼 조작 / 제출 후 / reduced-motion) ----

  function renderFull() {
    var q = CW.store.question(questionId);
    if (!q) {
      CW.router.go('#/rooms');
      return;
    }

    // 진행 중이던 리빌이 있었다면 여기서 확실히 끊는다 — 필터 토글, 칩 선택,
    // 답 제출 전부 이 함수를 거치므로 "제출하면 리빌을 취소하고 한 번에
    // 보여준다"는 요구가 자동으로 만족된다.
    clearTimers();
    runId++;

    var answers = CW.store.answersByQuestion(questionId);

    rootEl.replaceChildren();

    var backBtn = util.el('button', 'btn btn--ghost back-btn', '← 뒤로');
    backBtn.type = 'button';
    backBtn.setAttribute('data-act', 'back');
    rootEl.appendChild(backBtn);

    var room = CW.store.room(q.roomId);
    rootEl.appendChild(buildChatHeader(q, room));
    rootEl.appendChild(buildStream(q, answers));

    if (answers.length > 0) {
      rootEl.appendChild(buildTally(q, answers));
    }

    rootEl.appendChild(buildFilterRow());
    rootEl.appendChild(buildAnswerForm(q));
  }

  // ---- 타임드 리빌(같은 세션에서 이 질문을 처음 열었을 때만) ----

  function playReveal() {
    var q = CW.store.question(questionId);
    if (!q) {
      CW.router.go('#/rooms');
      return;
    }

    clearTimers();
    runId++;
    var myRunId = runId;

    var answers = CW.store.answersByQuestion(questionId);

    rootEl.replaceChildren();

    var backBtn = util.el('button', 'btn btn--ghost back-btn', '← 뒤로');
    backBtn.type = 'button';
    backBtn.setAttribute('data-act', 'back');
    rootEl.appendChild(backBtn);

    var room = CW.store.room(q.roomId);
    rootEl.appendChild(buildChatHeader(q, room));

    var stream = util.el('div', 'chat-stream');
    rootEl.appendChild(stream);
    stream.appendChild(buildQuestionBubble(q));

    var ul = util.el('ul', 'answer-list');
    stream.appendChild(ul);

    var bubbles = answers.map(function (a) {
      var card = buildAnswerCard(a, q);
      card.classList.add('chat-pending');
      card.setAttribute('aria-hidden', 'true');
      ul.appendChild(card);
      return card;
    });

    var typingEl = buildTypingIndicator();
    stream.appendChild(typingEl);

    var tallyCard = null;
    if (answers.length > 0) {
      tallyCard = buildTally(q, answers);
      tallyCard.classList.add('chat-pending');
      tallyCard.setAttribute('aria-hidden', 'true');
      rootEl.appendChild(tallyCard);
    }

    var filterRow = buildFilterRow();
    filterRow.classList.add('chat-pending');
    filterRow.setAttribute('aria-hidden', 'true');
    rootEl.appendChild(filterRow);

    var formEl = buildAnswerForm(q);
    // 폼은 처음부터 DOM에 그대로 있고 클릭·입력도 막지 않는다(요구사항: 리빌
    // 중에도 폼은 바로 쓸 수 있어야 한다) — chat-fade-pending은 opacity만
    // 낮출 뿐 pointer-events는 건드리지 않는다. 실제로 여기서 제출하면
    // answer-submit → renderFull()이 리빌을 즉시 끊고 한 번에 그린다.
    formEl.classList.add('chat-fade-pending');
    rootEl.appendChild(formEl);

    // 답변 개수가 많아도 전체 재생 시간이 대략 6초를 넘지 않도록 간격을 줄인다.
    var n = answers.length;
    var gap = 900;
    if (n > 1) {
      gap = Math.min(gap, 3600 / (n - 1));
      if (gap < 150) gap = 150;
    }

    schedule(function () {
      if (runId !== myRunId) return;
      typingEl.classList.add('is-visible');
    }, 450);

    var lastArrival = 1100;
    for (var i = 0; i < n; i++) {
      (function (bubble, t) {
        lastArrival = t;
        schedule(function () {
          if (runId !== myRunId) return;
          bubble.classList.remove('chat-pending');
          bubble.removeAttribute('aria-hidden');
          bubble.classList.add('chat-revealed');
        }, t);
      })(bubbles[i], 1100 + i * gap);
    }

    var tallyAt = (n > 0 ? lastArrival : 450) + 600;
    schedule(function () {
      if (runId !== myRunId) return;
      typingEl.classList.remove('is-visible');
      if (tallyCard) {
        tallyCard.classList.remove('chat-pending');
        tallyCard.removeAttribute('aria-hidden');
        tallyCard.classList.add('chat-revealed');
      }
      filterRow.classList.remove('chat-pending');
      filterRow.removeAttribute('aria-hidden');
      filterRow.classList.add('chat-revealed');
    }, tallyAt);

    schedule(function () {
      if (runId !== myRunId) return;
      formEl.classList.remove('chat-fade-pending');
      formEl.classList.add('chat-fade-revealed');
      startSystemPills(q, answers, myRunId, stream);
    }, tallyAt + 700);
  }

  // ---- assembly ----

  function render(root, params) {
    rootEl = root;
    var newParams = params || {};
    var newId = newParams.id;

    if (!currentParams || currentParams.id !== newId) {
      mineFilterOn = false;
      resetFormState();
    }
    currentParams = newParams;
    questionId = newId;

    // 라우트가 바뀔 때마다(같은 질문으로 돌아오는 경우 포함) 지난 리빌·입장
    // 알림 타이머를 전부 끊는다.
    clearTimers();
    runId++;

    root.replaceChildren();

    if (!CW.store.question(questionId)) {
      CW.router.go('#/rooms');
      return;
    }

    var firstOpen = !playedIds.has(questionId);
    if (firstOpen) playedIds.add(questionId);

    var answers = CW.store.answersByQuestion(questionId);
    var shouldPlay = firstOpen && answers.length > 0 && !prefersReducedMotion();

    if (shouldPlay) {
      playReveal();
    } else {
      renderFull();
    }
  }

  function submitAnswer() {
    var q = CW.store.question(questionId);
    if (!q) {
      CW.router.go('#/rooms');
      return;
    }

    var pickTextInput = util.$('.answer-form__picktext', rootEl);
    var whyInput = util.$('.answer-form__why', rootEl);
    var quitInput = util.$('.answer-form__quit', rootEl);

    var pickText = pickTextInput ? pickTextInput.value.trim() : '';
    var why = whyInput ? whyInput.value.trim() : '';
    var quit = quitInput ? quitInput.checked : false;

    var hasOptions = Array.isArray(q.options) && q.options.length > 0;

    if (hasOptions && !formPick) {
      formError = '그때 고른 것을 하나 골라 주세요.';
      draftPickText = pickText;
      draftWhy = why;
      draftQuit = quit;
      renderFull();
      return;
    }

    if (why.length < 5) {
      formError = '왜 그렇게 정했는지 조금만 더 적어 주세요.';
      draftPickText = pickText;
      draftWhy = why;
      draftQuit = quit;
      renderFull();
      return;
    }

    var pickKey = hasOptions ? formPick : '';

    // pickText is stored exactly as typed (may be empty) — the option label
    // fallback happens only at display time (buildAnswerCard), never here.
    // Aggregation always groups by pickKey (plan 4.2), never by this text.
    CW.store.addAnswer({
      questionId: questionId,
      pickKey: pickKey,
      pickText: pickText,
      why: why,
      tags: formTags.slice(),
      quit: quit
    });

    resetFormState();
    // 방금 쓴 답을 즉시 반영 — 절대 리빌을 다시 재생하지 않는다.
    renderFull();
  }

  function act(action, ctx) {
    if (action === 'back') {
      CW.router.back();
      return;
    }
    if (action === 'toggle-mine') {
      if (CW.match.myTags().length === 0) return;
      mineFilterOn = !mineFilterOn;
      renderFull();
      return;
    }
    if (action === 'pick-select') {
      syncDraftFromDom();
      formPick = ctx.val;
      formError = '';
      renderFull();
      return;
    }
    if (action === 'ans-tag') {
      syncDraftFromDom();
      var tag = ctx.val;
      var i = formTags.indexOf(tag);
      if (i !== -1) {
        formTags.splice(i, 1);
      } else if (formTags.length < 3) {
        formTags.push(tag);
      }
      renderFull();
      return;
    }
    if (action === 'answer-submit') {
      submitAnswer();
      return;
    }
    if (action === 'replay') {
      // 발표자가 일부러 다시 트는 버튼 — 이미 재생된 질문이어도 강제로 다시 돈다.
      var q = CW.store.question(questionId);
      if (!q) {
        CW.router.go('#/rooms');
        return;
      }
      var answers = CW.store.answersByQuestion(questionId);
      if (answers.length > 0 && !prefersReducedMotion()) {
        playReveal();
      } else {
        renderFull();
      }
      return;
    }
  }

  CW.views.question = {
    render: render,
    act: act
  };
})();
