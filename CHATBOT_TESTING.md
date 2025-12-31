# Chatbot Testing Guide

## Overview
This document explains how to test the AutoBot chatbot functionality after fixing the Gemini API model issue.

## What Was Fixed

### Issue
The chatbot was using `gemini-1.5-flash` which was returning a 404 error:
```
[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent: [404] models/gemini-1.5-flash is not found for API version v1beta
```

### Solution
1. **Updated to latest model**: Changed primary model to `gemini-2.0-flash-exp` (the latest experimental free model from Google)
2. **Added fallback mechanism**: Implemented automatic fallback to try multiple models in order:
   - `gemini-2.0-flash-exp` (primary - newest experimental model)
   - `gemini-1.5-flash` (fallback - stable model)
   - `gemini-1.5-pro` (final fallback - larger stable model)
3. **Added comprehensive tests**: Created test suite to verify model availability and response relevance

## Testing

### Prerequisites
You need a Gemini API key to test the chatbot. Get one from:
https://ai.google.dev/gemini-api/docs/api-key

### Local Development Testing

1. **Set up your API key**:
   ```bash
   # Copy the example .env file
   cp .env.example .env
   
   # Edit .env and add your API key
   # Replace 'your_api_key_here' with your actual API key
   GEMINI_API_KEY=your_actual_api_key_here
   ```

2. **Run the tests**:
   ```bash
   # Run all tests
   npm test
   
   # Run only chat history tests
   npm run test:history
   
   # Run only API tests (requires API key)
   npm run test:api
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Test the chatbot manually**:
   - Open http://localhost:3000
   - Click the chatbot button (robot icon) in the bottom right
   - Try these test queries:
     - "What is SHAFT?"
     - "How do I get started with SHAFT?"
     - "What are SHAFT features?"
   - Verify that responses are relevant and contain information about SHAFT

### Production Testing

For production deployment, the API key should be configured as a GitHub Secret:

1. Go to your repository Settings → Secrets and variables → Actions
2. Add a new secret:
   - Name: `GEMINI_API_KEY`
   - Value: Your Gemini API key

The deployment workflow will automatically use this secret during the build.

## Test Suite Details

### Chat History Test (`tests/chat-history.test.js`)
Tests the chat history filtering logic to ensure:
- First message in history is always from the user (Gemini API requirement)
- History is limited to the last 10 messages for performance
- Edge cases are handled correctly

### Chatbot API Test (`tests/chatbot-api.test.js`)
Tests the actual Gemini API integration:

1. **Model Availability Test**: Tries each model to verify it's available and responding
2. **Response Relevance Test**: Sends SHAFT-related queries and verifies responses contain expected keywords

The test checks:
- At least one model is working
- Responses contain relevant keywords about SHAFT
- Average relevance score is ≥50%

## Expected Test Results

### With Valid API Key
```
✅ API key found
✅ PASS: Working models found
✅ PASS: Responses are sufficiently relevant
✅ All tests passed!
```

### Without API Key
The test will skip API tests and show:
```
❌ ERROR: API key not configured
Please set GEMINI_API_KEY environment variable
```

## Troubleshooting

### "API key not configured" error
- Check that your `.env` file exists and contains `GEMINI_API_KEY`
- Restart the development server after adding the API key
- For production, verify the GitHub Secret is configured

### "All available models failed" error
- Check your API key is valid
- Verify you haven't exceeded the free tier rate limits (15 requests per minute)
- Check the Google AI Studio status page for any service outages

### Rate Limiting
The free tier has limits:
- 15 requests per minute
- 1,500 requests per day

If you hit these limits:
- Wait a few minutes before trying again
- Consider upgrading to a paid plan for higher limits

## Model Information

### Current Models (December 2024)

| Model | Status | Context Window | Best For |
|-------|--------|----------------|----------|
| `gemini-2.0-flash-exp` | Experimental | 1M tokens | Latest features, fastest |
| `gemini-1.5-flash` | Stable | 1M tokens | Production use |
| `gemini-1.5-pro` | Stable | 2M tokens | Complex queries |

All models are available on the free tier with rate limits.

## Documentation References

- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Get API Key](https://ai.google.dev/gemini-api/docs/api-key)
- [Gemini Models](https://ai.google.dev/gemini-api/docs/models)
- [Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
