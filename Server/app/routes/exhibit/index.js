'use strict';
const Exhibit = require('../../../db/models/exhibit');
const Project = require('../../../db/models/project');
const router = require('express').Router();
const fs = require('fs');
const sharp = require('sharp')
const AltView = require('../../../db/models/altView');
const bluebird = require('bluebird');
const sizeOf = require('image-size');
const _ = require('lodash');
const rp = require('request-promise');
const Vimeo = require('vimeo').Vimeo;
const adminTest = require('../../configure/authorization').adminTest;
const promiseStat = bluebird.promisify(fs.stat);
require('dotenv').config()

const adminPriv = function (req, res, next) {
  if (!adminTest(req)) {
    res.sendStatus(401);
  } else {
    next();
  }
}

//Need to hide api keys in env config file;
const lib = new Vimeo(process.env.VIMEO_ID, process.env.VIMEO_CLIENT, process.env.VIMEO_ACCESS_TOKEN);

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
  let timeStamp = Date.now();
  let newPath = './public/uploads/' + req.body.dirName + '/' + timeStamp + '-' + req.file.originalname
  let miniPath = newPath.slice(0, -4) + 'mini.jpg'
  const transformer = sharp().resize(2000).max()

  fs.renameSync(req.file.path, newPath, () => console.log('done!'));
  fs.createReadStream(newPath).pipe(transformer).toFile(miniPath)
    .then(() => {
      let sizing = sizeOf(miniPath);
      let fileSize = promiseStat(newPath);
      return Promise.all([sizing, fileSize]);
    })
    .then(measuring => {
      let exBody = {
        title: req.body.title,
        type: 'Picture',
        fileName: req.file.originalname,
        description: req.body.description,
        imageSrc: newPath,
        specs: req.body.specs,
        projectId: req.body.projId,
        width: measuring[0].width,
        height: measuring[0].height,
        fileSize: measuring[1].size
      }
      return Exhibit.create(exBody);
    })
    .then((creatingExhibit) => res.sendStatus(204))
    .catch(next);
})

router.post('/video', function (req, res, next) {

  let vidId = req.body.videoUrl.slice(req.body.videoUrl.lastIndexOf('/') + 1)
  console.log(vidId);

  let libAsync = (id) => {
    return new Promise((resolve, reject) => {
      lib.request({
        method: 'GET',
        path: '/videos/' + id + '/pictures'
      }, function (error, body, status_code, headers) {
        if (error) {
          console.log('error');
          reject();
        } else {
          console.log('body');
          resolve(body.data[0].uri.slice(body.data[0].uri.lastIndexOf('/') + 1));
        }
      })
    })
  }



  libAsync(vidId)
    .then(gettingVidInfo => {
      Exhibit.create({
        title: req.body.title,
        type: req.body.type,
        description: req.body.description,
        videoUrl: req.body.videoUrl,
        imageSrc: 'https://i.vimeocdn.com/video/' + gettingVidInfo + '_1920x1080.jpg',
        width: 1920,
        height: 1080,
        projectId: req.body.projectId
      })
    })
    .then(makingDbRow => {
      res.sendStatus(204);
    })
    .catch(next);
})

router.get('/', function (req, res, next) {
  Exhibit.findAll({
    include: [Project]
  })
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

router.get('/project', function (req, res, next) {
  const projectTitle = req.query.title
  console.log({ projectTitle })

  Exhibit.findAll({
    include: [{
      model: Project,
      where: {
        title: projectTitle
      }
    }],
  })
    .then(findingExhibits => {
      console.log({ findingExhibits })
      return res.send(findingExhibits)
    })
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

router.delete('/:id', adminPriv, function (req, res, next) {
  Exhibit.destroy({
    where: {
      id: req.params.id
    },
    individualHooks: true
  })
    .then(deletingExhibit => res.sendStatus(204))
    .catch(next);
})

router.put('/:id', adminPriv, function (req, res, next) {
  Exhibit.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(updating => res.sendStatus(200))
    .catch(next)
})

router.put('/order/:projectId/:id/:posOne/:posTwo', adminPriv, function (req, res, next) {
  console.log(req.params);
  Exhibit.update({
    order: req.params.posTwo
  }, {
    where: {
      id: req.params.id
    }
  })
    .then(findingExhibit => {
      console.log(req.params.projectId);
      return Exhibit.findAll({
        where: {
          projectId: req.params.projectId,
          id: {
            $ne: req.params.id
          }
        }
      })
    })
    .then(findingExhibits => {
      let reorderingExhibits = findingExhibits.map(foundExhibit => {
        if (req.params.posOne < foundExhibit.order) {
          if (foundExhibit.order <= req.params.posTwo) {
            foundExhibit.order--;
          }
          return foundExhibit.save();
        } else {
          if (foundExhibit.order >= req.params.posTwo) {
            foundExhibit.order++;
          }
          return foundExhibit.save();
        }
      })
    })
    .then(reorderingExhibits => res.sendStatus(201))
    .catch(err => {
      console.log(err);
    })


})