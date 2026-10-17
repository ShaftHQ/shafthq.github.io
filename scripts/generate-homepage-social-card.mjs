import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath, pathToFileURL} from 'node:url';
import path from 'node:path';
import {deflateSync, inflateSync} from 'node:zlib';

const WIDTH = 1200;
const HEIGHT = 630;
const PNG_SIGNATURE = Buffer.from('89504e470d0a1a0a', 'hex');
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Resolve `candidate` and reject anything that leaves `root` after normalization. */
export function resolveInsideRoot(root, candidate) {
  if (typeof candidate !== 'string' || candidate.length === 0) throw new Error('path is required');
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, candidate);
  const prefix = resolvedRoot.endsWith(path.sep) ? resolvedRoot : resolvedRoot + path.sep;
  if (resolved !== resolvedRoot && !resolved.startsWith(prefix)) {
    throw new Error(`path escapes ${resolvedRoot}`);
  }
  return resolved;
}

function decodePng(buffer) {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('Expected a PNG source asset.');
  let offset = 8;
  let width;
  let height;
  let bitDepth;
  let colorType;
  let palette;
  let transparency;
  const compressed = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString('ascii');
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += length + 12;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'PLTE') palette = data;
    else if (type === 'tRNS') transparency = data;
    else if (type === 'IDAT') compressed.push(data);
    else if (type === 'IEND') break;
  }
  if (bitDepth !== 8 || ![2, 3, 6].includes(colorType)) throw new Error(`Unsupported PNG format: depth ${bitDepth}, color type ${colorType}.`);
  const channels = colorType === 2 ? 3 : colorType === 6 ? 4 : 1;
  const rowLength = width * channels;
  const packed = inflateSync(Buffer.concat(compressed));
  const raw = Buffer.alloc(rowLength * height);
  let sourceOffset = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = packed[sourceOffset++];
    const rowOffset = y * rowLength;
    for (let x = 0; x < rowLength; x += 1) {
      const value = packed[sourceOffset++];
      const left = x >= channels ? raw[rowOffset + x - channels] : 0;
      const up = y > 0 ? raw[rowOffset - rowLength + x] : 0;
      const upLeft = y > 0 && x >= channels ? raw[rowOffset - rowLength + x - channels] : 0;
      let reconstructed = value;
      if (filter === 1) reconstructed += left;
      else if (filter === 2) reconstructed += up;
      else if (filter === 3) reconstructed += Math.floor((left + up) / 2);
      else if (filter === 4) {
        const estimate = left + up - upLeft;
        const leftDistance = Math.abs(estimate - left);
        const upDistance = Math.abs(estimate - up);
        const diagonalDistance = Math.abs(estimate - upLeft);
        reconstructed += leftDistance <= upDistance && leftDistance <= diagonalDistance ? left : upDistance <= diagonalDistance ? up : upLeft;
      } else if (filter !== 0) throw new Error(`Unsupported PNG filter ${filter}.`);
      raw[rowOffset + x] = reconstructed & 0xff;
    }
  }
  const pixels = Buffer.alloc(width * height * 4);
  for (let index = 0; index < width * height; index += 1) {
    const target = index * 4;
    if (colorType === 2) {
      pixels[target] = raw[index * 3];
      pixels[target + 1] = raw[index * 3 + 1];
      pixels[target + 2] = raw[index * 3 + 2];
      pixels[target + 3] = 255;
    } else if (colorType === 6) {
      raw.copy(pixels, target, index * 4, index * 4 + 4);
    } else {
      const paletteIndex = raw[index];
      pixels[target] = palette[paletteIndex * 3];
      pixels[target + 1] = palette[paletteIndex * 3 + 1];
      pixels[target + 2] = palette[paletteIndex * 3 + 2];
      pixels[target + 3] = transparency?.[paletteIndex] ?? 255;
    }
  }
  return {width, height, bitDepth, colorType, pixels};
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const name = Buffer.from(type, 'ascii');
  const chunk = Buffer.alloc(data.length + 12);
  chunk.writeUInt32BE(data.length, 0);
  name.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([name, data])), data.length + 8);
  return chunk;
}

