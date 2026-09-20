'use strict';
(function () {
  // #/room/:id — 방 상세. 질문 목록 + 인라인 "물어보기" 폼.

  var util = CW.util;

  var rootEl = null;
  var currentParams = null;
  var roomId = null;

  // Transient UI state, reset whenever the route param (roomId) changes.
  var askOpen = false;
  var askError = '';

  function splitOptions(raw) {
    var parts = String(raw || '').split(/[,，]/);
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      var t = parts[i].trim();
      if (!t) continue;
      out.push(util.clamp(t, 12));
      if (out.length >= 4) break;
    }
    return out;
  }

  function buildOptions(raw) {
    var labels = splitOptions(raw);
    if (labels.length === 0) {
      return [
        { key: 'yes', label: '했어요' },
        { key: 'no', label: '안 했어요' },
        { key: 'other', label: '다르게 했어요' }
      ];
    }
    return labels.map(function (label, i) {
      return { key: 'o' + (i + 1), label: label };
    });
  }

  function buildFormRow(labelText, inputTag, inputCls, attrs, placeholder) {
    var row = util.el('div', 'form__row');
    var label = util.el('label', 'form__label', labelText);
    var input = util.el(inputTag, inputCls);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) { input[k] = attrs[k]; });
    }
    if (placeholder) input.placeholder = placeholder;
    row.appendChild(label);
    row.appendChild(input);
    return row;
  }

  function buildAskForm() {
    var wrap = util.el('div', 'form ask-form');

    wrap.appendChild(buildFormRow(
      '제목', 'input', 'form__input ask-form__title',
      { type: 'text', maxLength: 40 }, '무엇이 고민이세요?'
    ));
    wrap.appendChild(buildFormRow(
      '내용', 'textarea', 'form__textarea ask-form__body',
      { rows: 3, maxLength: 200 }, '그때 상황을 짧게 적어 주세요. 길지 않아도 괜찮아요.'
    ));
    wrap.appendChild(buildFormRow(
      '답할 사람이 고를 보기', 'input', 'form__input ask-form__opts',
      { type: 'text', maxLength: 60 }, '쉼표로 나눠 적어 주세요. 비워 두셔도 됩니다.'
    ));

    if (askError) {
      var errorEl = util.el('p', 'form__hint ask-form__error', askError);
      wrap.appendChild(errorEl);
    }

    var btnRow = util.el('div', 'form__actions');
    var submitBtn = util.el('button', 'btn btn--primary', '물어보기');
    submitBtn.type = 'button';
    submitBtn.setAttribute('data-act', 'ask-submit');
    var cancelBtn = util.el('button', 'btn btn--ghost', '그만두기');
    cancelBtn.type = 'button';
    cancelBtn.setAttribute('data-act', 'ask-cancel');
    btnRow.appendChild(submitBtn);
    btnRow.appendChild(cancelBtn);
    wrap.appendChild(btnRow);

    return wrap;
  }

  function buildQuestionRow(q) {
    var row = util.tpl('tpl-question-row');
    row.setAttribute('data-id', q.id);
    util.setText(row, 'title', q.title);
    var count = CW.store.answersByQuestion(q.id).length;
    util.setText(row, 'count', '답 ' + count + '개');
    util.setText(row, 'time', util.ago(q.agoMin));
    if (q.src === 'user') row.classList.add('is-mine');
    return row;
  }

  function rerender() {
    var room = CW.store.room(roomId);
    if (!room) {
      CW.router.go('#/rooms');
      return;
    }

    rootEl.replaceChildren();

    var backBtn = util.el('button', 'back-link', '← 뒤로');
    backBtn.type = 'button';
    backBtn.setAttribute('data-act', 'back');
    rootEl.appendChild(backBtn);

    var header = util.el('header', 'room-header');
    var name = util.el('h2', 'room-header__name', room.cat + ' · ' + room.stage);
    var desc = util.el('p', 'room-header__desc', room.desc);
    var membersLine = util.el('p', 'room-header__members');
    membersLine.appendChild(document.createTextNode(String(room.members) + '명 참여 '));
    var exampleLabel = util.el('span', 'badge-example', '예시');
    membersLine.appendChild(exampleLabel);
    header.appendChild(name);
    header.appendChild(desc);
    header.appendChild(membersLine);
    rootEl.appendChild(header);

    if (!askOpen) {
      var askBtn = util.el('button', 'btn btn--primary', '물어보기');
      askBtn.type = 'button';
      askBtn.setAttribute('data-act', 'ask-open');
      rootEl.appendChild(askBtn);
    } else {
      rootEl.appendChild(buildAskForm());
    }

    var questions = CW.store.questionsByRoom(roomId);
    if (questions.length === 0) {
      var empty = util.tpl('tpl-empty');
      util.setText(empty, 'label', '아직 아무도 안 물어봤어요.');
      rootEl.appendChild(empty);
      return;
    }

    var list = util.el('ul', 'question-list');
    questions.forEach(function (q) {
      list.appendChild(buildQuestionRow(q));
    });
    rootEl.appendChild(list);
  }

  function render(root, params) {
    rootEl = root;
    var newParams = params || {};
    var newRoomId = newParams.id;

    if (!currentParams || currentParams.id !== newRoomId) {
      askOpen = false;
      askError = '';
    }
    currentParams = newParams;
    roomId = newRoomId;

    root.replaceChildren();

    if (!CW.store.room(roomId)) {
      CW.router.go('#/rooms');
      return;
    }

    rerender();
  }

  function submitAsk() {
    var titleInput = util.$('.ask-form__title', rootEl);
    var bodyInput = util.$('.ask-form__body', rootEl);
    var optsInput = util.$('.ask-form__opts', rootEl);

    var title = titleInput ? titleInput.value.trim() : '';
    var body = bodyInput ? bodyInput.value.trim() : '';
    var optsRaw = optsInput ? optsInput.value : '';

    if (title.length < 2) {
      askError = '제목을 두 글자 이상 적어 주세요.';
      rerender();
      return;
    }

    var options = buildOptions(optsRaw);

    CW.store.addQuestion({
      roomId: roomId,
      title: title,
      body: body,
      options: options
    });

    askOpen = false;
    askError = '';
    rerender();
  }

  function act(action, ctx) {
    if (action === 'back') {
      CW.router.back();
      return;
    }
    if (action === 'ask-open') {
      askOpen = true;
      askError = '';
      rerender();
      return;
    }
    if (action === 'ask-cancel') {
      askOpen = false;
      askError = '';
      rerender();
      return;
    }
    if (action === 'ask-submit') {
      submitAsk();
      return;
    }
    if (action === 'open-q') {
      CW.router.go('#/q/' + encodeURIComponent(ctx.id));
      return;
    }
  }

  CW.views.room = {
    render: render,
    act: act
  };
})();
