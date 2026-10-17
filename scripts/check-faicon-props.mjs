// #1130 review: Font Awesome icons are imported by name; there is no global
// library registration, so a string icon prop renders nothing. This scan
// rejects <FAIcon icon="..."> and <FontAwesomeIcon icon="..."> (also {'...'}).
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const TAG = /<(FAIcon|FontAwesomeIcon)\b[^>]*?\sicon\s*=\s*(?:"[^"]*"|'[^']*'|\{\s*(?:"[^"]*"|'[^']*'|`[^`]*`)\s*\})/g;

function stripCode(text) {
  // Blank out fenced and inline code so examples in prose are not flagged; keep line numbers.
  return text.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, ' ')).replace(/(?<!\{\s*)`[^`\n]*`/g, (code) => ' '.repeat(code.length));
}

export function findStringIconProps(text) {
  const clean = stripCode(text);
  return [...clean.matchAll(TAG)].map((match) => ({line: clean.slice(0, match.index).split('\n').length, text: match[0].replace(/\s+/g, ' ')}));
}

function* files(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (/\.(mdx?|jsx?|tsx?)$/.test(name)) yield path;
  }
}

export function scanRepository() {
  const findings = [];
  for (const dir of ['docs', 'blog', 'src']) {
    for (const file of files(join(root, dir))) {
      const text = readFileSync(file, 'utf8');
      // In JS/TS sources only code matters; in Markdown skip code samples.
      const hits = /\.mdx?$/.test(file) ? findStringIconProps(text) : [...text.matchAll(TAG)].map((match) => ({line: text.slice(0, match.index).split('\n').length, text: match[0]}));
      for (const hit of hits) findings.push({file: relative(root, file), ...hit});
    }
  }
  return findings;
}
