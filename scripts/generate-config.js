#!/usr/bin/env node

/**
 * Generate runtime configuration file with API key
 * This script is run during build to create a config file that can be fetched at runtime
 */

const fs = require('fs');
const path = require('path');

const config = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  generated_at: new Date().toISOString()
};

// Validate that API key is present
if (!config.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY environment variable is not set');
  console.error('   Build will fail to prevent deploying non-functional chatbot');
  process.exit(1);
}

// Create static directory if it doesn't exist
const staticDir = path.join(__dirname, '..', 'static');
if (!fs.existsSync(staticDir)) {
  fs.mkdirSync(staticDir, { recursive: true });
}

// Write config to static directory so it's served by the site
const configPath = path.join(staticDir, 'config.json');
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log('✅ Runtime configuration generated successfully');
console.log(`📝 Config written to: ${configPath}`);
console.log(`🔑 API Key configured: ${config.GEMINI_API_KEY ? 'Yes' : 'No'}`);
