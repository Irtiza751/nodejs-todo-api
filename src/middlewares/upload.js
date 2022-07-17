const multer = require('multer');

const storage = multer.memoryStorage({
  limits: {
    fileSize: 1000000,
  },
});

const upload = multer({ storage });
module.exports = upload;