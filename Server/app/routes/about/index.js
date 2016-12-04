const Express = require('express');
const router = Express.Router();
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
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
})

router.post('/aboutHtml', multer({
  storage: storage
}).single('file'), function (req, res, next) {
  fs.unlinkSync('./public/about/about.html')
  fs.renameSync(req.file.path, './public/about/about.html');
  res.sendStatus(204);
})

router.post('/aboutPortrait', multer({
  storage: storage
}).single('file'), function (req, res, next) {
  fs.unlinkSync('./public/about/portrait/portrait.jpg')
  fs.renameSync(req.file.path, './public/about/portrait/portrait.jpg');
  res.sendStatus(204);
})
  
