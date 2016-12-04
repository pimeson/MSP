const Sequelize = require('sequelize');
const db = require('../_db.js');
const fs = require('fs');

db.model('downloads', {
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
})