'use strict';
(function () {
  // CW.live — the room-list "pulse". Nudges agoMin on existing seed/user
  // questions so CW.store.roomStats() derives a fresher card for free.
  // Never inserts rooms or questions; never touches localStorage (agoMin
  // lives only on in-memory question objects — seed is never persisted,
  // and a mutated user question is re-persisted as-is by store.persist()
  // only when the user themselves calls addQuestion/addAnswer, which this
  // file never does).

  var TICK_MS = 3400;
  var timer = null;
  var lastRoomId = null;
  var onTickCb = null;

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function randInt(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  function roomsWithQuestions() {
    var rooms = CW.store.rooms();
    var out = [];
    for (var i = 0; i < rooms.length; i++) {
      var qs = CW.store.questionsByRoom(rooms[i].id);
      if (qs.length > 0) out.push({ room: rooms[i], qs: qs });
    }
    return out;
  }

  function pickOther(list, excludeId) {
    if (list.length === 0) return null;
    if (list.length === 1) return list[0];
    var pool = list.filter(function (entry) { return entry.room.id !== excludeId; });
    if (pool.length === 0) pool = list;
    return pool[randInt(0, pool.length - 1)];
  }

  function tick() {
    var list = roomsWithQuestions();
    if (list.length === 0) return;

    var freshen = pickOther(list, lastRoomId);
    if (!freshen) return;
    lastRoomId = freshen.room.id;

    var q = freshen.qs[randInt(0, freshen.qs.length - 1)];
    q.agoMin = randInt(0, 25);

    // One tick in four, also age a different room so the list breathes
    // both ways instead of everything converging on '방금'.
    if (randInt(0, 3) === 0) {
      var agingCandidates = list.filter(function (entry) { return entry.room.id !== freshen.room.id; });
      if (agingCandidates.length > 0) {
        var aging = agingCandidates[randInt(0, agingCandidates.length - 1)];
        var aq = aging.qs[randInt(0, aging.qs.length - 1)];
        aq.agoMin = (aq.agoMin || 0) + randInt(40, 200);
      }
    }

    if (typeof onTickCb === 'function') onTickCb(freshen.room.id);
  }

  function onVisibilityChange() {
    if (document.hidden) {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    } else {
      if (timer === null && onTickCb !== null) {
        timer = setInterval(tick, TICK_MS);
      }
    }
  }

  function start(onTick) {
    if (timer !== null) return; // already running — never restart itself
    if (prefersReducedMotion()) return;

    onTickCb = onTick || null;
    lastRoomId = null;
    timer = setInterval(tick, TICK_MS);
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  function stop() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    document.removeEventListener('visibilitychange', onVisibilityChange);
    onTickCb = null;
  }

  function isOn() {
    return timer !== null;
  }

  CW.live = {
    start: start,
    stop: stop,
    isOn: isOn
  };
})();
