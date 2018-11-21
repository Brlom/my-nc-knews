const articlesRouter = require('express').Router();
const { getAllArticles } = require('../controllers/articles');

articlesRouter.get('/', getAllArticles);

module.exports = articlesRouter;
