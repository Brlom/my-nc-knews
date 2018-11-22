const db = require('../db/connection');

const validateQueries = (rawQueries, ...validQueries) => validQueries.reduce((filtered, query) => {
  if (rawQueries[query]) filtered[query] = rawQueries[query];
  return filtered;
}, {});

exports.getAllTopics = (req, res, next) => db('topics')
  .select()
  .then((topics) => {
    res.status(200).send({ topics });
  })
  .catch(next);

exports.postNewTopic = (req, res, next) => db('topics')
  .insert({ slug: req.body.slug, description: req.body.description })
  .returning('*')
  .then(([topic]) => {
    res.status(201).send({ topic });
  })
  .catch(next);

exports.getArticlesByTopic = (req, res, next) => {
  const query = validateQueries(req.query);
  const { topic } = req.params;
  const {
    limit, sortBy, order, p,
  } = req.query;
  return db('articles')
    .select('articles.article_id', 'title', 'articles.votes', 'articles.created_at', 'topic', 'users.username as author')
    .join('topics', 'articles.topic', 'topics.slug')
    .join('users', 'articles.user_id', 'users.user_id')
    .where('articles.topic', topic)
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .count('comments as comment_count')
    .groupBy('articles.article_id')
    .groupBy('users.username')
    .limit(limit || 10)
    .orderBy(sortBy || 'created_at', order || 'desc')
    .offset(p || 0)
    .where(query)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};
