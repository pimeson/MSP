'use strict';
const Exhibit = require('../../../db/models/exhibit');
const router = require('express').Router();

module.exports = router;

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/')
  },
  filename: (req, file, cb) => {
    console.log(file);
    let datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
  }
})

router.post('/',multer({storage: storage}).single('file'),  function (req, res, next) {
  Exhibit.create({title: req.body.title, fileName: req.file.originalname, description: req.body.description, imageSrc: req.file.path, projectId: req.body.projId})
    .then(createdExhibit => res.sendStatus(200))
    .catch(next);

  // console.log(req.body); //form fields
	// console.log(req.file.path); //form files
	// res.status(204).end();
})

router.get('/', function (req, res, next) {
  Exhibit.findAll({})
    .then(findingExhibits => res.send(findingExhibits))
    .catch(next);
})

router.get('/project/:id', function (req, res, next) {
  Exhibit.findAll({
      where: {
        projectId: req.params.id
      }
    })
    .then(findingExhibits => res.send(findingExhibits))
    .catch(next);
})

router.get('/:id', function (req, res, next) {
  Exhibit.findById(req.params.id)
    .then(findingExhibit => res.send(findingExhibit))
    .catch(next);
})

router.put('/:id', function(req, res, next) {
  Exhibit.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(updating => res.sendStatus(200))
  .catch(next)
})