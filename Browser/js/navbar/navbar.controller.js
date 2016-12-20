app.controller('NavbarCtrl', function ($scope, $rootScope, $state, $window) {

  $scope.state = $rootScope.$state;

  console.log($scope.state)

  $scope.goBack = $rootScope.goBack;

  $scope.currWidth = $(window).width();

  $scope.back = false;

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
    console.log(toState.name);
    if (toState.name === 'about') {
      $scope.back = true;
    } else {
      $scope.back = false;
    }
    $scope.$evalAsync();
  })


});