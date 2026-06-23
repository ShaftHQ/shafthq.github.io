import { onRequest as geminiProxy } from '../functions/api/gemini-proxy.js';

export default {
  fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/gemini-proxy') {
      return geminiProxy({ request, env, ctx });
    }
    return env.ASSETS.fetch(request);
  },
};
