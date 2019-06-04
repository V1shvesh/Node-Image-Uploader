/**
 * Routes:
 * -  GET:    Fetch Image
 * -  POST:   Uploads Image
 * -  PUT:    Edit Image
 * -  DELETE: Removes Image
 */
const mongoose = require('mongoose');

const { Image } = require('../models/image');
const { upload, deleteImage } = require('../config/aws.config');

function imageRouter(app) {
  // Connect to database
  mongoose.connect('mongodb://localhost:27017/images', { useNewUrlParser: true })
    .catch(() => console.error('Not Connected :('));

  app.get('/img/:key', (req, res) => {
    const { key } = req.params;
    Image.findOne(
      {
        key,
      }, {
        _id: 0,
        fileURL: 1,
      }, (err, doc) => {
        if (err) {
          return res.status(500);
        }

        if (doc) {
          return res.status(200).json({ location: doc.fileURL });
        }

        return res.status(404).send('File not found!');
      },
    );
  });

  app.post('/img', upload.single('image'), async (req, res) => {
    const {
      originalname,
      size,
      location,
      key,
    } = req.file;
    const newImage = new Image({
      name: originalname,
      size,
      key,
      fileURL: location,
    });
    try {
      await newImage.save();
    } catch (error) {
      res.status(500).json(error);
    }

    if (!req.file) {
      res.status(400).end();
    }
    res.status(200).json({ location });
  });

  app.put('/img/:filename', (req, res) => {
    res.end('Under construction');
    //   const { filename } = req.params;
    //   Image.findOne(
    //     {
    //       fileName: filename,
    //     }, {
    //       _id: 0,
    //       filePath: 1,
    //     }, (err, doc) => {
    //       const upload = multer({
    //         storage: multer.diskStorage({
    //           path(_, file, cb) {
    //             res.write(`${JSON.stringify(filename)}\n`);
    //             if (file.mimetype === 'image/jpeg') {
    //               cb(null, path.join(__dirname, '..', doc.filePath));
    //             } else {
    //               cb(new Error('Invalid filetype'));
    //             }
    //           },
    //         }),
    //         limits: {
    //           fileSize: 10 * 1024 * 1024,
    //         },
    //       }).single('image');

  //       upload(req, res, () => {
  //         res.end('File Modified');
  //       });
  //     },
  //   );
  });

  app.delete('/img/:key', (req, res) => {
    const { key } = req.params;
    Image.findOneAndDelete(
      {
        key,
      }, {
        _id: 0,
        key: 1,
      }, (err, doc) => {
        if (err) {
          return res.status(500);
        }

        if (doc) {
          return deleteImage(res, key);
        }

        return res.status(404).send('Image not found');
      },
    );
  });
}

module.exports = imageRouter;
