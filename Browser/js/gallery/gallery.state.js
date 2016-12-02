app.config( $stateProvider => {
  $stateProvider.state('gallery', {
    url: '/gallery/:projId',
    controller: 'GalleryCtrl',
    templateUrl: 'js/gallery/gallery.html',
    resolve: {
      exhibits: function($stateParams, exhibitFactory){
        return exhibitFactory.getAllByProjectId($stateParams.projId);
      },
      project: function($stateParams, projectFactory){
        return projectFactory.findById($stateParams.projId);
      }
    }
  })
})