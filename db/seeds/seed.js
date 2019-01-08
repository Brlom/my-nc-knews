const {
  articleData,
  topicData,
  userData,
  commentData,
} = require('../utils');

exports.seed = function (knex, Promise) {
  const user_data = [];
  let user_select = {};
  // Deletes ALL existing entries
  return knex('topics').del()
    .then(() => knex('comments').del())
    .then(() => knex('articles').del())
    .then(() => knex('users').del())
    .then(() => knex('topics').insert(topicData).returning('*'))
    .then(() => {
      user_data.push(userData);
      return knex('users').insert(userData).returning('*');
    })
    .then((userSelect) => {
      user_select = userSelect
      const fixedArticleData = articleData.reduce((acc, curr) => {
        const new_obj = Object.assign({}, curr);
        new_obj.user_id = userSelect.find(obj => obj.username === curr.created_by).user_id;
        delete new_obj.created_by;
        new_obj.created_at = new Date(curr.created_at);
        acc.push(new_obj);
        return acc;
      }, []);
      return knex('articles').insert(fixedArticleData).returning('*');
    })
    .then((articleSelect) => {
      const fixedCommentData = commentData.reduce((acc, curr) => {
        const new_obj = Object.assign({}, curr);
        new_obj.article_id = articleSelect.find(obj => obj.title === curr.belongs_to).article_id;
        delete new_obj.belongs_to;
        new_obj.user_id = user_select.find(obj => obj.username === curr.created_by).user_id;
        delete new_obj.created_by;
        new_obj.created_at = new Date(curr.created_at);
        acc.push(new_obj);
        return acc;
      }, []);
      return knex('comments').insert(fixedCommentData).returning('*');
    });
};
