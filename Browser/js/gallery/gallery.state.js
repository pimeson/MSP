module.exports = function (app) {

  app.config($stateProvider => {
    var prettifiedTitle = $stateParams.projTitle ? $stateParams.projTitle.replaceAll('%20', '_') : ''
    $stateProvider.state('gallery', {
      url: `/project/${prettifiedTitle}`,
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