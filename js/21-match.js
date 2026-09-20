'use strict';
(function () {
  // Match set is Me.tags ONLY. Me.cat / Me.stage never enter this computation —
  // the room already fixes industry and stage, so mixing them in would make
  // every answer in the room match and the filter would look broken on stage.

  function myTags() {
    var me = CW.store.me();
    return (me && Array.isArray(me.tags)) ? me.tags : [];
  }

  function matchCount(answer) {
    var mine = myTags();
    var theirs = (answer && Array.isArray(answer.tags)) ? answer.tags : [];
    var count = 0;
    for (var i = 0; i < theirs.length; i++) {
      if (mine.indexOf(theirs[i]) !== -1) count++;
    }
    return count;
  }

  function isMatch(answer) {
    return matchCount(answer) >= 1;
  }

  function tally(question, answers) {
    var options = (question && Array.isArray(question.options)) ? question.options : [];
    var list = Array.isArray(answers) ? answers : [];
    var total = list.length;

    // Group strictly by pickKey against the question's declared options —
    // never by free-text pickText (see plan 4.2: normalizing Korean free
    // text would fragment equivalent answers into separate bars).
    return options.map(function (opt) {
      var bucket = list.filter(function (a) { return a && a.pickKey === opt.key; });
      var count = bucket.length;
      var quitCount = bucket.filter(function (a) { return a.quit === true; }).length;
      var pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return { key: opt.key, label: opt.label, count: count, quitCount: quitCount, pct: pct };
    });
  }

  CW.match.myTags = myTags;
  CW.match.matchCount = matchCount;
  CW.match.isMatch = isMatch;
  CW.match.tally = tally;
})();
