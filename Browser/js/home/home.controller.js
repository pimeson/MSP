app.controller('homeCtrl', function ($scope, $state, $rootScope, allProjects) {

  allProjects.map(project => {
    project.num = 0;
    return project;
  })
  
  $scope.allProjects = allProjects;

  $rootScope.$state = $state;

  $scope.incrementer = (num, maxNum) => {
    if (typeof (num.count) !== 'number') num.count = 0;
    num.count++;
    if (num.count > 50) {
      num.count = 0;
      if (num.num < maxNum) {
        num.num += 1;
      } else {
        num.num = 0;
      }
      $scope.$evalAsync();
    }
  };

  let loaded = false;
  console.log($state.$current.name);

})