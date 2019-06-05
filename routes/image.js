/**
 * Routes:
 * -  GET:    Fetch Image
 * -  POST:   Uploads Image
 * -  PUT:    Edit Image
 * -  DELETE: Removes Image
 */
const express = require('express');

const { Image } = require('../models/image');
const { upload, deleteImage } = require('../config/aws.config');
const errorHandler = require('../handlers/errorHandler');

const imageRouter = express.Router();

imageRouter.get('/:key', (req, res) => {
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

imageRouter.post('/', upload.single('image'), async (req, res) => {
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

imageRouter.delete('/:key', (req, res, next) => {
  const { key } = req.params;
  Image.findOneAndDelete(
    {
      key,
    }, {
      _id: 0,
      key: 1,
    }, (err, doc) => {
      if (err) {
        next(err);
        return null;
      }

      if (doc) {
        return deleteImage(res, key);
      }
      return res.status(404).send('Image not found');
    },
  );
});

imageRouter.use(errorHandler);

module.exports = imageRouter;
