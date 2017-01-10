module.exports = function(app) {
  require('./about.controller.js')(app);
  require('./about.state.js')(app);
}