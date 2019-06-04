const mongoose = require('mongoose');

const Image = mongoose.model('Image', new mongoose.Schema({
  name: String,
  size: Number,
  filePath: String,
  fileName: String,
  timestamp: { type: Date, default: Date.now },
}));

exports.Image = Image;
