'use strict'

const Sequelize = require('sequelize');
const fs = require('fs');
const AltView = require('./altView');
const db = require('../_db');

 const Exhibit = db.define('exhibit', {
  title: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.ENUM('Picture', 'Video')
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
  },
  specs: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: []
  },
  order: {
    type: Sequelize.INTEGER,
  }
}, {
  getterMethods: {
    thumbnail: function(){
      if(this.getDataValue('imageSrc')){
        return (this.getDataValue('imageSrc').slice(0,-4)+"mini.jpg").slice(9);
      } else {
        return this.getDataValue('imageSrc')
      }
    }
  },
  hooks: {
    beforeCreate: (exhibit) => {
      return Exhibit.findAndCountAll({
        where: {
          projectId: exhibit.projectId
        }
      })
      .then(foundAndCounted => {
        return exhibit.setDataValue('order', foundAndCounted.count + 1)
      })
    },
    beforeDestroy: (exhibit) => {
      console.log("cascading?")
      fs.unlinkSync('./'+exhibit.dataValues.imageSrc);
      fs.unlinkSync('./'+exhibit.dataValues.imageSrc.slice(0,-4)+"mini.jpg");
      let destroyingAlts = AltView.destroy(
        {
          where: {exhibitId: exhibit.id},
          individualHooks: true
        }
      )
      let findingExhibits = Exhibit.findAll({
          where: {
            projectId: exhibit.projectId,
            order: {
              $gt: exhibit.order
            }
          }
        })
        Promise.all([findingExhibits, destroyingAlts])
        .then(reordering => {
          let updatingExhibits = reordering[0].map( exhibits => {
            exhibits.order--
            return exhibits.save();
          })
          return Promise.all(updatingExhibits);
        })
    }
  }
});

module.exports = Exhibit