// Test script to verify the chatbot API functionality and model availability
// This ensures that the Gemini API is properly configured and responds correctly

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Test configuration
const MODELS_TO_TEST = [
  'gemini-3-flash',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemma-3-27b',
  'gemma-3-12b',
  'gemma-3-4b',
  'gemma-3-2b',
  'gemma-3-1b'
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

// System instruction for the chatbot (aligned with new approach)
const systemInstruction = `You are AutoBot, the intelligent technical assistant for SHAFT, the Unified Test Automation Engine. Your objective is to help users by retrieving accurate information from the official SHAFT documentation and GitHub repository that have been provided to you.

SCOPE OF KNOWLEDGE
You have been provided with:
1. The complete SHAFT Engine user guide documentation
2. Information about the official SHAFT GitHub repository (github.com/shafthq/SHAFT_ENGINE)

STRICT OPERATIONAL RULES
1. SOURCE RESTRICTION: Use information ONLY from the documentation and repository information that has been provided to you in your system context. Do NOT use:
   - Your pre-training knowledge
   - Internet searches
   - Previously cached information
   - Any external sources
2. ACCURACY OVER HELPFULNESS: Only answer based on what you can find in the provided documentation. If information is not in the documentation, clearly state this.
3. CODE SNIPPETS: Provide Java code examples only if they are derived from the official documentation or follow standard SHAFT patterns (e.g., fluid syntax starting with SHAFT.).
4. DOCUMENTATION REFERENCES: When providing answers, reference the specific document or section where the information was found.

HANDLING MISSING DATA
If you cannot find the answer in the provided documentation, you must state:
"I could not find verified information about this in the SHAFT documentation provided to me. For more details, please check:
- GitHub Repository: https://github.com/shafthq/SHAFT_ENGINE
- GitHub Issues: https://github.com/shafthq/SHAFT_ENGINE/issues
- GitHub Discussions: https://github.com/shafthq/SHAFT_ENGINE/discussions
- User Guide: https://shaftengine.netlify.app/"

RESPONSE GUIDELINES
When answering questions:
1. Search thoroughly through the provided documentation
2. Be concise and accurate
3. Provide code examples from the documentation when relevant
4. Reference specific documentation sections or files
5. If uncertain, admit it rather than guessing
6. Guide users to the appropriate GitHub resources for advanced topics

Focus on helping users with:
- Getting started with SHAFT
- Configuration and setup
- Writing tests (Web, Mobile, API, CLI, Database)
- Best practices and patterns
- Understanding SHAFT features
- Troubleshooting common issues
`;

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
    const testQuestion = 'What is SHAFT in one sentence?';
    console.log(`   Query: "${testQuestion}"`);
    
    const result = await model.generateContent(testQuestion);
    const response = await result.response;
    const text = response.text();

    if (text && text.length > 0) {
      console.log(`✅ Model ${modelName} is available and working`);
      console.log(`   Response: ${text.substring(0, 150)}${text.length > 150 ? '...' : ''}`);
      return { success: true, model: modelName, response: text };
    } else {
      console.log(`❌ Model ${modelName} returned empty response`);
      return { success: false, model: modelName, error: 'Empty response' };
    }
  } catch (error) {
    console.log(`❌ Model ${modelName} failed: ${error.message}`);
    console.log(`   Error details: ${error.stack || 'No stack trace available'}`);
    return { success: false, model: modelName, error: error.message, errorStack: error.stack };
  }
}

/**
 * Test chatbot response relevance with full conversation output
 */
