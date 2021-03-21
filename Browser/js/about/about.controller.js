const about = require(".");

module.exports = function (app) {

  app.controller('AboutCtrl', function ($scope, downloads, links) {

    $scope.isLandscape = function () {
      return $(window).width() >= $(window).height();
    }

    $scope.downloads = downloads;
    $scope.links = links.sort((a, b) => new Date(a.date) > new Date(b.date) ? 1 : -1)

    $scope.activeLink = null

    $scope.setActiveLink = (id) => {
      if ($scope.activeLink === id) {
        $scope.activeLink = null
      } else {
        $scope.activeLink = id
      }
    }

    console.log({ links })

  })

};