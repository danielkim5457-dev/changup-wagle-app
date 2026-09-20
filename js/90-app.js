'use strict';
(function () {
  // CW.boot() — the only file in this project that executes anything at
  // load time. Everything else only defines. Three listeners total exist
  // in the whole app: one delegated click + one delegated keydown on
  // #app, and one click on #nav. Views never register their own.

  var util = CW.util;

  var appEl = null;
  var navEl = null;

  // The CW.views.* object behind the route currently painted into #app,
  // so the delegated listeners know who to hand data-act clicks to.
  var currentView = null;
  var currentRoute = null;

  var VIEWS_BY_ROUTE = {
    rooms: 'rooms',
    room: 'room',
    question: 'question',
    me: 'me',
    check: 'check'
  };

  function setNavActive(routeName) {
    var activeVal = VIEWS_BY_ROUTE[routeName] ? (
      routeName === 'room' || routeName === 'question' ? 'rooms' : routeName
    ) : 'rooms';

    util.$$('[data-act="nav"]', navEl).forEach(function (a) {
      if (a.dataset.val === activeVal) {
        a.classList.add('is-active');
      } else {
        a.classList.remove('is-active');
      }
    });
  }

  function showRecovery() {
    appEl.replaceChildren();

    var msg = util.el('p', 'empty-msg', '화면을 그리지 못했어요. 방 목록으로 돌아가 주세요.');
    appEl.appendChild(msg);

    var link = document.createElement('a');
    link.href = '#/rooms';
    link.className = 'btn btn--primary';
    link.textContent = '방 목록으로';
    appEl.appendChild(link);

    currentView = null;
  }

  function renderRoute(route) {
    currentRoute = route;

    // 방 목록의 실시간 펄스는 그 화면에서만 돈다. 여기서 먼저 끄지 않으면
    // 화면을 떠난 뒤에도 다음 틱(최대 3.4초)까지 데이터를 계속 건드린다.
    // 방 목록 뷰가 자기 render 끝에서 다시 켠다.
    if (CW.live) CW.live.stop();

    var view = CW.views[route.name];
    currentView = view || null;

    if (!view || typeof view.render !== 'function') {
      // Should be unreachable — 30-router.js only ever hands back one of
      // the five known route names — but a white screen is unrecoverable
      // on stage, so this stays defensive rather than throwing.
      console.error('CW.boot: no view registered for route', route.name);
      showRecovery();
    } else {
      try {
        view.render(appEl, route.params);
      } catch (e) {
        console.error(e);
        showRecovery();
      }
    }

    setNavActive(route.name);
    window.scrollTo(0, 0);

    // 화면 전환 시 본문을 한 번 떠오르게 한다. 클래스를 뗐다 다시 붙여야
    // 같은 애니메이션이 매번 재생된다(강제 리플로우).
    appEl.classList.remove('is-entering');
    void appEl.offsetWidth;
    appEl.classList.add('is-entering');
  }

  function dispatch(action, id, val, el) {
    if (!action) return;

    if (action === 'nav') {
      CW.router.go('#/' + val);
      return;
    }

    if (action === 'back') {
      CW.router.back();
      return;
    }

    if (!currentView || typeof currentView.act !== 'function') return;

    try {
      currentView.act(action, {
        action: action,
        id: id,
        val: val,
        el: el,
        params: currentRoute ? currentRoute.params : {}
      });
    } catch (e) {
      console.error(e);
    }
  }

  function targetFrom(e) {
    return e.target.closest ? e.target.closest('[data-act]') : null;
  }

  function onClick(e) {
    var t = targetFrom(e);
    if (!t) return;
    if (t.tagName === 'A') e.preventDefault();
    dispatch(t.dataset.act, t.dataset.id, t.dataset.val, t);
  }

  function onKeydown(e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    var t = targetFrom(e);
    if (!t) return;
    e.preventDefault();
    dispatch(t.dataset.act, t.dataset.id, t.dataset.val, t);
  }

  function boot() {
    CW.intro.start();
    CW.store.boot();

    appEl = document.getElementById('app');
    navEl = document.getElementById('nav');

    appEl.addEventListener('click', onClick);
    appEl.addEventListener('keydown', onKeydown);
    navEl.addEventListener('click', onClick);

    CW.router.onChange(renderRoute);
    CW.router.start();
  }

  CW.boot = boot;

  if (document.readyState === 'loading') {
    document.onreadystatechange = function () {
      if (document.readyState !== 'loading') {
        document.onreadystatechange = null;
        CW.boot();
      }
    };
  } else {
    CW.boot();
  }
})();
