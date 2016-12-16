app.config($stateProvider => {

  $stateProvider.state('exhibitManagement', {
    url: '/admin/exhibitManagement/:projId/:id',
    templateUrl: '/js/admin/exhibitManagement/exhibitManagement.html',
    controller: 'exhibitManagementCtrl',
    data: {
            authenticate: true
    },
    resolve: {
      exhibit: function($stateParams, exhibitFactory){
        return exhibitFactory.findById($stateParams.id)
      },
      project: function($stateParams, projectFactory){
        return projectFactory.findById($stateParams.projId)
      }
    }
  })

})

app.controller('exhibitManagementCtrl', function($state, $scope, exhibit, exhibitFactory, $stateParams, Upload, project, altViewFactory){

  $scope.exhibit = exhibit[0];
  $scope.projId = $stateParams.projId;

  $scope.exForm = {};
  $scope.altForm = {};

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
      exhibitFactory.updateById(exhibit[0].id, {specs: $scope.exForm.exSpecs.split('\n')})
      .then(updatingSpecs => {
        $scope.exhibit.specs = $scope.exForm.exSpecs.split('\n');
        $scope.exForm.exSpecs = "";
      })
    }
  }

  $scope.addAltView = (file) => {
    $scope.$evalAsync();
    console.log("WHAT?")
    Upload.upload({
      url: 'http://localhost:1337/api/altview/',
      data: {
        title: $scope.altForm.title,
        file: file,
        projectId: $stateParams.projId,
        exhibitId: $stateParams.id,
        description: $scope.altForm.desc,
        type: $scope.altForm.type,
        dirName: project.dirName
      }
    }).then( res => {
      $state.reload();
    })
  }

  $scope.addAltVideo = () => {
    altViewFactory.makeVideo({
      title: $scope.altForm.title,
      type: 'Video',
      projectId: $stateParams.projId,
      exhibitId: $stateParams.id,
      videoUrl: $scope.altForm.videoUrl
    })
    .then( res => {
      $state.reload();
    })
  }

  $scope.deleteAltView = (index) => {
    console.log(index);
    altViewFactory.deleteById(index)
    .then(deleting => {
      $state.reload();
    })
  }
  
})