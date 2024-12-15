const path = require("path");
const multer = require("multer");

const upload = multer(
  {
    limits: {
      fileSize: 2*1024*1024
    },
    fileFilter(req, file, cb) {
      const ext = path.extname(file.originalname).toLowerCase();
      if(ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
        cb(new Error("File format error, only jpg, jpeg, and png formats are allowed."));
      }
      cb(null, true);
    }
  }
).any();

module.exports = upload;