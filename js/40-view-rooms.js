'use strict';
(function () {
  // #/rooms — 방 목록(홈). 업종·단계 칩으로 좁혀 방을 고르는 첫 화면.

  var util = CW.util;
  var enums = CW.enums;

  var rootEl = null;
  var currentParams = null;

  // Transient filter state — never goes in the URL (plan 4.1).
  var filter = { cat: enums.ALL, stage: enums.ALL };

  function buildChipRow(values, activeVal, act) {
    var wrap = util.el('div', 'chip-row-wrap');
    var row = util.el('div', 'chip-row');
    var all = [enums.ALL].concat(values);
    all.forEach(function (v) {
      var chip = util.tpl('tpl-chip');
      chip.setAttribute('data-act', act);
      chip.setAttribute('data-val', v);
      util.setText(chip, 'label', v);
      if (v === activeVal) chip.classList.add('is-active');
      row.appendChild(chip);
    });
    wrap.appendChild(row);
    return wrap;
  }

  function matchesFilter(room) {
    var catOk = filter.cat === enums.ALL || room.cat === filter.cat;
    var stageOk = filter.stage === enums.ALL || room.stage === filter.stage;
    return catOk && stageOk;
  }

  function buildRoomCard(room) {
    var card = util.tpl('tpl-room-card');
    card.setAttribute('data-id', room.id);
    util.setText(card, 'room', room.cat);
    util.setText(card, 'stage', room.stage);
    util.setText(card, 'desc', room.desc);
    util.setText(card, 'members', room.members);

    var stats = CW.store.roomStats(room.id);
    util.setText(card, 'title', stats.lastTitle || '아직 조용해요');
    util.setText(card, 'time', stats.lastTitle ? util.ago(stats.agoMin) : '');

    var unreadEl = util.slot(card, 'unread');
    if (stats.unread > 0) {
      util.setText(card, 'unread', '새 글 ' + stats.unread);
      if (unreadEl) unreadEl.classList.remove('is-hidden');
    }

    var liveDot = card.querySelector('.live-dot');
    if (liveDot && stats.live) {
      liveDot.classList.remove('is-hidden');
      liveDot.classList.add('is-live');
    }

    return card;
  }

  function rerender() {
    rootEl.replaceChildren();

    rootEl.appendChild(buildChipRow(enums.CATS, filter.cat, 'filter-cat'));
    rootEl.appendChild(buildChipRow(enums.STAGES, filter.stage, 'filter-stage'));

    var allRooms = CW.store.rooms();
    var filtered = allRooms.filter(matchesFilter);

    var countLine = util.el('p', 'rooms-count');
    countLine.appendChild(document.createTextNode('지금 열린 방 '));
    var numEl = util.el('span', 'rooms-count__num', String(filtered.length));
    countLine.appendChild(numEl);
    countLine.appendChild(document.createTextNode('개'));
    rootEl.appendChild(countLine);

    if (filtered.length === 0) {
      var empty = util.tpl('tpl-empty');
      util.setText(empty, 'label', '이 조건은 아직 조용해요. 축을 하나 풀어 보세요.');
      rootEl.appendChild(empty);
      return;
    }

    var grid = util.el('div', 'room-grid');
    filtered.forEach(function (room) {
      grid.appendChild(buildRoomCard(room));
    });
    rootEl.appendChild(grid);
  }

  function render(root, params) {
    rootEl = root;
    currentParams = params || {};
    filter = { cat: enums.ALL, stage: enums.ALL };
    root.replaceChildren();
    rerender();
  }

  function toggleAxis(axisKey, val) {
    if (val === enums.ALL) {
      filter[axisKey] = enums.ALL;
      return;
    }
    filter[axisKey] = (filter[axisKey] === val) ? enums.ALL : val;
  }

  function act(action, ctx) {
    if (action === 'filter-cat') {
      toggleAxis('cat', ctx.val);
      rerender();
      return;
    }
    if (action === 'filter-stage') {
      toggleAxis('stage', ctx.val);
      rerender();
      return;
    }
    if (action === 'open-room') {
      CW.router.go('#/room/' + encodeURIComponent(ctx.id));
      return;
    }
  }

  CW.views.rooms = {
    render: render,
    act: act
  };
})();
