const Sequelize = require('sequelize');
const fs = require('fs');

const db = require('../_db');

 const Exhibit = db.define('exhibit', {
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
  },
  specs: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: []
  }
  ,
  order: {
    type: Sequelize.INTEGER,
  }
}, {
  getterMethods: {
    thumbnail: function(){
      if(this.getDataValue('imageSrc')){
        return this.getDataValue('imageSrc').slice(0,-4)+"mini.jpg"
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
      return Exhibit.findAll({
          where: {
            projectId: exhibit.projectId,
            order: {
              $gt: exhibit.order
            }
          }
        })
        .then(reordering => {
          let updatingExhibits = reordering.map( exhibits => {
            exhibits.order--;
            return exhibits.save();
          })
          return Promise.all(updatingExhibits);
        })
    }
  }
});

module.exports = Exhibit