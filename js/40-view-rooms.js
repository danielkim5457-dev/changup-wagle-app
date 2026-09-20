'use strict';
(function () {
  // #/rooms — 방 목록(홈). 업종·단계 칩으로 좁혀 방을 고르는 첫 화면.
  //
  // 필터를 누르면 리스트를 다시 그리지 않는다. 35개 카드는 처음 한 번만
  // 그리고, 이후에는 매치 여부에 따라 .is-dim 클래스와 style.order만
  // 바꾼다 — "35개가 1개로 좁혀지는 장면"이 이 화면의 핵심 연출이므로,
  // 카드가 사라지는 대신 색을 잃고 뒤로 물러나야 한다.

  var util = CW.util;
  var enums = CW.enums;

  var rootEl = null;
  var currentParams = null;

  // Transient filter state — never goes in the URL (plan 4.1).
  var filter = { cat: enums.ALL, stage: enums.ALL };

  // 화면이 살아있는 동안 계속 참조하는 노드/상태.
  var gridEl = null;
  var countNumEl = null;
  var cardsById = null;       // Map<roomId, cardEl> — 전체 렌더 때 한 번만 채움
  var lastCount = null;       // 카운트 애니메이션의 이전 값
  var countAnimId = null;     // requestAnimationFrame 핸들
  var entranceCleanupTimer = null;

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  }

  function buildChipRow(values, activeVal, act, extraCls) {
    var wrap = util.el('div', 'chip-row-wrap');
    var row = util.el('div', 'chip-row');
    var all = [enums.ALL].concat(values);
    all.forEach(function (v) {
      var chip = util.tpl('tpl-chip');
      chip.setAttribute('data-act', act);
      chip.setAttribute('data-val', v);
      if (extraCls) chip.classList.add(extraCls);
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

  function addCatIcon(card, room) {
    if (!CW.icons || !CW.icons.cat || !CW.icons.cat[room.cat]) return;
    var symbolId = CW.icons.cat[room.cat];
    if (!symbolId || typeof CW.icons.use !== 'function') return;
    var icon = CW.icons.use(symbolId, 'room-card__icon');
    if (!icon) return;
    var head = card.querySelector('.room-card__head');
    if (head) head.insertBefore(icon, head.firstChild);
  }

  // Applies derived stats (title/time/unread/live) to an existing card's
  // slots and reports which visible bits actually changed, so the caller
  // can flash only what moved.
  function applyStats(card, stats) {
    var titleEl = util.slot(card, 'title');
    var timeEl = util.slot(card, 'time');
    var unreadEl = util.slot(card, 'unread');
    var liveDot = card.querySelector('.live-dot');

    var newTitle = stats.lastTitle || '아직 조용해요';
    var newTime = stats.lastTitle ? util.ago(stats.agoMin) : '';
    var newUnreadText = stats.unread > 0 ? '새 글 ' + stats.unread : '';

    var titleChanged = !!titleEl && titleEl.textContent !== newTitle;
    var timeChanged = !!timeEl && timeEl.textContent !== newTime;
    var unreadChanged = !!unreadEl && unreadEl.textContent !== newUnreadText;

    util.setText(card, 'title', newTitle);
    util.setText(card, 'time', newTime);

    if (stats.unread > 0) {
      util.setText(card, 'unread', newUnreadText);
      if (unreadEl) unreadEl.classList.remove('is-hidden');
    } else {
      util.setText(card, 'unread', '');
      if (unreadEl) unreadEl.classList.add('is-hidden');
    }

    if (liveDot) {
      if (stats.live) {
        liveDot.classList.remove('is-hidden');
        liveDot.classList.add('is-live');
      } else {
        liveDot.classList.add('is-hidden');
        liveDot.classList.remove('is-live');
      }
    }

    return { titleChanged: titleChanged, timeChanged: timeChanged, unreadChanged: unreadChanged };
  }

  // Restarts a CSS animation on `node` by forcing reflow, so a card that
  // updates twice in a row sparkles both times instead of once.
  // `ms` lets callers pick a cleanup delay that matches their own
  // animation's duration (defaults to the 900ms live-pulse case).
  function replayAnim(node, cls, ms) {
    if (!node) return;
    var duration = typeof ms === 'number' ? ms : 900;
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
    setTimeout(function () {
      node.classList.remove(cls);
    }, duration);
  }

  function flashCard(card, changed) {
    replayAnim(card, 'is-fresh');
    if (changed.titleChanged || changed.timeChanged) {
      replayAnim(util.slot(card, 'time'), 'is-bump');
    }
    if (changed.unreadChanged) {
      replayAnim(util.slot(card, 'unread'), 'is-bump');
    }
  }

  // Fires after CW.live nudges one room's data. Repaints only that card so
  // scroll position, focus and the chip row are never disturbed.
  function handleTick(roomId) {
    if (!rootEl || !document.body.contains(rootEl) || CW.router.current().name !== 'rooms') {
      CW.live.stop();
      return;
    }
    var room = CW.store.room(roomId);
    if (!room || !matchesFilter(room)) return; // dimmed — never flash a room that's filtered out

    var card = cardsById ? cardsById.get(roomId) : null;
    if (!card) return;

    var stats = CW.store.roomStats(roomId);
    var changed = applyStats(card, stats);
    flashCard(card, changed);
  }

  function buildRoomCard(room) {
    var card = util.tpl('tpl-room-card');
    card.setAttribute('data-id', room.id);
    util.setText(card, 'room', room.cat);
    util.setText(card, 'stage', room.stage);
    util.setText(card, 'desc', room.desc);
    util.setText(card, 'members', room.members);
    addCatIcon(card, room);

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

  // Ticks the count line from its old value to `newCount` over ~400ms.
  // A ±1 change (or reduced-motion) just snaps — animating 35→34 is noise.
  function animateCount(newCount) {
    if (!countNumEl) return;
    var oldCount = (lastCount === null) ? newCount : lastCount;
    lastCount = newCount;
    var diff = newCount - oldCount;

    if (countAnimId !== null) {
      cancelAnimationFrame(countAnimId);
      countAnimId = null;
    }

    if (diff === 0 || Math.abs(diff) === 1 || prefersReducedMotion()) {
      countNumEl.textContent = String(newCount);
      return;
    }

    var duration = 400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min(1, (ts - start) / duration);
      countNumEl.textContent = String(Math.round(oldCount + diff * progress));
      if (progress < 1) {
        countAnimId = requestAnimationFrame(step);
      } else {
        countNumEl.textContent = String(newCount);
        countAnimId = null;
      }
    }
    countAnimId = requestAnimationFrame(step);
  }

  // Walks every already-drawn card and toggles dim/order/interactivity —
  // never rebuilds the grid. Matching cards float to the front via
  // style.order (grid honours it same as flex, no DOM move needed) and get
  // a brief pulse the moment they *become* matching.
  function applyFilterState() {
    if (!gridEl || !cardsById) return;

    var allRooms = CW.store.rooms();
    var matchCount = 0;
    var missCount = 0;
    var pulseCards = [];

    allRooms.forEach(function (room) {
      var card = cardsById.get(room.id);
      if (!card) return;

      var isMatch = matchesFilter(room);
      var wasDim = card.classList.contains('is-dim');

      if (isMatch) {
        if (wasDim) pulseCards.push(card);
        card.classList.remove('is-dim');
        card.tabIndex = 0;
        card.setAttribute('data-act', 'open-room'); // restore clickability
        card.style.order = String(matchCount);
        matchCount++;
      } else {
        card.classList.add('is-dim');
        card.tabIndex = -1;
        card.removeAttribute('data-act'); // belt-and-suspenders: no data-act means the
        card.style.order = String(100 + missCount); // delegated click/keydown handlers ignore it
        missCount++;
      }
    });

    pulseCards.forEach(function (card) {
      replayAnim(card, 'is-match-pulse', 600);
    });

    animateCount(matchCount);
  }

  // Rebuilds the two chip rows' active state in place (cheap — 13 buttons)
  // and re-applies dim/order to the untouched card grid.
  function refreshFilter() {
    util.$$('[data-act="filter-cat"]', rootEl).forEach(function (chip) {
      chip.classList.toggle('is-active', chip.getAttribute('data-val') === filter.cat);
    });
    util.$$('[data-act="filter-stage"]', rootEl).forEach(function (chip) {
      chip.classList.toggle('is-active', chip.getAttribute('data-val') === filter.stage);
    });
    applyFilterState();
  }

  // Full draw — chips, count line, and every room card. Runs once per
  // `render()` (route entry), never on a filter press.
  function buildLayout() {
    rootEl.replaceChildren();
    cardsById = new Map();

    var chipsWrap = util.el('div', 'rooms-chips');
    chipsWrap.appendChild(buildChipRow(enums.CATS, filter.cat, 'filter-cat'));
    chipsWrap.appendChild(buildChipRow(enums.STAGES, filter.stage, 'filter-stage', 'chip--stage'));
    rootEl.appendChild(chipsWrap);

    var countLine = util.el('p', 'rooms-count');
    countLine.appendChild(document.createTextNode('지금 열린 방 '));
    countNumEl = util.el('span', 'rooms-count__num', '0');
    countLine.appendChild(countNumEl);
    countLine.appendChild(document.createTextNode('개'));
    rootEl.appendChild(countLine);

    var allRooms = CW.store.rooms();

    if (allRooms.length === 0) {
      var empty = util.tpl('tpl-empty');
      util.setText(empty, 'label', '이 조건은 아직 조용해요. 축을 하나 풀어 보세요.');
      rootEl.appendChild(empty);
      gridEl = null;
      lastCount = 0;
      countNumEl.textContent = '0';
      return;
    }

    gridEl = util.el('div', 'room-grid');

    // ~25ms stagger, but clamped so the total never runs past ~500ms —
    // with 35 rooms a flat 25ms/card would take 850ms for the last card.
    var n = allRooms.length;
    var maxTotalDelay = 500;
    var step = n > 1 ? Math.min(25, maxTotalDelay / (n - 1)) : 0;

    allRooms.forEach(function (room, i) {
      var card = buildRoomCard(room);
      card.classList.add('is-entering');
      card.style.animationDelay = Math.round(i * step) + 'ms';
      cardsById.set(room.id, card);
      gridEl.appendChild(card);
    });
    rootEl.appendChild(gridEl);

    lastCount = null; // no previous value yet — first count paint should not tick
    applyFilterState();

    if (entranceCleanupTimer !== null) clearTimeout(entranceCleanupTimer);
    var totalEntranceMs = Math.round((n - 1) * step) + 420 + 80;
    entranceCleanupTimer = setTimeout(function () {
      cardsById.forEach(function (card) { card.classList.remove('is-entering'); });
      entranceCleanupTimer = null;
    }, totalEntranceMs);
  }

  function render(root, params) {
    CW.live.stop(); // no other view tears this down for us — always restart clean
    rootEl = root;
    currentParams = params || {};
    filter = { cat: enums.ALL, stage: enums.ALL };

    if (entranceCleanupTimer !== null) {
      clearTimeout(entranceCleanupTimer);
      entranceCleanupTimer = null;
    }
    if (countAnimId !== null) {
      cancelAnimationFrame(countAnimId);
      countAnimId = null;
    }
    cardsById = null;
    gridEl = null;
    countNumEl = null;
    lastCount = null;

    root.replaceChildren();
    buildLayout();
    CW.live.start(handleTick);
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
      refreshFilter();
      return;
    }
    if (action === 'filter-stage') {
      toggleAxis('stage', ctx.val);
      refreshFilter();
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
