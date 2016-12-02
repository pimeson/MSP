'use strict'
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

module.exports = (db) => {

  require('./configure')(app, db);

  app.use(cors());

  app.use('/api', require('./routes'));

  app.use((req, res, next) => {

    let err;

    // res.header('Access-Control-Allow-Origin: *');
    // res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    // res.header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

    if (path.extname(req.path).length > 0) {
      err = new Error('Not found.')
      err.status = 404;
      next(err);
    } else {
      next();
    }

  });

  app.get('/*', (req, res) => {
    res.sendFile(app.get('indexHTMLPath'));
  });

  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  })

  return app

}