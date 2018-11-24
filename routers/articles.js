const articlesRouter = require('express').Router();
const {
  getAllArticles, getArticleById, updateVotesById, deleteArticleById, getCommentsByArticleId,
} = require('../controllers/articles');

articlesRouter.get('/', getAllArticles);

articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', updateVotesById);
articlesRouter.delete('/:article_id', deleteArticleById);

articlesRouter.get('/:article_id/comments', getCommentsByArticleId);

module.exports = articlesRouter;
