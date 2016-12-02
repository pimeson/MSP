const path = require('path');
const Sequelize = require('sequelize');

const env = require(path.join(__dirname, '../env'));
const db = new Sequelize(env.DATABASE_URL, {
  logging: env.LOGGING ? console.log : false,
  native: env.NATIVE
})

module.exports = db;