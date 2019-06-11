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

imageRouter.get('/:key', (req, res, next) => {
  const { key } = req.params;
  Image.findOne(
    {
      key,
    }, {
      _id: 0,
      fileURL: 1,
      key: 1,
      timestamp: 1,
      size: 1,
    }, (err, doc) => {
      if (err) {
        next(err);
      }

      if (doc) {
        return res.status(200).json({ ...doc });
      }

      return res.status(404).json({
        status: '404',
        message: 'Image not found',
      });
    },
  );
});

imageRouter.post('/', upload.single('image'), async (req, res, next) => {
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
    next(error);
  }

  if (!req.file) {
    res.status(400).json({
      status: 400,
      message: 'File Not Specified',
    });
  }
  res.status(200).json({ fileURL: location });
});

// Handle Doc re-insertion at 502 error. Refactor.
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
