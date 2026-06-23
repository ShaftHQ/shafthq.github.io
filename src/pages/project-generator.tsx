import React, {useEffect, useState} from 'react';
import Head from '@docusaurus/Head';
import styles from './project-generator.module.css';

type ProjectData = Record<string, Record<string, string>>;
type GitHubItem = {
  type: 'dir' | 'file';
  name: string;
  url?: string;
  download_url?: string;
};
type OptionalModule = {
  artifactId: string;
  title: string;
  description: string;
  href: string;
};
type ZipFile = {
  async(type: 'string'): Promise<string>;
};
type Zip = {
  file(path: string): ZipFile;
  file(path: string, content: string): Zip;
  generateAsync(options: {type: 'blob'}): Promise<Blob>;
};

declare global {
  interface Window {
    JSZip?: new () => Zip;
    __generatedFiles?: Record<string, string>;
  }
}

const totalSteps = 6;
const examplesApi =
  'https://api.github.com/repos/ShaftHQ/SHAFT_ENGINE/contents/shaft-engine/src/main/resources/examples';
const rawExamples =
  'https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/refs/heads/main/shaft-engine/src/main/resources/examples';
const fallbackProjects: ProjectData = {
  TestNG: {web: 'shaft-testng-web', mobile: 'shaft-testng-mobile', api: 'shaft-testng-api'},
  JUnit: {web: 'shaft-junit-web', mobile: 'shaft-junit-mobile', api: 'shaft-junit-api'},
  Cucumber: {web: 'shaft-cucumber-web'},
};
const optionalModules: OptionalModule[] = [
  {
    artifactId: 'shaft-capture',
    title: 'SHAFT Capture',
    description: 'Managed browser recording and deterministic test generation.',
    href: '/docs/agentic/capture',
  },
  {
    artifactId: 'shaft-doctor',
    title: 'SHAFT Doctor',
    description: 'Offline evidence collection, diagnosis, and reviewed repair inputs.',
    href: '/docs/agentic/doctor',
  },
  {
    artifactId: 'shaft-ai',
    title: 'SHAFT AI',
    description: 'Direct OpenAI, Anthropic, Gemini, and Ollama provider adapters.',
    href: '/docs/agentic/providers',
  },
  {
    artifactId: 'shaft-heal',
    title: 'SHAFT Heal',
    description: 'Deterministic web locator recovery with local history and reports.',
    href: '/docs/agentic/heal',
  },
  {
    artifactId: 'shaft-browserstack',
    title: 'BrowserStack SDK',
    description: 'BrowserStack Java SDK interception and YAML orchestration.',
    href: '/docs/integrations/browserstack',
  },
  {
    artifactId: 'shaft-video',
    title: 'Desktop video',
    description: 'Local non-headless desktop recording provider.',
    href: '/docs/integrations/video',
  },
  {
    artifactId: 'shaft-visual',
    title: 'Visual testing',
    description: 'Reference-image assertions and image-based touch lookup.',
    href: '/docs/integrations/visual',
  },
  {
    artifactId: 'shaft-mcp',
    title: 'SHAFT MCP',
    description: 'Executable MCP server plus Capture and Doctor CLI.',
    href: '/docs/agentic/mcp',
  },
];

async function fetchJson(url: string): Promise<GitHubItem[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

async function loadProjectData(): Promise<ProjectData> {
  try {
    const runners = await fetchJson(examplesApi);
    const loaded: ProjectData = {};
    for (const runner of runners) {
      if (runner.type !== 'dir' || runner.name.startsWith('.') || !runner.url) continue;
      loaded[runner.name] = {};
      const projects = await fetchJson(runner.url);
      for (const project of projects) {
        if (project.type !== 'dir') continue;
        loaded[runner.name][project.name.split('-').pop() as string] = project.name;
      }
    }
    return Object.keys(loaded).length ? loaded : fallbackProjects;
  } catch (error) {
    console.warn('Using bundled generator options.', error);
    return fallbackProjects;
  }
}

function ensureJsZip(): Promise<void> {
  if (window.JSZip) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not load JSZip.'));
    document.head.appendChild(script);
  });
}

