app.config( $stateProvider => {
  $stateProvider.state('home', {
    url: '/',
    controller: 'homeCtrl',
    templateUrl: 'js/home/home.html',
    resolve: {
      allProjects: function(projectFactory){
        return projectFactory.getAllWithExhibits()
      }
    }
  })
})