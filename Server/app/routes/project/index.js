'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
const Project = require('../../../db/models/project');
const Exhibit = require('../../../db/models/exhibit');
const _ = require('lodash');
const fs = require('fs');
const { isEmpty } = require('lodash');
const adminTest = require('../../configure/authorization').adminTest;

const adminPriv = function (req, res, next) {
  if (!adminTest(req)) {
    res.sendStatus(401).end();
  } else {
    next();
  }
}

router.post('/', adminPriv, function (req, res, next) {
  let timeStamp = Date.now();
  let dirName = timeStamp
  let newDirPath = './public/uploads/' + dirName

  req.body.dirName = dirName;
  req.body.dirPath = newDirPath;
  try {
    req.body.description = req.body.description.split('\n');
  } catch (error) {
    req.body.description = [];
  }

  //Promises
  let makingDir = fs.mkdirSync(newDirPath)
  let makingProjEntry = Project.create(req.body)
  //

  Promise.all([makingDir, makingProjEntry])
    .then(createdProject => res.send('okay'))
    .catch(next);
})

router.get('/', function (req, res, next) {
  if (!isEmpty(req.query)) {
    const projectTitle = req.query.projectTitle
    console.log({ projectTitle })
    Project.find({
      where: {
        title: projectTitle
      }
    })
      .then(findingProject => res.send(findingProject))
      .catch(next)
  } else {
    Project.findAll({})
      .then(findingProjects => res.send(findingProjects))
      .catch(next);
  }
})

router.get('/withExhibits', function (req, res, next) {
  Project.findAll({
    include: [Exhibit]
  })
    .then(findingProjects => res.send(findingProjects))
    .catch(next);
})

router.get('/:id', function (req, res, next) {
  Project.findById(req.params.id)
    .then(findingProject => res.send(findingProject))
    .catch(next);
})

router.delete('/:id', adminPriv, function (req, res, next) {
  Project.destroy({
    where: {
      id: req.params.id
    },
    individualHooks: true
  })

    .then(deletingProject => res.sendStatus(204))
    .catch(next);

})


router.put('/:id', adminPriv, function (req, res, next) {
  if (typeof req.body.description === 'string') {
    req.body.description = req.body.description.split('\n');
  }
  Project.update(
    req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(updatingProjects => res.sendStatus(201))
    .catch(next);
})

router.put('/order/:projectId/:posOne/:posTwo', adminPriv, function (req, res, next) {
  console.log(req.params);
  Project.update({
    order: req.params.posTwo
  }, {
    where: {
      id: req.params.projectId
    }
  })
    .then(() => {
      return Project.findAll({
        where: {
          id: {
            $ne: req.params.projectId
          }
        }
      })
    })
    .then(findingProjects => {
      findingProjects.forEach(foundProject => {
        if (req.params.posOne < foundProject.order) {
          if (foundProject.order <= req.params.posTwo) {
            foundProject.order--;
          }
        } else {
          if (foundProject.order >= req.params.posTwo) {
            foundProject.order++;
          }
        }
        return foundProject.save();
      })
    })
    .then(() => res.sendStatus(201))
    .catch(err => {
      console.log(err);
    })

});

module.exports = router;
