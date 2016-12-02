var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('project', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  }
});