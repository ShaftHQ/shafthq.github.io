# Migration Guide: GitHub Pages to Netlify

> **Note:** This migration has been completed! The site is now fully deployed to Netlify at https://shaftengine.netlify.app/, and GitHub Pages (https://shafthq.github.io/) automatically redirects all visitors to the Netlify deployment.

## Overview

This guide explains the migration from GitHub Pages to Netlify to address the security vulnerability where the Gemini API key was being embedded in client-side JavaScript files.

## Security Issue

**Problem:** The previous deployment approach embedded the `GEMINI_API_KEY` in the static build files during compilation. This meant anyone could extract the API key from the website's JavaScript source code.

**Solution:** Use Netlify's serverless functions to create a secure API proxy that keeps the API key server-side only.

## Architecture Changes

### Before (Insecure)
```
User Browser → Static Site (with embedded API key) → Gemini API
```
- API key was in `docusaurus.config.js` customFields
- Key was bundled into `build/assets/js/main.*.js`
- Anyone could extract the key from browser DevTools

### After (Secure)
```
User Browser → Static Site → Netlify Function (with API key) → Gemini API
```
- API key is stored as Netlify environment variable
- Frontend calls `/api/gemini-proxy` endpoint
- Netlify Function handles the actual Gemini API calls
- API key never reaches the client

## Files Changed

### 1. `docusaurus.config.js`
**Removed:**
```javascript
customFields: {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
},
```

### 2. `src/components/AutoBot/index.tsx`
**Changed:** Removed direct Gemini API integration
**Added:** Fetch call to `/api/gemini-proxy` endpoint

### 3. `netlify.toml` (New)
Configuration file for Netlify deployment:
- Build command: `yarn build`
- Publish directory: `build`
- Functions directory: `netlify/functions`
- API proxy redirect: `/api/*` → `/.netlify/functions/:splat`

### 4. `netlify/functions/gemini-proxy.mjs` (New)
Serverless function that:
- Receives chat requests from the frontend
- Securely accesses Gemini API with server-side API key
- Returns responses to the frontend

### 5. `.github/workflows/deploy.yml`
**Removed:** `GEMINI_API_KEY` from build step environment variables
(Key is no longer needed during build since it's not embedded)

## Migration Steps

### Step 1: Set up Netlify Account

1. Go to [netlify.com](https://www.netlify.com/) and sign up
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and authorize Netlify
4. Select the `shafthq.github.io` repository

### Step 2: Configure Build Settings

Netlify should auto-detect settings from `netlify.toml`, but verify:
- **Build command:** `yarn build`
- **Publish directory:** `build`
- **Functions directory:** `netlify/functions`

### Step 3: Add Environment Variable

1. Go to Site settings → Environment variables
2. Click "Add a variable"
3. Key: `GEMINI_API_KEY`
4. Value: Your Gemini API key
5. Click "Save"

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for the build to complete
3. Netlify will provide you with a URL (e.g., `random-name-123.netlify.app`)

### Step 5: Set up Custom Domain (Optional)

If you want to keep using `shafthq.github.io`:

**Option A: Use Netlify subdomain**
- Update DNS to point to Netlify
- Add custom domain in Netlify settings

**Option B: Keep GitHub Pages URL**
- Update repository settings to use Netlify deploy previews
- Keep GitHub Pages for documentation only

### Step 6: Test the Chatbot

1. Visit your Netlify site
2. Open the AutoBot chatbot
3. Send a test message
4. Check browser DevTools → Network tab to verify requests go to `/api/gemini-proxy`
5. Inspect the built JavaScript files to confirm no API key is embedded

### Step 7: Disable GitHub Pages Deployment (Optional)

If moving entirely to Netlify:
1. Disable the GitHub Actions workflow or modify it to skip deployment
2. In repository settings, disable GitHub Pages

## Verification

### Verify API Key is NOT in Client Code

```bash
# Build the site
yarn build

# Search for API key patterns (should return nothing)
grep -r "AIza" build/
grep -r "GEMINI_API_KEY" build/

# Check the main JavaScript bundle
find build/assets/js -name "main.*.js" -exec grep -l "customFields" {} \;
# Should find customFields but NO API key value
```

### Verify Function is Called

1. Open browser DevTools (F12)
2. Go to Network tab
3. Open AutoBot and send a message
4. Look for request to `/api/gemini-proxy`
5. Response should come from Netlify Function, not direct Gemini API call

## Rollback Plan

If you need to rollback for any reason:

1. Revert changes to `docusaurus.config.js` (restore customFields)
2. Revert changes to `src/components/AutoBot/index.tsx`
3. Restore `GEMINI_API_KEY` in `.github/workflows/deploy.yml` build step
4. Delete `netlify.toml` and `netlify/functions/`
5. Re-deploy via GitHub Actions

**Note:** This rollback is NOT recommended as it reintroduces the security vulnerability.

## Benefits of Migration

1. **Security:** API key is never exposed to clients
2. **Control:** Server-side validation and rate limiting possible
3. **Monitoring:** Centralized logging of API usage
4. **Flexibility:** Easy to add authentication, caching, or other middleware
5. **Cost Control:** Better management of API quota usage

## Support

If you encounter issues:
- Check Netlify Function logs in Netlify dashboard
- Verify `GEMINI_API_KEY` environment variable is set
- Check browser console for errors
- Review Network tab for failed requests

## GitHub Pages Redirect

To ensure users visiting the old GitHub Pages URL are automatically redirected to Netlify:

1. A simple redirect page is maintained in the `redirect-page/` directory
2. The GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys only this redirect page to GitHub Pages
3. When users visit https://shafthq.github.io/, they are automatically redirected to https://shaftengine.netlify.app/
4. The redirect uses both meta refresh and JavaScript for maximum compatibility

This ensures a seamless transition for users who have bookmarked or linked to the old URL.

## Additional Resources

- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Docusaurus Deployment Guide](https://docusaurus.io/docs/deployment)
