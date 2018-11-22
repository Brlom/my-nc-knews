// const pgp = require('pg-promise');
// const { QueryResultError } = pgp.errors;
// const { noData } = pgp.errors.queryResultErrorCode;

exports.handle400s = (err, req, res, next) => {
  // console.log(err)
  const code400s = {
    42702: 'Bad request: column reference is ambiguous',
    42703: 'Bad request: column undefined',
    '22P02': 'Bad request: invalid text representation',
    23502: 'Bad request: NOT NULL violation',
  };
  if (code400s[err.code]) {
    res.status(err.status || 400).send(err.msg || code400s[err.code]);
  } else {
    next(err);
  }
};

exports.handle404s = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status || 404).send(err.msg || 'page not found');
  }
  next(err);
};

// exports.handle405s = (err, req, res, next) => {

// };

// exports.handle422s = (err, req, res, next) => {

// };

exports.handle500s = (err, req, res, next) => {
  res.status(err.status || 500).send(err.msg || 'internal server error');
};
