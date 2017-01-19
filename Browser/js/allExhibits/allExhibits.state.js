module.exports = function(app) {
app.config($stateProvider => {
  $stateProvider.state('allExhibits', {
    url: '/all',
    templateUrl: '/js/allExhibits/allExhibits.html',
    controller: 'allExCtrl',
    resolve: {
      exhibits: function ($stateParams, exhibitFactory) {
        return exhibitFactory.findAll();
      }
    }
  })
})

app.controller('allExCtrl', function(exhibits, $scope){

  $scope.exhibits = exhibits;

});



}
