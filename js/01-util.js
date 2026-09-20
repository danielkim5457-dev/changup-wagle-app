'use strict';
(function () {
  // Small DOM + string helpers shared by every later file.
  // setText() is the ONLY sanctioned way user-authored text reaches the DOM
  // (it assigns via textContent — never innerHTML).

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function tpl(id) {
    var t = document.getElementById(id);
    if (!t || !t.content || !t.content.firstElementChild) return null;
    return t.content.firstElementChild.cloneNode(true);
  }

  function slot(node, name) {
    if (!node) return null;
    return node.querySelector('[data-slot="' + name + '"]');
  }

  function setText(node, name, text) {
    var target = slot(node, name);
    if (!target) return;
    target.textContent = (text === undefined || text === null) ? '' : text;
  }

  function ago(min) {
    var m = Number(min);
    if (!isFinite(m) || m < 0) m = 0;
    if (m < 1) return '방금';
    if (m < 60) return Math.floor(m) + '분 전';
    if (m < 1440) return Math.floor(m / 60) + '시간 전';
    if (m < 2880) return '어제';
    return Math.floor(m / 1440) + '일 전';
  }

  function randomBase36(len) {
    var out = '';
    for (var i = 0; i < len; i++) {
      out += Math.floor(Math.random() * 36).toString(36);
    }
    return out;
  }

  function uid() {
    return 'u-' + Date.now().toString(36) + '-' + randomBase36(4);
  }

  var NICK_ADJ = ['조용한', '이른', '늦은', '포근한', '서늘한', '한적한', '나른한', '볕좋은'];
  var NICK_NOUN = ['목요일', '아침', '오후', '저녁', '창가 자리', '골목길', '정류장', '옥상', '뒷자리', '화요일'];

  function makeNick() {
    var a = NICK_ADJ[Math.floor(Math.random() * NICK_ADJ.length)];
    var n = NICK_NOUN[Math.floor(Math.random() * NICK_NOUN.length)];
    return a + ' ' + n;
  }

  function clamp(str, n) {
    var s = (str === undefined || str === null) ? '' : String(str);
    if (s.length <= n) return s;
    return s.slice(0, n);
  }

  CW.util.$ = $;
  CW.util.$$ = $$;
  CW.util.el = el;
  CW.util.tpl = tpl;
  CW.util.slot = slot;
  CW.util.setText = setText;
  CW.util.ago = ago;
  CW.util.uid = uid;
  CW.util.makeNick = makeNick;
  CW.util.clamp = clamp;
})();
