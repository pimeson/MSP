'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
const Links = require('../../../db/models/links');
const fs = require('fs');
const adminTest = require('../../configure/authorization').adminTest;
const multer = require('multer');
const sequelize = require('sequelize');
const e = require('express');

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
        console.log(req.body)
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

router.put('/:id/order', (req, res, next) => {
    const id = req.params.id
    const body = req.body
    const newPos = req.body.newPos
    const currPos = req.body.currPos

    if (!id || isNaN(id)) {
        res.sendStatus(400)

        return
    }

    if (newPos === currPos) {
        res.send(204)

        return
    }

    if (currPos > newPos) {
        Links.findAll({
            where: {
                order: {
                    lt: currPos,
                    gte: newPos
                }
            }
        }).then(foundLinks => {
            const updatingLinks = foundLinks.map(l => {
                l.order++
                return l.save()
            })
            return Promise.all(updatingLinks)
        }).then(() => {
            Links.update({
                order: newPos
            },
                {
                    where: {
                        id
                    }
                })
        }).then(() => res.sendStatus(204)).catch(next)
    } else {
        Links.findAll({
            where: {
                order: {
                    gt: currPos,
                    lte: newPos
                }
            }
        }).then(foundLinks => {
            const updatingLinks = foundLinks.map(l => {
                l.order--
                return l.save()
            })
            return Promise.all(updatingLinks)
        }).then(() => {
            Links.update({
                order: newPos
            },
                {
                    where: {
                        id
                    }
                })
        }).then(() => res.sendStatus(204)).catch(next)
    }


})

module.exports = router;
