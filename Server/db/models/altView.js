'use strict'

const Sequelize = require('sequelize');
const fs = require('fs');
const db = require('../_db');

module.exports = db.define('altView', {
  title: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.ENUM('Picture', 'Video'),
    allowNull: false
  },
  fileName: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.TEXT
  },
  imageSrc: {
    type: Sequelize.STRING
  },
  videoUrl: {
    type: Sequelize.STRING
  },
  videoThumbnail: {
    type: Sequelize.STRING
  }
}, {
  getterMethods: {
    thumbnail: function () {
      if (this.getDataValue('type') === 'picture') {
        if (this.getDataValue('imageSrc')) {
          return (this.getDataValue('imageSrc').slice(0, -4) + "mini.jpg").slice(9);
        } else {
          return this.getDataValue('imageSrc')
        }
      } else {
        return this.getDataValue('imageSrc')
      }
    }
  },
  hooks: {
    beforeDestroy: (altView) => {
      console.log(altView);
      if (altView.dataValues.type === 'Picture') {
        fs.unlinkSync('./' + altView.dataValues.imageSrc);
        fs.unlinkSync('./' + altView.dataValues.imageSrc.slice(0, -4) + "mini.jpg");
      }
    }
  }
});