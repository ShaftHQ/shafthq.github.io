import { onRequest as geminiProxy } from '../functions/api/gemini-proxy.js';

const allowedOrigins = new Set(['https://shafthq.github.io']);
const corsHeaders = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

function allowedOrigin(request) {
  const origin = request.headers.get('Origin');
  return allowedOrigins.has(origin) ? origin : null;
}

function withCors(request, response) {
  const origin = allowedOrigin(request);
  if (!origin) return response;

  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Vary', 'Origin');
  Object.entries(corsHeaders).forEach(([name, value]) => headers.set(name, value));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function preflight(request) {
  const headers = new Headers(corsHeaders);
  const origin = allowedOrigin(request);
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }
  return new Response(null, { status: 204, headers });
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/gemini-proxy') {
      if (request.method === 'OPTIONS') {
        return preflight(request);
      }
      return withCors(request, await geminiProxy({ request, env, ctx }));
    }
    return env.ASSETS.fetch(request);
  },
};
