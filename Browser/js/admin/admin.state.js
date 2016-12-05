app.config($stateProvider => {
  $stateProvider.state('admin', {
    url: '/admin',
    controller: 'adminCtrl',
    templateUrl: 'js/admin/admin.html',
    resolve: {
      projects: function (projectFactory) {
        return projectFactory.findAll();
      },
      downloads: function (fileFactory) {
        return fileFactory.findAllDownloads();
      }
    }
  })
})

app.controller('adminCtrl', function ($scope, projectFactory, projects, Upload, $state, downloads, fileFactory) {

  $scope.projects = projects;
  $scope.downloads = downloads;

  $scope.findAll = () => {
    projectFactory.findAll()
      .then(projects => {
        $scope.projects = projects;
        $scope.$evalAsync();
      })
  }

  $scope.makeProject = (title, desc) => {
    return projectFactory.makeProject(title, desc)
      .then(makingproject => {
        $scope.projTitle = '';
        $scope.projDesc = '';
        $scope.findAll();
      })
  };

  $scope.uploadAboutHtml = (file) => {
    Upload.upload({
      url: 'http://localhost:1337/api/about/aboutHtml',
      data: {
        file: file
      }
    }).then((res) => {
      alert("Updated new about page!");
    })
  }

  $scope.submitAboutPage = () => {
    if ($scope.form.file.$valid && $scope.file) {
      $scope.uploadAboutHtml($scope.file)
    }
  };

  $scope.uploadPortrait = (file) => {
    Upload.upload({
      url: 'http://localhost:1337/api/about/aboutPortrait',
      data: {
        file: file
      }
    }).then((res) => {
      alert("Updated new portrait!");
      $state.reload();
    })
  }

  $scope.newDownload = (file) => {
    $scope.$evalAsync();
    if ($scope.dlTitle) {
      Upload.upload({
        url: 'http://localhost:1337/api/about/upload',
        data: {
          file: file,
          title: $scope.dlTitle
        }
      }).then((res) => {
        $state.reload();
      })
    } else {
      alert('No empty title names allowed.')
    }
  }

  $scope.deleteDl = (id) => {
    fileFactory.deleteDlById(id)
      .then(deletingFile => $state.reload())
  }

})