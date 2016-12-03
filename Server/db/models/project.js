const Sequelize = require('sequelize');
const fs = require('fs');
const db = require('../_db');

module.exports = db.define('project', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  dirName: {
    type: Sequelize.TEXT
  },
  dirPath: {
    type: Sequelize.TEXT
  }
}, {
  hooks: {
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
      }
    }
});