# Security Breach Post-Mortem

## Incident Summary

**Date:** December 2025  
**Severity:** HIGH  
**Status:** RESOLVED  
**Alert:** GitHub Secret Scanning Alert #3

## What Happened

A Google Gemini API key was leaked in the repository's gh-pages branch (deployed website). The API key was embedded in the built JavaScript bundle and publicly accessible to anyone visiting the website.

## Root Cause Analysis

### The Problem

The API key was being passed through Docusaurus's `customFields` configuration:

```javascript
// docusaurus.config.js (INSECURE - OLD CODE)
customFields: {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
}
```

When Docusaurus builds the site, it includes `customFields` in the client-side JavaScript bundle, making the API key visible in:
- `build/assets/js/main.[hash].js` 
- Deployed to the gh-pages branch
- Publicly accessible at https://shafthq.github.io

### Why It Happened

1. **Misunderstanding of Docusaurus behavior**: Assumed `customFields` were server-side only
2. **Lack of build output validation**: Did not check if secrets were in build artifacts
3. **Trust in referrer restrictions**: Relied solely on HTTP referrer restrictions, which don't prevent key discovery
4. **No automated secret scanning**: No CI/CD checks for secrets in build output

### Attack Surface

Anyone could:
1. Visit https://shafthq.github.io
2. Open browser DevTools → Sources
3. Search for "AIza" in JavaScript files
4. Extract the full API key
5. Use it on their own websites (if no referrer restrictions)
6. Or bypass referrer restrictions using server-side proxies

## Impact

- **Confidentiality**: HIGH - API key exposed publicly
- **Integrity**: LOW - Key had HTTP referrer restrictions limiting abuse
- **Availability**: MEDIUM - Potential for quota exhaustion if key used maliciously

## Resolution

### Immediate Actions Taken

1. ✅ **Removed API key from build process**
   - Removed `GEMINI_API_KEY` from `docusaurus.config.js` customFields
   - Removed from GitHub Actions workflow environment variables

2. ✅ **Implemented user-provided API keys**
   - Updated AutoBot to prompt users for their own API keys
   - Keys stored in browser localStorage only
   - Added security instructions for users

3. ✅ **Verified fix**
   - Built site and confirmed no API keys in output
   - Searched all build artifacts for API key patterns

4. ✅ **Created security documentation**
   - Added SECURITY.md with comprehensive guidelines
   - Added .gitleaks.toml for automated secret detection
   - Created security scanning GitHub Action

### Recommended Actions for Maintainers

1. **Revoke the leaked API key immediately**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Delete or regenerate the compromised key
   - Create a new key if needed (though no longer required for this project)

2. **Review API usage logs**
   - Check Google Cloud Console for unusual activity
   - Look for requests from unexpected IP addresses or referrers

3. **Clean git history (if necessary)**
   - If the key was committed to source branches, contact GitHub support
   - Use git filter-branch or BFG Repo-Cleaner to remove from history
   - Force push to rewrite history (coordinate with team first)

## Prevention Measures Implemented

### 1. Architecture Change
- **Before**: Build-time secret injection → client bundle
- **After**: User-provided keys → browser storage only

### 2. Automated Scanning
- Added `.gitleaks.toml` configuration
- Created `security-scan.yml` GitHub Action
- Validates build output contains no secrets

### 3. Documentation
- Comprehensive SECURITY.md
- Updated README with secure architecture
- User instructions for API key security

### 4. Code Review Checklist
Added to SECURITY.md:
- ✓ No hardcoded secrets
- ✓ No secrets in customFields or similar client-exposed configs
- ✓ Build output verified clean
- ✓ User instructions include security best practices

## Lessons Learned

### What Went Wrong

1. **Assumed client-side configuration was safe**: Did not realize customFields get embedded
2. **Insufficient testing of build output**: Never checked what was actually in the bundle
3. **Over-reliance on referrer restrictions**: These help but don't prevent key discovery

### What Went Right

1. **GitHub secret scanning detected it**: Alerted us to the issue
2. **HTTP referrer restrictions limited damage**: Key couldn't be used on arbitrary domains
3. **Quick response**: Fixed architecture rather than just rotating the key

### Recommendations for Similar Projects

1. **Never trust build-time env vars for secrets in static sites**
   - If it goes in the build, assume it's public
   - Use runtime secret fetching from secure backends
   - Or use user-provided credentials

2. **Always validate build artifacts**
   - Grep for secret patterns in build/
   - Automate this in CI/CD
   - Treat build/ as public, even if gitignored

3. **Defense in depth**
   - Secret scanning in CI/CD
   - HTTP referrer restrictions
   - API quotas and monitoring
   - User education

4. **Document security architecture**
   - Make it clear how secrets flow
   - Provide incident response procedures
   - Keep security docs up to date

## Timeline

1. **Unknown Date**: API key leaked in gh-pages branch
2. **GitHub Secret Scanning**: Alert #3 created
3. **December 31, 2025**: Investigation started
4. **December 31, 2025**: Root cause identified
5. **December 31, 2025**: Fix implemented and verified
6. **December 31, 2025**: Security documentation created
7. **Next**: Revoke leaked key (repository maintainer action)

## Related Documents

- [SECURITY.md](./SECURITY.md) - Security policy and best practices
- [.gitleaks.toml](./.gitleaks.toml) - Secret scanning configuration
- [.github/workflows/security-scan.yml](./.github/workflows/security-scan.yml) - Automated security checks

---

**Prepared by:** GitHub Copilot  
**Last Updated:** December 31, 2025  
**Status:** Incident Resolved - Monitoring for reoccurrence
