app.controller('GalleryCtrl', function($scope, project, exhibits){

    $scope.project = project;
    $scope.exhibits = exhibits.sort((x, y) => x.order > y.order ? 1 : -1);

})