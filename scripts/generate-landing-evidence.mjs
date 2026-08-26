import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(root, 'static', 'img', 'evidence');
const browser = await chromium.launch({headless: true});
const page = await browser.newPage();

async function writeCanvas(file, draw, argument) {
  const dataUrl = await page.evaluate(draw, argument);
  fs.writeFileSync(file, Buffer.from(dataUrl.split(',')[1], 'base64'));
}

async function upscaleReport(name) {
  const file = path.join(evidenceDir, name);
  const source = `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
  await writeCanvas(file, async (sourceUrl) => {
    const image = new Image();
    image.src = sourceUrl;
    await image.decode();
    const width = 1920;
    const height = Math.round(image.height * width / image.width);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/png');
  }, source);
}

for (const name of ['allure-passed-evidence.png', 'allure-failed-evidence.png', 'allure-visual-diff-evidence.png']) await upscaleReport(name);

const shaftSvg = `data:image/svg+xml;base64,${fs.readFileSync(path.join(root, 'static', 'img', 'shaft.svg')).toString('base64')}`;
const generated = await page.evaluate(async (source) => {
  const size = 1024;
  const image = new Image();
  image.src = source;
  await image.decode();

  const render = (changed) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    context.fillStyle = '#f4f7fc';
    context.fillRect(0, 0, size, size);
    const width = 820;
    const height = width * image.height / image.width;
    context.drawImage(image, 102, (size - height) / 2, width, height);
    if (changed) {
      context.fillStyle = '#e85d3f';
      context.beginPath();
      context.arc(790, 260, 54, 0, Math.PI * 2);
      context.fill();
    }
    return canvas;
  };

  const expected = render(false);
  const actual = render(true);
  const expectedPixels = expected.getContext('2d').getImageData(0, 0, size, size).data;
  const actualPixels = actual.getContext('2d').getImageData(0, 0, size, size).data;
  const difference = document.createElement('canvas');
  difference.width = size;
  difference.height = size;
  const differenceContext = difference.getContext('2d');
  differenceContext.fillStyle = '#f4f7fc';
  differenceContext.fillRect(0, 0, size, size);
  const output = differenceContext.getImageData(0, 0, size, size);
  for (let index = 0; index < output.data.length; index += 4) {
    const delta = Math.max(
      Math.abs(expectedPixels[index] - actualPixels[index]),
      Math.abs(expectedPixels[index + 1] - actualPixels[index + 1]),
      Math.abs(expectedPixels[index + 2] - actualPixels[index + 2]),
    );
    if (delta > 8) {
      output.data[index] = 214;
      output.data[index + 1] = 43;
      output.data[index + 2] = 107;
      output.data[index + 3] = 255;
    }
  }
  differenceContext.putImageData(output, 0, 0);
  return [expected.toDataURL('image/png'), actual.toDataURL('image/png'), difference.toDataURL('image/png')];
}, shaftSvg);

for (const [name, dataUrl] of [['visual-expected.png', generated[0]], ['visual-actual.png', generated[1]], ['visual-difference.png', generated[2]]]) {
  fs.writeFileSync(path.join(evidenceDir, name), Buffer.from(dataUrl.split(',')[1], 'base64'));
}

await browser.close();
