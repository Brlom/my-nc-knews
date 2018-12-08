const db = require('../db/connection');

exports.getAllTopics = (req, res, next) => db('topics')
  .select()
  .then((topics) => {
    res.status(200).send({ topics });
  })
  .catch(next);

exports.postNewTopic = (req, res, next) => db('topics')
  .insert({
    slug: req.body.slug,
    description: req.body.description,
  })
  .returning('*')
  .then(([topic]) => {
    res.status(201).send({ topic });
  })
  .catch(next);

exports.getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  const {
    limit,
    sort_by,
    sort_ascending,
    p,
  } = req.query;
  return db('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_at', 'topic', 'users.username as author', 'users.name', 'users.avatar_url', 'users.user_id')
    .join('topics', 'articles.topic', 'topics.slug')
    .join('users', 'articles.user_id', 'users.user_id')
    .where('articles.topic', topic)
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments as comment_count')
    .groupBy('articles.article_id', 'users.user_id')
    .limit(limit || 10)
    .orderBy(sort_by || 'created_at', sort_ascending ? 'asc' : 'desc')
    .offset(p - 1 || 0)
    .then((articles) => {
      if (articles.length > 0) {
        res.status(200);
      } else {
        res.status(404);
      }
      res.send({ articles });
    })
    .catch(next);
};

exports.createArticleWithTopic = (req, res, next) => {
  const { topic } = req.params;
  db('articles')
    .insert({
      title: req.body.title,
      body: req.body.body,
      user_id: req.body.user_id,
      topic,
    })
    .returning('*')
    .then(([article]) => {
      if (article) {
        res.status(201);
      } else {
        res.status(404);
      }
      res.send({ article });
    })
    .catch(next);
};
