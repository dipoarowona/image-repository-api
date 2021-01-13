const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 35000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
      return callback(new Error("Upload a jpg,jpeg,png"));
    }
    callback(undefined, true);
  },
});

module.exports = upload;
