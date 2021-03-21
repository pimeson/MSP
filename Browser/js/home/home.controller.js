module.exports = function (app) {
  app.controller('homeCtrl', function ($scope, $state, $rootScope, allProjects) {

    //get initial frame height from window obj to scale widths appropriately
    let iframeHeight = $(window).height();
    let iframeWidth = $(window).width();
    $scope.iframeWidth = iframeWidth;
    $scope.iframeHeight = iframeHeight;

    $scope.isFF = 'MozAppearance' in document.documentElement.style;
    $scope.isChrome = window.chrome;
    let chrome = navigator.userAgent.indexOf('Chrome') > -1;
    $scope.isSafari = navigator.userAgent.indexOf("Safari") > -1;
    if ((chrome) && ($scope.isSafari)) $scope.isSafari = false;

    $scope.isLandscape = function () {
      return $(window).width() >= $(window).height();
    }

    allProjects = allProjects
      .filter(x => x.display)

    allProjects
      .sort((x, y) => x.order > y.order ? 1 : -1)
      .map(project => {
        //sort by order
        project.exhibits.sort((a, b) => a.order > b.order ? 1 : -1);
        project.width = project.exhibits[0] && iframeHeight * (project.exhibits[0].width / project.exhibits[0].height) * .875;
        project.height = project.exhibits[0] && iframeWidth * .68 * (project.exhibits[0].height / project.exhibits[0].width);
        project.num = 0;
        project.count = 0;
        project.currImage = project.exhibits[0] && project.exhibits[0].thumbnail;
        return project;
      })

    $scope.allProjects = allProjects;

    $rootScope.$state = $state;

    $scope.incrementer = (project, maxNum) => {
      project.count++;
      if (project.count >= 25) {
        if (project.num < maxNum) {
          project.num += 1;
        } else {
          project.num = 0;
        }
        project.count = 0;
        $scope.$evalAsync();
      }
    };

    $scope.changeImage = (num, project) => {
      project.exhibits[num].type === 'Picture' ? project.currImage = project.exhibits[num].thumbnail : project.currImage = project.exhibits[num].imageSrc;
      $scope.$evalAsync();
    }

  })
}