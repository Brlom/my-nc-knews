const topicsRouter = require('express').Router();
const { getAllTopics, postNewTopic, getArticlesByTopic, createArticleWithTopic } = require('../controllers/topics');

topicsRouter.get('/', getAllTopics);
topicsRouter.post('/', postNewTopic);

topicsRouter.get('/:topic/articles', getArticlesByTopic);
topicsRouter.post('/:topic/articles', createArticleWithTopic);

module.exports = topicsRouter;
