app.controller('homeCtrl', function ($scope, $state, $rootScope, allProjects) {

  allProjects
    .sort((x, y) => x.order > y.order ? 1 : -1)
    .map(project => {
      project.exhibits.sort((a, b) => a.order > b.order ? 1 : -1);

      project.num = 0;
      return project;
    })

  console.log(allProjects);

  $scope.allProjects = allProjects;

  $rootScope.$state = $state;

  const incrementer = (num, maxNum) => {
      if (num.num < maxNum) {
        num.num += 1;
      } else {
        num.num = 0;
      }
    $scope.$evalAsync();
  };

  $scope.incrementer = _.debounce(incrementer, 100);

  let loaded = false;
  console.log($state.$current.name);

})