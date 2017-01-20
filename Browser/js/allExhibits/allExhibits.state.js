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

  $scope.isLandscape = function () {
    return $(window).width() >= $(window).height();
  }

  let chunkedExhibits = _.chunk(_.shuffle(exhibits), 15);

    $scope.allExhibits = chunkedExhibits.shift();

    $scope.loadMore = _.debounce(() => {
      if (chunkedExhibits.length) {
        $scope.allExhibits = [...$scope.allExhibits, ...chunkedExhibits.shift()];
      }
      $scope.$evalAsync();
    }, 250);


});



}
