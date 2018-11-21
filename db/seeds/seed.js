const { articleData, topicData, userData, commentData } = require('../data/development-data');

exports.seed = function (knex, Promise) {
  let user_data = [];
  // Deletes ALL existing entries
  return knex('topics').del()
    .then(() => {
      return knex('articles').del();
    })
    .then(() => {
      return knex('users').del();
    })
    .then(() => {
      return knex('comments').del();
    })
    .then(function () {
      // Inserts seed entries
      return knex('topics').insert(topicData).returning('*');
    })
    .then(() => {
      user_data.push(userData);
      return knex('users').insert(userData).returning('*');
    })
    .then((userSelect) => {
      let fixedArticleData = articleData.reduce((acc, curr) => {
        let new_obj = Object.assign({}, curr);
        new_obj.user_id = userSelect.find(obj => obj.username == curr.created_by).user_id
        delete new_obj.created_by;
        new_obj.created_at = new Date(curr.created_at);
        acc.push(new_obj);
        return acc
      }, [])
      return knex('articles').insert(fixedArticleData).returning('*');
    })
    .then((articleSelect) => {
      let fixedCommentData = commentData.reduce((acc, curr) => {
        let new_obj = Object.assign({}, curr);
        new_obj.article_id = articleSelect.find(obj => obj.title == curr.belongs_to).article_id;
        delete new_obj.belongs_to;
        user_data.user_id = userData.find(obj => obj.username == curr.created_by).user_id;
        delete new_obj.created_by;
        new_obj.created_at = new Date(curr.created_at);
        acc.push(new_obj);
        return acc
      }, [])
      return knex('comments').insert(fixedCommentData).returning('*');
    })
};
