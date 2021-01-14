const mongoose = require("mongoose");
const crypto = require("crypto");

const ImageSchema = new mongoose.Schema(
  {
    image: {
      type: Buffer,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//encrypt image
ImageSchema.pre("save", async function (next) {
  const image = this;

  if (image.isModified("image")) {
    const iv = crypto.randomBytes(16);
    const key = crypto
      .createHash("sha256")
      .update(String(process.env.IMAGE_ENCRPT))
      .digest("base64")
      .substr(0, 32);
    const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);
    const result = Buffer.concat([
      iv,
      cipher.update(image.image),
      cipher.final(),
    ]);
    image.image = result;
  }

  next();
});

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;
