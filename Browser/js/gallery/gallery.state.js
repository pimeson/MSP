module.exports = function (app) {

  app.config($stateProvider => {
    $stateProvider.state('gallery', {
      url: '/project/:projTitle',
      controller: 'GalleryCtrl',
      templateUrl: 'js/gallery/gallery.html',
      resolve: {
        exhibits: function ($stateParams, exhibitFactory) {
          const newProjectTitle = $stateParams.projTitle.replaceAll("_", " ")
          return exhibitFactory.findAllByProjectName(newProjectTitle);
        },
        project: function ($stateParams, projectFactory) {
          const newProjectTitle = $stateParams.projTitle.replaceAll("_", " ")
          return projectFactory.findByName(newProjectTitle);
        }
      }
    })
  })

}