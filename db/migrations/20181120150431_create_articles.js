exports.up = function (knex, Promise) {
    return knex.schema.createTable("articles", articlesTable => {
        articlesTable.increments("article_id").primary();
        articlesTable.string("title").notNullable();
        articlesTable.string("body", 2000).notNullable();
        articlesTable.integer("votes");
        articlesTable.string("topic");
        articlesTable.integer("user_id").references("user_id").inTable('users');
        articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
    })
};


exports.down = function (knex, Promise) {
    return knex.schema.dropTable("articles")
};