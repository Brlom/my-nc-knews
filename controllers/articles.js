const db = require('../db/connection');

exports.getAllArticles = (req, res, next) => {
  const {
    limit, sortBy, order, p,
  } = req.query;
  return db('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_at', 'topic', 'users.username as author')
    .join('users', 'articles.user_id', 'users.user_id')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments as comment_count')
    .groupBy('articles.article_id')
    .groupBy('users.username')
    .limit(limit || 10)
    .orderBy(sortBy || 'created_at', order || 'desc')
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
      res.status(200).send(article);
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return db('articles')
    .where('articles.article_id', article_id)
    .del()
    .then(() => {
      res.status(200).send();
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const {
    limit, sortBy, order, p,
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
    .orderBy(sortBy || 'created_at', order || 'desc')
    .offset(p || 0)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return db('comments')
    .insert({ article_id, user_id: req.body.user_id, body: req.body.body })
    .returning('*')
    .then(([comment]) => {
      res.status(201).send(comment);
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
      res.status(200).send(comment);
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { article_id, comment_id } = req.params;
  return db('comments')
    .where('article_id', article_id)
    .where('comment_id', comment_id)
    .del()
    .then(() => {
      res.status(200).send();
    })
    .catch(next);
};
