const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect('mongodb://localhost:27017/images', { useNewUrlParser: true })
  .catch(() => console.error('Not Connected :('));

app.listen(
  8080,
  () => console.log('Listening...'),
);
