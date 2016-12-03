'use strict';

const router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/project', require('./project'));
router.use('/exhibit', require('./exhibit'));
router.use('/upload', require('./upload'));
router.use('/altView', require('./altView'));

router.use( (req, res, next) => {
  let err = new Error('Not found.');
  err.status = 404;
  next(err);
})

