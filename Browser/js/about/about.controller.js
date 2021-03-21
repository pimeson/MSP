const about = require(".");

module.exports = function (app) {

  app.controller('AboutCtrl', function ($scope, downloads, links) {

    $scope.isLandscape = function () {
      return $(window).width() >= $(window).height();
    }

    $scope.downloads = downloads;
    $scope.links = links.filter(l => l.display).sort((l1, l2) => l2 - l1)

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