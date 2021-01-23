module.exports = function (app) {

  app.config($stateProvider => {
    $stateProvider.state('gallery', {
      url: '/project/:projId',
      controller: 'GalleryCtrl',
      templateUrl: 'js/gallery/gallery.html',
      resolve: {
        exhibits: function ($stateParams, exhibitFactory) {
          return exhibitFactory.findAllByProjectId($stateParams.projId);
        },
        project: function ($stateParams, projectFactory) {
          return projectFactory.findById($stateParams.projId);
        }
      }
    })
  })

}