const usersRouter = require('express').Router();
const { getAllUsers, getUserById } = require('../controllers/users');
const { handle405s } = require('../controllers/errors');

usersRouter.route('/')
  .get(getAllUsers)
  .all(handle405s);

usersRouter.route('/:username')
  .get(getUserById)
  .all(handle405s);

module.exports = usersRouter;
