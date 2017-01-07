module.exports = function(app) {
  require('./navbar.controller.js')(app);
  require('./navbar.directive.js')(app);
}