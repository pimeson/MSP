'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
const Project = require('../../../db/models/project');
const Exhibit = require('../../../db/models/exhibit');
module.exports = router;
const _ = require('lodash');
const fs = require('fs');
const adminTest = require('../../configure/authorization').adminTest;

const adminPriv =  function (req, res, next) {
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
  Project.findAll({})
    .then(findingProjects => res.send(findingProjects))
    .catch(next);
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
  if(req.body.description){
    req.body.description = req.body.description.split('\n');
  } else {
    req.body.description = [];
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