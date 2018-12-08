const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const apiRouter = require('./routers/api');
const {
  handle400s, handle404s, handle422s, handle500s,
} = require('./errors/index');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({ msg: 'Welcome to the NC-Knews Homepage!' });
});

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  next({ status: 404, msg: 'page not found' });
});

app.use(handle400s);
app.use(handle404s);
app.use(handle422s);
app.use(handle500s);

module.exports = app;
