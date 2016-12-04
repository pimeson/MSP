app.config($stateProvider => {
  $stateProvider.state('admin', {
    url: '/admin',
    controller: 'adminCtrl',
    templateUrl: 'js/admin/admin.html'
    ,
    resolve: {
      projects: function(projectFactory) {
        return projectFactory.getAll();
      }
    }
  })
})

app.controller('adminCtrl', function($scope, projectFactory, projects, Upload, $state){

  $scope.projects = projects;

  $scope.getAll = () => {
    projectFactory.getAll()
    .then(projects => {
      $scope.projects = projects;
      $scope.$evalAsync();
    })
  }
  
  $scope.makeProject = (title, desc) =>{
    return projectFactory.makeProject(title, desc)
    .then(makingproject => {
      $scope.projTitle = '';
      $scope.projDesc = '';
      $scope.getAll();
    })
  };

  $scope.uploadAboutHtml = (file) => {
    Upload.upload({
      url: 'http://localhost:1337/api/about/aboutHtml',
      data: {
        file: file
      }
    }).then( (res) => {
      alert("Updated new about page!");
    })
  }

  $scope.submitAboutPage = () => {
    if ($scope.form.file.$valid && $scope.file) {
      $scope.uploadAboutHtml($scope.file)
    }
  };

})
