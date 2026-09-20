'use strict';
(function () {
  // CW.intro — the once-per-tab launch animation, and CW.icons, the shared
  // industry -> sprite-id map plus a tiny <use> factory for other views.
  //
  // This file only defines. Nothing here runs until js/90-app.js calls
  // CW.intro.start() as the very first line of boot().
  //
  // Hard rules this file exists to satisfy (see task spec):
  //  - #intro is static markup already in index.html — never created here,
  //    so there is no flash of the app before the overlay paints.
  //  - prefers-reduced-motion and a same-tab sessionStorage flag both
  //    dismiss the overlay SYNCHRONOUSLY, before first paint.
  //  - a single 3500ms failsafe force-dismisses no matter what.
  //  - every animated property in css/intro.css is transform/opacity only.

  var SESSION_KEY = 'cw.intro';
  var PLAY_MS = 2600;     // t at which the normal (animated) dismiss starts
  var FAILSAFE_MS = 3500; // absolute worst case — always wins
  var FADEOUT_MS = 320;   // >= the 300ms CSS fade, small buffer for timer drift

  var introEl = null;
  var skipBtn = null;
  var dismissed = false;
  var failsafeTimer = null;

  function sessionSkipRequested() {
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (e) {
      return false; // private mode / storage blocked — never break the app
    }
  }

  function markSessionSeen() {
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {
      // ignored — a lost flag just means the intro may play again
    }
  }

  function prefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (e) {
      return false;
    }
  }

  // instant = true  -> no fade-out transition, hidden right away
  //                    (skip button, reduced-motion, sessionStorage skip,
  //                    failsafe, error recovery)
  // instant = false -> the normal 2.6s path: play the CSS fade-out first
  function dismiss(instant) {
    if (dismissed) return;
    dismissed = true;

    if (failsafeTimer) {
      window.clearTimeout(failsafeTimer);
      failsafeTimer = null;
    }

    markSessionSeen();

    // Always let #app's fade-up rule engage, even if #intro itself is
    // missing from the DOM for some reason.
    if (document.body) document.body.classList.add('intro-done');

    if (!introEl) return;

    var finish = function () {
      introEl.classList.add('intro--hidden');
      introEl.setAttribute('aria-hidden', 'true');
      try { introEl.inert = true; } catch (e) {}
    };

    if (instant) {
      finish();
    } else {
      introEl.classList.add('intro--out');
      window.setTimeout(finish, FADEOUT_MS);
    }
  }

  function start() {
    try {
      introEl = document.getElementById('intro');
      if (!introEl) return; // nothing to play, nothing to dismiss

      // Failsafe first, before anything else can throw and strand the
      // overlay on screen.
      failsafeTimer = window.setTimeout(function () { dismiss(true); }, FAILSAFE_MS);

      if (prefersReducedMotion() || sessionSkipRequested()) {
        dismiss(true);
        return;
      }

      skipBtn = document.getElementById('intro-skip');
      if (skipBtn) {
        skipBtn.addEventListener('click', function () { dismiss(true); });
      }

      window.setTimeout(function () { dismiss(false); }, PLAY_MS);
    } catch (e) {
      dismiss(true);
    }
  }

  // ---------------------------------------------------------------------
  // CW.icons — exposed so other views can turn an industry name into the
  // matching sprite <use>, without re-inventing the id map.
  // ---------------------------------------------------------------------

  var CAT_ICON = {
    '필라테스': 'ic-cat-pil',
    '카페': 'ic-cat-cafe',
    '온라인 쇼핑몰': 'ic-cat-shop',
    '뷰티': 'ic-cat-beauty',
    '교육': 'ic-cat-edu',
    '앱·SaaS': 'ic-cat-saas',
    '콘텐츠': 'ic-cat-content'
  };

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function useIcon(id, cls) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', cls ? ('ic ' + cls) : 'ic');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  }

  // Only 7 hand-drawn avatars (av-0..av-6) exist, but the stored `avatar`
  // field on an author is documented as 0-7 and can come straight out of
  // localStorage (user-editable, or left over from an older schema), so it
  // may be negative, out of range, or not a number at all. Fold it into
  // 0-6 with a double-modulo so this never throws and never points at a
  // missing symbol. Must never throw — an avatar failing to draw must not
  // take down the answer list.
  function avatarIcon(n) {
    try {
      var num = Number(n);
      if (!isFinite(num)) num = 0;
      num = Math.trunc(num);
      var idx = ((num % 7) + 7) % 7;
      var svg = document.createElementNS(SVG_NS, 'svg');
      svg.setAttribute('class', 'avatar-ill');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('viewBox', '0 0 72 72');
      var use = document.createElementNS(SVG_NS, 'use');
      use.setAttribute('href', '#av-' + idx);
      svg.appendChild(use);
      return svg;
    } catch (e) {
      return null;
    }
  }

  CW.icons = { cat: CAT_ICON, use: useIcon, avatar: avatarIcon };
  CW.intro = { start: start, dismiss: dismiss };
})();
