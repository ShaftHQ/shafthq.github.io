import {useEffect} from 'react';
import {useHistory, useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Props = {
  /** Old in-page anchor id (without `#`) -> new site path with hash, e.g. `/docs/start/upgrade/run#download-and-run`. */
  map: Record<string, string>;
};

/**
 * Keeps deep links to sections that moved to another page working (issues
 * #1078/#1079). When the current hash names a section that no longer exists on
 * this page but is listed in `map`, the reader is forwarded with
 * `history.replace` so the back button still returns to the referring page.
 * Renders nothing.
 */
export default function MovedAnchors({map}: Props): null {
  const {hash} = useLocation();
  const history = useHistory();
  const {siteConfig} = useDocusaurusContext();

  useEffect(() => {
    let id = hash.replace(/^#/, '');
    try {
      id = decodeURIComponent(id);
    } catch {
      return;
    }
    if (!id || document.getElementById(id)) return;
    const target = Object.prototype.hasOwnProperty.call(map, id) ? map[id] : undefined;
    if (!target) return;
    history.replace(`${siteConfig.baseUrl.replace(/\/$/, '')}${target}`);
  }, [hash, history, map, siteConfig.baseUrl]);

  return null;
}
