process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server-global');
const {Image} = require('../models/image');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../app');

chai.use(chaiHttp);

const mongod = new MongoMemoryServer({
  dbName: 'images',
});

let uri;

const key = 'test.jpg';
const fileURL = 'http://testurl.com/';
before(async () => {
  uri = await mongod.getConnectionString();
  mongoose.connect(uri + 'images', { useNewUrlParser: true });
});

beforeEach(() => {
  Image.remove();
  const newImage = new Image({
    name: 'myimg.jpg',
    size: 2220,
    key,
    fileURL,
  });
  newImage.save();
})


// Tests for GET Endpoint
describe('GET', () => {

  it('should return 404 for non-existent image', (done) => {
    chai.request(app)
      .get('/img/wah.jpg')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
  });

  it('should return permalink for existing image', (done) => {
    chai.request(app)
      .get(`/img/${key}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.location).to.equal(fileURL);
        done();
      });
  });

  after(() => {
    mongoose.disconnect(() => mongod.stop());
  });
});

/**
 * TODO:
 * -  Refactor tests to Jest.
 * -  Mock S3, Multer.
 */
