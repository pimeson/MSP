const router = require('express').Router();
const AltView = require('../../../db/models/altView');
const Exhibit = require('../../../db/models/exhibit');
const fs = require('fs');

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
  AltView.create({title: req.body.title, type: req.body.type, fileName: req.file.originalname, description: req.body.description, imageSrc: req.file.path, exhibitId: req.body.exhibitId, projectId: req.body.projectId})
    .then(createdAltView => res.sendStatus(200))
    .catch(next);

  // console.log(req.body); //form fields
	// console.log(req.file.path); //form files
	// res.status(204).end();
})

router.get('/', function (req, res, next) {
  AltView.findAll({})
    .then(findingAltViews => res.send(findingAltViews))
    .catch(next);
})

router.delete('/:id', function (req, res, next) {
  AltView.destroy({
      where:{id: req.params.id}
  })
  .then(deletingExhibit => res.sendStatus(204))
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
    .then(findingaltView => res.send(findingaltView))
    .catch(next);
})

