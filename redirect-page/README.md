# GitHub Pages Redirect

This directory contains a simple redirect page that is deployed to GitHub Pages (https://shafthq.github.io/).

## Purpose

Since the main site has been migrated to Netlify (https://shaftengine.netlify.app/), this redirect ensures that users visiting the old GitHub Pages URL are automatically forwarded to the new location.

## Contents

- `index.html` - A simple HTML page with meta refresh and JavaScript redirect
- `.nojekyll` - Ensures GitHub Pages serves the files correctly without Jekyll processing

## How It Works

1. The GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys this directory to the `gh-pages` branch
2. GitHub Pages serves the content from the `gh-pages` branch
3. When users visit https://shafthq.github.io/, they see this redirect page
4. The page immediately redirects them to https://shaftengine.netlify.app/ using:
   - Meta refresh tag (for maximum compatibility)
   - JavaScript `window.location.replace()` (for instant redirect)

## Maintenance

This directory should be kept simple and minimal. Do not add additional pages or complexity here - GitHub Pages is now only used for the redirect, while all actual content is served from Netlify.
