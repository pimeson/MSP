app.controller('DetailsCtrl', function ($scope, $rootScope, exhibit, project, $state, $stateParams) {

  $scope.hover = false;
  $scope.collapsed = true;

  $scope.exhibit = exhibit[0];
  $scope.projDesc = project.description;

  $scope.projTitle = $stateParams.projTitle;

  $scope.altViews = exhibit[0].altViews

  $scope.backToGallery = () => $state.go('gallery',{projId: exhibit[0].projectId});

  $(document).ready(function () {
    $('#mainPicContainer').zoom({
      target: '#target'
    });
  })



})