async function fetchDirectoryContents(zip: Zip, projectName: string, url: string, path: string): Promise<void> {
  const items = await fetchJson(url);
  for (const item of items) {
    const itemPath = path ? `${path}/${item.name}` : item.name;
    if (item.type === 'file' && item.download_url) {
      zip.file(`${projectName}/${itemPath}`, await fetchText(item.download_url));
    } else if (item.type === 'dir' && item.url) {
      await fetchDirectoryContents(zip, projectName, item.url, itemPath);
    }
  }
}

function addOptionalDependencies(pom: string, modules: string[]): string {
  const missing = modules.filter(module => !pom.includes(`<artifactId>${module}</artifactId>`));
  if (!missing.length) return pom;
  const block = missing.map(module => [
    '        <dependency>',
    '            <groupId>io.github.shafthq</groupId>',
    `            <artifactId>${module}</artifactId>`,
    '        </dependency>',
  ].join('\n')).join('\n');
  const marker = '\n    </dependencies>\n    <build>';
  if (!pom.includes(marker)) throw new Error('Could not locate project dependency section in pom.xml');
  return pom.replace(marker, `\n${block}${marker}`);
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function labelForPlatform(platform: string): string {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

export default function ProjectGenerator(): JSX.Element {
  const [projectData, setProjectData] = useState<ProjectData>(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedRunner, setSelectedRunner] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [groupId, setGroupId] = useState('io.github.yourUsername');
  const [artifactId, setArtifactId] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [includeGithubActions, setIncludeGithubActions] = useState(true);
  const [includeDependabot, setIncludeDependabot] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    let active = true;
    loadProjectData().then(data => {
      if (!active) return;
      setProjectData(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  function selectRunner(runner: string): void {
    setSelectedRunner(runner);
    setSelectedPlatform('');
    setArtifactId('');
  }

  function selectPlatform(platform: string): void {
    setSelectedPlatform(platform);
    setArtifactId(`shaft-${platform.toLowerCase()}-${selectedRunner.toLowerCase()}`);
  }

  function nextStep(): void {
    if (step === 1 && !selectedRunner) return;
    if (step === 2 && !selectedPlatform) return;
    const next = step + 1;
    if (next === 5 && selectedPlatform === 'mobile') {
      setIncludeGithubActions(false);
      setStep(6);
      return;
    }
    setStep(next);
  }

  function prevStep(): void {
    const previous = step - 1;
    if (previous === 5 && selectedPlatform === 'mobile') {
      setStep(4);
      return;
    }
    setStep(previous);
  }

  function toggleModule(module: string, checked: boolean): void {
    setSelectedModules(current => checked
      ? Array.from(new Set([...current, module]))
      : current.filter(item => item !== module));
  }

  function checkedModules(): string[] {
    return Array.from(new Set([
      ...selectedModules,
      ...(selectedPlatform === 'web' ? ['shaft-visual'] : []),
    ]));
  }

  async function generateProject(): Promise<void> {
    setGenerating(true);
    try {
      await ensureJsZip();
      if (!window.JSZip) throw new Error('JSZip is unavailable.');
      const zip = new window.JSZip();
      const templateProject = projectData[selectedRunner][selectedPlatform];
      await fetchDirectoryContents(zip, artifactId, `${examplesApi}/${selectedRunner}/${templateProject}`, '');

      const pomPath = `${artifactId}/pom.xml`;
      const pomContent = await zip.file(pomPath).async('string');
      const updatedPom = addOptionalDependencies(
        pomContent
          .replace(/<groupId>io\.github\.shafthq<\/groupId>/, `<groupId>${escapeXml(groupId.trim())}</groupId>`)
          .replace(/<artifactId>.*?<\/artifactId>/, `<artifactId>${escapeXml(artifactId.trim())}</artifactId>`)
          .replace(/<version>1\.0-SNAPSHOT<\/version>/, `<version>${escapeXml(version.trim())}</version>`),
        checkedModules(),
      );
      zip.file(pomPath, updatedPom);

      if (includeGithubActions && selectedPlatform !== 'mobile') {
        const workflowName = selectedPlatform === 'web' ? 'web.yml' : 'api.yml';
        zip.file(
          `${artifactId}/.github/workflows/${workflowName}`,
          await fetchText(`${rawExamples}/.github/workflows/${workflowName}`),
        );
      }

      if (includeDependabot) {
        zip.file(`${artifactId}/.github/dependabot.yml`, await fetchText(`${rawExamples}/.github/dependabot.yml`));
      }

      const blob = await zip.generateAsync({type: 'blob'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${artifactId}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setGenerated(true);
    } catch (error) {
      console.error('Error generating project:', error);
      alert('Error generating project. Please try again or check the browser console for details.');
    } finally {
      setGenerating(false);
    }
  }

  function resetGenerator(): void {
    setStep(1);
    setSelectedRunner('');
    setSelectedPlatform('');
    setGroupId('io.github.yourUsername');
    setArtifactId('');
    setVersion('1.0.0');
    setSelectedModules([]);
    setIncludeGithubActions(true);
    setIncludeDependabot(true);
    setGenerated(false);
  }

  const runners = Object.keys(projectData)
    .filter(runner => Object.keys(projectData[runner]).length)
    .sort();
  const platforms = Object.keys(projectData[selectedRunner] || {}).sort();

  return (
    <>
      <Head>
        <title>SHAFT Project Generator</title>
      </Head>
      <main className={styles.page}>
        <section className={styles.container}>
          <header className={styles.header}>
            <img className={styles.logo} src="/img/shaft.svg" alt="SHAFT logo" />
            <h1>SHAFT Project Generator</h1>
            <p>Create your test automation project in seconds</p>
          </header>

          <div className={styles.progressBar} aria-hidden="true">
            <div className={styles.progressFill} style={{width: `${(step / totalSteps) * 100}%`}} />
          </div>

          {!generated && step === 1 && (
            <section>
              <h2 className={styles.stepTitle}>Which test runner do you want to use?</h2>
              <div className={styles.optionGrid}>
                {loading && <p className={styles.muted}>Loading available options...</p>}
                {!loading && runners.map(runner => (
                  <label
                    className={`${styles.option} ${selectedRunner === runner ? styles.selected : ''}`}
                    key={runner}
                  >
                    <input
                      type="radio"
                      name="runner"
                      value={runner}
                      checked={selectedRunner === runner}
                      onChange={() => selectRunner(runner)}
                    />
                    <span>{runner}</span>
                  </label>
                ))}
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} type="button" onClick={nextStep} disabled={!selectedRunner}>
                  Next
                </button>
              </div>
            </section>
          )}

          {!generated && step === 2 && (
            <section>
              <h2 className={styles.stepTitle}>Which platform would you like to start testing first?</h2>
              <div className={styles.optionGrid}>
                {platforms.map(platform => (
                  <label
                    className={`${styles.option} ${selectedPlatform === platform ? styles.selected : ''}`}
                    key={platform}
                  >
                    <input
                      type="radio"
                      name="platform"
                      value={platform}
                      checked={selectedPlatform === platform}
                      onChange={() => selectPlatform(platform)}
                    />
                    <span>{labelForPlatform(platform)}</span>
                  </label>
                ))}
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.secondaryButton} type="button" onClick={prevStep}>Back</button>
                <button className={styles.primaryButton} type="button" onClick={nextStep} disabled={!selectedPlatform}>
                  Next
                </button>
              </div>
            </section>
          )}

          {!generated && step === 3 && (
            <section>
              <h2 className={styles.stepTitle}>What would you like to name your new project?</h2>
              <label className={styles.inputGroup}>
                <span>Group ID</span>
                <input value={groupId} onChange={event => setGroupId(event.target.value)} />
                <small>The group ID for your Maven project</small>
              </label>
              <label className={styles.inputGroup}>
                <span>Artifact ID</span>
                <input value={artifactId} readOnly />
                <small>Auto-generated based on your selections</small>
              </label>
              <label className={styles.inputGroup}>
                <span>Version</span>
                <input value={version} onChange={event => setVersion(event.target.value)} />
                <small>The initial version of your project</small>
              </label>
              <div className={styles.buttonGroup}>
                <button className={styles.secondaryButton} type="button" onClick={prevStep}>Back</button>
                <button className={styles.primaryButton} type="button" onClick={nextStep}>Next</button>
              </div>
            </section>
          )}

          {!generated && step === 4 && (
            <section>
              <h2 className={styles.stepTitle}>Optional SHAFT modules</h2>
              <p className={styles.muted}>Add only the modules your sample project should resolve.</p>
              <div className={styles.moduleGrid}>
                {optionalModules.map(module => {
                  const requiredVisual = module.artifactId === 'shaft-visual' && selectedPlatform === 'web';
                  const checked = requiredVisual || selectedModules.includes(module.artifactId);
                  return (
                    <div className={`${styles.moduleOption} ${checked ? styles.selected : ''}`} key={module.artifactId}>
                      <input
                        id={`module-${module.artifactId}`}
                        type="checkbox"
                        checked={checked}
                        disabled={requiredVisual}
                        onChange={event => toggleModule(module.artifactId, event.target.checked)}
                      />
                      <div>
                        <label htmlFor={`module-${module.artifactId}`}>{module.title}</label>
                        <p>
                          {module.description}
                          {requiredVisual ? ' Required by the bundled web sample. ' : ' '}
                          <a href={module.href} target="_blank" rel="noopener noreferrer" aria-label={`Learn more about ${module.title}`}>
                            Learn more
                          </a>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.secondaryButton} type="button" onClick={prevStep}>Back</button>
                <button className={styles.primaryButton} type="button" onClick={nextStep}>Next</button>
              </div>
            </section>
          )}

          {!generated && step === 5 && (
            <section>
              <h2 className={styles.stepTitle}>Would you like to create a sample GitHub Actions workflow to execute your tests?</h2>
              <label className={styles.option}>
                <input
                  type="checkbox"
                  checked={includeGithubActions}
                  onChange={event => setIncludeGithubActions(event.target.checked)}
                />
                <span>Yes, include GitHub Actions workflow</span>
              </label>
              <div className={styles.buttonGroup}>
                <button className={styles.secondaryButton} type="button" onClick={prevStep}>Back</button>
                <button className={styles.primaryButton} type="button" onClick={nextStep}>Next</button>
              </div>
            </section>
          )}

          {!generated && step === 6 && (
            <section>
              <h2 className={styles.stepTitle}>Would you like GitHub to open a PR automatically when a new SHAFT version is released?</h2>
              <label className={styles.option}>
                <input
                  type="checkbox"
                  checked={includeDependabot}
                  onChange={event => setIncludeDependabot(event.target.checked)}
                />
                <span>Yes, include Dependabot configuration</span>
              </label>
              <div className={styles.buttonGroup}>
                <button className={styles.secondaryButton} type="button" onClick={prevStep}>Back</button>
                <button className={styles.primaryButton} type="button" onClick={generateProject}>Generate Project</button>
              </div>
            </section>
          )}

          {generated && (
            <section className={styles.successMessage} aria-live="polite">
              <div className={styles.successIcon}>✓</div>
              <h2>Project Generated Successfully</h2>
              <p>Your SHAFT project has been generated and the download should start automatically.</p>
              <div className={styles.infoBox}>
                Learn more at <a href="/" target="_blank" rel="noopener noreferrer">shafthq.github.io</a>.
                For advanced settings, use the{' '}
                <a href="/docs/reference/properties/PropertiesList" target="_blank" rel="noopener noreferrer">properties guide</a>.
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.primaryButton} type="button" onClick={resetGenerator}>
                  Generate Another Project
                </button>
              </div>
            </section>
          )}
        </section>
      </main>

      {generating && (
        <div className={styles.generationOverlay}>
          <div className={styles.generationContent}>
            <div className={styles.spinner} aria-hidden="true" />
            <strong>Generating your project</strong>
            <span>Please wait while we prepare your files.</span>
          </div>
        </div>
      )}
    </>
  );
}
