module.exports = function (app) {
  app.controller('NavbarCtrl', function ($scope, $rootScope, $state, $window) {


    function isLandscape () {
      return $(window).width() >= $(window).height();
    }

    $scope.isLandscape = isLandscape;

    $scope.state = $rootScope.$state;

    console.log($scope.state)

    $scope.goBack = $rootScope.goBack;

    $scope.currWidth = $(window).width();

    $scope.back = false;

    $(window).on('resize', _.debounce(() => {
      //Need to check if mobile
      console.log('resized!')
      if(isLandscape()){
        $state.reload();
      }
    }, 250));

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
      if (fromState.name === 'home') {
        $rootScope.currHomePosX = document.body.scrollLeft + $(window).width();
        $rootScope.currHomePosY = document.body.scrollTop;
      }
      if (fromState.name === 'gallery') {
        $rootScope.currGalPosX = document.body.scrollLeft + $(window).width();
        $rootScope.currGalPosY = document.body.scrollTop;
      }
    })

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams, options) {
      $('body').css({
        overflow: '',
        position: '',
        top: ''
      })
      console.log(toState, fromState);
      if ((toState.name === 'gallery' && fromState.name === 'home') || (toState.name === 'details' && fromState.name === 'gallery')) {
        //console.log(fromState.name, fromState.name !== 'details')
        // if (fromState.name !== 'details' && fromState.name !== 'about') {
        //   console.log("Triggering")
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        document.body.scrollLeft = document.documentElement.scrollLeft = 0;
        // } else {
        //   document.body.scrollTop = document.documentElement.scrollTop = $rootScope.scrollY
        //   document.body.scrollLeft = document.documentElement.scrollLeft = $rootScope.scrollX
        // }
      } else if ((fromState.name === 'details' && toState.name === 'gallery') || (fromState.name === 'about' && toState.name === 'gallery')) {
        console.log('kewl', $rootScope.currGalPosY, $rootScope.currGalPosX)
        document.body.scrollTop = document.documentElement.scrollTop =  $rootScope.currGalPosY;
        document.body.scrollLeft = document.documentElement.scrollLeft =  $rootScope.currGalPosX;
      }
      else if ((fromState.name === 'gallery' && toState.name === 'home') || (fromState.name === 'about' && toState.name === 'home')  || (fromState.name === 'details' && toState.name === 'home')) {
         console.log('kewl', $rootScope.currHomePosY, $rootScope.currHomePosX)
        document.body.scrollTop = document.documentElement.scrollTop =  $rootScope.currHomePosY;
        document.body.scrollLeft = document.documentElement.scrollLeft =  $rootScope.currHomePosX;
      }
      
      if (toState.name === 'about') {
        $scope.back = true;
      } else {
        $scope.back = false;
      }
      $scope.$evalAsync();
    })




  })
}