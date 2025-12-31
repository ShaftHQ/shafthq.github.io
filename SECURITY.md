# Security Policy

## Overview

This document outlines security best practices for the SHAFT User Guide repository, particularly regarding API key management and secret protection.

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it by:

1. **DO NOT** create a public GitHub issue
2. Email the maintainers directly or use GitHub's private security advisory feature
3. Include detailed information about the vulnerability and steps to reproduce

## API Key Management

### Gemini API Key Security - Updated Architecture

**Important Security Change:** As of December 2025, the SHAFT User Guide website NO LONGER embeds the Gemini API key in the build output. This prevents API key leakage in the gh-pages branch.

#### New Architecture

1. **No API Key in Build**: The API key is NOT passed through `docusaurus.config.js` customFields
2. **User-Provided Keys**: Website visitors provide their own Gemini API key
3. **Browser-Only Storage**: API keys are stored in the user's browser localStorage
4. **Never Server-Side**: The key never touches our servers or build artifacts

#### For Website Visitors

When using AutoBot on https://shafthq.github.io:

1. **Get Your Own API Key**
   - Visit [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key)
   - Create a free Gemini API key

2. **Secure Your API Key** (CRITICAL)
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Add HTTP referrer restriction: `https://shafthq.github.io/*`
   - Restrict to "Generative Language API" only
   - **Why?** This prevents anyone else from using your key, even if they find it in your browser

3. **Enter Key in AutoBot**
   - Open the AutoBot chatbot
   - Paste your API key when prompted
   - It's saved in your browser's localStorage (never sent to servers)

#### For Repository Maintainers

**✅ Current Best Practices:**
- API keys are NOT embedded in the source code
- API keys are NOT in the build output
- API keys are NOT in GitHub Secrets (no longer needed for this purpose)
- Each user manages their own API key and quota

**❌ Old Approach (Deprecated):**
- ~~Embedding API key in `customFields`~~ (causes leakage in build)
- ~~Storing in GitHub Secrets for build~~ (still gets embedded in bundle)
- ~~Relying only on referrer restrictions~~ (key still visible in source)

#### ✅ Best Practices (Updated)

1. **Never Commit API Keys**
   - API keys should NEVER be committed to the repository
   - The `.env` file is gitignored - keep it that way
   - **NEW:** Don't even pass API keys through build-time environment variables if they'll be embedded in client bundles

2. **User-Provided Keys for Client-Side Applications**
   - For static websites, let users provide their own API keys
   - Store keys in browser localStorage (client-side only)
   - Provide clear instructions for users to secure their keys

3. **Use HTTP Referrer Restrictions (Critical for User Keys)**
   - All users MUST configure referrer restrictions on their API keys
   - Add these referrers to API key settings:
     - `https://shafthq.github.io/*` (production)
     - `http://localhost:3000/*` (local development, optional)
   - This prevents stolen keys from being used elsewhere

4. **Use API Restrictions**
   - Restrict the API key to only "Generative Language API"
   - This limits potential damage if the key is compromised

5. **No Secrets in Build Artifacts**
   - **CRITICAL:** Build output (in gh-pages branch) must NOT contain secrets
   - Never use `customFields` or similar mechanisms to pass secrets to client bundles
   - Verify build output doesn't contain secrets: `grep -r "AIza" build/`

6. **Rotate Keys Regularly** (For Shared/Org Keys)
   - If using a shared organizational key (not recommended for this use case)
   - Rotate API keys periodically (recommended: every 90 days)
   - Immediately rotate if a key is suspected to be compromised

#### ❌ What NOT to Do

- ❌ Do not hardcode API keys in source code
- ❌ Do not commit `.env` files
- ❌ Do not share API keys in public channels (Slack, email, etc.)
- ❌ Do not log or print API key values
- ❌ Do not commit API keys even temporarily with the intention to remove them later
- ❌ **NEW:** Do not pass API keys through build-time environment variables that get embedded in client bundles (e.g., `customFields` in Docusaurus)
- ❌ **NEW:** Do not store shared organizational keys in GitHub Secrets if they'll be embedded in public build artifacts

## Incident Response

### If an API Key is Leaked

**Note:** With the new user-provided key architecture, leakage of individual user keys is their responsibility. However, if historical keys were leaked in git history:

If an API key is accidentally committed or exposed in git history:

1. **Immediate Actions** (within 1 hour)
   - [ ] Revoke the compromised API key immediately in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - [ ] Generate a new API key with proper restrictions
   - [ ] Update GitHub Secrets with the new key
   - [ ] Verify the new key works in production

2. **Investigation** (within 24 hours)
   - [ ] Review Google Cloud Console usage logs for unauthorized access
   - [ ] Check for unusual API usage patterns
   - [ ] Identify how the key was leaked (commit history, logs, etc.)
   - [ ] Document the incident and root cause

3. **Remediation** (within 48 hours)
   - [ ] If the key was committed to git history, contact GitHub to remove it from cache
   - [ ] Update security documentation if new gaps are identified
   - [ ] Communicate with team about the incident and prevention measures
   - [ ] Review and update pre-commit hooks if applicable

4. **Prevention** (ongoing)
   - [ ] Implement additional security tools (e.g., git-secrets, gitleaks)
   - [ ] Train team members on security best practices
   - [ ] Review access controls and permissions

## Secret Scanning

### GitHub Secret Scanning

GitHub automatically scans repositories for known secret patterns. If a secret is detected:

1. GitHub will create a secret scanning alert
2. Review the alert immediately
3. Follow the incident response process above
4. Close the alert only after the key has been rotated

### Local Secret Scanning

Consider using local secret scanning tools:

- **gitleaks**: Scan git history for secrets
- **git-secrets**: Prevent commits with secrets
- **pre-commit hooks**: Automatic validation before commits

## Environment Variables

### Naming Conventions

- Use descriptive names: `GEMINI_API_KEY` (not `KEY` or `API_KEY`)
- Use UPPERCASE_WITH_UNDERSCORES for consistency
- Prefix with service name when applicable

### Storage

- **Local Development**: Use `.env` file (gitignored)
- **CI/CD**: Use GitHub Secrets
- **Production**: Use secure secret management service

### .env File Security

```bash
# ✅ Good - .env file structure
GEMINI_API_KEY=your_actual_api_key_here

# ❌ Bad - Do not commit .env file
# ❌ Bad - Do not share .env file
# ❌ Bad - Do not include .env in Docker images
```

## Code Review Checklist

When reviewing pull requests, verify:

- [ ] No hardcoded secrets or API keys
- [ ] No `.env` files in the commit
- [ ] Environment variables used correctly
- [ ] Secrets accessed via GitHub Secrets in workflows
- [ ] No secret values logged or printed
- [ ] API keys have proper restrictions configured

## Dependencies

### Dependency Security

1. **Regular Updates**
   - Keep dependencies up to date using Dependabot
   - Review security advisories for known vulnerabilities
   - Test updates in a separate branch before merging

2. **Audit Dependencies**
   ```bash
   npm audit
   yarn audit
   ```

3. **Use Lock Files**
   - Commit `package-lock.json` or `yarn.lock`
   - This ensures consistent dependency versions

## Additional Resources

- [Google API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

## Security Contact

For security-related questions or concerns, please contact the repository maintainers.

---

**Last Updated**: December 2025
**Version**: 1.0
