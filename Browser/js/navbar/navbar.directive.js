module.exports = function(app) {
app.directive('navbar', ($rootScope, $state, $mdSticky) => {
  



  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/navbar/navbar.html',
    link: (scope, element) => {

      $mdSticky(scope, element);

    },
    controller: 'NavbarCtrl'
  }




})
};