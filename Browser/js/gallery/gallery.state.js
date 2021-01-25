module.exports = function (app) {

  app.config($stateProvider => {
    $stateProvider.state('gallery', {
      url: '/project/:projTitle',
      controller: 'GalleryCtrl',
      templateUrl: 'js/gallery/gallery.html',
      resolve: {
        exhibits: function ($stateParams, exhibitFactory) {
          return exhibitFactory.findAllByProjectName($stateParams.projTitle);
        },
        project: function ($stateParams, projectFactory) {
          console.log($stateParams)
          return projectFactory.findByName($stateParams.projTitle);
        }
      }
    })
  })

}