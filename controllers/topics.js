const db = require('../db/connection');

// const validateQueries = (rawQueries, ...validQueries) => {
//     return validQueries.reduce((filtered, query) => {
//         if (rawQueries[query]) filtered[query] = rawQueries[query];
//         return filtered;
//     }, {});
// };

exports.getAllTopics = (req, res, next) => db('topics')
  .select()
  .then((topics) => {
    res.status(200).send({ topics });
  })
  .catch(next);
