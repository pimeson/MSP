module.exports = function (app) {
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
      $('body').css({
        overflow: '',
        position: '',
        top: ''
      })
      console.log(toState, fromState);
      if (toState.name === 'home' || toState.name === 'gallery' || toState.name === 'details' || toState.name === 'about') {
        console.log(fromState.name, fromState.name !== 'details')
        if (fromState.name !== 'details' && fromState.name !== 'about') {
          console.log("Triggering")
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          document.body.scrollLeft = document.documentElement.scrollLeft = 0;
        } else {
          document.body.scrollTop = document.documentElement.scrollTop = $rootScope.scrollY
          document.body.scrollLeft = document.documentElement.scrollLeft = $rootScope.scrollX
        }
      }
      if (toState.name === 'about') {
        $scope.back = true;
      } else {
        $scope.back = false;
      }
      $scope.$evalAsync();
    })

    $(window).on('resize', _.debounce(() => {
      console.log('resized!')
      $scope.$evalAsync();
    }, 250));


  })
}