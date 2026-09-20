'use strict';
(function () {
  // #/check — 체크리스트. CW.seed.checklist 항목을 stage로 묶어 보여주고,
  // 클릭할 때마다 CW.store.checks()를 토글한다. 클릭은 여기서 듣지 않는다 —
  // 90-app.js의 단일 위임 리스너가 act()를 호출한다.

  var util = CW.util;

  var _root = null;
  var _params = null;

  function buildProgress(items, checks) {
    var total = items.length;
    var done = items.filter(function (item) {
      return checks[item.id] === true;
    }).length;

    var wrap = util.el('div', 'checklist__progress');
    wrap.appendChild(util.el('span', 'checklist__count', '지금 확인한 항목 ' + done + ' / ' + total));

    var track = util.el('div', 'checklist__bar-track');
    var bar = util.el('div', 'checklist__bar');
    var pct = total > 0 ? Math.round((done / total) * 100) : 0;
    bar.style.width = pct + '%';
    track.appendChild(bar);
    wrap.appendChild(track);

    return { el: wrap, done: done, total: total };
  }

  function buildItem(item, checks) {
    var row = util.el('div', 'checklist__item');
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.dataset.act = 'toggle-check';
    row.dataset.id = item.id;

    var ticked = checks[item.id] === true;
    if (ticked) row.classList.add('is-active');

    var box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = ticked;
    box.tabIndex = -1;
    row.appendChild(box);

    row.appendChild(util.el('span', 'checklist__text', item.text));

    return row;
  }

  function paint() {
    if (!_root) return;
    _root.replaceChildren();

    var items = Array.isArray(CW.seed.checklist) ? CW.seed.checklist : [];

    var wrap = util.el('div', 'section');
    wrap.appendChild(util.el('h2', 'section__title', '창업 단계별 체크리스트'));

    if (items.length === 0) {
      var empty = util.tpl('tpl-empty');
      util.setText(empty, 'label', '아직 체크리스트가 없어요.');
      wrap.appendChild(empty);
      _root.appendChild(wrap);
      return;
    }

    var checks = CW.store.checks();

    var progress = buildProgress(items, checks);
    wrap.appendChild(progress.el);

    var list = util.el('div', 'checklist');

    var lastStage = null;
    items.forEach(function (item) {
      if (item.stage !== lastStage) {
        list.appendChild(util.el('h3', 'checklist__stage', item.stage));
        lastStage = item.stage;
      }
      list.appendChild(buildItem(item, checks));
    });

    wrap.appendChild(list);

    if (progress.total > 0 && progress.done === progress.total) {
      wrap.appendChild(util.el('p', 'checklist__done', '여덟 개 다 보셨네요.'));
    }

    _root.appendChild(wrap);
  }

  function render(root, params) {
    _root = root;
    _params = params;
    paint();
  }

  function act(action, ctx) {
    if (!_root) return;

    switch (action) {
      case 'toggle-check':
        CW.store.toggleCheck(ctx.id);
        paint();
        break;

      default:
        break;
    }
  }

  CW.views.check = { render: render, act: act };
})();
