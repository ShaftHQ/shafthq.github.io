const {test, expect} = require('@playwright/test');

const samplePom = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns="http://maven.apache.org/POM/4.0.0"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>io.github.shafthq</groupId>
    <artifactId>shaft-testng-api</artifactId>
    <version>1.0-SNAPSHOT</version>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>io.github.shafthq</groupId>
                <artifactId>shaft-bom</artifactId>
                <version>\${shaft.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.github.shafthq</groupId>
            <artifactId>shaft-engine</artifactId>
        </dependency>
    </dependencies>
    <build></build>
</project>`;

async function stubGeneratorSources(page) {
  await page.route('https://cdnjs.cloudflare.com/ajax/libs/jszip/**/jszip.min.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: `
      window.JSZip = class {
        constructor() { this.files = {}; }
        file(name, content) {
          if (content === undefined) return {async: async () => this.files[name]};
          this.files[name] = content;
          return this;
        }
        async generateAsync() {
          window.__generatedFiles = this.files;
          return new Blob([JSON.stringify(this.files)], {type: 'application/json'});
        }
      };
    `,
  }));
  await page.route('https://api.github.com/repos/ShaftHQ/SHAFT_ENGINE/contents/shaft-engine/src/main/resources/examples', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify([{type: 'dir', name: 'TestNG', url: 'https://api.github.test/examples/TestNG'}]),
  }));
  await page.route('https://api.github.test/examples/TestNG', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify([{type: 'dir', name: 'shaft-testng-api'}]),
  }));
  await page.route('https://api.github.com/repos/ShaftHQ/SHAFT_ENGINE/contents/shaft-engine/src/main/resources/examples/TestNG/shaft-testng-api', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify([{type: 'file', name: 'pom.xml', download_url: 'https://raw.test/pom.xml'}]),
  }));
  await page.route('https://raw.test/pom.xml', route => route.fulfill({
    contentType: 'text/xml',
    body: samplePom,
  }));
}

test('homepage exposes the primary product paths', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SHAFT/i);
  await expect(page.getByRole('heading', {name: 'One engine for every test surface.'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Run your first test'})).toHaveAttribute(
    'href',
    '/docs/start/quick-start',
  );
  await expect(page.getByRole('link', {name: 'Connect your AI agent'})).toHaveAttribute(
    'href',
    '#connect-ai-agent',
  );
  await expect(page.locator('#connect-ai-agent')).toBeVisible();
  await page.getByRole('link', {name: 'Connect your AI agent'}).click();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe('#connect-ai-agent');
  await expect(page.locator('img[src="/img/shaft-automation-hero.png"]')).toBeVisible();
});

for (const route of [
  '/docs/start/overview',
  '/docs/start/installation',
  '/docs/testing/web',
  '/docs/testing/mobile',
  '/docs/testing/api',
  '/docs/agentic/mcp',
  '/docs/agentic/mcp/manual',
  '/docs/agentic/doctor',
  '/docs/agentic/heal',
  '/docs/reference/properties/custom-properties-generator',
]) {
  test(`${route} renders`, async ({page}) => {
    const response = await page.goto(route);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main h1').first()).toBeVisible();
  });
}

test('installation page embeds the project generator', async ({page}) => {
  await page.goto('/docs/start/installation');
  await expect(page.locator('iframe[title="SHAFT Project Generator"]')).toHaveAttribute(
    'src',
    '/project-generator',
  );
  const generator = page.frameLocator('iframe[title="SHAFT Project Generator"]');
  await expect(generator.getByRole('heading', {name: 'SHAFT Project Generator'})).toBeVisible();
  await expect(generator.getByRole('button', {name: 'Next'})).toBeDisabled();
});

test('project generator adds selected optional modules to pom.xml', async ({page}) => {
  await stubGeneratorSources(page);
  await page.goto('/project-generator');

  await page.getByLabel('TestNG').check();
  await page.getByRole('button', {name: 'Next'}).click();
  await page.getByLabel('Api').check();
  await page.getByRole('button', {name: 'Next'}).click();
  await page.getByLabel('Group ID').fill('com.example');
  await page.getByLabel('Version').fill('1.2.3');
  await page.getByRole('button', {name: 'Next'}).click();

  await expect(page.getByRole('heading', {name: 'Optional SHAFT modules'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Learn more about SHAFT Heal'})).toHaveAttribute(
    'href',
    '/docs/agentic/heal',
  );
  await page.getByRole('checkbox', {name: 'SHAFT Heal'}).check();
  await page.getByRole('button', {name: 'Next'}).click();
  await page.getByLabel('Yes, include GitHub Actions workflow').uncheck();
  await page.getByRole('button', {name: 'Next'}).click();
  await page.getByLabel('Yes, include Dependabot configuration').uncheck();
  await page.getByRole('button', {name: 'Generate Project'}).click();

  await expect(page.getByRole('heading', {name: 'Project Generated Successfully'})).toBeVisible();
  const pom = await page.evaluate(() => window.__generatedFiles['shaft-api-testng/pom.xml']);
  expect(pom).toContain('<groupId>com.example</groupId>');
  expect(pom).toContain('<artifactId>shaft-api-testng</artifactId>');
  expect(pom).toContain('<version>1.2.3</version>');
  expect(pom).toContain('<artifactId>shaft-heal</artifactId>');
  expect(pom).not.toContain('<artifactId>shaft-pilot-core</artifactId>');
});

test('MCP application command can be copied', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/agentic/mcp');
  await page.getByRole('button', {name: 'Copy Codex CLI / IDE install command'}).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(
    'codex',
  );
});

test('Linux hides unsupported desktop applications', async ({page}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'platform', {get: () => 'Linux x86_64'});
  });
  await page.goto('/docs/agentic/mcp');
  await expect(page.locator('[data-application="codex"]')).toBeVisible();
  await expect(page.locator('[data-application="copilot-intellij"]')).toBeVisible();
  await expect(page.locator('[data-application="claude-desktop"]')).toHaveCount(0);
});

for (const route of ['/', '/docs/agentic/mcp', '/docs/agentic/mcp/manual', '/docs/reference/properties/custom-properties-generator']) {
  test(`${route} has no page-level horizontal overflow`, async ({page}) => {
    await page.goto(route);
    await expect.poll(() => page.evaluate(
      () => document.documentElement.scrollWidth === document.documentElement.clientWidth,
    )).toBeTruthy();
  });
}

test('properties generator downloads and copies custom.properties', async ({page, context}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/docs/reference/properties/custom-properties-generator');
  await expect(
    page.getByLabel('Generated file destination').getByText('src/main/resources/properties/', {exact: true}),
  ).toBeVisible();

  await page.getByPlaceholder('Property name, section, or description').fill('headlessExecution');
  const row = page.locator('[data-property-key="headlessExecution"]');
  await expect(row).toBeVisible();
  await row.getByRole('checkbox').check();
  await row.getByLabel('Value').selectOption('true');

  await expect(page.locator('pre')).toContainText('headlessExecution=true');
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', {name: 'Download and copy custom.properties'}).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('custom.properties');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(
    'headlessExecution=true',
  );
});

test('properties generator groups TestNG output separately', async ({page}) => {
  await page.goto('/docs/reference/properties/custom-properties-generator');
  await page.getByPlaceholder('Property name, section, or description').fill('setParallel');
  const row = page.locator('[data-property-key="setParallel"]');
  await expect(row).toHaveAttribute('data-target-file', 'TestNG.properties');
  await row.getByRole('checkbox').check();
  await row.getByLabel('Value').selectOption('METHODS');
  await expect(
    page.getByLabel('Generated properties files').getByText(
      'src/main/resources/properties/TestNG.properties',
      {exact: true},
    ),
  ).toBeVisible();
  await expect(page.locator('pre')).toContainText('setParallel=METHODS');
});

test('dark mode remains readable', async ({page}) => {
  await page.goto('/');
  const toggle = page.getByRole('button', {name: /switch between dark and light mode/i});
  if (await toggle.isVisible()) await toggle.click();
  await expect(page.getByRole('heading', {name: 'One engine for every test surface.'})).toBeVisible();
});

test('release page renders contributor avatars with small size', async ({page}) => {
  await page.goto('/blog/release-10.2.20260501');
  await expect(page.getByRole('heading', {name: /10\.2\.20260501/}).first()).toBeVisible();
  await expect(page.locator('img[alt="@MohabMohie"][width="32"][height="32"]').first()).toBeVisible();
});
