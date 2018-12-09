exports.up = function (knex, Promise) {
    return knex('articles').whereNull('votes').update('votes', 0)
        .then(knex.schema.alterTable('articles', (articlesTable) => {
            articlesTable.integer('votes').defaultTo(0).notNullable().alter();
        }))

};

exports.down = function (knex, Promise) {
    return knex.schema.alterTable('articles', (articlesTable) => {
        articlesTable.integer('votes').alter();
    })
};
