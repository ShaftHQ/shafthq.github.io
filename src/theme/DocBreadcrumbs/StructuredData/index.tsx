import React, {type ReactNode} from 'react';

/**
 * Theme-classic DocBreadcrumbs emits BreadcrumbList via this component, but
 * only for docs that appear in a sidebar trail. Many guide pages (e.g.
 * /docs/start/overview) are not in sidebars.js, so that trail is empty and no
 * BreadcrumbList reaches SSR HTML.
 *
 * DocItem/Metadata owns a single BreadcrumbList for every doc page (Home →
 * sidebar crumbs when present → current page). Returning null here avoids a
 * duplicate JSON-LD block on sidebar-backed pages (issue #1154).
 */
export default function DocBreadcrumbsStructuredData(): ReactNode {
  return null;
}
