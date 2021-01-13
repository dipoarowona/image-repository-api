const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
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

const Image = mongoose.model("Image", ImageSchema);
module.exports = Image;
