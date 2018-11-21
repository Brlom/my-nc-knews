const ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
const knex = require('knex');
const config = require('../knexfile');

const db = knex(
  config[ENV],
);

module.exports = db;
