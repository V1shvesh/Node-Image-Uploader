const multer = require('multer');
// const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');
// const config = require('../aws.env');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename(req, file, cb) {
    if (file.mimetype === 'image/jpeg') {
      cb(null, `img-${Date.now()}-${file.originalname.split('.')[0]}.jpg`);
    } else {
      cb(new Error('Invalid filetype'));
    }
  },
});

module.exports = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
