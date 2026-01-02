import { GoogleGenerativeAI } from '@google/generative-ai';

export default async (req, context) => {
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
        JSON.stringify({ error: 'Missing required fields: message and systemInstruction' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('[Gemini Proxy] API key not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // List of models to try in order of preference
    const modelsToTry = ['gemini-3-flash', 'gemini-2.5-flash'];
    let lastError = null;

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
        console.warn(`[Gemini Proxy] Model ${modelName} failed:`, modelError.message);
        lastError = modelError;
        // Continue to the next model
      }
    }

    // If we get here, all models failed
    throw new Error(lastError?.message || 'All available models failed');
    
  } catch (error) {
    console.error('[Gemini Proxy] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
