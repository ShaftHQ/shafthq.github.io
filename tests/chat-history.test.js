// Test script to verify the chat history filtering logic
// This ensures the first message in history is always from 'user', not 'model'

function testChatHistoryFiltering() {
  console.log('Testing chat history filtering logic...\n');
  
  // Test Case 1: Normal conversation (welcome message + user message + assistant response)
  const messages1 = [
    { role: 'assistant', content: "👋 Hi! I'm AutoBot, your SHAFT assistant. How can I help you today?" },
    { role: 'user', content: 'What is SHAFT?' },
    { role: 'assistant', content: 'SHAFT is a test automation framework...' }
  ];
  
  const recentMessages1 = messages1.slice(-10);
  const firstUserIndex1 = recentMessages1.findIndex(msg => msg.role === 'user');
  const validMessages1 = firstUserIndex1 >= 0 ? recentMessages1.slice(firstUserIndex1) : [];
  const chatHistory1 = validMessages1.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
  
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
  
  const recentMessages2 = messages2.slice(-10);
  const firstUserIndex2 = recentMessages2.findIndex(msg => msg.role === 'user');
  const validMessages2 = firstUserIndex2 >= 0 ? recentMessages2.slice(firstUserIndex2) : [];
  const chatHistory2 = validMessages2.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
  
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
  
  const recentMessages3 = messages3.slice(-10);
  const firstUserIndex3 = recentMessages3.findIndex(msg => msg.role === 'user');
  const validMessages3 = firstUserIndex3 >= 0 ? recentMessages3.slice(firstUserIndex3) : [];
  const chatHistory3 = validMessages3.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
  
  console.log('Test Case 3: Long conversation');
  console.log('Input messages:', messages3.length);
  console.log('Chat history entries:', chatHistory3.length);
  console.log('First role in history:', chatHistory3[0]?.role || 'empty');
  console.log('Expected: user');
  console.log('Result:', chatHistory3[0]?.role === 'user' ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  // Test Case 4: Verify no model-first messages can slip through
  const allTestsPassed = 
    chatHistory1[0]?.role === 'user' &&
    chatHistory2.length === 0 &&
    chatHistory3[0]?.role === 'user';
  
  console.log('='.repeat(50));
  console.log('Overall Result:', allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  console.log('='.repeat(50));
  
  return allTestsPassed;
}

// Run the test
const success = testChatHistoryFiltering();
process.exit(success ? 0 : 1);
