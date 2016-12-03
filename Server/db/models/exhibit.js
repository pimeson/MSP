const Sequelize = require('sequelize');
const fs = require('fs');

const db = require('../_db');

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
}, {
  hooks: {
    // beforeBulkDestroy: (exhibit, options) => {
    //   return console.log(exhibit);
    // }
    // ,
    beforeDestroy: (exhibit) => {
      console.log("cascading?")
      fs.unlinkSync('./'+exhibit.dataValues.imageSrc);
    }
  }
});