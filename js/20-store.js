'use strict';
(function () {
  var VERSION_KEY = 'cw.v1.seedVersion';
  var DELTA_KEY = 'cw.v1.delta';

  // In-memory fallback used once localStorage proves unreachable.
  var memStore = {};

  // seed: read-only content supplied by 11-14 seed files (never persisted).
  var seed = { rooms: [], questions: [], answers: [], checklist: [] };

  // delta: the only thing that ever touches localStorage.
  var delta = { v: 1, author: null, me: null, questions: [], answers: [], checks: {} };

  // Lookup indexes rebuilt after every mutation for O(1) render lookups.
  var idx = {
    roomsById: new Map(),
    questionsById: new Map(),
    answersByQ: new Map(),
    questionsByRoom: new Map()
  };

  // ---- storage wrapper: never throws, degrades to memory silently ----

  function storageGet(key) {
    if (CW.store.mode === 'memory') {
      return Object.prototype.hasOwnProperty.call(memStore, key) ? memStore[key] : null;
    }
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      CW.store.mode = 'memory';
      return Object.prototype.hasOwnProperty.call(memStore, key) ? memStore[key] : null;
    }
  }

  function storageSet(key, val) {
    if (CW.store.mode === 'memory') {
      memStore[key] = val;
      return;
    }
    try {
      window.localStorage.setItem(key, val);
    } catch (e) {
      CW.store.mode = 'memory';
      memStore[key] = val;
    }
  }

  function storageRemove(key) {
    if (CW.store.mode === 'memory') {
      delete memStore[key];
      return;
    }
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      CW.store.mode = 'memory';
      delete memStore[key];
    }
  }

  // ---- normalization: a malformed stored object must never crash render ----

  function normalizeAuthor(a) {
    if (a && typeof a === 'object' && typeof a.nick === 'string' && a.nick) {
      return { nick: a.nick, avatar: typeof a.avatar === 'number' ? a.avatar : 0 };
    }
    return null;
  }

  function normalizeOptions(opts) {
    if (!Array.isArray(opts)) return [];
    return opts.filter(function (o) {
      return o && typeof o === 'object' && typeof o.key === 'string' && typeof o.label === 'string';
    }).map(function (o) {
      return { key: o.key, label: o.label };
    });
  }

  function normalizeQuestion(q) {
    return {
      id: typeof q.id === 'string' && q.id ? q.id : CW.util.uid(),
      roomId: q.roomId,
      title: typeof q.title === 'string' ? q.title : '',
      body: typeof q.body === 'string' ? q.body : '',
      options: normalizeOptions(q.options),
      author: normalizeAuthor(q.author) || { nick: '', avatar: 0 },
      agoMin: typeof q.agoMin === 'number' && isFinite(q.agoMin) ? q.agoMin : 0,
      src: q.src === 'seed' ? 'seed' : 'user'
    };
  }

  function normalizeAnswer(a) {
    return {
      id: typeof a.id === 'string' && a.id ? a.id : CW.util.uid(),
      questionId: a.questionId,
      pickKey: typeof a.pickKey === 'string' ? a.pickKey : '',
      pickText: typeof a.pickText === 'string' ? a.pickText : '',
      why: typeof a.why === 'string' ? a.why : '',
      tags: Array.isArray(a.tags) ? a.tags.filter(function (t) { return typeof t === 'string'; }) : [],
      quit: a.quit === true,
      author: normalizeAuthor(a.author) || { nick: '', avatar: 0 },
      agoMin: typeof a.agoMin === 'number' && isFinite(a.agoMin) ? a.agoMin : 0,
      src: a.src === 'seed' ? 'seed' : 'user'
    };
  }

  function normalizeMe(m) {
    var def = CW.enums.DEFAULT_ME;
    if (!m || typeof m !== 'object') {
      return { cat: def.cat, stage: def.stage, tags: def.tags.slice() };
    }
    return {
      cat: typeof m.cat === 'string' ? m.cat : def.cat,
      stage: typeof m.stage === 'string' ? m.stage : def.stage,
      tags: Array.isArray(m.tags) ? m.tags.filter(function (t) { return typeof t === 'string'; }) : def.tags.slice()
    };
  }

  function byAgoAsc(a, b) {
    return (a.agoMin || 0) - (b.agoMin || 0);
  }

  function rebuildIndexes() {
    idx.roomsById = new Map();
    seed.rooms.forEach(function (r) {
      if (r && r.id) idx.roomsById.set(r.id, r);
    });

    var allQ = seed.questions.concat(delta.questions);
    idx.questionsById = new Map();
    allQ.forEach(function (q) {
      idx.questionsById.set(q.id, q);
    });

    idx.questionsByRoom = new Map();
    allQ.forEach(function (q) {
      var arr = idx.questionsByRoom.get(q.roomId);
      if (!arr) {
        arr = [];
        idx.questionsByRoom.set(q.roomId, arr);
      }
      arr.push(q);
    });
    idx.questionsByRoom.forEach(function (arr) {
      arr.sort(byAgoAsc);
    });

    var allA = seed.answers.concat(delta.answers);
    idx.answersByQ = new Map();
    allA.forEach(function (a) {
      var arr = idx.answersByQ.get(a.questionId);
      if (!arr) {
        arr = [];
        idx.answersByQ.set(a.questionId, arr);
      }
      arr.push(a);
    });
    idx.answersByQ.forEach(function (arr) {
      arr.sort(byAgoAsc);
    });
  }

  function persist() {
    var payload = {
      v: delta.v,
      author: delta.author,
      me: delta.me,
      questions: delta.questions,
      answers: delta.answers,
      checks: delta.checks
    };
    try {
      storageSet(DELTA_KEY, JSON.stringify(payload));
    } catch (e) {
      CW.store.mode = 'memory';
    }
  }

  // ---- boot ----

  function boot() {
    CW.store.mode = 'local';
    memStore = {};

    seed = {
      rooms: Array.isArray(CW.seed.rooms) ? CW.seed.rooms : [],
      questions: Array.isArray(CW.seed.questions) ? CW.seed.questions : [],
      answers: Array.isArray(CW.seed.answers) ? CW.seed.answers : [],
      checklist: Array.isArray(CW.seed.checklist) ? CW.seed.checklist : []
    };

    var storedVersion = storageGet(VERSION_KEY);
    var deltaRaw = null;

    if (storedVersion !== CW.SEED_VERSION) {
      storageRemove(DELTA_KEY);
      storageSet(VERSION_KEY, CW.SEED_VERSION);
    } else {
      var deltaStr = storageGet(DELTA_KEY);
      if (deltaStr) {
        try {
          deltaRaw = JSON.parse(deltaStr);
        } catch (e) {
          deltaRaw = null;
        }
      }
    }
    if (!deltaRaw || typeof deltaRaw !== 'object') deltaRaw = {};

    var roomIds = {};
    seed.rooms.forEach(function (r) {
      if (r && r.id) roomIds[r.id] = true;
    });

    var rawQuestions = Array.isArray(deltaRaw.questions) ? deltaRaw.questions : [];
    var userQuestions = rawQuestions
      .filter(function (q) { return q && typeof q === 'object' && roomIds[q.roomId]; })
      .map(normalizeQuestion);

    var allQ = seed.questions.concat(userQuestions);
    var qIds = {};
    allQ.forEach(function (q) {
      if (q && q.id) qIds[q.id] = true;
    });

    var rawAnswers = Array.isArray(deltaRaw.answers) ? deltaRaw.answers : [];
    var userAnswers = rawAnswers
      .filter(function (a) { return a && typeof a === 'object' && qIds[a.questionId]; })
      .map(normalizeAnswer);

    var rawChecks = (deltaRaw.checks && typeof deltaRaw.checks === 'object' && !Array.isArray(deltaRaw.checks))
      ? deltaRaw.checks : {};

    delta = {
      v: typeof deltaRaw.v === 'number' ? deltaRaw.v : 1,
      author: normalizeAuthor(deltaRaw.author),
      me: normalizeMe(deltaRaw.me),
      questions: userQuestions,
      answers: userAnswers,
      checks: rawChecks
    };

    rebuildIndexes();
  }

  // ---- rooms ----

  function rooms() {
    return seed.rooms.slice();
  }

  function room(id) {
    return idx.roomsById.get(id) || null;
  }

  function roomStats(roomId) {
    var qs = idx.questionsByRoom.get(roomId) || [];
    var qCount = qs.length;
    var lastTitle = qCount > 0 ? qs[0].title : null;
    var agoMin = qCount > 0 ? qs[0].agoMin : null;
    var unread = qs.filter(function (q) { return q.agoMin < 60; }).length;
    var live = qs.some(function (q) { return q.agoMin < 30; });
    return { qCount: qCount, lastTitle: lastTitle, agoMin: agoMin, unread: unread, live: live };
  }

  // ---- questions / answers ----

  function questionsByRoom(roomId) {
    return (idx.questionsByRoom.get(roomId) || []).slice();
  }

  function question(id) {
    return idx.questionsById.get(id) || null;
  }

  function answersByQuestion(qid) {
    return (idx.answersByQ.get(qid) || []).slice();
  }

  function allQuestions() {
    return seed.questions.concat(delta.questions);
  }

  function addQuestion(input) {
    input = input || {};
    var q = {
      id: CW.util.uid(),
      roomId: input.roomId,
      title: typeof input.title === 'string' ? input.title : '',
      body: typeof input.body === 'string' ? input.body : '',
      options: normalizeOptions(input.options),
      author: author(),
      agoMin: 0,
      src: 'user'
    };
    delta.questions.push(q);
    rebuildIndexes();
    persist();
    return q;
  }

  function addAnswer(input) {
    input = input || {};
    var a = {
      id: CW.util.uid(),
      questionId: input.questionId,
      pickKey: typeof input.pickKey === 'string' ? input.pickKey : '',
      pickText: typeof input.pickText === 'string' ? input.pickText : '',
      why: typeof input.why === 'string' ? input.why : '',
      tags: Array.isArray(input.tags) ? input.tags.filter(function (t) { return typeof t === 'string'; }) : [],
      quit: input.quit === true,
      author: author(),
      agoMin: 0,
      src: 'user'
    };
    delta.answers.push(a);
    rebuildIndexes();
    persist();
    return a;
  }

  // ---- me / checks / author ----

  function me() {
    return delta.me;
  }

  function setMe(newMe) {
    delta.me = normalizeMe(newMe);
    persist();
    return delta.me;
  }

  function checks() {
    return delta.checks;
  }

  function toggleCheck(id) {
    delta.checks[id] = !delta.checks[id];
    persist();
    return delta.checks;
  }

  function author() {
    if (delta.author && delta.author.nick) return delta.author;
    delta.author = { nick: CW.util.makeNick(), avatar: Math.floor(Math.random() * 8) };
    persist();
    return delta.author;
  }

  function reset() {
    storageRemove(DELTA_KEY);
    storageRemove(VERSION_KEY);
    try {
      location.reload();
    } catch (e) {
      // nothing more we can do
    }
  }

  CW.store.mode = 'local';
  CW.store.boot = boot;
  CW.store.rooms = rooms;
  CW.store.room = room;
  CW.store.roomStats = roomStats;
  CW.store.questionsByRoom = questionsByRoom;
  CW.store.question = question;
  CW.store.answersByQuestion = answersByQuestion;
  CW.store.allQuestions = allQuestions;
  CW.store.addQuestion = addQuestion;
  CW.store.addAnswer = addAnswer;
  CW.store.me = me;
  CW.store.setMe = setMe;
  CW.store.checks = checks;
  CW.store.toggleCheck = toggleCheck;
  CW.store.author = author;
  CW.store.reset = reset;
})();
