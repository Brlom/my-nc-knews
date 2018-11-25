const test = require('../data/test-data');
const development = require('../data/development-data');

const env = process.env.NODE_ENV || 'development';

const data = { test, development };

module.exports = data[env];
