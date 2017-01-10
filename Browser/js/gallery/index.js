module.exports = function(app) {
  require('./gallery.controller.js')(app);
  require('./gallery.state.js')(app);
}