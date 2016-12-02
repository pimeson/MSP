app.controller('DetailsCtrl', function ($scope, $rootScope, exhibit, project, $state, $stateParams) {

  $scope.hover = false;
  $scope.collapsed = true;

  $scope.exhibit = exhibit;
  $scope.projDesc = project.description;

  $scope.projTitle = $stateParams.projTitle;

  $scope.backToGallery = () => $state.go('gallery',{projId: exhibit.projectId});

  $(document).ready(function () {
    $('#mainPicContainer').zoom({
      target: '#target'
    });
  })



})