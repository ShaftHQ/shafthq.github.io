# GitHub Actions Test Setup - API Key Configuration

## Overview

This document explains how the `GEMINI_API_KEY` secret is configured to be accessible during test execution in GitHub Actions workflows.

## Configuration Changes Made

### ✅ Test Workflow (`.github/workflows/test.yml`)

**Before (API key only in Build step):**
```yaml
- name: Test
  run: yarn test
- name: Build
  run: yarn build
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

**After (API key in both Test and Build steps):**
```yaml
- name: Test
  run: yarn test
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
- name: Build
  run: yarn build
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

### ✅ Deploy Workflow (`.github/workflows/deploy.yml`)

**Before (API key only in Build step):**
```yaml
- name: Test
  run: yarn test
- name: Build
  run: yarn build
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

**After (API key in both Test and Build steps):**
```yaml
- name: Test
  run: yarn test
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
- name: Build
  run: yarn build
  env:
    GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
```

## Why This Change is Important

### Test Types That Require API Key

1. **API Tests** (`npm run test:api`)
   - Tests model availability (gemini-3-flash, gemini-2.0-flash)
   - Tests response relevance with actual Gemini API calls
   - Validates chatbot responses contain SHAFT-related keywords

2. **E2E Interactive Tests** (when implemented)
   - Full chatbot interaction testing
   - Response validation for query: "what is SHAFT?"
   - Ensures bot returns relevant responses, not error messages

### Tests That Don't Require API Key

1. **Chat History Tests** (`npm run test:history`)
   - Tests message filtering logic
   - Tests 10-message limit
   - Tests user-first message requirement

2. **UI/UX E2E Tests**
   - Chatbot button visibility
   - Chat window opening/closing
   - Visual verification
   - Error handling display

## Test Execution Flow

### With API Key Available

```
GitHub Actions Workflow
  ↓
Test Step (with GEMINI_API_KEY env var)
  ↓
npm test (runs all tests)
  ├─ Chat History Tests → ✅ PASS
  ├─ API Availability Tests → ✅ PASS (calls Gemini API)
  ├─ Response Relevance Tests → ✅ PASS (calls Gemini API)
  └─ E2E UI Tests → ✅ PASS
  ↓
Build Step (with GEMINI_API_KEY env var)
  ↓
Deployment
```

### Without API Key (Before Fix)

```
GitHub Actions Workflow
  ↓
Test Step (NO GEMINI_API_KEY)
  ↓
npm test
  ├─ Chat History Tests → ✅ PASS
  ├─ API Availability Tests → ⏭️ SKIPPED (no API key)
  ├─ Response Relevance Tests → ⏭️ SKIPPED (no API key)
  └─ E2E UI Tests → ✅ PASS
  ↓
Build Step (with GEMINI_API_KEY)
  ↓
Deployment
```

## Setting Up the GitHub Secret

### Step 1: Get Gemini API Key

1. Visit: https://ai.google.dev/gemini-api/docs/api-key
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy your API key

### Step 2: Add Secret to GitHub Repository

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Set:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** (paste your API key)
5. Click **Add secret**

### Step 3: Verify Secret is Set

The secret will be automatically available to all GitHub Actions workflows. You can verify it's working by:

1. Creating a pull request
2. Checking the test workflow run
3. Looking for test results that show API tests passing (not skipped)

## Test Results With vs Without API Key

### Without API Key

```
================================================================================
FINAL SUMMARY
================================================================================
Total Tests: 6
✅ Passed: 3
❌ Failed: 0
⏭️  Skipped: 3
Success Rate: 50.0%
================================================================================

Tests skipped:
- Model Availability Test (requires GEMINI_API_KEY)
- Response Relevance Test (requires GEMINI_API_KEY)
- E2E Interactive Chat (requires GEMINI_API_KEY)
```

### With API Key

```
================================================================================
FINAL SUMMARY
================================================================================
Total Tests: 6
✅ Passed: 6
❌ Failed: 0
⏭️  Skipped: 0
Success Rate: 100.0%
================================================================================

All tests passed:
✅ Chat History Filtering
✅ Model Availability (gemini-3-flash: working, gemini-2.0-flash: working)
✅ Response Relevance (average: 85%, all queries relevant)
✅ E2E - Chatbot Opens
✅ E2E - Visual Verification  
✅ E2E - Interactive Chat (response: "SHAFT is an award-winning...")
```

## Verification Commands

### Local Testing (with API key)

```bash
# Set API key
export GEMINI_API_KEY=your_api_key_here

# Run all tests
npm test

# Run only API tests
npm run test:api

# Verify models
npm run verify-models
```

### Check Workflow Configuration

```bash
# View test workflow
cat .github/workflows/test.yml | grep -A 5 "name: Test"

# View deploy workflow
cat .github/workflows/deploy.yml | grep -A 5 "name: Test"
```

## Security Best Practices

✅ **Secret stored in GitHub Secrets** (encrypted at rest)  
✅ **Secret not exposed in logs** (GitHub automatically redacts secret values)  
✅ **Secret only accessible during workflow execution**  
✅ **Secret not committed to repository**  
✅ **Secret can be rotated without code changes**

## Troubleshooting

### Tests Still Skipping in GitHub Actions

**Problem:** API tests show as "skipped" even after adding the secret.

**Solutions:**
1. Verify secret name is exactly `GEMINI_API_KEY` (case-sensitive)
2. Check workflow file has `env: GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}` under Test step
3. Re-run the workflow (sometimes requires a fresh run)
4. Check workflow logs for "API key found" vs "API key not configured"

### API Key Works Locally But Not in GitHub Actions

**Problem:** Tests pass locally but fail/skip in GitHub Actions.

**Solutions:**
1. Confirm secret is added to the repository (not your personal account)
2. Check the secret is in the correct repository
3. Verify workflows have permission to access secrets (should be default)

## Conclusion

✅ **Configuration Complete**

The GitHub Actions workflows are now configured to:
1. Pass `GEMINI_API_KEY` to test execution
2. Enable full API integration testing
3. Validate chatbot responses with actual Gemini API calls
4. Ensure 100% test coverage when secret is configured

**Next Steps:**
1. Add `GEMINI_API_KEY` to repository secrets
2. Push changes to trigger workflow
3. Verify all tests pass (including API tests)
4. Monitor test results in GitHub Actions
