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

app.controller('adminCtrl', function($scope, projectFactory, projects){

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
})
