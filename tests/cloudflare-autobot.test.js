import {onRequest} from '../functions/api/gemini-proxy.js';

const response = await onRequest({
  request: new Request('https://shaft-engine.automatest.org/api/gemini-proxy', {
    method: 'GET',
  }),
  env: {},
});

if (response.status !== 405) {
  throw new Error(`Expected Cloudflare AutoBot route to reject GET with 405, got ${response.status}.`);
}

console.log('Cloudflare AutoBot route checks passed.');
