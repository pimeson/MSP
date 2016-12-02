'use strict'
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

module.exports = (app) => {
  app.use(cookieParser());

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true}));
}