// Refreshes src/data/project-signals.json before `docusaurus build` (#1128).
// The landing page shows the current SHAFT release and the GitHub star total
// without any runtime third-party request. Sources: Maven Central metadata
// (release version) and the public GitHub REST API (stargazers_count).
// If either request fails (offline build, rate limit), the committed value is
// kept, so the build never breaks and never shows an invented number.
import {readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const target = fileURLToPath(new URL('../src/data/project-signals.json', import.meta.url));
const releasesFile = fileURLToPath(new URL('../src/data/releases.json', import.meta.url));
const TIMEOUT_MS = 8000;

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {headers: {'User-Agent': 'shafthq.github.io-build', ...headers}, signal: AbortSignal.timeout(TIMEOUT_MS)});
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

const current = JSON.parse(await readFile(target, 'utf8'));
const releases = JSON.parse(await readFile(releasesFile, 'utf8'));
const next = {...current, javaVersion: releases.javaVersion};

try {
  const metadata = await fetchText('https://repo1.maven.org/maven2/io/github/shafthq/shaft-engine/maven-metadata.xml');
  const version = metadata.match(/<release>([0-9][0-9A-Za-z.\-]*)<\/release>/)?.[1];
  if (version) next.engineVersion = version;
} catch (error) {
  console.warn(`project-signals: kept engineVersion ${current.engineVersion} (${error.message})`);
}

try {
  const headers = process.env.GITHUB_TOKEN ? {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`} : {};
  const repo = JSON.parse(await fetchText('https://api.github.com/repos/ShaftHQ/SHAFT_ENGINE', {Accept: 'application/vnd.github+json', ...headers}));
  if (Number.isInteger(repo.stargazers_count)) next.stars = repo.stargazers_count;
} catch (error) {
  console.warn(`project-signals: kept stars ${current.stars} (${error.message})`);
}

if (JSON.stringify(next) !== JSON.stringify(current)) {
  await writeFile(target, `${JSON.stringify(next, null, 2)}\n`);
}
console.log(`project-signals: SHAFT ${next.engineVersion}, ${next.stars ?? 'unknown'} stars`);
