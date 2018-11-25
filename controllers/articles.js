const db = require('../db/connection');

exports.getAllArticles = (req, res, next) => {
  const {
    limit,
    sortBy,
    sort_ascending,
    p,
  } = req.query;
  return db('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_at', 'topic', 'users.username as author')
    .join('users', 'articles.user_id', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments as comment_count')
    .groupBy('articles.article_id')
    .groupBy('users.username')
    .limit(limit || 10)
    .orderBy(sortBy || 'created_at', sort_ascending ? 'asc' : 'desc')
    .offset(p || 0)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return db('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_at', 'topic', 'users.username as author')
    .where('articles.article_id', article_id)
    .join('users', 'articles.user_id', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments as comment_count')
    .groupBy('articles.article_id')
    .groupBy('users.username')
    .then(([article]) => {
      if (article) {
        res.status(200).send(article);
      } else {
        res.status(404).send();
      }
    })
    .catch(next);
};

exports.updateVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return db('articles')
    .where('articles.article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(([article]) => {
      if (article) {
        res.status(200)
      } else {
        res.status(404)
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
        res.status(200)
      } else {
        res.status(404)
      }
      res.send();
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit,
    sortBy,
    sort_ascending,
    p,
  } = req.query;
  return db('comments')
    .select('comments.comment_id', 'comments.votes', 'comments.created_at', 'comments.body', 'users.username as author')
    .rightJoin('articles', 'comments.article_id', 'articles.article_id')
    .join('users', 'articles.user_id', 'users.user_id')
    .groupBy('articles.article_id')
    .groupBy('users.username')
    .groupBy('comments.comment_id')
    .where('articles.article_id', article_id)
    .limit(limit || 10)
    .orderBy(sortBy || 'created_at', sort_ascending ? 'asc' : 'desc')
    .offset(p || 0)
    .then((comments) => {
      if (comments.length > 0) {
        res.status(200)
      } else {
        res.status(404)
      }
      res.send(comments);
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body, user_id } = req.body;
  // test data has comments without users, but out of personal preferance I do not want this to be allowed
  if (!body || !user_id) {
    res.status(400).send()
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
        res.status(201)
      } else {
        res.status(400)
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
        res.status(200)
      } else {
        res.status(404)
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
        res.status(200)
      } else {
        res.status(404)
      }
      res.send();
    })
    .catch(next);
};
