module.exports = function errorHandler(err, req, res) {
  if (err.message === 'Invalid File Type') {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }

  res.status(500).json({
    status: 500,
    message: 'Internal Server Error',
  });
};
