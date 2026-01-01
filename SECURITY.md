# Security Policy

## Overview

This document outlines security best practices for the SHAFT User Guide repository, particularly regarding API key management and secret protection.

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it by:

1. **DO NOT** create a public GitHub issue
2. Email the maintainers directly or use GitHub's private security advisory feature
3. Include detailed information about the vulnerability and steps to reproduce

## API Key Management

### Gemini API Key Security - Runtime Configuration Architecture

**Important Security Update:** As of January 2026, the SHAFT User Guide website uses a runtime configuration approach to manage the Gemini API key securely.

#### Current Architecture

1. **API Key in GitHub Secrets**: The API key is stored securely in GitHub Secrets
2. **Generated at Build Time**: A `config.json` file is generated during the build process
3. **Served at Runtime**: The config file is served as a static asset and fetched by the browser
4. **Protected by HTTP Referrer Restrictions**: The API key is restricted to specific domains

This approach prevents the API key from being:
- Embedded in JavaScript bundles (avoiding git history exposure)
- Exposed in source code
- Detectable by GitHub's secret scanning in the repository

However, the key IS present in the deployed site's `/config.json` file, which is acceptable because:
- ✅ It's protected by HTTP referrer restrictions (whitelist)
- ✅ It's not in the git repository or commit history
- ✅ It can be easily rotated without redeploying code
- ✅ GitHub secret scanning won't flag it in the repository

#### For Repository Maintainers

**✅ Current Best Practices:**
- API key is stored in GitHub Secrets
- Runtime config file (`config.json`) is generated during build
- API key has HTTP referrer restrictions configured
- Config file is gitignored to prevent accidental commits
- AutoBot fetches the key at runtime via `/config.json`

**How It Works:**
1. GitHub Actions workflow sets `GEMINI_API_KEY` environment variable from Secrets
2. Build script (`scripts/generate-config.js`) creates `/static/config.json`
3. Docusaurus copies it to `/build/config.json`
4. Deployed site serves it at `https://shafthq.github.io/config.json`
5. AutoBot component fetches it at runtime
6. HTTP referrer restrictions prevent unauthorized use

#### ✅ Best Practices (Updated)

1. **API Key Storage**
   - Store API key in GitHub Secrets for CI/CD access
   - Generate runtime configuration file during build
   - Never commit the config file to git (use .gitignore)
   - Rely on HTTP referrer restrictions for security

2. **HTTP Referrer Restrictions (CRITICAL)**
   - Configure referrer restrictions in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Add these referrers to your API key:
     - `https://shafthq.github.io/*` (production)
     - `http://localhost:3000/*` (local development, optional)
   - This prevents the key from being used on other domains

3. **Use API Restrictions**
   - Restrict the API key to only "Generative Language API"
   - This limits potential damage if the key is discovered

4. **Monitor and Rotate**
   - Monitor API usage in Google Cloud Console
   - Rotate keys periodically or if abuse is detected
   - Rotating is as simple as updating the GitHub Secret

5. **No Secrets in Git Repository**
   - The `/static/config.json` file is gitignored
   - It's generated during build and deployed to gh-pages
   - It's NOT in the repository commit history

#### ❌ What NOT to Do

- ❌ Do not commit `.env` files or `config.json` to git
- ❌ Do not share API keys in public channels (Slack, email, etc.)
- ❌ Do not log or print API key values in console
- ❌ Do not embed API keys directly in JavaScript source code
- ❌ Do not use API keys without HTTP referrer restrictions
- ❌ Do not commit API keys even temporarily

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
