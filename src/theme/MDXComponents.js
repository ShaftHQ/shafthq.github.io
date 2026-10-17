import MDXComponents from '@theme-original/MDXComponents';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

// FAIcon stays available in MDX. Pass an imported icon object
// (for example `icon={faStar}`), because the full Font Awesome library is no
// longer registered globally (#1128): it shipped about 1 MB to every page.
export default {
  ...MDXComponents,
  FAIcon: FontAwesomeIcon,
};
