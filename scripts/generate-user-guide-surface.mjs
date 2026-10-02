#!/usr/bin/env node
// Snapshot of the public SHAFT facade action surface for the user-guide parity check (#1099).
// Reads a SHAFT_ENGINE checkout (SHAFT_ENGINE_PATH or --engine-path=<root>) and writes
// src/data/user-guide-surface.json. tests/user-guide-parity.test.js checks every method in the
// snapshot is mentioned in docs/ or explicitly excluded with a reason.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src', 'data', 'user-guide-surface.json');

// label -> [relative source path, nested class name or null]
export const SURFACE = {
  'SHAFT.API': ['shaft-engine/src/main/java/com/shaft/driver/SHAFT.java', 'API'],
  'SHAFT.DB': ['shaft-engine/src/main/java/com/shaft/db/DatabaseActions.java', null],
  'SHAFT.CLI.Terminal': ['shaft-engine/src/main/java/com/shaft/cli/TerminalActions.java', null],
  'SHAFT.CLI.File': ['shaft-engine/src/main/java/com/shaft/cli/FileActions.java', null],
  'SHAFT.TestData.CSV': ['shaft-engine/src/main/java/com/shaft/tools/io/CSVFileManager.java', null],
  'SHAFT.TestData.EXCEL': ['shaft-engine/src/main/java/com/shaft/tools/io/ExcelFileManager.java', null],
  'SHAFT.TestData.JSON': ['shaft-engine/src/main/java/com/shaft/tools/io/JSONFileManager.java', null],
  'SHAFT.TestData.YAML': ['shaft-engine/src/main/java/com/shaft/tools/io/YAMLFileManager.java', null],
  'RequestBuilder': ['shaft-engine/src/main/java/com/shaft/api/RequestBuilder.java', null],
  'RestValidationsBuilder': ['shaft-engine/src/main/java/com/shaft/validation/internal/RestValidationsBuilder.java', null],
  'WebDriver.element': ['shaft-engine/src/main/java/com/shaft/gui/element/internal/Actions.java', null],
  'WebDriver.elementLegacy': ['shaft-engine/src/main/java/com/shaft/gui/element/ElementActions.java', null],
  'WebDriver.async': ['shaft-engine/src/main/java/com/shaft/gui/element/AsyncElementActions.java', null],
  'WebDriver.alert': ['shaft-engine/src/main/java/com/shaft/gui/element/AlertActions.java', null],
  'WebDriver.browser': ['shaft-engine/src/main/java/com/shaft/gui/browser/BrowserActions.java', null],
  'WebDriver.touch': ['shaft-engine/src/main/java/com/shaft/gui/element/TouchActions.java', null],
  'WebDriver.mobile': ['shaft-engine/src/main/java/com/shaft/gui/mobile/MobileActions.java', null],
  'WebDriver.mobileFiles': ['shaft-engine/src/main/java/com/shaft/gui/mobile/FileActions.java', null],
  'WebDriver.assertThat': ['shaft-engine/src/main/java/com/shaft/driver/internal/WizardHelpers.java', 'WebDriverAssertions'],
  'WebDriver.verifyThat': ['shaft-engine/src/main/java/com/shaft/driver/internal/WizardHelpers.java', 'WebDriverVerifications'],
  'SHAFT.Validations.assertThat': ['shaft-engine/src/main/java/com/shaft/driver/internal/WizardHelpers.java', 'StandaloneAssertions'],
  'SHAFT.Validations.verifyThat': ['shaft-engine/src/main/java/com/shaft/driver/internal/WizardHelpers.java', 'StandaloneVerifications'],
  'Locator': ['shaft-engine/src/main/java/com/shaft/gui/driver/ShaftLocator.java', null],
  'Playwright.element': ['shaft-engine/src/main/java/com/shaft/gui/playwright/element/ElementActions.java', null],
  'Playwright.browser': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/BrowserActions.java', null],
  'Playwright.alert': ['shaft-engine/src/main/java/com/shaft/gui/playwright/element/AlertActions.java', null],
  'WebDriver.browser.network': ['shaft-engine/src/main/java/com/shaft/gui/browser/NetworkActions.java', null],
  'Playwright.browser.network': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/NetworkActions.java', null],
  'WebDriver.browser.dialog': ['shaft-engine/src/main/java/com/shaft/gui/browser/DialogActions.java', null],
  'Playwright.browser.dialog': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/DialogActions.java', null],
  'WebDriver.browser.context': ['shaft-engine/src/main/java/com/shaft/gui/browser/ContextActions.java', null],
  'Playwright.browser.context': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/ContextActions.java', null],
  'WebDriver.browser.storage': ['shaft-engine/src/main/java/com/shaft/gui/browser/StorageActions.java', null],
  'Playwright.browser.storage': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/StorageActions.java', null],
  'WebDriver.browser.console': ['shaft-engine/src/main/java/com/shaft/gui/browser/ConsoleActions.java', null],
  'Playwright.browser.console': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/ConsoleActions.java', null],
  'WebDriver.browser.script': ['shaft-engine/src/main/java/com/shaft/gui/browser/ScriptActions.java', null],
  'Playwright.browser.script': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/ScriptActions.java', null],
  'WebDriver.browser.permission': ['shaft-engine/src/main/java/com/shaft/gui/browser/PermissionActions.java', null],
  'Playwright.browser.permission': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/PermissionActions.java', null],
  'WebDriver.browser.authentication': ['shaft-engine/src/main/java/com/shaft/gui/browser/AuthenticationActions.java', null],
  'Playwright.browser.authentication': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/AuthenticationActions.java', null],
  'WebDriver.browser.download': ['shaft-engine/src/main/java/com/shaft/gui/browser/DownloadActions.java', null],
  'Playwright.browser.download': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/DownloadActions.java', null],
  'WebDriver.browser.emulation': ['shaft-engine/src/main/java/com/shaft/gui/browser/EmulationActions.java', null],
  'Playwright.browser.emulation': ['shaft-engine/src/main/java/com/shaft/gui/playwright/browser/EmulationActions.java', null],
  'WebDriver.mobile.device': ['shaft-engine/src/main/java/com/shaft/gui/driver/MobileDeviceActionsContract.java', null],
  'WebDriver.mobile.gesture': ['shaft-engine/src/main/java/com/shaft/gui/driver/MobileGestureActionsContract.java', null],
  'WebDriver.mobile.context': ['shaft-engine/src/main/java/com/shaft/gui/driver/MobileContextActionsContract.java', null],
  'WebDriver.mobile.file': ['shaft-engine/src/main/java/com/shaft/gui/driver/MobileFileActionsContract.java', null],
  'WebDriver.mobile.log': ['shaft-engine/src/main/java/com/shaft/gui/driver/MobileLogActionsContract.java', null],
  'WebDriver.mobile.biometric': ['shaft-engine/src/main/java/com/shaft/gui/driver/MobileBiometricActionsContract.java', null],
  'WebDriver.assertThat.mobileValues': ['shaft-engine/src/main/java/com/shaft/validation/internal/WebDriverMobileValidationsBuilder.java', null],
  'SikuliX.element': ['shaft-sikulix/src/main/java/com/shaft/gui/element/SikuliActions.java', null],
};

