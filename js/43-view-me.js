'use strict';
(function () {
  // #/me — 내 조건. Reads/writes CW.store.me() directly. No listeners here:
  // clicks land through the single #app delegated listener in 90-app.js,
  // which calls act() below with { action, id, val, el, params }.

  var _root = null;
  var _params = null;

  // Whether the quiet "데모 처음 상태로" button has been swapped for the
  // two-step inline confirm. Lives only in this module so a fresh route
  // entry (render()) always starts collapsed — plan section 8: an
  // accidental click mid-demo must never be one tap away from reset.
  var _showReset = false;

  function buildChipField(labelText, options, current, act) {
    var field = CW.util.el('div', 'me-field');
    field.appendChild(CW.util.el('span', 'me-field__label', labelText));

    var row = CW.util.el('div', 'form__chips');
    options.forEach(function (opt) {
      var chip = CW.util.tpl('tpl-chip');
      if (!chip) return;
      chip.dataset.act = act;
      chip.dataset.val = opt;
      if (opt === current) chip.classList.add('is-active');
      CW.util.setText(chip, 'label', opt);
      row.appendChild(chip);
    });
    field.appendChild(row);
    return field;
  }

  function buildTagField(me) {
    var field = CW.util.el('div', 'me-field');
    field.appendChild(CW.util.el('span', 'me-field__label', '조건 태그'));

    var row = CW.util.el('div', 'form__chips');
    var myTags = Array.isArray(me.tags) ? me.tags : [];
    CW.enums.TAG_PRESETS.forEach(function (tag) {
      var active = myTags.indexOf(tag) !== -1;
      var chip = CW.util.tpl('tpl-chip');
      if (!chip) return;
      chip.dataset.act = active ? 'tag-remove' : 'tag-add';
      chip.dataset.val = tag;
      if (active) chip.classList.add('is-active');
      CW.util.setText(chip, 'label', tag);
      row.appendChild(chip);
    });
    field.appendChild(row);
    return field;
  }

  function buildResetBox() {
    var box = CW.util.el('div', 'reset-box');

    if (!_showReset) {
      var btn = CW.util.el('button', 'btn btn--text', '데모 처음 상태로');
      btn.type = 'button';
      btn.dataset.act = 'reset-open';
      box.appendChild(btn);
      return box;
    }

    var confirmBox = CW.util.el('div', 'reset-confirm');
    confirmBox.appendChild(
      CW.util.el('p', 'reset-confirm__text', '정말 되돌릴까요? 쓰신 글은 지워집니다.')
    );

    var actions = CW.util.el('div', 'reset-confirm__actions');

    var yes = CW.util.el('button', 'btn btn--danger', '되돌리기');
    yes.type = 'button';
    yes.dataset.act = 'reset-confirm';

    var no = CW.util.el('button', 'btn btn--ghost', '그냥 둘게요');
    no.type = 'button';
    no.dataset.act = 'reset-cancel';

    actions.appendChild(yes);
    actions.appendChild(no);
    confirmBox.appendChild(actions);
    box.appendChild(confirmBox);
    return box;
  }

  function paint() {
    if (!_root) return;
    _root.replaceChildren();

    var me = CW.store.me();

    var wrap = CW.util.el('div', 'section');
    wrap.appendChild(CW.util.el('h2', 'section__title', '내 조건'));
    wrap.appendChild(
      CW.util.el('p', 'match-hint', '여기 적은 조건으로 "나와 같은 답"을 골라 봅니다.')
    );

    wrap.appendChild(buildChipField('업종', CW.enums.CATS, me.cat, 'set-cat'));
    wrap.appendChild(buildChipField('단계', CW.enums.STAGES, me.stage, 'set-stage'));
    wrap.appendChild(buildTagField(me));
    wrap.appendChild(buildResetBox());

    _root.appendChild(wrap);
  }

  function render(root, params) {
    _root = root;
    _params = params;
    _showReset = false;
    paint();
  }

  function act(action, ctx) {
    if (!_root) return;
    var me;

    switch (action) {
      case 'set-cat':
        me = CW.store.me();
        me.cat = ctx.val;
        CW.store.setMe(me);
        paint();
        break;

      case 'set-stage':
        me = CW.store.me();
        me.stage = ctx.val;
        CW.store.setMe(me);
        paint();
        break;

      case 'tag-add':
        me = CW.store.me();
        me.tags = Array.isArray(me.tags) ? me.tags.slice() : [];
        if (me.tags.indexOf(ctx.val) === -1) me.tags.push(ctx.val);
        CW.store.setMe(me);
        paint();
        break;

      case 'tag-remove':
        me = CW.store.me();
        me.tags = (Array.isArray(me.tags) ? me.tags : []).filter(function (t) {
          return t !== ctx.val;
        });
        CW.store.setMe(me);
        paint();
        break;

      case 'reset-open':
        _showReset = true;
        paint();
        break;

      case 'reset-cancel':
        _showReset = false;
        paint();
        break;

      case 'reset-confirm':
        // store.reset() removes both localStorage keys and reloads the page —
        // never window.confirm(), which would break a projected demo.
        CW.store.reset();
        break;

      default:
        break;
    }
  }

  CW.views.me = { render: render, act: act };
})();
