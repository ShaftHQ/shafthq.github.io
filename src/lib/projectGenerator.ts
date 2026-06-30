export type ProjectData = Record<string, Record<string, string>>;

export type GitHubItem = {
  type: 'dir' | 'file';
  name: string;
  url?: string;
  download_url?: string;
};

export type OptionalModule = {
  artifactId: string;
  title: string;
  description: string;
  href: string;
};

export const examplesApi =
  'https://api.github.com/repos/ShaftHQ/SHAFT_ENGINE/contents/shaft-engine/src/main/resources/examples';
export const rawExamples =
  'https://raw.githubusercontent.com/ShaftHQ/SHAFT_ENGINE/refs/heads/main/shaft-engine/src/main/resources/examples';
export const fallbackProjects: ProjectData = {
  TestNG: {web: 'shaft-testng-web', mobile: 'shaft-testng-mobile', api: 'shaft-testng-api'},
  JUnit: {web: 'shaft-junit-web', mobile: 'shaft-junit-mobile', api: 'shaft-junit-api'},
  Cucumber: {web: 'shaft-cucumber-web'},
};
export const optionalModules: OptionalModule[] = [
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
    description: 'Direct OpenAI, Anthropic, Gemini, GitHub Models, and Ollama provider adapters.',
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
    artifactId: 'shaft-sikulix',
    title: 'SikuliX desktop',
    description: 'Image-based Windows desktop automation through SikuliX.',
    href: '/docs/integrations/sikulix',
  },
  {
    artifactId: 'shaft-mcp',
    title: 'SHAFT MCP',
    description: 'Executable MCP server plus Capture and Doctor CLI.',
    href: '/docs/agentic/mcp',
  },
];

export async function fetchJson(url: string): Promise<GitHubItem[]> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

export async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

export async function loadProjectData(): Promise<ProjectData> {
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

export function addOptionalDependencies(pom: string, modules: string[]): string {
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

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function labelForPlatform(platform: string): string {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

export function defaultArtifactId(runner: string, platform: string): string {
  return `shaft-${platform.toLowerCase()}-${runner.toLowerCase()}`;
}

export function checkedModules(selectedModules: string[], platform: string): string[] {
  return Array.from(new Set([
    ...selectedModules,
    ...(platform === 'web' ? ['shaft-visual'] : []),
  ]));
}
