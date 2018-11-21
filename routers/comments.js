const commentsRouter = require('express').Router();
const { getAllComments } = require('../controllers/comments');

commentsRouter.get('/', getAllComments);

module.exports = commentsRouter;
