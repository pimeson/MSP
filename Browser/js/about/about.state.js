app.config($stateProvider => {
  $stateProvider.state('about', {
    url: '/about',
    controller: 'AboutCtrl',
    templateUrl: '/about/about.html'
  })
})