app.config($stateProvider => {
  $stateProvider.state('adminProject', {
    url: '/admin/project/:projectId',
    templateUrl: '/js/admin/projectManagement/projectManagement.html',
    controller: 'projectMgmtCtrl',
    resolve: {
      exhibits: function ($stateParams, exhibitFactory) {
        return exhibitFactory.getAllByProjectId($stateParams.projectId);
      },
      project: function ($stateParams, projectFactory) {
        return projectFactory.findById($stateParams.projectId);
      }
    }
  })
})

app.controller('projectMgmtCtrl', function ($scope, Upload, projectFactory, $stateParams, exhibitFactory, exhibits, project, $state) {
  // upload on file select or drop

  $scope.exhibits = exhibits;
  $scope.project = project;
  $scope.projForm = {};

  $scope.upload = (file) => {
    Upload.upload({
      url: 'http://localhost:1337/api/exhibit/',
      data: {
        title: $scope.exTitle,
        file: file,
        projId: $stateParams.projectId,
        description: $scope.exDesc,
        dirName: project.dirName
      }
    }).then( (resp) => {
      /*sample config:
      { fieldname: 'file',
      originalname: 'tumblr_oe4cfyH9XA1qeh7fdo9_1280.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './public/uploads/',
      filename: 'file-1480376741574.jpg',
      path: 'public/uploads/file-1480376741574.jpg',
      size: 547530 }*/
      $scope.exTitle = "";
      $scope.exDesc = "";
      $scope.getGalleries();
      console.log('Success ' + resp.config.data + 'uploaded. Response: ' + resp.data);
    }, (resp) => {
      console.log('Error status: ' + resp.status);
    }, (evt) => {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
    });
  };


  $scope.submit = () => {
    if ($scope.form.file.$valid && $scope.file) {
      $scope.upload($scope.file)
    }
  };

  $scope.getGalleries = () => {
    exhibitFactory.getAllByProjectId($stateParams.projectId)
      .then(gettingExhibits => {
        $scope.exhibits = gettingExhibits;
        $scope.$evalAsync();
        console.log('gottem');
      })
  }

  $scope.editTitle = () => {
    if($scope.projForm.projectTitle){
    projectFactory.updateById($stateParams.projectId, {title: $scope.projForm.projectTitle})
    .then(() => {
      $scope.project.title = $scope.projForm.projectTitle;
      $scope.projForm.projectTitle = "";
    })
    } else {
      alert('No empty titles allowed.');
    }
  }

  $scope.editDescContent = () => {
    projectFactory.updateById($stateParams.projectId, {description: $scope.projForm.projectDesc})
    .then(() => {
      $scope.project.description = $scope.projForm.projectDesc;
      $scope.projForm.projectDesc = "";
    })
  }

  $scope.deleteExhibit = (id) => {
    exhibitFactory.deleteById(id)
    .then( (deletingExhibit) => $state.reload());
  }

  $scope.deleteProject = () => {
    let confirmation = window.prompt("Are you sure? Please enter the name of the project (" + project.title +") to confirm.");
    if (confirmation === project.title){
      projectFactory.deleteProject($stateParams.projectId)
      .then(deletedProject => $state.go('admin'));
    }
  }

})