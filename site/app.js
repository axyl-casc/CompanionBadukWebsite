const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
menu?.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!expanded));
  navigation.classList.toggle('is-open', !expanded);
});
navigation?.addEventListener('click', (event) => {
  if (event.target.closest('a')) { menu?.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    menu.setAttribute('aria-expanded', 'false'); navigation.classList.remove('is-open'); menu.focus();
  }
});

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  for (const item of tabs) {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTab(tabs[next]); tabs[next].focus(); }
  });
});

const lightbox = document.querySelector('.lightbox');
let lastImageLink;
if (lightbox && typeof lightbox.showModal === 'function') {
  document.querySelectorAll('[data-lightbox]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault(); lastImageLink = link;
    const image = lightbox.querySelector('img');
    image.src = link.href; image.alt = link.querySelector('img').alt;
    document.getElementById('lightbox-caption').textContent = link.dataset.caption || image.alt;
    lightbox.showModal(); document.body.classList.add('modal-open');
  }));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('close', () => { document.body.classList.remove('modal-open'); lastImageLink?.focus(); });
}
