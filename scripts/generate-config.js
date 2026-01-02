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
// Only fail for production builds (when CONTEXT=production or on master branch)
const isProductionBuild = process.env.CONTEXT === 'production' || 
                          process.env.BRANCH === 'master' ||
                          process.env.GITHUB_REF === 'refs/heads/master';

if (!config.GEMINI_API_KEY) {
  if (isProductionBuild) {
    console.error('❌ ERROR: GEMINI_API_KEY environment variable is not set');
    console.error('   Build will fail to prevent deploying non-functional chatbot to production');
    process.exit(1);
  } else {
    console.warn('⚠️  WARNING: GEMINI_API_KEY environment variable is not set');
    console.warn('   This is a preview/test build, so continuing without API key');
    console.warn('   AutoBot will not function in this deployment');
  }
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
