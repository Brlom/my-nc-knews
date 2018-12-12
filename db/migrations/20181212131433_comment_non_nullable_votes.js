exports.up = function (knex, Promise) {
    return knex('comments').whereNull('votes').update('votes', 0)
        .then(knex.schema.alterTable('comments', (commentsTable) => {
            commentsTable.integer('votes').defaultTo(0).notNullable().alter();
        }))

};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('comments', (commentsTable) => {
        commentsTable.integer('votes').alter();
    })
};
