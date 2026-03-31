/**
 * Generate simple PNG icons for the Chrome extension.
 * Creates minimal valid PNG files with a shield-like gradient.
 */
import fs from 'fs';
import path from 'path';

// Minimal PNG encoder - creates a simple colored square PNG
function createPNG(size, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);  // width
  ihdr.writeUInt32BE(size, 4);  // height
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type (RGB)
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Create image data with a shield-like gradient
  const rawData = [];
  const center = size / 2;
  
  for (let y = 0; y < size; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < size; x++) {
      // Create a shield-shaped gradient
      const dx = (x - center) / center;
      const dy = (y - center) / center;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Shield shape: wider at top, pointed at bottom
      const shieldWidth = y < size * 0.5 ? 0.8 : 0.8 - (y - size * 0.5) / size * 1.2;
      const inShield = Math.abs(dx) < shieldWidth * (1 - dy * 0.3) && dy < 0.8 && dy > -0.85;
      
      if (inShield) {
        // Gradient from blue to purple
        const t = (y / size);
        const pr = Math.floor(r * (1 - t * 0.3) + 118 * t);
        const pg = Math.floor(g * (1 - t * 0.5));
        const pb = Math.floor(b * (1 - t * 0.1) + 162 * t * 0.5);
        rawData.push(Math.min(255, pr), Math.min(255, pg), Math.min(255, pb));
      } else {
        // Transparent-ish dark background
        rawData.push(15, 15, 30);
      }
    }
  }

  // Compress with deflate (use zlib)
  const zlib = await import('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));

  // Build IDAT chunk
  const idat = compressed;

  // CRC32 function
  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    for (let i = 0; i < buf.length; i++) {
      crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeAndData = Buffer.concat([Buffer.from(type), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crc]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', idat);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Use top-level await
const zlib = await import('zlib');

// Patch createPNG to be sync
function createPNGSync(size, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  const rawData = [];
  const center = size / 2;
  for (let y = 0; y < size; y++) {
    rawData.push(0);
    for (let x = 0; x < size; x++) {
      const dx = (x - center) / center;
      const dy = (y - center) / center;
      const shieldW = y < size * 0.5 ? 0.75 : 0.75 - (y - size * 0.5) / size * 1.4;
      const inShield = Math.abs(dx) < shieldW * (1 - dy * 0.2) && dy < 0.75 && dy > -0.8;
      if (inShield) {
        const t = y / size;
        rawData.push(
          Math.min(255, Math.floor(102 + 20 * t)),
          Math.min(255, Math.floor(126 * (1 - t * 0.6))),
          Math.min(255, Math.floor(234 * (1 - t * 0.2) + 80 * t))
        );
      } else {
        rawData.push(10, 10, 26);
      }
    }
  }

  const compressed = zlib.deflateSync(Buffer.from(rawData));

  function crc32(buf) {
    let c = 0xFFFFFFFF;
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let v = i;
      for (let j = 0; j < 8; j++) v = (v & 1) ? (0xEDB88320 ^ (v >>> 1)) : (v >>> 1);
      t[i] = v;
    }
    for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const td = Buffer.concat([Buffer.from(type), data]);
    const cr = Buffer.alloc(4);
    cr.writeUInt32BE(crc32(td), 0);
    return Buffer.concat([len, td, cr]);
  }

  return Buffer.concat([signature, makeChunk('IHDR', ihdr), makeChunk('IDAT', compressed), makeChunk('IEND', Buffer.alloc(0))]);
}

const iconsDir = path.join('public', 'icons');
const distIconsDir = path.join('dist', 'icons');

for (const [size, file] of [[16, 'icon16.png'], [48, 'icon48.png'], [128, 'icon128.png']]) {
  const png = createPNGSync(size, 102, 126, 234);
  fs.writeFileSync(path.join(iconsDir, file), png);
  fs.writeFileSync(path.join(distIconsDir, file), png);
  console.log(`✅ Generated ${file} (${size}x${size}) — ${png.length} bytes`);
}

console.log('Done!');
