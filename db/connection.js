// const ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
// const knex = require('knex');
// const config = require('../knexfile');

// const db = knex(
//   config[ENV],
// );

// module.exports = db;

const ENV = process.env.NODE_ENV || 'development';
const config = ENV === 'production' ? { client: 'pg', connection: process.env.DATABASE_URL } : require('../knexfile')[ENV];

const db = knex(
  config[ENV],
);

module.exports = db;
module.exports = require('knex')(config);