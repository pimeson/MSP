app.config($stateProvider => {

  $stateProvider.state('exhibitManagement', {
    url: '/admin/exhibitManagement/:projId/:id',
    templateUrl: '/js/admin/exhibitManagement/exhibitManagement.html',
    controller: 'exhibitManagementCtrl',
    resolve: {
      exhibit: function($stateParams,exhibitFactory){
        return exhibitFactory.findById($stateParams.id)
      }
    }
  })

})

app.controller('exhibitManagementCtrl', function($state, $scope, exhibit, $stateParams){

  $scope.exTitle = exhibit.title;
  $scope.exDesc = exhibit.description;
  $scope.projId = $stateParams.projId;

})