exports.up = function (knex, Promise) {
    return knex.schema.createTable("users", usersTable => {
        usersTable.increments("user_id").primary();
        usersTable.string("username").notNullable();
        usersTable.string("avatar_url");
        usersTable.string("name").notNullable();
    })
};


exports.down = function (knex, Promise) {
    return knex.schema.dropTable("users")
};