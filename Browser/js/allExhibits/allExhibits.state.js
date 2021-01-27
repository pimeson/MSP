module.exports = function (app) {

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

  app.controller('allExCtrl', function (exhibits, $scope, $state) {

    $scope.isLandscape = function () {
      return $(window).width() >= $(window).height();
    }

    let chunkedExhibits = $scope.isLandscape() ? _.chunk(_.shuffle(exhibits.filter(exhibit => exhibit.project.display)), 21) : _.chunk(_.shuffle(exhibits.filter(exhibit => exhibit.project.display)), 12);

    $scope.allExhibits = chunkedExhibits.shift();

    $scope.loadMore = _.debounce(() => {
      if (chunkedExhibits.length) {
        $scope.allExhibits = [...$scope.allExhibits, ...chunkedExhibits.shift()];
      }
      $scope.$evalAsync();
    }, 250);

    $scope.goToExhibit = (project, exhibit) => {
      if (exhibit.type === 'Picture') {
        $state.go('details', { projTitle: project.title.replaceAll(" ", "_"), projId: project.id, exhibitId: exhibit.id })
      } else if (exhibit.type === 'Video') {
        $state.go('gallery', { projId: project.id })
      }
    }


  });

}