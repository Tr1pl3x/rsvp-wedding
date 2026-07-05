// Sample the mean colour of the bottom strip of the block-two photo so the
// torn-edge band below it can continue the floor seamlessly.
import sharp from "sharp";

const img = sharp("public/rsvp-photos/whiteblock-2-web.jpg");
const { width, height } = await img.metadata();
const stripH = Math.round(height * 0.03);
const px = await img
  .extract({ left: 0, top: height - stripH, width, height: stripH })
  .resize(1, 1, { fit: "fill" })
  .raw()
  .toBuffer();
console.log(
  "floor mean: #" +
    [...px.slice(0, 3)].map((v) => v.toString(16).padStart(2, "0")).join(""),
);
