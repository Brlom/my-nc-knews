const apiRouter = require('express').Router();
const apiEndpoints = require('../db/utils/apiEndpoints');
const articlesRouter = require('./articles');
const topicsRouter = require('./topics');
const usersRouter = require('./users');

apiRouter.get('/', (req, res) => {
  res.send({ apiEndpoints });
});

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
