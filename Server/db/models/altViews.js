const Sequelize = require('sequelize');

const db = require('../_db');

module.exports = db.define('exhibit', {
  title: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.ENUM('picture'),
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  imageSrc: {
    type: Sequelize.STRING
  } 
})