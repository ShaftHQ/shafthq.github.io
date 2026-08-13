import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {deflateSync, inflateSync} from 'node:zlib';

const WIDTH = 1200;
const HEIGHT = 630;
const PNG_SIGNATURE = Buffer.from('89504e470d0a1a0a', 'hex');
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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

async function generateCard(output) {
  const logoSvg = await readFile(path.join(repoRoot, 'static', 'img', 'shaft.svg'), 'utf8');
  const embeddedLogo = logoSvg.match(/base64,([^"']+)/)?.[1];
  if (!embeddedLogo) throw new Error('SHAFT identity SVG does not contain its embedded PNG source.');
  const logo = decodePng(Buffer.from(embeddedLogo, 'base64'));
  const overview = decodePng(await readFile(path.join(repoRoot, 'static', 'img', 'allure-shaft-overview-panel.png')));

  fillRect(0, 0, WIDTH, HEIGHT, [16, 42, 49, 255]);
  fillRect(0, 0, 18, HEIGHT, [0, 110, 192, 255]);
  fillRect(18, 0, 5, HEIGHT, [76, 194, 255, 180]);
  roundedRect(66, 164, 260, 260, 18, [245, 253, 255, 255]);
  drawScaled(logo, 96, 194, 200, 200);
  roundedRect(358, 48, 790, 534, 18, [7, 17, 31, 150]);
  roundedRect(370, 36, 790, 534, 18, [245, 253, 255, 255]);
  fillRect(392, 58, 746, 6, [0, 110, 192, 255]);
  drawScaled(overview, 392, 82, 746, 466);
  fillRect(66, 458, 260, 8, [0, 110, 192, 255]);
  fillRect(66, 480, 190, 6, [76, 194, 255, 220]);
  fillRect(66, 502, 230, 6, [200, 214, 231, 160]);
  fillRect(66, 524, 160, 6, [200, 214, 231, 120]);
  await writeFile(output, encodePng(WIDTH, HEIGHT, canvas));
}

const [mode, ...args] = process.argv.slice(2);
if (mode === '--inspect') {
  const image = decodePng(await readFile(path.resolve(args[0])));
  process.stdout.write(JSON.stringify({
    width: image.width,
    height: image.height,
    bitDepth: image.bitDepth,
    colorType: image.colorType,
    pixelHash: createHash('sha256').update(image.pixels).digest('hex'),
  }));
} else if (mode === '--reencode') {
  const image = decodePng(await readFile(path.resolve(args[0])));
  await writeFile(path.resolve(args[1]), encodePng(image.width, image.height, image.pixels, Number(args[2])));
} else if (mode === '--mutate-first-pixel') {
  const image = decodePng(await readFile(path.resolve(args[0])));
  image.pixels[0] ^= 1;
  await writeFile(path.resolve(args[1]), encodePng(image.width, image.height, image.pixels));
} else {
  await generateCard(mode ? path.resolve(mode) : path.join(repoRoot, 'static', 'img', 'shaft-social-card.png'));
}
