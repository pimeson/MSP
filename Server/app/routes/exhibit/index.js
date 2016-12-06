'use strict';
const Exhibit = require('../../../db/models/exhibit');
const router = require('express').Router();
const fs = require('fs');
const sharp = require('sharp')
const AltView = require('../../../db/models/altView');
const bluebird = require('bluebird');

module.exports = router;

const streamToPromise = stream => {
  return new Promise(function (resolve, reject) {
    stream.on("end", resolve);
    stream.on("error", reject);
  });
}

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/')
  },
  filename: (req, file, cb) => {
    console.log(file);
    let datetimestamp = Date.now();
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
})

router.post('/', multer({
  storage: storage
}).single('file'), function (req, res, next) {
  
  Exhibit.create({
    title: req.body.title,
    fileName: req.file.originalname,
    description: req.body.description,
    imageSrc: './public/uploads/' + req.body.dirName + '/' + req.file.originalname,
    specs: req.body.specs,
    projectId: req.body.projId
  })
  .then(creatingExhibit => {

  let renaming = fs.rename(req.file.path, './public/uploads/' + req.body.dirName + '/' + req.file.originalname, () => console.log('done!'));

  let newPath = './public/uploads/' + req.body.dirName + '/' + req.file.originalname

  const transformer = sharp().resize(2000).max()

  let resizing = fs.createReadStream(newPath).pipe(transformer).toFile('./public/uploads/' + req.body.dirName + '/' + req.file.originalname.slice(0, -4) + 'mini.jpg');

  return Promise.all([renaming, resizing])

  })
  .then(() => res.sendStatus(204))
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

router.get('/:id/withAltViews', function (req, res, next) {
  Exhibit.findAll(

      {
        include: [AltView],
        where: {
          id: req.params.id
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

router.delete('/:id', function (req, res, next) {
  // Exhibit.findById(req.params.id)
  // .then(findingExhibit => {
  //   fs.unlinkSync('./' + findingExhibit.imageSrc);
  //   return;
  // })
  // .then(deletingExhibitFile => {
  Exhibit.destroy({
      where: {
        id: req.params.id
      },
      individualHooks: true
    })
    .then(deletingExhibit => res.sendStatus(204))
    .catch(next);
})

router.put('/:id', function (req, res, next) {
  Exhibit.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    .then(updating => res.sendStatus(200))
    .catch(next)
})