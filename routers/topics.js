const topicsRouter = require('express').Router();
const {
  getAllTopics,
  postNewTopic,
  getArticlesByTopic,
  createArticleWithTopic,
} = require('../controllers/topics');
const { handle405s } = require('../controllers/errors');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(postNewTopic)
  .all(handle405s);

topicsRouter.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(createArticleWithTopic)
  .all(handle405s);

module.exports = topicsRouter;
