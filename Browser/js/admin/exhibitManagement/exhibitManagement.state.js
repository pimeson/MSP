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

app.controller('exhibitManagementCtrl', function($state, $scope, exhibit, exhibitFactory, $stateParams){

  $scope.exhibit = exhibit;
  $scope.projId = $stateParams.projId;

  $scope.exForm = {};

  $scope.deleteExhibit = () => {
    exhibitFactory.deleteById(exhibit.id)
    .then(success => $state.go('adminProject',{projectId: $stateParams.projId}));
  }

  $scope.editTitle = () => {
    $scope.$evalAsync();
    if($scope.exForm.exTitle){
      exhibitFactory.updateById(exhibit.id, {title: $scope.exForm.exTitle})
      .then(updatingTitle => {
        $scope.exhibit.title = $scope.exForm.exTitle;
        $scope.exForm.exTitle = "";
      })
    } else {
      alert('no empty fields!');
    }
  }

  $scope.editDesc = () => {
    $scope.$evalAsync();
    if($scope.exForm.exDesc){
      exhibitFactory.updateById(exhibit.id, {description: $scope.exForm.exDesc})
      .then(updatingDesc => {
        $scope.exhibit.description = $scope.exForm.exDesc;
        $scope.exForm.exDesc = "";
      })
    }
  }

  $scope.editSpecs = () => {
    $scope.$evalAsync();
    if($scope.exForm.exSpecs){
      exhibitFactory.updateById(exhibit.id, {specs: $scope.exForm.exSpecs.split(', ')})
      .then(updatingSpecs => {
        $scope.exhibit.specs = $scope.exForm.exSpecs;
        $scope.exForm.exSpecs = "";
      })
    }
  }
  
})