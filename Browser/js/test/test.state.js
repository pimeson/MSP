app.config( $stateProvider => {
  $stateProvider.state('test', {
    url: '/test',
    controller: 'testCtrl',
    templateUrl: 'js/test/test.html'
  })
})