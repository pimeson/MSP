'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
const Links = require('../../../db/models/links');
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
    (req, res, next) => {
        Links.create(req.body)
            .then(() => res.sendStatus(204))
            .catch(next)
    })

router.post('/file',
    multer({
        storage: storage
    }).single('file'), (req, res, next) => {
        req.body.dirPath = req.file.path
        console.log(req.body)
        Links.create(req.body)
            .then(() => res.sendStatus(204))
            .catch(next)
    })

router.post('/:id/file',
    multer({
        storage: storage
    }).single('file'), (req, res, next) => {
        const id = req.params.id

        if (!id || isNaN(id)) {
            res.sendStatus(400)

            return
        }

        // TODO: Add delete after update

        Links.update({
            dirPath: req.file.path
        }, {
            where: {
                id
            }
        })
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

    Links.find({
        where: {
            id
        }
    }).then((found) => {
        return found.destroy().then(() =>
            Links.findAll({
                where: {
                    order: {
                        $gt: found.order
                    }
                }
            })
                .then(reordering => {
                    console.log({ reordering })
                    let updatingLinks = reordering.map(ul => {
                        ul.order--;
                        return ul.save();
                    })
                    return Promise.all(updatingLinks);
                })
        )
    }).then(destroyed => {
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

router.use(adminPriv)

module.exports = router;

