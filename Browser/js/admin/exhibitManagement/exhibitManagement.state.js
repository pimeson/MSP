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

app.controller('exhibitManagementCtrl', function($state, $scope, exhibit, exhibitFactory, $stateParams, Upload){

  $scope.exhibit = exhibit[0];
  $scope.projId = $stateParams.projId;

  $scope.exForm = {};

  $scope.deleteExhibit = () => {
    exhibitFactory.deleteById(exhibit[0].id)
    .then(success => $state.go('adminProject',{projectId: $stateParams.projId}));
  }

  $scope.editTitle = () => {
    $scope.$evalAsync();
    if($scope.exForm.exTitle){
      exhibitFactory.updateById(exhibit[0].id, {title: $scope.exForm.exTitle})
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
      exhibitFactory.updateById(exhibit[0].id, {description: $scope.exForm.exDesc})
      .then(updatingDesc => {
        $scope.exhibit.description = $scope.exForm.exDesc;
        $scope.exForm.exDesc = "";
      })
    }
  }

  $scope.editSpecs = () => {
    $scope.$evalAsync();
    if($scope.exForm.exSpecs){
      exhibitFactory.updateById(exhibit[0].id, {specs: $scope.exForm.exSpecs.split(', ')})
      .then(updatingSpecs => {
        $scope.exhibit.specs = $scope.exForm.exSpecs.split(', ');
        $scope.exForm.exSpecs = "";
      })
    }
  }

  $scope.addAltView = (file) => {
    Upload.upload({
      url: 'http://localhost:1337/api/exhibit/',
      data: {
        title: $scope.exTitle,
        file: file,
        projectId: $stateParams.projId,
        exhibitId: $stateParams.id,
        description: $scope.exDesc,
        dirName: project.dirName,
        specs: specs
      }
    }).then( res => {

    })
  }
  
})