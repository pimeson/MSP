app.controller('homeCtrl', function ($scope, $state, $rootScope, allProjects) {

  // $(document).ready(() => {
  //   $('.navTitle').clipthru({
  //     autoUpdate: true,
  //     autoUpdateInterval: 30,
  //     debug: true
  //   })
  // })

  //get initial frame height from window obj to scale widths appropriately
  let iframeHeight = $(window).height();
  let iframeWidth = $(window).width();

  $scope.isLandscape = function () {
    return $(window).width() >= $(window).height();
  }

  allProjects
    .sort((x, y) => x.order > y.order ? 1 : -1)
    .map(project => {
      //sort by order
      project.exhibits.sort((a, b) => a.order > b.order ? 1 : -1);
      project.width = project.exhibits[0] && iframeHeight * (project.exhibits[0].width / project.exhibits[0].height) * .81;
      project.num = 0;
      project.count = 0;
      return project;
    })

  $scope.allProjects = allProjects;

  $rootScope.$state = $state;

  $scope.incrementer = (project, maxNum) => {
    console.log(project.count);
    project.count++;
    if (project.count >= 10) {
      if (project.num < maxNum) {
        project.num += 1;
      } else {
        project.num = 0;
      }
      project.count = 0;
      $scope.$evalAsync();
    }
  };

  // $scope.swipeLeftDecrement = (project, maxNum) => {
  //   if (project.num > 0) {
  //     project.num -= 1;
  //   } else {
  //     project.num = maxNum - 1;
  //   }
  //   $scope.$evalAsync();
  // }

  // $scope.swipeRightIncrement = (project, maxNum) => {
  //   if (project.num < maxNum - 1) {
  //     project.num += 1;
  //   } else {
  //     project.num = 0;
  //   }
  //   $scope.$evalAsync();
  // }

  let loaded = false;
  
})