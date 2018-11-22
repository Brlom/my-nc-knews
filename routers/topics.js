const topicsRouter = require('express').Router();
const { getAllTopics, postNewTopic, getArticlesByTopic } = require('../controllers/topics');

topicsRouter.get('/', getAllTopics);
topicsRouter.post('/', postNewTopic);

topicsRouter.get('/:topic/articles', getArticlesByTopic);

module.exports = topicsRouter;
