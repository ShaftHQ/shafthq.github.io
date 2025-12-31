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

**🔒 Security Update:** AutoBot now requires users to provide their own API key for security reasons. API keys are no longer embedded in the website build to prevent leakage.

#### For End Users (Website Visitors)

When you open the AutoBot chatbot on the website, you'll be prompted to enter your own Google Gemini API key:

1. **Get a free API key** from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. **IMPORTANT - Add Security Restrictions:**
   - Go to [Google Cloud Console - API Credentials](https://console.cloud.google.com/apis/credentials)
   - Find your API key and click "Edit"
   - Under "Application restrictions", select **"HTTP referrers (web sites)"**
   - Add: `https://shafthq.github.io/*`
   - Under "API restrictions", select **"Restrict key"** and enable only **"Generative Language API"**
   - Click **"Save"**
3. **Enter the API key** in the AutoBot chat window
4. Your key is stored only in your browser's localStorage (never sent to our servers)

**Why this approach?**
- ✅ Prevents API key leakage in the website source code
- ✅ Each user controls their own API usage and costs
- ✅ HTTP referrer restrictions prevent key theft and abuse
- ✅ Your key never leaves your browser

#### For Local Development

To test AutoBot functionality locally:

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. **Optional but Recommended**: Add HTTP referrer restriction for `http://localhost:3000/*`
3. When you open AutoBot in your local development server, enter your API key when prompted
4. The key will be saved in your browser's localStorage for convenience

**Note:** The `.env` file is no longer used for the AutoBot API key. It remains gitignored for other potential secrets.

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
