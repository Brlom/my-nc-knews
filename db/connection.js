const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: "localhost",
        user: "britannia",
        password: "1234",
        database: "NC_Knews"
    }
})

module.exports = db;