async function testResponseRelevance(apiKey, modelName, testQuery) {
  console.log(`\n   Testing: "${testQuery.query}"`);
  console.log(`   ${'─'.repeat(65)}`);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemInstruction,
    });

    // Generate response
    const result = await model.generateContent(testQuery.query);
    const response = await result.response;
    const text = response.text();
    
    // Print full conversation
    console.log(`   👤 User: ${testQuery.query}`);
    console.log(`   🤖 Bot:  ${text}`);
    console.log(`   ${'─'.repeat(65)}`);

    // Check if response is valid
    if (!text || text.trim().length === 0) {
      console.log(`   ❌ Empty response received`);
      return { 
        success: false, 
        error: 'Empty response',
        query: testQuery.query,
        response: text
      };
    }

    // Check if response contains expected keywords
    const textLower = text.toLowerCase();
    const foundKeywords = testQuery.expectedKeywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );
    const missingKeywords = testQuery.expectedKeywords.filter(keyword => 
      !textLower.includes(keyword.toLowerCase())
    );

    const relevanceScore = (foundKeywords.length / testQuery.expectedKeywords.length) * 100;
    
    // Print keyword analysis
    console.log(`   📊 Relevance Analysis:`);
    console.log(`      Score: ${relevanceScore.toFixed(0)}%`);
    console.log(`      Found keywords: ${foundKeywords.length > 0 ? foundKeywords.join(', ') : 'none'}`);
    if (missingKeywords.length > 0) {
      console.log(`      Missing keywords: ${missingKeywords.join(', ')}`);
    }
    
    if (relevanceScore >= 50) {
      console.log(`   ✅ PASS - Response is relevant to the query`);
      return { 
        success: true, 
        relevanceScore, 
        foundKeywords, 
        missingKeywords,
        query: testQuery.query,
        response: text
      };
    } else {
      console.log(`   ❌ FAIL - Response relevance too low (${relevanceScore.toFixed(0)}% < 50%)`);
      return { 
        success: false, 
        relevanceScore, 
        foundKeywords, 
        missingKeywords,
        query: testQuery.query,
        response: text,
        error: `Relevance score ${relevanceScore.toFixed(0)}% is below threshold`
      };
    }
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
    console.log(`   Stack trace: ${error.stack}`);
    return { 
      success: false, 
      error: error.message,
      errorStack: error.stack,
      query: testQuery.query
    };
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
    try {
      const result = await testModelAvailability(apiKey, modelName);
      modelResults.push(result);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`\n❌ Unexpected error testing model ${modelName}:`);
      console.error(`   Error: ${error.message}`);
      console.error(`   Stack: ${error.stack}`);
      modelResults.push({ 
        success: false, 
        model: modelName, 
        error: error.message,
        errorStack: error.stack
      });
    }
  }

  const workingModels = modelResults.filter(r => r.success);
  const failedModels = modelResults.filter(r => !r.success);
  
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Model Availability Summary:`);
  console.log(`${'='.repeat(70)}`);
  console.log(`  Working models: ${workingModels.length}/${MODELS_TO_TEST.length}`);
  
  if (failedModels.length > 0) {
    console.log(`  Failed models: ${failedModels.length}`);
    failedModels.forEach((result, index) => {
      console.log(`    ${index + 1}. ${result.model}: ${result.error || 'Unknown error'}`);
    });
  }
  
  if (workingModels.length === 0) {
    console.log('\n❌ FAIL: No working models found');
    console.log('\nPossible issues:');
    console.log('  1. API key may be invalid or revoked');
    console.log('  2. Models may not be available in your region');
    console.log('  3. Rate limits may have been exceeded');
    console.log('  4. Network connectivity issues');
    return false;
  }

  console.log(`\n✅ PASS: At least one model is working`);
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
  const failedResponses = relevanceResults.filter(r => !r.success);
  const avgRelevance = relevanceResults
    .filter(r => r.relevanceScore !== undefined)
    .reduce((sum, r) => sum + r.relevanceScore, 0) / TEST_QUERIES.length;

  console.log(`\n${'='.repeat(70)}`);
  console.log(`Relevance Test Summary:`);
  console.log(`${'='.repeat(70)}`);
  console.log(`  Relevant responses: ${relevantResponses.length}/${TEST_QUERIES.length}`);
  console.log(`  Average relevance: ${avgRelevance.toFixed(0)}%`);
  
  // Show failed tests details
  if (failedResponses.length > 0) {
    console.log(`\n  Failed queries (${failedResponses.length}):`);
    failedResponses.forEach((result, index) => {
      console.log(`    ${index + 1}. "${result.query}"`);
      if (result.error) {
        console.log(`       Error: ${result.error}`);
      } else if (result.relevanceScore !== undefined) {
        console.log(`       Relevance: ${result.relevanceScore.toFixed(0)}% (threshold: 50%)`);
      }
    });
  }

  if (relevantResponses.length >= TEST_QUERIES.length * 0.8) {
    console.log(`\n  ✅ PASS: Responses are sufficiently relevant (${(relevantResponses.length / TEST_QUERIES.length * 100).toFixed(0)}% success rate)`);
  } else {
    console.log(`\n  ❌ FAIL: Responses are not sufficiently relevant (${(relevantResponses.length / TEST_QUERIES.length * 100).toFixed(0)}% success rate < 80% required)`);
    console.log(`\nDetailed failure information saved above.`);
    return false;
  }

  // Final Summary
  console.log('\n' + '='.repeat(70));
  console.log('FINAL RESULTS');
  console.log('='.repeat(70));
  console.log(`✅ All tests passed!`);
  console.log(`   - Working models: ${workingModels.map(m => m.model).join(', ')}`);
  console.log(`   - Test queries executed: ${TEST_QUERIES.length}`);
  console.log(`   - Successful responses: ${relevantResponses.length}/${TEST_QUERIES.length}`);
  console.log(`   - Average response relevance: ${avgRelevance.toFixed(0)}%`);
  console.log('='.repeat(70));

  return true;
}

// Run tests if executed directly
if (require.main === module) {
  // Add process-level error handlers
  process.on('unhandledRejection', (reason, promise) => {
    console.error('\n❌ Unhandled Promise Rejection:');
    console.error('Reason:', reason);
    console.error('Promise:', promise);
    process.exit(1);
  });

  process.on('uncaughtException', (error) => {
    console.error('\n❌ Uncaught Exception:');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  });

  runTests()
    .then(success => {
      if (success) {
        console.log('\n✅ Test suite completed successfully');
        process.exit(0);
      } else {
        console.log('\n❌ Test suite failed - see errors above');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n❌ Fatal error during test execution:');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      console.error('\nPlease check:');
      console.error('  1. GEMINI_API_KEY environment variable is set correctly');
      console.error('  2. API key is valid and has not been revoked');
      console.error('  3. Network connectivity is working');
      console.error('  4. Rate limits have not been exceeded');
      process.exit(1);
    });
}

module.exports = { runTests, testModelAvailability, testResponseRelevance };
