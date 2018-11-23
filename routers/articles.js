const articlesRouter = require('express').Router();
const { getAllArticles, getArticleById } = require('../controllers/articles');

articlesRouter.get('/', getAllArticles);
articlesRouter.get('/:article_id', getArticleById);

module.exports = articlesRouter;
