/**
 * Routes:
 * -  GET:    Fetch Image
 * -  POST:   Uploads Image
 * -  PUT:    Edit Image
 * -  DELETE: Removes Image
 */
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');

const { Image } = require('../models/image');
const uploadGet = require('../config/multer.config');

function imageRouter(app) {
  // Connect to database
  mongoose.connect('mongodb://localhost:27017/images', { useNewUrlParser: true })
    .catch(() => console.error('Not Connected :('));

  app.get('/img/:filename', (req, res) => {
    const { filename } = req.params;
    Image.findOne(
      {
        fileName: filename,
      }, {
        _id: 0,
        filePath: 1,
      }, (err, doc) => {
        res.sendFile(path.join(__dirname, '..', doc.filePath));
      },
    );
  });

  app.post('/img', uploadGet.single('image'), (req, res) => {
    const {
      originalName,
      size,
      path: filePath, // Destructured and aliased
      filename,
    } = req.file;
    const newImage = new Image({
      name: originalName,
      size,
      filePath,
      fileName: filename,
    });

    newImage.save();

    if (!req.file) {
      res.status(400).end();
    }
    res.status(200).json({ fileUrl: `http://localhost:8080/img/${req.file.filename}` });
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

  app.delete('/img/:filename', (req, res) => {
    const { filename } = req.params;
    Image.findOneAndDelete(
      {
        fileName: filename,
      }, {
        _id: 0,
        filePath: 1,
      }, (err, doc) => {
        fs.unlink(path.join(__dirname, '..', doc.filePath), () => {
          res.send('Deleted file');
        });
      },
    );
  });
}

module.exports = imageRouter;
