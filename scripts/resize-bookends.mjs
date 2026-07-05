// Derive web-sized copies of the chosen bookend photos (originals untouched).
// front-page-2 serves full-bleed at 100vw -> 1920w; last-page fills a ~192px
// circle at 3x dpr -> 900w is generous.
import sharp from "sharp";

for (const [src, out, width, quality] of [
  ["public/rsvp-photos/front-page-2.JPG", "public/rsvp-photos/front-page-web.jpg", 1920, 78],
  ["public/rsvp-photos/last-page.JPG", "public/rsvp-photos/last-page-web.jpg", 900, 80],
]) {
  const r = await sharp(src)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(out);
  console.log(out, `${r.width}x${r.height}`, Math.round(r.size / 1024), "KB");
}
