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
        .where('articles.user_id', article_id)
        .join('users', 'articles.user_id', 'users.user_id')
        .leftJoin('comments', 'articles.article_id', 'comments.article_id')
        .count('comments as comment_count')
        .groupBy('articles.article_id')
        .groupBy('users.username')
        .then((article) => {
            res.status(200).send(article);
        })
        .catch(next)
}
