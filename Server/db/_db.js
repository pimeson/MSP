'use strict'

// for production
const path = require('path');
const Sequelize = require('sequelize');
const dbURL = 'postgres://postgres@localhost:5432/msp';
const url = dbURL
const db = new Sequelize('msp', 'postgres', 'postgres', {
  logging: false,
  hostname: 'localhost',
  dialect: 'postgres'
})


// const path = require('path');
// const Sequelize = require('sequelize');

// const env = require(path.join(__dirname, '../env'));
// const db = new Sequelize(env.DATABASE_URL, {
//   logging: env.LOGGING ? console.log : false,
//   native: env.NATIVE
// })

//module.exports = db;


module.exports = db;