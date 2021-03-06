const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
require('dotenv').config();

const {
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  REGION,
} = process.env;

aws.config.update({
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  accessKeyId: AWS_ACCESS_KEY,
  region: REGION,
});

const s3 = new aws.S3();

const storage = multerS3({
  acl: 'public-read',
  s3,
  bucket: 'profile-pic-exercise',
  key(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

exports.upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Invalid File Type'), false);
    }
  },
});

exports.deleteImage = (res, Key) => {
  s3.deleteObject({
    Bucket: 'profile-pic-exercise',
    Key,
  }, (err) => {
    if (err) {
      res.status(502).json({
        status: 502,
        message: 'Unable to delete file',
      });
    }

    res.status(200).send('File deleted');
  });
};
