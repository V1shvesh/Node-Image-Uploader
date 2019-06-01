/**
 * Routes:
 * -  GET:    Fetch Image
 * -  POST:   Uploads Image
 * -  PUT:    Edit Image
 * -  DELETE: Removes Image
 */
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg') {
      cb(null, `img-${Date.now()}-${req.params.name}.jpg`);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

function imageRouter(app) {
  app.get('/img/:name', (req, res) => {});

  app.post('/img/:name', upload.single('image'), (req, res) => {
    console.log(`File recieved: ${JSON.stringify(req.file)}`);

    if (!req.file) {
      res.status(400).end();
    }
    res.json({ fileUrl: `http://192.168.0.7:3000/images/${req.file.filename}` });
  });

  app.put('/img/:name', (req, res) => {});

  app.delete('/img/:name', (req, res) => {});
}

module.exports = imageRouter;
