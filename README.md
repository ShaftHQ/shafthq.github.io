# SHAFT User Guide

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Installation

```shell
yarn install
```

### AutoBot Configuration

AutoBot is an AI-powered chatbot that helps users with SHAFT-related questions. It uses Google's Gemini AI models with automatic fallback for reliability:
- Primary: `gemini-2.0-flash-exp` (latest experimental model)
- Fallback: `gemini-1.5-flash` (stable model)
- Final fallback: `gemini-1.5-pro` (larger stable model)

To enable AutoBot:

#### For Local Development

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. **Recommended**: Add HTTP referrer restriction for `http://localhost:3000/*` in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (see production instructions above for details)
3. Copy `.env.example` to `.env`:
   ```shell
   cp .env.example .env
   ```
4. Add your API key to the `.env` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

**Note:** The `.env` file is gitignored and should never be committed to the repository.

#### For Production/GitHub Pages Deployment

**Important:** The AutoBot chatbot requires a Gemini API key to function. Follow these steps to configure it securely:

##### Step 1: Create and Restrict the API Key

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. **CRITICAL SECURITY STEP**: Add HTTP referrer restrictions to prevent API key abuse:
   - Go to [Google Cloud Console - API Credentials](https://console.cloud.google.com/apis/credentials)
   - Find your Gemini API key and click "Edit"
   - Under "Application restrictions", select **"HTTP referrers (web sites)"**
   - Click **"Add an item"** and add these referrers:
     - `https://shafthq.github.io/*`
     - `http://localhost:3000/*` (for local testing)
   - Under "API restrictions", select **"Restrict key"** and enable only **"Generative Language API"**
   - Click **"Save"**

   **Why this matters:** Without referrer restrictions, anyone who views your website's JavaScript source code could steal and abuse your API key on their own websites.

##### Step 2: Add API Key to GitHub Secrets

3. In the repository settings, go to **Settings** → **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `GEMINI_API_KEY`
6. Value: Paste your restricted Gemini API key
7. Click **Add secret**

The deployment workflow (`.github/workflows/deploy.yml`) will automatically use this secret during the build process. Without this secret, the chatbot will display an error message when users try to send messages.

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

- Just open a PR with your changes, a temp deployment will be created so that you can view your changes live.
- Once you're happy with the output, submit your PR for review.
- Once it is merged, the changes will be automatically deployed to https://shafthq.github.io/

### Support
If you need support to contribute, kindly join our slack channel to align and discuss.
<br/><a href="https://join.slack.com/t/automatest-workspace/shared_invite/zt-oii5i2gg-0ZGnih_Y34NjK7QqDn01Dw" target="_blank"><img src="https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png" alt="automatest-workspace" width="50" height="50"/></a>
