const Sequelize = require('sequelize');

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
  }
}, {
  hooks: {
    beforeDestroy: (altView) => {
      if(altView.type === 'picture'){
        fs.unlinkSync('./'+altView.dataValues.imageSrc);
      }
    }
  }
});