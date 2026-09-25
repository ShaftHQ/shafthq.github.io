// Rehype plugin: wrap every Markdown/HTML table in a named, keyboard-operable
// scroll region (issue #1076).
//
//   <div class="table-scroll" role="region" tabindex="0" aria-labelledby="<heading id>">
//     <table>…</table>
//   </div>
//
// Why: WCAG 2.2 SC 1.4.10 excepts the data table, not the page, so the wrapper
// scrolls instead of the page. SC 2.1.1 needs the scroller to be reachable by
// keyboard (axe `scrollable-region-focusable`), and SC 4.1.2 needs anything
// focusable to have a role and a name. The table keeps native semantics:
// no CSS display changes on table parts and no role="grid". Name source: the
// table <caption> (aria-labelledby), else the nearest preceding heading's
// text, else the column headers (aria-label). src/clientModules/tableRegions.js drops the tab stop and role
// when a table fits. See /docs/maintainers/site-operations "Wide tables".

const HEADING = /^h[1-6]$/;

function textOf(node) {
  if (!node) return '';
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  return (node.children ?? []).map(textOf).join('');
}

function jsxAttr(node, name) {
  return node.attributes?.find((attr) => attr.type === 'mdxJsxAttribute' && attr.name === name);
}

function isTable(node) {
  return (node.type === 'element' && node.tagName === 'table') ||
    (node.type === 'mdxJsxFlowElement' && node.name === 'table');
}

function isWrapper(node) {
  if (node.type === 'element') return (node.properties?.className ?? []).includes('table-scroll');
  if (node.type === 'mdxJsxFlowElement') return /\btable-scroll\b/.test(String(jsxAttr(node, 'className')?.value ?? ''));
  return false;
}

function headingInfo(node) {
  if (node.type === 'element' && HEADING.test(node.tagName)) {
    return {id: node.properties?.id ? String(node.properties.id) : null, text: textOf(node).trim()};
  }
  if (node.type === 'mdxJsxFlowElement' && HEADING.test(node.name ?? '')) {
    const id = jsxAttr(node, 'id')?.value;
    return {id: typeof id === 'string' ? id : null, text: textOf(node).trim()};
  }
  return null;
}

function captionOf(table) {
  return (table.children ?? []).find((child) =>
    (child.type === 'element' && child.tagName === 'caption') ||
    (child.type === 'mdxJsxFlowElement' && child.name === 'caption'));
}

function columnHeaders(table) {
  const headers = [];
  const walk = (node) => {
    if (headers.length >= 3) return;
    if ((node.type === 'element' && node.tagName === 'th') || (node.type === 'mdxJsxFlowElement' && node.name === 'th')) {
      const text = textOf(node).trim();
      if (text) headers.push(text);
      return;
    }
    (node.children ?? []).forEach(walk);
  };
  walk(table);
  return headers;
}

function wrap(table, label) {
  if (table.type === 'element') {
    return {
      type: 'element',
      tagName: 'div',
      properties: {
        className: ['table-scroll'],
        role: 'region',
        tabIndex: 0,
        ...(label.labelledBy ? {ariaLabelledBy: label.labelledBy} : {ariaLabel: label.text}),
      },
      children: [table],
    };
  }
  const attr = (name, value) => ({type: 'mdxJsxAttribute', name, value});
  return {
    type: 'mdxJsxFlowElement',
    name: 'div',
    attributes: [
      attr('className', 'table-scroll'),
      attr('role', 'region'),
      attr('tabIndex', '0'),
      label.labelledBy ? attr('aria-labelledby', label.labelledBy) : attr('aria-label', label.text),
    ],
    children: [table],
  };
}

module.exports = function rehypeTableRegion() {
  return (tree, file) => {
    let heading = null;
    let tablesUnderHeading = 0;
    let captionCount = 0;
    const names = new Map();

    const labelFor = (table) => {
      const caption = captionOf(table);
      if (caption) {
        if (caption.type === 'element') {
          caption.properties ??= {};
          caption.properties.id ??= `table-caption-${++captionCount}`;
          return {labelledBy: String(caption.properties.id)};
        }
        const id = jsxAttr(caption, 'id')?.value;
        if (typeof id === 'string') return {labelledBy: id};
        return {text: textOf(caption).trim()};
      }
      tablesUnderHeading += 1;
      if (heading?.text) {
        // aria-label, not aria-labelledby: Docusaurus headings contain a
        // hash-link whose own aria-label ("Direct link to …") would be
        // folded into the computed name.
        return {text: tablesUnderHeading === 1 ? heading.text : `${heading.text} (table ${tablesUnderHeading})`};
      }
      const headers = columnHeaders(table);
      return {text: headers.length ? `Table: ${headers.join(', ')}` : 'Table'};
    };

    const visit = (node, parent) => {
      const info = headingInfo(node);
      if (info) {
        heading = info;
        tablesUnderHeading = 0;
        return node;
      }
      if (isTable(node) && !(parent && isWrapper(parent))) {
        const label = labelFor(node);
        // Keep generated names unique on the page.
        if (label.text) {
          const seen = names.get(label.text) ?? 0;
          names.set(label.text, seen + 1);
          if (seen) label.text = `${label.text} ${seen + 1}`;
        }
        return wrap(node, label);
      }
      if (node.children) {
        node.children = node.children.map((child) => visit(child, node));
      }
      return node;
    };
    visit(tree, null);
    return tree;
  };
};
