const articlesRouter = require('express').Router();
const {
  getAllArticles,
  getArticleById,
  updateVotesById,
  deleteArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  updateCommentVotes,
  deleteCommentById,
} = require('../controllers/articles');

articlesRouter.get('/', getAllArticles);

articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', updateVotesById);
articlesRouter.delete('/:article_id', deleteArticleById);

articlesRouter.get('/:article_id/comments', getCommentsByArticleId);
articlesRouter.post('/:article_id/comments', postCommentByArticleId);

articlesRouter.patch('/:article_id/comments/:comment_id', updateCommentVotes);
articlesRouter.delete('/:article_id/comments/:comment_id', deleteCommentById);

module.exports = articlesRouter;
