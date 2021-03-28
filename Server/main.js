'use strict';
const chalk = require('chalk');
const db = require('./db');
const fs = require("fs");
require('dotenv').config()

const isProd = process.env.ENV !== "DEV"

let options
let server
if (isProd) {
  options = {
    key: fs.readFileSync(process.env.SSL_KEYPATH),
    cert: fs.readFileSync(process.env.SSL_CERTPATH)
  };
  server = require('https').createServer(options);
} else {
  server = require('http').createServer();
}

const createApplication = () => {
  const app = require('./app')(db);

  // if (isProd) {
  //   const helmet = require("helmet");
  //   app.use(helmet())
  // }

  server.on('request', app);
}

const startServer = function () {

  const PORT = process.env.PORT || 1337;

  server.listen(PORT, () => {
    console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
  });

}
//codeship test
db.sync()
  .then(createApplication)
  .then(startServer)
  .catch((err) => {
    console.log(chalk.red(err.stack));
  })