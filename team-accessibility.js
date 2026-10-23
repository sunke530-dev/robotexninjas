(function () {
  'use strict';
  const menu = document.getElementById('mm'), menuButton = document.getElementById('hbg');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  function setMenu(open) {
    menu.hidden = !open;
    menu.classList.toggle('open', open);
    menuButton.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  }
  window.toggleMenu = () => setMenu(menu.hidden);
  window.closeMenu = () => setMenu(false);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      setMenu(false);
      menuButton.focus();
    }
  });
  menu.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    const target = link && document.getElementById(link.hash.slice(1));
    if (target) { target.tabIndex = -1; target.focus({preventScroll: true}); }
  });
  menu.addEventListener('focusout', event => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget) && event.relatedTarget !== menuButton) setMenu(false);
  });
  matchMedia('(min-width: 769px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  setMenu(false);

  function setSpot(item, open) {
    item.classList.toggle('open', open);
    item.querySelector('.sitem-toggle').setAttribute('aria-expanded', String(open));
    item.querySelector('.sitem-panel').hidden = !open;
  }
  function revealMore(section) {
    const button = section.querySelector('.show-more-btn');
    if (button && button.getAttribute('aria-expanded') !== 'true') button.click();
  }
  window.toggleSpot = function (id) {
    const item = document.getElementById(id);
    if (!item) return;
    const open = !item.classList.contains('open');
    document.querySelectorAll('.sitem').forEach(other => setSpot(other, other === item && open));
  };
  document.querySelectorAll('.sitem').forEach(item => {
    setSpot(item, item.classList.contains('open'));
    item.querySelector('.sitem-toggle').addEventListener('click', () => window.toggleSpot(item.id));
  });

  window.toggleMore = function (className, buttonId) {
    const button = document.getElementById(buttonId);
    const open = button.getAttribute('aria-expanded') !== 'true';
    const targets = button.getAttribute('aria-controls').split(' ').map(id => document.getElementById(id));
    targets.forEach(item => { item.classList.toggle('hidden-item', !open); item.hidden = !open; });
    button.setAttribute('aria-expanded', String(open));
    button.classList.toggle('expanded', open);
    button.innerHTML = (open ? 'Show Less' : 'Show ' + targets.length + ' More') + ' <span class="btn-arrow" aria-hidden="true">&#8964;</span>';
  };
  document.querySelectorAll('.show-more-btn').forEach(button => {
    const targets = [...button.closest('section').querySelectorAll('.hidden-item')];
    targets.forEach((item, index) => { if (!item.id) item.id = button.id + '-item-' + (index + 1); item.hidden = true; });
    button.setAttribute('aria-controls', targets.map(item => item.id).join(' '));
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = 'Show ' + targets.length + ' More <span class="btn-arrow" aria-hidden="true">&#8964;</span>';
  });

  window.toggleMember = function (id, event) {
    event.stopPropagation();
    const panel = document.getElementById(id), open = panel.hidden;
    document.querySelectorAll('.tcard-expand-btn').forEach(button => {
      const target = document.getElementById(button.getAttribute('aria-controls'));
      const expanded = target === panel && open;
      target.hidden = !expanded;
      button.setAttribute('aria-expanded', String(expanded));
      button.closest('.tcard').classList.toggle('open', expanded);
    });
  };
  function revealTarget() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    const item = target.closest('.sitem');
    if (item) {
      if (item.hidden) revealMore(item.closest('section'));
      document.querySelectorAll('.sitem').forEach(other => setSpot(other, other === item));
      requestAnimationFrame(() => target.scrollIntoView({behavior: reduceMotion.matches ? 'instant' : 'smooth', block: 'start'}));
    }
  }
  window.addEventListener('hashchange', revealTarget);
  document.querySelectorAll('.member-insight-link').forEach(link => link.addEventListener('click', () => {
    if (link.hash === location.hash) revealTarget();
  }));
  revealTarget();
})();
