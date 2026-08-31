const assert = require('node:assert');
const http = require('node:http');
const {spawn} = require('node:child_process');

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
    {env: {...process.env, CI: '1'}},
  );
  let output = '';

  child.stdout.on('data', chunk => output += chunk);
  child.stderr.on('data', chunk => output += chunk);
  child.on('close', code => {
    server.close();
    assert.notEqual(code, 0, output);
    assert(output.includes(`${baseURL} is already used`), output);
    console.log('Playwright worktree isolation contract passed.');
  });
});
