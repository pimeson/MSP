var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('exhibit', {
  title: {
    type: Sequelize.STRING
  },
  fileName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  imageSrc: {
    type: Sequelize.STRING,
    allowNull: false
  },
  date: {
    type: Sequelize.DATEONLY
  }
});