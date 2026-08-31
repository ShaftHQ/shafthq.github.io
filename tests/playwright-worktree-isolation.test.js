const assert = require('node:assert');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const spawn = require('cross-spawn');

const repoRoot = path.join(__dirname, '..');
const invalidPort = spawn.sync(
  process.execPath,
  ['-e', "require('./playwright.config')"],
  {
    cwd: repoRoot,
    encoding: 'utf8',
    env: {...process.env, SHAFT_DOCS_PORT: '3000/; echo injected; #'},
    shell: false,
  },
);
const invalidPortOutput = `${invalidPort.stdout}${invalidPort.stderr}`;

assert.notEqual(invalidPort.status, 0, invalidPortOutput);
assert(invalidPortOutput.includes('SHAFT_DOCS_PORT must be an integer from 1 to 65535'), invalidPortOutput);
assert.match(
  fs.readFileSync(path.join(repoRoot, '.github', 'workflows', 'pr-build.yml'), 'utf8'),
  /^\s+run: yarn test:playwright:contract$/m,
  'The PR build must run the Playwright worktree-isolation contract.',
);

const server = http.createServer((_request, response) => response.end('unrelated checkout'));

server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  const baseURL = `http://127.0.0.1:${port}`;
  process.env.SHAFT_DOCS_PORT = String(port);

  const config = require('../playwright.config');

  assert.equal(config.use.baseURL, baseURL);
  assert.equal(config.webServer.url, baseURL);
  assert.equal(config.webServer.reuseExistingServer, false);

  const child = spawn(
    process.platform === 'win32' ? 'yarn.cmd' : 'yarn',
    ['playwright', 'test', '--project=chromium', '--grep', '__worktree_isolation_probe__'],
    {env: {...process.env, CI: '1'}, shell: false},
  );
  let output = '';

  child.stdout.on('data', chunk => output += chunk);
  child.stderr.on('data', chunk => output += chunk);
  child.on('error', error => {
    server.close();
    throw error;
  });
  child.on('close', code => {
    server.close();
    assert.notEqual(code, 0, output);
    assert(output.includes(`${baseURL} is already used`), output);
    console.log('Playwright worktree isolation contract passed.');
  });
});
