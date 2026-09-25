// Companion to src/plugins/rehype-table-region.js (issue #1076).
// The build renders every table wrapper as a focusable, named region so it
// works without JavaScript. After layout, this module keeps the tab stop,
// role and name only on wrappers that actually overflow. A focusable region
// that doesn't scroll is a pointless tab stop (Pickering, Inclusive
// Components "Only focusable where scrollable"). It re-checks on resize.
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const LABEL_ATTRS = ['aria-labelledby', 'aria-label'];
let observer = null;

function sync(el) {
  const scrollable = el.scrollWidth > el.clientWidth + 1;
  if (scrollable) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'region');
    for (const attr of LABEL_ATTRS) {
      const saved = el.dataset[attr === 'aria-label' ? 'savedLabel' : 'savedLabelledby'];
      if (saved !== undefined) el.setAttribute(attr, saved);
    }
  } else {
    for (const attr of LABEL_ATTRS) {
      if (el.hasAttribute(attr)) {
        el.dataset[attr === 'aria-label' ? 'savedLabel' : 'savedLabelledby'] = el.getAttribute(attr);
        el.removeAttribute(attr);
      }
    }
    el.removeAttribute('tabindex');
    el.removeAttribute('role');
  }
  el.toggleAttribute('data-scrollable', scrollable);
}

function scan() {
  observer?.disconnect();
  const wrappers = document.querySelectorAll('.table-scroll');
  if (!wrappers.length) return;
  if (typeof ResizeObserver === 'undefined') return; // keep the server-rendered, always-focusable regions
  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const wrapper = entry.target.closest('.table-scroll');
      if (wrapper) sync(wrapper);
    }
  });
  wrappers.forEach((el) => {
    sync(el);
    observer.observe(el);
    const table = el.querySelector(':scope > table');
    if (table) observer.observe(table);
  });
}

export function onRouteDidUpdate() {
  if (ExecutionEnvironment.canUseDOM) window.requestAnimationFrame(scan);
}
