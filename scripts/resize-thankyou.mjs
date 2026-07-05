// One-off: derive a web-sized copy of the thank-you photo (original untouched).
import sharp from "sharp";

const SRC = "public/rsvp-photos/thankyou.JPG";
const OUT = "public/rsvp-photos/thankyou-web.jpg";

const img = sharp(SRC).rotate(); // honour EXIF orientation
const meta = await img.metadata();
const out = await img
  .resize({ width: 2400, withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(OUT);
console.log(
  `source ${meta.width}x${meta.height} -> ${out.width}x${out.height}, ${(out.size / 1024).toFixed(0)} KB`,
);
