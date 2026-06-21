import React, {useEffect, useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faCopy} from '@fortawesome/free-solid-svg-icons';
import snippets from '@site/src/data/snippets.json';
import styles from './McpApplications.module.css';

type OperatingSystem = 'windows' | 'macos' | 'linux' | 'unknown';

type Application = {
  id: string;
  name: string;
  detail: string;
  flag: string;
  logo: string;
  platforms: OperatingSystem[];
};

type CommandTemplates = Record<Exclude<OperatingSystem, 'unknown'>, string>;

function detectOperatingSystem(): OperatingSystem {
  const platform = (navigator.platform || navigator.userAgent || '').toLowerCase();
  if (platform.includes('win')) return 'windows';
  if (platform.includes('mac')) return 'macos';
  if (platform.includes('linux') || platform.includes('x11')) return 'linux';
  return 'unknown';
}

function commandFor(application: Application, operatingSystem: OperatingSystem): string {
  const commands = snippets.mcpInstaller.commandTemplates as CommandTemplates;
  const template = operatingSystem === 'windows'
    ? commands.windows
    : operatingSystem === 'macos'
      ? commands.macos
      : commands.linux;
  return template
    .replace('{agentFlag}', application.flag)
    .replace('{client}', application.id);
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
    await navigator.clipboard.writeText(commandFor(application, operatingSystem));
    setCopiedId(application.id);
    globalThis.setTimeout(() => setCopiedId(null), 1800);
  }

  return (
    <div className={styles.root} data-detected-os={operatingSystem}>
      <p className={styles.requirements}>
        Use this only after reviewing your security policy. Run from an authenticated shell
        and verify the command output before approving prompts or approvals.
        A selected MCP client, network access, and compatible desktop platform are required.
        The command bootstraps Python and Java only when missing, then installs shaft-mcp from this repository&apos;s release script flow.
      </p>
      <div className={styles.list} aria-label="shaft-mcp applications">
        {applications.map((application) => {
          const command = commandFor(application, operatingSystem);
          const copied = copiedId === application.id;
          return (
            <article
              className={styles.row}
              data-testid={`mcp-app-${application.id}`}
              data-application={application.id}
              key={application.id}
            >
              <div className={styles.identity}>
                <span className={styles.icon} aria-hidden="true">
                  <img className={styles.logo} src={application.logo} alt="" loading="lazy" decoding="async" />
                </span>
                <span>
                  <strong>{application.name}</strong>
                  <small>{application.detail}</small>
                </span>
              </div>
              <code className={styles.command} data-testid={`mcp-command-${application.id}`}>{command}</code>
              <button
                className={styles.copyButton}
                type="button"
                onClick={() => void copyCommand(application)}
                aria-label={`Copy ${application.name} install command`}
                data-testid={`mcp-copy-${application.id}`}
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
