module.exports = function (app) {
  app.config($stateProvider => {
    $stateProvider.state('details', {
      url: '/details/:projTitle/:exhibitId',
      controller: 'DetailsCtrl',
      templateUrl: 'js/details/details.html',
      resolve: {
        exhibit: function ($stateParams, exhibitFactory) {
          return exhibitFactory.findById($stateParams.exhibitId);
        },
        project: function ($stateParams, projectFactory) {
          return projectFactory.findByName($stateParams.projTitle.replaceAll("_", " "));
        }
      }
    })
      .state('details.alt', {
        templateUrl: 'js/details/details.alt.html'
      })
  })
}