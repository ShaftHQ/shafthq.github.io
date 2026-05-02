#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
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
    !latestReleaseContent.includes('https://github.com/ShaftHQ/SHAFTENGINE/'),
    'Release post must use valid SHAFT_ENGINE GitHub links.',
  );

  assert(
    !marchReleaseContent.includes('https://github.com/ShaftHQ/SHAFTENGINE/'),
    'Release changelog summary must use valid SHAFT_ENGINE GitHub links.',
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

  console.log('✅ Release blog template checks passed.');
} catch (error) {
  console.error('❌ Release blog template checks failed.');
  console.error(error.message);
  process.exit(1);
}