function encodePng(width, height, pixels, compressionLevel = 9) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y += 1) pixels.copy(scanlines, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(scanlines, {level: compressionLevel})),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const canvas = Buffer.alloc(WIDTH * HEIGHT * 4);

function setPixel(x, y, red, green, blue, alpha = 255) {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
  const offset = (y * WIDTH + x) * 4;
  const sourceAlpha = alpha / 255;
  const targetAlpha = canvas[offset + 3] / 255;
  const outputAlpha = sourceAlpha + targetAlpha * (1 - sourceAlpha);
  canvas[offset] = Math.round((red * sourceAlpha + canvas[offset] * targetAlpha * (1 - sourceAlpha)) / outputAlpha);
  canvas[offset + 1] = Math.round((green * sourceAlpha + canvas[offset + 1] * targetAlpha * (1 - sourceAlpha)) / outputAlpha);
  canvas[offset + 2] = Math.round((blue * sourceAlpha + canvas[offset + 2] * targetAlpha * (1 - sourceAlpha)) / outputAlpha);
  canvas[offset + 3] = Math.round(outputAlpha * 255);
}

function fillRect(x, y, width, height, color) {
  for (let row = y; row < y + height; row += 1) {
    for (let column = x; column < x + width; column += 1) setPixel(column, row, ...color);
  }
}

function roundedRect(x, y, width, height, radius, color) {
  for (let row = 0; row < height; row += 1) {
    for (let column = 0; column < width; column += 1) {
      const dx = Math.max(radius - column, 0, column - (width - radius - 1));
      const dy = Math.max(radius - row, 0, row - (height - radius - 1));
      if (dx * dx + dy * dy <= radius * radius) setPixel(x + column, y + row, ...color);
    }
  }
}

function drawScaled(image, x, y, width, height) {
  for (let row = 0; row < height; row += 1) {
    const sourceY = Math.min(image.height - 1, Math.floor(row * image.height / height));
    for (let column = 0; column < width; column += 1) {
      const sourceX = Math.min(image.width - 1, Math.floor(column * image.width / width));
      const offset = (sourceY * image.width + sourceX) * 4;
      setPixel(x + column, y + row, image.pixels[offset], image.pixels[offset + 1], image.pixels[offset + 2], image.pixels[offset + 3]);
    }
  }
}

// Area-average (box filter) resampling, so downscaled report text stays legible.
function drawResampled(image, x, y, width, height) {
  for (let row = 0; row < height; row += 1) {
    const y0 = row * image.height / height;
    const y1 = (row + 1) * image.height / height;
    for (let column = 0; column < width; column += 1) {
      const x0 = column * image.width / width;
      const x1 = (column + 1) * image.width / width;
      let red = 0; let green = 0; let blue = 0; let alpha = 0; let weight = 0;
      for (let sy = Math.floor(y0); sy < Math.min(image.height, Math.ceil(y1)); sy += 1) {
        const wy = Math.min(y1, sy + 1) - Math.max(y0, sy);
        for (let sx = Math.floor(x0); sx < Math.min(image.width, Math.ceil(x1)); sx += 1) {
          const w = wy * (Math.min(x1, sx + 1) - Math.max(x0, sx));
          const offset = (sy * image.width + sx) * 4;
          const a = image.pixels[offset + 3] * w;
          red += image.pixels[offset] * a; green += image.pixels[offset + 1] * a; blue += image.pixels[offset + 2] * a;
          alpha += a; weight += w;
        }
      }
      if (alpha > 0) setPixel(x + column, y + row, Math.round(red / alpha), Math.round(green / alpha), Math.round(blue / alpha), Math.round(alpha / weight));
    }
  }
}

function drawScaledContain(image, x, y, width, height, background) {
  fillRect(x, y, width, height, background);
  const scale = Math.min(width / image.width, height / image.height);
  const scaledWidth = Math.round(image.width * scale);
  const scaledHeight = Math.round(image.height * scale);
  drawResampled(
    image,
    x + Math.floor((width - scaledWidth) / 2),
    y + Math.floor((height - scaledHeight) / 2),
    scaledWidth,
    scaledHeight,
  );
}

