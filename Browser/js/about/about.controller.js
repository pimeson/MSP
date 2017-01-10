module.exports = function(app) {

app.controller('AboutCtrl', function($scope, downloads){

  $scope.downloads = downloads;

})

};