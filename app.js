const express = require('express')
const app = express();
const apiRouter = require('./routers/api');
const bodyParser = require('body-parser');
const { handle400s, handle404s, /*handle405s, handle422s,*/ handle500s } = require('./errors/index');

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
    next({ status: 404, msg: 'page not found' })
});

app.use(handle400s);
app.use(handle404s);
//app.use(handle405s);
//app.use(handle422s);
app.use(handle500s);

module.exports = app;