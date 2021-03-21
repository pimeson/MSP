'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
const Links = require('../../../db/models/links');
const fs = require('fs');
const adminTest = require('../../configure/authorization').adminTest;
const multer = require('multer');

const adminPriv = function (req, res, next) {
    if (!adminTest(req)) {
        res.sendStatus(401).end();
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

router.post('/',
    multer({
        storage: storage
    }).single('file'), (req, res, next) => {
        req.body.dirPath = req.file.path
        Links.create(req.body)
            .then(() => res.sendStatus(204))
            .catch(next)
    })

router.get('/', (req, res, next) => {
    Links.findAll({
        order: [
            ['date', 'ASC']
        ]
    }).then(links => res.send(links)).catch(next)
})

router.put('/:id/visibility', (req, res, next) => {
    const id = req.params.id

    if (!id || isNaN(id)) {
        res.sendStatus(400)

        return
    }

    Links.update({
        display: req.body.isVisible
    },
        {
            where: {
                id
            }
        }).then(() => res.sendStatus(204)).catch(next)
})

router.delete('/', (req, res, next) => {
    const id = req.query.id && +req.query.id

    if (!id || isNaN(id)) {
        res.sendStatus(400)

        return
    }

    Links.destroy({
        where: {
            id
        }
    }).then((destroyed) => {
        if (destroyed === 0) {
            res.sendStatus(204)
        } else {
            res.send({
                destroyed: [id]
            })
        }
    }).catch(next)
})

module.exports = router;

