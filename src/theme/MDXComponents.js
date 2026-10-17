import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import BrowserOnly from '@docusaurus/BrowserOnly';

// FAIcon stays available in MDX. Pass an imported icon object
// (for example `icon={faStar}`), because the full Font Awesome library is no
// longer registered globally (#1128): it shipped about 1 MB to every page.
// The icon component loads on demand, so Font Awesome stays out of the main
// bundle every page downloads (#1130 review). Icons are decorative; the server
// HTML renders none.
const LazyFontAwesomeIcon = React.lazy(() => import('@fortawesome/react-fontawesome').then((module) => ({default: module.FontAwesomeIcon})));

function FAIcon(props) {
  return <BrowserOnly>{() => <React.Suspense fallback={null}><LazyFontAwesomeIcon {...props} /></React.Suspense>}</BrowserOnly>;
}

export default {
  ...MDXComponents,
  FAIcon,
};
