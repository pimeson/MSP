module.exports = function(app) {
  require('./home.controller.js')(app);
  require('./home.state.js')(app);
}