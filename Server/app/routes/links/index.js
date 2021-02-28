'use strict';
const router = require('express').Router(); // eslint-disable-line new-cap
const Links = require('../../../db/models/links');
const fs = require('fs');
const adminTest = require('../../configure/authorization').adminTest;

const adminPriv = function (req, res, next) {
    if (!adminTest(req)) {
        res.sendStatus(401).end();
    } else {
        next();
    }
}

router.post('/', function (req, res, next) {
    let timeStamp = Date.now();
    // let dirName = timeStamp
    //let pdfPath = './public/pdfs/'

    //req.body.dirName = dirName;

    let links = Links.create(req.body)

    links.then(() => res.sendStatus(204))
})

module.exports = router;

