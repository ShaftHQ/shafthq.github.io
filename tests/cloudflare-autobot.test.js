import {onRequest} from '../functions/api/gemini-proxy.js';
import worker from '../worker/index.js';

const GUIDE_ORIGIN = 'https://shafthq.github.io';
const WORKER_ORIGIN = 'https://shaft-engine.mohab-mohieeldeen.workers.dev';
const API_URL = `${WORKER_ORIGIN}/api/gemini-proxy`;

const response = await onRequest({
  request: new Request(API_URL, {
    method: 'GET',
  }),
  env: {},
});

if (response.status !== 405) {
  throw new Error(`Expected Cloudflare AutoBot route to reject GET with 405, got ${response.status}.`);
}

const workerApiResponse = await worker.fetch(
  new Request(API_URL),
  {},
  {},
);

if (workerApiResponse.status !== 405) {
  throw new Error(`Expected Worker AutoBot route to reject GET with 405, got ${workerApiResponse.status}.`);
}

const preflightResponse = await worker.fetch(
  new Request(API_URL, {
    method: 'OPTIONS',
    headers: {
      Origin: GUIDE_ORIGIN,
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  }),
  {},
  {},
);

if (preflightResponse.status !== 204) {
  throw new Error(`Expected Worker AutoBot CORS preflight to return 204, got ${preflightResponse.status}.`);
}

if (preflightResponse.headers.get('Access-Control-Allow-Origin') !== GUIDE_ORIGIN) {
  throw new Error('Expected Worker AutoBot preflight to allow the GitHub Pages origin.');
}

const blockedPreflightResponse = await worker.fetch(
  new Request(API_URL, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://malicious.example',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type',
    },
  }),
  {},
  {},
);

if (blockedPreflightResponse.headers.has('Access-Control-Allow-Origin')) {
  throw new Error('Expected Worker AutoBot preflight to omit CORS allowance for unknown origins.');
}

const workerPostResponse = await worker.fetch(
  new Request(API_URL, {
    method: 'POST',
    headers: {
      Origin: GUIDE_ORIGIN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'What is SHAFT?',
      history: [],
      systemInstruction: 'Answer from docs only.',
    }),
  }),
  {
    ASSETS: {
      fetch: async () => new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      }),
    },
  },
  {},
);

if (workerPostResponse.status !== 503) {
  throw new Error(`Expected Worker AutoBot POST without GEMINI_API_KEY to return 503, got ${workerPostResponse.status}.`);
}

if (workerPostResponse.headers.get('Access-Control-Allow-Origin') !== GUIDE_ORIGIN) {
  throw new Error('Expected Worker AutoBot POST responses to allow the GitHub Pages origin.');
}

const workerAssetResponse = await worker.fetch(
  new Request(`${WORKER_ORIGIN}/autobot-index.json`),
  { ASSETS: { fetch: async () => new Response('asset') } },
  {},
);

if (await workerAssetResponse.text() !== 'asset') {
  throw new Error('Expected Worker to serve non-API requests from static assets.');
}

console.log('Cloudflare AutoBot route checks passed.');
