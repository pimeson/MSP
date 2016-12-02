'use strict';
module.exports = (app, db) => {

  app.setValue = app.set.bind(app);

  app.getValue = (path) => app.get(path);

  require('./app-variables')(app);
  require('./static-middleware')(app);
  require('./parsing-middleware')(app);

  if (process.env.NODE_ENV !== 'testing') {
    app.use(app.getValue('log'));
  }

  require('./authentication')(app, db);
}