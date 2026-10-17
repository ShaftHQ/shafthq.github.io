// #1130 review: icons are registered by import, not by a global library, so a
// string prop such as <FAIcon icon="star" /> (or on FontAwesomeIcon) renders nothing. Reject it in docs.
import assert from 'node:assert/strict';
import {findStringIconProps, scanRepository} from '../scripts/check-faicon-props.mjs';

for (const bad of ['<FAIcon icon="star" />', "<FAIcon icon='github' />", '<FAIcon\n  size="lg"\n  icon="fa-solid fa-star"\n/>', '<FAIcon icon={"star"} />', "<FAIcon icon={'star'} />", '<FAIcon icon={`star`} />', '<FontAwesomeIcon icon="star" />', '<FAIcon icon={["fas","star"]} />', "<FAIcon icon={ ['fab', 'github'] } />", '<FontAwesomeIcon icon={["far", "bell"]} />']) {
  assert.equal(findStringIconProps(bad).length, 1, `must reject: ${bad}`);
}
for (const good of ['<FAIcon icon={faStar} />', '<FAIcon icon={faGithub} size="lg" />', 'Use `<FAIcon icon="x" />` only in prose? no: inline code is ignored', '```jsx\n<FAIcon icon="star" />\n```']) {
  assert.equal(findStringIconProps(good).length, 0, `must allow: ${good}`);
}

const findings = scanRepository();
assert.deepEqual(findings, [], `String FAIcon icon props render nothing; import the icon instead:\n${findings.map((f) => `${f.file}:${f.line} ${f.text}`).join('\n')}`);
console.log('FAIcon prop check passed');
