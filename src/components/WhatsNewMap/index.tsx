import Link from '@docusaurus/Link';
import styles from './styles.module.css';

const groups = [
  {
    to: '/docs/features/whats-new/platform',
    label: 'Platform',
    children: [
      {to: '/docs/features/whats-new/platform#modular-artifacts-and-bom', label: 'BOM and upgrade'},
      {to: '/docs/features/whats-new/platform#project-generator', label: 'Generators'},
    ],
  },
  {
    to: '/docs/features/whats-new/agentic',
    label: 'Agentic',
    children: [
      {to: '/docs/features/whats-new/agentic#capture', label: 'Capture'},
      {to: '/docs/features/whats-new/agentic#shaft-doctor', label: 'Doctor and Heal'},
      {to: '/docs/features/whats-new/agentic#shaft-mcp', label: 'MCP and IntelliJ'},
    ],
  },
  {
    to: '/docs/features/whats-new/evidence',
    label: 'Evidence',
    children: [
      {to: '/docs/features/whats-new/evidence#failure-trace-viewer-on-by-default', label: 'Trace viewer'},
      {to: '/docs/features/whats-new/evidence#allure-shaft-overview-panel', label: 'Allure'},
    ],
  },
  {
    to: '/docs/features/whats-new/testing',
    label: 'Testing',
    children: [
      {to: '/docs/features/whats-new/testing#playwright-gui-backend', label: 'Playwright'},
      {to: '/docs/features/whats-new/testing#ui-and-api-contract-replay', label: 'Contracts and remote terminal'},
    ],
  },
  {
    to: '/docs/features/whats-new/modules',
    label: 'Modules',
    children: [
      {to: '/docs/features/whats-new/modules#optional-artifacts', label: 'Optional artifacts'},
    ],
  },
  {
    to: '/docs/features/whats-new/missed',
    label: 'Features you might have missed',
    children: [
      {to: '/docs/features/whats-new/missed#smart-locators', label: 'Smart and ARIA locators'},
    ],
  },
];

export default function WhatsNewMap(): JSX.Element {
  return (
    <nav className={styles.map} aria-label="What's new map">
      <p className={styles.root}>What's new</p>
      <ul className={styles.groups}>
        {groups.map((group) => (
          <li key={group.to} className={styles.group}>
            <Link className={styles.groupLink} to={group.to}>
              {group.label}
            </Link>
            <ul className={styles.children}>
              {group.children.map((child) => (
                <li key={child.to}>
                  <Link className={styles.childLink} to={child.to}>
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
