module.exports = function(app) {
app.config($stateProvider => {
  $stateProvider.state('adminProject', {
    url: '/admin/project/:projectId',
    templateUrl: '/js/projectManagement/projectManagement.html',
    controller: 'projectMgmtCtrl',
    data: {
      authenticate: true
    },
    resolve: {
      exhibits: function ($stateParams, exhibitFactory) {
        return exhibitFactory.findAllByProjectId($stateParams.projectId);
      },
      project: function ($stateParams, projectFactory) {
        return projectFactory.findById($stateParams.projectId);
      }
    }
  })
})

app.controller('projectMgmtCtrl', function ($scope, Upload, projectFactory, $stateParams, exhibitFactory, exhibits, project, $state) {
  // upload on file select or drop
  $scope.exhibits = exhibits.sort((x, y) => x.order > y.order ? 1 : -1);

  $scope.project = project;
  $scope.projForm = {};
  $scope.exForm = {};

  $scope.upload = (file) => {
    $scope.$evalAsync();
    if (!file) return;
    let specs;
    if ($scope.exForm.exSpecs) {
      specs = $scope.exForm.exSpecs.split('\n')
    } else {
      specs = [];
    }
    if ($scope.exForm.exDesc) {
      exDesc = $scope.exForm.exDesc.split('\n')
    } else {
      exDesc = [];
    }
    Upload.upload({
      url: 'http://localhost:1337/api/exhibit/',
      data: {
        type: 'Picture',
        file: file,
        projId: $stateParams.projectId,
        description: exDesc,
        dirName: project.dirName,
        specs: specs
      }
    }).then(resp => {
      /*sample config:
      { fieldname: 'file',
      originalname: 'tumblr_oe4cfyH9XA1qeh7fdo9_1280.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './public/uploads/',
      filename: 'file-1480376741574.jpg',
      path: 'public/uploads/file-1480376741574.jpg',
      size: 547530 }*/
      $scope.exForm = {};
      console.log('Success ' + resp.config.data + 'uploaded. Response: ' + resp.data);
      $state.reload();
    }, (resp) => {
      console.log('Error status: ' + resp.status);
    }, (evt) => {
      if (evt.config.data.file) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      }
    });
  };

  $scope.addVideo = () => {
    $scope.$evalAsync();
    console.log("I was clicked!")
      //if (!$scope.exForm.videoUrl) return;
    let specs;
    if ($scope.exForm.exSpecs && $scope.exForm.exSpecs.length) {
      specs = $scope.exForm.exSpecs.split('\n')
    } else {
      specs = [];
    }
    if ($scope.exForm.exDesc && $scope.exForm.exDesc.length) {
      desc = $scope.exForm.exDesc.split('\n')
    } else {
      desc = [];
    }
    let payload = {
      title: $scope.exForm.exTitle,
      type: 'Video',
      videoUrl: $scope.exForm.videoUrl,
      projectId: $stateParams.projectId,
      description: desc || [],
      specs: specs || []
    }
    exhibitFactory.makeVideo(payload)
      .then(res => {
        $state.reload();
      })
  }


  $scope.submit = () => {
    if ($scope.form.file.$valid && $scope.file) {
      $scope.upload($scope.file)
    }
  };

  $scope.getGalleries = () => {
    exhibitFactory.findAllByProjectId($stateParams.projectId)
      .then(gettingExhibits => {
        $scope.exhibits = gettingExhibits;
        $scope.$evalAsync();
        console.log('gottem');
      })
  }

  $scope.editTitle = () => {
    if ($scope.projForm.projectTitle) {
      projectFactory.updateById($stateParams.projectId, {
          title: $scope.projForm.projectTitle
        })
        .then(() => {
          $scope.project.title = $scope.projForm.projectTitle;
          $scope.projForm.projectTitle = "";
        })
    } else {
      alert('No empty titles allowed.');
    }
  }

  $scope.editDescContent = () => {
    projectFactory.updateById($stateParams.projectId, {
        description: $scope.projForm.projectDesc
      })
      .then(() => {
        $scope.project.description = $scope.projForm.projectDesc.split('\n');
        $scope.projForm.projectDesc = "";
      })
  }

  $scope.clearDescContent = () => {
    projectFactory.updateById($stateParams.projectId, {
        description: []
      })
      .then(() => {
        $scope.project.description = [];
        $scope.projForm.projectDesc = "";
      })
  }

  $scope.deleteExhibit = (id) => {
    exhibitFactory.deleteById(id)
      .then((deletingExhibit) => $state.reload());
  }

  $scope.deleteProject = () => {
    let confirmation = window.prompt("Are you sure? Please enter the name of the project (" + project.title + ") to confirm.");
    if (confirmation === project.title) {
      projectFactory.deleteProject(project.id)
        .then(deletedProject => $state.go('admin'));
    }
  }

  $scope.switch = (x, y) => {
    if (x <= $scope.exhibits.length && x > 0 && y <= $scope.exhibits.length && y > 0 && x !== y) {
      let firstSwitch = exhibitFactory.updateById($scope.exhibits[x - 1].id, {
        order: y
      });
      let secondSwitch = exhibitFactory.updateById($scope.exhibits[y - 1].id, {
        order: x
      });
      Promise.all(firstSwitch, secondSwitch)
        .then(switched => $state.reload());
    }
  }

  $scope.switchPicPos = (x, y) => {
    if (x <= $scope.exhibits.length && x > 0 && y <= $scope.exhibits.length && y > 0 && x !== y) {
      exhibitFactory.updateOrderById($scope.exhibits[x - 1].id, $stateParams.projectId, x, y)
        .then(() => $state.reload());
    } else {
      alert('invalid inputs!')
    }
  }

  $scope.toggleVisibility = () => {
    projectFactory.updateById($scope.project.id, {
        display: !project.display
      })
      .then(() => $state.reload());
  }

  $scope.toggleDetails = () => {
    console.log(project.detailsEnabled)
    projectFactory.updateById($scope.project.id, {
        detailsEnabled: !project.detailsEnabled
      })
      .then(() => $state.reload());
  }

})
}