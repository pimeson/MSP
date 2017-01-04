app.controller('NavbarCtrl', function ($scope, $rootScope, $state, $window) {


  $scope.isLandscape = function () {
    return $(window).width() >= $(window).height();
  }

  $scope.state = $rootScope.$state;

  console.log($scope.state)

  $scope.goBack = $rootScope.goBack;

  $scope.currWidth = $(window).width();

  $scope.back = false;

  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
    if (toState.name === 'home' || toState.name === 'gallery' || toState.name === 'details') {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      document.body.scrollLeft = document.documentElement.scrollLeft = 0;
    }
    if (toState.name === 'about') {
      $scope.back = true;
    } else {
      $scope.back = false;
    }
    $scope.$evalAsync();
  })

  $(window).on('resize', _.debounce(() => $scope.$evalAsync(), 250));


});