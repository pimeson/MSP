const Express = require('express');
const router = Express.Router();
const Download = require('../../../db/models/download');
const bluebird = require('bluebird');
const fs = require('fs');
const sharp = require('sharp');
const adminTest = require('../../configure/authorization').adminTest;
const multer = require('multer');

module.exports = router;


const adminPriv = function (req, res, next) {
  if (!adminTest(req)) {
    res.sendStatus(401);
  } else {
    next();
  }
}

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

router.post('/aboutHtml', multer({
  storage: storage
}).single('file'), function (req, res, next) {
  try {
    fs.unlinkSync('./public/about/about.html')
  } catch (error) {
    console.log('no file found');
  }
  fs.renameSync(req.file.path, './public/about/about.html');
  res.sendStatus(204);
})

router.post('/upload', multer({
  storage: storage
}).single('file'), function (req, res, next) {
  Download.create({ title: req.body.title, fileName: req.file.originalname, filePath: req.file.path })
    .then(creatingDownload => {
      res.sendStatus(204);
    })
    .catch(next);
})

router.get('/downloads', function (req, res, next) {
  Download.findAll()
    .then(findingDownloads => res.send(findingDownloads))
    .catch(next);
})

router.delete('/downloads/:id', function (req, res, next) {
  Download.destroy({
    where: {
      id: req.params.id
    },
    individualHooks: true
  })
    .then(deletingDownload => {
      res.sendStatus(204);
    })
    .catch(next)
})

router.post('/aboutPortrait', multer({
  storage: storage
}).single('file'), function (req, res, next) {
  const transformer = sharp().resize(2000).max()
  let unlinkAsync = bluebird.promisify(fs.unlink);
  unlinkAsync('./public/about/portrait/portrait.jpg')
    .then(deletingPortrait => {
      return fs.createReadStream(req.file.path).pipe(transformer).toFile('./public/about/portrait/portrait.jpg')
    })
    .then(updatingPortrait => res.sendStatus(204));
})