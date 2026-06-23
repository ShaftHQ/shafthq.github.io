import {onRequest} from '../functions/api/gemini-proxy.js';
import worker from '../worker/index.js';

const response = await onRequest({
  request: new Request('https://shaft-engine.automatest.org/api/gemini-proxy', {
    method: 'GET',
  }),
  env: {},
});

if (response.status !== 405) {
  throw new Error(`Expected Cloudflare AutoBot route to reject GET with 405, got ${response.status}.`);
}

const workerApiResponse = await worker.fetch(
  new Request('https://shaft-engine.automatest.org/api/gemini-proxy'),
  {},
  {},
);

if (workerApiResponse.status !== 405) {
  throw new Error(`Expected Worker AutoBot route to reject GET with 405, got ${workerApiResponse.status}.`);
}

const workerAssetResponse = await worker.fetch(
  new Request('https://shaft-engine.automatest.org/autobot-index.json'),
  { ASSETS: { fetch: async () => new Response('asset') } },
  {},
);

if (await workerAssetResponse.text() !== 'asset') {
  throw new Error('Expected Worker to serve non-API requests from static assets.');
}

console.log('Cloudflare AutoBot route checks passed.');
