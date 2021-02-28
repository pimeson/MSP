'use strict'

const Sequelize = require('sequelize');
const db = require('../_db');

const Links = db.define('links', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.TEXT
  },
  dirName: {
    type: Sequelize.TEXT
  },
  dirPath: {
    type: Sequelize.TEXT
  },
  order: {
    type: Sequelize.INTEGER
  },
  display: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  date: {
    type: Sequelize.TIME
  }
});

module.exports = Links;