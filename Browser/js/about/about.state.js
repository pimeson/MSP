app.config($stateProvider => {
  $stateProvider.state('about', {
    url: '/about',
    controller: 'AboutCtrl',
    templateUrl: '/about/about.html',
    resolve: {
      downloads: function(fileFactory){
        return fileFactory.findAllDownloads();
      }
    }
  })
})