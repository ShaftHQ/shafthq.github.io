// Test script to verify the chat history filtering logic
// This ensures the first message in history is always from 'user', not 'model'

// This function replicates the exact logic from AutoBot component
function buildChatHistory(messages) {
  // Build conversation history (limit to last 10 messages for performance)
  const recentMessages = messages.slice(-10);
  
  // Filter history to ensure first message is from user (Gemini API requirement)
  // Find the index of the first user message
  const firstUserIndex = recentMessages.findIndex(msg => msg.role === 'user');
  const validMessages = firstUserIndex >= 0 ? recentMessages.slice(firstUserIndex) : [];
  
  const chatHistory = validMessages.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
  
  return chatHistory;
}

function testChatHistoryFiltering() {
  console.log('Testing chat history filtering logic...\n');
  
  // Test Case 1: Normal conversation (welcome message + user message + assistant response)
  const messages1 = [
    { role: 'assistant', content: "👋 Hi! I'm AutoBot, your SHAFT assistant. How can I help you today?" },
    { role: 'user', content: 'What is SHAFT?' },
    { role: 'assistant', content: 'SHAFT is a test automation framework...' }
  ];
  
  const chatHistory1 = buildChatHistory(messages1);
  
  console.log('Test Case 1: Normal conversation');
  console.log('Input messages:', messages1.length);
  console.log('Chat history entries:', chatHistory1.length);
  console.log('First role in history:', chatHistory1[0]?.role || 'empty');
  console.log('Expected: user');
  console.log('Result:', chatHistory1[0]?.role === 'user' ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  // Test Case 2: Only welcome message (no user messages yet)
  const messages2 = [
    { role: 'assistant', content: "👋 Hi! I'm AutoBot, your SHAFT assistant. How can I help you today?" }
  ];
  
  const chatHistory2 = buildChatHistory(messages2);
  
  console.log('Test Case 2: Only welcome message (no user input yet)');
  console.log('Input messages:', messages2.length);
  console.log('Chat history entries:', chatHistory2.length);
  console.log('Expected: empty array');
  console.log('Result:', chatHistory2.length === 0 ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  // Test Case 3: Long conversation (testing the slice behavior)
  const messages3 = [
    { role: 'assistant', content: "Welcome!" },
    { role: 'user', content: 'Question 1' },
    { role: 'assistant', content: 'Answer 1' },
    { role: 'user', content: 'Question 2' },
    { role: 'assistant', content: 'Answer 2' },
    { role: 'user', content: 'Question 3' },
    { role: 'assistant', content: 'Answer 3' },
  ];
  
  const chatHistory3 = buildChatHistory(messages3);
  
  console.log('Test Case 3: Long conversation');
  console.log('Input messages:', messages3.length);
  console.log('Chat history entries:', chatHistory3.length);
  console.log('First role in history:', chatHistory3[0]?.role || 'empty');
  console.log('Expected: user');
  console.log('Result:', chatHistory3[0]?.role === 'user' ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  // Test Case 4: Very long conversation (>10 messages, testing the slice limit)
  const messages4 = [
    { role: 'assistant', content: "Welcome!" },
    { role: 'user', content: 'Q1' },
    { role: 'assistant', content: 'A1' },
    { role: 'user', content: 'Q2' },
    { role: 'assistant', content: 'A2' },
    { role: 'user', content: 'Q3' },
    { role: 'assistant', content: 'A3' },
    { role: 'user', content: 'Q4' },
    { role: 'assistant', content: 'A4' },
    { role: 'user', content: 'Q5' },
    { role: 'assistant', content: 'A5' },
    { role: 'user', content: 'Q6' },
    { role: 'assistant', content: 'A6' },
  ];
  
  const chatHistory4 = buildChatHistory(messages4);
  
  console.log('Test Case 4: Very long conversation (>10 messages)');
  console.log('Input messages:', messages4.length);
  console.log('Chat history entries:', chatHistory4.length);
  console.log('Expected: ≤10 entries');
  console.log('First role in history:', chatHistory4[0]?.role || 'empty');
  console.log('Result:', (chatHistory4.length <= 10 && chatHistory4[0]?.role === 'user') ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  // Test Case 5: Verify no model-first messages can slip through
  const allTestsPassed = 
    chatHistory1[0]?.role === 'user' &&
    chatHistory2.length === 0 &&
    chatHistory3[0]?.role === 'user' &&
    chatHistory4.length <= 10 &&
    chatHistory4[0]?.role === 'user';
  
  console.log('='.repeat(50));
  console.log('Overall Result:', allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  console.log('='.repeat(50));
  
  return allTestsPassed;
}

// Run the test
const success = testChatHistoryFiltering();
process.exit(success ? 0 : 1);
