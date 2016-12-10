'use strict'

const Sequelize = require('sequelize');
const db = require('../_db');
const fs = require('fs');

module.exports = db.define('download', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fileName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  filePath: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {
  hooks: {
    beforeDestroy: (download) => {
      fs.unlinkSync('./'+download.dataValues.filePath);
    }
  }
});