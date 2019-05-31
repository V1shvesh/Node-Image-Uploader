const express = require('express');
const app = express();

/**
 * Routes:
 * -  GET:    Fetch Image
 * -  POST:   Uploads Image
 * -  PUT:    Edit Image
 * -  DELETE: Removes Image
 */

app.get('/img/:name', (req, res) => {});
app.post('/img/:name', (req, res) => {});
app.put('/img/:name', (req, res) => {});
app.delete('/img/:name', (req, res) => {});