/** Returns the source of `class <name>` (its braces included), or the whole file when name is null. */
export function classBody(source, name) {
  if (!name) return source;
  const match = new RegExp(`\\bclass\\s+${name}\\b`).exec(source);
  if (!match) throw new Error(`class ${name} not found`);
  const open = source.indexOf('{', match.index);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}' && (depth -= 1) === 0) return source.slice(open, i + 1);
  }
  throw new Error(`unbalanced braces in class ${name}`);
}

/** Public method names in a class body, including public members of its nested fluent helpers. */
export function publicMethods(body) {
  const names = new Set();
  const re = /^\s*public\s+(?!class\b|static\s+class\b|enum\b|interface\b|record\b)(?:static\s+)?(?:final\s+)?(?:<[^>]+>\s+)?[\w.<>[\], ?]+\s+([a-z]\w*)\s*\(/gm;
  for (const match of body.matchAll(re)) names.add(match[1]);
  if (/^public\s+(?:sealed\s+)?interface\s+\w+/m.test(body)) {
    // Interface members are implicitly public: `Type name(args);` or `default Type name(args) {`.
    const member = /^\s+(?:default\s+)?(?:<[^>]+>\s+)?(?!return\b|new\b)[\w.<>[\], ?]+\s+([a-z]\w*)\s*\([^;{]*\)\s*(?:throws [\w., ]+)?\s*[;{]/gm;
    for (const match of body.matchAll(member)) names.add(match[1]);
  }
  return [...names].sort();
}

function engineRoot() {
  const flag = process.argv.find((arg) => arg.startsWith('--engine-path='));
  const root = flag ? flag.split('=')[1] : process.env.SHAFT_ENGINE_PATH;
  if (!root) throw new Error('Pass --engine-path=<SHAFT_ENGINE checkout> or set SHAFT_ENGINE_PATH.');
  return root;
}

function main() {
  const root = engineRoot();
  const surface = {};
  for (const [label, [rel, nested]] of Object.entries(SURFACE)) {
    const source = fs.readFileSync(path.join(root, rel), 'utf8');
    surface[label] = publicMethods(classBody(source, nested));
  }
  fs.writeFileSync(OUT, `${JSON.stringify(surface, null, 2)}\n`);
  const total = Object.values(surface).reduce((sum, list) => sum + list.length, 0);
  console.log(`Wrote ${OUT}: ${total} public methods across ${Object.keys(surface).length} surfaces.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
