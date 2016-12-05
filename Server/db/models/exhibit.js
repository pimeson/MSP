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
  }
  ,
  order: {
    type: Sequelize.INTEGER,
  }
}, {
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