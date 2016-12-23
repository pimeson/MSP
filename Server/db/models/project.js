'use strict'

const Sequelize = require('sequelize');
const fs = require('fs');
const db = require('../_db');
const Promise = require('bluebird');

const Project = db.define('project', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
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
  }
}, {
  hooks: {
    beforeCreate: (project) => {
      //console.log(project);
      return Project.findAndCountAll({})
      .then(foundAndCounted => {
        console.log(foundAndCounted.count);
        return project.setDataValue('order', foundAndCounted.count + 1)
      });
    },
    beforeDestroy: (project) => {
        let path = project.dirPath;
        if (fs.existsSync(path)) {
          fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
            } else { // delete file
              fs.unlinkSync(curPath);
            }
          });
          fs.rmdirSync(path);
        }
        return Project.findAll({
          where: {
            order: {
              $gt: project.order
            }
          }
        })
        .then(reordering => {
          let updatingProjects = reordering.map( project => {
            project.order--;
            return project.save();
          })
          return Promise.all(updatingProjects);
        })
      }
    }
});

module.exports = Project;