// #1128 layout: README headline and the real passing Allure result from the hero clip.
// Headline and URL are pre-rendered bitmaps in design/social-card/, so these bytes
// never depend on the fonts of the machine that runs this script.
async function generateCard(output) {
  const resolvedRoot = path.resolve(repoRoot);
  const cardPath = path.resolve(resolvedRoot, output);
  if (!cardPath.startsWith(`${resolvedRoot}${path.sep}`)) {
    throw new Error(`path escapes ${resolvedRoot}`);
  }
  const sources = path.join(repoRoot, 'design', 'social-card');
  const logoSvg = await readFile(path.join(repoRoot, 'static', 'img', 'shaft.svg'), 'utf8');
  const embeddedLogo = logoSvg.match(/base64,([^"']+)/)?.[1];
  if (!embeddedLogo) throw new Error('SHAFT identity SVG does not contain its embedded PNG source.');
  const logo = decodePng(Buffer.from(embeddedLogo, 'base64'));
  const headline = decodePng(await readFile(path.join(sources, 'headline.png')));
  const siteUrl = decodePng(await readFile(path.join(sources, 'url.png')));
  const reportDashboard = decodePng(await readFile(path.join(sources, 'allure-passed-card.png')));

  fillRect(0, 0, WIDTH, HEIGHT, [16, 42, 49, 255]);
  fillRect(0, 0, 18, HEIGHT, [0, 110, 192, 255]);
  fillRect(18, 0, 5, HEIGHT, [76, 194, 255, 180]);
  roundedRect(66, 58, 120, 120, 16, [245, 253, 255, 255]);
  drawResampled(logo, 76, 68, 100, 100);
  drawResampled(headline, 214, 50, headline.width, headline.height);
  drawResampled(siteUrl, WIDTH - 66 - siteUrl.width, 62, siteUrl.width, siteUrl.height);
  const cardWidth = WIDTH - 132;
  const cardHeight = Math.round(reportDashboard.height * cardWidth / reportDashboard.width);
  const cardY = HEIGHT - 30 - cardHeight;
  roundedRect(74, cardY + 10, cardWidth, cardHeight, 12, [7, 17, 31, 150]);
  drawScaledContain(reportDashboard, 66, cardY, cardWidth, cardHeight, [16, 42, 49, 255]);
  await writeFile(cardPath, encodePng(WIDTH, HEIGHT, canvas));
}

const isDirectRun = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirectRun) {
  const [mode, ...args] = process.argv.slice(2);
  if (mode === '--inspect') {
    const imagePath = path.resolve(repoRoot, args[0]);
    if (!imagePath.startsWith(`${path.resolve(repoRoot)}${path.sep}`)) throw new Error('path escapes repository');
    const image = decodePng(await readFile(imagePath));
    process.stdout.write(JSON.stringify({
      width: image.width,
      height: image.height,
      bitDepth: image.bitDepth,
      colorType: image.colorType,
      pixelHash: createHash('sha256').update(image.pixels).digest('hex'),
    }));
  } else if (mode === '--reencode') {
    const sourcePath = path.resolve(repoRoot, args[0]);
    const targetPath = path.resolve(repoRoot, args[1]);
    const rootPrefix = `${path.resolve(repoRoot)}${path.sep}`;
    if (!sourcePath.startsWith(rootPrefix) || !targetPath.startsWith(rootPrefix)) throw new Error('path escapes repository');
    const image = decodePng(await readFile(sourcePath));
    await writeFile(targetPath, encodePng(image.width, image.height, image.pixels, Number(args[2])));
  } else if (mode === '--mutate-first-pixel') {
    const sourcePath = path.resolve(repoRoot, args[0]);
    const targetPath = path.resolve(repoRoot, args[1]);
    const rootPrefix = `${path.resolve(repoRoot)}${path.sep}`;
    if (!sourcePath.startsWith(rootPrefix) || !targetPath.startsWith(rootPrefix)) throw new Error('path escapes repository');
    const image = decodePng(await readFile(sourcePath));
    image.pixels[0] ^= 1;
    await writeFile(targetPath, encodePng(image.width, image.height, image.pixels));
  } else {
    await generateCard(mode ? mode : path.join(repoRoot, 'static', 'img', 'shaft-social-card.png'));
  }
}
