# SHAFT User Guide

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

### Installation

```shell
yarn install
```

### AutoBot Configuration

AutoBot is an AI-powered chatbot that helps users with SHAFT-related questions. To enable AutoBot:

#### For Local Development

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. Copy `.env.example` to `.env`:
   ```shell
   cp .env.example .env
   ```
3. Add your API key to the `.env` file:
   ```
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```

**Note:** The `.env` file is gitignored and should never be committed to the repository.

#### For Production/GitHub Pages Deployment

**Important:** The AutoBot chatbot requires a Gemini API key to function. The key must be added as a GitHub Secret:

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
2. In the repository settings, go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GEMINI_API_KEY`
5. Value: Paste your Gemini API key
6. Click **Add secret**

The deployment workflow (`.github/workflows/deploy.yml`) will automatically inject this secret as `REACT_APP_GEMINI_API_KEY` during the build process. Without this secret, the chatbot will display an error message when users try to send messages.
4. The deployment workflow will automatically use this secret when building the site

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
