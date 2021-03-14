module.exports = function (app) {
  require('./altView.factory.js')(app);
  require('./exhibit.factory.js')(app);
  require('./file.factory.js')(app);
  require('./project.factory.js')(app);
  require('./link.factory.js')(app);
}