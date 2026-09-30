import crossSpawn from 'cross-spawn';
import {readFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import {setTimeout as delay} from 'node:timers/promises';

const host = '127.0.0.1';
const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const isWindows = process.platform === 'win32';
const yarnCommand = isWindows ? 'yarn.cmd' : 'yarn';
const mavenCommand = isWindows ? 'mvn.cmd' : 'mvn';
const allowedDocsHosts = new Set(['127.0.0.1', 'localhost', 'shafthq.github.io']);

/** Accept only the local preview or the published docs host, then return that origin. */
export function allowlistedDocsBase(raw) {
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error('SHAFT_DOCS_BASE_URL is not a URL');
  }
  if (parsed.username || parsed.password) {
    throw new Error('SHAFT_DOCS_BASE_URL must not carry credentials');
  }
  const hostname = parsed.hostname;
  if (!allowedDocsHosts.has(hostname)) {
    throw new Error(`SHAFT_DOCS_BASE_URL host is not allowlisted: ${hostname}`);
  }
  if (hostname === 'shafthq.github.io') {
    if (parsed.protocol !== 'https:') throw new Error('SHAFT_DOCS_BASE_URL must use https for the published docs host');
    return 'https://shafthq.github.io/';
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('SHAFT_DOCS_BASE_URL must use http or https');
  }
  const port = parsed.port === '' ? (parsed.protocol === 'https:' ? 443 : 80) : Number(parsed.port);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('SHAFT_DOCS_BASE_URL port is not allowed');
  return `http://127.0.0.1:${port}/`;
}

function requestStatus(baseUrl) {
  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    return Promise.resolve(0);
  }
  if (parsed.hostname === 'shafthq.github.io' && parsed.protocol === 'https:') {
    return new Promise(resolve => {
      const request = https.get('https://shafthq.github.io/', {timeout: 5000}, response => {
        response.resume();
        resolve(response.statusCode ?? 0);
      });
      request.on('error', () => resolve(0));
      request.on('timeout', () => request.destroy());
    });
  }
  if (parsed.hostname !== '127.0.0.1' || parsed.protocol !== 'http:') return Promise.resolve(0);
  const port = Number(parsed.port || 80);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return Promise.resolve(0);
  return new Promise(resolve => {
    const request = http.request({
      hostname: '127.0.0.1',
      port,
      path: '/',
      method: 'GET',
      timeout: 5000,
    }, response => {
      response.resume();
      resolve(response.statusCode ?? 0);
    });
    request.on('error', () => resolve(0));
    request.on('timeout', () => request.destroy());
    request.end();
  });
}

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
  const status = await requestStatus(baseUrl);
  return status === 200 || status === 301 || status === 302;
}

async function waitForSite(baseUrl) {
  const deadline = Date.now() + 60000;
  while (Date.now() < deadline) {
    if (await isSiteAvailable(baseUrl)) return;
    await delay(1000);
  }
  throw new Error(`Timed out waiting for ${baseUrl}`);
}

const isDirectRun = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

let server;
let baseUrl = process.env.SHAFT_DOCS_BASE_URL;
if (isDirectRun && baseUrl) baseUrl = allowlistedDocsBase(baseUrl);
if (isDirectRun && !baseUrl) {
  const port = await findAvailablePort(Number(process.env.SHAFT_DOCS_PORT ?? 3000));
  baseUrl = `http://${host}:${port}`;
  server = crossSpawn(yarnCommand, ['serve', '--host', host, '--port', String(port)], {
    cwd: repoRoot,
    shell: false,
    stdio: 'inherit',
    windowsHide: true,
  });
}

if (isDirectRun) try {
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
