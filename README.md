# SHAFT User Guide

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Installation

```shell
yarn install
```

### AutoBot Configuration

AutoBot is an AI-powered chatbot that helps users with SHAFT-related questions. It uses Google's Gemini AI models with automatic fallback for reliability:
- Primary: `gemini-3-flash` (latest model)
- Fallback: `gemini-2.5-flash` (if rate limit is hit on gemini-3-flash)

To enable AutoBot:

#### For Local Development

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. Copy `.env.example` to `.env`:
   ```shell
   cp .env.example .env
   ```
3. Add your API key to the `.env` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
4. Install Netlify CLI (if not already installed):
   ```shell
   npm install -g netlify-cli
   ```
5. Run the development server with Netlify Functions:
   ```shell
   netlify dev
   ```
   This will start both the Docusaurus dev server and Netlify Functions locally.

**Note:** 
- The `.env` file is gitignored and should never be committed to the repository.
- Regular `yarn start` won't work for the chatbot since Netlify Functions won't be available.
- Use `netlify dev` instead to test the full functionality locally.

#### For Production Deployment (Netlify)

**Important:** The AutoBot chatbot requires a Gemini API key to function securely. The key is now stored server-side and never exposed to the client.

##### Architecture

To ensure security, the website uses a serverless proxy architecture:
- The AutoBot frontend sends chat requests to a Netlify Function (`/api/gemini-proxy`)
- The Netlify Function securely accesses the Gemini API using a server-side API key
- The API key is **never** embedded in the client-side JavaScript bundle

##### Step 1: Create the API Key

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. **Optional but Recommended**: Add API restrictions in [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
   - Under "API restrictions", select **"Restrict key"** and enable only **"Generative Language API"**
   - Note: HTTP referrer restrictions are not necessary since the key is server-side only

##### Step 2: Deploy to Netlify

1. Sign up for a free [Netlify account](https://www.netlify.com/)
2. Connect your GitHub repository to Netlify
3. Configure build settings:
   - **Build command**: `yarn build`
   - **Publish directory**: `build`
4. Add environment variable:
   - Go to **Site settings** → **Environment variables**
   - Add `GEMINI_API_KEY` with your API key value
5. Deploy the site

The Netlify Function will automatically handle Gemini API requests securely without exposing the key.

##### For Testing (GitHub Actions)

The test workflow (`.github/workflows/test.yml`) requires the GEMINI_API_KEY secret:
1. In the repository settings, go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `GEMINI_API_KEY`
4. Value: Paste your Gemini API key
5. Click **Add secret**

### Testing AutoBot

For detailed testing instructions, see [CHATBOT_TESTING.md](CHATBOT_TESTING.md).

To run tests:
```shell
# Run all tests
npm test

# Run only chat history tests
npm run test:history

# Run only API tests (requires GEMINI_API_KEY environment variable)
npm run test:api
```

### Local Development

- Start a local server by running this command:
```shell
yarn start
```
- A new browser window will open; most changes are reflected live without having to restart the server.
- Create your own .md files under the `docs` or `blog` directories.
- You can use something like https://dillinger.io/ to help you create the .md file.
- Add your new file to the sidebar if needed by editing this file `/sidebars.js`.


### Deployment

The site is primarily deployed to **Netlify** at https://shaftengine.netlify.app/ for integrated serverless function support:

- When you push to the `master` branch, Netlify automatically builds and deploys the site
- Pull requests get preview deployments for review
- The AutoBot chatbot works securely through Netlify Functions (no API keys in client code)

**GitHub Pages Redirect:** The GitHub Pages site (https://shafthq.github.io/) automatically redirects all visitors to the Netlify deployment. The GitHub Actions workflow in `.github/workflows/deploy.yml` maintains this redirect page.

### Support
If you need support to contribute, kindly join our slack channel to align and discuss.
<br/><a href="https://join.slack.com/t/automatest-workspace/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw" target="_blank"><img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="automatest-workspace" width="50" height="50"/></a>
