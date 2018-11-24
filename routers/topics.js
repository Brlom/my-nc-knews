const topicsRouter = require('express').Router();
const {
  getAllTopics,
  postNewTopic,
  getArticlesByTopic,
  createArticleWithTopic,
} = require('../controllers/topics');

topicsRouter.route('/')
  .get(getAllTopics)
  .post(postNewTopic)

topicsRouter.route('/:topic/articles')
  .get(getArticlesByTopic)
  .post(createArticleWithTopic)

module.exports = topicsRouter;
