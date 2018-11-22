const db = require('../db/connection');

// const validateQueries = (rawQueries, ...validQueries) => {
//   return validQueries.reduce((filtered, query) => {
//     if (rawQueries[query]) filtered[query] = rawQueries[query];
//     return filtered;
//   }, {});
// };

exports.getAllTopics = (req, res, next) => {
  db('topics')
    .select()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postNewTopic = (req, res, next) => {
  db('topics')
    .insert({ slug: req.body.slug, description: req.body.description })
    .returning('*')
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next)
};

exports.getArticlesByTopic = (req, res, next) => {
  const { topic } = req.params;
  db('topics')
    .select()
    .join('articles', 'topics.slug', '+', 'articles.topic')
    .where('topics', topic)
    .limit(limit || 10)
    .orderBy(sortBy || 'created_at', order || 'desc')
    .offset(page || 0)
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch(next)
}

// const query = validateQueries(req.query);
// const { topic } = req.params;
// const { limit, sortBy, page } = req.query;