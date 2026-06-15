import React, {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import type {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {
  faBolt,
  faCheck,
  faCode,
  faCopy,
  faDesktop,
  faLaptopCode,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import snippets from '@site/src/data/snippets.json';
import styles from './McpApplications.module.css';

type OperatingSystem = 'windows' | 'macos' | 'linux' | 'unknown';

type Application = {
  id: string;
  name: string;
  detail: string;
  flag: string;
  icon: keyof typeof APPLICATION_ICONS;
  platforms: OperatingSystem[];
};

const APPLICATION_ICONS: Record<string, IconDefinition> = {
  terminal: faTerminal,
  bolt: faBolt,
  code: faCode,
  desktop: faDesktop,
  github: faGithub,
  'laptop-code': faLaptopCode,
};

function detectOperatingSystem(): OperatingSystem {
  const platform = (navigator.platform || navigator.userAgent || '').toLowerCase();
  if (platform.includes('win')) return 'windows';
  if (platform.includes('mac')) return 'macos';
  if (platform.includes('linux') || platform.includes('x11')) return 'linux';
  return 'unknown';
}

function commandFor(flag: string): string {
  return snippets.mcpInstaller.commandTemplate.replace('{agentFlag}', flag);
}

export function McpApplications(): JSX.Element {
  const [operatingSystem, setOperatingSystem] = useState<OperatingSystem>('unknown');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setOperatingSystem(detectOperatingSystem());
  }, []);

  const applications = useMemo(
    () => (snippets.mcpInstaller.applications as Application[]).filter(
      (application) => operatingSystem === 'unknown'
        || application.platforms.includes(operatingSystem),
    ),
    [operatingSystem],
  );

  async function copyCommand(application: Application): Promise<void> {
    await navigator.clipboard.writeText(commandFor(application.flag));
    setCopiedId(application.id);
    globalThis.setTimeout(() => setCopiedId(null), 1800);
  }

  return (
    <div className={styles.root} data-detected-os={operatingSystem}>
      <p className={styles.requirements}>
        Requires Java 25, Maven 3.9+, and the selected application.
        The command installs or updates the latest Maven Central release.
      </p>
      <div className={styles.list} aria-label="shaft-mcp applications">
        {applications.map((application) => {
          const command = commandFor(application.flag);
          const copied = copiedId === application.id;
          return (
            <article className={styles.row} data-application={application.id} key={application.id}>
              <div className={styles.identity}>
                <span className={styles.icon} aria-hidden="true">
                  <FontAwesomeIcon icon={APPLICATION_ICONS[application.icon]} />
                </span>
                <span>
                  <strong>{application.name}</strong>
                  <small>{application.detail}</small>
                </span>
              </div>
              <code className={styles.command}>{command}</code>
              <button
                className={styles.copyButton}
                type="button"
                onClick={() => void copyCommand(application)}
                aria-label={`Copy ${application.name} install command`}
              >
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </article>
          );
        })}
      </div>
      <p className={styles.manualLink}>
        Need to inspect or edit the configuration yourself?{' '}
        <Link to="/docs/agentic/mcp/manual">Open the manual configuration guide.</Link>
      </p>
    </div>
  );
}
