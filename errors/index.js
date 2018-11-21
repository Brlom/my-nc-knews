// const pgp = require('pg-promise');
// const { QueryResultError } = pgp.errors;
// const { noData } = pgp.errors.queryResultErrorCode;

exports.handle400s = (err, req, res, next) => {
    // console.log(err)
    // better way of doing this: 
    // use object of codes where the values are a different msg to client
    // make the if statement re-usable
    const code400s = ['42703', '22P02', '23502'];
    if (code400s.includes(err.code)) {
        res.status(err.status || 400).send(err.msg || 'Bad request')
    }
    next(err);
}

exports.handle404s = (err, req, res, next) => {
    if (err instanceof QueryResultError && err.code === noData) {
        res.status(err.status || 404).send(err.msg || 'page not found')
    }
    next(err)
}

exports.handle500s = (err, req, res, next) => {
    // console.log('ALSO HERE')
    console.log(err)
    res.status(err.status || 500).send(err.msg || 'internal server error');
};