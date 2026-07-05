// Derive a web-sized copy of a photo (original untouched).
// Usage: node scripts/make-web-copy.mjs <src> <out> [maxWidth=1400] [quality=80]
import sharp from "sharp";

const [src, out, width = "1400", quality = "80"] = process.argv.slice(2);
if (!src || !out) {
  console.error("usage: node scripts/make-web-copy.mjs <src> <out> [maxWidth] [quality]");
  process.exit(1);
}
const r = await sharp(src)
  .rotate()
  .resize({ width: Number(width), withoutEnlargement: true })
  .jpeg({ quality: Number(quality), mozjpeg: true })
  .toFile(out);
console.log(out, `${r.width}x${r.height}`, Math.round(r.size / 1024), "KB");
