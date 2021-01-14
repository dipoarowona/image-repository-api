const express = require("express");
const sharp = require("sharp");
const Image = require("../models/image");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const router = express.Router();
const crypto = require("crypto");

const decrypt = (encrypted) => {
  // Get the iv: the first 16 bytes
  const iv = encrypted.slice(0, 16);

  // Get the rest
  encrypted = encrypted.slice(16);

  const key = crypto
    .createHash("sha256")
    .update(String(process.env.IMAGE_ENCRPT))
    .digest("base64")
    .substr(0, 32);

  // Create a decipher
  const decipher = crypto.createDecipheriv("aes-256-ctr", key, iv);
  // Actually decrypt it
  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return result;
};

//upload one
router.post(
  "/image/uploadOne",
  auth,
  upload.single("upload"),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      const image = new Image({
        owner: req.user._id,
        image: buffer,
        description: req.file.originalname.split(".")[0].toLowerCase(),
      });

      await image.save();
      res.send();
    } catch (err) {
      res.status(400).send(err);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//upload many
router.post(
  "/image/uploadMany",
  auth,
  upload.array("uploads", 15),
  (req, res) => {
    req.files.forEach(async (file) => {
      try {
        const buffer = await sharp(file.buffer)
          .resize({ width: 250, height: 250 })
          .png()
          .toBuffer();
        const image = new Image({
          owner: req.user._id,
          image: buffer,
          description: file.originalname.split(".")[0].toLowerCase(),
        });
        await image.save();
      } catch (err) {
        return res.status(400).send();
      }
    });

    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//get all of users images (paginated)
router.get("/image/mine", auth, async (req, res) => {
  try {
    await req.user
      .populate({ path: "images", options: { skip: parseInt(req.query.skip) } })
      .execPopulate();
    res.set("Content-Type", "image/png");
    res.set("Description", req.user.images[0].description);
    res.set("image-ID", req.user.images[0]._id);
    res.send(decrypt(req.user.images[0].image));
  } catch (err) {
    res.status(404).send();
  }
});

//search image based  on description (paginated)
router.get("/image/search", auth, async (req, res) => {
  try {
    const images = await Image.find({
      description: {
        $regex: req.query.search,
        $options: "i",
      },
      owner: req.user._id,
    }).skip(parseInt(req.query.skip));

    res.set("Content-Type", "image/png");
    res.set("Description", images[0].description);
    res.set("image-ID", images[0]._id);
    res.send(decrypt(images[0].image));
  } catch (err) {
    res.status(404).send();
  }
});

//get image using id of image
router.get("/image/:id", auth, async (req, res) => {
  try {
    const image = await Image.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    res.set("Content-Type", "image/png");
    res.send(decrypt(image.image));
  } catch (err) {
    res.status(404).send();
  }
});

//delete one
router.delete("/image/delete", auth, async (req, res) => {
  try {
    const image = await Image.deleteOne({
      _id: req.query.id,
      owner: req.user._id,
    });

    if (!image) {
      return res.status(404).send();
    }
    res.send();
  } catch (err) {
    res.status(400).send();
  }
});

//delete many
router.delete("/image/deleteMany", auth, async (req, res) => {
  try {
    const images = await Image.deleteMany({
      _id: { $in: req.body.ids },
      owner: req.user._id,
    });
    console.log(images);
    if (!images.deletedCount) {
      return res.status(404).send();
    }
    res.send();
  } catch (err) {
    res.status(400).send();
  }
});

//delete all
router.delete("/image/deleteAll", auth, async (req, res) => {
  try {
    const images = await Image.deleteMany({ owner: req.user._id });

    if (!images.deletedCount) {
      return res.status(404).send();
    }
    res.send();
  } catch (err) {
    res.status(400).send();
  }
});

module.exports = router;
