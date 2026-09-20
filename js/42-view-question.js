'use strict';
(function () {
  // #/q/:id — 질문 상세. 조건별 정리(집계) + 내 조건 필터 + 답변 목록 + 답 남기기 폼.
  // 이 화면이 제품 명제 전부를 보여준다: 같은 선택 안에서도 접은 사람이 섞여 있다는 것,
  // 그리고 방금 쓴 답이 그 자리에서 집계에 반영된다는 것.

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

  // ---- region 1: question card ----

  function buildQuestionCard(q) {
    var card = util.el('header', 'question-card');

    var room = CW.store.room(q.roomId);
    if (room) {
      card.appendChild(util.el('p', 'question-card__room', room.cat + ' · ' + room.stage));
    }

    card.appendChild(util.el('h2', 'question-card__title', q.title));

    if (q.body) {
      card.appendChild(util.el('p', 'question-card__body', q.body));
    }

    var authorLine = util.el('div', 'question-card__author');
    var avatar = util.el('span', 'avatar', q.author.nick ? q.author.nick.charAt(0) : '');
    avatar.setAttribute('data-avatar', String(q.author.avatar));
    var avatarIll = (CW.icons && CW.icons.avatar) ? CW.icons.avatar(q.author.avatar) : null;
    if (avatarIll) {
      avatar.textContent = '';
      avatarIll.setAttribute('aria-hidden', 'true');
      avatar.appendChild(avatarIll);
    }
    authorLine.appendChild(avatar);
    authorLine.appendChild(util.el('span', 'author__nick', q.author.nick));
    authorLine.appendChild(util.el('span', 'question-card__time', util.ago(q.agoMin)));
    card.appendChild(authorLine);

    return card;
  }

  // ---- region 2: 조건별 정리 ----

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

  // ---- region 3: 필터 줄 ----

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

  // ---- region 4: 답변 목록 ----

  function buildAnswerCard(a, q) {
    var card = util.tpl('tpl-answer-card');
    card.setAttribute('data-id', a.id);

    var pickLabel = a.pickText || optionLabel(q, a.pickKey);
    util.setText(card, 'pick', pickLabel);
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

    if (a.src === 'user') card.classList.add('is-mine');

    return card;
  }

  function buildAnswerSection(q, answers) {
    var section = util.el('section', 'answer-list-section');

    if (answers.length === 0) {
      var empty = util.tpl('tpl-empty');
      util.setText(empty, 'label', '아직 답이 없어요. 먼저 해보셨다면 한 줄 남겨 주세요.');
      section.appendChild(empty);
      return section;
    }

    var effectiveFilter = mineFilterOn && CW.match.myTags().length > 0;
    var display = effectiveFilter ? answers.filter(function (a) { return CW.match.isMatch(a); }) : answers;

    if (display.length === 0) {
      var empty2 = util.tpl('tpl-empty');
      util.setText(empty2, 'label', '조건이 겹치는 답이 아직 없어요. 필터를 꺼 보세요.');
      section.appendChild(empty2);
      return section;
    }

    var ul = util.el('ul', 'answer-list');
    display.forEach(function (a) {
      ul.appendChild(buildAnswerCard(a, q));
    });
    section.appendChild(ul);
    return section;
  }

  // ---- region 5: 답 남기기 폼 ----

  function buildAnswerForm(q) {
    var wrap = util.el('section', 'answer-form');
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

  // ---- assembly ----

  function rerender() {
    var q = CW.store.question(questionId);
    if (!q) {
      CW.router.go('#/rooms');
      return;
    }

    rootEl.replaceChildren();

    var backBtn = util.el('button', 'btn btn--ghost back-btn', '← 뒤로');
    backBtn.type = 'button';
    backBtn.setAttribute('data-act', 'back');
    rootEl.appendChild(backBtn);

    rootEl.appendChild(buildQuestionCard(q));

    var answers = CW.store.answersByQuestion(questionId);

    if (answers.length > 0) {
      rootEl.appendChild(buildTally(q, answers));
    }

    rootEl.appendChild(buildFilterRow());
    rootEl.appendChild(buildAnswerSection(q, answers));
    rootEl.appendChild(buildAnswerForm(q));
  }

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

    root.replaceChildren();

    if (!CW.store.question(questionId)) {
      CW.router.go('#/rooms');
      return;
    }

    rerender();
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
      rerender();
      return;
    }

    if (why.length < 5) {
      formError = '왜 그렇게 정했는지 조금만 더 적어 주세요.';
      draftPickText = pickText;
      draftWhy = why;
      draftQuit = quit;
      rerender();
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
    rerender();
  }

  function act(action, ctx) {
    if (action === 'back') {
      CW.router.back();
      return;
    }
    if (action === 'toggle-mine') {
      if (CW.match.myTags().length === 0) return;
      mineFilterOn = !mineFilterOn;
      rerender();
      return;
    }
    if (action === 'pick-select') {
      syncDraftFromDom();
      formPick = ctx.val;
      formError = '';
      rerender();
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
      rerender();
      return;
    }
    if (action === 'answer-submit') {
      submitAnswer();
      return;
    }
  }

  CW.views.question = {
    render: render,
    act: act
  };
})();
