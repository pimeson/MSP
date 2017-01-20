module.exports = function(app) {
app.directive('navbar', ($rootScope, $state) => {
  



  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/navbar/navbar.html',
    controller: 'NavbarCtrl'
  }




})
};