'use strict';
(function () {
  // Hash routing only. Never history.pushState — it throws a SecurityError
  // on file:// and the presenter needs the double-click-the-file fallback
  // to keep working.

  var changeCallback = null;
  var lastRenderedHash = null;

  function safeDecode(s) {
    try {
      return decodeURIComponent(s);
    } catch (e) {
      return s;
    }
  }

  function parse(hash) {
    var h = (hash || '').replace(/^#/, '');
    if (h.charAt(0) !== '/') h = '/' + h;
    var parts = h.split('/').filter(function (p) { return p !== ''; });

    if (parts.length === 1 && parts[0] === 'rooms') return { name: 'rooms', params: {} };
    if (parts.length === 1 && parts[0] === 'me') return { name: 'me', params: {} };
    if (parts.length === 1 && parts[0] === 'check') return { name: 'check', params: {} };
    if (parts.length === 2 && parts[0] === 'room' && parts[1]) {
      return { name: 'room', params: { id: safeDecode(parts[1]) } };
    }
    if (parts.length === 2 && parts[0] === 'q' && parts[1]) {
      return { name: 'question', params: { id: safeDecode(parts[1]) } };
    }
    return null;
  }

  function readRoute() {
    var parsed = parse(location.hash);
    if (!parsed) {
      try {
        location.replace('#/rooms');
      } catch (e) {
        // nothing more we can do
      }
      return { name: 'rooms', params: {} };
    }
    return parsed;
  }

  function current() {
    return readRoute();
  }

  function go(hash) {
    var h = hash || '#/rooms';
    if (h.charAt(0) !== '#') h = '#' + h;
    location.hash = h;
  }

  function parentHash(route) {
    if (route.name === 'room') return '#/rooms';
    if (route.name === 'question') {
      var q = null;
      try {
        q = CW.store.question(route.params.id);
      } catch (e) {
        q = null;
      }
      return (q && q.roomId) ? ('#/room/' + encodeURIComponent(q.roomId)) : '#/rooms';
    }
    return '#/rooms';
  }

  function back() {
    if (window.history.length > 1) {
      try {
        window.history.back();
        return;
      } catch (e) {
        // fall through to replace
      }
    }
    var route = readRoute();
    try {
      location.replace(parentHash(route));
    } catch (e) {
      // nothing more we can do
    }
  }

  function dispatch() {
    var raw = location.hash;
    if (raw === lastRenderedHash) return;
    lastRenderedHash = raw;
    var route = readRoute();
    if (changeCallback) changeCallback(route);
  }

  function start() {
    lastRenderedHash = null;
    window.addEventListener('hashchange', dispatch);
    dispatch();
  }

  function onChange(fn) {
    changeCallback = fn;
  }

  CW.router.start = start;
  CW.router.go = go;
  CW.router.back = back;
  CW.router.current = current;
  CW.router.onChange = onChange;
})();
