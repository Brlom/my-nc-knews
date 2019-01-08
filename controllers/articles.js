const db = require('../db/connection');

exports.getAllArticles = (req, res, next) => {
  const {
    limit,
    sort_by,
    sort_ascending,
    p,
  } = req.query;
  return db('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_at', 'articles.body', 'topic', 'users.username as author', 'users.name', 'users.avatar_url', 'users.user_id')
    .join('users', 'articles.user_id', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments as comment_count')
    .groupBy('articles.article_id', 'users.user_id')
    .limit(limit || 10)
    .orderBy(sort_by || 'created_at', sort_ascending ? 'asc' : 'desc')
    .offset(p - 1 || 0)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return db('articles')
    .select('articles.article_id', 'articles.body', 'title', 'articles.votes', 'articles.created_at', 'articles.body', 'topic', 'users.username as author', 'users.name', 'users.avatar_url', 'users.user_id')
    .where('articles.article_id', article_id)
    .join('users', 'articles.user_id', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments as comment_count')
    .groupBy('articles.article_id', 'users.user_id')
    .then(([article]) => {
      if (article) {
        res.status(200).send(article);
      } else {
        res.status(404).send();
      }
    })
    .catch(next);
};

exports.getArticlesByAuthor = (req, res, next) => {
  const { author } = req.params;
  const {
    limit,
    sort_by,
    sort_ascending,
    p,
  } = req.query;
  return db('articles')
    .select('articles.article_id', 'articles.body', 'title', 'articles.votes', 'articles.created_at', 'articles.body', 'topic', 'users.username as author', 'users.name', 'users.avatar_url', 'users.user_id')
    .where('users.username', author)
    .join('users', 'articles.user_id', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments as comment_count')
    .groupBy('articles.article_id', 'users.user_id')
    .limit(limit || 10)
    .orderBy(sort_by || 'created_at', sort_ascending ? 'asc' : 'desc')
    .offset(p - 1 || 0)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

exports.updateVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return db('articles')
    .where('articles.article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (article) {
        res.status(200);
      } else {
        res.status(404);
      }
      res.send(article);
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return db('articles')
    .where('articles.article_id', article_id)
    .del()
    .then((numDeleted) => {
      if (numDeleted) {
        res.status(204);
      } else {
        res.status(404);
      }
      res.send();
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit,
    sort_by,
    sort_ascending,
    p,
  } = req.query;
  return db('comments')
    .select('comments.comment_id', 'comments.votes', 'comments.created_at', 'comments.body', 'users.username as author', 'users.name', 'users.avatar_url', 'users.user_id')
    .join('users', 'comments.user_id', 'users.user_id')
    .where('comments.article_id', article_id)
    .limit(limit || 10)
    .orderBy(sort_by || 'created_at', sort_ascending ? 'asc' : 'desc')
    .offset(p - 1 || 0)
    .then((comments) => {
      if (comments.length > 0) {
        res.status(200);
      } else {
        res.status(404);
      }
      res.send({ comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body, user_id } = req.body;
  // test data has comments without users, but out of personal
  // preferance I do not want this to be allowed
  if (!body || !user_id) {
    next({ msg: 'Not allowed to post comments with no user or body', code: 400 });
  }
  return db('comments')
    .insert({
      article_id,
      user_id,
      body,
    })
    .returning('*')
    .then(([comment]) => {
      if (comment) {
        res.status(201);
      } else {
        res.status(400);
      }
      res.send(comment);
    })
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  const { inc_votes } = req.body;
  return db('comments')
    .where('article_id', article_id)
    .where('comment_id', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([comment]) => {
      if (comment) {
        res.status(200);
      } else {
        res.status(404);
      }
      res.send(comment);
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  return db('comments')
    .where('article_id', article_id)
    .where('comment_id', comment_id)
    .del()
    .then((numDeleted) => {
      if (numDeleted) {
        res.status(204);
      } else {
        res.status(404);
      }
      res.send();
    })
    .catch(next);
};
