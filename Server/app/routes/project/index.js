'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
const Project = require('../../../db/models/project');
const Exhibit = require('../../../db/models/exhibit');
module.exports = router;
const _ = require('lodash');
const fs = require('fs');

router.post('/', function (req, res, next) {
  Project.create(req.body)
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

router.delete('/:id', function (req, res, next) {
  Exhibit.findAll({
      where: {
        projectId: req.params.id
      }
    })
    .then(findingExhibits => {
      findingExhibits.forEach(exhibit => {
        fs.unlinkSync('./' + exhibit.imageSrc);
      })
    })
    .then(deletingExhibitFiles => {
      Exhibit.destroy({
        where: {
          projectId: req.params.id
        }
      })
    })
    .then(deletingExhibits => {
      Project.destroy({
        where: {
          id: req.params.id
        }
      })
    })
    .then( deletingProject => res.sendStatus(204))
    .catch(next);

})


router.put('/:id', function (req, res, next) {
  Project.update(
    req.body,
    {
    where: {
      id : req.params.id
    }
  })
  .then(updatingProjects => res.sendStatus(201))
  .catch(next);
})
