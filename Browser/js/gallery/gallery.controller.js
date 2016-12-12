app.controller('GalleryCtrl', function ($scope, project, exhibits) {

    $scope.iframeHeight = $(window).height();

    $scope.project = project;
    $scope.description = project.description;
    console.log(exhibits);
    $scope.exhibits = exhibits
        .sort((x, y) => x.order > y.order ? 1 : -1)
        .map( (exhibit) => {
            if(exhibit.type === 'Video'){
                exhibit.video = 'http://player.vimeo.com/video/' +exhibit.videoUrl.slice(exhibit.videoUrl.lastIndexOf('/') + 1)
            }
            return exhibit;
        })
})

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);