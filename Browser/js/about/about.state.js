module.exports = function (app) {
  app.config($stateProvider => {
    $stateProvider.state('about', {
      url: '/about',
      controller: 'AboutCtrl',
      templateUrl: '/js/about/about.html',
      resolve: {
        downloads: function (fileFactory) {
          return fileFactory.findAllDownloads();
        },
        links: (linkFactory) => {
          return linkFactory.findAllLinks();
        }
      }
    })
  })
}