#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function logSubprocessOutput(processResult) {
  ['stdout', 'stderr'].forEach((streamName) => {
    if (processResult[streamName]) {
      console.error(processResult[streamName].toString());
    }
  });
}

function generateExpectedFilename(publishedAt, releaseTag) {
  const generatedDate = new Date(publishedAt);
  return `${generatedDate.getUTCFullYear()}-${String(generatedDate.getUTCMonth() + 1).padStart(2, '0')}-${String(generatedDate.getUTCDate()).padStart(2, '0')}-release-${releaseTag.toLowerCase()}.md`;
}

try {
  const workflowPath = path.join(
    __dirname,
    '..',
    '.github',
    'workflows',
    'automated-release-blog-post.yml',
  );
  const latestReleasePostPath = path.join(
    __dirname,
    '..',
    'blog',
    '2026-05-02-release-10.2.20260501.md',
  );
  const releasePostMarchPath = path.join(
    __dirname,
    '..',
    'blog',
    '2026-03-31-release-10.1.20260331.md',
  );

  const workflowContent = fs.readFileSync(workflowPath, 'utf8');
  const latestReleaseContent = fs.readFileSync(latestReleasePostPath, 'utf8');
  const marchReleaseContent = fs.readFileSync(releasePostMarchPath, 'utf8');
  const extractUrls = (content) => [
    ...new Set(
      (content.match(/https?:\/\/[^\s)>\]]+/g) || [])
        .map((url) => url.trim().replace(/[.,;:!?]+$/g, ''))
        .filter(Boolean),
    ),
  ];

  const hasGithubPathPrefix = (urlList, prefix) =>
    urlList.some((candidateUrl) => {
      try {
        const parsed = new URL(candidateUrl);
        return parsed.hostname === 'github.com' && parsed.pathname.startsWith(prefix);
      } catch {
        return false;
      }
    });

  assert(
    workflowContent.includes(
      '<img src="${contributor.avatarUrl}" width="32" height="32" alt="@${contributor.login}" />',
    ),
    'Release-post generator must emit 32x32 contributor avatar img tags.',
  );

  assert(
    !workflowContent.includes('style="border-radius:50%;vertical-align:middle;"'),
    'Release-post generator must not emit inline style strings that break MDX/JSX SSG.',
  );

  assert(
    !latestReleaseContent.includes('SHAFTENGINE'),
    'Release post must not contain malformed SHAFTENGINE links.',
  );

  assert(
    !marchReleaseContent.includes('SHAFTENGINE'),
    'Release changelog summary must not contain malformed SHAFTENGINE links.',
  );

  const latestReleaseUrls = extractUrls(latestReleaseContent);
  const marchReleaseUrls = extractUrls(marchReleaseContent);

  assert(
    hasGithubPathPrefix(latestReleaseUrls, '/ShaftHQ/SHAFT_ENGINE/'),
    'Release post must include valid SHAFT_ENGINE GitHub links.',
  );

  assert(
    hasGithubPathPrefix(marchReleaseUrls, '/ShaftHQ/SHAFT_ENGINE/pull/'),
    'Release changelog summary must include valid SHAFT_ENGINE pull request links.',
  );

  const expectedResourceLinks = [
    'https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/10.2.20260501',
    'https://shafthq.github.io/',
    'https://github.com/ShaftHQ/SHAFT_ENGINE/discussions',
    'https://github.com/ShaftHQ/SHAFT_ENGINE/issues/new',
  ];

  expectedResourceLinks.forEach((resourceLink) => {
    assert(
      latestReleaseContent.includes(resourceLink),
      `Expected resource link is missing: ${resourceLink}`,
    );
  });

  const workflowScriptMatch = workflowContent.match(/node <<'NODE'\n([\s\S]*?)\n\s*NODE/);
  assert(workflowScriptMatch, 'Could not locate release template generator script in workflow.');
  assert(
    workflowScriptMatch[1].includes('process.env.RELEASE_TAG'),
    'Extracted generator script does not look like the expected release template script.',
  );

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'release-template-test-'));
  try {
    const generatedScriptPath = path.join(tempDir, 'generate-release-post.js');
    fs.writeFileSync(generatedScriptPath, workflowScriptMatch[1], 'utf8');
    const simulatedReleaseTag = '10.2.99999999';
    const simulatedPublishedAt = '2026-05-02T00:00:00Z';

    try {
      execFileSync('node', [generatedScriptPath], {
        cwd: tempDir,
        stdio: 'pipe',
        env: {
          ...process.env,
          RELEASE_TAG: simulatedReleaseTag,
          RELEASE_PUBLISHED_AT: simulatedPublishedAt,
          RELEASE_AUTHOR: 'copilot',
          RELEASE_BODY: '- Template rendering validation',
          RELEASE_URL: `https://github.com/ShaftHQ/SHAFT_ENGINE/releases/tag/${simulatedReleaseTag}`,
          CONTRIBUTORS_JSON: JSON.stringify([
            {
              login: 'TemplateTester',
              avatarUrl: 'https://github.com/TemplateTester.png',
              isFirstTimer: true,
            },
          ]),
        },
      });
    } catch (error) {
      logSubprocessOutput(error);
      throw error;
    }

    const generatedFileName = generateExpectedFilename(simulatedPublishedAt, simulatedReleaseTag);
    assert(
      generatedFileName === '2026-05-02-release-10.2.99999999.md',
      'Expected generated filename format YYYY-MM-DD-release-tag.md.',
    );
    const generatedBlogPath = path.join(tempDir, 'blog', generatedFileName);
    const generatedBlogContent = fs.readFileSync(generatedBlogPath, 'utf8');

    assert(
      generatedBlogContent.includes(
        '<img src="https://github.com/TemplateTester.png" width="32" height="32" alt="@TemplateTester" /> [@TemplateTester](https://github.com/TemplateTester)',
      ),
      'Generated release markdown must include 32x32 contributor avatar markup.',
    );

    assert(
      !generatedBlogContent.includes('style="border-radius:50%;vertical-align:middle;"'),
      'Generated release markdown must not include inline style strings.',
    );
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.warn(`Failed to clean up temp directory: ${cleanupError.message}`);
    }
  }

  console.log('✅ Release blog template checks passed.');
} catch (error) {
  console.error('❌ Release blog template checks failed.');
  console.error(error.message);
  process.exit(1);
}
