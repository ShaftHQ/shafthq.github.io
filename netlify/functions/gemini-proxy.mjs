import { GoogleGenerativeAI } from '@google/generative-ai';

export default async (req) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message, history, systemInstruction } = await req.json();

    // Validate required fields
    if (!message || !systemInstruction) {
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Input validation and sanitization
    if (typeof message !== 'string' || message.length === 0 || message.length > 10000) {
      console.debug('[Gemini Proxy] Request rejected: invalid message format');
      return new Response(
        JSON.stringify({ error: 'Invalid message content' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (typeof systemInstruction !== 'string' || systemInstruction.length === 0 || systemInstruction.length > 50000) {
      console.debug('[Gemini Proxy] Request rejected: invalid system instruction format');
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate history format if provided
    if (history && !Array.isArray(history)) {
      console.debug('[Gemini Proxy] Request rejected: invalid history format');
      return new Response(
        JSON.stringify({ error: 'Invalid request' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('[Gemini Proxy] CRITICAL: API key not configured in environment variables');
      console.error('[Gemini Proxy] Please set GEMINI_API_KEY in Netlify environment settings');
      return new Response(
        JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // List of models to try in order of preference
    const modelsToTry = [
      'gemini-3-flash',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemma-3-27b',
      'gemma-3-12b',
      'gemma-3-4b',
      'gemma-3-2b',
      'gemma-3-1b'
    ];
    let lastError = null;
    const failedModels = [];

    // Try each model until one works
    for (const modelName of modelsToTry) {
      try {
        console.log(`[Gemini Proxy] Trying model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemInstruction,
        });

        const chat = model.startChat({
          history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        console.log(`[Gemini Proxy] Successfully used model: ${modelName}`);
        
        return new Response(
          JSON.stringify({ 
            text,
            model: modelName 
          }),
          {
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          }
        );
      } catch (modelError) {
        // Log error type without exposing sensitive details
        console.warn(`[Gemini Proxy] Model ${modelName} failed: ${modelError.constructor.name}`);
        console.debug(`[Gemini Proxy] Error details:`, modelError.message);
        lastError = modelError;
        failedModels.push(modelName);
        // Continue to the next model
      }
    }

    // If we get here, all models failed - provide descriptive error message
    console.error('[Gemini Proxy] All models failed');
    console.error(`[Gemini Proxy] Failed models: ${failedModels.join(', ')}`);
    
    // Determine appropriate error message based on the last error
    let userErrorMessage = 'All AI models are currently unavailable. Please try again later.';
    if (lastError) {
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
      } else if (errorType === 'GoogleGenerativeAIError' || errorMsg.includes('model')) {
        userErrorMessage = 'The AI models are temporarily unavailable. Please try again later.';
      }
    }
    
    throw new Error(userErrorMessage);
    
  } catch (error) {
    // Log detailed error information server-side for debugging
    console.error('[Gemini Proxy] Error occurred:');
    console.error('[Gemini Proxy] Error type:', error.constructor.name);
    console.error('[Gemini Proxy] Error message:', error.message);
    console.error('[Gemini Proxy] Stack trace:', error.stack);
    
    // Return user-friendly error message (already sanitized in the throw statement above)
    // or a generic error for unexpected cases
    const errorMessage = error.message || 'An error occurred while processing your request. Please try again later.';
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
