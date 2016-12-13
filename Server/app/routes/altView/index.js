const router = require('express').Router();
const AltView = require('../../../db/models/altView');
const Exhibit = require('../../../db/models/exhibit');
const rp = require('request-promise');
const sharp = require('sharp');
const fs = require('fs');
const adminTest = require('../../configure/authorization').adminTest;

module.exports = router;

const adminPriv =  function (req, res, next) {
    if (!adminTest(req)) {
        res.sendStatus(401);
    } else {
        next();
    }
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

router.post('/', adminPriv, multer({
  storage: storage
}).single('file'), function (req, res, next) {
  let timeStamp = Date.now();
  let newPath = './public/uploads/' + req.body.dirName + '/' + timeStamp + req.file.originalname;
  AltView.create({
      title: req.body.title,
      type: req.body.type,
      fileName: req.file.originalname,
      description: req.body.description,
      imageSrc: newPath,
      exhibitId: req.body.exhibitId,
      projectId: req.body.projectId
    })
    .then(creatingAltView => {
      let renaming = fs.rename(req.file.path, newPath, () => console.log('done!'));
      const transformer = sharp().resize(500, 500).max()
      let resizing = fs.createReadStream(newPath).pipe(transformer).toFile(newPath.slice(0, -4) + 'mini.jpg');
      return Promise.all([renaming, resizing])
    })
    .then(makingThumbnailAndRenaming => res.sendStatus(200))
    .catch(next);

  // console.log(req.body); //form fields
  // console.log(req.file.path); //form files
  // res.status(204).end();
})

router.post('/video', adminPriv, function (req, res, next) {
  let options = {
    uri: 'http://vimeo.com/api/v2/video/' + req.body.videoUrl.slice(req.body.videoUrl.lastIndexOf('/') + 1) + '.json',
    json: true
  }
  rp(options)
    .then(gettingVidInfo => {
      AltView.create({
          title: req.body.title,
          type: req.body.type,
          description: req.body.description,
          videoUrl: req.body.videoUrl,
          imageSrc: gettingVidInfo[0].thumbnail_large,
          exhibitId: req.body.exhibitId,
          projectId: req.body.projectId
        })
        .then(makingDbRow => {
          res.sendStatus(204);
        })
    })
    .catch(next);

})

router.get('/', function (req, res, next) {
  AltView.findAll({})
    .then(findingAltViews => res.send(findingAltViews))
    .catch(next);
})

router.delete('/:id', adminPriv, function (req, res, next) {
  AltView.destroy({
      where: {
        id: req.params.id
      },
      individualHooks: true
    })
    .then(deletingAltView => res.sendStatus(204))
    .catch(next);
})

router.get('/exhibit/:id', function (req, res, next) {
  AltView.findAll({
      where: {
        exhibitId: req.params.exhibitId
      }
    })
    .then(findingAltViews => res.send(findingAltViews))
    .catch(next);
})

router.get('/:id', function (req, res, next) {
  AltView.findById(req.params.id)
    .then(findingAltView => res.send(findingAltView))
    .catch(next);
})