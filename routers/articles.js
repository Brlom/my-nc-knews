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

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(updateVotesById)
  .delete(deleteArticleById);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

articlesRouter.route('/:article_id/comments/:comment_id')
  .patch(updateCommentVotes)
  .delete(deleteCommentById);

module.exports = articlesRouter;
