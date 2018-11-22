const db = require('../db/connection');

const validateQueries = (rawQueries, ...validQueries) => {
  return validQueries.reduce((filtered, query) => {
    if (rawQueries[query]) filtered[query] = rawQueries[query];
    return filtered;
  }, {});
};

exports.getAllTopics = (req, res, next) => {
  return db('topics')
    .select()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postNewTopic = (req, res, next) => {
  return db('topics')
    .insert({ slug: req.body.slug, description: req.body.description })
    .returning('*')
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const query = validateQueries(req.query);
  const { topic } = req.params;
  const { limit, sortBy, order, page } = req.query;
  return db('articles')
    .select('article_id', 'title', 'votes', 'created_at', 'topic')
    .join('topics', 'articles.topic', 'topics.slug')
    .where('articles.topic', topic)
    .limit(limit || 10)
    .orderBy(sortBy || 'created_at', order || 'desc')
    .offset(page || 0)
    .where(query)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
