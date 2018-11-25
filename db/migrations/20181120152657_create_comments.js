exports.up = function (knex, Promise) {
  return knex.schema.createTable('comments', (commentsTable) => {
    commentsTable.increments('comment_id').primary();
    commentsTable.integer('user_id').references('user_id').inTable('users');
    commentsTable.integer('article_id').references('article_id').inTable('articles').onDelete('CASCADE');
    commentsTable.integer('votes');
    commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
    commentsTable.string('body', 1000);
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('comments');
};
