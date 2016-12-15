app.controller('GalleryCtrl', function ($scope, project, exhibits, $state) {

    $scope.iframeHeight = $(window).height();
    $scope.selected = false;
    $scope.hideDesc = true;

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

    
    $scope.hoverSelect = (selection) => {
        selection.showTitle = true
        $scope.$evalAsync();
        console.log("hovering!")
        if(!$scope.selected) {
            $scope.selected = true
        }
        selection.selected = true;
    }

    $scope.hoverLeave = (selection) => {
        $scope.selected = false;
        selection.selected = false;
        selection.showTitle = false;
    }

    $scope.$watch($scope.selected, () => {
        if(!$scope.selected){
            console.log("NO LONGER BEING SELECTED!");
        }
    })

    $scope.backToHome = () => {
        $state.go('home');
    }

})

app.filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);