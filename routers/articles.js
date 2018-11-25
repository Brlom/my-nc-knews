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
const { handle405s } = require('../controllers/errors');

articlesRouter.route('/')
  .get(getAllArticles)
  .all(handle405s);

articlesRouter.route('/:article_id')
  .get(getArticleById)
  .patch(updateVotesById)
  .delete(deleteArticleById)
  .all(handle405s);

articlesRouter.route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(handle405s);

articlesRouter.route('/:article_id/comments/:comment_id')
  .patch(updateCommentVotes)
  .delete(deleteCommentById)
  .all(handle405s);

module.exports = articlesRouter;
