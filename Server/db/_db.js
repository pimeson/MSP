const path = require('path');
const Sequelize = require('sequelize');
const dbURL = 'postgres://localhost:5432/msp';

// const env = require(path.join(__dirname, '../env'));
// const url = env.DATABASE_URL
const url = dbURL
const db = new Sequelize(url, 'postgres', '', {
  // logging: env.LOGGING ? console.log : false,
  // native: env.NATIVE
  logging: false,
  hostname: 'localhost',
  dialect: 'postgres'
})

module.exports = db;