import { GoogleGenAI } from '@google/genai';
import { MAX_MESSAGE_LENGTH, MAX_SYSTEM_INSTRUCTION_LENGTH } from './constants.mjs';

const modelsToTry = [
  'gemini-3-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemma-3-27b',
  'gemma-3-12b',
  'gemma-3-4b',
  'gemma-3-2b',
  'gemma-3-1b',
];

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function messageForModelFailure(lastError) {
  let userErrorMessage = 'All AI models are currently unavailable. Please try again later.';
  if (!lastError) return userErrorMessage;

  const errorMsg = lastError.message || '';
  const errorType = lastError.constructor.name;

  if (errorMsg.includes('rate limit') || errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
    userErrorMessage = 'The AI service is experiencing high demand. Please try again in a few moments.';
  } else if (errorMsg.includes('API key') || errorMsg.includes('permission') || errorMsg.includes('PERMISSION_DENIED')) {
    userErrorMessage = 'There is a configuration issue with the AI service. Please contact support.';
  } else if (errorMsg.includes('network') || errorMsg.includes('timeout') || errorMsg.includes('UNAVAILABLE')) {
    userErrorMessage = 'Unable to connect to the AI service. Please check your connection and try again.';
  } else if (errorMsg.includes('safety') || errorMsg.includes('blocked')) {
    userErrorMessage = 'Your message could not be processed due to content policy. Please rephrase your question.';
  } else if (errorType === 'APIError' || errorMsg.includes('model')) {
    userErrorMessage = 'The AI models are temporarily unavailable. Please try again later.';
  }

  return userErrorMessage;
}

export async function createAutobotResponse(req, {apiKey, getDocumentationContext, serviceName = 'AutoBot'}) {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const { message, history, systemInstruction } = await req.json();

    if (!message || !systemInstruction) {
      return jsonResponse({ error: 'Invalid request' }, 400);
    }

    if (typeof message !== 'string' || message.length === 0 || message.length > MAX_MESSAGE_LENGTH) {
      console.debug(`[${serviceName}] Request rejected: invalid message format`);
      return jsonResponse({ error: 'Invalid message content' }, 400);
    }

    if (typeof systemInstruction !== 'string' || systemInstruction.length === 0 || systemInstruction.length > MAX_SYSTEM_INSTRUCTION_LENGTH) {
      console.debug(`[${serviceName}] Request rejected: invalid system instruction format`);
      return jsonResponse({ error: 'Invalid request' }, 400);
    }

    if (history && !Array.isArray(history)) {
      console.debug(`[${serviceName}] Request rejected: invalid history format`);
      return jsonResponse({ error: 'Invalid request' }, 400);
    }

    if (!apiKey) {
      console.error(`[${serviceName}] CRITICAL: GEMINI_API_KEY is not configured`);
      return jsonResponse({ error: 'Service temporarily unavailable. Please try again later.' }, 503);
    }

    const genAI = new GoogleGenAI({ apiKey });
    const { documentation, githubContext } = await getDocumentationContext(message);

    let enhancedSystemInstruction = systemInstruction;
    if (documentation) {
      enhancedSystemInstruction = `${documentation}\n\n${githubContext}\n\n---\n\n${systemInstruction}\n\nIMPORTANT: Use ONLY the documentation provided above to answer questions. Do not use any external sources, internet searches, or your pre-training knowledge. If the answer is not in the documentation above, clearly state that the information is not available in the official documentation.`;
    } else {
      console.warn(`[${serviceName}] Documentation could not be loaded, using original system instruction`);
    }

    let lastError = null;
    const failedModels = [];

    for (const modelName of modelsToTry) {
      try {
        console.log(`[${serviceName}] Trying model: ${modelName}`);
        const chat = genAI.chats.create({
          model: modelName,
          config: {
            systemInstruction: enhancedSystemInstruction,
          },
          history: history || [],
        });
        const response = await chat.sendMessage({ message });

        console.log(`[${serviceName}] Successfully used model: ${modelName}`);
        return new Response(
          JSON.stringify({
            text: response.text,
            model: modelName,
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
          },
        );
      } catch (modelError) {
        console.warn(`[${serviceName}] Model ${modelName} failed: ${modelError.constructor.name}`);
        console.debug(`[${serviceName}] Error details:`, modelError.message);
        lastError = modelError;
        failedModels.push(modelName);
      }
    }

    console.error(`[${serviceName}] All models failed`);
    console.error(`[${serviceName}] Failed models: ${failedModels.join(', ')}`);
    throw new Error(messageForModelFailure(lastError));
  } catch (error) {
    console.error(`[${serviceName}] Error occurred:`);
    console.error(`[${serviceName}] Error type:`, error.constructor.name);
    console.error(`[${serviceName}] Error message:`, error.message);
    console.error(`[${serviceName}] Stack trace:`, error.stack);

    return jsonResponse({
      error: error.message || 'An error occurred while processing your request. Please try again later.',
    }, 500);
  }
}
