app.config($stateProvider => {
  $stateProvider.state('about', {
    url: '/about',
    controller: 'AboutCtrl',
    templateUrl: 'js/about/about.html'
  })
})