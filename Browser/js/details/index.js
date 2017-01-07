module.exports = function(app) {
  require('./details.controller.js')(app);
  require('./details.state.js')(app);
}