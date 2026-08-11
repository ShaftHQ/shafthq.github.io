import crossSpawn from 'cross-spawn';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import net from 'node:net';
import {setTimeout as delay} from 'node:timers/promises';

const host = '127.0.0.1';
const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const isWindows = process.platform === 'win32';
const yarnCommand = isWindows ? 'yarn.cmd' : 'yarn';
const mavenCommand = isWindows ? 'mvn.cmd' : 'mvn';
const externalBaseUrl = process.env.SHAFT_DOCS_BASE_URL;

const releases = JSON.parse(await readFile(new URL('../src/data/releases.json', import.meta.url), 'utf8'));
const shaftVersion = releases.engineVersion;

async function findAvailablePort(start) {
  for (let port = start; port < start + 50; port += 1) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available local port found from ${start} to ${start + 49}`);
}

function isPortAvailable(port) {
  return new Promise(resolve => {
    const server = net.createServer()
      .once('error', () => resolve(false))
      .once('listening', () => server.close(() => resolve(true)))
      .listen(port);
  });
}

async function isSiteAvailable(baseUrl) {
  try {
    const response = await fetch(baseUrl, {redirect: 'manual'});
    return response.ok || response.status === 301 || response.status === 302;
  } catch {
    return false;
  }
}

async function waitForSite(baseUrl) {
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    if (await isSiteAvailable(baseUrl)) return;
    await delay(1000);
  }
  throw new Error(`Timed out waiting for ${baseUrl}`);
}

let server;
let baseUrl = externalBaseUrl;
if (!baseUrl) {
  const port = await findAvailablePort(Number(process.env.SHAFT_DOCS_PORT ?? 3000));
  baseUrl = `http://${host}:${port}`;
  server = crossSpawn(yarnCommand, ['serve', '--host', host, '--port', String(port)], {
    cwd: repoRoot,
    shell: false,
    stdio: 'inherit',
    windowsHide: true,
  });
}

try {
  await waitForSite(baseUrl);

  const result = crossSpawn.sync(mavenCommand, [
    '-f',
    'tests/shaft/pom.xml',
    'test',
    `-Dshaft.version=${shaftVersion}`,
    `-Dsite.baseUrl=${baseUrl}`,
    '-Dgpg.skip=true',
    '-Dallure.automaticallyOpen=false',
  ], {
    cwd: repoRoot,
    shell: false,
    stdio: 'inherit',
    windowsHide: true,
  });

  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  if (server) {
    if (isWindows) {
      crossSpawn.sync('taskkill', ['/pid', String(server.pid), '/t', '/f'], {stdio: 'ignore'});
    } else {
      server.kill('SIGTERM');
    }
  }
}
