module.exports = function (app) {
    app.controller('GalleryCtrl', function ($scope, project, exhibits, $state, $document, $window) {

        $scope.iframeHeight = $(window).height();
        $scope.iframeWidth = $(window).width();

        $scope.isLandscape = function () {
            return $(window).width() >= $(window).height();
        }
        $scope.selected = false;
        $scope.hideDesc = true;
        let scrollPos;

        $document.on('scroll', () => {
            $scope.$apply( () => {
                scrollPos = $window.scrollY;
                $scope.scrollY = scrollPos;
                console.log(scrollPos);
            })
        })

        $scope.toggleTitle = () => {
            $scope.hideDesc = !$scope.hideDesc;
            if (!$scope.isLandscape() && $scope.hideDesc) {
                    $('body').css({
                        overflow: '',
                        position: '',
                        top: ''
                    }).scrollTop($scope.scrollPosFixed);
            } else if (!$scope.isLandscape() && !$scope.hideDesc) {
                 console.log("I should be here!:", scrollPos)
                    $('body').css({
                        overflow: 'hidden',
                        position: 'fixed',
                        top: -scrollPos + 'px'
                    });
                    $scope.scrollPosFixed = scrollPos;
            }
            $scope.$evalAsync();
            console.log(scrollPos);
        }

        $scope.title = () => {
            if ($scope.hideDesc) {
                return project.title;
            } else {
                return "hide"
            }
        }

        $scope.project = project;
        $scope.description = project.description;
        console.log(exhibits);
        $scope.exhibits = exhibits
            .sort((x, y) => x.order > y.order ? 1 : -1)
            .map((exhibit) => {
                exhibit.description = _.chunk(exhibit.description, 3);
                if (exhibit.type === 'Video') {
                    exhibit.video = 'http://player.vimeo.com/video/' + exhibit.videoUrl.slice(exhibit.videoUrl.lastIndexOf('/') + 1)
                }
                return exhibit;
            })


        $scope.hoverSelect = (selection) => {
            selection.showDesc = true
            $scope.$evalAsync();
            if (!$scope.selected) {
                $scope.selected = true
            }
            selection.selected = true;
        }

        $scope.hoverLeave = (selection) => {
            $scope.selected = false;
            selection.selected = false;
            selection.showDesc = false;
        }

        $scope.backToHome = () => {
            $state.go('home');
        }


        $scope.goToDetails = (exhibit) => {
            if (project.detailsEnabled) {
                $state.go('details', {
                    projTitle: project.title,
                    projId: project.id,
                    exhibitId: exhibit.id
                })
            }
        }

    })

    app.filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        };
    }]);

};