'use strict';
const chalk = require('chalk');
const db = require('./db');

const server = require('http').createServer();

const createApplication = () => {
  const app = require('./app')(db);
  server.on('request', app);
}

const startServer = function () {

  const PORT = process.env.PORT || 1337;

  server.listen(PORT, () => {
    console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
  });

}

db.sync({force: true})
.then(createApplication)
.then(startServer)
.catch((err) => {
  console.log(chalk.red(err.stack));
})