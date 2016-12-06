app.config($stateProvider => {
  $stateProvider.state('details', {
    url: '/details/:projTitle/:projId/:exhibitId',
    controller: 'DetailsCtrl',
    templateUrl: 'js/details/details.html',
    resolve: {
      exhibit: function($stateParams, exhibitFactory){
        return exhibitFactory.findById($stateParams.exhibitId);
      },
      project: function($stateParams, projectFactory){
        return projectFactory.findById($stateParams.projId);
      }
    },
    onEnter: function () {
      //i hide header tabs, you can add your code here
      console.log('enter click');
      $('#mainPicContainer').zoom({
        target: '#target'
      });
    }
  })
  .state('details.alt', {
    templateUrl: 'js/details/details.alt.html'
  })
})