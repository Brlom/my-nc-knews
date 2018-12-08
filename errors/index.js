
exports.handle400s = (err, req, res, next) => {
  const code400s = {
    42702: 'Bad request: column reference is ambiguous',
    42703: 'Bad request: column undefined',
    '22P02': 'Bad request: invalid text representation',
    23502: 'Bad request: NOT NULL violation',
  };
  // handle postgres error codes
  if (code400s[err.code]) {
    res.status(err.status || 400).send(err.msg || code400s[err.code]);
    // handle own 400 errors
  } else if (err.code === 400) {
    res.status(err.code).send(err.msg);
  } else {
    next(err);
  }
};

exports.handle404s = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(err.status || 404).send(err.msg || 'page not found');
  } else {
    next(err);
  }
};

exports.handle422s = (err, req, res, next) => {
  const code422s = {
    23505: 'Unique key constraint: key already exists',
  };
  if (code422s[err.code]) {
    res.status(err.status || 422).send(err.msg || code422s[err.code]);
  } else {
    next(err);
  }
};

exports.handle500s = (err, req, res, next) => {
  res.status(err.status || 500).send(err.msg || 'internal server error');
};
