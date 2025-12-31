// Test script to verify the chatbot API functionality and model availability
// This ensures that the Gemini API is properly configured and responds correctly

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Test configuration
const MODELS_TO_TEST = [
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

const TEST_QUERIES = [
  {
    query: 'What is SHAFT?',
    expectedKeywords: ['SHAFT', 'automation', 'framework', 'test']
  },
  {
    query: 'How do I get started with SHAFT?',
    expectedKeywords: ['start', 'install', 'setup', 'dependency']
  },
  {
    query: 'What are SHAFT features?',
    expectedKeywords: ['feature', 'API', 'GUI', 'web', 'mobile']
  }
];

// System instruction for the chatbot (same as in component)
const systemInstruction = `You are AutoBot, an intelligent assistant for SHAFT - the Unified Test Automation Engine. 
Your role is to help users understand and use SHAFT effectively.

SHAFT is an award-winning, all-in-one test automation framework that:
- Drives GUI (web, mobile & desktop), API, CLI, and Database test automation
- Has zero boilerplate code requirements
- Provides automatic synchronization, screenshots, logging & reporting
- Is a proud member of the Selenium ecosystem
- Uses a wizard-like syntax (SHAFT.)
- Is powered by WebDriver and follows W3C standards

When answering questions:
1. Be concise and helpful
2. Provide code examples when relevant
3. Reference the official documentation at https://shafthq.github.io
4. Suggest checking the GitHub repository at https://github.com/shafthq/SHAFT_ENGINE for source code
5. Be friendly and encouraging
6. If you don't know something specific, admit it and suggest checking the documentation or GitHub issues

Focus on helping users with:
- Getting started with SHAFT
- Configuration and setup
- Writing tests
- Best practices
- Troubleshooting common issues
- Understanding SHAFT features and capabilities`;

/**
 * Test if a model is available and can generate content
 */
async function testModelAvailability(apiKey, modelName) {
  try {
    console.log(`\nTesting model: ${modelName}`);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction,
    });

    // Simple test query
    const result = await model.generateContent('What is SHAFT in one sentence?');
    const response = await result.response;
    const text = response.text();

    if (text && text.length > 0) {
      console.log(`✅ Model ${modelName} is available and working`);
      console.log(`   Response preview: ${text.substring(0, 100)}...`);
      return { success: true, model: modelName, response: text };
    } else {
      console.log(`❌ Model ${modelName} returned empty response`);
      return { success: false, model: modelName, error: 'Empty response' };
    }
  } catch (error) {
    console.log(`❌ Model ${modelName} failed: ${error.message}`);
    return { success: false, model: modelName, error: error.message };
  }
}

/**
 * Test chatbot response relevance
 */
async function testResponseRelevance(apiKey, modelName, testQuery) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction,
    });

    const result = await model.generateContent(testQuery.query);
    const response = await result.response;
    const text = response.text().toLowerCase();

    // Check if response contains expected keywords
    const foundKeywords = testQuery.expectedKeywords.filter(keyword => 
      text.includes(keyword.toLowerCase())
    );

    const relevanceScore = (foundKeywords.length / testQuery.expectedKeywords.length) * 100;
    
    if (relevanceScore >= 50) {
      console.log(`   ✅ Query: "${testQuery.query}" - Relevance: ${relevanceScore.toFixed(0)}%`);
      console.log(`      Found keywords: ${foundKeywords.join(', ')}`);
      return { success: true, relevanceScore, foundKeywords };
    } else {
      console.log(`   ❌ Query: "${testQuery.query}" - Relevance: ${relevanceScore.toFixed(0)}%`);
      console.log(`      Found keywords: ${foundKeywords.join(', ')}`);
      console.log(`      Missing: ${testQuery.expectedKeywords.filter(k => !foundKeywords.includes(k)).join(', ')}`);
      return { success: false, relevanceScore, foundKeywords };
    }
  } catch (error) {
    console.log(`   ❌ Query failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('='.repeat(70));
  console.log('CHATBOT API TESTS');
  console.log('='.repeat(70));

  // Check if API key is available
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || !apiKey.trim()) {
    console.log('\n❌ ERROR: API key not configured');
    console.log('Please set GEMINI_API_KEY environment variable');
    console.log('You can get an API key from: https://ai.google.dev/gemini-api/docs/api-key');
    return false;
  }

  console.log('\n✅ API key found');

  // Test 1: Model Availability
  console.log('\n' + '='.repeat(70));
  console.log('TEST 1: Model Availability');
  console.log('='.repeat(70));

  const modelResults = [];
  for (const modelName of MODELS_TO_TEST) {
    const result = await testModelAvailability(apiKey, modelName);
    modelResults.push(result);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const workingModels = modelResults.filter(r => r.success);
  
  if (workingModels.length === 0) {
    console.log('\n❌ FAIL: No working models found');
    return false;
  }

  console.log(`\n✅ PASS: ${workingModels.length}/${MODELS_TO_TEST.length} models are working`);
  const primaryModel = workingModels[0].model;
  console.log(`Primary model to use: ${primaryModel}`);

  // Test 2: Response Relevance
  console.log('\n' + '='.repeat(70));
  console.log('TEST 2: Response Relevance');
  console.log('='.repeat(70));
  console.log(`Testing with model: ${primaryModel}\n`);

  const relevanceResults = [];
  for (const testQuery of TEST_QUERIES) {
    const result = await testResponseRelevance(apiKey, primaryModel, testQuery);
    relevanceResults.push(result);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const relevantResponses = relevanceResults.filter(r => r.success);
  const avgRelevance = relevanceResults
    .filter(r => r.relevanceScore !== undefined)
    .reduce((sum, r) => sum + r.relevanceScore, 0) / TEST_QUERIES.length;

  console.log(`\nRelevance Summary:`);
  console.log(`  Relevant responses: ${relevantResponses.length}/${TEST_QUERIES.length}`);
  console.log(`  Average relevance: ${avgRelevance.toFixed(0)}%`);

  if (relevantResponses.length >= TEST_QUERIES.length * 0.8) {
    console.log(`  ✅ PASS: Responses are sufficiently relevant`);
  } else {
    console.log(`  ❌ FAIL: Responses are not sufficiently relevant`);
    return false;
  }

  // Final Summary
  console.log('\n' + '='.repeat(70));
  console.log('FINAL RESULTS');
  console.log('='.repeat(70));
  console.log(`✅ All tests passed!`);
  console.log(`   - Working models: ${workingModels.map(m => m.model).join(', ')}`);
  console.log(`   - Average response relevance: ${avgRelevance.toFixed(0)}%`);
  console.log('='.repeat(70));

  return true;
}

// Run tests if executed directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n❌ Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { runTests, testModelAvailability, testResponseRelevance };
