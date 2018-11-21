const topicsRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topics');

topicsRouter.get('/', getAllTopics);

module.exports = topicsRouter;
