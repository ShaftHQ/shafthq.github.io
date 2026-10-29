const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const robots = fs.readFileSync(path.join(root, 'static', 'robots.txt'), 'utf8');
const config = fs.readFileSync(path.join(root, 'docusaurus.config.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'src', 'pages', 'index.tsx'), 'utf8');
const faqs = fs.readFileSync(path.join(root, 'src', 'data', 'homepage-faqs.ts'), 'utf8');
const searchPage = fs.readFileSync(path.join(root, 'src', 'theme', 'SearchPage', 'index.tsx'), 'utf8');
const notFound = fs.readFileSync(path.join(root, 'src', 'theme', 'NotFound', 'Content', 'index.tsx'), 'utf8');
const docMeta = fs.readFileSync(path.join(root, 'src', 'theme', 'DocItem', 'Metadata', 'index.tsx'), 'utf8');
const siteOps = fs.readFileSync(path.join(root, 'docs', 'maintainers', 'site-operations.md'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

const requiredBots = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'Google-Extended',
  'PerplexityBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'Applebot-Extended',
  'bingbot',
];

for (const bot of requiredBots) {
  assert(robots.includes(`User-agent: ${bot}`), `robots.txt must name ${bot}`);
  const block = robots.split(`User-agent: ${bot}`)[1].split('User-agent:')[0];
  assert(/Allow:\s*\//.test(block), `${bot} must Allow /`);
  assert(/Disallow:\s*\/assets\//.test(block), `${bot} must Disallow /assets/`);
}
assert(robots.includes('llms.txt'), 'robots.txt must point agents at llms.txt');
assert(robots.includes('Sitemap: https://shafthq.github.io/sitemap.xml'), 'robots.txt must keep the sitemap line');
assert(!/Disallow:\s*\/\s*$/m.test(robots.split('User-agent: GPTBot')[1].split('User-agent:')[0]), 'Do not Disallow / for GPTBot');

assert(config.includes("'@type': 'SoftwareSourceCode'") || config.includes('"@type": "SoftwareSourceCode"') || config.includes("@type: 'SoftwareSourceCode'") || config.includes("'@type': 'SoftwareSourceCode'"), 'Config must emit SoftwareSourceCode');
assert(config.includes('https://central.sonatype.com/artifact/io.github.shafthq/shaft-engine'), 'Organization sameAs must include Maven Central');
assert(config.includes('https://www.selenium.dev/ecosystem/#frameworks'), 'Organization sameAs must include Selenium ecosystem');
assert(config.includes("ignorePatterns: ['/search']") || config.includes('ignorePatterns: ["/search"]'), 'Sitemap must ignore /search');
assert(config.includes("label: 'llms.txt'") && (config.includes("href: 'pathname:///llms.txt'") || config.includes("href: '/llms.txt'")), 'Footer must link llms.txt for humans/agents');
assert(config.includes("codeRepository: 'https://github.com/ShaftHQ/SHAFT_ENGINE'"), 'SoftwareApplication must name the code repository');
assert(/name:\s*'msvalidate\.01'/.test(config), 'themeConfig.metadata must include Bing msvalidate.01');
const msvalidateMatch = config.match(/name:\s*'msvalidate\.01',\s*content:\s*'([A-F0-9]+)'/i);
assert(msvalidateMatch && msvalidateMatch[1].length >= 16, 'msvalidate.01 content must be a non-empty hex token');


assert(faqs.includes("FAQPage") && faqs.includes('getHomepageFaqs') && faqs.includes('Is SHAFT free to use?'), 'Shared FAQ data must power FAQPage');
assert((faqs.match(/question:/g) || []).length >= 3, 'Homepage FAQs must list at least 3 questions');
assert(index.includes('getHomepageFaqs') && index.includes('homepageFaqPageJsonLd') && index.includes('faqPageData'), 'Homepage must emit FAQPage JSON-LD from shared FAQ data');
assert(index.includes('homepageFaqs[0].question') && index.includes('Common questions'), 'Visible FAQ section must reuse shared questions');

assert(searchPage.includes('noindex') && searchPage.includes('@theme-original/SearchPage'), 'Search page must wrap original with noindex');
assert(notFound.includes('noindex') && notFound.includes('@theme-original/NotFound/Content'), '404 Content must wrap original with noindex');
assert(docMeta.includes('BreadcrumbList') && docMeta.includes('useSidebarBreadcrumbs'), 'Docs metadata must emit BreadcrumbList');
const crumbSd = fs.readFileSync(path.join(root, 'src', 'theme', 'DocBreadcrumbs', 'StructuredData', 'index.tsx'), 'utf8');
assert(crumbSd.includes('return null'), 'DocBreadcrumbs StructuredData must be suppressed to avoid duplicate BreadcrumbList');

assert(siteOps.includes('## AI / search visibility') && siteOps.includes('What is SHAFT_ENGINE test automation?'), 'Maintainer ops must include the AI visibility checklist');
assert(packageJson.scripts['test:homepage'].includes('seo-ai-visibility.test.js'), 'Homepage test script must run the SEO contract');

// Optional build-output checks when build/ exists (local verify after yarn build).
const buildDir = path.join(root, 'build');
const resolveBuiltPage = (...parts) => {
  const asDirIndex = path.join(buildDir, ...parts, 'index.html');
  if (fs.existsSync(asDirIndex)) return asDirIndex;
  const last = parts[parts.length - 1] + '.html';
  const asFile = path.join(buildDir, ...parts.slice(0, -1), last);
  if (fs.existsSync(asFile)) return asFile;
  return null;
};
if (fs.existsSync(buildDir)) {
  const builtRobots = fs.readFileSync(path.join(buildDir, 'robots.txt'), 'utf8');
  assert(builtRobots.includes('User-agent: GPTBot'), 'Built robots.txt must keep AI Allow groups');
  assert(fs.existsSync(path.join(buildDir, 'llms.txt')), 'Build must emit llms.txt');
  const sitemap = fs.readFileSync(path.join(buildDir, 'sitemap.xml'), 'utf8');
  assert(!/<loc>[^<]*\/search\/?<\/loc>/.test(sitemap), 'Built sitemap must not list /search');
  const searchHtmlPath = resolveBuiltPage('search');
  assert(searchHtmlPath, 'Built /search page must exist');
  const searchHtml = fs.readFileSync(searchHtmlPath, 'utf8');
  assert(/name=["']?robots["']?[^>]*content=["'][^"']*noindex/i.test(searchHtml) || /content=["'][^"']*noindex[^"']*["'][^>]*name=["']?robots["']?/i.test(searchHtml), 'Built /search must contain robots noindex');
  const homeHtml = fs.readFileSync(path.join(buildDir, 'index.html'), 'utf8');
  assert(homeHtml.includes('FAQPage') && homeHtml.includes('SoftwareSourceCode') && homeHtml.includes('central.sonatype.com/artifact/io.github.shafthq/shaft-engine'), 'Built homepage must include FAQPage, SoftwareSourceCode, and Maven sameAs');
  const overviewHtmlPath = resolveBuiltPage('docs', 'start', 'overview');
  if (overviewHtmlPath) {
    const overviewHtml = fs.readFileSync(overviewHtmlPath, 'utf8');
    assert(overviewHtml.includes('BreadcrumbList'), 'Built docs overview must include BreadcrumbList');
  }
  const notFoundHtml = fs.readFileSync(path.join(buildDir, '404.html'), 'utf8');
  assert(/name=["']?robots["']?[^>]*content=["'][^"']*noindex/i.test(notFoundHtml) || /content=["'][^"']*noindex[^"']*["'][^>]*name=["']?robots["']?/i.test(notFoundHtml), 'Built 404.html must contain robots noindex');
}

console.log('seo-ai-visibility.test.js: OK');
