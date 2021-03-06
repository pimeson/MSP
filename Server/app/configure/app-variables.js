'use strict';
const path = require('path');
const chalk = require('chalk');
const util = require('util');

const rootPath = path.join(__dirname, '../../../');
const indexPath = path.join(rootPath, './Server/app/views/index.html');

const env = require(path.join(rootPath, './Server/env'));

const logMiddleware = (req, res, next) => {
  util.log(('---NEW REQUEST---'));
  console.log(util.format(chalk.red('%s: %s %s'), 'REQUEST ', req.method, req.path));
  console.log(util.format(chalk.yellow('%s: %s'), 'QUERY   ', util.inspect(req.query)));
  console.log(util.format(chalk.cyan('%s: %s'), 'BODY    ', util.inspect(req.body)));
  next();
}

module.exports = (app) => {
    app.setValue('env', env);
    app.setValue('projectRoot', rootPath);
    app.setValue('indexHTMLPath', indexPath);
    app.setValue('log', logMiddleware);
};