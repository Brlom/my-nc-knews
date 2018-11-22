const apiRouter = require('express').Router();
const articlesRouter = require('./articles');
const topicsRouter = require('./topics');
const usersRouter = require('./users');

apiRouter.get('/', (req, res) => {
  res.send({ msg: 'Welcome to NorthCoders homepage!' });
});

apiRouter.use('/articles', articlesRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;
