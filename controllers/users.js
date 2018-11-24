const db = require('../db/connection');

exports.getAllUsers = (req, res, next) => db('users')
  .select()
  .then((users) => {
    res.status(200).send({ users });
  })
  .catch(next);

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  return db('users')
    .select()
    .where('username', username)
    .then(([user]) => {
      if (user) {
        res.status(200);
      } else {
        res.status(404);
      }
      res.send(user);
    })
    .catch(next);
};
